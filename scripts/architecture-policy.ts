export interface SourceBudget {
  maxLines: number;
  reason: string;
}

const LEGACY_BUDGETS: Readonly<Record<string, SourceBudget>> = {
  'src/core/battle/engine.ts': { maxLines: 665, reason: '戦闘計算を段階的に機能別モジュールへ抽出中' },
  'src/core/content/loader.ts': { maxLines: 651, reason: 'コンテンツ読込を段階的に分割中' },
  'src/core/content/schemas.ts': { maxLines: 651, reason: '既存コンテンツ契約の集約モジュール' },
  'src/scenes/Overworld.ts': { maxLines: 3505, reason: '段階的に機能別モジュールへ抽出中' },
  'src/scenes/Battle.ts': { maxLines: 1750, reason: '段階的に演出・表示モデルを抽出中' },
  'src/scenes/battle/motions.ts': { maxLines: 1250, reason: '宣言的な戦闘モーション集' },
};

/** 新規巨大ファイルを防ぎ、既存の例外は明示した上限から増やさない。 */
export function sourceBudget(file: string): SourceBudget {
  const legacy = LEGACY_BUDGETS[file];
  if (legacy) return legacy;
  if (file.startsWith('src/rendering/')) return { maxLines: 3000, reason: '宣言的なドット絵定義' };
  if (file.startsWith('scripts/')) return { maxLines: 2700, reason: '生成・移行スクリプト' };
  return { maxLines: 650, reason: '通常の実装モジュール' };
}
