import { describe, expect, it } from 'vitest';
import { normalizeInput, textInputScore } from '../../src/questions/renderers/text-input/schema';
describe('text-input', () => {
  it('全角数字・空白・桁区切りを正規化する', () => expect(normalizeInput(' ４２,１９５ ')).toBe('42195'));
  it('読点問題では全角・半角のカンマと空白を同じ入力として採点する', () =>
    expect(
      textInputScore(
        { prompt: '読点を入れましょう。', answers: ['わたしは、学校へ行きます。'] },
        [' わたしは, 学校へ行きます。 '],
      ),
    ).toBe(1));
  it('読点の位置が違う入力は不正解にする', () =>
    expect(
      textInputScore(
        { prompt: '読点を入れましょう。', answers: ['わたしは、学校へ行きます。'] },
        ['わたしは学校へ、行きます。'],
      ),
    ).toBe(0));
  it('ローマ字の別表記を同じ解答欄の正解として扱う', () => {
    const payload = { prompt: '「ち」をローマ字で書きましょう。', answers: [['ti', 'chi']] };
    expect(textInputScore(payload, ['ti'])).toBe(1);
    expect(textInputScore(payload, ['chi'])).toBe(1);
    expect(textInputScore(payload, ['si'])).toBe(0);
  });
  it('複数欄を部分点つきで採点する', () =>
    expect(textInputScore({ prompt: 'p', answers: ['4', '2'] }, ['4', '3'])).toBe(0.5));
});
