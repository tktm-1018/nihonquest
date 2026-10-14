/** 山梨県の モンスター（手描き。docs/06 §4・§6.3〜6.5 の 規格） */
import { NQ } from '../palette';
import type { MonsterDesign } from './design';
import { BEARD_FACE, HELMET, lord } from './lastbosses';

type Paint = (x: number, y: number) => string;
type Oval = readonly [cx: number, cy: number, rx: number, ry: number];

/** だ円を いくつか あわせた かたち（ドットの まん中で はかる）を paint で ぬった w×h の 地図 */
function blob(w: number, h: number, ovals: readonly Oval[], paint: Paint | string): string[] {
  const f: Paint = typeof paint === 'string' ? () => paint : paint;
  const inside = (x: number, y: number) =>
    ovals.some(([cx, cy, rx, ry]) => ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1);
  return Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) => (inside(x, y) ? f(x, y) : '.')).join(''),
  );
}

/** 地図の まわり 1 ドットを ink に する（重ねた 部品を くっきり させる）。x-1, y-1 に 置く */
function ring(rows: readonly string[]): string[] {
  const w = Math.max(...rows.map((r) => r.length));
  const at = (x: number, y: number) => (rows[y]?.[x] ?? '.') !== '.';
  return Array.from({ length: rows.length + 2 }, (_, j) =>
    Array.from({ length: w + 2 }, (_, i) => {
      const x = i - 1;
      const y = j - 1;
      return !at(x, y) && (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1)) ? 'o' : '.';
    }).join(''),
  );
}

/** ぶどうの ふさ：まるい つぶ（あとの つぶが 手前）。つぶごとに 右下は かげ D、左上に つや L。plain の ところは 顔の ため つぶを 描かない */
type Grape = readonly [cx: number, cy: number, r: number];
function grapes(
  w: number,
  h: number,
  list: readonly Grape[],
  plain: (x: number, y: number) => boolean,
): string[] {
  return Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) => {
      let hit: Grape | undefined;
      for (const g of list) if ((x + 0.5 - g[0]) ** 2 + (y + 0.5 - g[1]) ** 2 <= g[2] ** 2) hit = g;
      if (!hit) return '.';
      if (plain(x, y)) return 'V';
      const ex = x + 0.5 - hit[0];
      const ey = y + 0.5 - hit[1];
      if (Math.hypot(ex, ey) > hit[2] - 0.8 && ex + ey > -hit[2] * 0.5) return 'D';
      if (Math.abs(ex + hit[2] * 0.38) < 0.6 && Math.abs(ey + hit[2] * 0.38) < 0.6) return 'L';
      return 'V';
    }).join(''),
  );
}

/**
 * 水晶の 柱：根もと (bx, by) から 角度 deg（真上 0、右が +）へ 長さ len・はば wid。先は とがる。
 * 光の 当たる 左の 面・まん中・かげの 右の 面を face の 3 文字で ぬる
 */
function crystal(
  w: number,
  h: number,
  [bx, by, deg, len]: readonly [number, number, number, number],
  wid: number,
  face = 'WIK',
): string[] {
  const a = (deg * Math.PI) / 180;
  const ux = Math.sin(a);
  const uy = -Math.cos(a);
  const half = wid / 2;
  const tip = len - half * 1.6;
  return Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) => {
      if (x < 1 || y < 1) return '.';
      const dx = x + 0.5 - bx;
      const dy = y + 0.5 - by;
      const t = dx * ux + dy * uy;
      const s = dx * -uy + dy * ux;
      const lim = t > tip ? half * (1 - (t - tip) / (len - tip)) : half;
      if (t < 0 || t > len || Math.abs(s) > lim) return '.';
      return s < -half / 3 ? face[0]! : s > half / 3 ? face[2]! : face[1]!;
    }).join(''),
  );
}

/** 光の 後光（まん中から のびる とげとげ。左右対称）。in・out の 2 文字で ぬる */
function rays(
  size: number,
  cy: number,
  rIn: number,
  rOut: number,
  n: number,
  bottom: number,
  inner = 'c',
  outer = 'y',
): string[] {
  const cx = (size - 1) / 2;
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => {
      const d = Math.hypot(x - cx, y - cy);
      const a = Math.abs(Math.atan2(x - cx, cy - y));
      const u = (a / ((2 * Math.PI) / n)) % 1;
      const r = rIn + (rOut - rIn) * (1 - 2 * Math.min(u, 1 - u));
      if (d > r || y > bottom || x < 1 || y < 1 || x > size - 2) return '.';
      return d > r - 2.5 ? outer : inner;
    }).join(''),
  );
}

/** 地図の 上に 部品を かさねた 新しい 地図（'.' は 下の まま） */
function stamp(rows: readonly string[], x: number, y: number, part: readonly string[]): string[] {
  const out = [...rows];
  part.forEach((p, j) => {
    const r = out[y + j];
    if (r === undefined) return;
    out[y + j] = [...r]
      .map((c, i) => {
        const q = p[i - x];
        return q !== undefined && q !== '.' ? q : c;
      })
      .join('');
  });
  return out;
}

