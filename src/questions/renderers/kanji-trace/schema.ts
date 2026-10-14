import { z } from 'zod';

export const kanjiTracePayloadSchema = z
  .object({
    /** trace：お手本を なぞる。reading：読みを ひらがなの 選択肢から えらぶ */
    mode: z.enum(['trace', 'reading']).default('trace'),
    kanji: z.string().length(1).describe('1文字の漢字'),
    reading: z.string().min(1).describe('読み（ひらがな）'),
    hintWord: z.string().min(1).optional().describe('ことばの れい（RubyText）。例 "山[やま]"'),
    strokeCount: z.number().int().positive().optional().describe('画数。表示だけ（書き順は判定しない）'),
    guideImage: z.string().min(1).optional().describe('お手本の画像。省略時はフォントで描く'),
    choices: z.array(z.string().min(1)).min(2).max(6).optional().describe('reading のときの選択肢'),
    answer: z.string().min(1).optional().describe('reading のときの正解（choices のどれか）'),
  })
  .refine((p) => p.mode !== 'reading' || (p.choices && p.answer && p.choices.includes(p.answer)), {
    path: ['answer'],
    message: 'reading では choices と、その中にある answer が ひつようです',
  })
  .refine((p) => !p.choices || new Set(p.choices).size === p.choices.length, {
    path: ['choices'],
    message: 'choices が重複しています',
  });

export type KanjiTracePayload = z.infer<typeof kanjiTracePayloadSchema>;

/** なぞりの 採点に つかう ます目の 数（たて・よこ）。大きいほど きびしく、おそくなる */
export const TRACE_GRID = 48;
/** 合い具合が これ以上で 満点、TRACE_ZERO 以下で 0。あいだは 線形 */
export const TRACE_FULL = 0.7;
export const TRACE_ZERO = 0.3;

/** 0〜1 に 正規化した 点。左上が (0,0) */
export interface TracePoint {
  x: number;
  y: number;
}

/** 線（点の 列）を ます目に 太さ radius（ます目 単位）で 塗る */
export function rasterizeStrokes(strokes: TracePoint[][], grid = TRACE_GRID, radius = 2.5): Uint8Array {
  const mask = new Uint8Array(grid * grid);
  const stamp = (cx: number, cy: number) => {
    const r = Math.ceil(radius);
    for (let y = Math.floor(cy) - r; y <= Math.ceil(cy) + r; y++)
      for (let x = Math.floor(cx) - r; x <= Math.ceil(cx) + r; x++) {
        if (x < 0 || y < 0 || x >= grid || y >= grid) continue;
        if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= radius * radius) mask[y * grid + x] = 1;
      }
  };
  for (const stroke of strokes)
    stroke.forEach((p, i) => {
      const prev = stroke[i - 1] ?? p;
      const steps = Math.max(1, Math.ceil(Math.hypot(p.x - prev.x, p.y - prev.y) * grid * 2));
      for (let s = 0; s <= steps; s++) {
        const k = s / steps;
        stamp((prev.x + (p.x - prev.x) * k) * grid, (prev.y + (p.y - prev.y) * k) * grid);
      }
    });
  return mask;
}

/** 各ますを 上下左右ななめ に r ます 広げる（多少の ずれを ゆるす） */
export function dilate(mask: Uint8Array, grid = TRACE_GRID, r = 2): Uint8Array {
  const out = new Uint8Array(mask.length);
  for (let y = 0; y < grid; y++)
    for (let x = 0; x < grid; x++) {
      if (!mask[y * grid + x]) continue;
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < grid && ny < grid) out[ny * grid + nx] = 1;
        }
    }
  return out;
}

/** a のうち b に 入っている わりあい */
export function coverage(a: Uint8Array, b: Uint8Array): number {
  let inA = 0;
  let both = 0;
  for (let i = 0; i < a.length; i++)
    if (a[i]) {
      inA++;
      if (b[i]) both++;
    }
  return inA === 0 ? 0 : both / inA;
}

/**
 * なぞりの 合い具合 0〜1。お手本と 線の 太さが ちがっても 公平に なるよう、IoU ではなく
 * 「書いた線が お手本の 近くに あるか」と「お手本を どれだけ なぞったか」の 小さい ほうを とる。
 * ぬりつぶし（前者が 低い）も、一部だけ（後者が 低い）も 点が のびない。
 */
export function traceMatch(guide: Uint8Array, drawn: Uint8Array, grid = TRACE_GRID) {
  const precision = coverage(drawn, dilate(guide, grid));
  const recall = coverage(guide, dilate(drawn, grid));
  return { precision, recall, match: Math.min(precision, recall) };
}

export const traceScore = (match: number) =>
  Math.min(1, Math.max(0, (match - TRACE_ZERO) / (TRACE_FULL - TRACE_ZERO)));
