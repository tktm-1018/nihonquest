import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { earnAreaSign } from '../../src/core/progression/eventReward';
import { completeIsland } from '../../src/core/progression/island';
import { createNewGame } from '../../src/core/state/newGame';
import { buildWorldMapRegions } from '../../src/scenes/overworld/worldMapRegions';
import type { WorldMapData } from '../../src/ui/field/WorldMapOverlay';
import { content } from './helpers';

const WORLD_MAP = JSON.parse(
  readFileSync(new URL('../../public/worldmap.json', import.meta.url), 'utf8'),
) as WorldMapData;
const TOHOKU = ['aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'] as const;

describe('にほんちずの 結界と 航路', () => {
  it('東北を 浄化するまで 北海道は 結界、浄化すると 北海道へ わたれる', async () => {
    const c = await content();
    let gs = createNewGame({ name: 'ハル', grade: 1 }, 0);
    const hokkaidoOf = () =>
      buildWorldMapRegions(WORLD_MAP, c, gs, new Set(['aomori'])).find((region) => region.id === 'hokkaido');

    expect(hokkaidoOf()?.status).toBe('stub');
    expect(hokkaidoOf()?.areas.every((area) => !area.visited)).toBe(true);

    for (const id of TOHOKU) gs = earnAreaSign(gs, id, 1);
    gs = completeIsland(gs, c.world, 'tohoku', 2);
    const regions = buildWorldMapRegions(WORLD_MAP, c, gs, new Set(['aomori']));
    expect(regions.find((region) => region.id === 'hokkaido')).toMatchObject({
      status: 'playable',
      areas: [expect.objectContaining({ id: 'hokkaido', visited: true })],
    });
    expect(regions.find((region) => region.id === 'kanto')?.status).toBe('stub');
    // 東北の 行ったことの ない 県は、これまでどおり ワープできない
    const tohoku = regions.find((region) => region.id === 'tohoku');
    expect(tohoku?.areas.find((area) => area.id === 'iwate')?.visited).toBe(false);
  });

  it('北海道を 浄化すると 関東の 最初の 県（茨城）へ わたれる', async () => {
    const c = await content();
    let gs = createNewGame({ name: 'ハル', grade: 1 }, 0);
    for (const id of TOHOKU) gs = earnAreaSign(gs, id, 1);
    gs = completeIsland(gs, c.world, 'tohoku', 2);
    const kantoOf = () =>
      buildWorldMapRegions(WORLD_MAP, c, gs, new Set(['aomori'])).find((region) => region.id === 'kanto');
    expect(kantoOf()?.status).toBe('stub');

    gs = earnAreaSign(gs, 'hokkaido', 3);
    gs = completeIsland(gs, c.world, 'hokkaido', 4);
    const kanto = kantoOf();
    expect(kanto?.status).toBe('playable');
    expect(kanto?.areas.filter((area) => area.visited).map((area) => area.id)).toEqual(['ibaraki']);
  });
});
