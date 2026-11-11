import { beforeAll, describe, expect, it } from 'vitest';
import { content, deps } from './helpers';
import { act, createBattle, type BattleDeps } from '../../src/core/battle/engine';
import { ENRAGE_ATK_MULT, bossReactions } from '../../src/core/battle/bossRage';
import { makeHero, makeMonster, makeParty } from '../../src/core/battle/factory';
import type { BattleEvent, BattleState } from '../../src/core/battle/types';

let D: BattleDeps;
beforeAll(async () => {
  D = await deps();
});

async function bossBattle(isBossBattle: boolean): Promise<BattleState> {
  const c = await content();
  const hero = makeHero(
    {
      name: 'ハル',
      level: 40,
      baseStats: {
        hp: 40,
        mp: 10,
        scienceAtk: 8,
        humanitiesAtk: 8,
        scienceDef: 6,
        humanitiesDef: 6,
        spd: 999,
        wis: 5,
      },
      growth: { hp: 6, mp: 2, atk: 1.5, def: 1.2, spd: 1.0, wis: 1.0 },
      skills: ['sk-tashizan-giri'],
      equipment: {},
    },
    c.items,
    c.sets,
  );
  const enemy = makeMonster(c.monsters.get('aomori-boss-tsugaru-no-nushi')!, 5, 'enemy');
  return createBattle({ ally: makeParty(hero, []), enemy, seed: 'rage', isBossBattle }, D);
}

describe('ボスの いかり（HP が 半分 いかで オーラ＋こうげき アップ）', () => {
  it('HP が 半分を こえて いる あいだは いからない', async () => {
    const s = await bossBattle(true);
    s.enemy.hp = Math.floor(s.enemy.stats.hp * 0.5) + 1;
    const ev: BattleEvent[] = [];
    bossReactions(s, D.monsters, ev);
    expect(ev).toEqual([]);
    expect(s.enemy.enraged).toBeUndefined();
  });

  it('半分 いかに なると 1 回だけ いかって、こうげきが 少し あがる', async () => {
    const s = await bossBattle(true);
    const before = { ...s.enemy.stats };
    s.enemy.hp = Math.floor(s.enemy.stats.hp * 0.5);
    const ev: BattleEvent[] = [];
    bossReactions(s, D.monsters, ev);
    bossReactions(s, D.monsters, ev);
    expect(ev.filter((e) => e.t === 'bossEnrage')).toHaveLength(1);
    expect(s.enemy.enraged).toBe(true);
    expect(s.enemy.stats.scienceAtk).toBe(Math.ceil(before.scienceAtk * ENRAGE_ATK_MULT));
    expect(s.enemy.stats.humanitiesAtk).toBe(Math.ceil(before.humanitiesAtk * ENRAGE_ATK_MULT));
    expect(s.enemy.stats.scienceDef).toBe(before.scienceDef);
    expect(s.enemy.stats.hp).toBe(before.hp);
  });

  it('ボス戦で ない ときは いからない', async () => {
    const s = await bossBattle(false);
    s.enemy.hp = 1;
    const ev: BattleEvent[] = [];
    bossReactions(s, D.monsters, ev);
    expect(ev.some((e) => e.t === 'bossEnrage')).toBe(false);
  });

  it('こうげきで 半分を きると、ターンの なかで bossEnrage が 出る', async () => {
    const s = await bossBattle(true);
    // 1 ダメージでも 半分を きる HP に して、たおさない くらい 大きく する
    s.enemy.stats = { ...s.enemy.stats, hp: 100000 };
    s.enemy.hp = 50001;
    s.ally.hero.hp = 9999;
    s.ally.hero.stats = { ...s.ally.hero.stats, hp: 9999 };
    const r = act(s, { kind: 'attack' }, D);
    expect(r.state.enemy.hp).toBeLessThanOrEqual(50000);
    expect(r.events.some((e) => e.t === 'bossEnrage')).toBe(true);
    expect(r.state.enemy.enraged).toBe(true);
  });
});
