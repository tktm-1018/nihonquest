import { beforeAll, describe, expect, it, vi } from 'vitest';
import { content } from './helpers';
import { partyFromGameState } from '../../src/core/battle/setup';
import { equipPosition } from '../../src/core/progression/bag';
import { equipSetProgress } from '../../src/core/progression/inventory';
import { createNewGame } from '../../src/core/state/newGame';
import { equipmentMenu } from '../../src/scenes/overworld/menuEntries';
import { setDictionary, t } from '../../src/ui/i18n';
import ja from '../../content/i18n/ja.json';

// アイコンは canvas で 描くので、この テストでは いらない
vi.mock('../../src/rendering/itemIcons', () => ({ itemIconUrl: () => '' }));

const fresh = () => createNewGame({ name: 'テスト', grade: 3 }, 1000);
const stats = {
  hp: 40,
  mp: 10,
  scienceAtk: 1,
  humanitiesAtk: 1,
  scienceDef: 1,
  humanitiesDef: 1,
  spd: 1,
  wis: 1,
};

describe('セット そうび', () => {
  beforeAll(() => setDictionary(ja));

  it('つけている 部位の 数を 数え、5つで そろう', async () => {
    const set = (await content()).sets.get('set-aomori')!;
    const gs = fresh();
    expect(equipSetProgress(set, gs.player.equipment)).toEqual({ have: 0, total: 5, complete: false });
    gs.player.equipment.weapon = 'aomori-maguro-zutsuki';
    gs.player.equipment.head = 'aomori-nebuta-no-kabuto';
    expect(equipSetProgress(set, gs.player.equipment)).toMatchObject({ have: 2, complete: false });
  });

  it('そうびの 画面に そろいぐあいを 出し、そろうと 効果の 説明を 出す', async () => {
    const c = await content();
    const set = c.sets.get('set-aomori')!;
    const gs = fresh();
    gs.player.equipment.weapon = 'aomori-maguro-zutsuki';
    const partial = equipmentMenu(c, gs, stats, () => '').entries.find((e) => e.key === 'slot:weapon')!;
    expect(partial.lines).toContain(t('field.equipSetProgress', { name: set.name, have: 1, total: 5 }));
    expect(partial.lines).not.toContain(set.bonus.description);

    for (const id of set.pieces) gs.player.equipment[c.items.get(id)!.kind as 'weapon'] = id;
    const done = equipmentMenu(c, gs, stats, () => '').entries.find((e) => e.key === 'slot:head')!;
    expect(done.lines).toContain(`${set.name}が そろった！`);
    expect(done.lines).toContain(set.bonus.description);
  });

  it('そろうと たたかいで かしこさと 属性の いりょくが あがる', async () => {
    const c = await content();
    const set = c.sets.get('set-aomori')!;
    const gs = fresh();
    // そうびは 東北を クリアしてから つかえる
    gs.progress.islandsCleared.push('tohoku');
    // バッグの きまった マスに おいた そうびだけが きく
    const wear = (id: string) => {
      const kind = c.items.get(id)!.kind as 'weapon';
      gs.player.equipment[kind] = id;
      gs.party.bagPlacements[`eq:${kind}`] = { ...equipPosition(gs, kind), rotated: false };
    };
    set.pieces.slice(1).forEach(wear);
    const four = partyFromGameState(gs, c).hero;
    wear(set.pieces[0]!);
    const five = partyFromGameState(gs, c).hero;
    const weaponWis = c.items.get(set.pieces[0]!)!.stats?.wis ?? 0;
    expect(five.stats.wis - four.stats.wis).toBe(weaponWis + 2);
    expect(five.elementBoost).toMatchObject({ mizu: 1.2, mori: 1.2 });
    expect(four.elementBoost).toEqual({});
  });
});
