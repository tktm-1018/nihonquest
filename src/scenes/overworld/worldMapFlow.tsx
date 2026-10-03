import { h, render } from 'preact';
import type { ContentIndex } from '../../core/content/loader';
import type { Area, Region } from '../../core/content/schemas';
import { canChallengeIslandBoss, completeIsland } from '../../core/progression/island';
import { midBossFlag, motifStamp } from '../../core/progression/route';
import type { GameState } from '../../core/state/schema';
import type { DialogueLine } from '../../ui/dialogue';
import {
  WorldMapOverlay,
  type MapAreaInfo,
  type MapRegionInfo,
  type WorldMapData,
} from '../../ui/field/WorldMapOverlay';
import { t } from '../../ui/i18n';
import { stripRuby } from '../../ui/ruby';
import { playSfx } from '../../ui/sfx';
import { ENCLAVES } from '../../../scripts/data/prefectures';

const SPECIALTY_KINDS = new Set(['food', 'craft']);

type PlaceKind = 'field' | 'town' | 'dungeon' | 'enclave' | 'secret';

export function placeDisplayName(
  kind: PlaceKind,
  mapKey: string,
  area: Area | undefined,
  region: Region | undefined,
): { title: string; sub: string } {
  const enclave = kind === 'enclave' ? ENCLAVES.find((entry) => entry.enclaveId === mapKey) : undefined;
  const title =
    enclave?.name ??
    (kind === 'town' ? area?.town?.name : kind === 'secret' ? area?.secret?.name : undefined) ??
    area?.name ??
    mapKey;
  if (region) return { title, sub: stripRuby(region.name, 'kana') };
  return {
    title,
    sub: t(
      {
        field: 'field.kindField',
        town: 'field.kindTown',
        dungeon: 'field.kindDungeon',
        enclave: 'field.kindEnclave',
        secret: 'field.kindSecret',
      }[kind],
    ),
  };
}

export function buildWorldMapRegions(
  data: WorldMapData | undefined,
  content: ContentIndex | undefined,
  game: GameState | undefined,
  visited: ReadonlySet<string>,
): MapRegionInfo[] {
  if (!data || !content) return [];
  const islands = new Map(content.world.islands.map((island) => [island.id, island]));
  const regions = data.regions.filter((region) => islands.has(region.id));
  regions.sort((a, b) => islands.get(a.id)!.order - islands.get(b.id)!.order);
  return regions.map((region) => {
    const island = islands.get(region.id)!;
    const foundSigns = island.areas.filter((id) => game?.progress.areaSigns.includes(id)).length;
    const cleared = game?.progress.islandsCleared.includes(island.id) ?? false;
    const ready = !!game && canChallengeIslandBoss(content.world, island.id, game.progress);
    return {
      id: region.id,
      name: island.name,
      width: region.width,
      height: region.height,
      rows: region.rows,
      status: island.status,
      islandBoss: {
        name: content.monsters.get(island.bossId)?.name ?? island.bossId,
        state: cleared ? 'done' : ready ? 'ready' : 'locked',
        foundSigns,
        requiredSigns: island.areas.length,
      },
      areas: region.areas.map((mapArea): MapAreaInfo => {
        const area = content.areas.get(mapArea.id);
        return {
          id: mapArea.id,
          name: area?.name ?? mapArea.id,
          capital: mapArea.capital,
          stamps: mapArea.stamps.flatMap((id) => {
            const motif = area?.motifs.find((candidate) => candidate.id === id);
            if (!motif) return [];
            const box =
              SPECIALTY_KINDS.has(motif.kind) && !area?.events.some((event) => event.motifId === id);
            return [
              {
                name: game?.dex.motifs.includes(motifStamp(mapArea.id, id))
                  ? stripRuby(motif.name, 'kana')
                  : null,
                box,
              },
            ];
          }),
          boss: !area?.midBoss
            ? 'none'
            : game?.progress.eventsDone.includes(midBossFlag(area.id))
              ? 'done'
              : 'yet',
          visited: island.status === 'playable' && visited.has(mapArea.id),
        };
      }),
    };
  });
}

