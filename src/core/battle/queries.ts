/**
 * バトル状態への 読み取り専用の 問い合わせ（engine.ts から 分割）。純粋関数だけ。
 */
import type { Item, Skill } from '../content/schemas';
import type { BattleState, Combatant, TargetType } from './types';

/** 必殺技の 対象。targetType を 省略したら effect から（かいふく・まもりは 自分、ほかは 敵） */
export function skillTarget(sk: Pick<Skill, 'targetType' | 'effect'>): TargetType {
  return sk.targetType ?? (sk.effect === 'heal' || sk.effect === 'buff' ? 'self' : 'singleEnemy');
}

/** その 必殺技を いま 打てるか（教科ゲージが costGauge 以上） */
export function canAfford(s: BattleState, sk: Pick<Skill, 'id' | 'subject' | 'costGauge'>): boolean {
  if (s.player.skillLock?.skillId === sk.id) return true;
  return s.player.subjectGauges[sk.subject] >= sk.costGauge;
}

/** 主人公が いま コマンドを 出せるか（ターン制：たたかいが つづいて いて たおれて いなければ いつでも） */
export function isHeroReady(s: BattleState): boolean {
  return s.outcome === 'ongoing' && s.ally.hero.hp > 0;
}

/** 敵が ねらう 相手：前に 立つ オトモ。いなければ 主人公 */
export function frontAlly(s: BattleState): Combatant {
  const m = s.ally.monsters[s.ally.activeMonsterIndex];
  return m && m.hp > 0 ? m : s.ally.hero;
}

/** HP の 割合が いちばん 低い 味方（どうぐは この 味方に 使う） */
export function weakestAlly(s: BattleState): Combatant {
  const front = frontAlly(s);
  const r = (c: Combatant) => c.hp / Math.max(1, c.stats.hp);
  return front !== s.ally.hero && r(front) < r(s.ally.hero) ? front : s.ally.hero;
}

/** 戦闘の自動対象に、回復どうぐの効果が実際にあるか。 */
export function canUseBattleItem(s: BattleState, item: Item): boolean {
  if (item.kind !== 'consumable' || !item.use) return false;
  if (item.use.recruit) return true;
  const target = weakestAlly(s);
  return (!!item.use.heal && target.hp < target.stats.hp) || (!!item.use.mp && target.mp < target.stats.mp);
}
