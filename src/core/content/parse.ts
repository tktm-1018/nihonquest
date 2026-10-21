/**
 * content/ の JSON を zod で検証する共通部品と manifest.json の型（loader.ts から分割）。
 */
import { z, type ZodTypeAny } from 'zod';
import type { ContentKind } from './schemas';

export class ContentError extends Error {
  constructor(
    public readonly file: string,
    message: string,
  ) {
    super(`${file}: ${message}`);
    this.name = 'ContentError';
  }
}

export interface ContentManifest {
  generatedAt: string;
  files: Record<ContentKind, string[]>;
  questions: string[];
  /** Playground の ?q= 直リンクで全問題を読み込まず、該当ファイルだけ取得する索引。 */
  questionIndex?: Record<string, string>;
  /** ゲーム開始時に選択学年だけ読み込むための索引。 */
  questionFilesByGrade?: Record<string, string[]>;
}

const contentManifestSchema = z.object({
  generatedAt: z.string(),
  files: z.record(z.array(z.string().min(1))),
  questions: z.array(z.string().min(1)),
  questionIndex: z.record(z.string().min(1)).optional(),
  questionFilesByGrade: z.record(z.array(z.string().min(1))).optional(),
});

export function parseContentManifest(data: unknown): ContentManifest {
  return parseWith<ContentManifest>(contentManifestSchema, data, 'manifest.json');
}

export function parseWith<T>(schema: ZodTypeAny, data: unknown, file: string): T {
  const r = schema.safeParse(data);
  if (!r.success) {
    const issues = r.error.issues.map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
    throw new ContentError(file, `スキーマ違反\n${issues}`);
  }
  return r.data as T;
}
