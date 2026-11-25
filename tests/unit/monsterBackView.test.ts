import { describe, expect, it } from 'vitest';
import { backPixels } from '../../src/rendering/monsters/backView';

const INK = 0xff28141a; // NQ.ink #1a1428（リトルエンディアンの RGBA）
const RED = 0xff0000ff;

/** 10×10：ふちが ink、中は 赤。目（ink 1 ドット）と、つながった 長い もようの 線 */
function face(): Uint32Array {
  const px = new Uint32Array(100);
  for (let y = 0; y < 10; y++)
    for (let x = 0; x < 10; x++) px[y * 10 + x] = x === 0 || y === 0 || x === 9 || y === 9 ? INK : RED;
  px[2 * 10 + 3] = INK;
  return px;
}

describe('仲間の うしろ姿', () => {
  it('顔の 目を けして 体の 色で うめ、輪郭は のこす', () => {
    const px = face();
    backPixels(px, 10, 10);
    expect(px[2 * 10 + 3]! >>> 0).toBe(RED >>> 0);
    expect(px[0]! >>> 0).toBe(INK >>> 0);
    expect(px[5 * 10 + 9]! >>> 0).toBe(INK >>> 0);
  });

  it('つながった 大きな もようの 線は けさない', () => {
    const px = face();
    for (let x = 1; x < 9; x++) px[4 * 10 + x] = INK;
    backPixels(px, 10, 10);
    expect(px[4 * 10 + 4]! >>> 0).toBe(INK >>> 0);
  });
});
