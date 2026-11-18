import { BACKDROP_SCALE } from '../../rendering/battle/pixelArt';

export const BATTLE_SCALE = BACKDROP_SCALE;
export type BattlePresentation = 'side' | 'depth';

export interface BattleLayout {
  enemy: { x: number; y: number; scaleStep: number };
  hero: { x: number; y: number; scale: number };
  partner: { x: number; y: number; scale: number };
  /** ボス戦の 敵：道の 上の 手前に 立ち、この 高さ（px）まで 大きく する（bossPresence.ts） */
  boss: { x: number; y: number; maxHeight: number };
}

const SIDE_LAYOUT: BattleLayout = {
  enemy: { x: 250, y: 380, scaleStep: 0 },
  hero: { x: 690, y: 388, scale: BATTLE_SCALE },
  partner: { x: 820, y: 356, scale: BATTLE_SCALE },
  boss: { x: 260, y: 392, maxHeight: 290 },
};

/** 敵を奥、味方を手前に置く比較用の試作レイアウト。戦闘ロジックには影響しない。 */
const DEPTH_LAYOUT: BattleLayout = {
  enemy: { x: 300, y: 286, scaleStep: -1 },
  hero: { x: 676, y: 432, scale: BATTLE_SCALE + 1 },
  partner: { x: 828, y: 404, scale: BATTLE_SCALE + 1 },
  boss: { x: 280, y: 392, maxHeight: 290 },
};

/** isBoss の ときは 敵の 立つ 場所を boss の 場所に する */
export function battleLayout(presentation: BattlePresentation = 'depth', isBoss = false): BattleLayout {
  const layout = presentation === 'depth' ? DEPTH_LAYOUT : SIDE_LAYOUT;
  return isBoss ? { ...layout, enemy: { ...layout.enemy, x: layout.boss.x, y: layout.boss.y } } : layout;
}
export const READY_STEP = 24;
export const OFF_RIGHT = 1080;

export const LOG_BASE_MS = 350;
export const LOG_CHAR_MS = 30;
export const LOG_MAX_MS = 1300;
