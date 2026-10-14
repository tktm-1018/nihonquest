/** 長野県の モンスター（手描き。docs/06 §4・§6.3〜6.5 の 規格） */
import { NQ } from '../palette';
import type { MonsterDesign } from './design';
import { FACE, HELMET, lord } from './lastbosses';

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

/**
 * レタスの 玉：ふちが ひらひら した まるい 玉。葉の かさなりの すじ L、しんの 明るい ところ s、
 * face の ところは すじを 描かない
 */
function lettuce(
  w: number,
  h: number,
  [cx, cy, rx, ry]: Oval,
  face: (x: number, y: number) => boolean,
): string[] {
  return Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) => {
      const dx = (x + 0.5 - cx) / rx;
      const dy = (y + 0.5 - cy) / ry;
      const a = Math.atan2(dy, dx);
      const d = Math.hypot(dx, dy);
      if (d > 1 + 0.07 * Math.sin(a * 11)) return '.';
      if (face(x, y)) return 'M';
      if (d < 0.3) return 's';
      return (d * 4 + 0.3 * Math.sin(a * 7)) % 1 < 0.16 ? 'L' : 'M';
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

/** ユケムリザル：冬の 温泉に つかる ニホンザル。赤い 顔、頭に タオル、まわりに ゆげ（ミズ） */
const yukemuriZaru: MonsterDesign = {
  size: 32,
  colors: {
    F: NQ.silver,
    R: NQ.blush,
    b: NQ.berry,
    W: NQ.white,
    S: NQ.sky,
    A: NQ.azure,
    I: NQ.ice,
  },
  rim: { [NQ.silver]: NQ.gray, [NQ.sky]: NQ.azure },
  layers: [
    // ゆげ
    { x: 2, y: 3, rows: ['.W.', 'W..', '.W.', '..W'] },
    { x: 27, y: 6, rows: ['.W', 'W.', '.W', 'W.'] },
    // 頭・からだ（毛）
    {
      rows: blob(
        32,
        31,
        [
          [16, 12.5, 8.5, 7.5],
          [16, 22, 9, 5.5],
        ],
        'F',
      ),
    },
    // 耳
    { mirror: true, x: 6, y: 11, rows: ['.R', 'RR', '.R'] },
    // 赤い 顔
    { rows: blob(32, 31, [[16, 13.5, 5.5, 4.8]], 'R') },
    // 頭の タオル
    { x: 10, y: 3, rows: ['.WWWWWWWWWW.', 'WSSSSSSSSSSW', 'WWWWWWWWWWWW'] },
    // うで（お湯の ふちに のせる）
    { mirror: true, x: 3, y: 21, rows: ['..FFF', '.FFFF', 'RRRF.'] },
    // お湯
    { rows: blob(32, 31, [[16, 27, 14, 3.8]], (x, y) => ((x + y * 3) % 7 === 0 ? 'I' : 'S')) },
    // 目・鼻・口・ほっぺ
    { mirror: true, x: 12, y: 12, rows: ['WW', 'Wo', 'Wo'] },
    { mirror: true, x: 15, y: 15, rows: ['o'] },
    { mirror: true, x: 14, y: 17, rows: ['oo'] },
    { mirror: true, x: 11, y: 15, rows: ['b'] },
    // 肩の 雪
    { x: 8, y: 20, rows: ['.WW', 'W..'] },
  ],
};

/** レタスケ：川上村の 高原の レタス。ひらひらの 葉が かさなる まるい 玉、頭に 小さな 葉（モリ） */
const retasuke: MonsterDesign = {
  size: 32,
  colors: { M: NQ.lime, L: NQ.leaf, s: NQ.sprout, g: NQ.green, W: NQ.white, p: NQ.blush },
  rim: { [NQ.lime]: NQ.leaf },
  rimDepth: 2,
  layers: [
    // 頭の 葉
    { x: 14, y: 2, rows: ['..LL', '.LMML', 'LMsML', '.LMgL', '..gg.'] },
    { rows: lettuce(32, 31, [16, 18, 13, 11.5], (x, y) => x >= 9 && x <= 22 && y >= 14 && y <= 22) },
    // 足
    { mirror: true, x: 10, y: 28, rows: ['ggg', 'ggg'] },
    // 目・ほっぺ・口
    { mirror: true, x: 11, y: 15, rows: ['WW', 'Wo', 'Wo'] },
    { mirror: true, x: 9, y: 18, rows: ['pp'] },
    { mirror: true, x: 14, y: 19, rows: ['o.', '.o'] },
  ],
};

/** そばちょこ・ざる・そばの 色（ザルソバン・オオモリソバ） */
const sobaColors = {
  W: NQ.white,
  A: NQ.azure,
  B: NQ.blue,
  Z: NQ.beige,
  z: NQ.sand,
  E: NQ.sand,
  b: NQ.brown,
  K: NQ.night,
  g: NQ.leaf,
  H: NQ.tan,
  p: NQ.blush,
};
const sobaRim = { [NQ.white]: NQ.cloud, [NQ.azure]: NQ.blue, [NQ.beige]: NQ.sand };
/** ざるの 竹の あみめ */
const zaruWeave = (x: number, y: number) => ((x + y) % 2 === 0 ? 'Z' : 'z');
/** そばの たて すじ */
const sobaStrand = (x: number) => (x % 2 === 0 ? 'E' : 'b');

/** ザルソバン：戸隠そばの ぼっち盛り。青い もようの そばちょこの からだ、竹の ざるの ぼうしに 小さな そばの たばが 3 つ、のりと ねぎ（ツチ） */
const zaruSoban: MonsterDesign = {
  size: 32,
  colors: sobaColors,
  rim: sobaRim,
  layers: [
    // そばちょこの からだ（白と 青の そめつけ）
    {
      mirror: true,
      y: 13,
      rows: [
        '.......WWWWWWWWW',
        '......WWWWWWWWWW',
        '......WBWWBWWBWW',
        '......WWWWWWWWWW',
        '......AAAAAAAAAA',
        '......AAAAAAAAAA',
        '.......AAAAAAAAA',
        '.......AAAAAAAAA',
        '.......AAAAAAAAA',
        '.......AAAAAAAAA',
        '.......AAAAAAAAA',
        '........AAAAAAAA',
        '........WWWWWWWW',
        '........WBWWBWWB',
        '.........WWWWWWW',
        '.........BBBBBBB',
        '.........BBBBBBB',
      ],
    },
    // ざるの ふちから たれる そば
    { mirror: true, x: 5, y: 11, rows: ['Eb', 'bE', 'Eb', 'b.', 'E.'] },
    // ざるの ぼうし
    { rows: blob(32, 31, [[16, 10.5, 12.5, 2.6]], zaruWeave) },
    // ぼっち盛りの そば（3 つの たば）
    { mirror: true, x: 8, y: 4, rows: ['.EbE..bE', 'EbEbE.Eb', 'bEbEb.bE', 'EbEbE.Eb'] },
    // のり と ねぎ
    { x: 14, y: 3, rows: ['KK.', '..K'] },
    { x: 9, y: 3, rows: ['g.g'] },
    // 目・ほっぺ・口
    { mirror: true, x: 11, y: 19, rows: ['WW', 'Wo', 'Wo'] },
    { mirror: true, x: 9, y: 22, rows: ['pp'] },
    { mirror: true, x: 14, y: 22, rows: ['oo', '.o'] },
  ],
};

/** ワカサギン：諏訪湖の わかさぎ。銀色の たて長の からだ、大きな 目、下に 尾びれ、足もとに こおり（ミズ） */
const wakasagin: MonsterDesign = {
  size: 32,
  colors: {
    S: NQ.silver,
    c: NQ.cloud,
    W: NQ.white,
    I: NQ.ice,
    K: NQ.sky,
    A: NQ.azure,
    N: NQ.navy,
    p: NQ.blush,
  },
  rim: { [NQ.silver]: NQ.gray, [NQ.sky]: NQ.azure },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '..........NNNNNN',
        '........NNNNNNNN',
        '.......NNNNNNNNN',
        '......NNNNNNNNNN',
        '......SSSSSSSSSS',
        '.....SSSSSSSSSSS',
        '.....SSSSSSSSSSS',
        '....SSSSSSSSSSSS',
        '....SSSSSSSSSSSS',
        '....SSSSSSSSSSSS',
        '....SSSSSSSSSSSS',
        '....SSSSSSSSSSSS',
        '.....SSSSSSSSSSS',
        '.....SSSSSSSSSSS',
        '......SSSSSSSSSS',
        '......SSSSSSSSSS',
        '.......SSSSSSSSS',
        '.......ccccccccc',
        '........cccccccc',
        '.........ccccccc',
        '..........KKKKKK',
        '.........KKKKKKK',
        '........KKKKKKKK',
        '.......KKKKKKKKK',
        '.......KKKKKKK..',
        '.......KKKK.....',
        '................',
        '.......IIIIIIIII',
      ],
    },
    // よこの ひれ
    { x: 2, y: 15, rows: ['..KK', '.KKK', 'KKKK'] },
    { x: 26, y: 15, rows: ['KK..', 'KKK.', 'KKKK'] },
    // かお
    {
      mirror: true,
      y: 9,
      rows: [
        '..........WW....',
        '..........Wo....',
        '..........Wo....',
        '........pp......',
        '.............ooo',
      ],
    },
    { x: 8, y: 11, rows: ['.W', 'W.'] },
    // こおりの かけら
    { x: 2, y: 4, rows: ['.I.', 'IWI', '.I.'] },
    { x: 27, y: 7, rows: ['.I.', 'IWI', '.I.'] },
  ],
};

