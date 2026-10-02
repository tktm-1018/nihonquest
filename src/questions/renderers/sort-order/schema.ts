import { z } from 'zod';

export const sortOrderCardSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).describe('カードの文（RubyText）'),
  image: z.string().min(1).optional(),
});

export const sortOrderPayloadSchema = z
  .object({
    prompt: z.string().min(1).describe('問題文（RubyText）'),
    direction: z.enum(['horizontal', 'vertical']).default('horizontal'),
    cards: z.array(sortOrderCardSchema).min(2).max(6),
    answer: z.array(z.string().min(1)).min(2).max(6),
  })
  .superRefine((payload, ctx) => {
    const ids = payload.cards.map((card) => card.id);
    if (new Set(ids).size !== ids.length)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cards'], message: 'カードの id は重複できません' });
    if (
      payload.answer.length !== ids.length ||
      new Set(payload.answer).size !== ids.length ||
      payload.answer.some((id) => !ids.includes(id))
    )
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['answer'],
        message: 'answer は全カードの id を1回ずつ並べてください',
      });
  });

export type SortOrderPayload = z.infer<typeof sortOrderPayloadSchema>;

/** 正しい位置に置けたカードの割合。 */
export function sortOrderScore(answer: readonly string[], order: readonly string[]): number {
  if (!answer.length || order.length !== answer.length) return 0;
  const correct = answer.reduce((count, id, index) => count + (order[index] === id ? 1 : 0), 0);
  return correct / answer.length;
}
