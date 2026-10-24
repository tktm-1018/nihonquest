# Spec: encounter-lifecycle

## Objective

ランダム戦闘、各種ボス戦、対戦場で別々に保持している開始理由と終了後処理を、型付き `EncounterContext` と一つのライフサイクルへ統合する。フィールド停止から Battle Scene 起動、結果の一度だけの反映、敗北時の復帰、カメラと入力の再開までを明示し、`pendingMidBoss` などの組み合わせ不正をなくす。

## User-visible behavior

- ランダム戦闘、エリアのぬし、県ボス、裏ボス、地方ボス、対戦場の結果は現在と同じになる。
- 勝利報酬と進行フラグは一度だけ反映される。
- 敗北時は最後の宿屋、未登録なら現在マップの spawn へ戻る。
- 対戦場で負けても宿屋へ戻されない。
- 戦闘後にカメラ、HUD、入力、NPC移動が確実に復帰する。

## Tech stack

- TypeScript strict
- `field-flow-runtime`
- 既存 `BattleSceneData` / `BattleEndPayload`
- Phaser Scene launch/pause/resume は ports 経由
- Vitest + Playwright
- 新規依存なし

## Commands

```bash
pnpm exec vitest run tests/unit/encounterLifecycle.test.ts
pnpm exec playwright test tests/e2e/battle.spec.ts tests/e2e/overworld.spec.ts
pnpm lint
pnpm check:architecture
pnpm test
pnpm validate:content
pnpm build
```

## Project structure

```text
src/scenes/overworld/encounterLifecycle.ts  開始、終了、重複防止、フィールド復帰
src/scenes/battle/contracts.ts              必要な場合のみ共通 payload を再利用・整理
src/scenes/Overworld.ts                     Phaser ports と進行 callback
tests/unit/encounterLifecycle.test.ts        source/outcome ごとの遷移表
tests/e2e/battle.spec.ts                     実際の戦闘往復
```

## Public contract

```ts
export type EncounterSource =
  | { type: 'random' }
  | { type: 'mid-boss' }
  | { type: 'area-boss' }
  | { type: 'last-boss' }
  | { type: 'region-boss'; regionId: string }
  | { type: 'island-boss'; islandId: string }
  | { type: 'arena'; opponentId: string };

export interface EncounterContext {
  id: string;
  battle: BattleSceneData;
  source: EncounterSource;
}

export interface EncounterLifecycle {
  readonly active: EncounterContext | null;
  start(context: EncounterContext): Promise<boolean>;
  finish(encounterId: string, result: BattleEndPayload): Promise<void>;
  cancel(): void;
}
```

`finish()` は active id と一致する最初の結果だけを受け付ける。重複イベント、古い Scene からの終了通知、active のない終了通知は状態を書き換えない。

## Code style

```ts
await this.encounters.start({
  id: this.nextEncounterId(),
  source: { type: 'region-boss', regionId },
  battle: { enemyId, level, zone: 'field', isBoss: true },
});
```

- 複数 boolean ではなく discriminated union で開始理由を表す。
- 終了後の進行更新は `source.type` ごとの小さい callback へ委譲する。
- Battle Scene は問題タイプやフィールド進行の詳細を知らない。
- encounter id は乱数でなく、Scene 内の単調カウンターで作る。

## Lifecycle

```text
idle
  → lock field
  → stop player/NPC movement
  → close transient UI
  → play encounter transition
  → launch Battle + pause Overworld
  → wait for matching BattleEndPayload
  → resume Overworld + normalize camera
  → apply result exactly once
     ├─ victory: source-specific progression
     ├─ defeat: respawn policy
     └─ arena: arena-specific completion
  → refresh HUD
  → release field
```

## Result policy

| Source        | Victory                | Defeat                   |
| ------------- | ---------------------- | ------------------------ |
| `random`      | 通常報酬のみ           | 宿屋または map spawn     |
| `mid-boss`    | 中ボス完了とワープ解放 | 宿屋または map spawn     |
| `area-boss`   | 県のしるし             | 宿屋または map spawn     |
| `last-boss`   | 裏ボス完了             | 宿屋または map spawn     |
| `region-boss` | 地域関所解放           | 宿屋または map spawn     |
| `island-boss` | 島クリア               | 宿屋または map spawn     |
| `arena`       | 対戦場勝利処理         | 対戦場終了。ワープしない |

## Testing strategy

### Unit

- source/outcome の全組み合わせが正しい policy を返す。
- active 中の二重 start を拒否する。
- encounter id の不一致と重複 finish を無視する。
- launch 前の例外と result callback の例外でも field lock を解放する。
- cancel 後に遅れて届いた BattleEndPayload を無視する。

### E2E

- ランダム戦闘に入り、勝利後に同じマップで移動できる。
- ボス勝利フラグが 1 回だけ記録される。
- 通常戦敗北で宿屋へ、対戦場敗北で元のフィールドへ戻る。
- 戦闘後にカメラ倍率と HUD が復元される。

## Migration strategy

1. 現在の `startBattle()` / `onBattleEnd()` を characterisation test で固定する。
2. `EncounterSource` と純粋な result policy を追加する。
3. `pending*` boolean を作る入口から順に context へ置換する。
4. 全入口移行後に `pendingMidBoss` 等を削除する。
5. `startBattle()` / `onBattleEnd()` は薄い adapter にしてから専用モジュールへ委譲する。

## Boundaries

### Always

- Battle engine の純粋ロジックと `QuestionResult.score` 契約を維持する。
- 報酬・進行反映は encounter id ごとに一度だけ行う。
- 敗北時の map 移動は `map-transition-pipeline` が導入済みなら同契約を使う。

### Ask first

- 戦闘結果の種類追加。
- 逃走、全滅、対戦場敗北のゲーム仕様変更。
- Battle Scene の公開 payload 破壊変更。

### Never

- `pending*` boolean を新しく増やさない。
- Battle Scene に県・島・イベント固有の進行処理を入れない。
- 同じ終了通知を二度反映しない。

## Success criteria

- 7 種の `EncounterSource` が型で表現される。
- 既存の `pending*` フラグ群が `EncounterContext` に置き換わる。
- 全 source/outcome の単体テストと代表 E2E が通る。
- 戦闘後に操作不能、二重報酬、誤った敗北ワープが発生しない。
- `OverworldScene` は source-specific callback の調停だけを行う。

## Open questions

なし。逃走など新しい戦闘結果は今回追加しない。
