import { z } from 'zod';

const face = z
  .object({
    text: z.string().min(1).optional(),
    image: z.string().min(1).optional(),
  })
  .refine((value) => value.text || value.image, { message: 'text か image の どちらかが ひつようです' });

export const pairMatchPayloadSchema = z.object({
  prompt: z.string().min(1),
  pairs: z
    .array(z.object({ a: face, b: face }))
    .min(2)
    .max(6),
  /** true：神経衰弱（カードを ふせて 2まい めくる）。false：左右の れつで 見えたまま あわせる */
  faceDown: z.boolean().default(true),
});

export type PairMatchPayload = z.infer<typeof pairMatchPayloadSchema>;
export type PairFace = PairMatchPayload['pairs'][number]['a'];

/**
 * ミス回数で減点（GDD §5.2）。ペア数の 2 倍まちがえたら 0。
 * ふせた カードは さいしょ 当てずっぽうに なるので、ペアが 多いほど 1 回の ミスは 軽くする。
 */
export const pairMatchScore = (misses: number, pairs: number) => Math.max(0, 1 - misses / (pairs * 2));
