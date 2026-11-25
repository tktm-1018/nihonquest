import type { BackdropPad } from '../../rendering/battle/pixelArt';
import { BATTLE_SCALE as S, type BattleLayout } from './layout';

/**
 * モンスター RPG ふう（front）：背景に しく 立つ 場所（敵と、主人公・仲間の 足もと）。
 * 背景の ドット単位（画面 px ÷ BATTLE_SCALE）。enemyWidth は 敵の 絵の 横はば（px）
 */
export function backdropPads(layout: BattleLayout, enemyWidth: number): BackdropPad[] {
  const dot = (v: number) => Math.round(v / S);
  const foeW = Math.max(68, Math.round((enemyWidth * 1.3) / S / 2) * 2);
  const partyW = dot(layout.partner.x - layout.hero.x) + 64;
  return [
    { x: dot(layout.enemy.x), y: dot(layout.enemy.y) - 1, w: foeW },
    {
      x: dot((layout.hero.x + layout.partner.x) / 2),
      y: dot(Math.max(layout.hero.y, layout.partner.y)) - 1,
      w: partyW,
    },
  ];
}
