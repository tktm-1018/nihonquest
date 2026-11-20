import type { Dir } from '../../rendering/characters';

/** ちょんと おすと 向きだけ かわる 時間（これより 長く おしつづけると 歩きだす） */
export const TURN_MS = 90;

/**
 * ポケモンふうの 歩きだし：止まって いる ときに ちがう 向きを ちょんと おすと、その 場で 向きを かえるだけ。
 * おしつづけると 歩く。歩いて いる とちゅう（キーを はなさずに）向きを かえた ときは すぐ 歩く。
 */
export class StepFeel {
  private held: Dir | null = null;
  private since = 0;
  private turning = false;

  /** いま 1 歩 歩きだして よいか。dir は おしている 向き、facing は いまの 向き */
  shouldWalk(dir: Dir | null, facing: Dir, time: number): boolean {
    if (!dir) {
      this.held = null;
      this.turning = false;
      return false;
    }
    if (dir !== this.held) {
      const fresh = this.held === null;
      this.held = dir;
      this.since = time;
      this.turning = fresh && dir !== facing;
    }
    if (this.turning && time - this.since < TURN_MS) return false;
    this.turning = false;
    return true;
  }
}
