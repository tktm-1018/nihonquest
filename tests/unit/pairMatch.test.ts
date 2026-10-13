// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'preact/test-utils';
import type { QuestionResult } from '../../src/questions/contracts';
import { pairMatchRenderer } from '../../src/questions/renderers/pair-match';
import { pairMatchPayloadSchema, pairMatchScore } from '../../src/questions/renderers/pair-match/schema';
import { setDictionary } from '../../src/ui/i18n';

const payload = (faceDown: boolean) => ({
  prompt: 'あわせよう',
  pairs: [
    { a: { text: 'A' }, b: { text: 'a' } },
    { a: { text: 'B' }, b: { text: 'b' } },
  ],
  faceDown,
});

describe('pair-match schema', () => {
  it('ミス回数で減点し、ペア数の2倍で0になる', () => {
    expect(pairMatchScore(0, 3)).toBe(1);
    expect(pairMatchScore(3, 3)).toBeCloseTo(0.5);
    expect(pairMatchScore(9, 3)).toBe(0);
  });
  it('faceDown は省略すると true', () =>
    expect(pairMatchPayloadSchema.parse({ ...payload(true), faceDown: undefined }).faceDown).toBe(true));
  it('文字も絵もない面と 1ペアだけの問題を拒否する', () => {
    expect(() =>
      pairMatchPayloadSchema.parse({
        prompt: 'p',
        pairs: [{ a: {}, b: { text: 'x' } }, payload(true).pairs[0]],
      }),
    ).toThrow();
    expect(() => pairMatchPayloadSchema.parse({ prompt: 'p', pairs: [payload(true).pairs[0]] })).toThrow();
  });
});

describe('pair-match renderer', () => {
  beforeEach(() => setDictionary({ question: { pairMatchBack: 'ふせてある カード' } }));
  afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  async function play(faceDown: boolean, picks: (cards: HTMLButtonElement[]) => HTMLButtonElement[][]) {
    vi.useFakeTimers();
    const container = document.createElement('div');
    document.body.append(container);
    let result!: Promise<QuestionResult>;
    act(() => {
      result = pairMatchRenderer.mount({
        container,
        question: {
          id: 'shakai.g3.test.0001',
          type: 'pair-match',
          subject: 'shakai',
          grade: 3,
          unit: 'shakai.g3.test',
          payload: payload(faceDown),
        },
        grade: 3,
        assets: { image: (path) => path, audio: (path) => path },
        speak: () => undefined,
        timeLimitMs: 60_000,
      });
    });
    const cards = [...container.querySelectorAll<HTMLButtonElement>('.nq-pm-card')];
    for (const turn of picks(cards))
      for (const card of turn)
        await act(async () => {
          card.click();
          await vi.advanceTimersByTimeAsync(900);
        });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000);
    });
    return result;
  }

  it('見えたままの ときは 正しく あわせると 1.0', async () => {
    const res = await play(false, (cards) => {
      const byText = (s: string) => cards.find((c) => c.textContent === s)!;
      return [
        [byText('A'), byText('a')],
        [byText('B'), byText('b')],
      ];
    });
    expect(res).toMatchObject({ score: 1, attempts: 2, timedOut: false, detail: { misses: 0 } });
  });

  it('まちがえると ミスとして 減点される', async () => {
    const res = await play(false, (cards) => {
      const byText = (s: string) => cards.find((c) => c.textContent === s)!;
      return [
        [byText('A'), byText('b')],
        [byText('A'), byText('a')],
        [byText('B'), byText('b')],
      ];
    });
    expect(res).toMatchObject({ score: 0.75, attempts: 3, detail: { misses: 1 } });
  });

  it('ふせた カードは 中身を 見せず、めくると 表になる', async () => {
    vi.useFakeTimers();
    const container = document.createElement('div');
    document.body.append(container);
    act(() => {
      void pairMatchRenderer.mount({
        container,
        question: {
          id: 'shakai.g3.test.0002',
          type: 'pair-match',
          subject: 'shakai',
          grade: 3,
          unit: 'shakai.g3.test',
          payload: payload(true),
        },
        grade: 3,
        assets: { image: (path) => path, audio: (path) => path },
        speak: () => undefined,
        timeLimitMs: 60_000,
      });
    });
    const cards = [...container.querySelectorAll<HTMLButtonElement>('.nq-pm-card')];
    expect(cards).toHaveLength(4);
    expect(cards.every((c) => c.textContent === '？')).toBe(true);
    act(() => cards[0]!.click());
    expect(cards[0]!.textContent).not.toBe('？');
  });
});
