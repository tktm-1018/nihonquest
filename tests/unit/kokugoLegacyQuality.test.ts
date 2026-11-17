import { describe, expect, it } from 'vitest';
import type { QuestionBase } from '../../src/questions/contracts';
import { questionIsLearningQualityQuarantined } from '../../src/questions/engine/questionQuality';

const legacy = (grade: 1 | 2, prompt: string, explanation = ''): QuestionBase => ({
  id: `kokugo.g${grade}.legacy.test`,
  type: 'choice',
  subject: 'kokugo',
  grade,
  unit: `kokugo.g${grade}.legacy-test`,
  tags: ['source:legacy-autonomy-game'],
  payload: { prompt, choices: [], answer: 'a' },
  explanation,
});

describe('低学年の旧国語問題', () => {
  it('単純な同一文字探しは新規出題しない', () => {
    expect(questionIsLearningQualityQuarantined(legacy(1, '「ウ」と同じ文字はどれ？'))).toBe(true);
  });

  it('文脈のない一字読みは新規出題しない', () => {
    expect(questionIsLearningQualityQuarantined(legacy(2, '「回」の読み方として正しいものは？'))).toBe(true);
  });

  it('低学年に不要な文法用語を含む旧問題は新規出題しない', () => {
    expect(questionIsLearningQualityQuarantined(legacy(1, '主語を表す助詞は？'))).toBe(true);
  });

  it('小3の旧ルビ読み問題は確認済みの漢字問題へ置き換える', () => {
    expect(questionIsLearningQualityQuarantined(legacy(2, '「漢字[かんじ]」の「漢」の読[よ]み方[かた]は？'))).toBe(false);
    const grade3 = { ...legacy(2, '「漢字[かんじ]」の「漢」の読[よ]み方[かた]は？'), grade: 3 as const };
    expect(questionIsLearningQualityQuarantined(grade3)).toBe(true);
  });

  it('文脈のある問題は残す', () => {
    expect(questionIsLearningQualityQuarantined(legacy(1, '「いぬ」の はじめの おとはどれ？'))).toBe(false);
  });
});
