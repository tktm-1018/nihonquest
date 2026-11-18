import { BACKDROP_SCALE } from '../../rendering/battle/pixelArt';

export const BATTLE_SCALE = BACKDROP_SCALE;
export type BattlePresentation = 'side' | 'depth' | 'front';

export interface BattleLayout {
  enemy: { x: number; y: number; scaleStep: number };
  hero: { x: number; y: number; scale: number };
  partner: { x: number; y: number; scale: number };
  /** ボス戦の 敵：道の 上の 手前に 立ち、この 高さ（px）まで 大きく する（bossPresence.ts） */
  boss: { x: number; y: number; maxHeight: number };
}

/**
 * むかしの サイドビュー RPG：敵（左）と 味方（右）は 同じ 地面の 線（y）に 横ならびで 向きあう。
 * 絵の 1 ドットは みんな 同じ 大きさ（BATTLE_SCALE）。遠近は つけない。下の 帯（148px）の 上に 立つ。
 */
const GROUND_Y = 360;
const SIDE_LAYOUT: BattleLayout = {
  enemy: { x: 250, y: GROUND_Y, scaleStep: 0 },
  hero: { x: 690, y: GROUND_Y, scale: BATTLE_SCALE },
  partner: { x: 810, y: GROUND_Y, scale: BATTLE_SCALE },
  boss: { x: 260, y: GROUND_Y, maxHeight: 300 },
};

/** 敵を奥、味方を手前に置く比較用の試作レイアウト。戦闘ロジックには影響しない。 */
const DEPTH_LAYOUT: BattleLayout = {
  enemy: { x: 300, y: 286, scaleStep: -1 },
  hero: { x: 676, y: 432, scale: BATTLE_SCALE + 1 },
  partner: { x: 828, y: 404, scale: BATTLE_SCALE + 1 },
  boss: { x: 280, y: 392, maxHeight: 290 },
};

/**
 * モンスター RPG ふう（front）：敵は 右おくの 台に 正面むき、主人公は 左てまえに 後ろすがたで 敵の ほうを むく。
 * 仲間は 主人公の となり。ドットの 大きさは みんな 同じ（BATTLE_SCALE）。台は 遠近の かわりに 大きさで 分ける
 */
const FRONT_LAYOUT: BattleLayout = {
  enemy: { x: 690, y: 268, scaleStep: 0 },
  hero: { x: 200, y: 446, scale: BATTLE_SCALE },
  partner: { x: 340, y: 440, scale: BATTLE_SCALE },
  boss: { x: 690, y: 272, maxHeight: 230 },
};

/** isBoss の ときは 敵の 立つ 場所を boss の 場所に する */
export function battleLayout(presentation: BattlePresentation = 'front', isBoss = false): BattleLayout {
  const layout =
    presentation === 'depth' ? DEPTH_LAYOUT : presentation === 'side' ? SIDE_LAYOUT : FRONT_LAYOUT;
  return isBoss ? { ...layout, enemy: { ...layout.enemy, x: layout.boss.x, y: layout.boss.y } } : layout;
}
export const READY_STEP = 24;
export const OFF_RIGHT = 1080;

export const LOG_BASE_MS = 350;
export const LOG_CHAR_MS = 30;
export const LOG_MAX_MS = 1300;
