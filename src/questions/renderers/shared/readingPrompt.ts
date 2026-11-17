import { stripRuby } from '../../../ui/ruby';

/**
 * 漢字の読みを問うとき、例の語に付いたルビが答えを先に見せないようにする。
 * 例: 「漢字[かんじ]」の「漢」の読み方 → 「・字」の「漢」の読み方
 */
export function maskReadingAnswerInPrompt(prompt: string): string {
  return prompt.replace(
    /「([^」]+)」の「([^」]+)」の読(?:\[[^\]]+\])?(?:み方|みかた)/u,
    (whole, clue: string, target: string) => {
      const masked = stripRuby(clue).replaceAll(target, '・'.repeat([...target].length));
      return whole.replace(`「${clue}」`, `「${masked}」`);
    },
  );
}
