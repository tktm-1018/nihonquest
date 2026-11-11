/**
 * ボスが ダメージを うけた あとの 変化（engine.ts から よぶ）。
 *   - フェーズ移行：content の bossPhases（HP 割合で わざ・すがたが かわる）
 *   - いかり：ボス戦で HP が 半分 いかに なると、オーラを まとって こうげきが 少し あがる（1 回だけ）
 */
import type { Monster } from '../content/schemas';
import type { BattleEvent, BattleState, EnemyUnit } from './types';

/** この HP 割合 いかで いかる */
export const ENRAGE_HP_RATIO = 0.5;
/** いかった あとの こうげき（文系・理系）の 倍率 */
export const ENRAGE_ATK_MULT = 1.2;

/** ボスのフェーズ移行（HP 割合で切り替わる）。ターン制では わざ・すがたが かわる（行動の 回数は かわらない） */
function checkBossPhase(enemy: EnemyUnit, monsters: Map<string, Monster>, ev: BattleEvent[]): void {
  if (!enemy.isBoss) return;
  const phases = monsters.get(enemy.refId)?.bossPhases ?? [];
  const ratio = enemy.hp / enemy.stats.hp;
  for (let i = enemy.phaseIndex + 1; i < phases.length; i++) {
    const p = phases[i]!;
    if (ratio > p.hpBelow) continue;
    enemy.phaseIndex = i;
    if (p.skills) enemy.skills = p.skills;
    if (p.element) enemy.element = p.element;
    ev.push({ t: 'bossPhase', phaseIndex: i, line: p.line });
  }
}

/** ボス戦の いかり：HP が 半分 いかで 1 回だけ。こうげきを ENRAGE_ATK_MULT 倍に する */
function checkEnrage(s: BattleState, ev: BattleEvent[]): void {
  const enemy = s.enemy;
  if (!s.isBossBattle || enemy.enraged || enemy.hp <= 0) return;
  if (enemy.hp > enemy.stats.hp * ENRAGE_HP_RATIO) return;
  enemy.enraged = true;
  enemy.stats = {
    ...enemy.stats,
    scienceAtk: Math.ceil(enemy.stats.scienceAtk * ENRAGE_ATK_MULT),
    humanitiesAtk: Math.ceil(enemy.stats.humanitiesAtk * ENRAGE_ATK_MULT),
  };
  ev.push({ t: 'bossEnrage' });
}

/** 味方の こうげきで 敵が ダメージを うけた あと（敵が まだ 立って いる とき） */
export function bossReactions(s: BattleState, monsters: Map<string, Monster>, ev: BattleEvent[]): void {
  checkBossPhase(s.enemy, monsters, ev);
  checkEnrage(s, ev);
}
