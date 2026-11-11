import { describe, expect, it } from 'vitest';
import { presentationGrade } from '../../src/questions/engine/ask';

describe('問題の漢字表示学年', () => {
  it('問題の対象学年を超えて難しくしない', () => {
    expect(presentationGrade(6, 1)).toBe(1);
    expect(presentationGrade(2, 4)).toBe(2);
  });
});
