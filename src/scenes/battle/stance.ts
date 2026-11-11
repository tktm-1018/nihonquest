/**
 * こうげき前の かまえ（Battle.ts から よぶ）。
 * 手描きの 絵に `<id>.atk`（ボスの 第 2 形態は `<id>.p<番号>.atk`）が ある モンスターは、こうげき・わざの 直前に
 * その 絵に きりかえて 少し ためを 見せ、おわったら ふだんの 絵に もどす。かまえの 絵が ない モンスターは なにも しない。
 */
import type Phaser from 'phaser';
import { asFine } from '../../rendering/battle/fine';
import { designedMonsterArt, hasMonsterDesign } from '../../rendering/monsters';

/** かまえを 見せる 時間（ミリ秒） */
const STANCE_MS = 280;

/** テクスチャの キー → その 絵の もとの モンスター id と フェーズ（monsterTexture で 登録） */
const sources = new Map<string, { id: string; suffix: string }>();

export function registerStanceSource(textureKey: string, id: string, suffix: string): void {
  sources.set(textureKey, { id, suffix });
}

/**
 * sp を こうげき前の かまえに して STANCE_MS まつ。もどす 関数を かえす（かまえが ない ときは 何も しない 関数）
 */
export async function attackStance(scene: Phaser.Scene, sp: Phaser.GameObjects.Image): Promise<() => void> {
  const base = sp.texture.key;
  const src = sources.get(base);
  const suffix = `${src?.suffix ?? ''}.atk`;
  if (!src || !hasMonsterDesign(`${src.id}${suffix}`)) return () => undefined;
  const key = `${base}.atk`;
  if (!scene.textures.exists(key)) {
    const art = designedMonsterArt(src.id, suffix);
    if (!art) return () => undefined;
    scene.textures.addCanvas(key, asFine(art));
  }
  sp.setTexture(key);
  await new Promise<void>((resolve) => scene.time.delayedCall(STANCE_MS, () => resolve()));
  return () => {
    if (sp.active && sp.texture.key === key) sp.setTexture(base);
  };
}
