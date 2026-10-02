import { describe, expect, it } from 'vitest';
import { sortOrderPayloadSchema, sortOrderScore } from '../../src/questions/renderers/sort-order/schema';

const payload = {
  prompt: '古い じゅんに ならべよう',
  direction: 'horizontal',
  cards: [
    { id: 'jomon', text: '縄文[じょうもん]' },
    { id: 'kofun', text: '古墳[こふん]' },
    { id: 'nara', text: '奈良[なら]' },
  ],
  answer: ['jomon', 'kofun', 'nara'],
};

describe('sort-order', () => {
  it('正しいpayloadを受け入れる', () => {
    expect(sortOrderPayloadSchema.safeParse(payload).success).toBe(true);
  });

  it('answerの重複・不足・未知idを拒否する', () => {
    expect(sortOrderPayloadSchema.safeParse({ ...payload, answer: ['jomon', 'jomon', 'nara'] }).success).toBe(
      false,
    );
    expect(sortOrderPayloadSchema.safeParse({ ...payload, answer: ['jomon', 'kofun'] }).success).toBe(false);
    expect(sortOrderPayloadSchema.safeParse({ ...payload, answer: ['jomon', 'kofun', 'edo'] }).success).toBe(
      false,
    );
  });

  it('正しい位置の割合をscoreにする', () => {
    expect(sortOrderScore(payload.answer, payload.answer)).toBe(1);
    expect(sortOrderScore(payload.answer, ['jomon', 'nara', 'kofun'])).toBeCloseTo(1 / 3);
    expect(sortOrderScore(payload.answer, ['nara', 'jomon', 'kofun'])).toBe(0);
    expect(sortOrderScore(payload.answer, ['jomon'])).toBe(0);
  });
});
