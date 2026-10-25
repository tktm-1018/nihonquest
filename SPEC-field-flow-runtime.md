# Spec: field-flow-runtime

## Objective

`OverworldScene` 内で個別に管理されている `busy`、入力停止、Scene 終了時の中断、後片付けを、1 つの排他的フロー実行境界へ集約する。プレイヤーが同時に二つのイベントを始められず、成功・早期終了・例外・Scene shutdown のすべてで入力と一時 UI が確実に復帰する状態を作る。

このモジュールは新しいゲーム内容を追加しない。既存の会話やイベントを少しずつ移せる基盤を提供する。

## User-visible behavior

- 会話、メニュー、宝箱、名所、戦闘準備中は、現在と同じく移動や二重操作が抑止される。
- 処理が途中で失敗しても、画面を再読み込みせず再び操作できる。
- 連打やタップとキーの同時入力で同じイベントが二重起動しない。
- 通常の見た目、文言、タイミングは変更しない。

## Tech stack

- TypeScript strict
- 既存の `Promise` / `AbortController`
- Vitest
- Phaser は adapter callback からのみ利用し、ランタイム本体は Phaser を import しない
- 新規依存なし

## Commands

```bash
pnpm exec vitest run tests/unit/fieldFlowRuntime.test.ts
pnpm lint
pnpm check:architecture
pnpm test
pnpm validate:content
pnpm build
```

## Project structure

```text
src/scenes/overworld/fieldFlowRuntime.ts   排他実行、状態照会、キャンセル、finally 復帰
src/scenes/Overworld.ts                    Scene 固有 hook と段階的な呼び出し移行
tests/unit/fieldFlowRuntime.test.ts        成功、拒否、例外、中断、再実行の契約
```

## Public contract

```ts
export interface FieldFlowHooks {
  lockInput(reason: string): void;
  releaseInput(reason: string): void;
  cleanupTransientUi(): void;
  reportError(error: unknown, reason: string): void;
}

export interface FieldFlowContext {
  readonly signal: AbortSignal;
  throwIfCancelled(): void;
}

export interface FieldFlowRuntime {
  readonly activeReason: string | null;
  readonly isRunning: boolean;
  run<T>(reason: string, action: (context: FieldFlowContext) => Promise<T>): Promise<T | undefined>;
  cancel(reason?: unknown): void;
}
```

`run()` はすでに別フローが動いている場合、新しい処理を開始せず `undefined` を返す。通常の子処理は JavaScript の `await` で構成し、HeartGold のタスクスタックを再実装しない。

## Code style

```ts
await this.fieldFlow.run('landmark', async ({ signal }) => {
  signal.throwIfAborted();
  this.standStill();
  await this.visitLandmarkContent(area, motif, sign);
});
```

- フロー名はログとテストで読める kebab-case または短い英単語にする。
- `try/finally` はランタイム内部に一度だけ置き、呼び出し側で `busy = false` を繰り返さない。
- 想定内のキャンセルと実行エラーを区別する。
- エラーを握りつぶさず hook へ渡し、入力だけは必ず復帰させる。

## State model

```text
idle
  └─ run(reason) → running
                    ├─ resolve → cleanup → idle
                    ├─ reject  → report → cleanup → idle
                    └─ cancel  → cleanup → idle

running ── run(other) → rejected without starting
```

状態はメモリ内だけに持ち、GameState やセーブデータへ保存しない。ページ更新後に途中の UI フローを再開する機能は対象外とする。

## Migration strategy

1. ランタイム単体を追加し、既存動作を変えずテストする。
2. Scene shutdown で `cancel()` を呼ぶ adapter を追加する。
3. 最初の移行対象を `visitLandmark()` とし、`busy` の手動切替を削除する。
4. 宝箱・通常イベント・町メニューへ小さいコミット単位で広げる。
5. `busy` は移行中だけ互換 getter として残し、全呼び出し移行後に削除判断する。

## Testing strategy

### Unit

- 成功時に lock/release が各 1 回呼ばれる。
- action が throw しても release と cleanup が呼ばれ、次の `run()` が開始できる。
- 実行中の二重 `run()` が action を開始しない。
- `cancel()` 後に signal が abort され、release が 1 回だけ呼ばれる。
- shutdown と action 完了が競合しても二重 cleanup しない。

### Integration

- 名所をキーとタップで同時操作してもカットインが一度だけ表示される。
- 名所 UI を閉じた後に移動が再開する。
- Scene restart 中に古いフローが残らない。

## Boundaries

### Always

- ランタイム本体は Phaser、Preact、GameState を import しない。
- フロー終了時の release/cleanup を `finally` で保証する。
- 既存の入力抑止条件を減らす前に同等の回帰テストを書く。

### Ask first

- 複数の独立フローを同時実行できるようにする変更。
- エラーをユーザー向けダイアログに表示する新仕様。
- `OverworldScene` 以外の Scene へ適用範囲を広げる変更。

### Never

- フロー途中状態をセーブデータへ保存しない。
- `setTimeout` だけで入力ロックを解除しない。
- action 内の例外を無言で捨てない。

## Success criteria

- 排他、成功、例外、キャンセル、shutdown の単体テストが通る。
- 少なくとも名所、宝箱、通常イベントの 3 系統がランタイム経由になる。
- 移行済みメソッドには手動の `this.busy = true/false` が残らない。
- エラー後も次のフィールド操作を開始できる。
- 既存の E2E と必須検査がすべて通る。

## Open questions

なし。並行フローは許可せず、途中再開は対象外とする方針で承認済み。
