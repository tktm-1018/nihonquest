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
