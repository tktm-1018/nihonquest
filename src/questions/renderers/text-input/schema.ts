import { z } from 'zod/v3';

export const textInputPayloadSchema = z.object({
  prompt: z.string().min(1),
  template: z.string().min(1).optional(),
  answers: z.array(z.union([z.string().min(1), z.array(z.string().min(1)).min(1).max(8)])).min(1).max(8),
  suffix: z.string().optional(),
  promptImage: z.string().optional(),
});
export type TextInputPayload = z.infer<typeof textInputPayloadSchema>;

export function normalizeInput(value: string): string {
  return value.normalize('NFKC').replace(/\s+/g, '').replace(/,/g, '');
}

function normalizeAnswer(value: string): string {
  return value.normalize('NFKC').replace(/\s+/g, '');
}

function normalizeInputForAnswer(value: string, answer: string): string {
  const normalized = normalizeAnswer(value);
  return answer.includes('、') ? normalized.replace(/,/g, '、') : normalized.replace(/,/g, '');
}

function answerVariants(answer: TextInputPayload['answers'][number]): string[] {
  return Array.isArray(answer) ? answer : [answer];
}

export function textInputScore(payload: TextInputPayload, values: string[]): number {
  if (values.length !== payload.answers.length) return 0;
  const correct = values.filter((value, index) => {
    return answerVariants(payload.answers[index]!).some((variant) => {
      const answer = normalizeAnswer(variant);
      return normalizeInputForAnswer(value, answer) === answer;
    });
  });
  return correct.length / payload.answers.length;
}
