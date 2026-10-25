# Spec: event-command-runtime

## Objective

会話、選択、問題、報酬、フラグ、戦闘、ワープを、Zod で検証される型付きコマンド列から実行できるイベントランタイムを作る。Scene にイベント固有の手順を増やさず、コンテンツ担当が `content/prefectures/*.json` の範囲で複数段階のイベントを構成できるようにする。

既存 `AreaEvent` 形式は後方互換で読み込み、新形式への一括移行を要求しない。

## User-visible behavior

- 現在の「名所発見→会話→挑戦確認→問題→報酬→完了会話」は変わらない。
- 新形式では、会話後に戦闘する、選択で分岐する、完了後にワープする等のイベントをデータだけで構成できる。
- 問題が見つからない場合も既存仕様どおり score 0 の報酬を受け取り、進行が止まらない。
- 無効なイベントはロード時に検出され、実行途中で任意コードを走らせない。

## Tech stack

- TypeScript strict
- Zod 3
- `field-flow-runtime`
- `map-transition-pipeline`
- `encounter-lifecycle`
- 既存 Question engine と `QuestionResult.score`
- Vitest + content validation + Playwright
- 新規依存なし

## Commands

```bash
pnpm gen:schemas
pnpm validate:content
pnpm exec vitest run tests/unit/eventCommandRuntime.test.ts tests/unit/content.test.ts
pnpm exec playwright test tests/e2e/overworld.spec.ts
pnpm lint
pnpm check:architecture
pnpm test
pnpm build
```

## Project structure

```text
src/core/events/contracts.ts              コマンド、条件、実行結果、ports の純粋契約
src/core/events/runtime.ts                検証済みコマンドの逐次実行と局所変数
src/core/events/legacyAreaEvent.ts         現行 AreaEvent を新コマンドへ変換
src/core/content/schemas.ts                legacy/scripted event の Zod union
src/scenes/overworld/eventRuntimePorts.ts  会話、問題、戦闘、ワープの Scene adapter
src/scenes/Overworld.ts                    trigger と runtime 呼び出しの調停
tests/unit/eventCommandRuntime.test.ts      コマンド、分岐、上限、失敗の単体テスト
```

生成物 `schemas/prefectures.schema.json` は `pnpm gen:schemas` で更新し、直接編集しない。

## Event schema

```ts
export type FieldEventCommand =
  | { type: 'dialogue'; lines: DialogueLine[] }
  | { type: 'choice'; key: string; lines: DialogueLine[]; choices: RubyText[] }
  | { type: 'question'; key: string; request: QuestionRequest }
  | { type: 'reward'; scoreKey: string; table: RewardByScore[] }
  | { type: 'set-flag'; flag: string }
  | { type: 'battle'; key: string; enemyId: string; level?: number; isBoss?: boolean }
  | { type: 'warp'; map: string; spawn?: string }
  | { type: 'branch'; condition: EventCondition; then: FieldEventCommand[]; else?: FieldEventCommand[] };

export interface ScriptedAreaEvent {
  id: string;
  motifId: string;
  trigger: { map: string; objectName: string };
  once: boolean;
  steps: FieldEventCommand[];
}
```

`EventCondition` は runtime の局所結果と既存の進行フラグだけを参照する。任意式、JavaScript、文字列評価は許可しない。

## Runtime ports

```ts
export interface EventRuntimePorts {
  dialogue(lines: readonly DialogueLine[]): Promise<void>;
  choose(lines: readonly DialogueLine[], choices: readonly RubyText[]): Promise<number>;
  question(request: QuestionRequest): Promise<number>;
  reward(table: readonly RewardByScore[], score: number): Promise<void>;
  setFlag(flag: string): void;
  battle(command: BattleCommand): Promise<'victory' | 'defeat'>;
  warp(command: WarpCommand): Promise<void>;
}
```

Core runtime は Phaser、DOM、GameState の実装を import しない。GameState 更新は明示的 ports から行う。

## Code style

