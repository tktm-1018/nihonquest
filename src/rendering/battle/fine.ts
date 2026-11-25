/**
 * バトルの ドット絵を 2 倍の こまかさに する（1 ドット = 4px → 2px）。
 * 絵は いままでどおり 1 ドット = 1 マスで 描いて、ここで ドット絵用の 拡大（Scale2x）を かける。
 *   - Scale2x：ななめの 段々を なめらかに する（色は もとの 絵の 色だけ。にじまない）
 *   - 輪郭を ほそく：まわりが 透明な ふちの ドットは、内がわ 半分を となりの 色に して 1 マスの 太さに する
 * 拡大した テクスチャは Phaser で S / FINE 倍に して 表示する（大きさは いままでと 同じ）。
 */
export const FINE = 2;

/** ピクセル（リトルエンディアンの RGBA）の あかるさ */
const lum = (c: number) => (c & 255) * 0.3 + ((c >>> 8) & 255) * 0.59 + ((c >>> 16) & 255) * 0.11;

/**
 * RGBA を 1 つの 数に した ピクセル（透明は 0）を、コマごとに 2 倍に する。
 * コマの 外は 見ない（となりの コマの 色を まぜない）
 */
export function finePixels(px: Uint32Array, w: number, h: number, fw = w, fh = h): Uint32Array {
  const out = new Uint32Array(w * FINE * h * FINE);
  const ow = w * FINE;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const fx0 = x - (x % fw);
      const fy0 = y - (y % fh);
      const inFrame = (xx: number, yy: number) => xx >= fx0 && xx < fx0 + fw && yy >= fy0 && yy < fy0 + fh;
      const at = (xx: number, yy: number) => (inFrame(xx, yy) ? px[yy * w + xx]! : 0);
      const p = px[y * w + x]!;
      // Scale2x（コマの 外は 自分と 同じ 色と みなす）
      const near = (xx: number, yy: number) => (inFrame(xx, yy) ? px[yy * w + xx]! : p);
      const a = near(x, y - 1);
      const b = near(x + 1, y);
      const c = near(x - 1, y);
      const d = near(x, y + 1);
      const sub = [
        c === a && c !== d && a !== b ? a : p,
        a === b && a !== c && b !== d ? b : p,
        d === c && d !== b && c !== a ? c : p,
        b === d && b !== a && d !== c ? d : p,
      ];
      // 輪郭を ほそく：まわりが 透明な ふちの 暗い ドットで、内がわを 向いた 半分は 内がわの 色に
      // （ふちより 明るい 色だけで ぬる。ふちの ハイライトは けずらない）
      const edge =
        p !== 0 && (at(x, y - 1) === 0 || at(x + 1, y) === 0 || at(x - 1, y) === 0 || at(x, y + 1) === 0);
      if (edge)
        for (let k = 0; k < 4; k++) {
          const hx = at(k % 2 ? x + 1 : x - 1, y);
          const vy = at(x, k < 2 ? y - 1 : y + 1);
          if (hx === 0 || vy === 0) continue;
          const fill = [hx, vy].find((col) => col !== p && lum(col) > lum(p));
          if (fill !== undefined) sub[k] = fill;
        }
      const o = y * FINE * ow + x * FINE;
      out[o] = sub[0]!;
      out[o + 1] = sub[1]!;
      out[o + ow] = sub[2]!;
      out[o + ow + 1] = sub[3]!;
    }
  return out;
}

/** Canvas を 2 倍の こまかさに する（fw × fh の コマが ならんだ シートは コマごとに） */
export function fineCanvas(src: HTMLCanvasElement, fw = src.width, fh = src.height): HTMLCanvasElement {
  const { width: w, height: h } = src;
  const out = document.createElement('canvas');
  out.width = w * FINE;
  out.height = h * FINE;
  if (w === 0 || h === 0) return out;
  const data = src.getContext('2d')!.getImageData(0, 0, w, h);
  const px = new Uint32Array(data.data.buffer.slice(0));
  // 透明は 色を 問わず 0 に そろえる（同じ 透明として くらべる）
  for (let i = 0; i < px.length; i++) if ((data.data[i * 4 + 3] ?? 0) === 0) px[i] = 0;
  const fine = finePixels(px, w, h, fw, fh);
  const ctx = out.getContext('2d')!;
  const img = ctx.createImageData(w * FINE, h * FINE);
  img.data.set(new Uint8ClampedArray(fine.buffer));
  ctx.putImageData(img, 0, 0);
  return out;
}

/**
 * はじめから 2 倍の こまかさで 描いた 絵（64 / 80 / 96 / 112 ドット。もとの 規格は 32〜56）は そのまま、
 * それ いがいは fineCanvas で 2 倍に する
 */
export const asFine = (c: HTMLCanvasElement): HTMLCanvasElement => (c.width >= 64 ? c : fineCanvas(c));
