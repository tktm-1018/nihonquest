import type { BattleSummary } from '../../core/progression/battleResult';
import type { EncounterZone } from '../../core/battle/setup';
import type { Ground } from '../../core/world/ground';
import type { BattlePresentation } from './layout';

/** Overworld から Battle Scene へ渡す、表示層間の安定した契約。 */
export interface BattleSceneData {
  enemyId: string;
  level: number;
  zone: EncounterZone;
  /** フィールドの地面。バトル背景の選択に使う。 */
  ground?: Ground;
  /** 中ボス・県ボス・地方ボス戦。 */
  isBoss?: boolean;
  /** 開発者モードではボス戦からも離脱できる。 */
  devMode?: boolean;
  /** E2Eで報酬画面と仲間加入演出を確実に確認する。 */
  forceRecruitOffer?: boolean;
  /** 比較確認用の戦闘画面配置。省略時は正式仕様の奥行きビュー。 */
  presentation?: BattlePresentation;
}

/** Battle Scene が終了時に通知する最小限の結果。 */
export interface BattleEndPayload {
  outcome: BattleSummary['outcome'];
  goldLost: number;
}

/** フィールド側が戦闘後の処理を決めるための、遭遇元を表す情報。 */
export type EncounterSource =
  | { type: 'random' }
  | { type: 'mid-boss' }
  | { type: 'area-boss' }
  | { type: 'last-boss' }
  | { type: 'region-boss'; regionId: string }
  | { type: 'island-boss'; islandId: string }
  | { type: 'arena'; opponentId: string };

/** 1回の遭遇を一意に識別して Battle Scene へ渡す契約。 */
export interface BattleLaunchData extends BattleSceneData {
  encounterId: string;
  encounterSource: EncounterSource;
}

/** Battle Scene から、開始時の遭遇へ結果を正確に返すイベント。 */
export interface BattleEndEvent {
  encounterId: string;
  result: BattleEndPayload;
}

export function battleEndEvent(
  encounterId: string,
  outcome: BattleEndPayload['outcome'],
  goldLost: number,
): BattleEndEvent {
  return { encounterId, result: { outcome, goldLost } };
}
