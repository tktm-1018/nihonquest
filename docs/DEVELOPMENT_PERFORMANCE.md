# 開発速度・起動性能の運用

## 目的

ファイル数とコンテンツ量が増えても、各作業チャットが毎回リポジトリ全体を走査して開発端末を飽和させないための運用を定める。品質検査を削るのではなく、作業中と統合時で実行タイミングを分ける。

## コマンドの使い分け

| 場面 | コマンド | 責務 |
| --- | --- | --- |
| 通常の実装中 | `pnpm check:fast` | lint、architecture、アプリ型検査、未コミット差分のVitest |
| 未コミット差分の回帰 | `pnpm test:changed` | Git差分から関連Vitestと必要なdata監査を自動選択 |
| ブランチ差分の回帰 | `pnpm test:changed <base-ref>` | 基点以降のコミットと現在の差分を自動選択 |
| 明示したソースの回帰 | `pnpm test:related <files...>` | 指定ソースに依存するVitest |
| 通常の広い回帰 | `pnpm test:fast` | 大容量データ監査以外のunit tests |
| コンテンツ・マップ変更 | `pnpm test:data` | 全件データ・描画資産監査 |
| PR / main push | GitHub Actions `check` | fast checkとaffected E2Eを並列実行して結果を集約 |
| nightly・リリース前 | `pnpm check:full` + `pnpm test:e2e:full` | 全品質ゲート、容量予算、全ブラウザ回帰 |
| `main` デプロイ | GitHub Actions `deploy-pages` | PRをブロックせず完全品質ゲートを再実行して公開 |

複数チャットが動く場合、作業チャットと統合担当はfast gateを使い、同じ端末で複数のfull gateを実行しない。完全ゲートはnightlyまたはリリース前の手動実行に集約する。

`test:changed` は通常のソースをVitestの依存グラフで絞る。`content/`（i18nを除く）、`maps/`、`assets/`、`public/`、`schemas/`、`scripts/data/`、`tests/fixtures/` の変更ではdata監査も実行し、package・lockfile・Vitest設定の変更では全Vitestへフォールバックする。PRではbase SHAを渡してコミット済み差分も対象にする。nightlyと `check:full` は従来どおり全件を実行する。

PRのfast CIは新しいコミットが来たら古い実行をキャンセルする。affected E2Eはfield・bag・battle・onboarding・tools・flowsの既存spec群から差分に関係するものだけをfast checkと並列実行し、無関係な変更では起動しない。全E2Eは毎日3:00 JSTのnightlyと手動実行で検出する。

2026-10-30の同一作業ツリー計測では、全Vitestは14.26秒（131 files / 1,394 tests）、同じ差分に対するVitest標準の変更影響テストは2.98秒（2 files / 6 tests）だった。

## TypeScript

- `typecheck:app`: 配信する `src/`。日常作業の既定。
- `typecheck:tests`: unit / E2Eとテスト設定。
- `typecheck:tools`: scriptsとビルド設定。
- `typecheck`: 上記すべて。統合時に使用。

各設定は `.cache/typescript/` の増分情報を再利用する。このキャッシュはGit管理しない。

## 大容量ファイル

- `assets/cinematics/`: 制作映像の原本。ゲーム配信物ではない。
- `graphify-out/`: ローカル依存グラフ生成物。
- `.worktrees/`: 他チャットの独立checkout。現在のcheckoutから走査しない。
- `dist/`: 本番ビルド生成物。
- `tests/fixtures/`: 専用テストで読む大容量fixture。

これらは通常のPrettierとVite watcherから除外する。制作映像の原本をさらに増やす場合は、将来的にゲームリポジトリと同階層の専用メディア保管先へ移し、`assets/` には配信用に最適化した完成素材だけを置く。実移動は素材所有者と移行先を確認してから行う。

## 起動性能

タイトル画面は全ゲームコンテンツの読込を待たない。全 ContentIndex はタイトル表示後に背景読込し、開始・続行時に同じPromiseをawaitする。Zod検証と参照整合性は省略しない。

Performance APIのマーク:

- `nq:boot-start`
- `nq:title-ready`
- `nq:content-ready`
- `nq:gameplay-ready`

配信容量は `pnpm check:performance` で検査する。予算を上げる場合は、増加理由と実測への影響を計画書へ記録する。