// ───────────────────────── 通常モンスター ─────────────────────────

/** ブドーン：甲州の ぶどうの ふさ。むらさきの つぶ、茶色の じく、ぶどうの 葉と くるんと まいた つる（モリ） */
const BUDOON_GRAPES: readonly Grape[] = [
  [8.5, 11, 3.2],
  [13.5, 11, 3.2],
  [18.5, 11, 3.2],
  [23.5, 11, 3.2],
  [6, 15, 3],
  [26, 15, 3],
  [11, 15, 3.2],
  [16, 15, 3.2],
  [21, 15, 3.2],
  [8.5, 19, 3.2],
  [13.5, 19, 3.2],
  [18.5, 19, 3.2],
  [23.5, 19, 3.2],
  [11, 23, 3.2],
  [16, 23, 3.2],
  [21, 23, 3.2],
  [13.5, 26.5, 2.8],
  [18.5, 26.5, 2.8],
  [16, 29, 2.2],
];
const budoon: MonsterDesign = {
  size: 32,
  colors: {
    V: NQ.violet,
    D: NQ.indigo,
    L: NQ.lavender,
    B: NQ.brown,
    E: NQ.leaf,
    g: NQ.green,
    l: NQ.lime,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.violet]: NQ.indigo },
  layers: [
    { rows: grapes(32, 31, BUDOON_GRAPES, (x, y) => x >= 9 && x <= 22 && y >= 14 && y <= 21) },
    // じく・葉っぱ・つる
    { x: 15, y: 3, rows: ['BB', 'BB', 'BB', 'BB', 'BB'] },
    { x: 6, y: 2, rows: ['..EE.EE..', '.EEEEEEE.', 'EEgEEgEEE', '.EEgEgEEB', '..EEgEEBB', '...EEE...'] },
    { x: 18, y: 2, rows: ['.ll.', 'l..l', 'l.l.', '.l..'] },
    // 目・ほっぺ・口
    { mirror: true, x: 11, y: 15, rows: ['WW', 'Wo', 'Wo'] },
    { mirror: true, x: 9, y: 18, rows: ['pp'] },
    { mirror: true, x: 14, y: 19, rows: ['o.', '.o'] },
  ],
};

/** ホウトウン：ほうとうの かぼちゃ。みどりの かぼちゃの 切り口から 平たい めんが あふれ、頭に 炎（ヒノ） */
const houtoun: MonsterDesign = {
  size: 32,
  colors: {
    K: NQ.green,
    k: NQ.forest,
    O: NQ.orange,
    b: NQ.tan,
    C: NQ.beige,
    S: NQ.sand,
    V: NQ.vermilion,
    A: NQ.apricot,
    G: NQ.gold,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.green]: NQ.forest },
  rimDepth: 2,
  layers: [
    // かぼちゃの からだ（たての みぞ）
    {
      rows: blob(32, 31, [[16, 21.5, 13, 8.5]], (x, y) =>
        [8, 12, 19, 23].includes(x) && !(x >= 9 && x <= 22 && y >= 17 && y <= 24) ? 'k' : 'K',
      ),
    },
    // 切り口（オレンジの 実と しる）
    { rows: blob(32, 31, [[16, 14.5, 10, 2.6]], 'O') },
    { rows: blob(32, 31, [[16, 14.5, 7.5, 1.6]], 'b') },
    // 山もりの ほうとう（平たい めん）
    {
      rows: blob(32, 31, [[16, 11.5, 6.5, 3.5]], (x, y) =>
        (y + Math.round(Math.sin(x * 0.9) * 1.2)) % 3 === 0 ? 'S' : 'C',
      ),
    },
    // ふちから たれる めん
    { mirror: true, x: 6, y: 13, rows: ['CC.CC', 'CS.CS', 'CC.CC', '.C..C', '.S..C', '....S'] },
    // 炎
    { mirror: true, x: 15, y: 3, rows: ['G', 'A', 'A', 'V', 'V'] },
    { mirror: true, x: 12, y: 5, rows: ['.G', 'GA', 'AV', 'V.'] },
    // 目・ほっぺ・口
    { mirror: true, x: 11, y: 18, rows: ['WW', 'Wo', 'Wo'] },
    { mirror: true, x: 9, y: 21, rows: ['pp'] },
    { mirror: true, x: 14, y: 22, rows: ['oo', '.o'] },
  ],
};

