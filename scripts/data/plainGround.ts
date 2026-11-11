/**
 * フィールドの 地面を「草原＋その土地の 特色」だけに する 県（scripts/plain-ground.ts が つかう）。
 * keep：県じゅうで 残す 地面。regions：名所エリア（content の regions の id）ごとに 残す 地面。
 * 書いて いない 地面（山・森・砂浜・水辺・たんぼ など）は 草原に なる。
 * 地面の 名前は src/core/world/ground.ts の Ground に、orchard（果樹園）・sakura（さくらの 木）・volcano（恐山の 砂地と ゆけむり）を 足したもの
 */
export type PlainKeep =
  'forest' | 'mountain' | 'beach' | 'shore' | 'paddy' | 'orchard' | 'sakura' | 'volcano';

export interface PlainGroundLook {
  keep: PlainKeep[];
  regions: Record<string, PlainKeep[]>;
  /** エリアの 中で ほかの 地面に 置きかえる もの（十和田湖の まわりの 山 → 森） */
  replace?: Record<string, Partial<Record<PlainKeep, PlainKeep>>>;
}

export const PLAIN_GROUND: Record<string, PlainGroundLook> = {
  aomori: {
    // りんごは 青森 ぜんたいの 特産品
    keep: ['orchard'],
    regions: {
      tsugaru: ['beach'], // 津軽海峡
      hirosaki: ['sakura'], // 弘前城の さくら
      shirakami: ['forest', 'mountain'], // 白神山地の ブナの 森
      towada: ['forest', 'shore'], // 十和田湖と まわりの 森
      oirase: ['forest', 'mountain'], // 奥入瀬渓流の 森
      osorezan: ['volcano'], // 恐山の 砂地と ゆけむり
      oma: ['beach'], // 大間の まぐろ漁の 浜
    },
    replace: { towada: { mountain: 'forest' } },
  },
};
