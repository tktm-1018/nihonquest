/**
 * フィールドの 道しるべと 地名（scripts/maps/fieldDecor.ts が マップに 書く）。Phaser に 依存しない。
 *   - readMapLook：マップの プロパティ（mapLook・compass・geoNames）
 *   - geoNameAt：近づくと 名前が 出る 地形（山・湖・海・半島・みさき・川）のうち、いま いちばん 近い もの
 *   - signText：道しるべの 文（↑ ○○エリアの ぬし ／ ← りんごの町 など）
 */
import { t } from '../../ui/i18n';

export type GeoKind = 'mountain' | 'lake' | 'sea' | 'peninsula' | 'cape' | 'river';
export interface GeoNameSpot {
  name: string;
  kind: GeoKind;
  x: number;
  y: number;
  r: number;
}
export interface MapLook {
  /** さかいの 山なみ・すそ・果樹園を 自然に 見せる（overworldView の natural） */
  natural: boolean;
  /** 小さな 地図に 方角（きた） */
  compass: boolean;
  geoNames: GeoNameSpot[];
}

type SignDir = 'up' | 'down' | 'left' | 'right';
export interface SignWay {
  d: SignDir;
  to: 'town' | 'dungeon' | 'region' | 'boss' | 'secret' | 'port' | 'landmark';
  id?: string;
}

const GEO_KINDS = new Set<GeoKind>(['mountain', 'lake', 'sea', 'peninsula', 'cape', 'river']);
const SIGN_DIRS = new Set<SignDir>(['up', 'down', 'left', 'right']);
const SIGN_TO = new Set<SignWay['to']>(['town', 'dungeon', 'region', 'boss', 'secret', 'port', 'landmark']);
const ARROW: Record<SignDir, string> = { up: '↑', right: '→', down: '↓', left: '←' };

const parseJson = (raw: unknown): unknown => {
  if (typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
};

/** Tiled の マップの プロパティ（Phaser は プロパティの 無い マップを {} に する） */
export function readMapLook(properties: unknown): MapLook {
  const list = Array.isArray(properties) ? (properties as { name: string; value: unknown }[]) : [];
  const value = (name: string) => list.find((p) => p.name === name)?.value;
  const geo = parseJson(value('geoNames'));
  const geoNames = (Array.isArray(geo) ? geo : []).filter(
    (g): g is GeoNameSpot =>
      typeof g === 'object' &&
      g !== null &&
      typeof (g as GeoNameSpot).name === 'string' &&
      GEO_KINDS.has((g as GeoNameSpot).kind) &&
      [(g as GeoNameSpot).x, (g as GeoNameSpot).y, (g as GeoNameSpot).r].every(Number.isFinite),
  );
  return { natural: value('mapLook') === 'natural', compass: value('compass') === true, geoNames };
}

/** (x, y) から r マス 以内の 地形で、いちばん 近い もの */
export function geoNameAt(spots: readonly GeoNameSpot[], x: number, y: number): GeoNameSpot | null {
  let best: GeoNameSpot | null = null;
  let bestD = Infinity;
  for (const s of spots) {
    const d = Math.hypot(s.x - x, s.y - y);
    if (d <= s.r && d < bestD) {
      best = s;
      bestD = d;
    }
  }
  return best;
}

export function parseSignWays(raw: unknown): SignWay[] {
  const data = parseJson(raw);
  return (Array.isArray(data) ? data : []).filter(
    (w): w is SignWay =>
      typeof w === 'object' &&
      w !== null &&
      SIGN_DIRS.has((w as SignWay).d) &&
      SIGN_TO.has((w as SignWay).to) &&
      ((w as SignWay).id === undefined || typeof (w as SignWay).id === 'string'),
  );
}

/** 道しるべに 書く 名前（町・お城・エリアの 名前は content から） */
export interface SignNames {
  town: string;
  secret: string | undefined;
  region(id: string): string | undefined;
}

/** 道しるべの 文：1 行目が「みちしるべ」、あとは 向きの 矢印と 行き先（上・右・下・左の じゅん） */
export function signText(ways: readonly SignWay[], names: SignNames): string {
  const order: SignDir[] = ['up', 'right', 'down', 'left'];
  const label = (w: SignWay): string => {
    const region = w.id ? names.region(w.id) : undefined;
    switch (w.to) {
      case 'town':
        return names.town;
      case 'region':
        return region ?? t('field.sign.region');
      case 'boss':
        return region ? t('field.sign.boss', { name: region }) : t('field.sign.bossAny');
      case 'secret':
        return names.secret ?? t('field.sign.secret');
      default:
        return t(`field.sign.${w.to}`);
    }
  };
  const lines = [...ways]
    .sort((a, b) => order.indexOf(a.d) - order.indexOf(b.d))
    .map((w) => `${ARROW[w.d]} ${label(w)}`);
  return [t('field.sign.title'), ...lines].join('\n');
}
