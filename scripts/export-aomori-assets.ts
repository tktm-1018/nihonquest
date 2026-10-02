/** Export the existing, project-owned procedural Aomori art as deterministic PNGs. */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { deflateSync } from 'node:zlib';
import { NPC_LOOKS, walkFrames } from '../src/scenes/art/characters';
import type { Grid } from '../src/scenes/art/grid';
import { itemIconGrid } from '../src/scenes/art/itemIcons';
import { motifArtGrid } from '../src/scenes/art/motifArt';

const ROOT = resolve('.');
const AOMORI_MOTIFS = [
  'hirosaki-jo',
  'nebuta',
  'oirase',
  'oma-maguro',
  'osorezan',
  'ringo',
  'sannai-maruyama',
  'senbeijiru',
  'shirakami',
  'towada-ko',
  'tsugaru-kaikyo',
  'tsugaru-nuri',
] as const;
const NPC_ROLES = ['arena', 'board', 'dex', 'inn', 'shop', 'smith'] as const;
const ITEM_FALLBACKS = {
  'oma-maguro': 'consumable',
  ringo: 'consumable',
  senbeijiru: 'consumable',
  'tsugaru-nuri': 'material',
} as const;

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (const byte of bytes) c = crcTable[(c ^ byte) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Uint8Array): Buffer {
  const name = Buffer.from(type);
  const out = Buffer.alloc(data.length + 12);
  out.writeUInt32BE(data.length, 0);
  name.copy(out, 4);
  Buffer.from(data).copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([name, Buffer.from(data)])), data.length + 8);
  return out;
}
function png(grid: Grid): Buffer {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y += 1) {
    const offset = y * (1 + width * 4);
    raw[offset] = 0;
    for (let x = 0; x < width; x += 1) {
      const color = grid[y]![x];
      const pixel = offset + 1 + x * 4;
      if (!color) continue;
      const hex = color.slice(1);
      raw[pixel] = Number.parseInt(hex.slice(0, 2), 16);
      raw[pixel + 1] = Number.parseInt(hex.slice(2, 4), 16);
      raw[pixel + 2] = Number.parseInt(hex.slice(4, 6), 16);
      raw[pixel + 3] = 255;
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header.set([8, 6, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
function sheet(frames: Grid[], columns: number): Grid {
  const frameHeight = frames[0]!.length;
  const frameWidth = frames[0]![0]!.length;
  const rows = Math.ceil(frames.length / columns);
  const out: Grid = Array.from({ length: frameHeight * rows }, () =>
    Array<string | null>(frameWidth * columns).fill(null),
  );
  frames.forEach((frame, index) => {
    const ox = (index % columns) * frameWidth;
    const oy = Math.floor(index / columns) * frameHeight;
    frame.forEach((row, y) => row.forEach((color, x) => (out[oy + y]![ox + x] = color)));
  });
  return out;
}
async function save(path: string, grid: Grid): Promise<void> {
  const target = resolve(ROOT, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, png(grid));
  console.log(path);
}

for (const id of AOMORI_MOTIFS) {
  const fallbackKind = ITEM_FALLBACKS[id as keyof typeof ITEM_FALLBACKS];
  const grid =
    motifArtGrid('aomori', { id }) ??
    (fallbackKind ? itemIconGrid({ id: `aomori-${id}`, kind: fallbackKind }) : null);
  if (!grid) throw new Error(`procedural motif and item fallback missing: ${id}`);
  await save(`assets/motifs/aomori/${id}.png`, grid);
}
for (const role of NPC_ROLES) {
  const look = NPC_LOOKS[role];
  if (!look) throw new Error(`NPC look missing: ${role}`);
  await save(`assets/sprites/characters/npc-aomori-${role}.png`, sheet(walkFrames(look), 3));
}
const shop = NPC_LOOKS.shop!;
const front = walkFrames(shop)[1]!;
const portrait: Grid = Array.from({ length: 48 }, () => Array<string | null>(48).fill(null));
front.forEach((row, y) =>
  row.forEach((color, x) => {
    for (let dy = 0; dy < 2; dy += 1)
      for (let dx = 0; dx < 2; dx += 1) portrait[y * 2 + dy]![x * 2 + dx + 8] = color;
  }),
);
await save('assets/portraits/npc-aomori-shop.png', portrait);
