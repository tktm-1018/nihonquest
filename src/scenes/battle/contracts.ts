import type { BattleSummary } from '../../core/progression/battleResult';
import type { EncounterZone } from '../../core/battle/setup';
import type { Ground } from '../../core/world/ground';

export type EncounterSource =
  | { type: 'random' }
  | { type: 'mid-boss' }
  | { type: 'area-boss' }
  | { type: 'last-boss' }
  | { type: 'region-boss'; regionId: string }
  | { type: 'island-boss'; islandId: string }
  | { type: 'arena'; opponentId: string };

export interface BattleSceneData {
  enemyId: string;
  level: number;
  zone: EncounterZone;
  /** フィールドの 地面（すなはま・もり …）。バトルの 背景が かわる */
  ground?: Ground;
  /** 中ボス・県ボス・地方ボス戦（にげられない）。省略時はモンスター定義の isBoss */
  isBoss?: boolean;
  /** 開発者モード：ボス戦でも にげられる（ふつうの モンスターとは そもそも 出会わない） */
  devMode?: boolean;
}

export interface BattleLaunchData extends BattleSceneData {
  encounterId: string;
  encounterSource: EncounterSource;
}

export interface BattleEndPayload {
  outcome: BattleSummary['outcome'];
  goldLost: number;
}

export interface BattleEndEvent {
  encounterId: string;
  result: BattleEndPayload;
}
