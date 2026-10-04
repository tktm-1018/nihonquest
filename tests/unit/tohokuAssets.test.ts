import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { inflateSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { NQ48 } from '../../src/scenes/art/palette';

const ROOT = resolve('.');
const AREAS = ['aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'] as const;

interface Decoded {
  width: number;
  height: number;
  pixels: Buffer;
}

function decodeOwnPng(bytes: Buffer): Decoded {
  expect(bytes.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  let offset = 8;
  let width = 0;
  let height = 0;
  const compressed: Buffer[] = [];
  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      expect([...data.subarray(8, 13)]).toEqual([8, 6, 0, 0, 0]);
    }
    if (type === 'IDAT') compressed.push(data);
    offset += length + 12;
  }
  const raw = inflateSync(Buffer.concat(compressed));
  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const row = y * (1 + width * 4);
    expect(raw[row]).toBe(0);
    raw.copy(pixels, y * width * 4, row + 1, row + 1 + width * 4);
  }
  return { width, height, pixels };
}

async function pngPaths(): Promise<string[]> {
  const paths: string[] = [];
  for (const area of AREAS) {
    const dir = resolve(ROOT, 'assets/motifs', area);
    for (const name of await readdir(dir)) paths.push(`assets/motifs/${area}/${name}`);
  }
  const characterDir = resolve(ROOT, 'assets/sprites/characters');
  for (const name of await readdir(characterDir)) {
    if (AREAS.some((area) => name.startsWith(`npc-${area}-`)))
      paths.push(`assets/sprites/characters/${name}`);
  }
  const portraitDir = resolve(ROOT, 'assets/portraits');
  for (const name of await readdir(portraitDir)) {
    if (AREAS.some((area) => name.startsWith(`npc-${area}-`))) paths.push(`assets/portraits/${name}`);
  }
  return paths.sort();
}

describe('東北の本番静的素材', () => {
  it('86件があり、寸法・透明色・NQ-48・空画像を検査できる', async () => {
    const palette = new Set(NQ48.map((color) => color.toLowerCase()));
    const paths = await pngPaths();
    expect(paths).toHaveLength(86);
    const failures: string[] = [];
    for (const path of paths) {
      const { width, height, pixels } = decodeOwnPng(await readFile(resolve(ROOT, path)));
      const expected = path.includes('/motifs/')
        ? [32, 32]
        : path.includes('/sprites/characters/')
          ? [48, 96]
          : [48, 48];
      if (width !== expected[0] || height !== expected[1])
        failures.push(`${path}: ${width}x${height}, expected ${expected.join('x')}`);
      let opaque = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        const alpha = pixels[i + 3]!;
        if (alpha !== 0 && alpha !== 255) failures.push(`${path}: alpha ${alpha}`);
        if (!alpha) continue;
        opaque += 1;
        const color = `#${pixels.subarray(i, i + 3).toString('hex')}`;
        if (!palette.has(color)) failures.push(`${path}: ${color}`);
      }
      if (!opaque) failures.push(`${path}: empty`);
    }
    expect(failures).toEqual([]);
  });

  it('86件すべてに個別の権利証跡があり、未知ライセンスを許可しない', async () => {
    const paths = await pngPaths();
    const ledger = JSON.parse(await readFile(resolve(ROOT, 'content/quality/media-rights.json'), 'utf8')) as {
      policy: { unknownLicenseAllowed: boolean; approvalRequiresProof: boolean };
      bundledAssets: Array<Record<string, unknown> & { path: string }>;
    };
    expect(ledger.policy).toEqual({ unknownLicenseAllowed: false, approvalRequiresProof: true });
    expect(ledger.bundledAssets.map((asset) => asset.path).sort()).toEqual(paths);
    for (const asset of ledger.bundledAssets) {
      expect(asset.author).toBeTruthy();
      expect(asset.productionMethod).toBeTruthy();
      expect(asset.sourceReference).toBeTruthy();
      expect(asset.license).toBe('project-origin; ownership proof pending');
      expect(asset.rightsStatus).toBe('hold-pending-human-ownership-confirmation');
      expect(asset.modificationAllowed).toBe(true);
      expect(asset.redistributionAllowed).toBeNull();
      expect(asset.creditRequired).toBe(false);
      expect(asset.proofCheckedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
