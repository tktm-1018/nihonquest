/** フィールド上の しかけ（宝箱・中ボス・関所・ワープ・看板など）の 型（Overworld.ts から 分割）。 */
import type Phaser from 'phaser';
import type { Area, Monster, Motif, Region } from '../../core/content/schemas';
import type { NextStop } from '../../core/progression/route';

export interface FieldTrigger {
  id: string;
  /** 近づいただけで始めるか（once のイベント・取ったスタンプは false） */
  auto: () => boolean;
  run: () => Promise<void>;
}

export interface Chest {
  key: string;
  itemId: string;
  itemName: string;
  count: number;
  sprite: Phaser.GameObjects.Image;
  /** 特産品の宝箱（あけると 特産品の説明が出て、その特産品が もらえる） */
  specialty?: { area: Area; motif: Motif; stamp: string };
}

export interface MidBoss {
  tile: number;
  def: Monster;
  parts: Phaser.GameObjects.GameObject[];
  /** オーラの光のつぶを出しつづけるタイマー */
  sparks: Phaser.Time.TimerEvent;
}

/** 名所エリアの 関所（エリアの さかいの 門。openedBy の エリアの ぬしを たおすと ひらく） */
export interface RegionGate {
  tile: number;
  between: [string, string];
  openedBy: string;
  sprite: Phaser.GameObjects.Image;
}

/** 名所エリアの ぬし（名所の そばに 立つ「？」マーク） */
export interface RegionBoss {
  regionId: string;
  region: Region;
  boss: MidBoss;
}

export interface Warp {
  tile: number;
  to: NextStop;
  toName: string;
}

/** 名所の ★ 看板 */
export interface Sign {
  /** dex.motifs に入る名所スタンプ。持っている＝その名所を見つけた */
  stamp: string;
  found: () => boolean;
  /** 見つけた・チャレンジを終えた あとに、★ の色と「！」をいまの進みぐあいに合わせる */
  refresh: () => void;
}
