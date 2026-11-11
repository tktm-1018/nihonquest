/**
 * マップの 県ごとの 見た目（試しに 青森から）。scripts/scaffold-maps.ts と scripts/maps/ が 使う。
 *   - TOWN_LOOKS：町に 足す 名物（大きな 山車・ビル・港の 船・市場・ちょうちんの 通り・ばらばらの 果樹園）
 *   - DUNGEON_LOOKS：ダンジョン・裏ステージの 見た目（床と かべの テーマ・湖・ボスへの 参道）
 *   - FIELD_LOOKS：フィールドの かざり・道しるべ・地名（近づくと 名前が 出る 山・湖・海・半島）
 * 書いていない 県は いままでの まま。ほかの 県へ 広げるときは ここに 書き足して `pnpm scaffold:maps` を 走らせる。
 * 緯度経度は geo.ts と 同じ [経度, 緯度]。
 */
import type { LonLat } from './geo.js';

/** 町に 足す 名物 */
export type TownFeature =
  /** 広場の まん中に 大きな ねぶたの 山車（4×3） */
  | 'bigNebuta'
  /** 北の 海ぞいに 三角の ビル（アスパム） */
  | 'aspam'
  /** 港に 青函連絡船（八甲田丸） */
  | 'ferry'
  /** 西の 草原に りんごの 屋台と りんご箱 */
  | 'appleMarket'
  /** 南北の 大通りに 金魚ねぶたの ちょうちん */
  | 'lanternStreet'
  /** 南の 果樹園を ごばんの 目では なく ばらばらに 植える */
  | 'looseOrchard';

export interface TownLook {
  features: TownFeature[];
  /** なぜ その 見た目か（実在の 名所・特産品） */
  note: string;
}

export const TOWN_LOOKS: Record<string, TownLook> = {
  aomori: {
    features: ['bigNebuta', 'aspam', 'ferry', 'appleMarket', 'lanternStreet', 'looseOrchard'],
    note: '青森ねぶた祭・青森港の アスパムと 八甲田丸・りんごの 市場',
  },
};

/** ダンジョンの 床と かべの テーマ（scaffold-maps.ts の THEMES に 無い 特別な もの） */
export type SpecialDungeonTheme = 'osorezan';

/** ボスの へやへの 参道：床（太鼓橋・じゅうたん）と、両がわに ならべる 物 */
export interface DungeonApproach {
  floor: 'bridge' | 'carpet';
  /** 参道の 両がわに たてる 物 */
  posts: 'pinwheel' | 'jizo' | 'brazier';
  /** ボスの まわりに おく 物 */
  ring?: 'cairn' | 'goldScreen';
  /** 参道の 手前の 通路を 1 マスはばの 橋に して、となりを 水に する（三途の川） */
  river?: boolean;
}

export interface DungeonLook {
  theme?: SpecialDungeonTheme;
  /** いちばん 大きな へやの まん中に 湖（通れない。まわりは 歩ける） */
  lake?: boolean;
  approach?: DungeonApproach;
  /** 床の ところどころを さくらの 花びらに */
  petals?: boolean;
  note: string;
}

/** キーは `<県>-dungeon` か `<県>-secret` */
export const DUNGEON_LOOKS: Record<string, DungeonLook> = {
  'aomori-dungeon': {
    theme: 'osorezan',
    lake: true,
    approach: { floor: 'bridge', posts: 'pinwheel', ring: 'cairn', river: true },
    note: '恐山：宇曽利湖・いおうの 砂地・風車と 積み石・三途の川の 太鼓橋',
  },
  'aomori-secret': {
    petals: true,
    approach: { floor: 'carpet', posts: 'brazier', ring: 'goldScreen' },
    note: '弘前城：さくらの 花びら・本丸への 赤い じゅうたん',
  },
};

/** フィールドの かざりを 特別な 場所に まとめて おく（寒立馬 など） */
export interface DecorSpot {
  kind: 'horse';
  at: LonLat;
  count: number;
}

/** 近づくと 名前が 出る 地形（山・湖・海・半島・みさき・川）。名所（★）とは べつ */
export interface GeoName {
  /** RubyText（地名は 漢字＋ルビ） */
  name: string;
  kind: 'mountain' | 'lake' | 'sea' | 'peninsula' | 'cape' | 'river';
  at: LonLat;
  /** 何マス 近づくと 出るか */
  radius: number;
}

export interface FieldLook {
  /** さかいの 山なみを 自然に（森・岩・雪の 山を まぜ、すそに 岩と しげみ）・果樹園の 木を ばらばらに */
  natural: boolean;
  /** 地面に あわせた かざり（かかし・りんご箱・ホタテ・流木・花・切り株・岩・漁船） */
  decor: boolean;
  /** 道の 分かれ道に 道しるべ（行き先の 方向） */
  signposts: boolean;
  /** 方角（小さな 地図に「きた」） */
  compass: boolean;
  spots: DecorSpot[];
  geoNames: GeoName[];
}

export const FIELD_LOOKS: Record<string, FieldLook> = {
  aomori: {
    natural: true,
    decor: true,
    signposts: true,
    compass: true,
    spots: [{ kind: 'horse', at: [141.455, 41.425], count: 3 }],
    geoNames: [
      { name: '岩木山[いわきさん]', kind: 'mountain', at: [140.303, 40.656], radius: 7 },
      { name: '八甲田山[はっこうださん]', kind: 'mountain', at: [140.877, 40.659], radius: 7 },
      { name: '陸奥湾[むつわん]', kind: 'sea', at: [140.95, 41.0], radius: 9 },
      { name: '小川原湖[おがわらこ]', kind: 'lake', at: [141.33, 40.79], radius: 6 },
      { name: '岩木川[いわきがわ]', kind: 'river', at: [140.42, 40.86], radius: 5 },
      { name: '津軽半島[つがるはんとう]', kind: 'peninsula', at: [140.48, 41.05], radius: 8 },
      { name: '下北半島[しもきたはんとう]', kind: 'peninsula', at: [141.2, 41.25], radius: 8 },
      { name: '竜飛崎[たっぴざき]', kind: 'cape', at: [140.345, 41.255], radius: 5 },
      { name: '尻屋崎[しりやざき]', kind: 'cape', at: [141.46, 41.43], radius: 5 },
    ],
  },
};
