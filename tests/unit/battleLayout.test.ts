import { describe, expect, it } from 'vitest';
import { BATTLE_SCALE, battleLayout } from '../../src/scenes/battle/layout';
import { backdropPads } from '../../src/scenes/battle/platforms';

describe('戦闘画面の配置', () => {
  it('省略時は モンスター RPG ふう（front）', () => {
    expect(battleLayout()).toEqual(battleLayout('front'));
  });

  it('front は 敵が 右おく・主人公と 仲間が 左てまえ。ドットの 大きさは みんな 同じ', () => {
    const layout = battleLayout('front');
    expect(layout.enemy.x).toBeGreaterThan(layout.partner.x);
    expect(layout.partner.x).toBeGreaterThan(layout.hero.x);
    expect(layout.enemy.y).toBeLessThan(layout.hero.y);
    expect(layout.enemy.y).toBeLessThan(layout.partner.y);
    expect(BATTLE_SCALE + layout.enemy.scaleStep).toBe(layout.hero.scale);
    expect(layout.partner.scale).toBe(layout.hero.scale);
  });

  it('サイドビューは 遠近を つけず、みんな 同じ 地面の 線と 同じ ドットの 大きさ', () => {
    const layout = battleLayout('side');
    expect(layout.enemy.y).toBe(layout.hero.y);
    expect(layout.partner.y).toBe(layout.hero.y);
    expect(layout.boss.y).toBe(layout.hero.y);
    expect(BATTLE_SCALE + layout.enemy.scaleStep).toBe(layout.hero.scale);
    expect(layout.partner.scale).toBe(layout.hero.scale);
    expect(layout.enemy.x).toBeLessThan(layout.hero.x);
    expect(layout.hero.x).toBeLessThan(layout.partner.x);
  });

  it('ボス戦は 敵の 立つ 場所を ボスの 場所に する', () => {
    for (const view of ['front', 'side'] as const) {
      const layout = battleLayout(view, true);
      expect(layout.enemy.x).toBe(layout.boss.x);
      expect(layout.enemy.y).toBe(layout.boss.y);
    }
  });
});

describe('front の 背景の 立つ 場所', () => {
  it('敵と 味方の 足もとに 地面を しく（背景の ドット単位）', () => {
    const layout = battleLayout('front');
    const [foe, party] = backdropPads(layout, 128);
    expect(foe!.x * BATTLE_SCALE).toBeCloseTo(layout.enemy.x, -1);
    expect(Math.abs(foe!.y * BATTLE_SCALE - layout.enemy.y)).toBeLessThanOrEqual(8);
    expect(Math.abs(party!.y * BATTLE_SCALE - layout.hero.y)).toBeLessThanOrEqual(8);
    expect((party!.x - party!.w / 2) * BATTLE_SCALE).toBeLessThan(layout.hero.x);
    expect((party!.x + party!.w / 2) * BATTLE_SCALE).toBeGreaterThan(layout.partner.x);
  });
});
