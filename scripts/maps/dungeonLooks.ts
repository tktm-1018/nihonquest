/**
 * ダンジョン・裏ステージの 県ごとの 見た目（scripts/data/mapLooks.ts の DUNGEON_LOOKS）。
 * scaffold-maps.ts の dungeonMap が よぶ：
 *   - SPECIAL_THEMES：床と かべの テーマ（恐山）
 *   - addLake：いちばん 大きな へやの まん中に 湖（まわりは 歩ける）。物を 置く 前に よぶ
 *   - addApproach：入口から ボスまでの 道の 終わりを 参道に（太鼓橋・じゅうたん、両がわに 風車・地蔵・かがり火）。
 *     ボスを 置いた あとに よぶ。置くたびに 入口から すべての 物に 歩いて 行けるかを たしかめ、行けなく なる 物は 置かない
 */
import { SP } from '../../src/shared/specialTiles.js';
import type { Rng } from '../../src/core/rng.js';
import type { DungeonApproach, SpecialDungeonTheme } from '../data/mapLooks.js';
import type { RoomLike } from './townLooks.js';

/** dungeonTiles.ts の ゆげの 出る あな・かがり火・金の びょうぶ（scaffold-maps.ts の D） */
const FUMAROLE = 258;
const BRAZIER = 262;
const GOLD_SCREEN = 261;
/** 町・ダンジョンの 横の マス数（scaffold-maps.ts の ROOM_W） */
const W = 52;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
type Pt = [number, number];

/** scaffold-maps.ts の ThemeTiles と 同じ 形 */
export const SPECIAL_THEMES: Record<
  SpecialDungeonTheme,
  {
    floor: number;
    floor2: number;
    wall: number;
    face: number;
    props: number[];
    torches: boolean;
    altar: number;
  }
> = {
  // 恐山：はいいろの 砂地に いおうの しみ、くらい 岩、風車と 積み石と ゆげ。おくに 地蔵
  osorezan: {
    floor: SP.ashFloor,
    floor2: SP.sulfurFloor,
    wall: SP.ashWall,
    face: SP.ashFace,
    props: [SP.pinwheel, SP.cairn, FUMAROLE],
    torches: false,
    altar: SP.jizo,
  },
};

const inBox = (b: Box, x: number, y: number) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h;

/** 入口から 歩いて とどく マス（物体の マスは 通れる。ボスも 倒せば 通れる） */
function reach(room: RoomLike, from: Pt): Set<number> {
  const start = room.i(...from);
  const seen = new Set([start]);
  const queue = [start];
  for (let h = 0; h < queue.length; h++) {
    const i = queue[h]!;
    const x = i % W;
    for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W])
      if (j >= 0 && j < room.block.length && !seen.has(j) && !room.block[j]) {
        seen.add(j);
        queue.push(j);
      }
  }
  return seen;
}

/** マスを 通れなく しても、入口から すべての 物体と、いままで 行けた 床に 行けるなら true（行けなく なるなら もどす） */
function tryBlock(room: RoomLike, from: Pt, x: number, y: number, apply: () => void): boolean {
  const i = room.i(x, y);
  if (room.block[i] || room.objects.some((o) => room.i(...o.at) === i)) return false;
  const before = reach(room, from).size;
  const saved = [room.bg[i]!, room.decor[i]!, room.block[i]!] as const;
  apply();
  if (reach(room, from).size === before - 1) return true;
  room.bg[i] = saved[0];
  room.decor[i] = saved[1];
  room.block[i] = saved[2];
  return false;
}

/** いちばん 大きな へや（入口の へやを のぞく）の まん中に 湖。ふちから 2 マスは 歩ける まま */
export function addLake(room: RoomLike, boxes: Box[], entrance: Box): void {
  const big = boxes
    .filter((b) => b !== entrance && b.w >= 8 && b.h >= 6)
    .sort((a, b) => b.w * b.h - a.w * a.h)[0];
  if (!big) return;
  const cx = big.x + (big.w - 1) / 2;
  const cy = big.y + (big.h - 1) / 2;
  const rx = (big.w - 5) / 2;
  const ry = (big.h - 5) / 2;
  for (let y = big.y + 2; y < big.y + big.h - 2; y++)
    for (let x = big.x + 2; x < big.x + big.w - 2; x++)
      if (((x - cx) / (rx + 0.5)) ** 2 + ((y - cy) / (ry + 0.5)) ** 2 <= 1) room.solid(x, y, SP.lake);
}

