/**
 * フィールドの「中ボス → ワープホール → 次の県」の道すじ。純粋関数のみ。
 * 県の順番は content/world/japan.json の islands[].order と islands[].areas の並び（コードに県名を書かない）。
 */
import type { Area, Motif, World } from '../content/schemas';

export interface NextStop {
  id: string;
  mapKey: string;
}

/**
 * 中ボスを倒したあとのワープ先のフィールド。同じ島（地方）の次の県。
 * 島の最後の県では地方ボスが次の島への結界を管理するため null。
 * どの島にも無い県も null。
 */
export function nextStop(
  world: World,
  areaId: string,
  fieldKeyOf: (areaId: string) => string = (id) => `${id}-field`,
): NextStop | null {
  const island = world.islands.find((candidate) => candidate.areas.includes(areaId));
  if (!island) return null;
  const next = island.areas[island.areas.indexOf(areaId) + 1];
  return next ? { id: next, mapKey: fieldKeyOf(next) } : null;
}

/** progress.eventsDone に入れる「中ボスを倒した」しるし */
export const midBossFlag = (areaId: string): string => `midboss.${areaId}`;

/** progress.eventsDone に入れる「ダンジョンの おくの 県ボスを倒した」しるし */
export const areaBossFlag = (areaId: string): string => `boss.${areaId}`;

/** 裏ステージの ラスボス（歴史上の 人物）を 倒した しるし（progress.eventsDone） */
export const lastBossFlag = (areaId: string): string => `lastboss.${areaId}`;

/** 名所エリアの ぬしを 倒した しるし（progress.eventsDone）。この エリアが openedBy の 関所が ひらく */
export const regionBossFlag = (areaId: string, regionId: string): string =>
  `regionboss.${areaId}.${regionId}`;

/** dex.motifs に入れる「名所スタンプ」の id。スタンプを持っている＝その名所を見つけた */
export const motifStamp = (areaId: string, motifId: string): string => `${areaId}.${motifId}`;

/** 特産品（たべもの・こうげいひん）は 宝箱で 見つける。ボスを 倒しても 見つけた ことに しない */
const SPECIALTY_KINDS: ReadonlySet<Motif['kind']> = new Set(['food', 'craft']);

/**
 * ボスを 倒して 見つける 名所（2026-10-12「看板を見たらゴールになってしまう感じがするので、その地域のラスボスを倒したら名所発見」）。
 * 名所エリアの ある 県は ぬしを 倒すと その エリアの 名所（regionId を わたす）、
 * エリアの ない 県は 県ボスを 倒すと 県の 名所 ぜんぶ（regionId なし）。特産品は のぞく
 */
export function bossDiscoveries(area: Pick<Area, 'motifs' | 'regions'>, regionId?: string): Motif[] {
  const ids =
    regionId === undefined ? null : new Set(area.regions.find((r) => r.id === regionId)?.motifs ?? []);
  return area.motifs.filter((m) => !SPECIALTY_KINDS.has(m.kind) && (!ids || ids.has(m.id)));
}

/** 看板の 名所が ボスで 見つかる 名所か（特産品の 看板は 今までどおり 着いたら 見つかる） */
export const discoveredByBoss = (motif: Pick<Motif, 'kind'>): boolean => !SPECIALTY_KINDS.has(motif.kind);