/** コオリワカサギ（ワカサギンの しんか）：こおりの よろいを まとった 大きな わかさぎ（ミズ） */
const kooriWakasagi: MonsterDesign = {
  size: 32,
  colors: {
    S: NQ.silver,
    c: NQ.cloud,
    W: NQ.white,
    I: NQ.ice,
    K: NQ.sky,
    A: NQ.azure,
    N: NQ.navy,
    p: NQ.blush,
  },
  rim: { [NQ.silver]: NQ.gray, [NQ.sky]: NQ.azure, [NQ.ice]: NQ.sky },
  layers: [
    // こおりの つの
    { mirror: true, y: 1, rows: ['..........I.....', '.........II.....', '.........II.....'] },
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '.........NNNNNNN',
        '.......NNNNNNNNN',
        '......NNNNNNNNNN',
        '.....NNNNNNNNNNN',
        '.....SSSSSSSSSSS',
        '....SSSSSSSSSSSS',
        '....SSSSSSSSSSSS',
        '...SSSSSSSSSSSSS',
        '...SSSSSSSSSSSSS',
        '...SSSSSSSSSSSSS',
        '...SSSSSSSSSSSSS',
        '...SSSSSSSSSSSSS',
        '...SSSSSSSSSSSSS',
        '....SSSSSSSSSSSS',
        '....SSSSSSSSSSSS',
        '.....SSSSSSSSSSS',
        '.....ccccccccccc',
        '......cccccccccc',
        '.......ccccccccc',
        '........KKKKKKKK',
        '.......KKKKKKKKK',
        '......KKKKKKKKKK',
        '.....KKKKKKKKKKK',
        '.....KKKKKKKKKK.',
        '.....KKKKKKKK...',
        '.....KKKKK......',
        '................',
        '....IIIIIIIIIIII',
        '....IIIIIIIIIIII',
      ],
    },
    // 大きな よこひれ
    { x: 1, y: 14, rows: ['...KK', '..KKK', '.KKKK', 'KKKKK'] },
    { x: 26, y: 14, rows: ['KK...', 'KKK..', 'KKKK.', 'KKKKK'] },
    // かお（きりっと）
    {
      mirror: true,
      y: 8,
      rows: [
        '.........o......',
        '..........oo....',
        '..........WW....',
        '..........Wo....',
        '..........Wo....',
        '............oooo',
      ],
    },
    { x: 6, y: 10, rows: ['.W', 'W.'] },
    { x: 1, y: 6, rows: ['.I.', 'IWI', '.I.'] },
    { x: 28, y: 10, rows: ['.I.', 'IWI', '.I.'] },
  ],
};

