import type Phaser from 'phaser';
import { monsterBackArt } from '../../rendering/monsters/backView';

/**
 * モンスターの テクスチャ key から、うしろ姿の テクスチャ（`<key>.back`）を 作って key を かえす。
 * front の 戦闘で 主人公の となりに 立つ 仲間が、主人公と おなじく 敵の ほう（おく）を むく
 */
export function backTexture(textures: Phaser.Textures.TextureManager, key: string): string {
  const back = `${key}.back`;
  if (!textures.exists(back))
    textures.addCanvas(back, monsterBackArt(textures.get(key).getSourceImage() as HTMLCanvasElement));
  return back;
}
