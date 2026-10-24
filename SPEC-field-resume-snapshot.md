# Spec: field-resume-snapshot

## Objective

フィールドを離れて戻るとき、またはセーブデータを読み込むときに、マップ、プレイヤー位置、向き、保存対象として明示された動的オブジェクトの状態を安全に復元する。現在保存済みの `currentMap` と `position` を壊さず拡張し、古いセーブは自動 migration で読み込めるようにする。

この機能は進行中の会話、戦闘、フェード、イベントコマンド位置を保存しない。復帰地点のスナップショットだけを扱う。

## User-visible behavior

- 再読込後も、最後に確定したマップ、位置、向きから始まる。
- 戦闘や別マップから戻ったとき、プレイヤーは正しい出口または保存地点に配置される。
- `persistState: true` と指定した移動オブジェクトだけが、位置、向き、表示状態を復元する。
- 古いセーブデータは削除されず、従来どおりの位置と既定向きで開始できる。
- 削除・改名されたマップやオブジェクトの古い状態は無視され、ゲームを起動不能にしない。

## Tech stack

- TypeScript strict
- Zod 3 と既存 save migration
- `map-transition-pipeline`
- Vitest + Playwright
- 新規依存なし

## Commands

```bash
pnpm exec vitest run tests/unit/fieldResumeSnapshot.test.ts tests/unit/savePersistence.test.ts
pnpm exec playwright test tests/e2e/save-persistence.spec.ts tests/e2e/overworld.spec.ts
pnpm lint
pnpm check:architecture
pnpm test
pnpm validate:content
pnpm build
```

## Project structure

```text
src/core/state/schema.ts                       保存契約と schema version
src/core/state/migrations.ts                   旧セーブから新 snapshot への migration
src/core/state/newGame.ts                      新規ゲーム用の既定 snapshot
src/scenes/overworld/fieldResumeSnapshot.ts    capture、検証、復元候補の純粋処理
src/scenes/Overworld.ts                        Phaser object との adapter
tests/unit/fieldResumeSnapshot.test.ts          snapshot の純粋契約
tests/unit/savePersistence.test.ts              migration と round-trip
```

## Save contract

```ts
export const facingSchema = z.enum(['up', 'down', 'left', 'right']);

export const persistedFieldObjectSchema = z.object({
  map: z.string().min(1),
  tileX: z.number().int(),
  tileY: z.number().int(),
  facing: facingSchema,
  visible: z.boolean(),
});

export const fieldResumeSnapshotSchema = z.object({
  facing: facingSchema.default('down'),
  objects: z.record(z.string(), persistedFieldObjectSchema).default({}),
});
```

`progress.currentMap` と `progress.position` は互換性維持のため移動しない。`progress.fieldSnapshot` を追加し、player の向きと動的オブジェクトを補完する。

動的オブジェクトのキーは `${mapKey}:${objectName}` とする。保存対象は Tiled property `persistState: true` を持ち、同一マップ内で一意な `objectName` を持つものだけに限定する。通常の徘徊 NPC は、明示指定されない限り保存しない。

## Capture policy

- プレイヤー位置は一歩の移動が完了した時点でメモリ上の GameState に反映する。
- 向きは移動開始または足踏み入力で確定した時点で反映する。
- 動的オブジェクトは、戦闘開始前、マップ遷移開始前、明示的なセーブ直前に capture する。
- IndexedDB への永続書込み頻度は既存の save checkpoint に従い、向き変更ごとには書き込まない。
- フェードや衝突解決の途中座標は保存しない。

## Restore policy

復元はマップデータとオブジェクト生成後、入力再開前に行う。

```text
保存 map が存在する
  ├─ yes: 保存位置を collision-safe に補正して配置
  └─ no:  現行の既定開始 map / spawn を利用

保存 object が現行 map に存在し persistState=true
  ├─ yes: 座標、向き、visible を復元
  └─ no:  保存値を無視し、マップ定義を利用
```

プレイヤー位置が壁、範囲外、または新しいマップ定義で無効になった場合は、`map-transition-pipeline` の entry resolver と同じ collision-safe fallback を使う。別の座標解決ロジックを複製しない。

## Schema migration

schema version を現在値から 1 だけ進め、旧データには次を追加する。

```ts
fieldSnapshot: {
  facing: 'down',
  objects: {},
}
```

- 既存の `currentMap` と `position` はそのまま保持する。
- migration は冪等で、同じデータへ二度適用しても状態を失わない。
- 不正な object entry は個別に落とし、セーブ全体を破棄しない。
- 将来の version、必須進行データの破損など、既存の save failure policy は変更しない。

## Code style

```ts
const restored = resolveFieldResume({
  map,
  requestedPosition: state.progress.position,
  requestedFacing: state.progress.fieldSnapshot.facing,
  objects: state.progress.fieldSnapshot.objects,
});
```

- Pure function は Phaser object を受け取らず、serializable な値を返す。
- 座標単位は保存契約では tile、Phaser adapter 内だけ pixel に変換する。
- object の存在確認、property 確認、collision 判定を復元前に行う。
- `Math.random` で fallback 地点を選ばない。

## Testing strategy

### Unit

- map、位置、向き、object の capture/restore round-trip。
- 旧 version から `facing: down`、空 objects への migration。
- 範囲外、衝突 tile、削除 map、削除 object、`persistState` なしの安全な fallback。
- object の visible false、四方向、座標 0 を正しく保持する。
- 不正 object 1 件が他の有効な object を消さない。
- migration の冪等性と既存進行データの保持。

### Integration

- 向きを変えて保存し、再読込後に同じ向きで表示される。
- opt-in object を移動・非表示にしてマップを往復し、状態が復元される。
- opt-in でない NPC はマップ定義の初期状態から始まる。
- 古い fixture save からゲームを開始できる。
- 戦闘終了後とワープ後に操作可能な位置へ復帰する。

## Migration strategy

1. Pure snapshot contract と collision-safe resolver を追加する。
2. schema version、migration、新規ゲーム既定値を追加する。
3. player の位置と向きを capture/restore する。
4. test fixture の opt-in object で object snapshot を実証する。
5. 必要な実ゲーム object だけを個別に opt-in し、一括保存しない。

## Boundaries

### Always

- 既存セーブを migration して保持する。
- 保存対象 object は明示 opt-in と安定した objectName を必須にする。
- 復元位置を collision-safe resolver で検証する。
- 永続保存には既存 `src/core/state/save.ts` API だけを使う。

### Ask first

- schema version を複数段階進める変更。
- 全 NPC を保存対象にする変更。
- セーブ頻度や IndexedDB 保存方式の変更。
- 進行中の会話・戦闘・イベント命令位置を保存する変更。

### Never

- Phaser object、関数、Timer、Scene 参照をシリアライズしない。
- objectName のない動的 object を配列順で識別しない。
- 不正な復元地点へプレイヤーを強制配置しない。
- 古いセーブを無言で全削除しない。

## Success criteria

- 旧セーブと新セーブの両方が読み込める。
- プレイヤーの map、位置、向きが round-trip する。
- opt-in object の位置、向き、表示状態が round-trip する。
- 削除・改名・衝突変更後も安全な地点からゲームを続行できる。
- 非 opt-in object のセーブ容量と挙動は変わらない。
- 単体、migration、E2E、必須検査がすべて通る。

## Open questions

なし。進行途中のフローは保存せず、安定したフィールド復帰地点だけを保存する方針で承認済み。
