/**
 * ボスの「？」マーク（足もとの オーラ・光の わっか・立ちのぼる 光の つぶ）。中ボス・エリアの ぬし・県ボス・ラスボスで 同じ。
 * x・y は マスの まん中（ピクセル）。消すときは parts を destroy し、sparks を remove する
 */
import type Phaser from 'phaser';
import type { Rng } from '../../core/rng';

export function addBossMarkerArt(
  scene: Phaser.Scene,
  x: number,
  y: number,
  rng: Rng,
): { parts: Phaser.GameObjects.GameObject[]; sparks: Phaser.Time.TimerEvent } {
  const aura = scene.add.image(x, y + 5, 'fld.boss.aura').setDepth(2);
  scene.tweens.add({
    targets: aura,
    alpha: 0.35,
    yoyo: true,
    repeat: -1,
    duration: 500,
    ease: 'Stepped',
    easeParams: [2],
  });
  const glow = scene.add
    .image(x, y - 1, 'fld.boss.glow')
    .setAlpha(0.45)
    .setDepth(y - 2);
  scene.tweens.add({
    targets: glow,
    alpha: 0.2,
    yoyo: true,
    repeat: -1,
    duration: 450,
    ease: 'Stepped',
    easeParams: [3],
  });
  const halo = scene.add.image(x, y - 1, 'fld.boss.halo').setDepth(y - 1);
  const mark = scene.add.image(x, y - 1, 'fld.boss.q').setDepth(y);
  scene.tweens.add({
    targets: [mark, halo, glow],
    y: y - 3,
    yoyo: true,
    repeat: -1,
    duration: 500,
    ease: 'Stepped',
    easeParams: [2],
  });
  scene.tweens.add({
    targets: halo,
    alpha: 0.4,
    yoyo: true,
    repeat: -1,
    duration: 350,
    ease: 'Stepped',
    easeParams: [2],
  });
  // 光のつぶが、ときどき足もとから立ちのぼって消える
  const sparks = scene.time.addEvent({
    delay: 260,
    loop: true,
    callback: () => {
      const s = scene.add.image(x + rng.int(-9, 9), y + rng.int(-2, 5), 'fld.boss.spark').setDepth(y + 1);
      scene.tweens.add({
        targets: s,
        y: s.y - 16,
        alpha: 0,
        duration: 700,
        ease: 'Stepped',
        easeParams: [7],
        onComplete: () => s.destroy(),
      });
    },
  });
  return { parts: [aura, glow, halo, mark], sparks };
}
