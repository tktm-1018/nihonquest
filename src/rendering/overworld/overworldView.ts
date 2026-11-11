/**
 * フィールドの 見た目用 レイヤー：background（地面の 種類の タイル番号）→ 見た目の タイル（viewTiles.ts の 番号）。
 * データ（地面の 判定・エンカウント・地図）は background の まま。見た目だけ ドラクエのように すっきり させる：
 *  - 海：となりが 陸の がわに 白い 波（4 方向の しるし）
 *  - 森：となりが 森で ない がわを まるく（4 方向の しるし）→ ひとかたまりの 森に 見える
 *  - 果樹園：1 マスに 1 本の 木（ならぶと 畑の 列。森の かたまりと 見分けが つく）
 *  - 山：1 マスに 1 つの 山（すそが マスの はばいっぱい → ならぶと 山なみ）
 *  - 草原・すなはま・みずべ：場所で きまる 2〜3 しゅるいを まぜて、同じ 絵が マス目に ならばないように
 * natural（マップの mapLook が 'natural'。scripts/data/mapLooks.ts）なら、さらに 自然に：
 *  - さかいの 山なみ：場所で ゆっくり かわる なみで 岩山・針葉樹の 森・岩の かたまりを まぜ、山の そばは 雪の 山
 *  - さかいの すそ：となり（2 マス 以内）の 草原に 小石・しげみ・長い 草（さかいが 一直線に 見えない）
 *  - 果樹園：木の 位置を ずらし、ところどころ 若い 木（ごばんの 目に 見えない）
 * 純粋関数（Phaser を 使わない）。知らない 番号は -1（background の 絵を そのまま 見せる）
 */

/** 見た目の タイルの 番号（テクスチャ 'overworld-view' の 中。0 から） */
export const VIEW = {
  /** + 陸の しるし（北 1・東 2・南 4・西 8） */
  WATER: 0,
  WATER_GLINT: 16,
  GRASS: 17,
  GRASS_TUFT: 18,
  GRASS_FLOWER: 19,
  SAND: 20,
  SAND2: 21,
  /** + 森の しるし（北 1・東 2・南 4・西 8。15 は まわりが ぜんぶ 森） */
  FOREST: 22,
  FOREST_PINE: 38,
  PEAK: 39,
  PEAK2: 40,
  PEAK_SNOW: 41,
  MARSH: 42,
  MARSH2: 43,
  FARM: 44,
  FARM_GOLD: 45,
  /** 果樹園（りんご・さくらんぼ）：1 マスに 1 本の 木（ならぶと 畑の 列） */
  ORCHARD: 46,
  /** 果樹園（もも） */
  ORCHARD_PEACH: 47,
  /** + すなはまの しるし（となりが すなはま・海の がわ。草の がわを まるく） */
  SAND_EDGE: 48,
  /** 名所エリアの さかいの 山なみ（通れない くらい 岩山） */
  RIDGE: 64,
  RIDGE2: 65,
  /** さくらの 木（弘前城エリア） */
  SAKURA: 66,
  /** 恐山の はいいろの 砂地・ゆけむり */
  ASH: 67,
  ASH2: 68,
  STEAM: 69,
  /** 沖の水面アニメーション（通常の波線そのものを移動する追加フレーム） */
  WATER_FLOW_1: 70,
  WATER_FLOW_2: 71,
  /** + 道の しるし（となりが 道の がわ。北 1・東 2・南 4・西 8） */
  ROAD: 72,
  /** さかいの 山なみ（natural）：針葉樹の 森・岩の かたまり・雪の 山 */
  RIDGE_PINE: 88,
  RIDGE_ROCK: 89,
  RIDGE_SNOW: 90,
  /** さかいの すそ（natural）：小石・しげみ・長い 草 */
  FOOT_ROCK: 91,
  FOOT_BUSH: 92,
  FOOT_GRASS: 93,
  /** 果樹園（natural）：左・右に ずれた 木、若い 木 */
  ORCHARD_LEFT: 94,
  ORCHARD_RIGHT: 95,
  ORCHARD_YOUNG: 96,
} as const;
export const VIEW_COUNT = 97;

export interface ViewOptions {
  /** マップの mapLook が 'natural' */
  natural?: boolean;
}

/** background の 番号（fieldArt.ts・core/world/ground.ts） */
const WATER = 3;
const FOREST = new Set([149, 150, 11]);
const MOUNTAIN = new Set([151, 152, 12]);
const ORCHARD = new Set([157, 158]);

/** 場所で きまる ばらばらの 数（同じ 県は いつも 同じ 見た目） */
const hash = (x: number, y: number) => (Math.imul(x, 73856093) ^ Math.imul(y, 19349663)) >>> 0;
/** ゆっくり かわる 0〜1 の なみ（size マスごとの 格子の あいだを なめらかに つなぐ） */
const smooth = (x: number, y: number, size: number): number => {
  const gx = Math.floor(x / size);
  const gy = Math.floor(y / size);
  const fx = x / size - gx;
  const fy = y / size - gy;
  const v = (ix: number, iy: number) => (hash(ix + 101, iy + 37) % 1000) / 1000;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const top = v(gx, gy) + (v(gx + 1, gy) - v(gx, gy)) * sx;
  const bottom = v(gx, gy + 1) + (v(gx + 1, gy + 1) - v(gx, gy + 1)) * sx;
  return top + (bottom - top) * sy;
};
const RIDGE = 159;

