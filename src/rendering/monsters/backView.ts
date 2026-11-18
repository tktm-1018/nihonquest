/**
 * モンスターの うしろ姿（front の 戦闘で 主人公の となりに 立つ 仲間の 絵）。
 * 手描きの 絵は 正面だけなので、正面の 絵から 顔（目・口・ほお・内がわの 線）を けして、
 * まわりの 体の 色で うめる。シルエットと 色は そのままなので、同じ モンスターの せなかに 見える。
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
const BLUSH = hex(NQ.blush) >>> 0;

/** 顔を さがす 高さ（絵の 上から この わりあいまで）。足もとの 線は のこす */
const FACE_ZONE = 0.72;
/** これより 少ない 色は 目・ほお・歯などの 顔の 色と みなす（不透明の ドットに しめる わりあい） */
const RARE = 0.04;
/** 目・口と みなす 黒い かたまりの 大きさの 上限（不透明の ドットに しめる わりあい） */
const BLOB = 0.025;

export function monsterBackArt(src: HTMLCanvasElement): HTMLCanvasElement {
  const w = src.width;
  const h = src.height;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d')!;
  ctx.drawImage(src, 0, 0);
  const img = ctx.getImageData(0, 0, w, h);
  const px = new Uint32Array(img.data.buffer);
  backPixels(px, w, h);
  ctx.putImageData(img, 0, 0);
  return out;
}

/** px（透明は アルファ 0）を その場で うしろ姿に する */
export function backPixels(px: Uint32Array, w: number, h: number): void {
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : px[y * w + x]! >>> 0);
  const opaque = (c: number) => c >>> 24 !== 0;
  let top = h;
  let bottom = -1;
  let total = 0;
  const count = new Map<number, number>();
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const c = at(x, y);
      if (!opaque(c)) continue;
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
      total++;
      count.set(c, (count.get(c) ?? 0) + 1);
    }
  if (total === 0) return;
  const faceEnd = top + (bottom - top + 1) * FACE_ZONE;
  const N8 = [-1, 0, 1].flatMap((dy) => [-1, 0, 1].map((dx) => [dx, dy] as const)).filter(([a, b]) => a || b);
  /** まわり 8 マスが ぜんぶ 不透明（＝輪郭では ない） */
  const inside = (x: number, y: number) => N8.every(([dx, dy]) => opaque(at(x + dx, y + dy)));

  const marked = new Uint8Array(w * h);
  // 1) 顔の 高さに ある 内がわの 黒い 線（目・口）
  //    もようの 線（花・うろこの さかいめ）は つながって 大きいので のこし、小さな かたまりだけ けす
  const maxBlob = Math.max(6, total * BLOB);
  const seen = new Uint8Array(w * h);
  const faceInk = (x: number, y: number) =>
    y >= top && y < faceEnd && x >= 0 && x < w && isInk(at(x, y)) && inside(x, y);
  for (let y = top; y < faceEnd; y++)
    for (let x = 0; x < w; x++) {
      if (seen[y * w + x] || !faceInk(x, y)) continue;
      const blob: number[] = [];
      const stack = [y * w + x];
      seen[y * w + x] = 1;
      while (stack.length) {
        const i = stack.pop()!;
        blob.push(i);
        const bx = i % w;
        const by = (i - bx) / w;
        for (const [dx, dy] of N8) {
          const j = (by + dy) * w + bx + dx;
          if (!seen[j] && faceInk(bx + dx, by + dy)) {
            seen[j] = 1;
            stack.push(j);
          }
        }
      }
      if (blob.length <= maxBlob) for (const i of blob) marked[i] = 1;
    }
  // 2) その となりの めずらしい 色（白目・ほお・歯）
  for (let pass = 0; pass < 2; pass++) {
    const add: number[] = [];
    for (let y = top; y < faceEnd; y++)
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const c = at(x, y);
        if (marked[i] || !opaque(c) || isInk(c) || !inside(x, y)) continue;
        if ((count.get(c) ?? 0) / total >= RARE) continue;
        if (N8.some(([dx, dy]) => marked[(y + dy) * w + x + dx])) add.push(i);
      }
    for (const i of add) marked[i] = 1;
  }
  // 3) ほお（顔の 高さの、黒い 線に ふれない ほお色）
  for (let y = top; y < faceEnd; y++)
    for (let x = 0; x < w; x++)
      if (at(x, y) === BLUSH && inside(x, y) && !N8.some(([dx, dy]) => isInk(at(x + dx, y + dy))))
        marked[y * w + x] = 1;
  // 4) けした ところを まわりの 体の 色で うめる（外がわから じゅんに）
  for (let pass = 0; pass < 24; pass++) {
    const fill: [number, number][] = [];
    for (let i = 0; i < w * h; i++) {
      if (!marked[i]) continue;
      const x = i % w;
      const y = (i - x) / w;
      const votes = new Map<number, number>();
      for (const [dx, dy] of N8) {
        const j = (y + dy) * w + x + dx;
        const c = at(x + dx, y + dy);
        if (marked[j] || !opaque(c) || isInk(c)) continue;
        votes.set(c, (votes.get(c) ?? 0) + (dx && dy ? 1 : 2));
      }
      let best = 0;
      let bestN = 0;
      for (const [c, n] of votes) if (n > bestN) [best, bestN] = [c, n];
      if (bestN) fill.push([i, best]);
    }
    if (!fill.length) break;
    for (const [i, c] of fill) {
      px[i] = c;
      marked[i] = 0;
    }
  }
}
