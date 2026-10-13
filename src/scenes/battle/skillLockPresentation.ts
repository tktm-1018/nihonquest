import type { Skill } from '../../core/content/schemas';
import type { BattleSkill } from '../../core/battle/engine';
import type { BattleState } from '../../core/battle/types';
import type { QuestionQuery } from '../../questions/contracts';
import type { CommandOption } from '../../ui/battle/store';
import type { SkillOption } from '../../ui/battle/store';

export function buildSkillOptions(
  entries: BattleSkill[],
  state: BattleState,
  helpers: {
    nameOf: (id: string) => string;
    queryFor: (skill: Skill) => QuestionQuery;
    hasQuestion: (skill: Skill) => boolean;
    canAfford: (skill: Skill) => boolean;
    lockedReason: string;
    preparingReason: string;
  },
): SkillOption[] {
  const lock = state.player.skillLock;
  return entries.map(({ skill, actorId }) => {
    const noQuestion = !helpers.hasQuestion(skill);
    const lockedOut = !!lock && (skill.id !== lock.skillId || actorId !== state.ally.hero.id);
    return {
      key: `${actorId}:${skill.id}`,
      id: skill.id,
      actorId,
      by: actorId === state.ally.hero.id ? undefined : helpers.nameOf(actorId),
      name: skill.name,
      subject: skill.subject,
      gradeRange: helpers.queryFor(skill).gradeRange,
      element: skill.element,
      stars: skill.gauge,
      cost: lock?.skillId === skill.id ? 0 : skill.costGauge,
      have: state.player.subjectGauges[skill.subject],
      effect: skill.effect,
      flavor: skill.flavor,
      disabled: lockedOut || noQuestion || !helpers.canAfford(skill),
      reason: lockedOut ? helpers.lockedReason : noQuestion ? helpers.preparingReason : undefined,
    };
  });
}

/** 「しばり」中は、同じ必殺技を選ぶ入口だけを残す。 */
export function lockedCommandOptions(active: boolean): CommandOption[] | null {
  if (!active) return null;
  return [
    { kind: 'attack', disabled: true },
    { kind: 'skill', disabled: false, glow: true },
    { kind: 'item', disabled: true },
    { kind: 'swap', disabled: true },
    { kind: 'flee', disabled: true },
  ];
}

/** Scene が翻訳文言の分岐を持たないための表示モデル。 */
export function skillLockBanner(
  remain: number,
  translate: (key: string, vars?: { n: number }) => string,
): { title: string; detail?: string } {
  return remain > 0
    ? {
        title: translate('battle.skillLockBanner'),
        detail: translate('battle.skillLockRemain', { n: remain }),
      }
    : { title: translate('battle.skillLockEnd') };
}
