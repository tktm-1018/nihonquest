# 青森 MVP Go / No-Go 判定書

判定日: 2026-10-03

対象: `codex/quality-release-gate`

判定: **No-Go**

## 判定理由

- 青森 P0 静的素材は 19 件未配置。`imports/asset-backlog.json` の `byReleaseScope.aomori-mvp` が 0 になるまで公開不可。
- 高優先教材30件は判断記録済みだが、dated-fact 12件も visual-context 18件も学術責任者の承認前。特に visual-context 18件は参照図版との対応が確認できず、未承認を維持する。
- 本番問題44ファイルは構造検証済みだが、学術レビューは全件 `pending-human-academic-review`。承認状況は `content/quality/release-reviews.json` を正とする。
- BGM・SE・英語音声の同梱ファイルは0件。権利不明素材はないが、音素材を追加するときは `content/quality/media-rights.json` に証跡を追加してから同梱する。

## 機械検証

`pnpm check` は lint、構造、unit、content、教材・権利台帳、型、build を連続実行する。CI はこれらに Chromium E2E を加える。unit の下限は 519 件で、基準実行は 523 件成功。

性能予算は初回ロード 5,000 ms、メニュー初回表示 1,000 ms、デバッグ戦闘開始 5,000 ms とする。計測は `tests/e2e/release-quality.spec.ts` で行い、計測値なしで遅延読み込みを追加しない。

## Go への残条件

1. 青森P0 19素材を、権利証跡付きで制作・配置し、監査値を0にする。
2. 高優先30件を氏名付きレビューで再審査し、図版18件は原票まで照合する。
3. 44問題ファイルの学術レビューを完了する。
4. 全CIとE2E、性能予算を同一コミットで成功させる。

条件未達のため、公開・教材承認は行わない。

## 2026-10-03 実測結果

- `pnpm check`: 成功（unit 523、content validation error 0、型・build成功）。
- Chromium E2E: 15件中9件成功、6件失敗。戦闘3件、全件一覧1件、性能1件、タッチ幅1件が未達。
- メニュー初回表示: 4,386 ms（予算 1,000 ms）で不合格。測定結果が不合格のため、遅延読み込みは次の専用改善で候補を絞って実施する。
- 青森P0素材: 19件未配置。権利不明素材で穴埋めしていない。