```ts
for (const command of commands) {
  context.signal.throwIfAborted();
  await handlers[command.type](command, context);
  context.executedSteps += 1;
  assertWithinStepLimit(context);
}
```

- `switch` または handler registry はイベントコマンド型だけを扱う。問題タイプでは分岐しない。
- すべてのコマンドは exhaustive check される。
- 分岐の最大深度は 8、実行ステップ上限は 128 とする。
- key はイベント内で一意にし、score/choice/battle outcome の型を混同しない。

## Legacy compatibility

現行 `AreaEvent` はロード後に次の等価コマンド列へ変換する。

```text
discover/cutin（Scene 既存処理）
→ dialogue
→ choice「ちょうせんする？」
→ branch yes:
     question(score)
     reward(score)
     set-flag(event id)
     afterDialogue
   else:
     laterDialogue
```

元 JSON は書き換えずに動く。最初の scripted event は新規の検証用 fixture または 1 件の低リスクイベントとして追加する。

## Schema change rationale and impact

### Reason

現在の `areaEventSchema` は一回の問題と報酬に固定されており、会話・戦闘・ワープを組み合わせるたび Scene に専用メソッドが増える。`legacy | scripted` union にすることで、既存データを維持しながら段階的にデータ駆動へ移行できる。

### Impact

- `src/core/content/schemas.ts` を変更する。
- `pnpm gen:schemas` で `schemas/prefectures.schema.json` が更新される。
- `scripts/validate-content.ts` が step key、参照 ID、深度、step 数を検査する。
- `src/questions/contracts.ts` は変更しない。
- 現行 JSON は legacy branch でそのまま妥当となる。

## Testing strategy

### Unit

- 各コマンドが正しい port を順番に 1 回呼ぶ。
- choice、score、battle outcome、flag の分岐。
- score 0 でも reward port が呼ばれる。
- abort、port error、未知 key、不正型、深度超過、step 超過。
- legacy event 変換結果が現在の実行順と一致する。
- 問題 port からは score 以外を参照できない契約。

### Content validation

- 全既存県 JSON が変更なしで通る。
- 壊れた command、参照切れ monster/map/item、重複 key が失敗する。
- 生成 schema が最新である。

### E2E

- legacy event を一つ完了できる。
- scripted event の選択→問題→報酬→完了フラグが動く。
- scripted battle/warp の代表経路が一度だけ実行される。

## Migration strategy

1. command contracts と pure runtime を追加する。
2. legacy adapter で既存イベントを新 runtime 経由にする。
3. Zod union と content validation を追加し、既存 JSON 全件を通す。
4. 一つの低リスクイベントだけ scripted 形式で実証する。
5. 他イベントは別タスクで必要時に移行し、一括変換しない。

## Boundaries

### Always

- 全ユーザー向け文言は RubyText として content に置く。
- JSON は Zod 検証後だけ実行する。
- 問題の戻り値は score のみ利用する。
- reward と flag 更新は既存の純粋 progression 関数を利用する。
- 旧イベント形式を維持する。

### Ask first

- 新しい command type の追加。
- `src/questions/contracts.ts` の変更。
- 全イベント JSON の一括移行。
- 条件式の能力を既存 flag/局所結果以外へ拡大する変更。

### Never

- `eval`、`Function`、文字列コード、任意 import を実行しない。
- content から直接 Scene や保存実装を呼ばない。
- 問題タイプ名で分岐しない。
- 無限ループ可能な jump/goto コマンドを追加しない。

## Success criteria

- 8 種のコマンドと条件分岐が型付きで実行できる。
- 全既存イベント JSON が無変更で動く。
- 新形式イベント 1 件が content だけで会話・問題・報酬を完了する。
- battle と warp の command が対応 lifecycle を経由する。
- 不正イベントはロード時に失敗し、ランタイムで任意コードを実行しない。
- schema生成、content検証、単体、E2E、必須検査が通る。

## Open questions

なし。無制限のスクリプト言語にはせず、有限コマンド列と構造化分岐だけを提供する。
