# Roadmap: Field Runtime Modernization

## Outcome

HeartGold 逆コンパイル資料から得た一般的な設計パターンを、NIHON QUEST の TypeScript/Phaser 構成へクリーンルームで再設計する。キャラクター、画像、音楽、文章、固有データは取り込まず、ライセンス不明のソースコードも逐語コピーしない。

完成時は、入力排他、マップ遷移、戦闘ライフサイクル、データ駆動イベント、フィールド復帰が、巨大な `OverworldScene` の個別分岐ではなく、テスト可能な5モジュールに分かれる。

## Approved documents

| Order | Capability                | Specification                     | Implementation plan                     |
| ----- | ------------------------- | --------------------------------- | --------------------------------------- |
| 1     | `field-flow-runtime`      | `SPEC-field-flow-runtime.md`      | `tasks/field-flow-runtime-plan.md`      |
| 2     | `map-transition-pipeline` | `SPEC-map-transition-pipeline.md` | `tasks/map-transition-pipeline-plan.md` |
| 3     | `encounter-lifecycle`     | `SPEC-encounter-lifecycle.md`     | `tasks/encounter-lifecycle-plan.md`     |
| 4     | `field-resume-snapshot`   | `SPEC-field-resume-snapshot.md`   | `tasks/field-resume-snapshot-plan.md`   |
| 5     | `event-command-runtime`   | `SPEC-event-command-runtime.md`   | `tasks/event-command-runtime-plan.md`   |

ユーザーは 2026-10-25 に、5件すべての計画作成と、その計画に沿った実装方針を一括承認した。本ドキュメント群にある `Ask first` の境界を越える変更は、この承認に含めない。

## Dependency graph

```text
field-flow-runtime
├─ map-transition-pipeline
│  ├─ field-resume-snapshot
│  └─ event-command-runtime (warp)
├─ encounter-lifecycle
│  └─ event-command-runtime (battle)
└─ event-command-runtime (exclusive execution)
```

## Delivery sequence

### Phase 0: Baseline and safety net

- 専用 worktree/branch、基点 commit、dirty state を記録する。
- Graphify code-only graph で `OverworldScene`、`BattleScene`、save/content contracts の依存を確認する。
- 現行の map transition、encounter、event、save reload を代表 E2E で固定する。
- HeartGold 参照リポジトリは挙動理解だけに使い、実装時は NIHON QUEST の型とテストから書く。

**Exit gate:** 現行挙動の golden tests が通り、移行単位が確定している。

### Phase 1: `field-flow-runtime`

- Pure runtime を test-first で実装する。
- Scene lifecycle を接続し、名所→宝箱→通常イベントの順に移す。
- 後続 module が同じ排他・abort・cleanup 契約を使える状態にする。

**Exit gate:** `FF-1`〜`FF-5` 完了。入力 lock が成功・例外・abort の全経路で解除される。

### Phase 2: `map-transition-pipeline`

- typed request、entry resolver、pipeline、Scene adapter の順に実装する。
- 既存 caller を一種類ずつ移し、600ms fallback と配置挙動を維持する。

**Exit gate:** `MT-1`〜`MT-5` 完了。production の map change が pipeline に集約される。

### Phase 3: `encounter-lifecycle`

- source/result policy と exactly-once runner を先に実装する。
- random/arena を移し、その後 boss family を移す。
- Battle/Overworld 間の pending boolean と重複結果処理を削減する。

**Exit gate:** `EN-1`〜`EN-6` 完了。全 encounter source の勝敗後に一度だけ state が反映される。

### Phase 4: `field-resume-snapshot`

- Pure snapshot と save migration を先に実装する。
- player、次に opt-in object の順に接続する。
- map transition と battle return が同じ復帰 resolver を使う。

**Exit gate:** `FS-1`〜`FS-5` 完了。旧 save、新 save、復帰経路が安全に round-trip する。

### Phase 5: `event-command-runtime`

- contracts/schema、pure runtime、legacy adapter、Scene ports の順に実装する。
- legacy content 全件を維持したまま、scripted event 1件だけで能力を実証する。
- battle/warp command は既存 lifecycle/pipeline を経由させる。

**Exit gate:** `EV-1`〜`EV-6` 完了。旧形式と新形式が同じ安全な runtime で動く。

### Phase 6: Integration and simplification

- `OverworldScene` と `BattleScene` の obsolete field、手動 lock、重複 cleanup を削除する。
- module 境界、error path、E2E、content/save migration をまとめて再検証する。
- Graphify code-only graph を更新し、新しい依存が project guide の方向に従うことを確認する。
- 統合済み branch から build し、正規プレビュー `127.0.0.1:4174` を更新する。

**Exit gate:** 全完了ゲートと手動プレビューを通し、ドキュメントを実装状態へ同期する。

## Commit strategy

各 task ID を原則1コミットとする。生成 schema の更新は契約変更と同じコミットに含める。format-only、無関係な移動、既存ユーザー変更を混ぜない。

推奨 commit 例:

```text
test: lock current field flow behavior
feat: add exclusive field flow runtime
feat: route map transitions through pipeline
feat: unify encounter lifecycle
feat: persist field resume snapshot
feat: execute typed field event commands
refactor: remove obsolete overworld flow state
```

## Cross-cutting rules

### Architecture

- `src/core/` は Phaser/Preact を import しない。
- Scene は orchestration と adapter に限定し、新しい大規模責務を直接追加しない。
- UI は callback と pure model だけを受け取る。
- 乱数は `src/core/rng.ts` 経由にし、`Math.random` を使わない。

### Compatibility

- 既存 content JSON は legacy adapter で維持する。
- 既存 save は versioned migration で維持する。
- 既存の戦闘計算、報酬値、文言、演出時間を意図せず変更しない。

### Security and content safety

- event content から `eval`、任意 import、任意関数呼び出しを許可しない。
- 参照プロジェクトの画像、音楽、キャラクター、文章、マップ、固有データを取り込まない。
- ライセンスが確認できない参照コードをコピー＆ペーストしない。

### Observability

- flow reason、transition reason、encounter source/lifecycle ID、event ID/step error を開発ログで追跡可能にする。
- ユーザーデータや問題回答内容を過剰にログしない。
- failure path は入力復帰を保証し、開発環境で原因を特定できる error を残す。

## Completion gates

各 phase は個別 test を先に通し、Phase 6 で次をすべて実行する。

```bash
pnpm lint
pnpm check:architecture
pnpm test
pnpm validate:content
pnpm build
```

さらに該当 E2E を実行する。

```bash
pnpm exec playwright test tests/e2e/overworld.spec.ts
pnpm exec playwright test tests/e2e/battle.spec.ts
pnpm exec playwright test tests/e2e/save-persistence.spec.ts
```

## Stop conditions

次の場合は、その task を止めてユーザー判断を求める。

- 仕様書の `Ask first` に該当する範囲拡大が必要。
- 既存 content または save を後方互換なしで変更する必要が判明。
- 新規 package、外部サービス、資格情報が必要。
- 戦闘計算、報酬、教材仕様、ユーザー向け文言を変更する必要が判明。
- 参照コードのライセンス確認なしでは実装できない固有処理が必要。

## Final acceptance

- 5 spec の Success criteria をすべて満たす。
- task checklist がすべて完了している。
- 巨大 Scene から対象責務が module へ移り、依存方向検査が通る。
- 既存 content、旧 save、主要 E2E が回帰しない。
- 統合 branch の正規プレビューで map移動、戦闘、イベント、再読込を確認できる。
