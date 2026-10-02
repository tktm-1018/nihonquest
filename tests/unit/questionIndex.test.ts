import { describe, expect, it } from 'vitest';
import { buildQuestionIndex } from '../../scripts/question-index';

describe('問題ID索引', () => {
  it('問題IDからファイルと配列位置を引ける', () => {
    const files = ['questions/a.json', 'questions/b.json'];
    const data: Record<string, unknown> = {
      'questions/a.json': [{ id: 'a.1' }, { id: 'a.2' }],
      'questions/b.json': [{ id: 'b.1' }],
    };
    expect(buildQuestionIndex(files, (file) => data[file])).toEqual({
      'a.1': [0, 0],
      'a.2': [0, 1],
      'b.1': [1, 0],
    });
  });

  it('不正ファイルとIDなしを無視し、重複IDは最初の場所を保つ', () => {
    const data: Record<string, unknown> = {
      bad: {},
      first: [{ id: 'same' }, { prompt: 'IDなし' }],
      second: [{ id: 'same' }],
    };
    expect(buildQuestionIndex(['bad', 'first', 'second'], (file) => data[file])).toEqual({
      same: [1, 0],
    });
  });
});