/** 1 マスの 見た目。bg は 横 w・縦 h の background の 番号（行ごと） */
export function viewTileAt(
  bg: readonly number[],
  w: number,
  h: number,
  i: number,
  opts: ViewOptions = {},
): number {
  const t = bg[i]!;
  const x = i % w;
  const y = Math.floor(i / w);
  /** となりの マス（マップの 外は 自分と 同じ＝ふちを 作らない） */
  const at = (dx: number, dy: number) => {
    const xx = x + dx;
    const yy = y + dy;
    return xx < 0 || yy < 0 || xx >= w || yy >= h ? t : bg[yy * w + xx]!;
  };
  const mask = (hit: (n: number) => boolean) =>
    (hit(at(0, -1)) ? 1 : 0) | (hit(at(1, 0)) ? 2 : 0) | (hit(at(0, 1)) ? 4 : 0) | (hit(at(-1, 0)) ? 8 : 0);
  const r = hash(x, y);
  if (opts.natural) {
    const look = naturalTile(t, x, y, r, at);
    if (look >= 0) return look;
  }
  if (t === WATER) {
    const land = mask((n) => n !== WATER && n > 0);
    return land === 0 && r % 9 === 0 ? VIEW.WATER_GLINT : VIEW.WATER + land;
  }
  if (FOREST.has(t)) {
    const m = mask((n) => FOREST.has(n));
    return m === 15 && t === 150 ? VIEW.FOREST_PINE : VIEW.FOREST + m;
  }
  if (ORCHARD.has(t)) return t === 158 ? VIEW.ORCHARD_PEACH : VIEW.ORCHARD;
  if (MOUNTAIN.has(t)) return t === 12 ? VIEW.PEAK_SNOW : r % 3 === 0 ? VIEW.PEAK2 : VIEW.PEAK;
  switch (t) {
    case 159:
      return r % 3 === 0 ? VIEW.RIDGE2 : VIEW.RIDGE;
    case 160:
      return VIEW.SAKURA;
    case 161:
      return r % 4 === 0 ? VIEW.ASH2 : VIEW.ASH;
    case 162:
      return VIEW.STEAM;
    case 163:
      return VIEW.ROAD + mask((n) => n === 163);
    case 1:
    case 13:
    case 14:
      return r % 23 === 0 ? VIEW.GRASS_FLOWER : r % 3 === 0 ? VIEW.GRASS_TUFT : VIEW.GRASS;
    case 147:
    case 148: {
      const m = mask((n) => n === 147 || n === 148 || n === WATER);
      return m !== 15 ? VIEW.SAND_EDGE + m : r % 4 === 0 ? VIEW.SAND2 : VIEW.SAND;
    }
    case 153:
    case 154:
      return r % 3 === 0 ? VIEW.MARSH : VIEW.MARSH2;
    case 155:
      return VIEW.FARM;
    case 156:
      return VIEW.FARM_GOLD;
    default:
      return -1;
  }
}

/** natural の 見た目（さかいの 山なみ・すそ・果樹園）。ほかの マスは -1（ふつうの 見た目） */
function naturalTile(
  t: number,
  x: number,
  y: number,
  r: number,
  at: (dx: number, dy: number) => number,
): number {
  if (t === RIDGE) {
    // 山の そばは 雪の 山。ほかは ゆっくり かわる なみで 森・岩・岩山（長い さかいが 同じ 絵の 列に ならない）
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const)
      if (MOUNTAIN.has(at(dx, dy))) return VIEW.RIDGE_SNOW;
    const n = smooth(x, y, 7);
    if (n < 0.34) return VIEW.RIDGE_PINE;
    if (n < 0.5) return r % 4 === 0 ? VIEW.RIDGE : VIEW.RIDGE_ROCK;
    return r % 3 === 0 ? VIEW.RIDGE2 : VIEW.RIDGE;
  }
  if (t === 1 || t === 13 || t === 14 || t === 155 || t === 156) {
    // さかいの すそ：となりの 草原・田んぼに 小石・しげみ・長い 草（近いほど 多い）
    let d = 3;
    for (let dy = -2; dy <= 2; dy++)
      for (let dx = -2; dx <= 2; dx++)
        if (at(dx, dy) === RIDGE) d = Math.min(d, Math.max(Math.abs(dx), Math.abs(dy)));
    const p = d === 1 ? 50 : d === 2 ? 16 : 0;
    // 田んぼの となりは 小石を さけて しげみと 長い 草
    const kinds =
      t >= 155 ? [VIEW.FOOT_BUSH, VIEW.FOOT_GRASS] : [VIEW.FOOT_ROCK, VIEW.FOOT_BUSH, VIEW.FOOT_GRASS];
    if (r % 100 < p) return kinds[(r >>> 8) % kinds.length]!;
    return -1;
  }
  if (t === 157) {
    const k = (r >>> 4) % 20;
    return k < 3
      ? VIEW.ORCHARD_YOUNG
      : k < 9
        ? VIEW.ORCHARD_LEFT
        : k < 15
          ? VIEW.ORCHARD_RIGHT
          : VIEW.ORCHARD;
  }
  return -1;
}

/** マップ ぜんぶの 見た目（-1 は その マスは 描かない） */
export const overworldView = (
  bg: readonly number[],
  w: number,
  h: number,
  opts: ViewOptions = {},
): number[] => bg.map((_, i) => viewTileAt(bg, w, h, i, opts));
