import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FIELD_LOOKS } from '../../scripts/data/mapLooks';
import { decorateField, type TiledJson } from '../../scripts/maps/fieldDecor';
import { overworldView, VIEW, viewTileAt } from '../../src/rendering/overworld/overworldView';
import { geoNameAt, parseSignWays, readMapLook, signText } from '../../src/scenes/overworld/mapGuides';
import { SP } from '../../src/shared/specialTiles';
import { project, type Proj } from '../../scripts/terrain/raster';

const MAPS = new URL('../../maps/', import.meta.url);
const load = (key: string) => JSON.parse(readFileSync(new URL(`${key}.json`, MAPS), 'utf8')) as TiledJson;
const layer = (m: TiledJson, name: string) => m.layers.find((l) => l.name === name);
const prop = (m: TiledJson, name: string) => m.properties?.find((p) => p.name === name)?.value;
const TERRAIN = JSON.parse(
  readFileSync(new URL('../../scripts/data/terrain.json', import.meta.url), 'utf8'),
) as { maps: Record<string, { panels: { bbox: [number, number, number, number]; proj: Proj }[] }> };

describe('マップの 県ごとの 見た目（青森で ためす）', () => {
  it('natural の さかいの 山なみは 森・岩・岩山を まぜ、山の そばは 雪の 山', () => {
    const w = 40;
    const bg = new Array<number>(w * 3).fill(1);
    for (let x = 0; x < w; x++) bg[w + x] = 159;
    const looks = new Set(
      Array.from({ length: w }, (_, x) => viewTileAt(bg, w, 3, w + x, { natural: true })),
    );
    expect(looks.has(VIEW.RIDGE_PINE) || looks.has(VIEW.RIDGE_ROCK)).toBe(true);
    expect(looks.has(VIEW.RIDGE) || looks.has(VIEW.RIDGE2)).toBe(true);
    bg[0] = 151;
    expect(viewTileAt(bg, w, 3, w, { natural: true })).toBe(VIEW.RIDGE_SNOW);
    // natural で ない マップは いままでの まま
    expect([VIEW.RIDGE, VIEW.RIDGE2]).toContain(viewTileAt(bg, w, 3, w + 5));
  });

  it('natural の すそ（さかいの となり）と 果樹園は 絵が ばらける。natural で ない マップは かわらない', () => {
    const w = 60;
    const h = 5;
    const bg = new Array<number>(w * h).fill(1);
    for (let x = 0; x < w; x++) {
      bg[2 * w + x] = 159;
      bg[4 * w + x] = 157;
    }
    const natural = overworldView(bg, w, h, { natural: true });
    const plain = overworldView(bg, w, h);
    const foot = new Set([VIEW.FOOT_ROCK, VIEW.FOOT_BUSH, VIEW.FOOT_GRASS]);
    expect(natural.slice(w, 2 * w).some((v) => foot.has(v as never))).toBe(true);
    expect(plain.some((v) => foot.has(v as never))).toBe(false);
    const orchard = new Set(natural.slice(4 * w));
    expect(orchard.size).toBeGreaterThan(2);
    expect(new Set(plain.slice(4 * w))).toEqual(new Set([VIEW.ORCHARD]));
  });

  it('マップの プロパティ（mapLook・compass・geoNames）を 読む。こわれた 値は 無視する', () => {
    const look = readMapLook([
      { name: 'mapLook', value: 'natural' },
      { name: 'compass', value: true },
      {
        name: 'geoNames',
        value: JSON.stringify([
          { name: '岩木山[いわきさん]', kind: 'mountain', x: 10, y: 10, r: 5 },
          { name: 'へん', kind: 'castle', x: 1, y: 1, r: 1 },
        ]),
      },
    ]);
    expect(look).toEqual({
      natural: true,
      compass: true,
      geoNames: [{ name: '岩木山[いわきさん]', kind: 'mountain', x: 10, y: 10, r: 5 }],
    });
    expect(readMapLook({})).toEqual({ natural: false, compass: false, geoNames: [] });
    expect(readMapLook([{ name: 'geoNames', value: '{こわれた' }]).geoNames).toEqual([]);
  });

  it('地名は r マス 以内の いちばん 近い もの', () => {
    const spots = [
      { name: 'A', kind: 'mountain' as const, x: 0, y: 0, r: 5 },
      { name: 'B', kind: 'lake' as const, x: 6, y: 0, r: 5 },
    ];
    expect(geoNameAt(spots, 1, 0)?.name).toBe('A');
    expect(geoNameAt(spots, 4, 0)?.name).toBe('B');
    expect(geoNameAt(spots, 3, 9)).toBeNull();
  });

  it('道しるべは 上・右・下・左の じゅんに 矢印と 行き先を ならべる。知らない 向きは すてる', () => {
    const ways = parseSignWays(
      JSON.stringify([
        { d: 'left', to: 'town' },
        { d: 'up', to: 'boss', id: 'nebuta' },
        { d: 'north', to: 'town' },
        { d: 'right', to: 'region', id: 'sannai' },
      ]),
    );
    expect(ways).toHaveLength(3);
    const text = signText(ways, {
      town: 'りんごの 町[まち]',
      secret: undefined,
      region: (id) => ({ nebuta: 'ねぶたエリア', sannai: 'さんないエリア' })[id],
    });
    const lines = text.split('\n');
    expect(lines[1]).toMatch(/^↑ /);
    expect(lines[2]).toBe('→ さんないエリア');
    expect(lines[3]).toBe('← りんごの 町[まち]');
    expect(parseSignWays('こわれた')).toEqual([]);
  });

  it('フィールドの かざりは 何回 足しなおしても 同じで、maps/aomori-field.json は いまの かざりの まま', () => {
    const file = load('aomori-field');
    const again = structuredClone(file);
    const look = FIELD_LOOKS.aomori!;
    const terrain = TERRAIN.maps['aomori-field']!;
    decorateField(again, look, (ll) => {
      const panel =
        terrain.panels.find(
          ({ bbox: b }) => ll[0] >= b[0] && ll[0] <= b[2] && ll[1] >= b[1] && ll[1] <= b[3],
        ) ?? terrain.panels.at(-1)!;
      return project(panel.proj, ll);
    });
    expect(again).toEqual(file);
  });

  it('青森の フィールド：通れない かざりは まわり 8 マスが 歩け、道しるべは 道の となりの 歩ける マス', () => {
    const m = load('aomori-field');
    const w = m.width;
    const bg = layer(m, 'background')!.data!;
    const col = layer(m, 'collision')!.data!;
    const decorBlocked = JSON.parse(String(prop(m, 'decorBlocked'))) as number[];
    expect(decorBlocked.length).toBeGreaterThan(5);
    for (const i of decorBlocked)
      for (const d of [-w - 1, -w, -w + 1, -1, 1, w - 1, w, w + 1])
        expect(col[i + d], `${i} の まわり`).toBe(0);
    const signs = layer(m, 'objects')!.objects!.filter((o) => o.type === 'signpost');
    expect(signs.length).toBeGreaterThanOrEqual(3);
    for (const s of signs) {
      const i = (s.y / 16) * w + s.x / 16;
      expect(col[i]).toBe(0);
      expect(bg[i]).not.toBe(163);
      expect(parseSignWays(s.properties?.[0]?.value).length).toBeGreaterThanOrEqual(2);
    }
    expect(prop(m, 'mapLook')).toBe('natural');
    expect(prop(m, 'compass')).toBe(true);
  });

  it('青森の 町・ダンジョン・裏ステージに 名物が ある（ねぶた・アスパム・八甲田丸・恐山・参道）', () => {
    const tiles = (key: string) => {
      const m = load(key);
      return new Set([...(layer(m, 'background')?.data ?? []), ...(layer(m, 'decor')?.data ?? [])]);
    };
    const town = tiles('aomori-town');
    for (const t of [SP.nebuta, SP.aspam, SP.ferry, SP.appleStall, SP.kingyo])
      expect(town.has(t), `町 ${t}`).toBe(true);
    const dungeon = tiles('aomori-dungeon');
    for (const t of [SP.ashFloor, SP.ashFace, SP.lake, SP.bridge, SP.cairn])
      expect(dungeon.has(t), `ダンジョン ${t}`).toBe(true);
    const secret = tiles('aomori-secret');
    for (const t of [SP.carpet, SP.petals]) expect(secret.has(t), `裏ステージ ${t}`).toBe(true);
    // ほかの 県は いままでの まま（特別な タイルを 使わない）
    const iwate = tiles('iwate-town');
    expect([...iwate].some((t) => t >= SP.nebuta)).toBe(false);
  });
});
