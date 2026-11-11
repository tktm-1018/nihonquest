/**
 * フィールドに 県ごとの かざり・道しるべ・地名を 足す（scripts/data/mapLooks.ts の FIELD_LOOKS）。
 * できあがった Tiled の マップ（scaffold-maps.ts の fieldMap の 出力、または maps/ の ファイル）を そのまま なおす。
 * 何回 よんでも 同じに なる（前に 足した 物を はずしてから 足しなおす）。
 *   - decor レイヤー：地面に あわせた かざり（かかし・りんご箱・ホタテ・流木・花・切り株・岩・漁船・寒立馬）。
 *     通れない かざりは まわり 8 マスが 歩ける 所にだけ 置く（道や 陸続きを 切らない）
 *   - signpost：道の 分かれ道の そばに 道しるべ（ways に 行き先の 方向）。マスは 歩ける まま（ゲームが ふさぐ）
 *   - properties：mapLook（見た目を 自然に）・compass（小さな 地図に 方角）・geoNames（近づくと 出る 地名）
 */
import { SP } from '../../src/shared/specialTiles.js';
import type { FieldLook } from '../data/mapLooks.js';
import type { LonLat } from '../data/geo.js';

interface Prop {
  name: string;
  type: 'string' | 'int' | 'bool';
  value: string | number | boolean;
}
interface TiledObject {
  id: number;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties?: Prop[];
}
interface TiledLayer {
  id: number;
  name: string;
  type: string;
  data?: number[];
  objects?: TiledObject[];
  [key: string]: unknown;
}
export interface TiledJson {
  width: number;
  height: number;
  layers: TiledLayer[];
  nextlayerid: number;
  nextobjectid: number;
  properties?: Prop[];
}

/** 道しるべの 1 つの 向き。to は 行き先の 種類（region は id の エリア） */
export interface SignWay {
  d: 'up' | 'down' | 'left' | 'right';
  to: 'town' | 'dungeon' | 'region' | 'boss' | 'secret' | 'port' | 'landmark';
  id?: string;
}

/** background の 番号（fieldArt.ts・core/world/ground.ts） */
const WATER = 3;
const ROAD = 163;
const GRASS = new Set([1, 13, 14]);
const FOREST = new Set([11, 149, 150]);
const BEACH = new Set([147, 148]);
const FARM = new Set([155, 156]);
const ORCHARD = new Set([157, 158]);
const BLOCK = 3;
/** 前に 足した 物の しるし（はずすときに 使う） */
const OWN_PROPS = ['mapLook', 'compass', 'geoNames', 'decorBlocked', 'ridgeWidened'];
/** エリアの さかいの 山なみ（scaffold-maps.ts の TILE.W） */
const RIDGE = 159;

/** 場所で きまる 0〜1 の 数（同じ マップは いつも 同じ かざり） */
const rand = (x: number, y: number, salt: number) =>
  ((Math.imul(x * 7919 + salt * 104729, 73856093) ^ Math.imul(y * 6271 + salt, 19349663)) >>> 0) / 2 ** 32;

