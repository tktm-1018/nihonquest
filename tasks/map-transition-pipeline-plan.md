# Implementation Plan: map-transition-pipeline

## Goal and scope

`SPEC-map-transition-pipeline.md` を実装し、マップ遷移を「要求作成→入力停止→フェード→旧 map 解放→新 map 読込→配置→復帰」の明示的 pipeline にする。既存の遷移時間と入口位置は維持する。

## Dependencies

- 必須: `field-flow-runtime`
- 利用先: `event-command-runtime`、`field-resume-snapshot`
- 新規 package: なし

```text
field-flow-runtime
  └─ request + entry resolver
       └─ transition pipeline
            └─ switchMap adapter / callers
```

## Architecture decisions

- `MapTransitionRequest` は destination、entry、reason を持つ serializable 値にする。
- Phaser load/restart/fade は ports に閉じ、entry resolver と状態遷移は unit test 可能にする。
- entry は exact tile → named spawn → saved position → default spawn → collision-safe fallback の優先順で決める。
- 現行 600ms fallback は維持し、fade callback と timer の競合を once guard で一度だけ完了させる。
- transition 中の再要求は現在の要求へ合流させず拒否する。

## Tasks

### MT-1: 現行 `switchMap()` の契約を固定する

**Files:** `src/scenes/Overworld.ts`, `tests/e2e/overworld.spec.ts`

- door、edge、明示 warp の代表遷移をテストする。
- fade、入口、向き、遷移後入力の現行挙動を記録する。

**Acceptance:** 実装前の入口位置と操作復帰が再現可能。
**Verify:** `pnpm exec playwright test tests/e2e/overworld.spec.ts`

### MT-2: Request と entry resolver を追加する

**Files:** `src/scenes/overworld/mapEntry.ts`, `tests/unit/mapTransitionPipeline.test.ts`

- typed request、entry candidate、collision-safe resolver を実装する。
- 優先順、存在しない spawn、範囲外、壁、決定的 fallback をテストする。

**Acceptance:** 同じ入力から常に同じ安全な配置候補を返す。
**Verify:** `pnpm exec vitest run tests/unit/mapTransitionPipeline.test.ts`

### MT-3: Transition pipeline を実装する

**Files:** `src/scenes/overworld/mapTransitionPipeline.ts`, `tests/unit/mapTransitionPipeline.test.ts`

- fade、dispose、load、place、resume を ports 経由で順番に呼ぶ。
- fade callback、600ms fallback、abort、load error の競合をテストする。

**Acceptance:** 成功時は各 phase が一度・順番どおり、失敗時は flow runtime が input を解除できる。
**Verify:** unit test。

### MT-4: `switchMap()` を adapter 化する

**Files:** `src/scenes/Overworld.ts`, `src/scenes/overworld/mapTransitionPipeline.ts`, `src/scenes/overworld/mapEntry.ts`, `tests/e2e/overworld.spec.ts`

- 現行 Scene API を ports に接続する。
- 既存 `switchMap()` は request を組み立て pipeline を呼ぶ薄い互換関数にする。
- Scene shutdown の abort を field-flow-runtime から伝える。

**Acceptance:** 既存 callers を変更しなくても代表遷移が同じように動く。
**Verify:** unit + overworld E2E。

### MT-5: 全 caller を typed request へ移行する

**Files:** `src/scenes/Overworld.ts`, `src/scenes/overworld/mapTransitionPipeline.ts`, `src/scenes/overworld/mapEntry.ts`, `tests/e2e/overworld.spec.ts`

- door、edge、menu/warp、戦闘復帰の request reason と entry を明示する。
- pipeline 外の fade/restart/setTimeout を除く。

**Acceptance:** マップ変更の production call site が pipeline に集約され、必須検査が通る。
**Verify:** `rg 'scene\.restart|fadeOut|switchMap' src/scenes` をレビュー後、完了ゲート一式。

## Checkpoints

- MT-2 後: 入口解決の仕様レビュー。
- MT-3 後: once guard と例外復帰レビュー。
- MT-4 後: ブラウザで door/edge/warp を手動確認。

## Risks and rollback

- **入口ずれ:** MT-1 fixture を golden behavior とし、caller 単位で移行する。
- **二重 restart:** callback と fallback が同じ once guard を通る。
- **load 失敗で暗転:** flow runtime cleanup から fade reset と入力解除を呼ぶ。
- **大規模 Scene 差分:** resolver、pipeline、adapter を別コミットに分ける。

## Definition of done

`SPEC-map-transition-pipeline.md` の Success criteria を満たし、全 production transition が一つの pipeline を通る。Open question はない。
