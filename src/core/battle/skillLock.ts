import type { Skill } from '../content/schemas';
import type { BattleEvent, BattleState, Command } from './types';

/** 「しばり」技（selfLockTurns）を つづけて 打っている ところか。2回目からは ゲージを つかわない */
export const isContinuingLock = (s: BattleState, sk: Pick<Skill, 'id'>): boolean =>
  s.player.skillLock?.skillId === sk.id;

/** その 必殺技を いま 打てるか（教科ゲージが costGauge 以上、または「しばり」の 2回目から） */
export function canAfford(s: BattleState, sk: Pick<Skill, 'id' | 'subject' | 'costGauge'>): boolean {
  if (isContinuingLock(s, sk)) return true;
  return s.player.subjectGauges[sk.subject] >= sk.costGauge;
}

/** 「しばり」中は、主人公が 同じ 技を 打つ コマンドしか うけつけない（act の 入口で はじく） */
export function lockRejects(s: BattleState, command: Command): boolean {
  const lock = s.player.skillLock;
  if (!lock) return false;
  return (
    command.kind !== 'skill' ||
    command.skillId !== lock.skillId ||
    (command.actorId !== undefined && command.actorId !== s.ally.hero.id)
  );
}

/** 技を 打った あとに、のこりの「しばり」ターンを すすめる */
export function advanceSkillLock(
  s: BattleState,
  sk: Pick<Skill, 'id' | 'selfLockTurns'>,
  continuing: boolean,
  ev: BattleEvent[],
): void {
  if (!sk.selfLockTurns) return;
  const p = s.player;
  const remain = continuing ? Math.max(0, (p.skillLock?.turns ?? 1) - 1) : sk.selfLockTurns - 1;
  p.skillLock = remain > 0 ? { skillId: sk.id, turns: remain } : null;
  ev.push({ t: 'skillLock', skillId: sk.id, remain });
}