export function decorateField(
  map: TiledJson,
  look: FieldLook,
  tileOf: (ll: LonLat) => [number, number],
): void {
  const { width: w, height: h } = map;
  const layer = (name: string) => map.layers.find((l) => l.name === name);
  const bg = layer('background')!.data!;
  const col = layer('collision')!.data!;
  const objectLayer = layer('objects')!;
  // ───── 前に 足した 物を はずす ─────
  const old = map.properties?.find((p) => p.name === 'decorBlocked');
  for (const i of old ? (JSON.parse(String(old.value)) as number[]) : []) col[i] = 0;
  const widened = map.properties?.find((p) => p.name === 'ridgeWidened');
  for (const [i, t] of widened ? (JSON.parse(String(widened.value)) as [number, number][]) : []) {
    bg[i] = t;
    col[i] = 0;
  }
  map.properties = map.properties?.filter((p) => !OWN_PROPS.includes(p.name));
  // 番号は 前と 同じに する（何回 足しなおしても ファイルが かわらない）
  const oldDecorId = layer('decor')?.id;
  map.layers = map.layers.filter((l) => l.name !== 'decor');
  objectLayer.objects = (objectLayer.objects ?? []).filter((o) => o.type !== 'signpost');
  const objects = objectLayer.objects;
  map.nextobjectid = Math.max(0, ...objects.map((o) => o.id)) + 1;

  const cellOf = (o: TiledObject) => Math.floor(o.y / 16) * w + Math.floor(o.x / 16);
  const xy = (i: number): [number, number] => [i % w, Math.floor(i / w)];
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h;
  const near = (i: number, r: number) =>
    objects.some((o) => {
      const [ox, oy] = xy(cellOf(o));
      const [x, y] = xy(i);
      return Math.abs(ox - x) <= r + Math.max(0, Math.round(o.width / 16) - 1) && Math.abs(oy - y) <= r;
    });
  const decor = new Array<number>(w * h).fill(0);
  const blocked: number[] = [];
  /** まわり 8 マスが 歩けて、道でも 物の そばでも ない（ここを ふさいでも 陸続きは 切れない） */
  const roomy = (i: number) => {
    const [x, y] = xy(i);
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (!inside(x + dx, y + dy)) return false;
        const j = (y + dy) * w + x + dx;
        if (col[j] === BLOCK || bg[j] === ROAD || decor[j]) return false;
      }
    return !near(i, 2);
  };
  const putBlock = (i: number, tile: number) => {
    decor[i] = tile;
    col[i] = BLOCK;
    blocked.push(i);
  };

  // ───── さかいの 山なみを ぎざぎざに（となりの マスを ところどころ 山に。エリアの 中が 切れる マスは さける） ─────
  const ridgeWidened = look.natural ? widenRidges(map, bg, col, near) : [];

  // ───── 道しるべ（かざりより 先に 場所を とる） ─────
  if (look.signposts) {
    const regions = regionGrid(map);
    let k = 0;
    for (const sign of signposts(map, bg, col, objects, regions)) {
      objects.push({
        id: map.nextobjectid++,
        name: `signpost_${++k}`,
        type: 'signpost',
        x: (sign.at % w) * 16,
        y: Math.floor(sign.at / w) * 16,
        width: 16,
        height: 16,
        properties: [{ name: 'ways', type: 'string', value: JSON.stringify(sign.ways) }],
      });
    }
  }

  // ───── 地面に あわせた かざり ─────
  if (look.decor) {
    for (let i = 0; i < w * h; i++) {
      const [x, y] = xy(i);
      const t = bg[i]!;
      const r = rand(x, y, 1);
      if (t === WATER) {
        // 岸から 2〜3 マスの 海に 漁船
        const coast = [-3, 3].some((d) => inside(x + d, y) && bg[y * w + x + d] !== WATER);
        if (coast && r < 1 / 160) decor[i] = SP.boat;
        continue;
      }
      if (col[i] === BLOCK || t === ROAD) continue;
      if (FARM.has(t) && r < 1 / 90 && roomy(i)) putBlock(i, SP.scarecrow);
      else if (ORCHARD.has(t) && r < 1 / 45 && roomy(i)) putBlock(i, SP.appleCrate);
      else if (BEACH.has(t) && !near(i, 1)) {
        if (r < 1 / 22) decor[i] = SP.shell;
        else if (r < 1 / 14) decor[i] = SP.driftwood;
      } else if (GRASS.has(t)) {
        const byForest = [i - 1, i + 1, i - w, i + w].some((j) => FOREST.has(bg[j] ?? 0));
        if (byForest && r < 1 / 16 && roomy(i)) putBlock(i, SP.stump);
        else if (!byForest && r < 1 / 140 && roomy(i)) putBlock(i, SP.rock);
        else if (r > 1 - 1 / 40 && !near(i, 1)) decor[i] = SP.flowers;
      }
    }
    // 特別な 場所（尻屋崎の 寒立馬 など）：まわりの 広い 草原に count 頭
    for (const spot of look.spots) {
      const [cx, cy] = tileOf(spot.at).map(Math.floor) as [number, number];
      let placed = 0;
      for (let d = 0; d <= 10 && placed < spot.count; d++)
        for (let y = cy - d; y <= cy + d && placed < spot.count; y++)
          for (let x = cx - d; x <= cx + d && placed < spot.count; x++) {
            if (Math.max(Math.abs(x - cx), Math.abs(y - cy)) !== d || !inside(x, y)) continue;
            const i = y * w + x;
            if (GRASS.has(bg[i]!) && col[i] !== BLOCK && roomy(i)) {
              putBlock(i, SP.horse);
              placed++;
            }
          }
    }
    const bgIndex = map.layers.findIndex((l) => l.name === 'background');
    map.layers.splice(bgIndex + 1, 0, {
      id: oldDecorId ?? map.nextlayerid++,
      name: 'decor',
      type: 'tilelayer',
      visible: true,
      opacity: 1,
      x: 0,
      y: 0,
      width: w,
      height: h,
      data: decor,
    });
  }

  const props: Prop[] = [];
  if (look.natural) props.push({ name: 'mapLook', type: 'string', value: 'natural' });
  if (look.compass) props.push({ name: 'compass', type: 'bool', value: true });
  if (look.geoNames.length)
    props.push({
      name: 'geoNames',
      type: 'string',
      value: JSON.stringify(
        look.geoNames.map((g) => {
          const [x, y] = tileOf(g.at);
          return { name: g.name, kind: g.kind, x: Math.floor(x), y: Math.floor(y), r: g.radius };
        }),
      ),
    });
  if (blocked.length) props.push({ name: 'decorBlocked', type: 'string', value: JSON.stringify(blocked) });
  if (ridgeWidened.length)
    props.push({ name: 'ridgeWidened', type: 'string', value: JSON.stringify(ridgeWidened) });
  map.properties = [...(map.properties ?? []), ...props];
}

