import type Phaser from 'phaser';
import { BATTLE_POSE } from '../../rendering/characters';
import type { SwingKind } from './motions';

type Sprite = Phaser.GameObjects.Image;

/** 主人公の「たたかう」に 要る 舞台の 道具（Battle シーンが わたす） */
export interface StrikeStage {
  /** モンスター RPG ふう（front）：主人公は 左てまえで、敵は 右おく */
  front: boolean;
  sprite: Sprite;
  home: { x: number; y: number };
  /** サイドビューで 主人公が 切りかかる ときに 立つ 場所の 基準（敵の 前） */
  enemyFront: number;
  walk(x: number, ms: number): Promise<void>;
  hopTo(x: number, h: number, ms: number): Promise<void>;
  tween(cfg: Phaser.Types.Tweens.TweenBuilderConfig): Promise<void>;
  stopBob(): void;
  /** 斬る 光（3 コマ）。flipX は 向き、flipY は 上から 切りおろす */
  slash(flipX: boolean, flipY: boolean): Promise<void>;
  swing(kind: SwingKind): Promise<void>;
  sfx(): void;
  later(ms: number, fn: () => void): void;
  /** もどった あと：立ちの コマ・生きていれば ゆらゆら */
  settle(): void;
}

const SWINGS: readonly SwingKind[] = ['cross', 'thrust', 'spin'];

/**
 * 主人公の「たたかう」：5 しゅるいを じゅんばんに（k = 0 横切り・1 ジャンプ切り・2 二連切り・3 つき・4 回転切り）。
 *  - サイドビュー：敵の 前まで 走って（ジャンプ切りは とびあがって、つきは ふみこんで）斬る
 *  - front：敵の ほうへ ななめに ふみこんで 斬る（右おくの 敵までは 行かない）
 * もどるのは ダメージの 演出と 同時（待たない）
 */
export async function heroStrike(st: StrikeStage, k: number): Promise<void> {
  const { sprite: sp, home } = st;
  const jump = k === 1;
  const kind = k >= 2 ? SWINGS[k - 2]! : null;
  if (st.front) {
    st.stopBob();
    sp.setFrame(BATTLE_POSE.attack);
    await st.tween({
      targets: sp,
      x: home.x + 64,
      y: home.y - (jump ? 56 : 24),
      duration: 150,
      ease: 'Quad.easeOut',
    });
  } else {
    const reach = jump ? 190 : kind === 'thrust' ? 200 : 136;
    await st.walk(st.enemyFront + reach, jump ? 220 : kind === 'thrust' ? 200 : 260);
    sp.setFrame(BATTLE_POSE.attack);
    if (jump) await st.hopTo(st.enemyFront + 128, 22, 260);
    if (kind === 'thrust') await st.hopTo(st.enemyFront + 150, 2, 100);
  }
  st.sfx();
  if (kind === 'cross') st.later(150, () => st.sfx());
  await (kind ? st.swing(kind) : st.slash(st.front, jump));
  const back = st.front
    ? st.tween({ targets: sp, x: home.x, y: home.y, duration: 220, ease: 'Quad.easeIn' })
    : st.walk(home.x, jump ? 300 : kind ? 280 : 260);
  void back.then(() => {
    if (sp.active) st.settle();
  });
}