/** スズリン：雨畑硯。黒い 石の 板、上に すみを ためる「うみ」、顔の ある ところが すみを する「おか」（ツチ） */
const SUMI = ['KK', 'GG', 'KK', 'KK', 'KK', 'KK', 'KK'];
const suzurin: MonsterDesign = {
  size: 32,
  colors: { N: NQ.slate, g: NQ.gray, s: NQ.silver, K: NQ.night, G: NQ.gold, W: NQ.white, p: NQ.blush },
  rim: { [NQ.slate]: NQ.night, [NQ.gray]: NQ.slate },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '........gggggggg',
        '.......ggggggggg',
        '......ggggNNNNNN',
        '......ggNKKKKKKK',
        '......ggKKKKKKKK',
        '......ggKKKKKKKK',
        '......ggNKKKKKKK',
        '......gggNNNNNNN',
        '......ggNNNNNNNN',
        '......ggNNNNNNNN',
        '......ggNNNNNNNN',
        '......ggNNNNNNNN',
        '......ggNNWWNNNN',
        '......ggNNWoNNNN',
        '...NN.ggNNWoNNNN',
        '..NNNNggNpNNNNNN',
        '..NNNNggNNNNNNoN',
        '...NN.ggNNNNNNNo',
        '......ggNNNNNNNN',
        '......ggNNNNNNNN',
        '......ggNNNNNNNN',
        '......ggNNNNNNNN',
        '......ggNNNNNNNN',
        '......gggggggggg',
        '.......ggggggggg',
        '........NNN.....',
        '........KKK.....',
      ],
    },
    // つや（左）・すみの 光・ひび
    {
      x: 7,
      y: 5,
      rows: [
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
      ],
    },
    { x: 11, y: 7, rows: ['.WW', 'W..'] },
    { x: 10, y: 22, rows: ['K.', '.K', 'K.'] },
    // はねた すみの しずく
    { x: 13, y: 1, rows: ['.K', 'KK'] },
    { x: 18, y: 1, rows: ['K'] },
    // 手に もった すみ（金の おび）
    { x: 27, y: 10, rows: ring(SUMI) },
    { x: 28, y: 11, rows: SUMI },
  ],
};

/** モモリン：甲州の もも。まるい ピンクの 実、まん中の すじ、上に 葉と 小さな えだ（ミズ） */
const momorin: MonsterDesign = {
  size: 32,
  colors: {
    P: NQ.blush,
    b: NQ.berry,
    A: NQ.apricot,
    W: NQ.white,
    C: NQ.cream,
    G: NQ.leaf,
    g: NQ.green,
    K: NQ.brown,
  },
  rim: { [NQ.blush]: NQ.berry, [NQ.leaf]: NQ.green },
  rimDepth: 2,
  layers: [
    // えだと 葉
    { x: 15, y: 1, rows: ['.K', '.K', 'GK', 'GG'] },
    { x: 17, y: 2, rows: ['GG.', 'GGG', '.GG'] },
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '.............PPP',
        '..........PPPPPP',
        '........PPPPPPPP',
        '.......PPPPPPPPP',
        '......PPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '......PPPPPPPPPP',
        '.......PPPPPPPPP',
        '........PPPPPPPP',
        '.........PPPPPPP',
        '..........PPPPPP',
        '...........ggg..',
        '...........ggg..',
        '..........Gggg..',
        '..........GGgg..',
        '................',
      ],
    },
    // まん中の すじ
    { mirror: true, y: 6, rows: Array.from({ length: 19 }, () => '...............b') },
    // つや
    { x: 8, y: 11, rows: ['.C', 'C.', 'C.'] },
    // かお
    {
      mirror: true,
      y: 14,
      rows: ['..........WW....', '..........Wo....', '..........Wo....', '.............ooo'],
    },
    { mirror: true, y: 17, rows: ['........A.......'] },
  ],
};

/** ハクトウヒメ（モモリンの しんか）：白い ももの かんむりを つけた すがた。葉の かざりと きりっと した まゆ（ミズ） */
const hakutoHime: MonsterDesign = {
  size: 32,
  colors: {
    P: NQ.blush,
    b: NQ.berry,
    A: NQ.apricot,
    W: NQ.white,
    C: NQ.cream,
    G: NQ.leaf,
    g: NQ.green,
    K: NQ.brown,
  },
  rim: { [NQ.blush]: NQ.berry, [NQ.leaf]: NQ.green },
  rimDepth: 2,
  layers: [
    // 葉の かざり（左右へ 大きく）
    {
      mirror: true,
      y: 3,
      rows: ['..GG............', '.GGgG...........', '..GGgG..........', '...GGG..........'],
    },
    { x: 15, y: 0, rows: ['.K', '.K', 'GK', 'GG'] },
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '................',
        '............WWWW',
        '.........WWWWWWW',
        '.......WWWWWWWWW',
        '......WWWWWWWWWW',
        '.....WWWWWWWPPPP',
        '....WWWWPPPPPPPP',
        '....WWPPPPPPPPPP',
        '...PPPPPPPPPPPPP',
        '...PPPPPPPPPPPPP',
        '...PPPPPPPPPPPPP',
        '...PPPPPPPPPPPPP',
        '...PPPPPPPPPPPPP',
        '...PPPPPPPPPPPPP',
        '...PPPPPPPPPPPPP',
        '...PPPPPPPPPPPPP',
        '...PPPPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '......PPPPPPPPPP',
        '.......PPPPPPPPP',
        '........PPPPPPPP',
        '.........PPPPPPP',
        '..........gggg..',
        '..........gggg..',
        '.........Ggggg..',
        '.........GGggg..',
      ],
    },
    { mirror: true, y: 5, rows: Array.from({ length: 21 }, () => '...............b') },
    { x: 6, y: 12, rows: ['.C', 'C.', 'C.'] },
    // かお（きりっと）
    {
      mirror: true,
      y: 12,
      rows: [
        '.........o......',
        '..........oo....',
        '..........WW....',
        '..........Wo....',
        '..........Wo....',
        '............oooo',
      ],
    },
  ],
};

