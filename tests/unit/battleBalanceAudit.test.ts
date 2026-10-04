import { describe, expect, it } from 'vitest';
import { auditBattleBalance } from '../../scripts/audit-battle-balance';

describe('戦闘バランス監査', () => {
  it('武器数・入手経路・敵階層を再現できる', () => {
    const audit = auditBattleBalance();
    expect(audit.equipment.weapon!.count).toBeGreaterThanOrEqual(4);
    expect(audit.weaponAcquisition['aomori-hiba-no-tsue']).toMatchObject({ mission: true });
    expect(audit.weaponAcquisition['aomori-nebuta-no-uchiwa']).toMatchObject({ shop: true });
    expect(audit.weaponAcquisition['aomori-maguro-zutsuki']).toMatchObject({ recipe: true });
    expect(audit.monsters.normal!.count).toBeGreaterThan(0);
    expect(audit.monsters.boss!.count).toBeGreaterThan(0);
  });

  it('解決済みの主人公成長を未実装として報告しない', () => {
    const audit = auditBattleBalance();
    expect(audit.findings).not.toContain('主人公はXPから表示レベルだけ上がり、baseStatsのレベル成長が未実装');
    expect(audit.resolved).toContain('主人公のXPレベルを実効ステータスと敵出現レベルへ反映');
  });
});