/** 入口から ボスまでの いちばん 近い 道（入口 → ボスの じゅん） */
function pathTo(room: RoomLike, from: Pt, to: Pt): Pt[] {
  const start = room.i(...from);
  const goal = room.i(...to);
  const prev = new Int32Array(room.block.length).fill(-2);
  prev[start] = -1;
  const queue = [start];
  for (let h = 0; h < queue.length && prev[goal] === -2; h++) {
    const i = queue[h]!;
    const x = i % W;
    for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W])
      if (j >= 0 && j < room.block.length && prev[j] === -2 && !room.block[j]) {
        prev[j] = i;
        queue.push(j);
      }
  }
  const out: Pt[] = [];
  for (let i = goal; i >= 0; i = prev[i]!) out.unshift([i % W, Math.floor(i / W)]);
  return prev[goal] === -2 ? [] : out;
}

const POSTS: Record<DungeonApproach['posts'], number> = {
  pinwheel: SP.pinwheel,
  jizo: SP.jizo,
  brazier: BRAZIER,
};
const RINGS: Record<NonNullable<DungeonApproach['ring']>, number> = {
  cairn: SP.cairn,
  goldScreen: GOLD_SCREEN,
};

/** ボスへの 参道。boxes は へや（far が ボスの へや）、boss は ボスの マス */
export function addApproach(
  room: RoomLike,
  approach: DungeonApproach,
  { spawn, boss, boxes, far }: { spawn: Pt; boss: Pt; boxes: Box[]; far: Box },
): void {
  const path = pathTo(room, spawn, boss);
  const tail = path.slice(-16, -1);
  const inCorridor = (x: number, y: number) => !boxes.some((b) => inBox(b, x, y));
  const onPath = new Set(path.map(([x, y]) => room.i(x, y)));
  tail.forEach(([x, y], k) => {
    const corridor = inCorridor(x, y);
    if (approach.floor === 'carpet') room.bg[room.i(x, y)] = SP.carpet;
    else if (corridor) room.bg[room.i(x, y)] = SP.bridge;
    const [nx, ny] = tail[k + 1] ?? boss;
    const [dx, dy] = [nx - x, ny - y];
    const sides: Pt[] = [
      [x + dy, y + dx],
      [x - dy, y - dx],
    ];
    for (const [sx, sy] of sides) {
      if (!room.inside(sx, sy) || onPath.has(room.i(sx, sy))) continue;
      // 三途の川：橋の 両がわは 水
      if (approach.river && corridor && approach.floor === 'bridge')
        tryBlock(room, spawn, sx, sy, () => room.solid(sx, sy, SP.lake));
      // ボスの へやの 中は、1 マスおきに 両がわへ 風車・地蔵・かがり火
      else if (inBox(far, sx, sy) && k % 2 === 0)
        tryBlock(room, spawn, sx, sy, () => room.put(sx, sy, POSTS[approach.posts]));
    }
  });
  // ボスの ななめ 4 マスに 積み石・びょうぶ
  if (approach.ring)
    for (const [dx, dy] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ] as const) {
      const [x, y] = [boss[0] + dx, boss[1] + dy];
      if (room.inside(x, y) && !onPath.has(room.i(x, y)))
        tryBlock(room, spawn, x, y, () => room.put(x, y, RINGS[approach.ring!]));
    }
}

/** 床の ところどころを さくらの 花びらに（歩ける 床の 絵だけ かえる） */
export function addPetals(room: RoomLike, floors: number[], rng: Rng): void {
  for (let i = 0; i < room.bg.length; i++)
    if (!room.block[i] && floors.includes(room.bg[i]!) && rng.chance(0.1)) room.bg[i] = SP.petals;
}