// ───────────────────────── しんか ─────────────────────────

/** タワワブドウ：ブドーンの しんか。つぶが ふえて 重たい ふさ、葉っぱの マント、2 本の つる、きりっと した まゆ（モリ） */
const TAWAWA_GRAPES: readonly Grape[] = [
  [6, 10, 3.3],
  [11, 10, 3.3],
  [16, 10, 3.3],
  [21, 10, 3.3],
  [26, 10, 3.3],
  [4, 14, 3.2],
  [28, 14, 3.2],
  [8.5, 14, 3.3],
  [13.5, 14, 3.3],
  [18.5, 14, 3.3],
  [23.5, 14, 3.3],
  [6, 18, 3.3],
  [26, 18, 3.3],
  [11, 18, 3.3],
  [16, 18, 3.3],
  [21, 18, 3.3],
  [8.5, 22, 3.3],
  [13.5, 22, 3.3],
  [18.5, 22, 3.3],
  [23.5, 22, 3.3],
  [11, 25.5, 3.2],
  [16, 25.5, 3.2],
  [21, 25.5, 3.2],
  [13.5, 28.5, 2.6],
  [18.5, 28.5, 2.6],
];
const tawawaBudou: MonsterDesign = {
  size: 32,
  colors: {
    V: NQ.violet,
    D: NQ.indigo,
    L: NQ.lavender,
    B: NQ.brown,
    E: NQ.leaf,
    g: NQ.green,
    l: NQ.lime,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.violet]: NQ.indigo, [NQ.leaf]: NQ.green },
  layers: [
    // 葉っぱの マント（うしろ）
    {
      mirror: true,
      x: 1,
      y: 2,
      rows: ['..EE.....', '.EEEE....', 'EEgEEE...', 'EEEgEEE..', '.EEEgEE..', '..EEEE...', '...EE....'],
    },
    { rows: grapes(32, 31, TAWAWA_GRAPES, (x, y) => x >= 8 && x <= 23 && y >= 12 && y <= 20) },
    // じく・つる
    { x: 15, y: 1, rows: ['BB', 'BB', 'BB', 'BB', 'BB', 'BB'] },
    { mirror: true, x: 9, y: 1, rows: ['.ll...', 'l..l..', 'l.l...', '.l.lll', '...l..'] },
    // まゆ・目・ほっぺ・口
    { mirror: true, x: 10, y: 12, rows: ['oo.', '..o'] },
    { mirror: true, x: 11, y: 14, rows: ['WW', 'Wo', 'Wo'] },
    { mirror: true, x: 9, y: 17, rows: ['pp'] },
    { mirror: true, x: 13, y: 18, rows: ['ooo', '.oo'] },
  ],
};

/** アツアツホウトウ：ホウトウンの しんか。大きな かぼちゃ、山もりの めんと たてがみの ように たれる めん、大きな 炎、はしで めんを もちあげる（ヒノ） */
const ATSU_HASHI = ['H.H', 'H.H', 'H.H', 'H.H', 'H.H', 'HCH', 'HCH', '.C.', '.C.', '.S.'];
const atsuatsuHoutou: MonsterDesign = {
  size: 32,
  colors: {
    K: NQ.green,
    k: NQ.forest,
    O: NQ.orange,
    b: NQ.tan,
    H: NQ.tan,
    C: NQ.beige,
    S: NQ.sand,
    V: NQ.vermilion,
    A: NQ.apricot,
    G: NQ.gold,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.green]: NQ.forest },
  rimDepth: 2,
  layers: [
    // たてがみの ように たれる めん（うしろ）
    {
      mirror: true,
      x: 2,
      y: 12,
      rows: ['..CCC', '.CCSC', 'CCSCC', 'CSCC.', 'CCSC.', 'CSCC.', 'CCC..', 'CSC..', 'CC...'],
    },
    {
      rows: blob(32, 31, [[16, 22, 12.5, 8]], (x, y) =>
        [9, 13, 18, 22].includes(x) && !(x >= 9 && x <= 22 && y >= 17 && y <= 25) ? 'k' : 'K',
      ),
    },
    { rows: blob(32, 31, [[16, 15, 10.5, 2.8]], 'O') },
    { rows: blob(32, 31, [[16, 15, 8, 1.7]], 'b') },
    {
      rows: blob(32, 31, [[16, 11, 8, 4.5]], (x, y) =>
        (y + Math.round(Math.sin(x * 0.9) * 1.2)) % 3 === 0 ? 'S' : 'C',
      ),
    },
    { mirror: true, x: 5, y: 13, rows: ['CC.CC', 'CS.CS', 'CC.SC', '.C..C', '.S..C', '....S'] },
    // 大きな 炎
    { mirror: true, x: 14, y: 1, rows: ['.G', '.G', 'GA', 'AA', 'AV', 'VV'] },
    { mirror: true, x: 11, y: 3, rows: ['.G', 'GA', 'AV', 'VV', 'V.'] },
    // はしで もちあげた めん
    { x: 25, y: 1, rows: ring(ATSU_HASHI) },
    { x: 26, y: 2, rows: ATSU_HASHI },
    // ゆげ
    { x: 2, y: 2, rows: ['.WW', 'WWW', '.W.'] },
    // まゆ・目・ほっぺ・口
    { mirror: true, x: 10, y: 17, rows: ['ooo.', '...o'] },
    { mirror: true, x: 11, y: 19, rows: ['WW', 'Wo', 'Wo'] },
    { mirror: true, x: 9, y: 22, rows: ['pp'] },
    { mirror: true, x: 13, y: 23, rows: ['ooo', '.oo'] },
  ],
};

