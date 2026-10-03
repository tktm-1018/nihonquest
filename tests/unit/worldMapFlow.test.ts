import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { createNewGame } from '../../src/core/state/newGame';
import { buildWorldMapRegions, worldMapHere } from '../../src/scenes/overworld/worldMapFlow';
import type { WorldMapData } from '../../src/ui/field/WorldMapOverlay';
import { content } from './helpers';

const newGame = () => createNewGame({ name: 'ハル', starterMonsterId: 'aomori-nebutan', grade: 1 }, 0);
const worldMap = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../public/worldmap.json', import.meta.url)), 'utf8'),
) as WorldMapData;

describe('にほんちずの進行表示', () => {
  it('東北6県のしるしが揃うと地方ボスを解放し、北海道は結界のまま', async () => {
    const loaded = await content();
    const game = newGame();
    const tohoku = loaded.world.islands.find((island) => island.id === 'tohoku')!;
    game.progress.areaSigns = [...tohoku.areas];

    const regions = buildWorldMapRegions(worldMap, loaded, game, new Set(['aomori']));
    expect(regions.find((region) => region.id === 'tohoku')?.islandBoss.state).toBe('ready');
    expect(regions.find((region) => region.id === 'hokkaido')?.status).toBe('stub');

    game.progress.islandsCleared.push('tohoku');
    expect(buildWorldMapRegions(worldMap, loaded, game, new Set())[0]?.islandBoss.state).toBe('done');
  });

  it('フィールド上の位置を陸地範囲の0〜1に変換する', () => {
    const tiles = [
      { index: 3, x: 0, y: 0 },
      { index: 1, x: 2, y: 4 },
      { index: 1, x: 5, y: 7 },
    ];
    expect(worldMapHere('aomori', tiles, [2, 4], 3)).toEqual({
      areaId: 'aomori',
      at: [0.125, 0.125],
    });
    expect(worldMapHere('aomori', undefined, [2, 4], 3)).toEqual({ areaId: 'aomori' });
  });
});
