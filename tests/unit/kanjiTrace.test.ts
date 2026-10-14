// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'preact/test-utils';
import type { QuestionResult } from '../../src/questions/contracts';
import { kanjiTraceRenderer } from '../../src/questions/renderers/kanji-trace';
import {
  kanjiTracePayloadSchema,
  rasterizeStrokes,
  traceMatch,
  traceScore,
} from '../../src/questions/renderers/kanji-trace/schema';
import { getRenderer } from '../../src/questions/renderers/registry';
import { setDictionary } from '../../src/ui/i18n';

/** 「山」を まねた 3本の 線（0〜1 の 座標） */
const yama = [
  [
    { x: 0.5, y: 0.1 },
    { x: 0.5, y: 0.85 },
  ],
  [
    { x: 0.2, y: 0.35 },
    { x: 0.2, y: 0.85 },
    { x: 0.8, y: 0.85 },
  ],
  [
    { x: 0.8, y: 0.35 },
    { x: 0.8, y: 0.85 },
  ],
];

describe('kanji-trace の 採点', () => {
  const guide = rasterizeStrokes(yama, undefined, 2);
  const score = (strokes: typeof yama) => traceScore(traceMatch(guide, rasterizeStrokes(strokes)).match);

  it('お手本どおりなら 満点、少し ずれても 満点', () => {
    expect(score(yama)).toBe(1);
    expect(score(yama.map((s) => s.map((p) => ({ x: p.x + 0.03, y: p.y - 0.02 }))))).toBe(1);
  });

  it('ぬりつぶし・一部だけ・関係ない 線は 点が のびない', () => {
    const fill = Array.from({ length: 10 }, (_, i) => [
      { x: 0.05, y: 0.05 + i * 0.1 },
      { x: 0.95, y: 0.05 + i * 0.1 },
    ]);
    expect(traceMatch(guide, rasterizeStrokes(fill)).recall).toBe(1);
    expect(score(fill)).toBeLessThan(0.5);
    expect(score([yama[0]!])).toBeLessThan(0.5);
    expect(
      score([
        [
          { x: 0.05, y: 0.05 },
          { x: 0.3, y: 0.05 },
        ],
      ]),
    ).toBe(0);
  });

  it('合い具合 0.7 以上で 満点、0.3 以下で 0、あいだは 線形', () => {
    expect(traceScore(0.7)).toBe(1);
    expect(traceScore(0.5)).toBeCloseTo(0.5);
    expect(traceScore(0.3)).toBe(0);
    expect(traceMatch(new Uint8Array(4), new Uint8Array(4), 2).match).toBe(0);
  });
});

describe('kanji-trace の schema', () => {
  it('mode は 省略すると trace', () =>
    expect(kanjiTracePayloadSchema.parse({ kanji: '山', reading: 'やま' }).mode).toBe('trace'));
  it('reading は choices の 中に answer が ないと 拒否する', () => {
    expect(() =>
      kanjiTracePayloadSchema.parse({
        mode: 'reading',
        kanji: '山',
        reading: 'やま',
        choices: ['かわ', 'いし'],
      }),
    ).toThrow();
    expect(() =>
      kanjiTracePayloadSchema.parse({
        mode: 'reading',
        kanji: '山',
        reading: 'やま',
        choices: ['かわ', 'いし'],
        answer: 'やま',
      }),
    ).toThrow();
  });
  it('2文字以上の kanji を 拒否する', () =>
    expect(() => kanjiTracePayloadSchema.parse({ kanji: '山川', reading: 'やまかわ' })).toThrow());
  it('レジストリに 登録されている', () => expect(getRenderer('kanji-trace')).toBe(kanjiTraceRenderer));
});

describe('kanji-trace の レンダラー', () => {
  // jsdom には onpointer* が 無く、Preact が 大文字の まま 登録してしまうので 足しておく
  for (const name of ['onpointerdown', 'onpointermove', 'onpointerup', 'onpointercancel', 'onpointerleave'])
    if (!(name in HTMLElement.prototype))
      Object.defineProperty(HTMLElement.prototype, name, { value: null, writable: true, configurable: true });
  beforeEach(() =>
    setDictionary({
      question: {
        speak: 'よみあげ',
        kanjiTracePrompt: 'なぞろう',
        kanjiTraceReadingPrompt: 'よみは？',
        kanjiTraceStrokes: '（{n}かく）',
        kanjiTraceCanvas: '{kanji}',
        kanjiTraceClear: 'けす',
        kanjiTraceDone: 'できた',
      },
    }),
  );
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  function mount(payload: unknown) {
    vi.useFakeTimers();
    const container = document.createElement('div');
    document.body.append(container);
    let result!: Promise<QuestionResult>;
    act(() => {
      result = kanjiTraceRenderer.mount({
        container,
        question: {
          id: 'kokugo.g1.test.0001',
          type: 'kanji-trace',
          subject: 'kokugo',
          grade: 1,
          unit: 'kokugo.g1.test',
          payload,
        },
        grade: 1,
        assets: { image: (path) => path, audio: (path) => path },
        speak: () => undefined,
        timeLimitMs: 60_000,
      });
    });
    return { container, result };
  }
  const settle = () =>
    act(async () => {
      await vi.advanceTimersByTimeAsync(1_000);
    });

  it('なにも 書くまでは「できた」を 押せず、書くと 押せる', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const { container, result } = mount({ kanji: '山', reading: 'やま', strokeCount: 3 });
    expect(container.textContent).toContain('（3かく）');
    const [clear, done] = [...container.querySelectorAll<HTMLButtonElement>('.nq-kt-actions button')];
    expect(done!.disabled).toBe(true);
    const canvas = container.querySelector('canvas')!;
    act(() => {
      canvas.dispatchEvent(new MouseEvent('pointerdown', { clientX: 5, clientY: 5, bubbles: true }));
      canvas.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
    });
    expect(done!.disabled).toBe(false);
    act(() => clear!.click());
    expect(done!.disabled).toBe(true);
    act(() => {
      canvas.dispatchEvent(new MouseEvent('pointerdown', { clientX: 5, clientY: 5, bubbles: true }));
    });
    act(() => done!.click());
    await settle();
    // canvas が 使えない 環境では 採点できないので、書いたことを 認める
    await expect(result).resolves.toMatchObject({ score: 1, attempts: 1, timedOut: false });
  });

  it('読みを えらぶ 問題は 正解で 1、ちがうと 0', async () => {
    const payload = {
      mode: 'reading',
      kanji: '石',
      reading: 'いし',
      choices: ['いし', 'いわ'],
      answer: 'いし',
    };
    const pick = async (text: string) => {
      const { container, result } = mount(payload);
      expect(container.querySelector('.nq-kt-big')?.textContent).toBe('石');
      const button = [...container.querySelectorAll<HTMLButtonElement>('.nq-choice')].find((b) =>
        b.textContent?.includes(text),
      )!;
      act(() => button.click());
      await settle();
      document.body.replaceChildren();
      return result;
    };
    await expect(pick('いし')).resolves.toMatchObject({ score: 1, detail: { chosen: 'いし' } });
    await expect(pick('いわ')).resolves.toMatchObject({ score: 0, detail: { chosen: 'いわ' } });
  });
});
