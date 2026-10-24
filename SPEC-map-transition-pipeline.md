# Spec: map-transition-pipeline

## Objective

現在 `OverworldScene.switchMap()` と Scene の初期化にまたがるマップ移動を、遷移要求、フェード完了待ち、Scene restart、入口解決、配置、フェードインの明示的な段階へ分ける。非アクティブタブでも停止せず、同じ遷移が二重実行されず、失敗時に黒画面や入力ロックを残さないことを保証する。

## User-visible behavior

- 建物、洞窟、船、ワープホール、にほんちずからの移動は現在と同じ入口へ到着する。
- フェードアウト中の連打で二重移動しない。
- タブを背面に置いても、復帰時に黒画面のまま止まらない。
- 不正な入口名や座標は安全な既定 spawn へフォールバックする。

## Tech stack

- TypeScript strict
- Phaser 3 の Scene restart と camera fade は adapter 経由
- `field-flow-runtime`
- Vitest + Playwright
- 新規依存なし

## Commands

```bash
pnpm exec vitest run tests/unit/mapTransitionPipeline.test.ts
pnpm exec playwright test tests/e2e/overworld.spec.ts
pnpm lint
pnpm check:architecture
pnpm test
pnpm validate:content
pnpm build
```

## Project structure

```text
src/scenes/overworld/mapTransitionPipeline.ts  遷移要求、once 実行、timeout、段階管理
src/scenes/overworld/mapEntry.ts               spawn/明示座標/保存位置の純粋な入口解決
src/scenes/Overworld.ts                        Phaser adapter と委譲
tests/unit/mapTransitionPipeline.test.ts       段階、競合、fallback の単体テスト
tests/e2e/overworld.spec.ts                    実マップ往復と背景タブ相当の回帰
```

## Public contract

```ts
export interface MapTransitionRequest {
  targetMap: string;
  spawnName?: string;
  tile?: readonly [number, number];
  exactSpawn?: boolean;
  reason: 'door' | 'warp' | 'world-map' | 'defeat' | 'script';
}

export interface MapTransitionPorts {
  closeTransientUi(): void;
  fadeOut(signal: AbortSignal): Promise<void>;
  restart(request: MapTransitionRequest): void;
}

export function runMapTransition(
  request: MapTransitionRequest,
  ports: MapTransitionPorts,
  signal: AbortSignal,
): Promise<void>;
```

入口解決は Phaser object を直接返さず、`{ x, y, facing, source }` のプレーン値を返す。`restart()` は一度だけ呼ばれ、フェードイベントと 600ms fallback の競合を once guard で吸収する。

## Code style

```ts
await this.fieldFlow.run('map-transition', ({ signal }) =>
  runMapTransition({ targetMap, spawnName, tile, exactSpawn, reason }, this.mapTransitionPorts(), signal),
);
```

- 遷移理由を discriminated union で保持する。
- 入口の優先順位は関数 1 つに集約する。
- Phaser event と browser timer のどちらが先でも副作用は一度だけにする。

## Entry resolution order

1. `exactSpawn` が true で明示 tile が有効なら、その tile。
2. 有効な `spawnName` の Tiled object。
3. 同じ map を再開する保存 snapshot の位置。
4. マップの標準 `spawn` object。
5. 最終 fallback として衝突しない最初の歩行可能 tile。

無効座標や衝突 tile をそのまま採用しない。

## Testing strategy

### Unit

- fade 完了と timeout が競合しても restart は 1 回。
- abort 済み signal では restart しない。
- exact tile、named spawn、saved position、default spawn の優先順位。
- 不正 map/spawn 入力の安全な fallback。
- 遷移要求オブジェクトを呼び出し後に変更しても結果が変わらない。

### E2E

- フィールド→町→フィールドを往復し、正しい入口へ戻る。
- にほんちず移動後に入力できる。
- 遷移中の連打で Scene が二重起動しない。
- フェードイベントが発火しない条件を模擬しても 600ms guard で進む。

## Migration strategy

1. 現在の `switchMap()` を characterisation test で固定する。
2. `MapTransitionRequest` と入口解決関数を追加する。
3. `switchMap()` の内部だけを pipeline 委譲に替える。
4. 呼び出し元を `reason` 付き要求へ順次変更する。
5. 全呼び出し移行後に古い引数形式を削除する。

## Boundaries

### Always

- マップの唯一の編集元は `maps/` のままとする。
- Scene restart 前に一時 DOM を閉じる。
- 遷移の副作用を once guard で保護する。
- ブラウザが非アクティブでも進む fallback を維持する。

### Ask first

- マップファイル形式や Tiled property 契約の変更。
- 新しい遷移演出やユーザー向け文言の追加。
- Scene restart を廃止して単一 Scene 内ロードへ切り替える変更。

### Never

- `public/maps/` を復活させない。
- `window.setTimeout` だけを成功判定にしない。
- 入力ロック解除前に不完全なマップを操作可能にしない。

## Success criteria

- 既存のすべての `switchMap()` 呼び出しが型付き要求を経由する。
- restart、入口解決、フェード fallback の単体テストが通る。
- 町・ダンジョン・船・にほんちず・敗北復帰が E2E で通る。
- 黒画面と二重遷移の回帰テストがある。
- `OverworldScene` から遷移の once/timeout 詳細がなくなる。

## Open questions

なし。Scene restart 方式は維持し、内部ロード方式への大改修は対象外とする。
