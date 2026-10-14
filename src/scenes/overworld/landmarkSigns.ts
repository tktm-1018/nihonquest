/**
 * 名所の ★ 看板と、ボスを たおして 名所を 見つける ながれ（Overworld から 分けた）。
 *  - 看板は 名前の札を 出さず、★ の 色で 進みぐあいを 見せる：
 *    灰色 = まだ 見つけていない / 白＋上に「！」 = 見つけたが チャレンジが まだ / 金色 = ぜんぶ 終わった
 *  - 名所（特産品 いがい）は 看板を 見ただけでは 見つからない。その 地域の ボス（名所エリアの ぬし、
 *    エリアの ない 県は 県ボス）を たおすと 見つかる（2026-10-12「看板を見たらゴールになってしまう感じがする」）
 */
import type Phaser from 'phaser';
import type { Area, Motif } from '../../core/content/schemas';
import { markDone } from '../../core/progression/eventReward';
import { discoveredByBoss, motifStamp } from '../../core/progression/route';
import type { GameState } from '../../core/state/schema';
import type { DialogueLine } from '../../ui/dialogue';
import { t } from '../../ui/i18n';
import { playSfx } from '../../ui/sfx';

/** 名所の ★ 看板 */
export interface Sign {
  /** dex.motifs に入る名所スタンプ。持っている＝その名所を見つけた */
  stamp: string;
  found: () => boolean;
  /** 見つけた・チャレンジを終えた あとに、★ の色と「！」をいまの進みぐあいに合わせる */
  refresh: () => void;
}

/** ★ 看板を (x, y)（マスの まん中）に 立てる */
export function createSign(
  scene: Phaser.Scene,
  x: number,
  y: number,
  stamp: string,
  found: () => boolean,
  challenged: () => boolean,
): Sign {
  const texture = () => (!found() ? 'fld.sign' : challenged() ? 'fld.sign.done' : 'fld.sign.todo');
  const img = scene.add.image(x, y, texture()).setDepth(y);
  let mark: Phaser.GameObjects.Image | null = null;
  const syncMark = () => {
    const todo = found() && !challenged();
    if (todo && !mark) {
      mark = scene.add
        .image(x, y - 8, 'fld.sign.mark')
        .setOrigin(0.5, 1)
        .setDepth(y + 1);
      scene.tweens.add({
        targets: mark,
        y: y - 11,
        yoyo: true,
        repeat: -1,
        duration: 400,
        ease: 'Stepped',
        easeParams: [1],
      });
    } else if (!todo && mark) {
      mark.destroy();
      mark = null;
    }
  };
  syncMark();
  return {
    stamp,
    found,
    refresh: () => {
      const next = texture();
      syncMark();
      if (img.texture.key === next) return;
      img.setTexture(next);
      scene.tweens.add({
        targets: img,
        y: y - 3,
        yoyo: true,
        duration: 120,
        ease: 'Stepped',
        easeParams: [3],
      });
    },
  };
}

/** まだ 見つけていない 名所の 看板を しらべた ときの ひとこと（どの ボスを たおせば よいか）。ボスで 見つけない 名所は null */
export function lockedLine(area: Area, motif: Motif): DialogueLine | null {
  if (!discoveredByBoss(motif)) return null;
  const region = area.regions.find((r) => r.motifs.includes(motif.id));
  return {
    speaker: t('field.landmarkSpeaker'),
    text: region
      ? t('field.landmarkLockedRegion', { region: region.name })
      : t('field.landmarkLockedArea', { name: area.name }),
  };
}

export interface DiscoveryHost {
  gs: () => GameState | undefined;
  setGame: (gs: GameState) => void;
  cutin: (motif: Motif) => Promise<void>;
  refreshSign: (stamp: string) => void;
  renderHud: () => void;
  talk: (lines: DialogueLine[]) => Promise<void>;
  stampCount: () => { n: number; total: number };
  checkMeisan: () => Promise<void>;
}

/** ボスを たおした：まだの 名所を 1 つずつ カットイン → スタンプ（★ が 白「！」に）→ 看板で チャレンジできると 教える */
export async function discoverByBoss(
  area: Area,
  motifs: readonly Motif[],
  host: DiscoveryHost,
): Promise<void> {
  const fresh = motifs.filter((m) => !host.gs()?.dex.motifs.includes(motifStamp(area.id, m.id)));
  if (!fresh.length) return;
  for (const m of fresh) {
    playSfx('discover');
    await host.cutin(m);
    const gs = host.gs();
    if (!gs) return;
    const stamp = motifStamp(area.id, m.id);
    host.setGame(markDone(gs, { stamp }));
    playSfx('stamp');
    host.refreshSign(stamp);
  }
  host.renderHud();
  await host.talk([
    { text: t('field.bossDiscovered', { n: fresh.length }) },
    { text: t('field.stampGet', host.stampCount()) },
    { text: t('field.bossDiscoveredHint') },
  ]);
  await host.checkMeisan();
}
