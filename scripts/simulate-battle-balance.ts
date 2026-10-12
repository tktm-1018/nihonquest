import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { computeDamage } from '../src/core/battle/damage';
import { makeHero, makeMonster } from '../src/core/battle/factory';
import { HERO_GROWTH } from '../src/core/battle/setup';
import type { ElementTable, EquipSet, Item, Monster, Settings } from '../src/core/content/schemas';
import { createRng } from '../src/core/rng';

const ROOT = resolve(import.meta.dirname, '..');
const read = <T>(path: string): T => JSON.parse(readFileSync(resolve(ROOT, path), 'utf8')) as T;
const readDirectory = <T>(path: string): T[] =>
  readdirSync(resolve(ROOT, path))
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => read<T>(`${path}/${name}`));

export interface BattleBudgetScenario {
  enemyId: string;
  level: number;
  weaponId: string;
  weaknessRevealed?: boolean;
}

export interface BattleBudgetResult extends BattleBudgetScenario {
  heroHp: number;
  enemyHp: number;
  heroDamage: number;
  enemyDamage: number;
  turnsToWin: number;
  turnsToFall: number;
}

export function simulateBattleBudget(scenario: BattleBudgetScenario): BattleBudgetResult {
  const items = new Map(readDirectory<Item>('content/items').map((item) => [item.id, item]));
  const sets = new Map(read<EquipSet[]>('content/sets.json').map((set) => [set.id, set]));
  const monsters = new Map(
    readDirectory<Monster>('content/monsters').map((monster) => [monster.id, monster]),
  );
  const settings = read<Settings>('content/balance/settings.json');
  const elements = read<ElementTable>('content/balance/elements.json');
  const enemyDefinition = monsters.get(scenario.enemyId);
  if (!enemyDefinition) throw new Error(`unknown enemy: ${scenario.enemyId}`);
  if (!items.has(scenario.weaponId)) throw new Error(`unknown weapon: ${scenario.weaponId}`);

  const hero = makeHero(
    {
      name: 'ハル',
      level: scenario.level,
      baseStats: { hp: 40, mp: 10, atk: 8, def: 6, spd: 7, wis: 5 },
      growth: HERO_GROWTH,
      skills: [],
      equipment: { weapon: scenario.weaponId },
    },
    items,
    sets,
  );
  const enemy = makeMonster(enemyDefinition, scenario.level, 'budget-enemy');
  enemy.weaknessRevealed = scenario.weaknessRevealed ?? false;

  const heroDamage = computeDamage({
    attacker: hero,
    defender: enemy,
    skill: null,
    score: null,
    combo: 0,
    canCrit: false,
    settings,
    elements,
    rng: createRng('budget-hero'),
  }).amount;
  const enemyDamage = computeDamage({
    attacker: enemy,
    defender: hero,
    skill: null,
    score: null,
    combo: 0,
    canCrit: false,
    settings,
    elements,
    rng: createRng('budget-enemy'),
  }).amount;

  return {
    ...scenario,
    heroHp: hero.stats.hp,
    enemyHp: enemy.stats.hp,
    heroDamage,
    enemyDamage,
    turnsToWin: Math.ceil(enemy.stats.hp / heroDamage),
    turnsToFall: Math.ceil(hero.stats.hp / enemyDamage),
  };
}

export function aomoriBattleBudget(): BattleBudgetResult[] {
  const scenarios: BattleBudgetScenario[] = [
    { enemyId: 'aomori-ringoron', level: 1, weaponId: 'common-dou-no-ken' },
    { enemyId: 'aomori-doguukun', level: 2, weaponId: 'aomori-nebuta-no-uchiwa' },
    { enemyId: 'aomori-midboss-nebuta-taisho', level: 3, weaponId: 'common-dou-no-ken' },
    {
      enemyId: 'aomori-boss-tsugaru-no-nushi',
      level: 5,
      weaponId: 'aomori-hiba-no-tsue',
      weaknessRevealed: true,
    },
  ];
  return scenarios.map(simulateBattleBudget);
}

function main(): void {
  process.stdout.write(`${JSON.stringify(aomoriBattleBudget(), null, 2)}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