/** スズリタツジン：スズリンの しんか。はばの 広い すずり、白い はちまきと 白い ひげ、大きな 筆を つえの ように もつ（ツチ） */
const FUDE = [
  '.T.',
  '.T.',
  '.T.',
  '.B.',
  '.T.',
  '.T.',
  '.T.',
  '.B.',
  '.T.',
  '.T.',
  '.T.',
  '.B.',
  'PPP',
  'KKK',
  'KKK',
  '.K.',
];
const suzuriTatsujin: MonsterDesign = {
  size: 32,
  colors: {
    N: NQ.slate,
    g: NQ.gray,
    s: NQ.silver,
    K: NQ.night,
    W: NQ.white,
    P: NQ.paper,
    T: NQ.tan,
    B: NQ.brown,
    p: NQ.blush,
  },
  rim: { [NQ.slate]: NQ.night, [NQ.gray]: NQ.slate, [NQ.paper]: NQ.cloud },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '................',
        '......gggggggggg',
        '.....ggggggggggg',
        '....gggggNNNNNNN',
        '....ggNKKKKKKKKK',
        '....ggKKKKKKKKKK',
        '....ggNKKKKKKKKK',
        '....gggNNNNNNNNN',
        '....ggPPPPPPPPPP',
        '....ggPPPPPPPPPP',
        '....ggNNNNNNNNNN',
        '....ggNNoooNNNNN',
        '....ggNNNNNooNNN',
        '....ggNNNNWWNNNN',
        '..NNggNNNNWoNNNN',
        '.NNNggNNNNWoNNNN',
        '.NNNggNNpNNNNNNN',
        '..NNggNNNNPPPPPP',
        '....ggNNNPPPPPPo',
        '....ggNNNNPPNNoN',
        '....ggNNNNNNNNNN',
        '....ggNNNNNNNNNN',
        '....ggNNNNNNNNNN',
        '....gggggggggggg',
        '.....ggggggggggg',
        '.......NNNN.....',
        '.......NNNN.....',
        '.......KKKK.....',
      ],
    },
    // はちまきの むすび目（左に なびく）
    { x: 1, y: 10, rows: ['.PP.', 'PPPP', '...P'] },
    // つや・すみの 光
    {
      x: 5,
      y: 6,
      rows: [
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
        's',
      ],
    },
    { x: 9, y: 8, rows: ['.WW', 'W..'] },
    // 大きな 筆（右手で もつ）
    { x: 27, y: 3, rows: ring(FUDE) },
    { x: 28, y: 4, rows: FUDE },
    { x: 26, y: 17, rows: ['NN', 'NN'] },
  ],
};

// ───────────────────────── 中ボス ─────────────────────────

/**
 * サカサフジン（中ボス）：富士五湖の 水の せい。上は 氷の つのと 雪の とげを かぶった 富士山、ひたいに 赤い 宝石、
 * 暗い 山はだに 金に 光る つり目と きば、湖面の 下に とがった 逆さ富士、左右に ふりあげた 水しぶきの つめ（ミズ）
 */
