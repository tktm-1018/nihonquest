# Implementation Plan: event-command-runtime

## Goal and scope

`SPEC-event-command-runtime.md` を実装し、会話、選択、問題、報酬、flag、戦闘、warp、分岐を有限の型付きコマンド列から実行できるようにする。既存 `AreaEvent` JSON は変更せず legacy adapter で維持する。

## Dependencies

- 必須: `field-flow-runtime`
- battle command: `encounter-lifecycle`
- warp command: `map-transition-pipeline`
- 新規 package: なし

```text
contracts/schema → pure runtime → legacy adapter → Scene ports → scripted proof
```

## Architecture decisions

- `legacy | scripted` の Zod union を採用し、全既存 content を legacy branch で有効に保つ。
- runtime は `src/core/events/` に置き、Phaser、Preact、GameState 実装を import しない。
- 条件は局所結果と既存 flag だけを参照する構造化データに限定する。
- 最大分岐深度 8、最大実行 step 128。jump/goto/eval は作らない。
- question は `QuestionResult.score` だけを受け取り、問題タイプ別分岐を作らない。

## Tasks

### EV-1: コマンド契約と schema を追加する

**Files:** `src/core/events/contracts.ts`, `src/core/content/schemas.ts`, `tests/unit/content.test.ts`, `schemas/prefectures.schema.json`

- 8 command、condition、scripted event、局所 result 型を定義する。
- `areaEventSchema` を legacy/scripted union にし、生成 schema を更新する。
- 全既存 fixture がそのまま parse できることをテストする。

**Acceptance:** 既存 JSON は無変更で有効、新しい scripted fixture は型・schema の両方で有効。
**Verify:** `pnpm gen:schemas && pnpm exec vitest run tests/unit/content.test.ts`

### EV-2: Pure runtime と限界値を実装する

**Files:** `src/core/events/contracts.ts`, `src/core/events/runtime.ts`, `tests/unit/eventCommandRuntime.test.ts`

- command を逐次実行し、key ごとの typed local result を保持する。
- choice/score/battle/flag 条件、abort、port error、未知 key、深度・step 上限をテストする。

**Acceptance:** 全 command が exhaustive に dispatch され、不正 script は決定的な error で停止する。
**Verify:** `pnpm exec vitest run tests/unit/eventCommandRuntime.test.ts`

### EV-3: Legacy adapter を追加する

**Files:** `src/core/events/legacyAreaEvent.ts`, `src/core/events/contracts.ts`, `tests/unit/legacyAreaEvent.test.ts`

- 現行 AreaEvent を等価な dialogue→choice→question→reward→flag→afterDialogue に変換する。
- 挑戦しない経路、問題なし score 0、once flag を固定する。

**Acceptance:** legacy の実行順、文言、報酬、完了条件が現行仕様と一致する。
**Verify:** `pnpm exec vitest run tests/unit/legacyAreaEvent.test.ts`

### EV-4: Scene ports と既存 event trigger を接続する

**Files:** `src/scenes/overworld/eventRuntimePorts.ts`, `src/scenes/Overworld.ts`, `src/core/events/runtime.ts`, `tests/e2e/overworld.spec.ts`

- dialogue、choose、question、reward、setFlag ports を既存 UI/engine へ接続する。
- legacy event を field-flow-runtime 内で command runtime に渡す。
- battle/warp ports はそれぞれ lifecycle/pipeline だけを呼ぶ。

**Acceptance:** 代表 legacy event が runtime 経由で以前と同じように完了する。
**Verify:** unit + overworld E2E。

### EV-5: Content semantic validation を追加する

**Files:** `scripts/validate-content.ts`, `src/core/events/contracts.ts`, `tests/unit/contentValidation.test.ts`, `schemas/prefectures.schema.json`

- step key 重複、存在しない local key、参照切れ enemy/map/item、深度、step 数を検査する。
- JSON Schema だけでは検証できない cross-reference を validator に集約する。

**Acceptance:** 壊れた fixture が理由付きで失敗し、全 production content が通る。
**Verify:** `pnpm validate:content`

### EV-6: Scripted event を1件だけ実証する

**Files:** `content/prefectures/<target>.json`, `tests/e2e/overworld.spec.ts`, `tests/unit/content.test.ts`

- 低リスクの新規 fixture または合意済みの1イベントだけ scripted 形式にする。
- choice→question→reward と battle/warp の代表経路を E2E で確認する。
- 他の既存イベントは一括変換しない。

**Acceptance:** content の変更だけで複合イベントを構成でき、legacy event もすべて動く。
**Verify:** content validation + E2E + 完了ゲート一式。

## Checkpoints

- EV-1 後: schema 変更の影響と既存 content 全件をレビュー。
- EV-2 後: 任意コード実行不能、深度/step 上限をセキュリティレビュー。
- EV-4 後: legacy event の画面回帰を確認。
- EV-6 後: scripted authoring experience を確認してから移行範囲を増やす。

## Risks and rollback

- **既存 JSON が無効化:** union の legacy branch と全件 content test を先に作る。
- **任意コード実行:** command union と固定 handler 以外を実行しない。
- **Scene への逆依存:** ports interface を core 側に置き、adapter だけ Scene に置く。
- **一括移行事故:** proof 1件に限定し、legacy adapter を削除しない。

## Definition of done

`SPEC-event-command-runtime.md` の Success criteria を満たし、旧形式と新形式を同じ runtime で安全に実行できる。Open question はない。
