import { beforeAll, describe, expect, it } from 'vitest';
import { earnAreaSign } from '../../src/core/progression/eventReward';
import { completeIsland } from '../../src/core/progression/island';
import { createNewGame } from '../../src/core/state/newGame';
import { islandArrival, islandBossOutro } from '../../src/scenes/overworld/islandStory';
import { setDictionary } from '../../src/ui/i18n';
import { content, read } from './helpers';

const TOHOKU = ['aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'] as const;
const KANTO = ['ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa'] as const;

beforeAll(async () => {
  setDictionary((await read('i18n/ja.json')) as Record<string, unknown>);
});

describe('地方の 章の 会話', () => {
  it('バッグが 広がった 章だけ バッグの 一言を 出し、章ごとの 終わりの 文を 出す', async () => {
    const c = await content();
    let gs = createNewGame({ name: 'ハル', grade: 1 }, 0);
    for (const id of [...TOHOKU, 'hokkaido', ...KANTO]) gs = earnAreaSign(gs, id, 1);

    const texts = (islandId: string) => {
      const next = completeIsland(gs, c.world, islandId, 2);
      const lines = islandBossOutro(c, islandId, gs, next).map((line) => line.text);
      gs = next;
      return lines;
    };
    const tohoku = texts('tohoku');
    expect(tohoku.some((text) => text.includes('4×3'))).toBe(true);
    expect(tohoku.some((text) => text.includes('北海道'))).toBe(true);
    const hokkaido = texts('hokkaido');
    expect(hokkaido.some((text) => text.includes('バッグ'))).toBe(false);
    expect(hokkaido.some((text) => text.includes('関東'))).toBe(true);
    // 2つめ いこうの 地方では バッグは 4×3 の まま
    const kanto = texts('kanto');
    expect(kanto.some((text) => text.includes('バッグ'))).toBe(false);
    expect(kanto.at(-1)).toContain('第三章');
  });

  it('航路で ひらいた 島の 最初の 県に はじめて 着いたときだけ 妖精が 話す', async () => {
    const c = await content();
    const gs = createNewGame({ name: 'ハル', grade: 1 }, 0);
    expect(islandArrival(c, gs, 'ibaraki')?.flag).toBe('arrive.kanto');
    expect(islandArrival(c, gs, 'hokkaido')?.line.text).toContain('北海道');
    expect(islandArrival(c, gs, 'tochigi')).toBeNull();
    expect(islandArrival(c, gs, 'aomori')).toBeNull();
    const seen = { ...gs, progress: { ...gs.progress, eventsDone: ['arrive.kanto'] } };
    expect(islandArrival(c, seen, 'ibaraki')).toBeNull();
  });
});
