import type { CommandOption } from '../../ui/battle/store';

/** 「しばり」中は、同じ必殺技を選ぶ入口だけを残す。 */
export function lockedCommandOptions(active: boolean): CommandOption[] | null {
  if (!active) return null;
  return [
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
