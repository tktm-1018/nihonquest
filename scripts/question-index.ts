export type QuestionLocation = [fileIndex: number, questionIndex: number];

/** `?q=<id>` から必要な問題ファイルだけを取得するための生成時索引。 */
export function buildQuestionIndex(
  files: readonly string[],
  read: (file: string) => unknown,
): Record<string, QuestionLocation> {
  const index: Record<string, QuestionLocation> = {};
  files.forEach((file, fileIndex) => {
    const questions = read(file);
    if (!Array.isArray(questions)) return;
    questions.forEach((question, position) => {
      const id = (question as { id?: unknown })?.id;
      if (typeof id === 'string' && index[id] === undefined) index[id] = [fileIndex, position];
    });
  });
  return index;
}
