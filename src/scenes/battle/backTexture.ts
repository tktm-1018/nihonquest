import type Phaser from 'phaser';
import { asFine } from '../../rendering/battle/fine';
import { designedMonsterArt } from '../../rendering/monsters';
import { monsterBackArt } from '../../rendering/monsters/backView';

/**
 * モンスターの うしろ姿の テクスチャ（`<key>.back`）を 作って key を かえす。
 * front の 戦闘で 主人公の となりに 立つ 仲間が、主人公と おなじく 敵の ほう（おく）を むく。
 * 手で 描いた うしろ姿（`<id>.back`）が あれば それを、なければ 正面の 絵から 自動で 作る
 */
export function backTexture(textures: Phaser.Textures.TextureManager, key: string, id: string): string {
  const back = `${key}.back`;
  if (!textures.exists(back)) {
    const drawn = designedMonsterArt(id, '.back');
    textures.addCanvas(
      back,
      drawn ? asFine(drawn) : monsterBackArt(textures.get(key).getSourceImage() as HTMLCanvasElement),
    );
  }
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