/**
 * さかいの 山なみ（1 マスはばの 線）の となりの マスを、ゆっくり かわる なみに あわせて 山に する（2 マス まで）。
 * 道・物の そば・関所の まわりは さけ、山に すると その エリアの 歩ける マスが 2 つに 切れる ときは やめる。
 * もどすための [マス, もとの 地面] を かえす
 */
function widenRidges(
  map: TiledJson,
  bg: number[],
  col: number[],
  near: (i: number, r: number) => boolean,
): [number, number][] {
  const { width: w, height: h } = map;
  const grid = regionGrid(map);
  if (!grid) return [];
  const regionOf = (i: number) => grid.rows[Math.floor(i / w)]?.[i % w] ?? '.';
  const nb = (i: number) => {
    const x = i % w;
    return [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w].filter((j) => j >= 0 && j < w * h);
  };
  const walk = (i: number) => col[i] !== BLOCK && bg[i] !== WATER;
  /** そのエリアの 歩ける マスを 1 つ ふさいでも、のこりが 1 つに つながって いるか */
  const keepsRegion = (i: number) => {
    const r = regionOf(i);
    const start = nb(i).find((j) => regionOf(j) === r && walk(j));
    if (start === undefined) return false;
    let total = 0;
    for (let j = 0; j < w * h; j++) if (j !== i && regionOf(j) === r && walk(j)) total++;
    const seen = new Set([start, i]);
    const queue = [start];
    for (let q = 0; q < queue.length; q++)
      for (const j of nb(queue[q]!))
        if (!seen.has(j) && regionOf(j) === r && walk(j)) {
          seen.add(j);
          queue.push(j);
        }
    return seen.size - 1 === total;
  };
  const out: [number, number][] = [];
  const objectsNear = (i: number) => near(i, 2);
  for (const ring of [1, 2]) {
    for (let i = 0; i < w * h; i++) {
      if (!walk(i) || bg[i] === ROAD || regionOf(i) === '.') continue;
      // 1 周目は さかいの となり、2 周目は 1 周目で 山に した マスの となりだけ
      const touch = nb(i).some((j) => bg[j] === RIDGE && (ring === 1 || out.some(([k]) => k === j)));
      if (!touch) continue;
      const [x, y] = [i % w, Math.floor(i / w)];
      const wave = (rand(Math.floor(x / 3), Math.floor(y / 3), 7) + rand(x, y, 8)) / 2;
      if (wave > (ring === 1 ? 0.42 : 0.26)) continue;
      if (nb(i).some((j) => bg[j] === ROAD) || objectsNear(i) || !keepsRegion(i)) continue;
      out.push([i, bg[i]!]);
      bg[i] = RIDGE;
      col[i] = BLOCK;
    }
  }
  return out;
}

/** regions プロパティ（エリアの id と マスごとの 文字） */
function regionGrid(map: TiledJson): { ids: string[]; rows: string[] } | null {
  const raw = map.properties?.find((p) => p.name === 'regions')?.value;
  return typeof raw === 'string' ? (JSON.parse(raw) as { ids: string[]; rows: string[] }) : null;
}

/** 行き先の 大切さ（小さいほど 道しるべに 書く）。いまいる エリアの 中の 物を さきに えらぶ */
const PRIORITY: Record<SignWay['to'], number> = {
  boss: 0,
  region: 1,
  dungeon: 2,
  secret: 3,
  port: 4,
  landmark: 5,
  town: 6,
};

