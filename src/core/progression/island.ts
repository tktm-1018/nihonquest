/**
 * 地方（島）単位の進行。Scene や表示に依存しない純粋関数だけを置く。
 * 県ボスのしるしが全部そろうと地方ボスへ挑戦でき、勝利後に次の島の状態を返す。
 */
import type { Island, World } from '../content/schemas';
import type { GameState } from '../state/schema';

export const islandBossFlag = (islandId: string): string => `islandboss.${islandId}`;

export function islandAreaSigns(gs: Pick<GameState, 'progress'>, island: Island): string[] {
  const signs = new Set(gs.progress.areaSigns);
  return island.areas.filter((areaId) => signs.has(areaId));
}

export function missingIslandAreaSigns(gs: Pick<GameState, 'progress'>, island: Island): string[] {
  const signs = new Set(gs.progress.areaSigns);
  return island.areas.filter((areaId) => !signs.has(areaId));
}

export function isIslandCleared(gs: Pick<GameState, 'progress'>, islandId: string): boolean {
  return gs.progress.islandsCleared.includes(islandId);
}

/** stub の島はコンテンツがそろうまで挑戦させない。 */
export function canChallengeIslandBoss(gs: Pick<GameState, 'progress'>, island: Island): boolean {
  return (
    island.status === 'playable' &&
    !isIslandCleared(gs, island.id) &&
    missingIslandAreaSigns(gs, island).length === 0
  );
}

export type ClearIslandResult = 'cleared' | 'already-cleared' | 'locked';

/**
 * 地方ボス勝利をセーブへ反映する。条件不足では変更せず、二重実行しても重複しない。
 */
export function clearIsland(
  prev: GameState,
  island: Island,
  now = Date.now(),
): { state: GameState; result: ClearIslandResult } {
  if (isIslandCleared(prev, island.id)) return { state: prev, result: 'already-cleared' };
  if (!canChallengeIslandBoss(prev, island)) return { state: prev, result: 'locked' };

  const state = structuredClone(prev);
  state.progress.islandsCleared.push(island.id);
  const flag = islandBossFlag(island.id);
  if (!state.progress.eventsDone.includes(flag)) state.progress.eventsDone.push(flag);
  state.updatedAt = now;
  return { state, result: 'cleared' };
}

export function nextIsland(world: World, islandId: string): Island | null {
  const islands = [...world.islands].sort((a, b) => a.order - b.order);
  const index = islands.findIndex((island) => island.id === islandId);
  return index < 0 ? null : (islands[index + 1] ?? null);
}

export type NextIslandAccess =
  | { kind: 'unknown-island' }
  | { kind: 'uncleared' }
  | { kind: 'end' }
  | { kind: 'playable'; island: Island }
  | { kind: 'barrier'; island: Island };

/** 地方ボス後の行き先。stub は上陸させず「結界」として扱う。 */
export function nextIslandAccess(
  world: World,
  gs: Pick<GameState, 'progress'>,
  islandId: string,
): NextIslandAccess {
  if (!world.islands.some((island) => island.id === islandId)) return { kind: 'unknown-island' };
  if (!isIslandCleared(gs, islandId)) return { kind: 'uncleared' };
  const next = nextIsland(world, islandId);
  if (!next) return { kind: 'end' };
  return next.status === 'playable' ? { kind: 'playable', island: next } : { kind: 'barrier', island: next };
}