// ───────────────────────── しんか ─────────────────────────

/** ユケムリオヤブン：ユケムリザルの しんか。大きな かた、タオルの はちまき、うでを くんで どっしり、もくもくの ゆげ（ミズ） */
const yukemuriOyabun: MonsterDesign = {
  size: 32,
  colors: {
    F: NQ.silver,
    R: NQ.blush,
    b: NQ.berry,
    W: NQ.white,
    S: NQ.sky,
    A: NQ.azure,
    I: NQ.ice,
  },
  rim: { [NQ.silver]: NQ.gray, [NQ.sky]: NQ.azure },
  layers: [
    // もくもくの ゆげ
    { x: 1, y: 2, rows: ['.WW.', 'WWWW', '.WW.', '..W.', '.W..'] },
    { x: 26, y: 4, rows: ['.WW.', 'WWWW', '.WW.', '.W..'] },
    // 大きな かたと 頭
    {
      rows: blob(
        32,
        31,
        [
          [16, 11, 7.5, 6.5],
          [16, 21, 12.5, 6],
        ],
        'F',
      ),
    },
    { mirror: true, x: 7, y: 9, rows: ['.R', 'RR', '.R'] },
    { rows: blob(32, 31, [[16, 12, 5, 4.5]], 'R') },
    // タオルの はちまき（むすび目は 左に）
    { x: 9, y: 5, rows: ['WWWWWWWWWWWWWW', 'SSSSSSSSSSSSSS'] },
    { x: 5, y: 4, rows: ['.WW.', 'WWWW', '..SW'] },
    // くんだ うで
    { x: 8, y: 19, rows: ['.FFFFFFFFFFFFFF.', 'FFFFFFFFFFFFFFFF', 'RRRFFFFFFFFFFRRR', '.FFFFFFFFFFFFFF.'] },
    // お湯
    { rows: blob(32, 31, [[16, 27, 14.5, 3.8]], (x, y) => ((x + y * 3) % 7 === 0 ? 'I' : 'S')) },
    // まゆ・目・鼻・口
    { mirror: true, x: 11, y: 9, rows: ['ooo.', '...o'] },
    { mirror: true, x: 12, y: 11, rows: ['WW', 'Wo', 'Wo'] },
    { mirror: true, x: 15, y: 14, rows: ['o'] },
    { mirror: true, x: 13, y: 15, rows: ['ooo'] },
    { mirror: true, x: 11, y: 14, rows: ['b'] },
  ],
};

