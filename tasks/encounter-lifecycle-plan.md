# Implementation Plan: encounter-lifecycle

## Goal and scope

`SPEC-encounter-lifecycle.md` を実装し、ランダム戦、ボス戦、アリーナ戦の「準備→演出→戦闘→結果反映→フィールド復帰」を一つの lifecycle に統合する。敵データ、戦闘計算、報酬量は変更しない。

## Dependencies

- 必須: `field-flow-runtime`
- 推奨: `map-transition-pipeline` の entry/restore port
- 利用先: `event-command-runtime`

```text
source + result policy → pure lifecycle → Battle adapter → encounter callers
```

## Architecture decisions

- encounter source は discriminated union とし、boolean flag の組合せを廃止する。
- lifecycle instance ID で開始と終了を対応させ、結果反映を exactly once にする。
- Core lifecycle は Scene、Battle Scene、GameState 実装を ports に分離する。
- defeat、victory ごとの政策は source 別 table に集約する。
- field-flow-runtime が入力と中断を所有し、encounter は独自の `busy` を持たない。

## Tasks

### EN-1: 現行 encounter 経路を固定する

**Files:** `src/scenes/Overworld.ts`, `src/scenes/Battle.ts`, `tests/e2e/battle.spec.ts`

- random、通常 boss、arena の開始と勝敗後の復帰をテストする。
- pending flag、報酬、撃破 flag、復帰位置の現行挙動を一覧化する。

**Acceptance:** 代表 3 経路の結果政策が自動テストで観測できる。
**Verify:** `pnpm exec playwright test tests/e2e/battle.spec.ts`

### EN-2: Source と result policy を純粋化する

**Files:** `src/scenes/overworld/encounterLifecycle.ts`, `tests/unit/encounterLifecycle.test.ts`

- `EncounterSource`、`EncounterContext`、`EncounterResult` を定義する。
- source ごとの victory/defeat policy を表として実装する。

**Acceptance:** 全 source variant が exhaustive で、各結果の state update intent がテストされる。
**Verify:** `pnpm exec vitest run tests/unit/encounterLifecycle.test.ts`

### EN-3: Lifecycle runner と exactly-once 保証を追加する

**Files:** `src/scenes/overworld/encounterLifecycle.ts`, `tests/unit/encounterLifecycle.test.ts`

- pause NPC、transition、start battle、receive result、apply、restore、resume を ports で実行する。
- 重複 result、late result、abort、Battle 起動失敗をテストする。

**Acceptance:** 同一 lifecycle ID の結果は一度だけ反映され、全終了経路で field が復帰可能。
**Verify:** unit test。

### EN-4: Battle Scene adapter を接続する

**Files:** `src/scenes/Overworld.ts`, `src/scenes/Battle.ts`, `src/scenes/overworld/encounterLifecycle.ts`, `tests/e2e/battle.spec.ts`

- Battle 起動 data に lifecycle ID と source を渡す。
- Battle 終了時は typed result を一度返し、Overworld 側 runner が結果を処理する。
- random と arena を最初に移行する。

**Acceptance:** random/arena が lifecycle 経由で開始・終了し、重複報酬がない。
**Verify:** unit + battle E2E。

### EN-5: Boss 系統を移行し pending flags を削減する

**Files:** `src/scenes/Overworld.ts`, `src/scenes/Battle.ts`, `src/scenes/overworld/encounterLifecycle.ts`, `tests/e2e/battle.spec.ts`

- mid、area、last、region、island boss を source variant へ移す。
- lifecycle に置換された `pending*` field と分岐を削除する。
- defeat の復帰と retry 可否を fixture で確認する。

**Acceptance:** 全 encounter entry point が typed source を作り、Battle 終了処理の巨大条件分岐が policy table に置換される。
**Verify:** `rg 'pending.*Boss|pendingEncounter' src/scenes` をレビュー後、E2E。

### EN-6: 復帰競合と全検査を仕上げる

**Files:** `src/scenes/Overworld.ts`, `src/scenes/Battle.ts`, `tests/unit/encounterLifecycle.test.ts`, `tests/e2e/battle.spec.ts`

- Scene restart、ブラウザ非表示、duplicate callback の回帰を追加する。
- map-transition-pipeline の復帰 port と統合する。

**Acceptance:** 各 source の勝敗後に操作可能で、報酬/flag/HP 反映が一度だけ、必須検査が通る。
**Verify:** 完了ゲート一式。

## Checkpoints

- EN-2 後: result policy matrix をゲーム仕様と照合。
- EN-3 後: exactly-once と abort を重点レビュー。
- EN-4/EN-5 後: 各 encounter category をブラウザ確認。

## Risks and rollback

- **報酬や flag の二重反映:** lifecycle ID と consumed result set で防ぐ。
- **source policy の取り違え:** 現行 branch を EN-1 テストへ先に写し、variant ごとに移行する。
- **Battle/Overworld 両方が state 更新:** state mutation owner を lifecycle adapter に一本化する。
- **巨大 migration:** random/arena、boss family の二段階に分ける。

## Definition of done

`SPEC-encounter-lifecycle.md` の Success criteria を満たし、全 encounter が typed lifecycle を通る。Open question はない。