const sakasaColors = {
  W: NQ.white,
  A: NQ.azure,
  n: NQ.navy,
  I: NQ.ice,
  S: NQ.sky,
  G: NQ.gold,
  Y: NQ.cream,
  R: NQ.red,
};
const sakasaFujin: MonsterDesign = {
  size: 40,
  colors: sakasaColors,
  rim: { [NQ.azure]: NQ.blue, [NQ.sky]: NQ.azure },
  rimDepth: 2,
  layers: [
    // 水しぶきの うで と つめ
    {
      mirror: true,
      y: 4,
      rows: [
        '.I..I...............',
        '.II.I...I...........',
        '.IIIII.II...........',
        '..SIIIII............',
        '..SSIII.............',
        '..SSSI..............',
        '...SSI..............',
        '...SSSI.............',
        '....SSSI............',
        '.....SSSI...........',
        '......SSSI..........',
        '.......SSSI.........',
        '........SSSI........',
        '.........SSSI.......',
        '..........SSSI......',
      ],
    },
    // 氷の つの
    {
      mirror: true,
      y: 3,
      rows: [
        '.........W..........',
        '.........WW.........',
        '..........WW........',
        '..........IWW.......',
        '...........IWW......',
        '............IWW.....',
        '.............IWW....',
      ],
    },
    // 雪の とげを かぶった 富士山（上）・湖面・逆さ富士（下）
    {
      mirror: true,
      y: 2,
      rows: [
        '...................W',
        '..................WW',
        '..................WW',
        '.................WWW',
        '................WWWW',
        '...............WWWWW',
        '..............WWWWWW',
        '.............WWWWWWW',
        '............WWWWWWWW',
        '...........AWWWAWWWW',
        '..........AAWWAAAWWA',
        '.........AAAWAAAAAWA',
        '.........AAAAAAAAAAA',
        '........AAAAAAAAAAAA',
        '.......AAAAAAAAAAAAA',
        '.......AAAAAAAAAAAAA',
        '......AAAAAAAAAAAAAA',
        '.....AAAAAAAAAAAAAAA',
        '.....AAAAAAAAAAAAAAA',
        '....AAAAAAAAAAAAAAAA',
        '...AAAAAAAAAAAAAAAAA',
        '..WIWWIWWIWWIWWIWWIW',
        '.IWIIWIIWIIWIIWIIWII',
        '...SSSSSSSSSSSSSSSSS',
        '.....SSSSIIISSSSSSSS',
        '......SSSSSSSSSSSSSS',
        '........SSSSSSIIISSS',
        '.........SSSSSSSSSSS',
        '...........SSSIIISSS',
        '............SSSSSSSS',
        '..............SSSSII',
        '...............SSIII',
        '................SIII',
        '.................III',
        '..................II',
        '...................I',
      ],
    },
    // ひたいの 赤い 宝石
    { mirror: true, x: 17, y: 11, rows: ['.GG', 'GRR', '.GR'] },
    // 暗い かお
    {
      mirror: true,
      y: 15,
      rows: ['..........nnnnnnnnnn', '..........nnnnnnnnnn', '...........nnnnnnnnn', '............nnnnnnnn'],
    },
    // つり上がって 金に 光る 目
    {
      mirror: true,
      y: 13,
      rows: [
        '.........ooo........',
        '..........oooooo....',
        '...........ooooooo..',
        '...........GGGoooo..',
        '...........GYYGGGo..',
        '............GGGGGG..',
        '.............GGG....',
      ],
    },
    // きばの 口
    {
      mirror: true,
      y: 19,
      rows: ['.............ooooooo', '.............oWoWWoW', '..............oWooWo', '...............ooooo'],
    },
  ],
};

/** サカサフジン（フィールドに 立つ 32×32） */
const sakasaFujinField: MonsterDesign = {
  size: 32,
  colors: sakasaColors,
  rim: { [NQ.azure]: NQ.blue, [NQ.sky]: NQ.azure },
  layers: [
    {
      mirror: true,
      y: 3,
      rows: [
        '.I..I...........',
        '.IIIII..........',
        '..SIII..........',
        '..SSI...........',
        '...SSI..........',
        '....SSI.........',
        '.....SSI........',
        '......SSI.......',
        '.......SSI......',
        '........SSI.....',
      ],
    },
    {
      mirror: true,
      y: 2,
      rows: [
        '........W.......',
        '........WW......',
        '.........IW.....',
        '..........IW....',
        '...........IW...',
      ],
    },
    {
      mirror: true,
      y: 1,
      rows: [
        '...............W',
        '..............WW',
        '.............WWW',
        '............WWWW',
        '...........WWWWW',
        '..........WWWWWW',
        '.........AWWAWWW',
        '........AAWAAAWA',
        '........AAAAAAAA',
        '.......AAAAAAAAA',
        '......AAAAAAAAAA',
        '......AAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '....AAAAAAAAAAAA',
        '...AAAAAAAAAAAAA',
        '..WIWWIWWIWWIWWI',
        '.IWIIWIIWIIWIIWI',
        '...SSSSSSSSSSSSS',
        '....SSSSIISSSSSS',
        '......SSSSSSSIIS',
        '.......SSSSSSSSS',
        '.........SSSIIIS',
        '..........SSSSSS',
        '...........SSIII',
        '............SIII',
        '.............III',
        '..............II',
        '...............I',
      ],
    },
    { mirror: true, x: 14, y: 7, rows: ['GG', 'GR'] },
    { mirror: true, y: 10, rows: ['........nnnnnnnn', '.........nnnnnnn', '..........nnnnnn'] },
    {
      mirror: true,
      y: 9,
      rows: [
        '.......oo.......',
        '........ooooo...',
        '.........GGooo..',
        '.........GYGGo..',
        '..........GGG...',
      ],
    },
    { mirror: true, y: 13, rows: ['...........ooooo', '...........oWoWW', '............oWoo'] },
  ],
};

// ───────────────────────── 県ボス ─────────────────────────

