/**
 * フィールドの 地面を「草原＋その土地の 特色」だけに する（いまの マップに あとから かける）。
 *   pnpm exec tsx scripts/plain-ground.ts aomori
 * 残す 地面は scripts/data/plainGround.ts。それ以外の 山・森・砂浜・水辺・たんぼは 草原に なる。
 * かえるのは background の 地面の タイルだけ（山・森は もともと 通れるので、通れる 所は かわらない）。
 * 何回 かけても 同じ 結果に なる
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import { PLAIN_GROUND, type PlainKeep } from './data/plainGround';

const MAPS_DIR = fileURLToPath(new URL('../maps/', import.meta.url));
const PRETTIER = { ...((await resolveConfig(`${MAPS_DIR}map.json`)) ?? {}), parser: 'json' };

/** 地面の タイル → 種類（src/core/world/ground.ts の GROUND_TILES と 名所エリアの 見た目） */
const KIND = new Map<number, PlainKeep>([
  [149, 'forest'],
  [150, 'forest'],
  [11, 'forest'],
  [151, 'mountain'],
  [152, 'mountain'],
  [12, 'mountain'],
  [147, 'beach'],
  [148, 'beach'],
  [153, 'shore'],
  [154, 'shore'],
  [155, 'paddy'],
  [156, 'paddy'],
  [157, 'orchard'],
  [158, 'orchard'],
  [160, 'sakura'],
  [161, 'volcano'],
  [162, 'volcano'],
]);
/** 置きかえ先の タイル（2 つ目は noise で まぜる） */
const TILES: Partial<Record<PlainKeep, [number, number]>> = { forest: [149, 150], mountain: [151, 152] };

/** scaffold-maps.ts の noise と 同じ（草原の 3 しゅるいの まぜかたを 生成と そろえる） */
function noise(x: number, y: number): number {
  let h = Math.imul(x + 1, 0x27d4eb2d) ^ Math.imul(y + 1, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  return ((h ^ (h >>> 13)) >>> 0) / 0x100000000;
}
const grass = (x: number, y: number) => {
  const r = noise(x, y);
  return r < 0.72 ? 1 : r < 0.92 ? 14 : 13;
};

interface Layer {
  name: string;
  data?: number[];
}
interface Field {
  width: number;
  layers: Layer[];
  properties?: { name: string; value: unknown }[];
}

const prefIds = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (prefIds.length === 0) {
  console.error(`usage: tsx scripts/plain-ground.ts <県 id>（${Object.keys(PLAIN_GROUND).join('・')}）`);
  process.exit(1);
}

for (const prefId of prefIds) {
  const look = PLAIN_GROUND[prefId];
  if (!look) throw new Error(`scripts/data/plainGround.ts に ${prefId} が ない`);
  const file = `${MAPS_DIR}${prefId}-field.json`;
  const map = JSON.parse(readFileSync(file, 'utf8')) as Field;
  const bg = map.layers.find((l) => l.name === 'background')?.data;
  if (!bg) throw new Error(`${file} に background が ない`);
  const raw = map.properties?.find((p) => p.name === 'regions')?.value;
  const regions = typeof raw === 'string' ? (JSON.parse(raw) as { ids: string[]; rows: string[] }) : null;
  const regionAt = (x: number, y: number) => {
    const ch = regions?.rows[y]?.[x];
    return ch && ch !== '.' ? regions!.ids[ch.charCodeAt(0) - 97] : undefined;
  };
  for (const id of Object.keys(look.regions))
    if (!regions?.ids.includes(id)) throw new Error(`${prefId} の フィールドに ${id} エリアが ない`);

  const changed: Record<string, number> = {};
  for (let i = 0; i < bg.length; i++) {
    const kind = KIND.get(bg[i]!);
    if (!kind) continue;
    const x = i % map.width;
    const y = Math.floor(i / map.width);
    const region = regionAt(x, y);
    const to = (region ? look.replace?.[region]?.[kind] : undefined) ?? kind;
    const keep = look.keep.includes(to) || (region !== undefined && look.regions[region]?.includes(to));
    let tile = bg[i]!;
    if (!keep) tile = grass(x, y);
    else if (to !== kind) {
      const pair = TILES[to];
      if (!pair) throw new Error(`${to} には 置きかえられない`);
      tile = noise(x, y) < 0.6 ? pair[0] : pair[1];
    }
    if (tile !== bg[i]) {
      const key = `${region ?? '-'}:${kind}`;
      changed[key] = (changed[key] ?? 0) + 1;
      bg[i] = tile;
    }
  }
  writeFileSync(file, await format(JSON.stringify(map), PRETTIER), 'utf8');
  console.log(prefId, changed);
}
