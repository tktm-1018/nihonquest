/**
 * バトルの組み立て（GameState + content → Party / 出現モンスター）。純粋関数のみ。
 * Scene はここで作った Party を createBattle() に渡すだけ。
 */
import type { ContentIndex } from '../content/loader';
import type { Area } from '../content/schemas';
import { adjacencyBonus, bagContext, battleRosterUids } from '../progression/bag';
import { heroLevel } from '../progression/battleResult';
import type { Rng } from '../rng';
import type { GameState } from '../state/schema';
import type { Ground } from '../world/ground';
import { makeHero, makeMonster, makeParty } from './factory';
import type { Party } from './types';

/**
 * 主人公の1レベルごとの成長値。
 * セーブにはLv1基礎値を保持し、XPから求めたレベルに応じて決定計算する。
 * これにより調整後も既存セーブを個別移行せず、同じレベルなら同じ能力になる。
 */
export const HERO_GROWTH = { hp: 5, mp: 1, atk: 1.2, def: 1, spd: 0.6, wis: 0.8 } as const;

export function partyFromGameState(
  gs: GameState,
  c: Pick<ContentIndex, 'items' | 'sets' | 'monsters' | 'xp'>,
): Party {
  const p = gs.player;
  const hero = makeHero(
    {
      name: p.name,
      // XPから求める表示レベルと、実際の戦闘能力を一致させる。
      level: heroLevel(gs, c.xp.hero),
      baseStats: p.baseStats,
      growth: HERO_GROWTH,
      skills: p.skills,
      equipment: p.equipment,
      bonusWis: p.bonusWis,
    },
    c.items,
    c.sets,
  );
  // 戦闘は今の HP/MP から始まる（前の戦闘のダメージを持ち越す）。0 で始まらないよう最低 1
  hero.hp = Math.max(1, Math.min(hero.stats.hp, p.hp));
  hero.mp = Math.max(0, Math.min(hero.stats.mp, p.mp));

  // バッグで主人公に隣接した仲間の属性支援。戦闘方式そのものは従来のターン制を保つ。
  const adjacent = adjacencyBonus(gs, bagContext(gs, c), hero.stats);
  for (const [k, v] of Object.entries(adjacent.stats)) hero.stats[k as keyof typeof hero.stats] += v ?? 0;
  hero.hp = Math.min(hero.hp, hero.stats.hp);

  // バトルに出るのは バッグに 入れた 仲間だけ（何体でも）。あずけている 仲間は 入れかえにも出ない
  const owned = battleRosterUids(gs)
    .map((uid) => gs.party.owned.find((o) => o.uid === uid))
    .filter((o): o is NonNullable<typeof o> => !!o && c.monsters.has(o.monsterId));
  const monsters = owned.map((o) => {
    const m = makeMonster(c.monsters.get(o.monsterId)!, o.level, o.uid);
    if (o.nickname) m.name = o.nickname;
    return m;
  });
  // content に 無い どうぐ（なくした やくそう など、前の セーブに のこっている もの）は もちこまない
  const items = Object.fromEntries(
    Object.entries(gs.inventory).filter(([id, n]) => n > 0 && c.items.has(id)),
  );
  const party = makeParty(hero, monsters, items);
  const active = owned.findIndex((o) => o.uid === gs.party.activeUid);
  party.activeMonsterIndex = Math.max(0, active);
  return party;
}

/** field（くさはら）・dungeon と、フィールドの 地面ごとの 出現表（src/core/world/ground.ts） */
export type EncounterZone = 'field' | 'dungeon' | Exclude<Ground, 'grass'>;

/** マップキー（"aomori-field" など）から出現ゾーンを決める。町・島マップではエンカウントしない */
export function zoneForMap(mapKey: string): EncounterZone | null {
  if (mapKey.endsWith('-field')) return 'field';
  if (mapKey.endsWith('-dungeon')) return 'dungeon';
  return null;
}

/**
 * フィールドでは 立っている 地面（すなはま・もり・やま …）の 出現表を つかう。
 * くさはらと、その県に 表の 無い 地面は ふつうの field。ダンジョンは そのまま
 */
export function zoneForGround(
  area: Pick<Area, 'encounters'>,
  zone: EncounterZone,
  ground: Ground | null,
): EncounterZone {
  if (zone !== 'field' || !ground || ground === 'grass') return zone;
  return area.encounters.some((e) => !e.region && e.zone === ground) ? ground : 'field';
}

/** 県の encounters テーブルから 1 体抽選。テーブルが無ければ null */
export function pickEncounter(area: Pick<Area, 'encounters'>, zone: EncounterZone, rng: Rng): string | null {
  const table = area.encounters.find((e) => !e.region && e.zone === zone)?.table;
  if (!table?.length) return null;
  return rng.weighted(table.map((t) => ({ item: t.monsterId, weight: t.weight })));
}

type EncounterTable = Area['encounters'][number];

/**
 * いま つかう 出現表。名所エリア（region）の ある フィールドでは、その エリアの 表（地面の 表 → エリアの field の 表）。
 * エリアの 表が 無ければ ふつうの 表（地面 → field）
 */
export function encounterTable(
  area: Pick<Area, 'encounters'>,
  zone: EncounterZone,
  ground: Ground | null,
  region: string | null,
): EncounterTable | null {
  if (region && zone === 'field') {
    const mine = area.encounters.filter((e) => e.region === region);
    if (mine.length)
      return (
        (ground && ground !== 'grass' ? mine.find((e) => e.zone === ground) : undefined) ??
        mine.find((e) => e.zone === 'field') ??
        null
      );
  }
  const z = zoneForGround(area, zone, ground);
  return area.encounters.find((e) => !e.region && e.zone === z) ?? null;
}

/** 表から 1 体 */
export function pickFromTable(table: EncounterTable, rng: Rng): string | null {
  if (!table.table.length) return null;
  return rng.weighted(table.table.map((t) => ({ item: t.monsterId, weight: t.weight })));
}

/**
 * 出現レベル。県に基準レベルがあれば「基準-1〜基準+2」に収め、地域ごとの手応えを保つ。
 * 未設定の県は互換性のため主人公レベル±1（最低1）。
 */
export function encounterLevel(heroLevel: number, rng: Rng, recommendedLevel?: number): number {
  const candidate = Math.max(1, heroLevel + rng.int(-1, 1));
  if (recommendedLevel === undefined) return candidate;
  return Math.min(recommendedLevel + 2, Math.max(Math.max(1, recommendedLevel - 1), candidate));
}