/** 竜の からだ（左半分。つのの 生えた 頭・赤く 光る 目・きばの 口・金の むねの うろこ・ふんばる 足・昇仙峡の 岩） */
const RYU = [
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '.................VVVVVVV',
  '...............VVVVVVVVV',
  '..............VVVVVVVVVV',
  '.............VVVVVVVVVVV',
  '............VVVVVVVVVVVV',
  '..........VVVVVVVVVVVVVV',
  '...........VVVVVVVVVVVVV',
  '..........VVVVVVVVVVVVVV',
  '............VVVVVVVVVVVV',
  '.............VVVVVVVVVVV',
  '..............VVVVVVVVVV',
  '..............VVVVVVVVVV',
  '...............VVVVVVVVV',
  '...............VVVVVVVVV',
  '.............VVVVVVVVVVV',
  '...........VVVVVVVVVVVVV',
  '.........VVVVVVVVVVVVVVV',
  '.........VVVVVVVVVVVVVVV',
  '..........VVVVVVVVVGGGGG',
  '..........VVVVVVVVGGGGGG',
  '..........VVVVVVVVQQQQQQ',
  '...........VVVVVVVGGGGGG',
  '...........VVVVVVVGGGGGG',
  '...........VVVVVVVQQQQQQ',
  '............VVVVVVVGGGGG',
  '............VVVVVVVGGGGG',
  '............VVVVVVVQQQQQ',
  '............VVVVVVVVGGGG',
  '...........VVVVVVVVVVVVV',
  '..........VVVVVVVVVVVVVV',
  '.........VVVVVVVVVV.VVVV',
  '........VVVVVVVVVV...VVV',
  '........VVVVVVVVV.......',
  '........VVVVVVVVV.......',
  '.......VVVVVVVVVV.......',
  '.......VVVVVVVVVV.......',
  '......GVGVGVVVVVV.......',
  '....sSSSSSSSSSSSSSSSSSSS',
  '...sSSSSSSSSSSSSSSSSSSSS',
  '..sSSSSsSSSSSSSSsSSSSSSS',
  '..ssssssssssssssssssssss',
];
/** 横に はりだした うで（金の つめ） */
const RYU_ARM = [
  '.....VVVVV',
  '....VVVVVV',
  '...VVVVVV.',
  '..VVVVV...',
  '.VVVVV....',
  '.VVVV.....',
  'VVVVV.....',
  'VVVVV.....',
  'GVGVG.....',
  'G.G.G.....',
];
/** 水晶の つばさ（左半分。かたから 上と 外へ 大きく ひろげる） */
const RYU_WING = (
  [
    [12, 21, -75, 12, 4],
    [12, 21, -52, 16, 4.4],
    [12, 21, -30, 20, 4.8],
    [13, 21, -10, 19, 4.4],
  ] as const
).map(([bx, by, deg, len, wid]) => crystal(24, 48, [bx, by, deg, len], wid));
/** 部品の まわりの 輪郭（ring を 24×48 の 左半分に おさめる） */
const edge = (rows: readonly string[]) =>
  ring(rows)
    .slice(1, 49)
    .map((r) => r.slice(1, 25));
/** 金の つの（頭の 上で 外へ そりかえる） */
const RYU_HORN = [
  crystal(24, 48, [18, 10, -35, 12], 3.4, 'YGQ'),
  crystal(24, 48, [14, 12, -72, 7], 2.6, 'YGQ'),
];

/** スイショウリュウ（県ボス）：昇仙峡の 岩の おくで ねむっていた 水晶の 竜。大きく ひろげた 水晶の つばさ、金の つの と むねの うろこ、赤く 光る つり目と きば、金の つめ（ヒカリ） */
const ryuColors = {
  V: NQ.violet,
  L: NQ.lavender,
  n: NQ.indigo,
  Q: NQ.ochre,
  G: NQ.gold,
  Y: NQ.yellow,
  R: NQ.red,
  W: NQ.white,
  I: NQ.ice,
  K: NQ.sky,
  S: NQ.silver,
  s: NQ.gray,
};
const suishoRyu: MonsterDesign = {
  size: 48,
  colors: ryuColors,
  rim: { [NQ.violet]: NQ.indigo, [NQ.silver]: NQ.gray },
  rimDepth: 2,
  layers: [
    ...RYU_WING.flatMap((rows) => [
      { mirror: true, rows: edge(rows) },
      { mirror: true, rows },
    ]),
    ...RYU_HORN.map((rows) => ({ mirror: true, rows })),
    { mirror: true, rows: RYU },
    { mirror: true, x: 0, y: 20, rows: ring(RYU_ARM) },
    { mirror: true, x: 1, y: 21, rows: RYU_ARM },
    // うろこの つや（左上）
    { mirror: true, x: 13, y: 8, rows: ['LL', 'L.'] },
    { mirror: true, x: 11, y: 24, rows: ['L.', 'LL', '.L'] },
    // 暗い 目もと と 赤く 光る つり目
    {
      mirror: true,
      y: 10,
      rows: [
        '.............nnnnnnnnn',
        '............nnnnnnnnnn',
        '.............nnnnnnnnn',
        '...............nnnnnnn',
      ],
    },
    {
      mirror: true,
      y: 9,
      rows: [
        '...........ooo..........',
        '............ooooo.......',
        '.............RRRoooo....',
        '.............RWWRRRoo...',
        '..............RRRRRR....',
        '................RRR.....',
      ],
    },
    // はなの あな と きばの 口
    { mirror: true, y: 15, rows: ['.....................o..'] },
    {
      mirror: true,
      y: 16,
      rows: [
        '...............ooooooooo',
        '...............oWWoWWoWo',
        '...............ooWooWooo',
        '................oooooooo',
        '.................oWooWoo',
      ],
    },
  ],
};

