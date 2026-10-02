import { describe, expect, it } from 'vitest';
import { auditAssets, buildAssetBacklog, priorityFor } from '../../scripts/audit-assets';

describe('素材バックログ監査', () => {
  it('青森、東北、全国の順で優先度を付ける', () => {
    const order = new Map([
      ['aomori', 0],
      ['iwate', 1],
      ['tokyo', 10],
    ]);
    expect(priorityFor('aomori', order)).toBe(1);
    expect(priorityFor('iwate', order)).toBe(2);
    expect(priorityFor('tokyo', order)).toBe(4);
  });

  it('空のバックログでも安全に集計できる', () => {
    expect(buildAssetBacklog([])).toEqual({
      total: 0,
      byReleaseScope: { 'aomori-mvp': 0, tohoku: 0, national: 0 },
      byKind: { motif: 0, character: 0, portrait: 0 },
      byArea: {},
      nextBatch: [],
      assets: [],
    });
  });

  it('実コンテンツから再現可能なバックログを作る', async () => {
    const report = await auditAssets();
    expect(report.total).toBe(582);
    expect(report.byReleaseScope).toEqual({ 'aomori-mvp': 0, tohoku: 67, national: 515 });
    expect(report.byKind).toEqual({ motif: 486, character: 96, portrait: 0 });
    expect(report.byArea.aomori).toBeUndefined();
    expect(report.nextBatch.every((item) => item.priority === 2)).toBe(true);
  });
});
