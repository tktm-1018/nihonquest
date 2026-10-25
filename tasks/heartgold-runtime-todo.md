# Checklist: Field Runtime Modernization

この checklist は `tasks/heartgold-runtime-roadmap.md` と5件の個別 plan の実行状況を追跡する。task の詳細、files、acceptance、verification は各個別 plan を正とする。

## Phase 0: Baseline

- [ ] 専用 worktree、`codex/` branch、基点 commit、既存変更を記録する。
- [ ] Graphify code-only graph を生成し、対象依存を確認する。
- [ ] 現行 map transition、encounter、event、save reload の golden tests を追加する。
- [ ] 参照リポジトリの commit と clean-room 境界を実装メモに固定する。

## Phase 1: field-flow-runtime

- [ ] FF-1 現行の排他挙動を固定する。
- [ ] FF-2 Pure runtime と単体テストを追加する。
- [ ] FF-3 Scene lifecycle adapter を接続する。
- [ ] FF-4 名所、宝箱、通常イベントを段階移行する。
- [ ] FF-5 旧排他処理を整理し、phase gate を通す。

## Phase 2: map-transition-pipeline

- [ ] MT-1 現行 `switchMap()` の契約を固定する。
- [ ] MT-2 Request と entry resolver を追加する。
- [ ] MT-3 Transition pipeline と once guard を追加する。
- [ ] MT-4 `switchMap()` を adapter 化する。
- [ ] MT-5 全 caller を typed request へ移行し、phase gate を通す。

## Phase 3: encounter-lifecycle

- [ ] EN-1 現行 encounter 経路と結果政策を固定する。
- [ ] EN-2 Source と result policy を純粋化する。
- [ ] EN-3 Lifecycle runner と exactly-once 保証を追加する。
- [ ] EN-4 random/arena を Battle adapter へ移行する。
- [ ] EN-5 boss 系統を移行し pending flags を削減する。
- [ ] EN-6 復帰競合を検証し、phase gate を通す。

## Phase 4: field-resume-snapshot

- [ ] FS-1 Pure snapshot 契約と resolver を追加する。
- [ ] FS-2 Save schema と migration を追加する。
- [ ] FS-3 Player の位置と向きを接続する。
- [ ] FS-4 Opt-in object の capture/restore を追加する。
- [ ] FS-5 全復帰経路を統合し、phase gate を通す。

## Phase 5: event-command-runtime

- [ ] EV-1 コマンド契約と schema を追加する。
- [ ] EV-2 Pure runtime と限界値を実装する。
- [ ] EV-3 Legacy adapter を追加する。
- [ ] EV-4 Scene ports と既存 event trigger を接続する。
- [ ] EV-5 Content semantic validation を追加する。
- [ ] EV-6 Scripted event 1件を実証し、phase gate を通す。

## Phase 6: Integration

- [ ] Obsolete な manual lock、pending flag、重複 cleanup を削除する。
- [ ] Graphify code-only graph を更新し、依存方向をレビューする。
- [ ] `pnpm lint` を通す。
- [ ] `pnpm check:architecture` を通す。
- [ ] `pnpm test` を通す。
- [ ] `pnpm validate:content` を通す。
- [ ] `pnpm build` を通す。
- [ ] overworld、battle、save persistence E2E を通す。
- [ ] 統合済み branch から `127.0.0.1:4174` の正規プレビューを更新する。
- [ ] 5 spec と roadmap を実装状態に同期する。

## Handoff record

- Branch: 未着手時に記入
- Base commit: 未着手時に記入
- Final commit(s): 完了時に記入
- Verification: 完了時にコマンドと結果を記入
- Remaining risks: 完了時に記入
