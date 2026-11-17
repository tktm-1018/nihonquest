import { describe, expect, it } from 'vitest';
import { maskReadingAnswerInPrompt } from '../../src/questions/renderers/shared/readingPrompt';

describe('漢字読み問題の問題文', () => {
  it('例の語にある答えのルビと文字を隠す', () => {
    expect(maskReadingAnswerInPrompt('「漢字[かんじ]」の「漢」の読[よ]み方[かた]は？')).toBe(
      '「・字」の「漢」の読[よ]み方[かた]は？',
    );
  });

  it('読み問題以外のルビはそのままにする', () => {
    expect(maskReadingAnswerInPrompt('「図書館[としょかん]」へ行[い]く。')).toBe('「図書館[としょかん]」へ行[い]く。');
  });
});
