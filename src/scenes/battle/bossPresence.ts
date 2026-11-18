/**
 * ボスの 見せかた（Battle.ts から よぶ）。
 *   - 大きさ：ボスは 道の 上の 手前に 立ち、レイアウトの boss.maxHeight いっぱいまで 大きく する
 *   - オーラ：ふだんは 黒むらさきの かげが ゆらめく（いあつかん）。HP が 半分 いかで いかると（bossEnrage）
 *     赤い ほのおの オーラと 火の粉に かわる
 */
import Phaser from 'phaser';
import type { ContentIndex } from '../../core/content/loader';
import type { Monster } from '../../core/content/schemas';
import { FINE } from '../../rendering/battle/fine';
import { MONSTER_SIZE } from '../../rendering/battle/pixelArt';
import { monsterDisplaySize } from '../../rendering/menuArt';
import { BATTLE_SCALE as S, type BattleLayout } from './layout';

/**
 * モンスターの絵の大きさ：地方ボス 56 / 中ボス 40 / 県ボス 48 / 通常 32（ボス戦の 通常モンスターは 48）。
 * 地方ボスは world の島の bossId に なっている モンスター（北海道のように 県 id と 地方 id が
 * 同じ ところが あるので、area では 見分けない）
 */
export function enemySizeFor(
  def: Monster,
  content: Pick<ContentIndex, 'areas' | 'world'>,
  isBoss: boolean,
): number {
  const size = monsterDisplaySize(def, content);
  return size === MONSTER_SIZE.normal && isBoss ? MONSTER_SIZE.boss : size;
}

/** 敵の 絵の 倍率（もとの 1 ドットが 何 px か）。ボスは 上限の 高さまで 大きく */
export function enemyScaleFor(layout: BattleLayout, size: number, isBoss: boolean): number {
  const base = Math.max(2, S + layout.enemy.scaleStep);
  return isBoss ? Math.max(base, Math.floor(layout.boss.maxHeight / size)) : base;
}

const CALM = { tint: 0x5b1d8a, alpha: [0.45, 0.75], grow: [1.07, 1.12] } as const;
const RAGE = { tint: 0xff3a1a, alpha: [0.45, 0.85], grow: [1.1, 1.18] } as const;

/** ボスの うしろで ゆらめく オーラ（ボスの 絵と 同じ 形の かげ） */
export class BossAura {
  private readonly glow: Phaser.GameObjects.Image;
  private embers: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private look: typeof CALM | typeof RAGE = CALM;
  private t = 0;
  enraged = false;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly boss: Phaser.GameObjects.Image,
  ) {
    this.glow = scene.add
      .image(boss.x, boss.y, boss.texture.key)
      .setOrigin(0.5, 0.5)
      .setTintFill(CALM.tint)
      .setDepth(boss.depth - 0.5);
    this.update(0);
  }

  /** 毎フレーム：ボスに ついて いき、ゆっくり ふくらんだり しぼんだり する */
  update(delta: number): void {
    const b = this.boss;
    this.t += delta;
    if (this.glow.texture.key !== b.texture.key)
      this.glow.setTexture(b.texture.key).setTintFill(this.look.tint);
    // ドット絵らしく 8 段で 変える（なめらかに しない）
    const wave = Math.round(((Math.sin(this.t / (this.enraged ? 140 : 420)) + 1) / 2) * 8) / 8;
    const grow = this.look.grow[0] + (this.look.grow[1] - this.look.grow[0]) * wave;
    const cy = b.y - b.displayHeight / 2;
    this.glow
      .setPosition(b.x, cy)
      .setScale(b.scaleX * grow, b.scaleY * grow)
      .setAlpha(this.look.alpha[0] + (this.look.alpha[1] - this.look.alpha[0]) * wave)
      .setVisible(b.active && b.visible && b.alpha > 0.5);
    this.embers?.setPosition(b.x, cy);
    if (this.embers) this.embers.emitting = b.active && b.visible && b.alpha > 0.5;
  }

  /** いかり：赤い ほのおの オーラと、のぼって いく 火の粉 */
  enrage(): void {
    if (this.enraged) return;
    this.enraged = true;
    this.look = RAGE;
    this.glow.setTintFill(RAGE.tint).setBlendMode(Phaser.BlendModes.ADD);
    const b = this.boss;
    const w = b.displayWidth / 2;
    const h = b.displayHeight / 2;
    this.embers = this.scene.add
      .particles(b.x, b.y - h, 'bt.fx.px', {
        x: { min: -w, max: w },
        y: { min: -h * 0.4, max: h },
        speedY: { min: -150, max: -60 },
        speedX: { min: -16, max: 16 },
        lifespan: 900,
        frequency: 45,
        quantity: 1,
        scale: { start: (S * 1.5) / FINE, end: 0 },
        alpha: { start: 1, end: 0 },
        tint: [0xff3a1a, 0xff9e5e, 0xffd447],
        blendMode: Phaser.BlendModes.ADD,
      })
      .setDepth(b.depth + 0.5);
  }

  destroy(): void {
    this.glow.destroy();
    this.embers?.destroy();
  }
}
