# Capability Map: Field Runtime Modernization

## Objective

HeartGold の逆コンパイル成果から確認できる一般的な RPG の進行設計を参考にし、NIHON QUEST のフィールド処理を小さく、復帰可能で、テスト可能な単位へ分ける。既存の遊び方とセーブデータを維持しながら、`OverworldScene` に集中している入力制御、マップ遷移、戦闘往復、イベント進行、フィールド復元の責務を段階的に移す。

## Approved assumptions

1. 5 モジュールすべてを実装対象とし、下記の安定した module id は途中で変更しない。
2. ポケモン固有の名称、文章、画像、音楽、数値、マップ、ゲームデータは利用しない。
3. 参照リポジトリに再利用許諾を示すライセンスがないため、ソースコードは逐語コピーせず、観察した責務分割と状態遷移を NIHON QUEST 向けに独自実装する。
4. 現行コンテンツとセーブデータは後方互換で読み込めるようにし、一括移行を要求しない。
5. 新しいランタイム依存パッケージは追加しない。

## Module map

| Module id                 | Responsibility                                                                                                    | Depends on                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `field-flow-runtime`      | フィールドの排他的な処理、入力ロック、通常の `await` による子処理、キャンセル、例外時の確実な復帰を一元管理する   | —                                                                      |
| `map-transition-pipeline` | フェード、遷移要求の確定、旧 Scene 終了、新マップ読込、配置復元、フェードインを段階として分離する                 | `field-flow-runtime`                                                   |
| `encounter-lifecycle`     | フィールド停止、戦闘遷移、Battle Scene 起動、結果反映、敗北時復帰、フィールド再開を一つのライフサイクルとして扱う | `field-flow-runtime`                                                   |
| `event-command-runtime`   | 会話、選択、問題、報酬、フラグ、戦闘、ワープを検証済みの型付きコマンドから実行する                                | `field-flow-runtime`, `map-transition-pipeline`, `encounter-lifecycle` |
| `field-resume-snapshot`   | 現在地、向き、および永続化対象と明示された動的マップオブジェクトの状態を保存・復元する                            | `map-transition-pipeline`                                              |

## Current implementation status

5つとも、この module id と独立した責務境界を持つ完成モジュールとしては、基点コミットにまだ存在しない。ただし必要な挙動の一部は、`OverworldScene`、`BattleScene`、`GameState.progress` に個別実装されている。本計画はそれらを捨てて作り直すのではなく、characterisation test で現行挙動を固定してから専用モジュールへ抽出する。

## Dependency graph and build order

```text
field-flow-runtime
├── map-transition-pipeline
│   ├── event-command-runtime
│   └── field-resume-snapshot
└── encounter-lifecycle
    └── event-command-runtime
```

Build order:

1. `field-flow-runtime`
2. `map-transition-pipeline`
3. `encounter-lifecycle`
4. `field-resume-snapshot`
5. `event-command-runtime`

`map-transition-pipeline` と `encounter-lifecycle` は共通契約が確定した後なら別コミットで並行実装できる。`field-resume-snapshot` は map entry 契約の確定後、`event-command-runtime` は map と encounter の両公開境界が固まった後に開始する。

## Current evidence

- 基点コミット `0e9fdbe470fcf7a8ffa8bf7354b6987239db0fd7` では `src/scenes/Overworld.ts` が 4,059 行あり、Graphify で 162 接続を持つ最大の結節点になっている。
- `busy`、`moving`、`inBattle` は Scene 内で個別に切り替えられ、会話・町・イベント・戦闘・メニューが同じ状態を共有している。
- マップ遷移は `switchMap()`、戦闘往復は `startBattle()` / `onBattleEnd()`、名所イベントは `runEvent()` に実装済みだが、独立して検証できるライフサイクル境界はない。
- `GameState.progress` は `currentArea`、`currentMap`、`position` を保存するが、向きと動的オブジェクト状態は保存しない。
- 既存の純粋なバトルエンジン、問題レンダラー契約、IndexedDB セーブの責務は維持する。

## Reference boundary

設計観察の対象は `ctrl-cheeb-del/pokeheartgold` のコミット `5e595ff9dcc9d86150c8d119cb07edd4ad4b95c3` に固定する。

| General pattern reviewed                         | Reference location            | NIHON QUEST interpretation                                 |
| ------------------------------------------------ | ----------------------------- | ---------------------------------------------------------- |
| 親処理から子処理を呼び、完了後に親へ戻る         | `src/task.c`                  | JavaScript の `await` と排他フロー境界で独自実装する       |
| フィールド停止から戦闘後復元までの明示的状態遷移 | `src/encounter.c`             | Phaser Scene の pause/resume と結果契約に合わせる          |
| ワープ演出とマップ切替の段階分離                 | `src/field_warp_tasks.c`      | ブラウザの非アクティブタブ対策を含む遷移パイプラインにする |
| データ駆動イベントと実行コンテキスト             | `src/script_manager.c`        | バイトコード VM ではなく Zod 検証済み JSON コマンドにする  |
| フィールドオブジェクトの保存・復元               | `src/save_local_field_data.c` | 安定 ID を持つ opt-in オブジェクトだけを JSON に保存する   |

## Initiative-wide boundaries

### Always

- `src/core/` の純粋ロジックは Phaser・Preact を import しない。
- 問題実行の結果は `QuestionResult.score` だけをイベント側へ渡す。
- すべての乱数は `src/core/rng.ts` を通す。
- 既存コンテンツと既存セーブを読み込む回帰テストを先に作る。
- 各モジュールを小さいコミットに分け、モジュール完了時に必須検査を実行する。

### Approved by this initiative

- `event-command-runtime` のための `src/core/content/schemas.ts` 変更と、`pnpm gen:schemas` による生成済み JSON Schema 更新。
- `field-resume-snapshot` のための `src/core/state/schema.ts` と `src/core/state/migrations.ts` の後方互換変更。

### Ask first

- 新規依存パッケージの追加。
- 問題契約 `src/questions/contracts.ts` の変更。
- 既存イベント JSON の破壊的な一括書き換え。
- セーブデータから既存フィールドを削除する変更。

### Never

- 参照リポジトリのコードや作品固有データを逐語コピーしない。
- `content/` に実行ロジックを置かない。
- `schemas/` の生成物を手編集しない。
- `Math.random`、`eval`、文字列からの任意コード実行を使わない。
- 失敗したフローの入力ロックや DOM オーバーレイを残さない。

## Initiative success criteria

- 5 モジュールが依存順に実装され、それぞれ単体テストを持つ。
- `OverworldScene` がフローの調停に専念し、各ライフサイクルの詳細を専用モジュールへ委譲する。
- 現行イベント、ランダム戦闘、ボス戦、マップ移動、セーブ再開が見た目と進行を変えずに動く。
- 少なくとも 1 件のイベントが新しいコマンド形式で動き、旧形式も引き続き動く。
- リロード後に現在マップ・位置・向き・永続化対象オブジェクトが復元される。
- `pnpm lint`、`pnpm check:architecture`、`pnpm test`、`pnpm validate:content`、`pnpm build` がすべて成功する。

## Approval

ユーザーは 2026-10-25 に、上記 5 モジュールすべての仕様書と実装計画を一括で作成することを承認した。