export function mountWorldMap(root: Element, props: Parameters<typeof WorldMapOverlay>[0]): void {
  render(h(WorldMapOverlay, props), root);
}

export interface MapTilePoint {
  index: number;
  x: number;
  y: number;
}

export function worldMapHere(
  areaId: string,
  tiles: readonly MapTilePoint[] | undefined,
  player: [number, number],
  blockedTile: number,
): { areaId: string; at?: [number, number] } {
  if (!tiles) return { areaId };
  const land = tiles.filter((tile) => tile.index !== blockedTile);
  if (!land.length) return { areaId };
  const xs = land.map((tile) => tile.x);
  const ys = land.map((tile) => tile.y);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  const x1 = Math.max(...xs);
  const y1 = Math.max(...ys);
  const [px, py] = player;
  return { areaId, at: [(px - x0 + 0.5) / (x1 - x0 + 1), (py - y0 + 0.5) / (y1 - y0 + 1)] };
}

export function islandBossChallengeDialogue(bossName: string): DialogueLine[] {
  return [
    { speaker: t('field.prologueFairy'), text: t('field.islandBossAsk') },
    { speaker: t('field.prologueFairy'), text: t('field.islandBossIntroFairy') },
    { speaker: bossName, text: t('field.islandBossRoar') },
  ];
}

export function islandBossClearDialogue(bossName: string | undefined): DialogueLine[] {
  return [
    { speaker: bossName, text: t('field.islandBossSecret') },
    { speaker: t('field.prologueFairy'), text: t('field.islandFairyDeflect') },
    { text: t('field.islandBossCleared') },
    { text: t('field.islandBagGrew') },
    { speaker: t('field.prologueFairy'), text: t('field.islandFairyNext') },
    { text: t('field.islandChapterEnd') },
  ];
}

interface IslandBossChallengeCallbacks {
  choose: (lines: DialogueLine[], choices: string[]) => Promise<number>;
  standStill: () => void;
  setBusy: (busy: boolean) => void;
  setPending: (islandId: string) => void;
  startBattle: (enemyId: string, level: number) => void;
}

export async function runIslandBossChallenge(
  content: ContentIndex | undefined,
  game: GameState | undefined,
  islandId: string,
  level: number,
  callbacks: IslandBossChallengeCallbacks,
): Promise<void> {
  const island = content?.world.islands.find((candidate) => candidate.id === islandId);
  const boss = island ? content?.monsters.get(island.bossId) : undefined;
  if (
    !content ||
    !game ||
    !island ||
    !boss ||
    !canChallengeIslandBoss(content.world, islandId, game.progress)
  )
    return;
  callbacks.setBusy(true);
  callbacks.standStill();
  const choice = await callbacks.choose(islandBossChallengeDialogue(boss.name), [t('ui.yes'), t('ui.no')]);
  callbacks.setBusy(false);
  if (choice !== 0) return;
  callbacks.setPending(islandId);
  callbacks.startBattle(boss.id, Math.max(1, level));
}

interface IslandBossClearCallbacks {
  setBusy: (busy: boolean) => void;
  setGame: (game: GameState) => void;
  wait: (milliseconds: number) => Promise<void>;
  talk: (lines: DialogueLine[]) => Promise<void>;
}

export async function runIslandBossClear(
  content: ContentIndex | undefined,
  game: GameState | undefined,
  islandId: string,
  callbacks: IslandBossClearCallbacks,
): Promise<void> {
  if (!content || !game) return;
  const next = completeIsland(game, content.world, islandId);
  if (next === game) return;
  callbacks.setBusy(true);
  callbacks.setGame(next);
  await callbacks.wait(650);
  playSfx('victory');
  const island = content.world.islands.find((candidate) => candidate.id === islandId);
  await callbacks.talk(islandBossClearDialogue(content.monsters.get(island?.bossId ?? '')?.name));
  callbacks.setBusy(false);
}
