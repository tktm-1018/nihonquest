/**
 * 県ごとの 特別な タイルの 番号（タイルセット 'overworld-tiles' の 321〜。1 から 数える Tiled の 番号）。
 * 絵は src/rendering/overworld/specialTiles.ts、置き場所は scripts/maps/ の 町・ダンジョン・フィールドの かざり。
 * 2×2 など 大きな物は 左上の 番号から 行ごとに つづく（block）。
 */
export const SP = {
  // ───── 町（青森）：ねぶた・アスパム・八甲田丸・りんご市場 ─────
  /** 大きな ねぶたの 山車（4×3：321〜332） */
  nebuta: 321,
  /** 三角の ビル（アスパム。3×3：333〜341） */
  aspam: 333,
  /** 青函連絡船 八甲田丸（4×2：342〜349。海の 上） */
  ferry: 342,
  /** りんご箱 */
  appleCrate: 350,
  /** りんごの 屋台 */
  appleStall: 351,
  /** 金魚ねぶた（ちょうちん） */
  kingyo: 352,
  // ───── ダンジョン（恐山）：はいいろの 砂地・いおう・宇曽利湖・風車・積み石・地蔵・太鼓橋 ─────
  ashFloor: 353,
  sulfurFloor: 354,
  ashWall: 355,
  ashFace: 356,
  pinwheel: 357,
  cairn: 358,
  jizo: 359,
  /** 赤い 太鼓橋（歩ける 床） */
  bridge: 360,
  /** 宇曽利湖の 水（通れない） */
  lake: 361,
  // ───── 裏ステージ（お城）の ボスへの 参道 ─────
  /** 赤い じゅうたん（歩ける 床） */
  carpet: 362,
  /** さくらの 花びらが ちった 板の間 */
  petals: 363,
  // ───── フィールドの かざり（decor レイヤー） ─────
  scarecrow: 364,
  shell: 365,
  driftwood: 366,
  flowers: 367,
  stump: 368,
  /** 寒立馬（尻屋崎の 馬） */
  horse: 369,
  /** 小さな 漁船（海の 上） */
  boat: 370,
  rock: 371,
} as const;

/** 大きな 絵の 大きさ（横×縦の マス） */
export const SP_SIZE = {
  nebuta: [4, 3],
  aspam: [3, 3],
  ferry: [4, 2],
} as const satisfies Partial<Record<keyof typeof SP, readonly [number, number]>>;