/** レタスザムライ：レタスケの しんか。葉の まげ、葉の かたぎぬ、きりっと した まゆ、葉の うちわ（モリ） */
const retasuZamurai: MonsterDesign = {
  size: 32,
  colors: { M: NQ.lime, L: NQ.leaf, s: NQ.sprout, g: NQ.green, W: NQ.white, p: NQ.blush },
  rim: { [NQ.lime]: NQ.leaf, [NQ.leaf]: NQ.green },
  rimDepth: 2,
  layers: [
    // 葉の かたぎぬ（両かたに はる）
    {
      mirror: true,
      x: 1,
      y: 12,
      rows: ['LLLLLLL', 'LsLLLLL', '.LsLLLL', '.LLsLLL', '..LLLLL', '...LLLL'],
    },
    // 葉の まげ
    { x: 13, y: 1, rows: ['.LLLL.', 'LMMMML', '.LMML.', '..gg..', '..gg..'] },
    { rows: lettuce(32, 31, [16, 16.5, 11, 10.5], (x, y) => x >= 9 && x <= 22 && y >= 11 && y <= 20) },
    // 足
    { mirror: true, x: 11, y: 26, rows: ['ggg', 'ggg', 'ggg', 'LLL'] },
    // まゆ・目・ほっぺ・口
    { mirror: true, x: 10, y: 11, rows: ['ooo.', '...o'] },
    { mirror: true, x: 11, y: 13, rows: ['WW', 'Wo', 'Wo'] },
    { mirror: true, x: 9, y: 16, rows: ['pp'] },
    { mirror: true, x: 13, y: 17, rows: ['ooo'] },
  ],
};

