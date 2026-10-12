import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

type Stats = { hp: number; mp: number; atk: number; def: number; spd: number; wis: number };
type Item = { id: string; kind: string; stats?: Partial<Stats>; price?: number; areaOrigin?: string };
type Monster = {
  id: string;
  isBoss?: boolean;
  baseStats: Stats;
  growth: Stats;
  xp: number;
  gold: number;
};
type Area = {
  id: string;
  recommendedLevel?: number;
  shop?: { itemId: string }[];
  missions?: { reward?: { items?: { itemId: string }[] } }[];
};
type Recipe = { result: { itemId: string } };

const ROOT = resolve(import.meta.dirname, '..');

function readJsonDirectory<T>(directory: string): T[] {
  return readdirSync(resolve(ROOT, directory))
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => JSON.parse(readFileSync(resolve(ROOT, directory, name), 'utf8')) as T);
}

function monsterTier(monster: Monster): 'normal' | 'midboss' | 'boss' | 'lastboss' {
  if (monster.id.includes('lastboss')) return 'lastboss';
  if (monster.id.includes('midboss')) return 'midboss';
  return monster.isBoss ? 'boss' : 'normal';
}

const round = (value: number) => Math.round(value * 10) / 10;

export function auditBattleBalance() {
  const items = readJsonDirectory<Item>('content/items');
  const monsters = readJsonDirectory<Monster>('content/monsters');
  const areas = readJsonDirectory<Area>('content/prefectures');
  const recipes = JSON.parse(readFileSync(resolve(ROOT, 'content/recipes.json'), 'utf8')) as Recipe[];
  const setupSource = readFileSync(resolve(ROOT, 'src/core/battle/setup.ts'), 'utf8');
  const overworldSource = readFileSync(resolve(ROOT, 'src/scenes/Overworld.ts'), 'utf8');
  const hasBattleBudget = (() => {
    try {
      readFileSync(resolve(ROOT, 'scripts/simulate-battle-balance.ts'), 'utf8');
      return true;
    } catch {
      return false;
    }
  })();
  const tohokuIds = ['aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'];
  const regionalLevels = areas
    .filter((area) => tohokuIds.includes(area.id))
    .map((area) => ({ id: area.id, recommendedLevel: area.recommendedLevel }))
    .sort((a, b) => tohokuIds.indexOf(a.id) - tohokuIds.indexOf(b.id));
  const hasTohokuLevelCurve =
    regionalLevels.length === tohokuIds.length && regionalLevels.every((area) => area.recommendedLevel);
  const equipmentKinds = ['weapon', 'head', 'chest', 'legs', 'feet'] as const;
  const equipment = Object.fromEntries(
    equipmentKinds.map((kind) => [kind, items.filter((item) => item.kind === kind)]),
  ) as Record<(typeof equipmentKinds)[number], Item[]>;

  const tierSummary = Object.fromEntries(
    (['normal', 'midboss', 'boss', 'lastboss'] as const).map((tier) => {
      const entries = monsters.filter((monster) => monsterTier(monster) === tier);
      const average = (key: keyof Stats) =>
        round(entries.reduce((total, monster) => total + monster.baseStats[key], 0) / entries.length);
      return [
        tier,
        {
          count: entries.length,
          averageBaseStats: Object.fromEntries(
            (['hp', 'mp', 'atk', 'def', 'spd', 'wis'] as const).map((key) => [key, average(key)]),
          ),
        },
      ];
    }),
  );

  const findings = [
    ...(equipment.weapon.length < 8
      ? [`武器が${equipment.weapon.length}本しかなく、序盤の選択肢と更新体験を作れない`]
      : []),
    ...(Math.min(...equipmentKinds.map((kind) => equipment[kind].length)) < 8
      ? ['装備スロットごとの品数が不均衡で、ビルド選択が成立していない']
      : []),
    ...(!setupSource.includes('growth: HERO_GROWTH')
      ? ['主人公はXPから表示レベルだけ上がり、baseStatsのレベル成長が未実装']
      : []),
    ...(!hasTohokuLevelCurve || !overworldSource.includes('area.recommendedLevel')
      ? ['通常敵レベルが主人公レベル±1で、地域進行・県ボス推奨レベルと未接続']
      : []),
    ...(!hasBattleBudget ? ['戦闘時間、被ダメージ、回復消費、勝率の性能予算を自動検証していない'] : []),
  ];

  return {
    generatedFrom: [
      'content/items/*.json',
      'content/monsters/*.json',
      'src/core/progression/battleResult.ts',
    ],
    totals: { items: items.length, monsters: monsters.length },
    equipment: Object.fromEntries(
      equipmentKinds.map((kind) => [
        kind,
        {
          count: equipment[kind].length,
          ids: equipment[kind].map((item) => item.id),
          priced: equipment[kind].filter((item) => item.price !== undefined).length,
        },
      ]),
    ),
    weaponAcquisition: Object.fromEntries(
      equipment.weapon.map((weapon) => [
        weapon.id,
        {
          shop: areas.some((area) => area.shop?.some((entry) => entry.itemId === weapon.id)),
          mission: areas.some((area) =>
            area.missions?.some((mission) =>
              mission.reward?.items?.some((entry) => entry.itemId === weapon.id),
            ),
          ),
          recipe: recipes.some((recipe) => recipe.result.itemId === weapon.id),
        },
      ]),
    ),
    regionalLevels,
    monsters: tierSummary,
    findings,
    resolved: [
      ...(setupSource.includes('growth: HERO_GROWTH')
        ? ['主人公のXPレベルを実効ステータスと敵出現レベルへ反映']
        : []),
      ...(hasTohokuLevelCurve && overworldSource.includes('area.recommendedLevel')
        ? ['東北6県の推奨レベル帯を通常戦闘へ反映']
        : []),
      ...(hasBattleBudget ? ['青森の通常敵・中ボス・県ボスの想定ターン数を自動検証'] : []),
    ],
  };
}

function main(): void {
  const audit = auditBattleBalance();
  process.stdout.write(`${JSON.stringify(audit, null, 2)}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
