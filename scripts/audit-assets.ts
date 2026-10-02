/** 静的画像へ差し替える作業を、県と種類ごとに並べた制作バックログを作る。 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadContent, type FileReader } from '../src/core/content/loader';
import type { ContentIndex } from '../src/core/content/loader';

export interface MissingAsset {
  key: string;
  path: string;
  kind: 'character' | 'portrait' | 'motif';
  area: string;
  priority: number;
}

export type ReleaseScope = 'aomori-mvp' | 'tohoku' | 'national';

export function releaseScope(area: string, areaOrder: ReadonlyMap<string, number>): ReleaseScope {
  if (area === 'aomori') return 'aomori-mvp';
  return (areaOrder.get(area) ?? 999) < 6 ? 'tohoku' : 'national';
}

const ROOT = resolve('.');

export function priorityFor(area: string, areaOrder: ReadonlyMap<string, number>): number {
  // 最初に遊ぶ青森、次に東北、以降はワールド進行順。
  if (area === 'aomori') return 1;
  const order = areaOrder.get(area) ?? 999;
  return order < 6 ? 2 : 3 + Math.floor(order / 10);
}

export function collectMissingAssets(content: ContentIndex, root = ROOT): MissingAsset[] {
  const areaOrder = new Map(
    content.world.islands.flatMap((island) => island.areas).map((area, index) => [area, index]),
  );
  const missing: MissingAsset[] = [];
  const add = (key: string, path: string, kind: MissingAsset['kind'], area: string): void => {
    if (existsSync(resolve(root, path))) return;
    missing.push({ key, path, kind, area, priority: priorityFor(area, areaOrder) });
  };

  for (const area of content.areas.values()) {
    for (const motif of area.motifs) {
      const id = motif.imageKey.replace(/^motif\.[^.]+\./, '');
      add(motif.imageKey, `assets/motifs/${area.id}/${id}.png`, 'motif', area.id);
    }
    for (const npc of area.town?.npcs ?? []) {
      const sprite = npc.spriteKey.replace(/^char\./, '');
      add(npc.spriteKey, `assets/sprites/characters/${sprite}.png`, 'character', area.id);
      if (npc.face) {
        const face = npc.face.replace(/^face\./, '');
        add(npc.face, `assets/portraits/${face}.png`, 'portrait', area.id);
      }
    }
  }

  return missing.sort(
    (a, b) =>
      a.priority - b.priority ||
      (areaOrder.get(a.area) ?? 999) - (areaOrder.get(b.area) ?? 999) ||
      a.kind.localeCompare(b.kind) ||
      a.key.localeCompare(b.key),
  );
}

export function buildAssetBacklog(missing: MissingAsset[]) {
  const byKind = Object.fromEntries(
    ['motif', 'character', 'portrait'].map((kind) => [
      kind,
      missing.filter((item) => item.kind === kind).length,
    ]),
  );
  const byArea = Object.fromEntries(
    [...new Set(missing.map((item) => item.area))].map((area) => [
      area,
      missing.filter((item) => item.area === area).length,
    ]),
  );
  const firstPriority = missing.length ? Math.min(...missing.map((x) => x.priority)) : 0;
  return {
    total: missing.length,
    byReleaseScope: {
      'aomori-mvp': missing.filter((item) => item.priority === 1).length,
      tohoku: missing.filter((item) => item.priority === 2).length,
      national: missing.filter((item) => item.priority > 2).length,
    },
    byKind,
    byArea,
    nextBatch: missing.filter((item) => item.priority === firstPriority).slice(0, 30),
    assets: missing,
  };
}

export async function auditAssets(root = ROOT): Promise<ReturnType<typeof buildAssetBacklog>> {
  const contentRoot = resolve(root, 'content');
  const fileReader: FileReader = async (relative) =>
    JSON.parse(await readFile(resolve(contentRoot, relative), 'utf8')) as unknown;
  const content = await loadContent(fileReader);
  return buildAssetBacklog(collectMissingAssets(content, root));
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === invokedPath) {
  const report = await auditAssets();
  await mkdir(resolve(ROOT, 'imports'), { recursive: true });
  await writeFile(resolve(ROOT, 'imports/asset-backlog.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`assets: ${report.total} static replacements pending (${JSON.stringify(report.byKind)})`);
}
