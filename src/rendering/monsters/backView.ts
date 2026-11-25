/**
 * モンスターの うしろ姿（front の 戦闘で 主人公の となりに 立つ 仲間の 絵）。
 * 手描きの 絵は 正面だけなので、正面の 絵から 作る。
 *  - 輪郭に ふれる もの（体・かぶりもの・手足・しっぽ・ふちまで ある 線）は シルエットなので のこす
 *  - 輪郭に ふれない 内がわの もの（目・口・ほお・おなかの もよう・ボタン）は 正面だけの もの なので、
 *    かこんでいる 色で うめる（外がわから じゅんに）
 * うしろから 見ると 顔も もようも 見えず、色の かたまりと シルエットだけに なる。
 */
import { NQ } from '../palette';

const hex = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  // リトルエンディアンの RGBA（ImageData を Uint32Array で 見た ときの 並び）
  return (0xff << 24) | ((n & 0xff) << 16) | (n & 0xff00) | ((n >> 16) & 0xff);
};
const INK = hex(NQ.ink) >>> 0;
const lum = (c: number) => (c & 255) * 0.3 + ((c >>> 8) & 255) * 0.59 + ((c >>> 16) & 255) * 0.11;
const isInk = (c: number) => c === INK || lum(c) < 48;

/**
 * これより 大きい 内がわの まとまりは 体の 一部と みなして のこす（不透明の ドットに しめる わりあい）。
 * 色は 目・口・もよう・ボタンの 大きさまで、黒い 線は 目・口の 大きさまで（体の 形を わける 線は のこす）
 */
const MAX_ISLAND = 0.06;
const MAX_INK_ISLAND = 0.04;

export function monsterBackArt(src: HTMLCanvasElement): HTMLCanvasElement {
  const w = src.width;
  const h = src.height;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d')!;
  ctx.drawImage(src, 0, 0);
  const img = ctx.getImageData(0, 0, w, h);
  backPixels(new Uint32Array(img.data.buffer), w, h);
  ctx.putImageData(img, 0, 0);
  return out;
}

const N4 = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

/** px（透明は アルファ 0）を その場で うしろ姿に する */
export function backPixels(px: Uint32Array, w: number, h: number): void {
  const n = w * h;
  const col = (i: number) => px[i]! >>> 0;
  const opaque = (i: number) => col(i) >>> 24 !== 0;
  const ink = (i: number) => isInk(col(i));
  const nb = (i: number, f: (j: number) => void) => {
    const x = i % w;
    const y = (i - x) / w;
    for (const [dx, dy] of N4) {
      const nx = x + dx;
      const ny = y + dy;
      f(nx >= 0 && ny >= 0 && nx < w && ny < h ? ny * w + nx : -1);
    }
  };
  let total = 0;
  for (let i = 0; i < n; i++) if (opaque(i)) total++;
  if (!total) return;

  // 同じ 色（黒い 線は 黒どうし）で つながる まとまり
  const region = new Int32Array(n).fill(-1);
  const members: number[][] = [];
  for (let i0 = 0; i0 < n; i0++) {
    if (!opaque(i0) || region[i0]! >= 0) continue;
    const id = members.length;
    const list: number[] = [];
    const key = ink(i0) ? -1 : col(i0);
    const st = [i0];
    region[i0] = id;
    while (st.length) {
      const i = st.pop()!;
      list.push(i);
      nb(i, (j) => {
        if (j < 0 || region[j]! >= 0 || !opaque(j)) return;
        if ((ink(j) ? -1 : col(j)) !== key) return;
        region[j] = id;
        st.push(j);
      });
    }
    members.push(list);
  }
  // 輪郭に ふれる まとまり（透明・キャンバスの はし・輪郭の 黒い 線の となり）は シルエット
  const outlineInk = (i: number) => {
    if (!ink(i)) return false;
    let edge = false;
    nb(i, (j) => {
      if (j < 0 || !opaque(j)) edge = true;
    });
    return edge;
  };
  const keep = members.map(
    (list) =>
      list.length > total * (ink(list[0]!) ? MAX_INK_ISLAND : MAX_ISLAND) ||
      list.some((i) => {
        let edge = outlineInk(i);
        nb(i, (j) => {
          if (j < 0 || !opaque(j) || outlineInk(j)) edge = true;
        });
        return edge;
      }),
  );
  // 内がわの まとまりを、となりの のこる 色（黒い 線は のぞく）で うめる。外がわから じゅんに
  for (let pass = 0; pass < 64; pass++) {
    const fill: [number, number][] = [];
    members.forEach((list, id) => {
      if (keep[id]) return;
      const votes = new Map<number, number>();
      for (const i of list)
        nb(i, (j) => {
          if (j < 0) return;
          const r = region[j]!;
          if (r < 0 || r === id || !keep[r] || ink(j)) return;
          votes.set(col(j), (votes.get(col(j)) ?? 0) + 1);
        });
      let best = 0;
      let bestN = 0;
      for (const [c, k] of votes) if (k > bestN) [best, bestN] = [c, k];
      if (bestN) fill.push([id, best]);
    });
    if (!fill.length) break;
    for (const [id, c] of fill) {
      for (const i of members[id]!) px[i] = c | 0;
      keep[id] = true;
    }
  }
}
