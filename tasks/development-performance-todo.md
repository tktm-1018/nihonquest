# 開発速度・起動性能の安定化

## Task 1: formatter対象とfast/fullコマンド

- [ ] `.prettierignore` に巨大fixture、maps、assetsを追加する。
- [ ] `lint`、`check:fast`、`check:full` の互換性ある入口を追加する。
- [ ] 変更前後のlint時間を記録する。

Verify: `pnpm lint`, `pnpm check:fast`

## Task 2: 運用契約

- [ ] 統合担当だけがfull gateを実行する規則を `AGENTS.md` に追加する。
- [ ] 大容量制作物と生成物の扱いを文書化する。

Verify: 文書レビュー、`pnpm exec prettier --check AGENTS.md docs/DEVELOPMENT_PERFORMANCE.md`

## Task 3: アプリ型検査

- [ ] 共通tsconfigを作る。
- [ ] app設定と増分キャッシュを追加する。

Verify: `pnpm typecheck:app`

## Task 4: テスト・ツール型検査

- [ ] tests設定を追加する。
- [ ] tools設定を追加する。
- [ ] 完全型検査コマンドを追加する。

Verify: `pnpm typecheck`

## Task 5: テスト階層

- [ ] data監査対象を明示する。
- [ ] fast / data / related scriptsを追加する。
- [ ] 完全テストが従来対象を維持する。

Verify: `pnpm test:fast`, `pnpm test:data`, `pnpm test`

## Task 6: Workspace I/O

- [ ] Vite watcher ignoreを追加する。
- [ ] 配信アセット方針は変更しない。

Verify: `pnpm typecheck:tools`, `pnpm build`

## Task 7: Graphify checkpoint

- [ ] コードonly graphを更新する。
- [ ] God nodeと変更影響を確認する。

Verify: `graphify god-nodes --top 20`

## Task 8: Boot RED contract

- [ ] content bundleを遅延させてもタイトルが表示されるE2Eを追加する。
- [ ] 実装前に失敗することを確認する。

Verify: smoke E2Eの対象ケース

## Task 9: Boot GREEN implementation

- [ ] Bootを最小データ読込へ変更する。
- [ ] ContentIndexを単一Promiseで背景読込する。
- [ ] start / continueが同じPromiseをawaitする。

Verify: smoke / startup retry E2E

## Task 10: 性能ガード

- [ ] 起動performance marksを追加する。
- [ ] 容量予算の純粋判定とCLIを追加する。
- [ ] 境界テストを追加する。

Verify: unit test、`pnpm check:performance`

## Task 11: Retry lifecycle

- [ ] タイトル起動とゲームデータ起動のエラーを別々に回帰検証する。
- [ ] 画面に内部エラー詳細を露出しない。

Verify: startup retry E2E

## Task 12: Full gate

- [ ] `pnpm lint`
- [ ] `pnpm check:architecture`
- [ ] `pnpm test`
- [ ] `pnpm validate:content`
- [ ] `pnpm build`
- [ ] `pnpm check:performance`

## Task 13: Runtime measurement

- [ ] 最新production previewを起動する。
- [ ] title ready、content ready、読込量を取得する。
- [ ] before/afterを記録する。

## Task 14: Review and handoff

- [ ] 5軸コードレビューを行う。
- [ ] Graphifyを更新する。
- [ ] Walkthroughへ変更・検証・残課題を記録する。

## Task 15: Git差分テストの自動ルーティング

- [x] ソース差分をVitestの依存グラフで関連テストへ絞る。
- [x] コンテンツ・マップ・資産差分をdata監査へ追加ルーティングする。
- [x] テスト基盤・依存関係差分は全Vitestへ安全側にフォールバックする。

Verify: ルーティングunit test、`pnpm test:changed`

## Task 16: Fast gate統合と計測

- [x] `check:fast` に自動差分テストを含める。
- [x] CIと`check:full`の完全検査を維持する。
- [x] 全件と差分の同条件実測を文書化する。

Verify: `pnpm check:fast`, `pnpm test`, `pnpm check:full`

## Task 17: PR CIのfast化

- [x] PR / main pushはlint・architecture・app型検査・affected unit・直接buildだけを実行する。
- [x] 新しいコミットで古いCIをキャンセルする。

Verify: GitHub Actions YAML構文、workflow差分レビュー

## Task 18: Full regressionの分離

- [x] 全品質ゲートと全E2Eを毎日3:00 JSTのnightlyへ移す。
- [x] 同じworkflowを手動実行できるようにする。

Verify: GitHub Actions YAML構文、fullコマンドの残存確認

## Task 19: 運用ルールの統一

- [x] AGENTS、Antigravity規則、README、architecture、性能運用を更新する。
- [x] 日常コミット・PR・nightly・リリース前の責務を一致させる。

Verify: `pnpm lint`, 文書レビュー

## Task 20: 差分E2Eルーティング

- [x] field・bag・battle・onboarding・tools・flowsへ差分を振り分ける。
- [x] E2E自身の変更は対象spec、判定不能なアプリ変更はsmokeへフォールバックする。
- [x] ドキュメントだけの変更ではE2Eを実行しない。

Verify: `pnpm exec vitest run tests/unit/testE2eChanged.test.ts`

## Task 21: PR並列実行

- [x] fast checkとaffected E2Eを別ジョブで同時に実行する。
- [x] 既存の必須ジョブ名 `check` で両方の成功を集約する。
- [x] 全E2Eをnightly・手動実行に残す。

Verify: GitHub Actions YAML構文、`pnpm check:fast`
