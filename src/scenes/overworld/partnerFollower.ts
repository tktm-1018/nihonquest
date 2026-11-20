import type Phaser from 'phaser';
import type { ContentIndex } from '../../core/content/loader';
import type { Monster } from '../../core/content/schemas';
import type { GameState } from '../../core/state/schema';
import { MONSTER_SIZE, monsterArt } from '../../rendering/battle/pixelArt';
import type { Dir } from '../../rendering/characters';
import { designedMonsterArt } from '../../rendering/monsters';
import { monsterBackArt } from '../../rendering/monsters/backView';

/** 32 ドットの 絵を フィールドで 表示する 倍率（主人公と 同じくらいの 背） */
const FOLLOWER_SCALE = 0.75;

const DELTA: Record<Dir, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

/** フィールドで 使う 仲間の 絵（正面と うしろ姿） */
function followerArt(def: Monster): { front: HTMLCanvasElement; back: HTMLCanvasElement } {
  const designed = designedMonsterArt(def.id);
  const opts = { element: def.element, size: MONSTER_SIZE.normal };
  const front = designed ?? monsterArt(def.id, opts);
  const back =
    designedMonsterArt(def.id, '.back') ??
    (designed ? monsterBackArt(designed) : monsterArt(def.id, { ...opts, back: true }));
  return { front, back };
}

/**
 * 先頭の 仲間が 主人公の うしろを 1 マス おくれて ついて歩く（ポケモンの 連れ歩き）。
 * 主人公が 1 歩 歩く たびに、主人公が いた マスへ 同じ 時間で 移る。
 * 向き：下＝正面、上＝うしろ姿、右＝正面の 絵（右むきに 描いて ある）、左＝その 反転
 */
export class PartnerFollower {
  private sprite: Phaser.GameObjects.Image | null = null;
  private shadow: Phaser.GameObjects.Image | null = null;
  private monsterId: string | null = null;
  private tile: [number, number] = [0, 0];
  private dir: Dir = 'down';

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly tileSize: number,
  ) {}

  /** いまの 先頭の 仲間に 絵を あわせる（いなければ かくす）。毎フレーム よんで よい */
  sync(gs: GameState | null | undefined, content: ContentIndex | null | undefined): void {
    const owned = gs?.party.owned.find((m) => m.uid === gs.party.activeUid);
    const def = owned ? content?.monsters.get(owned.monsterId) : undefined;
    const id = def?.id ?? null;
    if (id === this.monsterId) return;
    this.monsterId = id;
    if (!def) {
      this.sprite?.setVisible(false);
      this.shadow?.setVisible(false);
      return;
    }
    const keys = { front: `fld.follow.${def.id}`, back: `fld.follow.${def.id}.back` };
    if (!this.scene.textures.exists(keys.front)) {
      const art = followerArt(def);
      this.scene.textures.addCanvas(keys.front, art.front);
      this.scene.textures.addCanvas(keys.back, art.back);
    }
    const [x, y] = this.feet(this.tile);
    if (!this.sprite) {
      this.shadow = this.scene.add
        .image(x, y - 1, 'fld.shadow')
        .setAlpha(0.3)
        .setDepth(1);
      this.sprite = this.scene.add.image(x, y, keys.front).setOrigin(0.5, 1);
    }
    this.sprite.setData('keys', keys).setVisible(true);
    this.shadow?.setVisible(true);
    this.applyDir();
  }

  /** 主人公の うしろ（向きの 反対）に 置く。ふさがって いれば 主人公と 同じ マス */
  place(player: [number, number], facing: Dir, open: (x: number, y: number) => boolean): void {
    const [dx, dy] = DELTA[facing];
    const behind: [number, number] = [player[0] - dx, player[1] - dy];
    this.tile = open(...behind) ? behind : [...player];
    this.dir = facing;
    this.moveTo(this.tile);
    this.applyDir();
  }

  /** 主人公が to（主人公が いま いる マス）から 歩きだした：仲間は to へ ms かけて うつる */
  follow(to: [number, number], ms: number): void {
    const [fx, fy] = this.tile;
    if (fx === to[0] && fy === to[1]) return;
    this.dir = to[0] > fx ? 'right' : to[0] < fx ? 'left' : to[1] < fy ? 'up' : 'down';
    this.tile = [...to];
    this.applyDir();
    const sp = this.sprite;
    if (!sp?.visible) {
      this.moveTo(to);
      return;
    }
    const [x0, y0] = [sp.x, sp.y];
    const [x1, y1] = this.feet(to);
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: ms,
      onUpdate: (tw) => {
        const t = tw.getValue() ?? 1;
        // 1 歩ごとに 小さく はねる
        const hop = Math.sin(Math.PI * t) * 2;
        this.setPos(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - hop, y0 + (y1 - y0) * t);
      },
      onComplete: () => this.moveTo(to),
    });
  }

  private applyDir(): void {
    const sp = this.sprite;
    const keys = sp?.getData('keys') as { front: string; back: string } | undefined;
    if (!sp || !keys) return;
    sp.setTexture(this.dir === 'up' ? keys.back : keys.front);
    sp.setFlipX(this.dir === 'left');
    // 主人公（24px）と 同じくらいの 背に。2 倍の こまかさの 絵（64）は さらに 半分
    sp.setScale((sp.width >= 64 ? 0.5 : 1) * FOLLOWER_SCALE);
  }

  private feet([tx, ty]: [number, number]): [number, number] {
    return [tx * this.tileSize + this.tileSize / 2, ty * this.tileSize + this.tileSize - 1];
  }

  private moveTo(tile: [number, number]): void {
    const [x, y] = this.feet(tile);
    this.setPos(x, y, y);
  }

  private setPos(x: number, y: number, ground: number): void {
    this.sprite?.setPosition(x, y).setDepth(ground - this.tileSize / 2);
    this.shadow?.setPosition(x, ground - 1);
  }
}
