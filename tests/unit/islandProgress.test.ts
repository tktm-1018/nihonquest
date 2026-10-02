import { describe, expect, it } from 'vitest';
import {
  canChallengeIslandBoss,
  clearIsland,
  islandAreaSigns,
  islandBossFlag,
  missingIslandAreaSigns,
  nextIsland,
  nextIslandAccess,
} from '../../src/core/progression/island';
import { createNewGame } from '../../src/core/state/newGame';
import { bagDimensions } from '../../src/core/progression/bag';
import { content } from './helpers';

const newGame = () => createNewGame({ name: 'ハル', starterMonsterId: 'aomori-nebutan', grade: 1 }, 0);

describe('地方ボスの解放条件', () => {
  it('その地方の県のしるしが全部そろったときだけ挑戦できる', async () => {
    const c = await content();
    const tohoku = c.world.islands.find((island) => island.id === 'tohoku')!;
    const gs = newGame();

    expect(islandAreaSigns(gs, tohoku)).toEqual([]);
    expect(missingIslandAreaSigns(gs, tohoku)).toEqual(tohoku.areas);
    expect(canChallengeIslandBoss(gs, tohoku)).toBe(false);

    gs.progress.areaSigns = [...tohoku.areas.slice(0, -1), 'hokkaido'];
    expect(islandAreaSigns(gs, tohoku)).toEqual(tohoku.areas.slice(0, -1));
    expect(missingIslandAreaSigns(gs, tohoku)).toEqual([tohoku.areas.at(-1)]);
    expect(canChallengeIslandBoss(gs, tohoku)).toBe(false);

    gs.progress.areaSigns.push(tohoku.areas.at(-1)!);
    expect(canChallengeIslandBoss(gs, tohoku)).toBe(true);
  });

  it('しるしがそろってもstubの島は挑戦できない', async () => {
    const c = await content();
    const hokkaido = c.world.islands.find((island) => island.id === 'hokkaido')!;
    const gs = newGame();
    gs.progress.areaSigns = [...hokkaido.areas];
    expect(hokkaido.status).toBe('stub');
    expect(canChallengeIslandBoss(gs, hokkaido)).toBe(false);
  });
});

describe('地方のクリアと次の島', () => {
  it('勝利を一度だけ記録し、バッグ拡張へつながる', async () => {
    const c = await content();
    const tohoku = c.world.islands.find((island) => island.id === 'tohoku')!;
    const gs = newGame();
    gs.progress.areaSigns = [...tohoku.areas];

    expect(bagDimensions(gs)).toEqual({ w: 2, h: 2 });
    const first = clearIsland(gs, tohoku, 123);
    expect(first.result).toBe('cleared');
    expect(first.state.progress.islandsCleared).toEqual(['tohoku']);
    expect(first.state.progress.eventsDone).toContain(islandBossFlag('tohoku'));
    expect(first.state.updatedAt).toBe(123);
    expect(bagDimensions(first.state)).toEqual({ w: 3, h: 2 });
    expect(gs.progress.islandsCleared).toEqual([]);

    const twice = clearIsland(first.state, tohoku, 456);
    expect(twice.result).toBe('already-cleared');
    expect(twice.state).toBe(first.state);
    expect(twice.state.progress.islandsCleared).toEqual(['tohoku']);
    expect(twice.state.progress.eventsDone.filter((id) => id === islandBossFlag('tohoku'))).toHaveLength(1);
  });

  it('条件不足では状態を変更しない', async () => {
    const c = await content();
    const tohoku = c.world.islands.find((island) => island.id === 'tohoku')!;
    const gs = newGame();
    const result = clearIsland(gs, tohoku, 123);
    expect(result).toEqual({ state: gs, result: 'locked' });
  });

  it('order順の次の島を返し、stubへは上陸させず結界を返す', async () => {
    const c = await content();
    const gs = newGame();
    expect(nextIsland(c.world, 'tohoku')?.id).toBe('hokkaido');
    expect(nextIslandAccess(c.world, gs, 'tohoku')).toEqual({ kind: 'uncleared' });

    gs.progress.islandsCleared = ['tohoku'];
    const access = nextIslandAccess(c.world, gs, 'tohoku');
    expect(access.kind).toBe('barrier');
    if (access.kind === 'barrier') expect(access.island.id).toBe('hokkaido');
  });

  it('不明な島と最後の島を安全に扱う', async () => {
    const c = await content();
    const gs = newGame();
    expect(nextIslandAccess(c.world, gs, 'no-such-island')).toEqual({ kind: 'unknown-island' });

    const last = [...c.world.islands].sort((a, b) => a.order - b.order).at(-1)!;
    gs.progress.islandsCleared = [last.id];
    expect(nextIsland(c.world, last.id)).toBeNull();
    expect(nextIslandAccess(c.world, gs, last.id)).toEqual({ kind: 'end' });
  });
});
