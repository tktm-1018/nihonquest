# Implementation Plan: field-resume-snapshot

## Goal and scope

`SPEC-field-resume-snapshot.md` を実装し、プレイヤーの map、位置、向きと、明示 opt-in した動的 object の位置・向き・表示状態を保存・復元する。進行中の UI や戦闘自体は保存しない。

## Dependencies

- 必須: `map-transition-pipeline` の collision-safe entry resolver
- 既存: `src/core/state/save.ts` と save migration
- 新規 package: なし

```text
snapshot contract → save migration → player adapter → opt-in object adapter
```

## Architecture decisions

- `progress.currentMap` と `progress.position` は移動せず、`progress.fieldSnapshot` を補助情報として追加する。
- schema version は一段だけ進め、旧 save へ `facing: down` と空 objects を追加する。
- object key は `${mapKey}:${objectName}`。`persistState: true` と一意な objectName を必須にする。
- 保存座標は tile 単位。pixel 変換は Phaser adapter 内だけで行う。
- GameState のメモリ更新と IndexedDB 永続書込みを分け、向き変更ごとの disk write はしない。

## Tasks

### FS-1: Pure snapshot 契約と resolver を追加する

**Files:** `src/scenes/overworld/fieldResumeSnapshot.ts`, `tests/unit/fieldResumeSnapshot.test.ts`

- facing、persisted object、capture input、restore result 型を定義する。
- map/object filter と collision-safe resolver 連携を実装する。
- 削除 map/object、衝突、範囲外、非 opt-in をテストする。

**Acceptance:** 有効値は round-trip し、無効値は決定的かつ安全に無視・補正される。
**Verify:** `pnpm exec vitest run tests/unit/fieldResumeSnapshot.test.ts`

### FS-2: Save schema と migration を追加する

**Files:** `src/core/state/schema.ts`, `src/core/state/migrations.ts`, `src/core/state/newGame.ts`, `tests/unit/savePersistence.test.ts`

- `progress.fieldSnapshot` と version migration を追加する。
- 旧 fixture、新規 game、save/load round-trip、冪等性をテストする。
- 不正 object entry は局所的に落とし、他の進行データを保持する。

**Acceptance:** 旧 save を削除せず読め、新 save を再保存して同じ状態を得る。
**Verify:** `pnpm exec vitest run tests/unit/savePersistence.test.ts`

### FS-3: Player の位置と向きを接続する

**Files:** `src/scenes/Overworld.ts`, `src/scenes/overworld/fieldResumeSnapshot.ts`, `tests/e2e/save-persistence.spec.ts`

- 完了した step と向き変更を GameState memory に capture する。
- scene create/map load 後、入力開始前に向きと安全な位置を復元する。
- 既存 save checkpoint だけで永続化する。

**Acceptance:** 保存・再読込後に同じ map/位置/向きへ戻り、壁の中へ配置されない。
**Verify:** save E2E。

### FS-4: Opt-in object の capture/restore を追加する

**Files:** `src/scenes/Overworld.ts`, `src/scenes/overworld/fieldResumeSnapshot.ts`, `maps/<test-map>.json`, `tests/e2e/save-persistence.spec.ts`

- `persistState: true` object を map load 時に登録する。
- 遷移・戦闘・save 前に位置、向き、visible を capture する。
- まず test object 1件だけ opt-in し、通常 NPC が保存されないことも確認する。

**Acceptance:** opt-in object だけが往復・再読込後に復元される。
**Verify:** unit + save E2E + `pnpm validate:content`

### FS-5: 復帰経路を統合して全検査する

**Files:** `src/scenes/Overworld.ts`, `tests/e2e/save-persistence.spec.ts`, `tests/e2e/battle.spec.ts`, `tests/unit/savePersistence.test.ts`

- map transition、戦闘終了、通常 load の全復帰で同じ resolver を使う。
- rename/delete fixture と古い save fixture の回帰を追加する。

**Acceptance:** 各復帰経路で安全な位置と向きが一致し、必須検査が通る。
**Verify:** 完了ゲート一式。

## Checkpoints

- FS-1 後: 保存対象と fallback 規則をレビュー。
- FS-2 後: migration を旧 fixture 群で確認。
- FS-3 後: player reload をブラウザで確認。
- FS-4 後: opt-in 範囲が必要最小限かレビュー。

## Risks and rollback

- **旧 save 破損:** versioned migration と fixture round-trip を先行する。
- **壁内復帰:** map-transition と同じ resolver を再利用する。
- **save 肥大化:** object は opt-in の record だけに限定する。
- **不安定 ID:** 配列 index を使わず mapKey/objectName を検証する。
- **過剰書込み:** memory capture と既存 persistence checkpoint を分離する。

## Definition of done

`SPEC-field-resume-snapshot.md` の Success criteria を満たし、旧 save、player、opt-in object が安全に round-trip する。Open question はない。