/** オオモリソバ：ザルソバンの しんか。大きな そばちょこに ひろい ざる、その 上に そばの たばを 3 だんに つんだ 大もり、そばの 白い 花、はしで そばを もちあげる（ツチ） */
const OOMORI_HASHI = ['H.H', 'H.H', 'H.H', 'H.H', 'H.H', 'HEH', 'HbH', '.E.', '.b.', '.E.'];
const oomoriSoba: MonsterDesign = {
  size: 32,
  colors: sobaColors,
  rim: sobaRim,
  layers: [
    {
      mirror: true,
      y: 14,
      rows: [
        '.....WWWWWWWWWWW',
        '....WWWWWWWWWWWW',
        '....WBWWBWWBWWBW',
        '....WWWWWWWWWWWW',
        '....AAAAAAAAAAAA',
        '....AAAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '......AAAAAAAAAA',
        '......WWWWWWWWWW',
        '......WBWWBWWBWW',
        '.......WWWWWWWWW',
        '........BBBBBBBB',
        '........BBBBBBBB',
      ],
    },
    // たれる そば
    { mirror: true, x: 2, y: 12, rows: ['Eb', 'bE', 'Eb', 'bE', 'E.', 'b.'] },
    // ひろい ざる
    { rows: blob(32, 31, [[16, 12.5, 14.5, 2.8]], zaruWeave) },
    // 3 だんに つんだ 大もりの そば
    {
      rows: blob(
        32,
        31,
        [
          [16, 9.5, 9.5, 2.5],
          [16, 6.3, 6.5, 2.2],
          [16, 3.5, 3.5, 1.8],
        ],
        sobaStrand,
      ),
    },
    // のり・そばの 花
    { x: 10, y: 7, rows: ['KK', '.K'] },
    { x: 19, y: 5, rows: ['KK'] },
    { x: 14, y: 1, rows: ['W.gW'] },
    // はし（右手）で もちあげた そば
    { x: 25, y: 1, rows: ring(OOMORI_HASHI) },
    { x: 26, y: 2, rows: OOMORI_HASHI },
    // まゆ・目・ほっぺ・口
    { mirror: true, x: 10, y: 17, rows: ['ooo.', '...o'] },
    { mirror: true, x: 11, y: 19, rows: ['WW', 'Wo', 'Wo'] },
    { mirror: true, x: 9, y: 22, rows: ['pp'] },
    { mirror: true, x: 13, y: 22, rows: ['ooo', '.oo'] },
  ],
};

// ───────────────────────── 中ボス ─────────────────────────

/**
 * カラスジョウ（中ボス）：松本城の 黒い 天守が 動きだした。黒い 板の かべと 白い しっくい、金の しゃちほこの つの、
 * 黒い 板の 顔に 金に 光る つり目、しっくいの 口に きば、左右に カラスの 黒い つばさ、石垣の 足（ヤミ → ツチ）
 */
const karasuColors = {
  K: NQ.night,
  k: NQ.hairBlack,
  P: NQ.paper,
  N: NQ.slate,
  S: NQ.silver,
  n: NQ.gray,
  V: NQ.violet,
  G: NQ.gold,
  Y: NQ.yellow,
  R: NQ.red,
  W: NQ.white,
};
const karasuJo: MonsterDesign = {
  size: 40,
  colors: karasuColors,
  rim: { [NQ.silver]: NQ.gray, [NQ.paper]: NQ.cloud, [NQ.slate]: NQ.night },
  rimDepth: 2,
  layers: [
    // カラスの つばさ
    {
      mirror: true,
      y: 4,
      rows: [
        '.K..................',
        '.KK.................',
        '.KKK................',
        '.KKKK...............',
        '.KKKKK..............',
        '.KKVKKK.............',
        '.KKKVKKK............',
        '.KKKKVKKK...........',
        '.KKVKKVKKK..........',
        '.KKKVKKVKKK.........',
        '.KKKKVKKVKKK........',
        '.K.KKKVKKVKK........',
        '.K.KKKKVKKVK........',
        '...K.KKKKKKK........',
        '...K.K.KKKKK........',
        '.....K.K.KKK........',
        '.......K..KK........',
        '..........K.........',
      ],
    },
    {
      mirror: true,
      rows: [
        '....................',
        '...........G........',
        '...........GG.......',
        '............GG......',
        '............GGG.....',
        '.............GG.NNNN',
        '..............NNNNNN',
        '.............NNNNNNN',
        '...........NNNNNNNNN',
        '..........NNNNNNNNNN',
        '............KKKKKKKK',
        '............KKKKKKKK',
        '............KKKKKKKK',
        '............KKKKKKKK',
        '............KKKKKKKK',
        '............PPPPPPPP',
        '............PPPPPPPP',
        '............PPPPPPPP',
        '.........NNNNNNNNNNN',
        '........NNNNNNNNNNNN',
        '.......NNNNNNNNNNNNN',
        '..........KKKKKKKKKK',
        '..........KkKKKkKKKK',
        '..........KKKKKKKKKK',
        '..........PPPPPPPPPP',
        '.........NNNNNNNNNNN',
        '........NNNNNNNNNNNN',
        '.........KKKKKKKKKKK',
        '.........KkKKKkKKKkK',
        '.........KKKKKKKKKKK',
        '........SSSSSSSSSSSS',
        '........SnSSSnSSSSnS',
        '.......SSSSSSSSSSSSS',
        '.......SSSnSSSSnSSSS',
        '......SSSSSSSSSSSSSS',
        '......SSnSSSSSnSSSSS',
        '.....SSSSSSSSSSSSSSS',
        '.....SSSSnSSSSSnSSSS',
      ],
    },
    // 屋根の まん中の 赤い 宝石
    { mirror: true, x: 18, y: 7, rows: ['GG', 'GR', '.G'] },
    // 金に 光る つり目
    {
      mirror: true,
      y: 10,
      rows: [
        '...........ooo......',
        '............ooooo...',
        '............GGGoooo.',
        '............GYYYGGo.',
        '.............GGGGG..',
        '..............GG....',
      ],
    },
    // しっくいの 口と きば
    { mirror: true, y: 16, rows: ['.............ooooooo', '.............oWoWWoW', '..............oWooWo'] },
  ],
};