/** スイショウリュウ 後半：水晶が 金色に かがやき、うしろに 光の とげ、目が 白く 光る */
const suishoRyuP0: MonsterDesign = {
  ...suishoRyu,
  colors: { ...ryuColors, I: NQ.cream, K: NQ.yellow, c: NQ.cream, y: NQ.white },
  layers: [
    { rows: rays(48, 16, 12, 23, 14, 30) },
    ...suishoRyu.layers,
    { mirror: true, x: 13, y: 11, rows: ['yyy', 'yWWyyy', '.yyyyy'] },
    { x: 2, y: 2, rows: ['.y.', 'yGy', '.y.'] },
    { x: 43, y: 2, rows: ['.y.', 'yGy', '.y.'] },
  ],
};

// ───────────────────────── ラスボス ─────────────────────────

/** 武田菱（4 つに わけた ひし形の 家紋。左半分） */
const HISHI = ['....R', '...RR', '...RR', '.RR.R', 'RRRR.', 'RRRR.', '.RR.R', '...RR', '...RR', '....R'];
/** 金の 鍬形（くわがた） */
const SHINGEN_HORN = [
  '.GG',
  '..GG',
  '...GG',
  '....GGG',
  '......GG',
  '.......GGG',
  '.........GGG',
  '...........GGGG',
  '..............GGG',
  '...............NNNN',
];
/** 諏訪法性の かぶとの 白い 毛（左がわ。かたへ たれる） */
const SHINGEN_MANE = [
  '........PP',
  '.......PPP',
  '......PPPC',
  '.....PPPPC',
  '....PPPPC.',
  '...PPPPCC.',
  '...PPPPC..',
  '..PPPPCC..',
  '..PPPPC...',
  '.PPPPCC...',
  '.PPPPC....',
  '.PPPCC....',
  'PPPPC.....',
  'PPPC......',
  'PPC.......',
  'PC........',
];
/** 軍配（ぐんばい。黒い うるしに 金の ふち、赤い 日の 丸） */
const GUNBAI = [
  '...GGGG...',
  '..GNNNNG..',
  '.GNNRRNNG.',
  '.GNRRRRNG.',
  '.GNRRRRNG.',
  '.GNNRRNNG.',
  '..GNNNNG..',
  '...GNNG...',
  '....GG....',
  '....LL....',
  '....LL....',
  '....LL....',
  '...FFFF...',
  '...fFFf...',
];

/** 武田信玄（ラスボス）：金の 鍬形と 武田菱の 前立て、白い 毛の かぶと、黒い よろい、ひげ、軍配を もつ（ツチ → ヒノ） */
const takedaShingen = lord(
  [
    ...stamp(
      stamp(
        Array.from({ length: 10 }, () => '.'.repeat(24)),
        0,
        0,
        SHINGEN_HORN,
      ),
      19,
      0,
      HISHI,
    ),
    ...HELMET,
    ...BEARD_FACE,
  ],
  {
    N: NQ.night,
    L: NQ.slate,
    K: NQ.navy,
    S: NQ.denim,
    G: NQ.gold,
    R: NQ.red,
    T: NQ.navy,
    H: NQ.slate,
    M: NQ.hairBlack,
    P: NQ.paper,
    C: NQ.cloud,
  },
  { [NQ.denim]: NQ.navy, [NQ.paper]: NQ.cloud },
  [
    { mirror: true, x: 6, y: 12, rows: SHINGEN_MANE },
    { x: 36, y: 14, rows: ring(GUNBAI) },
    { x: 37, y: 15, rows: GUNBAI },
  ],
);

export const YAMANASHI: Readonly<Record<string, MonsterDesign>> = {
  'yamanashi-budoon': budoon,
  'yamanashi-tawawa-budou': tawawaBudou,
  'yamanashi-houtoun': houtoun,
  'yamanashi-atsuatsu-houtou': atsuatsuHoutou,
  'yamanashi-suzurin': suzurin,
  'yamanashi-suzuri-tatsujin': suzuriTatsujin,
  'yamanashi-momorin': momorin,
  'yamanashi-hakuto-hime': hakutoHime,
  'yamanashi-midboss-sakasa-fujin': sakasaFujin,
  'yamanashi-midboss-sakasa-fujin.field': sakasaFujinField,
  'yamanashi-boss-suisho-ryu': suishoRyu,
  'yamanashi-boss-suisho-ryu.p0': suishoRyuP0,
  'yamanashi-lastboss-takeda-shingen': takedaShingen,
};
