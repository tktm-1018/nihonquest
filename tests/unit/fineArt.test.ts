import { describe, expect, it } from 'vitest';
import { FINE, finePixels } from '../../src/rendering/battle/fine';

// リトルエンディアンの RGBA（0 は 透明）
const INK = 0xff281419; // 暗い 輪郭
const RED = 0xff4d48e5; // 明るい 中身
const _ = 0;

const grid = (rows: number[][]) => ({
  px: Uint32Array.from(rows.flat()),
  w: rows[0]!.length,
  h: rows.length,
});
const at = (out: Uint32Array, w: number, x: number, y: number) => out[y * w * FINE + x]!;

describe('バトルの 絵を 2 倍の こまかさに する', () => {
  it('大きさは 2 倍。べた塗りは そのまま 2×2 に なる', () => {
    const { px, w, h } = grid([
      [RED, RED],
      [RED, RED],
    ]);
    const out = finePixels(px, w, h);
    expect(out.length).toBe(w * FINE * h * FINE);
    expect([...out].every((c) => c === RED)).toBe(true);
  });

  it('ななめの 段々は Scale2x で なめらかに なる', () => {
    const { px, w, h } = grid([
      [RED, _],
      [_, RED],
    ]);
    const out = finePixels(px, w, h);
    // 左上の 赤の 右下の こまは、右と 下が 同じ 透明なので 透明に 欠ける
    expect(at(out, w, 1, 1)).toBe(0);
    expect(at(out, w, 0, 0)).toBe(RED);
  });

  it('外がわの 暗い 輪郭は 内がわ 半分が 中身の 色に なって ほそく なる', () => {
    const { px, w, h } = grid([
      [_, _, _, _, _],
      [_, INK, INK, INK, _],
      [_, INK, RED, INK, _],
      [_, INK, INK, INK, _],
      [_, _, _, _, _],
    ]);
    const out = finePixels(px, w, h);
    // 左の 輪郭（x=1, y=2）：外がわ（左）の こまは 輪郭、内がわ（右）の こまは 中身
    expect(at(out, w, 2, 4)).toBe(INK);
    expect(at(out, w, 3, 4)).toBe(RED);
    expect(at(out, w, 3, 5)).toBe(RED);
    // 中身は そのまま
    expect(at(out, w, 4, 4)).toBe(RED);
  });

  it('明るい ふち（ハイライト）は けずらない', () => {
    const { px, w, h } = grid([
      [_, _, _],
      [_, RED, INK],
      [_, _, _],
    ]);
    const out = finePixels(px, w, h);
    expect(at(out, w, 3, 2)).toBe(RED);
  });

  it('スプライトシートは コマの 外の 色を まぜない', () => {
    // 2 コマ（1×1 ずつ）。となりの コマの 色に そまらない
    const { px, w, h } = grid([[RED, INK]]);
    const out = finePixels(px, w, h, 1, 1);
    expect([out[0], out[1], out[4], out[5]]).toEqual([RED, RED, RED, RED]);
    expect([out[2], out[3], out[6], out[7]]).toEqual([INK, INK, INK, INK]);
  });
});