/** カラスジョウ（フィールドに 立つ 32×32） */
const karasuJoField: MonsterDesign = {
  size: 32,
  colors: karasuColors,
  rim: { [NQ.silver]: NQ.gray, [NQ.slate]: NQ.night },
  layers: [
    {
      mirror: true,
      y: 4,
      rows: [
        '.K..............',
        '.KK.............',
        '.KKK............',
        '.KKVK...........',
        '.KKKVK..........',
        '.KKVKVK.........',
        '.KKKVKVK........',
        '.K.KKVKVK.......',
        '...K.KKKK.......',
        '...K.K.KK.......',
        '.....K..K.......',
      ],
    },
    {
      mirror: true,
      y: 1,
      rows: [
        '.........G......',
        '.........GG.....',
        '..........GG....',
        '...........G.NNN',
        '...........NNNNN',
        '.........NNNNNNN',
        '........NNNNNNNN',
        '.........KKKKKKK',
        '.........KKKKKKK',
        '.........KKKKKKK',
        '.........PPPPPPP',
        '.........PPPPPPP',
        '.......NNNNNNNNN',
        '......NNNNNNNNNN',
        '........KKKKKKKK',
        '........KkKKkKKK',
        '........PPPPPPPP',
        '.......NNNNNNNNN',
        '........KKKKKKKK',
        '........KkKKkKKk',
        '.......SSSSSSSSS',
        '.......SnSSSnSSS',
        '......SSSSSSSSSS',
        '......SSnSSSSnSS',
        '.....SSSSSSSSSSS',
        '.....SSSnSSSSnSS',
        '.....SSSSSSSSSSS',
        '.....nnnnnnnnnnn',
      ],
    },
    { mirror: true, x: 14, y: 6, rows: ['GG', 'GR'] },
    {
      mirror: true,
      y: 8,
      rows: ['.........oo.....', '..........ooo...', '..........GYGo..', '...........GG...'],
    },
    { mirror: true, y: 11, rows: ['...........ooooo', '...........oWoWW'] },
  ],
};

// ───────────────────────── 県ボス ─────────────────────────

/**
 * 羽根：根もと (bx, by) から 角度 deg（真上 0、左が −）へ 長さ len・はば wid。先は とがる。
 * 下がわの ふちを かげ C に して、となりの 羽根と わける
 */
function feather(
  w: number,
  h: number,
  [bx, by, deg, len]: readonly [number, number, number, number],
  wid: number,
): string[] {
  const a = (deg * Math.PI) / 180;
  const ux = Math.sin(a);
  const uy = -Math.cos(a);
  const half = wid / 2;
  const tip = len - half * 2;
  return Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) => {
      if (x < 1 || y < 1) return '.';
      const dx = x + 0.5 - bx;
      const dy = y + 0.5 - by;
      const t = dx * ux + dy * uy;
      const s = dx * -uy + dy * ux;
      const lim = t > tip ? half * (1 - (t - tip) / (len - tip)) : half;
      if (t < 0 || t > len || Math.abs(s) > lim) return '.';
      return s < -half / 3 ? 'C' : 'W';
    }).join(''),
  );
}

