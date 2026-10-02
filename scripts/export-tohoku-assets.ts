/** Export project-owned procedural art for the six Tohoku prefectures as deterministic PNGs. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { deflateSync } from 'node:zlib';
import { loadContent, type FileReader } from '../src/core/content/loader';
import { NPC_LOOKS, walkFrames } from '../src/scenes/art/characters';
import type { Grid } from '../src/scenes/art/grid';
import { itemIconGrid } from '../src/scenes/art/itemIcons';
import { motifArtGrid } from '../src/scenes/art/motifArt';

const ROOT = resolve('.');
const CONTENT = resolve(ROOT, 'content');
const TOHOKU = new Set(['aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima']);
const CHECKED_AT = '2026-10-03';

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

function scale(grid: Grid, factor: number): Grid {
  return grid.flatMap((row) =>
    Array.from({ length: factor }, () => row.flatMap((color) => Array(factor).fill(color))),
  );
}

async function save(path: string, grid: Grid): Promise<void> {
  const target = resolve(ROOT, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, png(grid));
}

const read: FileReader = async (relative) =>
  JSON.parse(await readFile(resolve(CONTENT, relative), 'utf8')) as unknown;
const content = await loadContent(read);
const rights: Array<Record<string, unknown>> = [];

function record(path: string, kind: string, source: string): void {
  rights.push({
    path,
    kind,
    author: 'nihonquest contributors',
    productionMethod: 'deterministic procedural pixel-art export',
    sourceReference: source,
    license: 'project-origin; ownership proof pending',
    rightsStatus: 'hold-pending-human-ownership-confirmation',
    modificationAllowed: true,
    redistributionAllowed: null,
    creditRequired: false,
    proofCheckedAt: CHECKED_AT,
  });
}

for (const area of content.areas.values()) {
  if (!TOHOKU.has(area.id)) continue;
  for (const motif of area.motifs) {
    const id = motif.imageKey.replace(/^motif\.[^.]+\./, '');
    const procedural = motifArtGrid(area.id, motif);
    const grid = procedural ?? scale(itemIconGrid({ id: `${area.id}-${id}`, kind: 'material' }), 2);
    const path = `assets/motifs/${area.id}/${id}.png`;
    await save(path, grid);
    record(
      path,
      'motif',
      procedural
        ? `src/scenes/art/motifArt (scene for ${area.id}.${id})`
        : `src/scenes/art/itemIcons (fallback for ${area.id}.${id})`,
    );
  }
  for (const npc of area.town?.npcs ?? []) {
    const role = NPC_LOOKS[npc.role] ? npc.role : 'talk';
    const look = NPC_LOOKS[role]!;
    const sprite = npc.spriteKey.replace(/^char\./, '');
    const path = `assets/sprites/characters/${sprite}.png`;
    await save(path, sheet(walkFrames(look), 3));
    record(path, 'character', `src/scenes/art/characters NPC_LOOKS.${role}`);

    if (npc.face) {
      const face = npc.face.replace(/^face\./, '');
      const front = walkFrames(look)[1]!;
      const portrait: Grid = Array.from({ length: 48 }, () => Array<string | null>(48).fill(null));
      front.forEach((row, y) =>
        row.forEach((color, x) => {
          for (let dy = 0; dy < 2; dy += 1)
            for (let dx = 0; dx < 2; dx += 1) portrait[y * 2 + dy]![x * 2 + dx + 8] = color;
        }),
      );
      const portraitPath = `assets/portraits/${face}.png`;
      await save(portraitPath, portrait);
      record(portraitPath, 'portrait', `src/scenes/art/characters NPC_LOOKS.${role}`);
    }
  }
}

rights.sort((a, b) => String(a.path).localeCompare(String(b.path)));
await mkdir(resolve(ROOT, 'content/quality'), { recursive: true });
await writeFile(
  resolve(ROOT, 'content/quality/media-rights.json'),
  `${JSON.stringify(
    {
      version: 1,
      policy: { unknownLicenseAllowed: false, approvalRequiresProof: true },
      bundledAssets: rights,
      runtimeAudio: [
        {
          kind: 'english-voice',
          implementation: 'Web Speech API en-US',
          bundledFile: false,
          status: 'runtime-dependent',
          note: 'No voice file is redistributed. Questions remain readable and answerable without speech.',
        },
      ],
      audioDecision: {
        bgm: 'not-bundled-until-project-owned-or-clearly-redistributable-audio-is-approved',
        se: 'not-bundled-until-project-owned-or-clearly-redistributable-audio-is-approved',
        englishVoice: 'runtime-web-speech-api-no-bundled-file',
      },
      releaseDecision: {
        status: 'NO-GO',
        blocker:
          'A named human must confirm authorship and redistribution rights for the procedural source before release.',
      },
      externalCredits: [
        {
          asset: 'PixelMplus12',
          source: 'src/ui/fonts/LICENSE-PixelMplus.txt',
          license: 'M+ FONT LICENSE',
          credit: 'M+ FONTS PROJECT / PixelMplus',
        },
        {
          asset: 'prefecture boundaries and coastline',
          source: '地球地図日本（国土地理院）, converted by dataofjapan/land',
          url: 'https://www.gsi.go.jp/kankyochiri/gm_jpn.html',
          releaseAction: 'For commercial use, submit the usage report required by GSI.',
        },
        {
          asset: 'elevation',
          source: '国土地理院 標高タイル DEM10B',
          url: 'https://maps.gsi.go.jp/development/ichiran.html',
        },
        {
          asset: 'Lake Biwa geometry',
          source: 'Natural Earth',
          license: 'public domain',
        },
      ],
    },
    null,
    2,
  )}\n`,
);

console.log(`exported ${rights.length} Tohoku assets and wrote media-rights.json`);
