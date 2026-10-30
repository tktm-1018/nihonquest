# Spec: fast-quality-loop

## Objective

日常作業では変更範囲に比例する高速な検査を使い、統合時には従来同等以上の完全検査を一度だけ実行できるようにする。整形ツールが巨大なテストfixture、マップ、画像・映像ディレクトリを毎回走査しないことを成功条件とする。

## Commands

- Fast gate: `pnpm check:fast`
- Changed tests: `pnpm test:changed [base-ref]`
- Full gate: `pnpm check:full && pnpm test:e2e:full`（nightly・リリース前）
- Formatting: `pnpm lint`
- Architecture: `pnpm check:architecture`

## Project Structure

- `package.json`: 公開する検査コマンド
- `.prettierignore`: 意味検査・専用検査へ委譲する大容量データ
- `AGENTS.md`: 並行チャットの検査所有権

## Code Style

既存の pnpm スクリプト命名を保ち、`fast` と `full` を明示する。既存の `lint`、`test`、`check` は互換性を維持する。

## Testing Strategy

変更前後で同一マシン上の全Vitestと差分Vitestを計測する。ソース差分はVitestの依存グラフ、コンテンツ・マップ・資産差分はdata監査、テスト基盤差分は全件へ安全側にルーティングし、完全ゲートで検査対象が失われていないことを確認する。

## Boundaries

- Always: コンテンツの意味検査は `validate:content` に残し、nightly・デプロイ・リリース前のいずれかで必ず実行する。
- Ask first: なし（本計画は一括承認済み）。
- Never: 失敗する検査を無効化して高速化しない。

## Success Criteria

- Prettier が `tests/fixtures`、`assets`、`maps` を通常走査しない。
- `check:fast` と `check:full` の責務が明文化される。
- `check:fast` が未コミット差分の関連テストを自動実行する。
- コンテンツ・マップ・資産差分は `test:data`、テスト基盤差分は全Vitestへ自動フォールバックする。
- PRの必須CIはaffected unitまでにし、全件・全E2Eはnightlyと手動実行へ分離する。
- 新しいPRコミットは古いCI実行をキャンセルする。
- 並行チャットで完全検査を同時実行しない規則がある。

## Open Questions

なし。