/** ライチョウの 頭と からだ（左半分。とがった 冠羽、白い 羽の むね、羽毛の 足） */
const RAICHO = [
  '........................',
  '........................',
  '........................',
  '....................W...',
  '..................W.WW.W',
  '.................WWWWWWW',
  '................WWWWWWWW',
  '...............WWWWWWWWW',
  '..............WWWWWWWWWW',
  '.............WWWWWWWWWWW',
  '.............WWWWWWWWWWW',
  '.............WWWWWWWWWWW',
  '.............WWWWWWWWWWW',
  '.............WWWWWWWWWWW',
  '..............WWWWWWWWWW',
  '..............WWWWWWWWWW',
  '...............WWWWWWWWW',
  '..............WWWWWWWWWW',
  '............WWWWWWWWWWWW',
  '...........WWWWWWWWWWWWW',
  '..........WWWWWWWWWWWWWW',
  '..........WWWWCWWWWWWWWW',
  '..........WWWWWCCWWWWWWW',
  '..........WWWWWWWCCWWWWC',
  '...........WWWWWWWWCCWCC',
  '...........WWWCWWWWWWCWW',
  '...........WWWWCCWWWWWWW',
  '............WWWWWCCWWWWC',
  '............WWWWWWWCCWCC',
  '.............WWWWWWWWCWW',
  '.............WWWWWWWWWWW',
  '..............WWWWWWWWWW',
  '...............WWWWWWWWW',
  '................WWWWWWWW',
  '................WWWWWWWW',
];
/** 大きく ふりあげた つばさ（5 まいの 羽根を 上へ おうぎの ように ひろげる。左半分） */
const RAICHO_WING = (
  [
    [15, 22, -4, 16, 4.6],
    [14, 22, -20, 22, 5],
    [14, 22, -37, 19, 5],
    [14, 23, -54, 14, 4.8],
    [14, 25, -72, 11, 4.4],
  ] as const
).map(([bx, by, deg, len, wid]) => feather(24, 48, [bx, by, deg, len], wid));
/** 部品の まわりの 輪郭（ring を 24×48 の 左半分に おさめる） */
const edge = (rows: readonly string[]) =>
  ring(rows)
    .slice(1, 49)
    .map((r) => r.slice(1, 25));
/** 羽毛で おおわれた 足と 金の つめ */
const RAICHO_FOOT = [
  '..WWWW..',
  '.WWCWW..',
  '.WWWWW..',
  '.WCWWC..',
  '.WWWWW..',
  'WWCWWW..',
  'WWWWWW..',
  'GWGWGWG.',
  'G.G.G.G.',
];
/** いなずま */
const BOLT = ['....YY', '...YY.', '..YY..', '.YYYYY', '...YY.', '..YY..', '.YY...', 'YY....', 'Y.....'];

/** イナズマライチョウ（県ボス）：北アルプスの ライチョウの 王。まっ白な つばさを 頭の 上へ ふりあげ、赤い とさかの 怒りまゆ、黒い 目の すじの 中で 光る 目、かぎの くちばし、金の つめ、まわりに いなずま（カゼ） */
const raichoColors = {
  W: NQ.white,
  C: NQ.silver,
  N: NQ.night,
  s: NQ.slate,
  R: NQ.red,
  G: NQ.gold,
  Q: NQ.ochre,
  Y: NQ.yellow,
  e: NQ.white,
};
const inazumaRaicho: MonsterDesign = {
  size: 48,
  colors: raichoColors,
  rim: { [NQ.white]: NQ.cloud, [NQ.silver]: NQ.slate, [NQ.yellow]: NQ.ochre },
  rimDepth: 2,
  layers: [
    // ふりあげた つばさ・からだ・羽毛の 足
    ...RAICHO_WING.flatMap((rows) => [
      { mirror: true, rows: edge(rows) },
      { mirror: true, rows },
    ]),
    { mirror: true, rows: RAICHO },
    { mirror: true, x: 14, y: 37, rows: RAICHO_FOOT },
    // 赤い とさか（怒りまゆ）と 黒い 目の すじ・光る 目
    {
      mirror: true,
      y: 8,
      rows: [
        '.............RR.........',
        '.............RRRRR......',
        '..............RRRRRRR...',
        '.............NNNNNNNNN..',
        '.............NYYYNNNNN..',
        '.............NYeeYYYN...',
        '..............NYYYYYN...',
        '...............NNNNN....',
      ],
    },
    // かぎの くちばし
    {
      mirror: true,
      y: 11,
      rows: [
        '....................NNNN',
        '...................NssNN',
        '...................NsNNN',
        '....................NNNN',
        '.....................NNN',
        '.....................NNN',
        '......................NN',
        '.......................N',
      ],
    },
    // いなずま（足もと）
    { mirror: true, x: 1, y: 34, rows: ring(BOLT) },
    { mirror: true, x: 2, y: 35, rows: BOLT },
  ],
};

