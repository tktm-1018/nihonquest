# Implementation Plan: field-flow-runtime

## Goal and scope

`SPEC-field-flow-runtime.md` を実装し、`OverworldScene` に散在する排他制御と後片付けを一つの runtime へ段階移行する。見た目、文言、既存イベント順は変えない。

## Dependencies

- 先行モジュール: なし
- 後続モジュール: `map-transition-pipeline`、`encounter-lifecycle`、`event-command-runtime`
- 新規 package: なし

```text
pure runtime → Scene lifecycle adapter → representative flows → remaining flows
```

## Architecture decisions

- JavaScript の `Promise` と `AbortController` を使い、HeartGold の TaskManager は複製しない。
- 同時に実行できる field flow は一つ。二重開始は `undefined` で拒否する。
- lock、release、transient UI cleanup、error report は hooks とし、runtime は Phaser に依存しない。
- shutdown と action 完了の競合でも cleanup は一度だけ実行する。
- 移行中の `busy` は互換 accessor に寄せ、移行済みメソッドでは直接代入しない。

## Tasks

### FF-1: 現行の排他挙動を固定する

**Files:** `src/scenes/Overworld.ts`, `tests/e2e/overworld.spec.ts`

- 名所、宝箱、通常イベントで入力が止まり、完了後に戻る現行挙動を E2E に記録する。
- キーとタップの同時入力で同じイベントが二重表示されないことを確認する。

**Acceptance:** 実装前の現行コードで追加テストが通り、移行後の比較基準になる。
**Verify:** `pnpm exec playwright test tests/e2e/overworld.spec.ts`

### FF-2: Pure runtime と単体テストを追加する

**Files:** `src/scenes/overworld/fieldFlowRuntime.ts`, `tests/unit/fieldFlowRuntime.test.ts`

- `activeReason`、`isRunning`、`run()`、`cancel()` を実装する。
- resolve、reject、abort、二重開始、完了競合をテストする。

**Acceptance:** すべての終了経路で release/cleanup が各一度だけ呼ばれ、次の flow を開始できる。
**Verify:** `pnpm exec vitest run tests/unit/fieldFlowRuntime.test.ts`

### FF-3: Scene lifecycle adapter を接続する

**Files:** `src/scenes/Overworld.ts`, `src/scenes/overworld/fieldFlowRuntime.ts`, `tests/unit/fieldFlowRuntime.test.ts`

- Scene create 時に runtime を生成する。
- shutdown/destroy で `cancel()` を呼び、Scene 固有 UI cleanup と error logging を hooks に接続する。
- 入力判定を互換 `busy` accessor または `isRunning` へ接続する。

**Acceptance:** Scene restart 後に古い flow が残らず、通常入力が再開する。
**Verify:** unit test と `pnpm check:architecture`

### FF-4: 代表フローを段階移行する

**Files:** `src/scenes/Overworld.ts`, `tests/e2e/overworld.spec.ts`

- 名所、宝箱、通常 area event の順で `fieldFlow.run()` 内へ移す。
- 各移行箇所の `this.busy = true/false` と重複 `try/finally` を削除する。
- 一つのカテゴリを移すたび E2E を実行する。

**Acceptance:** 3 系統が runtime 経由になり、見た目と実行順が変わらない。
**Verify:** `pnpm exec playwright test tests/e2e/overworld.spec.ts`

### FF-5: 旧排他処理を整理して全検査する

**Files:** `src/scenes/Overworld.ts`, `src/scenes/overworld/fieldFlowRuntime.ts`, `tests/unit/fieldFlowRuntime.test.ts`, `tests/e2e/overworld.spec.ts`

- 移行済み経路に残る手動解除、孤立 timer、重複 error cleanup を除く。
- `busy` の削除は全呼び出し移行済みの場合だけ行い、未移行なら互換 accessor として残す。

**Acceptance:** `rg 'busy\s*=' src/scenes/Overworld.ts` の残存箇所が説明可能で、必須検査が通る。
**Verify:** 完了ゲート一式。

## Checkpoints

- FF-2 後: pure runtime だけでレビュー可能。
- FF-3 後: Scene lifecycle の中断安全性をレビュー。
- FF-4 後: ユーザー操作回帰をブラウザで確認。

## Risks and rollback

- **入力が永久 lock:** release を runtime の唯一の `finally` に置き、例外テストを先に作る。
- **二重 cleanup:** generation/token と完了 once guard で防ぐ。
- **巨大 diff:** イベントカテゴリごとにコミットし、失敗時はそのカテゴリだけ旧経路へ戻せるようにする。

## Definition of done

`SPEC-field-flow-runtime.md` の Success criteria を満たし、`CAPABILITY_MAP-field-runtime.md` の境界に反しない。Open question はない。
