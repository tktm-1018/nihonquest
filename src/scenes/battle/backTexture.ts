import type Phaser from 'phaser';
import type { Monster } from '../../core/content/schemas';
import { asFine } from '../../rendering/battle/fine';
import { MONSTER_SIZE, monsterArt } from '../../rendering/battle/pixelArt';
import { designedMonsterArt, hasMonsterDesign } from '../../rendering/monsters';
import { monsterBackArt } from '../../rendering/monsters/backView';

/**
 * モンスターの うしろ姿の テクスチャ（`<key>.back`）を 作って key を かえす。
 * front の 戦闘で 主人公の となりに 立つ 仲間が、主人公と おなじく 敵の ほう（おく）を むく。
 *  - 手で 描いた うしろ姿（`<id>.back`）が あれば それ
 *  - 手描きの 正面しか ない ときは、正面の 絵から 自動で 作る（backView.ts）
 *  - 手描きの 絵が ない（自動生成の）モンスターは、生成の ときに 顔の かわりに しっぽを 描く
 */
export function backTexture(textures: Phaser.Textures.TextureManager, key: string, def: Monster): string {
  const back = `${key}.back`;
  if (textures.exists(back)) return back;
  const drawn = designedMonsterArt(def.id, '.back');
  const art = drawn
    ? asFine(drawn)
    : hasMonsterDesign(def.id)
      ? monsterBackArt(textures.get(key).getSourceImage() as HTMLCanvasElement)
      : asFine(monsterArt(def.id, { element: def.element, size: MONSTER_SIZE.normal, back: true }));
  textures.addCanvas(back, art);
  return back;
}

/**
 * 勝った ときなど、うしろ姿の 仲間を こちら（正面）に ふりむかせる。sp を そのまま かえす。
 * 正面の 絵は 右むきに 描いて あり、こちらを むいた 敵と 同じく 左右を 反転して、右手に 持つ ものを 右手の まま に する
 */
export function faceFront<T extends Phaser.GameObjects.Image>(sp: T): T {
  const key = sp.texture.key;
  if (key.endsWith('.back')) sp.setTexture(key.slice(0, -'.back'.length)).setFlipX(true);
  return sp;
}
