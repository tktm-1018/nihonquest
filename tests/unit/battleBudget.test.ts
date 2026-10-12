import { describe, expect, it } from 'vitest';
import { aomoriBattleBudget, simulateBattleBudget } from '../../scripts/simulate-battle-balance';

describe('青森の戦闘予算', () => {
  it('通常敵は適正レベル・装備で2〜4回の通常攻撃に収まる', () => {
    const [normal] = aomoriBattleBudget();
    expect(normal!.turnsToWin).toBeGreaterThanOrEqual(2);
    expect(normal!.turnsToWin).toBeLessThanOrEqual(4);
  });

  it('弱点を調べて対応武器を使うと県ボス戦が短くなる', () => {
    const common = simulateBattleBudget({
      enemyId: 'aomori-boss-tsugaru-no-nushi',
      level: 5,
      weaponId: 'common-dou-no-ken',
    });
    const counter = simulateBattleBudget({
      enemyId: 'aomori-boss-tsugaru-no-nushi',
      level: 5,
      weaponId: 'aomori-hiba-no-tsue',
      weaknessRevealed: true,
    });
    expect(counter.turnsToWin).toBeLessThan(common.turnsToWin);
    expect(counter.turnsToWin).toBeGreaterThanOrEqual(8);
    expect(counter.turnsToWin).toBeLessThanOrEqual(12);
  });

  it('中ボスは標準武器で6〜9回の通常攻撃を基準にする', () => {
    const [, , midboss] = aomoriBattleBudget();
    expect(midboss!.turnsToWin).toBeGreaterThanOrEqual(6);
    expect(midboss!.turnsToWin).toBeLessThanOrEqual(9);
  });
});
