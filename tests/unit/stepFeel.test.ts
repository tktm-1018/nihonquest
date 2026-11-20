import { describe, expect, it } from 'vitest';
import { StepFeel, TURN_MS } from '../../src/scenes/overworld/stepFeel';

describe('フィールドの 歩きだし（ポケモンふう）', () => {
  it('止まって いる ときに ちがう 向きを ちょんと おすと、向きだけ かわる', () => {
    const f = new StepFeel();
    expect(f.shouldWalk('left', 'down', 0)).toBe(false);
    expect(f.shouldWalk('left', 'left', TURN_MS - 10)).toBe(false);
    expect(f.shouldWalk(null, 'left', TURN_MS - 5)).toBe(false);
  });

  it('おしつづけると 歩きだす', () => {
    const f = new StepFeel();
    expect(f.shouldWalk('left', 'down', 0)).toBe(false);
    expect(f.shouldWalk('left', 'left', TURN_MS)).toBe(true);
  });

  it('むいて いる 向きを おすと すぐ 歩く。歩きながら 向きを かえても すぐ 歩く', () => {
    const f = new StepFeel();
    expect(f.shouldWalk('down', 'down', 0)).toBe(true);
    expect(f.shouldWalk('right', 'down', 10)).toBe(true);
  });
});
