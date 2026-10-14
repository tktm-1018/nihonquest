/**
 * 地方（島）の 章の 会話。地方ボスへの いどみ・浄化のあと・航路で ひらいた 島への 到着。
 * 文言は content/i18n の field.island.<島>.<key> を 先に見て、無ければ field.<key> を つかう。
 */
import type { ContentIndex } from '../../core/content/loader';
import { bagDimensions } from '../../core/progression/bag';
import { islandArrivalFlag } from '../../core/progression/island';
import type { GameState } from '../../core/state/schema';
import type { DialogueLine } from '../../ui/dialogue';
import { t, tOpt, type I18nVars } from '../../ui/i18n';

export function islandText(islandId: string, key: string, vars?: I18nVars): string {
  const own = `field.island.${islandId}.${key}`;
  return t(tOpt(own) === undefined ? `field.${key}` : own, vars);
}

/** 地方ボスに いどむ前の 会話（最後に はい／いいえ を 出す） */
export function islandBossIntro(islandId: string, bossName: string): DialogueLine[] {
  const fairy = t('field.prologueFairy');
  return [
    { speaker: fairy, text: islandText(islandId, 'islandBossAsk') },
    { speaker: fairy, text: islandText(islandId, 'islandBossIntroFairy') },
    { speaker: bossName, text: islandText(islandId, 'islandBossRoar') },
  ];
}

/** 地方ボスを 浄化した あとの 会話。cleared は 島クリアを 記録した あとの セーブ */
export function islandBossOutro(content: ContentIndex, islandId: string, cleared: GameState): DialogueLine[] {
  const island = content.world.islands.find((candidate) => candidate.id === islandId);
  const bossName = content.monsters.get(island?.bossId ?? '')?.name;
  const vars = { region: island?.name ?? '', ...bagDimensions(cleared) };
  const fairy = t('field.prologueFairy');
  return [
    { speaker: bossName, text: islandText(islandId, 'islandBossSecret', vars) },
    { speaker: fairy, text: islandText(islandId, 'islandFairyDeflect', vars) },
    { text: islandText(islandId, 'islandBossCleared', vars) },
    { text: islandText(islandId, 'islandBagGrew', vars) },
    { speaker: fairy, text: islandText(islandId, 'islandFairyNext', vars) },
    { text: islandText(islandId, 'islandChapterEnd', vars) },
  ];
}

/**
 * 航路で ひらいた 島の 最初の 県に はじめて 着いたら、妖精の ひとことと 見た しるしを かえす。
 * field.island.<島>.arrive が ある 島だけ。見せる ものが 無ければ null。
 */
export function islandArrival(
  content: ContentIndex,
  gs: GameState,
  areaId: string,
): { flag: string; line: DialogueLine } | null {
  const island = content.world.islands.find((candidate) => candidate.areas[0] === areaId);
  if (!island?.opensAfter) return null;
  const key = `field.island.${island.id}.arrive`;
  const flag = islandArrivalFlag(island.id);
  if (tOpt(key) === undefined || gs.progress.eventsDone.includes(flag)) return null;
  return { flag, line: { speaker: t('field.prologueFairy'), text: t(key) } };
}