/** イナズマライチョウ 後半（ヒカリ）：つばさの ふちが 金に 光り、いなずまが 白く 光り、目が 白く 光る。頭の 上にも いなずま */
const inazumaRaichoP0: MonsterDesign = {
  ...inazumaRaicho,
  colors: { ...raichoColors, C: NQ.yellow, e: NQ.cream, Y: NQ.cream, c: NQ.cream },
  rim: { [NQ.white]: NQ.cream, [NQ.cream]: NQ.gold },
  layers: [
    ...inazumaRaicho.layers,
    { mirror: true, x: 13, y: 12, rows: ['.cc', '.ccccc', '..cccc'] },
    { mirror: true, x: 16, y: 0, rows: ring(['.YY', 'YY.', '.YY', 'YY.']) },
    { mirror: true, x: 17, y: 1, rows: ['.YY', 'YY.', '.YY', 'YY.'] },
    { mirror: true, x: 1, y: 44, rows: ['.c.', 'cGc', '.c.'] },
  ],
};

// ───────────────────────── ラスボス ─────────────────────────

/** 六文銭（ろくもんせん。6 まいの 金の ぜに。左半分） */
const ROKUMON = [
  '.GG...G',
  'GooG.Go',
  'GooG.Go',
  '.GG...G',
  '.......',
  '.GG...G',
  'GooG.Go',
  'GooG.Go',
  '.GG...G',
];
/** 鹿の 角の 脇立て */
const SHIKA = [
  '..A.....A....',
  '..A..A..A....',
  '...A.A.A.....',
  '...AAAAA.....',
  '.....AA......',
  '......AA.....',
  '.......AAA...',
  '.........AAAA',
  '...........AA',
];
/** 十文字槍（じゅうもんじやり。立てて もつ） */
const YARI = [
  '..s..',
  '..s..',
  's.s.s',
  'sssss',
  '..s..',
  '..b..',
  ...Array.from({ length: 30 }, () => '..b..'),
];

/** 真田幸村（ラスボス）：赤い よろい（赤備え）、鹿の 角と 六文銭の 前立て、十文字槍を 立てて もつ（ヒノ） */
const sanadaYukimura = lord(
  [
    ...stamp(
      stamp(
        Array.from({ length: 10 }, () => '.'.repeat(24)),
        3,
        0,
        SHIKA,
      ),
      17,
      1,
      ROKUMON,
    ),
    ...HELMET,
    ...FACE,
  ],
  {
    N: NQ.brick,
    L: NQ.red,
    K: NQ.red,
    S: NQ.vermilion,
    G: NQ.gold,
    R: NQ.yellow,
    T: NQ.brick,
    H: NQ.bark,
    A: NQ.tan,
    s: NQ.silver,
    b: NQ.brown,
  },
  { [NQ.red]: NQ.brick, [NQ.vermilion]: NQ.red, [NQ.tan]: NQ.brown },
  [
    { x: 39, y: 3, rows: ring(YARI) },
    { x: 40, y: 4, rows: YARI },
    { x: 39, y: 27, rows: ['FFFF', 'fFFf'] },
  ],
);

export const NAGANO: Readonly<Record<string, MonsterDesign>> = {
  'nagano-yukemuri-zaru': yukemuriZaru,
  'nagano-yukemuri-oyabun': yukemuriOyabun,
  'nagano-retasuke': retasuke,
  'nagano-retasu-zamurai': retasuZamurai,
  'nagano-zaru-soban': zaruSoban,
  'nagano-oomori-soba': oomoriSoba,
  'nagano-wakasagin': wakasagin,
  'nagano-koori-wakasagi': kooriWakasagi,
  'nagano-midboss-karasu-jo': karasuJo,
  'nagano-midboss-karasu-jo.field': karasuJoField,
  'nagano-boss-inazuma-raicho': inazumaRaicho,
  'nagano-boss-inazuma-raicho.p0': inazumaRaichoP0,
  'nagano-lastboss-sanada-yukimura': sanadaYukimura,
};