/**
 * 道しるべを 立てる 場所と 向き。町から 道（と 行き先の マス）を 歩く 木を つくり、
 * 行き先への 道が ほんとうに 分かれる ところ（5 マス 先で 3 マス 以上 はなれる）を 分かれ道に する。
 * 2 マスはばの 道の となりの 列どうしは 分かれ道に しない
 */
function signposts(
  map: TiledJson,
  bg: number[],
  col: number[],
  objects: TiledObject[],
  regions: { ids: string[]; rows: string[] } | null,
): { at: number; ways: SignWay[] }[] {
  const { width: w, height: h } = map;
  const n = w * h;
  const cellOf = (o: TiledObject) => Math.floor(o.y / 16) * w + Math.floor(o.x / 16);
  const xy = (i: number): [number, number] => [i % w, Math.floor(i / w)];
  const town = objects.find((o) => o.name === 'to_town');
  if (!town) return [];
  const targets = new Map<number, Omit<SignWay, 'd'> & { between?: string[] }>();
  for (const o of objects) {
    const target = o.properties?.find((p) => p.name === 'targetMap')?.value;
    if (o.name === 'to_dungeon') targets.set(cellOf(o), { to: 'dungeon' });
    else if (o.name === 'to_secret') targets.set(cellOf(o), { to: 'secret' });
    else if (o.type === 'transition' && typeof target === 'string' && !target.endsWith('-town'))
      targets.set(cellOf(o), { to: 'port' });
    else if (o.type === 'regionGate') {
      const between = String(o.properties?.find((p) => p.name === 'between')?.value ?? '').split(',');
      targets.set(cellOf(o), { to: 'region', between });
    } else if (o.type === 'regionBoss') {
      const id = String(o.properties?.find((p) => p.name === 'region')?.value ?? '');
      targets.set(cellOf(o), { to: 'boss', id });
    } else if (o.type === 'landmark' || o.type === 'specialty' || o.type === 'event')
      targets.set(cellOf(o), { to: 'landmark' });
  }
  const road = (i: number) => bg[i] === ROAD || targets.has(i);
  const nb = (i: number) => {
    const x = i % w;
    return [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w].filter((j) => j >= 0 && j < n);
  };
  const root = cellOf(town);
  const parent = new Int32Array(n).fill(-2);
  const dist = new Int32Array(n).fill(-1);
  parent[root] = -1;
  dist[root] = 0;
  const queue = [root];
  for (let q = 0; q < queue.length; q++)
    for (const j of nb(queue[q]!))
      if (parent[j] === -2 && road(j)) {
        parent[j] = queue[q]!;
        dist[j] = dist[queue[q]!]! + 1;
        // 関所は 通りぬけて その先の エリアへ。入口（どうくつ・お城・港）は 行きどまり
        if (targets.get(j)?.to === 'region' || !targets.has(j)) queue.push(j);
      }
  // 行き先ごとの 道（町 → 行き先）
  const paths = [...targets.keys()]
    .filter((t) => parent[t] !== -2)
    .map((t) => {
      const p: number[] = [];
      for (let i = t; i >= 0; i = parent[i]!) p.unshift(i);
      return { t, p };
    });
  const regionAt = (i: number) => {
    const c = regions?.rows[Math.floor(i / w)]?.[i % w];
    return c && c !== '.' ? regions!.ids[c.charCodeAt(0) - 97] : undefined;
  };
  const dirTo = (from: number, to: number): SignWay['d'] => {
    const [fx, fy] = xy(from);
    const [tx, ty] = xy(to);
    return Math.abs(tx - fx) >= Math.abs(ty - fy) ? (tx > fx ? 'right' : 'left') : ty > fy ? 'down' : 'up';
  };
  const AHEAD = 5;
  const found: { at: number; fork: number; ways: SignWay[] }[] = [];
  // 分かれ道の 候補：2 つ 以上の 道が 通る マス
  const through = new Map<number, number[]>();
  paths.forEach(({ p }, k) => p.forEach((c) => through.set(c, [...(through.get(c) ?? []), k])));
  for (const [c, ks] of through) {
    if (ks.length < 2 || dist[c]! < 4) continue;
    // そこから AHEAD マス 先の 場所で、道を まとめる
    const groups: { probe: number; ks: number[] }[] = [];
    for (const k of ks) {
      const { p } = paths[k]!;
      const at = p.indexOf(c);
      const probe = p[Math.min(p.length - 1, at + AHEAD)]!;
      if (probe === c) continue;
      const [px, py] = xy(probe);
      const g = groups.find((gr) => {
        const [gx, gy] = xy(gr.probe);
        return Math.max(Math.abs(gx - px), Math.abs(gy - py)) < 3;
      });
      if (g) g.ks.push(k);
      else groups.push({ probe, ks: [k] });
    }
    if (groups.length < 2) continue;
    // 1 マス 先で もう 分かれて いる（このマスが 分かれめの 先頭）か
    const next = new Set(ks.map((k) => paths[k]!.p[paths[k]!.p.indexOf(c) + 1]));
    if (next.size < 2) continue;
    const here = regionAt(c);
    const ways: SignWay[] = groups.flatMap((g): SignWay[] => {
      // その 先で いちばん さきに 通る 関所（と、その 向こうの エリア）。いまの エリアに 面した 関所だけ
      let gate: { d: number; id: string } | null = null;
      const inHere: { to: SignWay['to']; id?: string; d: number }[] = [];
      for (const k of g.ks) {
        const { p, t } = paths[k]!;
        const from = p.indexOf(c);
        const gi = p.findIndex((cell, idx) => idx > from && targets.get(cell)?.to === 'region');
        const between = gi >= 0 ? (targets.get(p[gi]!)!.between ?? []) : [];
        if (gi >= 0 && between.includes(here ?? '') && (!gate || dist[p[gi]!]! < gate.d)) {
          const beyond = regionAt(p[gi + 1] ?? p[gi]!);
          gate = {
            d: dist[p[gi]!]!,
            id: beyond && beyond !== here ? beyond : (between.find((id) => id !== here) ?? ''),
          };
        }
        const target = targets.get(t)!;
        if (target.to !== 'region' && regionAt(t) === here)
          inHere.push({ to: target.to, id: target.id, d: dist[t]! });
      }
      // いまの エリアの ぬし → 関所の 向こうの エリア → いまの エリアの 名所・入口
      const boss = inHere.find((x) => x.to === 'boss');
      const best =
        boss ??
        (gate
          ? { to: 'region' as const, id: gate.id }
          : inHere.sort((a, b) => PRIORITY[a.to] - PRIORITY[b.to] || a.d - b.d)[0]);
      // 書く ことの ない 向き（ほかの エリアの 物だけ）は のせない
      return best ? [{ d: dirTo(c, g.probe), to: best.to, ...(best.id ? { id: best.id } : {}) }] : [];
    });
    let back = c;
    for (let s = 0; s < AHEAD && parent[back]! >= 0; s++) back = parent[back]!;
    ways.push({ d: dirTo(c, back), to: 'town' });
    // 同じ 向きは 1 つに（大切な ほう）
    const uniq = ways
      .sort((a, b) => PRIORITY[a.to] - PRIORITY[b.to])
      .filter((wy, k, all) => all.findIndex((o) => o.d === wy.d) === k);
    if (uniq.length < 2) continue;
    found.push({ at: -1, fork: c, ways: uniq });
  }
  // 近い 分かれ道は 町に 近い 1 つに まとめ、道の となりの 歩ける マスに 立てる
  found.sort((a, b) => dist[a.fork]! - dist[b.fork]!);
  const kept: typeof found = [];
  const taken = new Set(objects.map(cellOf));
  for (const f of found) {
    const [fx, fy] = xy(f.fork);
    if (kept.some((k) => Math.max(Math.abs(xy(k.fork)[0] - fx), Math.abs(xy(k.fork)[1] - fy)) < 8)) continue;
    let spot = -1;
    for (const [dx, dy] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
      [-2, -1],
      [2, -1],
    ] as const) {
      const [x, y] = [fx + dx, fy + dy];
      if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) continue;
      const i = y * w + x;
      if (bg[i] === ROAD || col[i] === BLOCK || taken.has(i)) continue;
      // まわり 8 マスが 歩ける（道しるべで 道を ふさがない）
      let ok = true;
      for (let oy = -1; oy <= 1 && ok; oy++)
        for (let ox = -1; ox <= 1 && ok; ox++) {
          const j = (y + oy) * w + x + ox;
          if (col[j] === BLOCK || (taken.has(j) && j !== i)) ok = false;
        }
      if (ok) {
        spot = i;
        break;
      }
    }
    if (spot < 0) continue;
    taken.add(spot);
    kept.push({ ...f, at: spot });
  }
  return kept.map(({ at, ways }) => ({ at, ways }));
}
