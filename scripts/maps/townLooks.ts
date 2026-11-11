/**
 * 町に 県ごとの 名物を 足す（scripts/data/mapLooks.ts の TOWN_LOOKS）。scaffold-maps.ts の townMap が
 * いつもの 町（広場・大通り・家・畑）を 作った あとに よぶ。
 * 町の ならび（scaffold-maps.ts の townMap）：広場は x 19〜32・y 10〜17、南北の 大通りは x 25〜26、
 * 東西の 道は y 8・18・30・36（2 マスはば）、北の 海は y 0〜1、家の 列は y 4・13・25・32、南の 畑は y 32〜35。
 */
import { SP, SP_SIZE } from '../../src/shared/specialTiles.js';
import type { Rng } from '../../src/core/rng.js';
import type { TownLook } from '../data/mapLooks.js';

/** scaffold-maps.ts の Room（町・ダンジョンの マス目）の うち、ここで 使う ところ */
export interface RoomLike {
  readonly bg: number[];
  readonly decor: number[];
  readonly block: boolean[];
  readonly objects: { at: [number, number]; w?: number }[];
  inside(x: number, y: number): boolean;
  i(x: number, y: number): number;
  ground(x: number, y: number, tile: number): void;
  solid(x: number, y: number, tile: number): void;
  put(x: number, y: number, tile: number): void;
  open(x: number, y: number): boolean;
}

/** fieldArt.ts の 草原・石だたみ（scaffold-maps.ts の T.grass・T.stone） */
const GRASS = 1;
const STONE = 5;
/** 果樹園の りんごの 木（T.fruitTree） */
const APPLE_TREE = 31;

/** 置いてある 物と 建物を どけて、地面に もどす */
function clear(room: RoomLike, x0: number, y0: number, w: number, h: number, tile = GRASS): void {
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) {
      if (!room.inside(x, y)) continue;
      room.decor[room.i(x, y)] = 0;
      room.ground(x, y, tile);
    }
}

/** 大きな 絵を 置く（通れない）。地面は そのまま */
function big(room: RoomLike, x0: number, y0: number, [w, h]: readonly [number, number], first: number): void {
  for (let k = 0; k < w * h; k++) room.put(x0 + (k % w), y0 + Math.floor(k / w), first + k);
}

export function applyTownLook(room: RoomLike, look: TownLook, rng: Rng): void {
  const has = (f: TownLook['features'][number]) => look.features.includes(f);
  if (has('bigNebuta')) {
    // 広場の 小さな 山車（2×2）を どけて、大きな ねぶた（4×3）を まん中に
    clear(room, 23, 10, 6, 6, STONE);
    big(room, 24, 11, SP_SIZE.nebuta, SP.nebuta);
  }
  if (has('aspam')) {
    // 北東の 海ぞいの 家を アスパムに（まわりは 石だたみの 広場）
    clear(room, 41, 4, 7, 4, STONE);
    big(room, 42, 4, SP_SIZE.aspam, SP.aspam);
  }
  if (has('ferry')) {
    // 港に 八甲田丸（海の 上。前に あった 小舟は どける）
    for (let y = 0; y < 2; y++) for (let x = 27; x < 33; x++) room.decor[room.i(x, y)] = 0;
    big(room, 28, 0, SP_SIZE.ferry, SP.ferry);
  }
  if (has('appleMarket')) {
    // 西の 草原（東西の 道の あいだ）を りんごの 市場に：屋台の 列と りんご箱
    clear(room, 3, 20, 19, 5);
    for (let x = 4; x <= 20; x += 4) {
      room.put(x, 21, SP.appleStall);
      if (x + 2 <= 20) room.put(x + 2, 23, SP.appleCrate);
    }
  }
  if (has('lanternStreet')) {
    // 南北の 大通りの 両がわに 金魚ねぶた（東西の 道と 街灯の ある 行は さける）
    for (const y of [22, 25, 28, 34])
      for (const x of [24, 27]) if (room.open(x, y)) room.put(x, y, SP.kingyo);
  }
  if (has('looseOrchard')) {
    // 南の 果樹園：ごばんの 目の 木を ぬいて、となり（ななめも）どうしが くっつかない ように ばらばらに 植える
    const rows = [32, 33, 34, 35];
    for (const x0 of [17, 28]) {
      for (const y of rows)
        for (let x = x0; x <= x0 + 6; x++)
          if (room.decor[room.i(x, y)] === APPLE_TREE) {
            room.decor[room.i(x, y)] = 0;
            room.block[room.i(x, y)] = false;
          }
      const planted: [number, number][] = [];
      for (const y of rows)
        for (let x = x0; x <= x0 + 6; x++) {
          if (!rng.chance(0.42) || !room.open(x, y)) continue;
          if (planted.some(([px, py]) => Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1)) continue;
          room.put(x, y, rng.chance(0.15) ? SP.appleCrate : APPLE_TREE);
          planted.push([x, y]);
        }
    }
  }
  // 人と 入口の マスは かならず 歩けるように する
  for (const o of room.objects)
    for (let dx = 0; dx < (o.w ?? 1); dx++) {
      const i = room.i(o.at[0] + dx, o.at[1]);
      room.decor[i] = 0;
      room.block[i] = false;
    }
}
