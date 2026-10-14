/** 石川県の モンスター（手描き。docs/06 §4・§6.3〜6.5 の 規格） */
import { NQ } from '../palette';
import type { MonsterDesign } from './design';
import { FACE, HELMET, lord } from './lastbosses';

// ───────────────────────── 通常 ─────────────────────────

/** ゴサイボン：九谷焼の つぼ。ふたの ぼうし、赤い 耳、五彩（緑・黄・紫・紺青・赤）の 絵（ツチ） */
const gosaiBon: MonsterDesign = {
  size: 32,
  colors: {
    E: NQ.beige,
    T: NQ.tan,
    G: NQ.green,
    Y: NQ.gold,
    V: NQ.violet,
    N: NQ.navy,
    R: NQ.red,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.beige]: NQ.sand, [NQ.tan]: NQ.brown },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '..............EE',
        '..............EE',
        '.........EEEEEEE',
        '........EEEEEEEE',
        '........RRRRRRRR',
        '..........EEEEEE',
        '.........EEEEEEE',
        '.......EEEEEEEEE',
        '......EEEEEEEEEE',
        '.....EEEEEEEEEEE',
        '.....EEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '.....EEEEEEEEEEE',
        '.....EEEEEEEEEEE',
        '......EEEEEEEEEE',
        '.......EEEEEEEEE',
        '........EEEEEEEE',
        '.........EEEEEEE',
        '.........EEEEEEE',
        '.........TTTTTTT',
        '.........TTTTTTT',
        '................',
      ],
    },
    // 赤い 耳（つぼの とって）
    { mirror: true, y: 12, rows: ['....RR..........', '...RRR..........', '....RR..........'] },
    // 五彩の 絵（下の ほう）
    {
      rows: [
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '.......G..V.....N...G....V......',
        '......GGG.VV...NNN..GGG.VV......',
        '.......G.Y.V....N..Y.G...V......',
        '......Y..YYY.......YYY..Y.......',
        '.......V..Y...G...N..Y..N.......',
        '......VVV....GGG.NNN.......G....',
        '.......V......G...N.......GGG...',
        '..........Y.....................',
      ],
    },
    // かお
    {
      mirror: true,
      y: 13,
      rows: [
        '.........WW.....',
        '.........Wo.....',
        '.........Wo.....',
        '.......pp....o..',
        '..............oo',
      ],
    },
    // つや（左上）
    { x: 8, y: 11, rows: ['.W', 'W.'] },
  ],
};

/** キンパクチョウ：金沢の 金箔の はねを もつ チョウ。頭の 上に 金の わ（ヒカリ） */
const kinpakuCho: MonsterDesign = {
  size: 32,
  colors: {
    Y: NQ.gold,
    C: NQ.cream,
    Q: NQ.ochre,
    W: NQ.white,
    K: NQ.bark,
    p: NQ.blush,
  },
  rim: { [NQ.gold]: NQ.ochre },
  layers: [
    // はね（上）
    {
      mirror: true,
      y: 6,
      rows: [
        '..YYY...........',
        '.YYYYYY.........',
        '.YCYYYYYY.......',
        '.CCYYYYYYY......',
        '.YCYYYYQYYY.....',
        '.YYYYYYQYYY.....',
        '.YYYYYYQYYY.....',
        '..YYYYYYYYY.....',
      ],
    },
    // はね（下）
    {
      mirror: true,
      y: 15,
      rows: [
        '...YYYYYYYY.....',
        '..YYYYYYYYY.....',
        '..YCYYYQYYY.....',
        '...YYYYQYYY.....',
        '....YYYYYY......',
        '.....YYYY.......',
      ],
    },
    // からだ・しょっ角・金の わ
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '..........YYYYYY',
        '.........Y......',
        '..........QQQQQQ',
        '.............K..',
        '..............KK',
        '.............KKK',
        '.............KKK',
        '.............KKK',
        '.............KKK',
        '.............KKK',
        '.............KKK',
        '.............KKK',
        '.............KKK',
        '.............KKK',
        '.............KKK',
        '..............KK',
        '..............KK',
        '..............KK',
        '..............KK',
        '..............KK',
        '..............KK',
        '..............KK',
        '..............KK',
        '..............KK',
        '..............KK',
        '..............KK',
        '..............KK',
        '...............K',
      ],
    },
    // しょっ角
    { x: 11, y: 5, rows: ['K...', '.K..', '..KK'] },
    { x: 18, y: 5, rows: ['...K', '..K.', 'KK..'] },
    // かお
    { mirror: true, y: 8, rows: ['.............WW.', '.............Wo.', '...........pp...'] },
  ],
};

/** ハマシオン：珠洲の 浜の 塩の 山。まわりに 海の しずく、頭に 塩の つぶ（ミズ） */
const hamashion: MonsterDesign = {
  size: 32,
  colors: {
    W: NQ.white,
    c: NQ.cloud,
    I: NQ.ice,
    S: NQ.sky,
    A: NQ.azure,
    T: NQ.tan,
    B: NQ.brown,
    p: NQ.blush,
  },
  rim: { [NQ.white]: NQ.cloud, [NQ.tan]: NQ.brown },
  layers: [
    // 塩の つぶ（頭の 上）
    { x: 13, y: 3, rows: ['.II.', 'IWWI', 'IWWI', '.II.'] },
    { x: 9, y: 6, rows: ['II', 'II'] },
    { x: 21, y: 6, rows: ['II', 'II'] },
    // 塩の 山
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '..............WW',
        '.............WWW',
        '............WWWW',
        '...........WWWWW',
        '..........WWWWWW',
        '.........WWWWWWW',
        '........WWWWWWWW',
        '........WWWWWWWW',
        '.......WWWWWWWWW',
        '......WWWWWWWWWW',
        '.....WWWWWWWWWWW',
        '.....WWWWWWWWWWW',
        '....WWWWWWWWWWWW',
        '...WWWWWWWWWWWWW',
        '...WWWWWWWWWWWWW',
        '..WWWWWWWWWWWWWW',
        '..WWWWWWWWWWWWWW',
        '.WWWWWWWWWWWWWWW',
        '.WWWWWWWWWWWWWWW',
        '.WWWWWWWWWWWWWWW',
        '.WWWWWWWWWWWWWWW',
        '.SSSSSSSSSSSSSSS',
        '..AAAAAAAAAAAAAA',
      ],
    },
    // 波の おび
    { mirror: true, y: 21, rows: ['...SISISISISISIS', '....ISISISISISIS'] },
    // かお
    {
      mirror: true,
      y: 14,
      rows: [
        '..........WW....',
        '..........oo....',
        '..........oo....',
        '........pp......',
        '..............oo',
      ],
    },
    // 海の しずく
    { x: 2, y: 12, rows: ['.I.', 'ISI', '.I.'] },
    { x: 27, y: 15, rows: ['.I.', 'ISI', '.I.'] },
    // おけ（右手）
    { x: 24, y: 22, rows: ['TBTBT', 'TTTTT', 'TBTBT', '.TTT.'] },
  ],
};

/** ワジマヌリン：輪島塗の 赤い おわん。黒い 高台の 足、金の ふちと まき絵（ヒノ） */
const wajimanurin: MonsterDesign = {
  size: 32,
  colors: {
    R: NQ.red,
    b: NQ.brick,
    A: NQ.apricot,
    K: NQ.bark,
    N: NQ.night,
    Y: NQ.gold,
    Q: NQ.ochre,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.red]: NQ.brick, [NQ.bark]: NQ.ink },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '....YYYYYYYYYYYY',
        '...YYYYYYYYYYYYY',
        '...RRRRRRRRRRRRR',
        '...RRRRRRRRRRRRR',
        '...RRRRRRRRRRRRR',
        '...RRRRRRRRRRRRR',
        '....RRRRRRRRRRRR',
        '....RRRRRRRRRRRR',
        '.....RRRRRRRRRRR',
        '.....RRRRRRRRRRR',
        '......RRRRRRRRRR',
        '......RRRRRRRRRR',
        '.......RRRRRRRRR',
        '.......RRRRRRRRR',
        '........RRRRRRRR',
        '.........RRRRRRR',
        '..........RRRRRR',
        '..........KKKKKK',
        '..........KKKKKK',
        '..........KKKKKK',
        '..........KKKKKK',
        '.........KKKKKKK',
        '.........KKKKKKK',
        '........KKKKKKKK',
        '........KKKKKKKK',
        '........NNNNNNNN',
      ],
    },
    // 金の まき絵
    { x: 5, y: 12, rows: ['Y.Y', '.Y.', 'Y.Y'] },
    { x: 22, y: 14, rows: ['.Y.', 'Y.Y', '.Y.'] },
    // 小さな 手
    { x: 2, y: 16, rows: ['RR', 'RR'] },
    { x: 28, y: 16, rows: ['RR', 'RR'] },
    // かお
    {
      mirror: true,
      y: 12,
      rows: [
        '..........WW....',
        '..........Wo....',
        '..........Wo....',
        '........pp......',
        '.............ooo',
      ],
    },
    { x: 6, y: 9, rows: ['.A', 'A.'] },
  ],
};

/** カガヌリマル（ワジマヌリンの しんか）：金の まき絵を まとった うるしの むしゃ。ふたの かぶと（ヒノ） */
const kagaNurimaru: MonsterDesign = {
  size: 32,
  colors: {
    R: NQ.red,
    b: NQ.brick,
    A: NQ.apricot,
    K: NQ.bark,
    N: NQ.night,
    Y: NQ.gold,
    Q: NQ.ochre,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.red]: NQ.brick, [NQ.bark]: NQ.ink },
  layers: [
    // ふたの かぶと
    {
      mirror: true,
      y: 1,
      rows: [
        '.........Y..Y...',
        '.........YYYY...',
        '......KKKKKKKKKK',
        '.....KKKKKKKKKKK',
        '.....YYYYYYYYYYY',
      ],
    },
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '...YYYYYYYYYYYYY',
        '..YYYYYYYYYYYYYY',
        '..RRRRRRRRRRRRRR',
        '..RRRRRRRRRRRRRR',
        '..RRRRRRRRRRRRRR',
        '..RRRRRRRRRRRRRR',
        '...RRRRRRRRRRRRR',
        '...RRRRRRRRRRRRR',
        '....RRRRRRRRRRRR',
        '....RRRRRRRRRRRR',
        '.....RRRRRRRRRRR',
        '.....RRRRRRRRRRR',
        '......RRRRRRRRRR',
        '......RRRRRRRRRR',
        '.......RRRRRRRRR',
        '........RRRRRRRR',
        '.........RRRRRRR',
        '.........KKKKKKK',
        '.........KKKKKKK',
        '.........KKKKKKK',
        '........KKKKKKKK',
        '........KKKKKKKK',
        '.......KKKKKKKKK',
        '.......KKKKKKKKK',
        '.......NNNNNNNNN',
      ],
    },
    // 金の まき絵（ちらし）
    { x: 3, y: 14, rows: ['Y.Y', '.Y.', 'Y.Y'] },
    { x: 24, y: 12, rows: ['.Y.', 'Y.Y', '.Y.'] },
    { x: 14, y: 22, rows: ['Y.Y', '.Y.'] },
    // うで（こぶしを かまえる）
    { x: 1, y: 15, rows: ['RRR', 'RRR', '.bb'] },
    { x: 28, y: 15, rows: ['RRR', 'RRR', 'bb.'] },
    // かお（きりっと）
    {
      mirror: true,
      y: 11,
      rows: [
        '.........o......',
        '..........oo....',
        '..........WW....',
        '..........Wo....',
        '..........Wo....',
        '........pp......',
        '............oooo',
      ],
    },
    { x: 4, y: 10, rows: ['.A', 'A.'] },
  ],
};

// ───────────────────────── しんか ─────────────────────────

/** ゴサイムシャ（ゴサイボンの しんか）：九谷焼の 大ざらを たてに した むしゃ。ふたの かぶと、絵つけの 筆（ツチ） */
const gosaiMusha: MonsterDesign = {
  size: 32,
  colors: {
    E: NQ.beige,
    T: NQ.tan,
    G: NQ.green,
    Y: NQ.gold,
    V: NQ.violet,
    R: NQ.red,
    W: NQ.white,
    p: NQ.blush,
    K: NQ.bark,
  },
  rim: { [NQ.beige]: NQ.sand, [NQ.tan]: NQ.brown },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '..............EE',
        '..............EE',
        '.......EEEEEEEEE',
        '......EEEEEEEEEE',
        '......RRRRRRRRRR',
        '........EEEEEEEE',
        '.......EEEEEEEEE',
        '......EEEEEEEEEE',
        '.....EEEEEEEEEEE',
        '.....EEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '....EEEEEEEEEEEE',
        '.....EEEEEEEEEEE',
        '.....EEEEEEEEEEE',
        '......EEEEEEEEEE',
        '.......EEEEEEEEE',
        '........EEEEEEEE',
        '........EEEEEEEE',
        '........TTTTTTTT',
        '........TTTTTTTT',
        '.........TTTTTTT',
        '................',
      ],
    },
    // 大ざらの たて（左手）
    {
      x: 1,
      y: 13,
      rows: ['..EEEE..', '.EEEEEE.', 'EEVEEGEE', 'EEEYYEEE', 'EEGEEVEE', 'EEEEEEEE', '.EEVEEE.', '..EEEE..'],
    },
    // 絵つけの 筆（右手）
    { x: 26, y: 8, rows: ['.WW', '.WW', '.KK', '.KK', '.KK', '.KK', '.KK', 'RKK', '.KK'] },
    // 五彩の 絵
    {
      rows: [
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '..............V...G....V........',
        '.............VVV..GGG.VV........',
        '..............V..Y.G...V........',
        '.................YYY..Y.........',
        '..............G...V..Y..........',
        '.............GGG.VVV............',
        '..............G...V.............',
      ],
    },
    // かお（きりっと）
    {
      mirror: true,
      y: 11,
      rows: [
        '........o.......',
        '.........oo.....',
        '.........WW.....',
        '.........Wo.....',
        '.........Wo.....',
        '.......pp.......',
        '..............oo',
      ],
    },
    { x: 8, y: 9, rows: ['.W', 'W.'] },
  ],
};

/** キンランアゲハ（キンパクチョウの しんか）：大きな 金色の アゲハ。はねの 先が 長く のび、金の わが 大きい（ヒカリ） */
const kinranAgeha: MonsterDesign = {
  size: 32,
  colors: {
    Y: NQ.gold,
    C: NQ.cream,
    Q: NQ.ochre,
    W: NQ.white,
    K: NQ.bark,
    p: NQ.blush,
  },
  rim: { [NQ.gold]: NQ.ochre },
  layers: [
    // はね（上。大きく ひろげる）
    {
      mirror: true,
      y: 4,
      rows: [
        '.YY.............',
        '.YYYY...........',
        '.CYYYYY.........',
        '.CCYYYYYY.......',
        '.CCYYYYYYYY.....',
        '.YCYYYYQYYYY....',
        '.YYYYYYQYYYY....',
        '.YYYYYYQYYYY....',
        '.YYYYYYQYYYY....',
        '..YYYYYYYYYY....',
      ],
    },
    // はね（下。先が しっぽの ように のびる）
    {
      mirror: true,
      y: 14,
      rows: [
        '...YYYYYYYYY....',
        '..YYYYYYYYYY....',
        '..YCYYYQYYYY....',
        '..YYYYYQYYYY....',
        '...YYYYYYYYY....',
        '....YYYYYYYY....',
        '.....YYYYYYY....',
        '......YYYYYY....',
        '.....YYYYYY.....',
        '....YY..YY......',
        '...YY....Y......',
        '..YY............',
      ],
    },
    // からだ・しょっ角・金の わ
    {
      mirror: true,
      rows: [
        '................',
        '.........YYYYYYY',
        '........Y.......',
        '.........QQQQQQQ',
        '............K...',
        '.............KK.',
        '............KKK.',
        '............KKK.',
        '............KKK.',
        '............KKK.',
        '............KKK.',
        '............KKK.',
        '............KKK.',
        '............KKK.',
        '............KKK.',
        '............KKK.',
        '............KKK.',
        '............KKK.',
        '.............KK.',
        '.............KK.',
        '.............KK.',
        '.............KK.',
        '.............KK.',
        '.............KK.',
        '.............KK.',
        '.............KK.',
        '.............KK.',
        '.............KK.',
        '.............KK.',
        '.............KK.',
        '..............K.',
      ],
    },
    { x: 10, y: 4, rows: ['K...', '.K..', '..KK'] },
    { x: 19, y: 4, rows: ['...K', '..K.', 'KK..'] },
    // かお（きりっと）
    {
      mirror: true,
      y: 7,
      rows: ['...........oo...', '............WW..', '............Wo..', '..........pp....'],
    },
    // きらり
    { x: 1, y: 2, rows: ['.C.', 'CWC', '.C.'] },
    { x: 28, y: 20, rows: ['.C.', 'CWC', '.C.'] },
  ],
};

/** オオハマシオン（ハマシオンの しんか）：大きな 塩の 山。かたに 塩の つぶ、足もとに 海の 水（ミズ） */
const ooHamashion: MonsterDesign = {
  size: 32,
  colors: {
    W: NQ.white,
    c: NQ.cloud,
    I: NQ.ice,
    S: NQ.sky,
    A: NQ.azure,
    T: NQ.tan,
    B: NQ.brown,
    p: NQ.blush,
  },
  rim: { [NQ.white]: NQ.cloud, [NQ.tan]: NQ.brown },
  layers: [
    // 塩の つぶ（頭と かた）
    { x: 12, y: 1, rows: ['.IIII.', 'IWWWWI', 'IWWWWI', '.IIII.'] },
    { x: 5, y: 8, rows: ['.II.', 'IWWI', '.II.'] },
    { x: 23, y: 8, rows: ['.II.', 'IWWI', '.II.'] },
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '..............WW',
        '.............WWW',
        '............WWWW',
        '...........WWWWW',
        '..........WWWWWW',
        '..........WWWWWW',
        '.........WWWWWWW',
        '........WWWWWWWW',
        '.......WWWWWWWWW',
        '.......WWWWWWWWW',
        '......WWWWWWWWWW',
        '.....WWWWWWWWWWW',
        '.....WWWWWWWWWWW',
        '....WWWWWWWWWWWW',
        '....WWWWWWWWWWWW',
        '...WWWWWWWWWWWWW',
        '...WWWWWWWWWWWWW',
        '..WWWWWWWWWWWWWW',
        '..WWWWWWWWWWWWWW',
        '.WWWWWWWWWWWWWWW',
        '.WWWWWWWWWWWWWWW',
        '.WWWWWWWWWWWWWWW',
        '.WWWWWWWWWWWWWWW',
        '.WWWWWWWWWWWWWWW',
        '.SSSSSSSSSSSSSSS',
        '..AAAAAAAAAAAAAA',
      ],
    },
    // 波の おび
    { mirror: true, y: 20, rows: ['..SISISISISISISI', '...ISISISISISISI'] },
    // かお（きりっと）
    {
      mirror: true,
      y: 11,
      rows: [
        '........o.......',
        '.........oo.....',
        '.........oo.....',
        '.........oo.....',
        '.......pp.......',
        '..............oo',
      ],
    },
    // おけ（右手）と しずく
    { x: 23, y: 19, rows: ['TBTBTB', 'TTTTTT', 'TBTBTB', '.TTTT.'] },
    { x: 1, y: 12, rows: ['.I.', 'ISI', '.I.'] },
    { x: 2, y: 22, rows: ['I.'] },
  ],
};

// ───────────────────────── 中ボス ─────────────────────────

/** (x, y) → 文字 の 関数で 文字の 地図を 作る（'.' は とうめい） */
const plot = (w: number, h: number, f: (x: number, y: number) => string): string[] =>
  Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => f(x, y)).join(''));

const kirikoColors = {
  C: NQ.cream,
  Y: NQ.gold,
  Q: NQ.ochre,
  R: NQ.red,
  b: NQ.brick,
  K: NQ.bark,
  T: NQ.tan,
  W: NQ.white,
  V: NQ.vermilion,
  A: NQ.apricot,
  N: NQ.night,
};

/**
 * キリコダイショウ（中ボス）：能登の キリコ祭りの 大きな あかりが 武者に なった すがた。そりあがった 赤い 屋根は かぶとの ひさし、
 * 金の くわがた（つの）に 赤い 玉。あかりの 顔は くらい かげに つりあがった 金の 目と きばの 口、金の 肩あてに かつぎ棒の うで、
 * ふんばる 足。まわりで ほのおが もえあがる（ヒノ）
 */
const kirikoTaisho: MonsterDesign = {
  size: 40,
  colors: kirikoColors,
  rim: { [NQ.cream]: NQ.ochre, [NQ.red]: NQ.brick, [NQ.tan]: NQ.brown, [NQ.gold]: NQ.ochre },
  rimDepth: 2,
  layers: [
    // うしろで もえあがる ほのお（左右で すこし ちがう）
    { x: 1, y: 3, rows: ['.V..', 'VAV.', 'VAAV', 'VYAV', '.VAV', '.VV.', '..V.'] },
    { x: 35, y: 1, rows: ['..V.', '.VAV', 'VAAV', 'VAYV', 'VAAV', '.VV.', '.V..'] },
    // 金の くわがた と 赤い 玉
    {
      mirror: true,
      rows: [
        '....................',
        '.........Y..........',
        '.........YY.........',
        '..........YY........',
        '...........YY.......',
        '............YYY..QRR',
        '.............YYYYRRR',
        '...............QQQQQ',
      ],
    },
    // そりあがった 屋根（かぶとの ひさし）・あかりの 本体・かつぎ棒・足
    {
      mirror: true,
      y: 7,
      rows: [
        '.Y..................',
        '.RR...........RRRRRR',
        '..RRR.....RRRRRRRRRR',
        '..RRRRRRRRRRRRRRRRRR',
        '...bbbbbbbbbbbbbbbbb',
        '.....YYYYYYYYYYYYYYY',
        '......CCCCCCCCCCCCCC',
        '......CCCCCCCCCCCCCC',
        '......CCCCCCCCCCCCCC',
        '......CCCCCCCCCCCCCC',
        '......CCCCCCCCCCCCCC',
        '......CCCCCCCCCCCCCC',
        '......CCCCCCCCCCCCCC',
        '......CCCCCCCCCCCCCC',
        '......CCCCCCCCCCCCCC',
        '......CCCCCCCCCCCCCC',
        '......CCCCCCCCCCCCCC',
        '......CCCCCCCCCCCCCC',
        '......CCCCCCCCCCCCCC',
        '......CCCCCCCCCCCCCC',
        '......YYYYYYYYYYYYYY',
        '.YKKKKKKKKKKKKKKKKKK',
        '.Qbbbbbbbbbbbbbbbbbb',
        '.......KKKKKK.......',
        '.......TTTTTT.......',
        '.......TTTTTT.......',
        '......TTTTTTT.......',
        '......TTTTTTT.......',
        '.....TTTTTTTT.......',
        '....KKKKKKKKK.......',
        '....KKoKKoKKK.......',
      ],
    },
    // かつぎ棒の うでと 金の 肩あて（からだの 手前）
    {
      mirror: true,
      x: 1,
      y: 12,
      rows: [
        '..YYYY.............',
        '.YYRYYY............',
        'QYYYYYYQ...........',
        '.QKKKKQ............',
        '.KTTTK.............',
        '.KTTTK.............',
        '.KTTTK.............',
        '.KTTTK.............',
        'KTTTTTK............',
        'TTTTTTT............',
        'ToToToT............',
        'TTTTTTT............',
        '.TTTTT.............',
      ],
    },
    // あかりの 赤い もよう（ふちの ひし形）
    { mirror: true, y: 13, rows: ['......R.R.R.R.R.R.R.'] },
    { mirror: true, y: 26, rows: ['......R.R.R.R.R.R.R.'] },
    // かお：くらい かげ・つりあがった まゆ・光る 金の 目・きばの 口
    {
      mirror: true,
      y: 14,
      rows: [
        '........oo..........',
        '........NNoo........',
        '........NNNNoo......',
        '........NNNNNNooo...',
        '........NYYYNNNNN...',
        '.........NWYYYNNN...',
        '..........NNNNNN....',
        '....................',
        '.........ooooooooooo',
        '.........oWWNNNNWWNN',
        '..........oWNNbbbWNN',
        '..........oNNbbbbbbb',
        '..........oWNNNNNWNN',
        '...........ooooooooo',
      ],
    },
  ],
};

/** キリコダイショウ（フィールドに立つ 32×32）。くわがた・ひさし・光る 目・きばの 口・肩あてを ちぢめて */
const kirikoTaishoField: MonsterDesign = {
  size: 32,
  colors: {
    C: NQ.cream,
    Y: NQ.gold,
    Q: NQ.ochre,
    R: NQ.red,
    b: NQ.brick,
    K: NQ.bark,
    T: NQ.tan,
    W: NQ.white,
    V: NQ.vermilion,
    N: NQ.night,
  },
  rim: { [NQ.cream]: NQ.ochre, [NQ.red]: NQ.brick },
  layers: [
    { x: 1, y: 3, rows: ['.V.', 'VVV', 'VYV', '.V.'] },
    { x: 28, y: 1, rows: ['.V.', 'VVV', 'VYV', '.V.'] },
    {
      mirror: true,
      rows: [
        '................',
        '........Y.......',
        '.........Y......',
        '.........YYY.QRR',
        '...........YYRRR',
        '............QQQQ',
      ],
    },
    {
      mirror: true,
      y: 9,
      rows: [
        '..YYY...........',
        '.YYRYY..........',
        '.QKKKQ..........',
        '..KTK...........',
        '..KTK...........',
        '..KTK...........',
        '.KTTTK..........',
        '.ToToT..........',
        '.TTTTT..........',
      ],
    },
    {
      mirror: true,
      y: 5,
      rows: [
        '.Y..............',
        '.RR........RRRRR',
        '..RRRRRRRRRRRRRR',
        '...bbbbbbbbbbbbb',
        '....YYYYYYYYYYYY',
        '.....CCCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '.....YYYYYYYYYYY',
        '.YKKKKKKKKKKKKKK',
        '......KKKK......',
        '......TTTT......',
        '.....TTTTT......',
        '....TTTTTT......',
        '...KKKKKKK......',
        '...KKKKKKK......',
        '...KKoKKoK......',
      ],
    },
    {
      mirror: true,
      y: 11,
      rows: [
        '.......oo.......',
        '.......NNoo.....',
        '.......NNNNooo..',
        '.......NYYNNNN..',
        '........NWYYNN..',
        '................',
        '........oooooooo',
        '........oWWNNNWN',
        '........oNNbbbbb',
        '.........ooooooo',
      ],
    },
  ],
};

// ───────────────────────── 県ボス ─────────────────────────

/** 雪つりの なわ：てっぺん（23.5, 3）から 葉の ふちへ のびる 4 本（左右） */
const ROPE_ENDS: readonly (readonly [number, number])[] = [
  [3, 21],
  [8, 16],
  [13, 12],
  [18, 10],
];
const onRope = (x: number, y: number) => {
  const xx = x < 24 ? x : 47 - x;
  return ROPE_ENDS.some(([ex, ey]) => {
    if (y < 4 || y > ey) return false;
    const t = (y - 3) / (ey - 3);
    return Math.abs(xx - (23.5 + (ex - 23.5) * t)) <= 0.5;
  });
};

/** 松の 葉の かたまり（左半分の 中心 cx, cy・半径 rx, ry）。上の だんから 順に 重ね、下の だんほど 手前 */
const PINE_PADS = [
  [23.5, 10, 9, 3.2],
  [14, 15.5, 9.5, 3.2],
  [23.5, 20, 8, 3.2],
  [7, 21, 6.5, 3],
] as const;
/** 1 つの かたまり（左右 対称）。下の ふちから 針の とげが たれる */
const padIn =
  (pad: (typeof PINE_PADS)[number]) =>
  (x: number, y: number): boolean => {
    const [cx, cy, rx, ry] = pad;
    const xx = x < 24 ? x : 47 - x;
    if (((xx - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) return true;
    // 針：下の ふちの 1 つ おきに 2 ドット たれる
    return y > cy && xx % 2 === 0 && ((xx - cx) / (rx - 0.5)) ** 2 + ((y - 1.8 - cy) / ry) ** 2 <= 1;
  };
/** かたまり 1 つの 色：上に 雪 2 だん、左上の ふちに 明るい 葉、下の ふちと 針は こい かげ */
const padRows = (pad: (typeof PINE_PADS)[number]) => {
  const inside = padIn(pad);
  return plot(48, 48, (x, y) => {
    if (!inside(x, y)) return '.';
    if (!inside(x, y - 1)) return 'W';
    if (!inside(x, y - 2)) return (x + y) % 4 === 0 ? 'c' : 'W';
    if (!inside(x, y + 1) || y > pad[1] + pad[3] - 0.5) return 'F';
    if (!inside(x, y - 3)) return 'L';
    return (x * 3 + y * 5) % 11 === 0 ? 'L' : 'G';
  });
};

/** みき（上は 細く 下で ふとい）と 地面を つかむ ねっこの つめ */
const trunkHalf = (y: number) => 8 + Math.max(0, y - 30) * 0.3;
const rootAt = (x: number, y: number) => {
  const dx = Math.abs(x - 23.5);
  if (y < 38 || y > 45) return false;
  const reach = 9 + (y - 38) * 1.9;
  if (dx > reach) return false;
  // ねっこの すきま（つめの あいだ）
  if (y >= 43 && dx > 7 && Math.floor(dx) % 5 === 1) return false;
  if (y === 45 && Math.floor(dx) % 5 !== 3 && dx > 7) return false;
  return true;
};

/**
 * ユキツリオオマツ（県ボス）：兼六園の 雪つりの 大松が いかりの 大木に なった すがた。てっぺんの 金の ほのお形の 飾りに
 * 赤い 玉、そこから 張る 雪つりの なわ、雪を かぶった とげとげの 松の 葉の かたまり。みきの 顔は くらい うろに 金の 目が
 * つり上がり、木の きばの 大口。左右に 枝の うでを ひろげ、ねっこの つめで 地面を つかむ（モリ）
 */
const yukitsuriOomatsuColors = {
  F: NQ.forest,
  G: NQ.green,
  L: NQ.leaf,
  W: NQ.white,
  c: NQ.cloud,
  K: NQ.bark,
  B: NQ.brown,
  T: NQ.tan,
  S: NQ.sand,
  Y: NQ.gold,
  Q: NQ.ochre,
  R: NQ.red,
  N: NQ.night,
};

const yukitsuriOomatsu: MonsterDesign = {
  size: 48,
  colors: yukitsuriOomatsuColors,
  rim: { [NQ.green]: NQ.forest, [NQ.brown]: NQ.bark, [NQ.gold]: NQ.ochre },
  rimDepth: 2,
  layers: [
    // まん中の ぼう
    {
      mirror: true,
      y: 5,
      rows: [
        '.......................T',
        '.......................T',
        '.......................T',
        '.......................T',
        '.......................T',
        '.......................T',
        '.......................T',
      ],
    },
    // 枝の うで（左右へ ひろげ、先は とがった 小枝の つめ）
    {
      mirror: true,
      y: 26,
      rows: [
        '.B.B....................',
        '.BB.B...................',
        '..BBB..B................',
        '...BBBBB................',
        '....BBBBBB..............',
        '......BBBBBBB...........',
        '........BBBBBBBB........',
        '...........BBBBBBB......',
        '..............BBBB......',
      ],
    },
    // みきと ねっこ
    {
      rows: plot(48, 48, (x, y) => {
        const dx = Math.abs(x - 23.5);
        if (y >= 22 && y < 40 && dx <= trunkHalf(y)) return y < 25 || (x * 3 + y * 2) % 13 === 0 ? 'K' : 'B';
        if (rootAt(x, y)) return 'B';
        return '.';
      }),
    },
    // みきの すじ（ねじれ）
    {
      mirror: true,
      y: 39,
      rows: [
        '................K.......',
        '...............K........',
        '.............KK.........',
        '...........KK...........',
        '.........KK.............',
      ],
    },
    // 松の 葉の かたまり（上の だんから。雪を かぶり、下に 針の とげ）
    ...PINE_PADS.map((p) => ({ rows: padRows(p) })),
    // 雪つりの なわ（葉の 手前）
    { rows: plot(48, 48, (x, y) => (onRope(x, y) ? 'S' : '.')) },
    // ぼうの てっぺんの 金の 飾り（ほのおの 形）と 赤い 玉
    {
      mirror: true,
      rows: [
        '........................',
        '.......................Y',
        '......................YY',
        '.....................QYR',
        '......................RR',
        '......................QQ',
      ],
    },
    // かお：くらい うろ・つり上がった まゆ・光る 金の 目・木の きばの 大口
    {
      mirror: true,
      y: 26,
      rows: [
        '...............ooo......',
        '...............KKooo....',
        '...............KNNNooo..',
        '...............KNYYYYYo.',
        '...............KNWYYYYN.',
        '................KNNNNN..',
        '........................',
        '..................oooooo',
        '................ooSSNSSN',
        '...............oNSSNNSNN',
        '...............oNNSNNNNN',
        '...............oNNNNSNNN',
        '................oNNSSNSN',
        '.................ooooooo',
      ],
    },
  ],
};

/**
 * ユキツリオオマツ 後半：いかりで 金沢の 金箔を まとい、雪と 葉の ふちが 金色に。目は 赤く もえ、みきの ひびから 金の 光が もれる。
 * まわりで 金箔と 雪が うずを まいて ふきあれる
 */
const yukitsuriOomatsuP0: MonsterDesign = {
  ...yukitsuriOomatsu,
  colors: { ...yukitsuriOomatsuColors, L: NQ.gold, c: NQ.yellow },
  rim: { [NQ.green]: NQ.forest, [NQ.brown]: NQ.bark, [NQ.gold]: NQ.ochre },
  layers: [
    ...yukitsuriOomatsu.layers,
    // 赤く もえる 目
    { mirror: true, y: 29, rows: ['.................RRRRR', '.................WRRRR'] },
    // みきの ひびから もれる 金の 光
    {
      mirror: true,
      y: 35,
      rows: ['................Y', '...............Y.', '...............Y.', '..............Y..'],
    },
    { mirror: true, y: 41, rows: ['...........YY....', '.........YY......'] },
    // 金箔と 雪の うず
    { x: 2, y: 5, rows: ['.Y.', 'YWY', '.Y.'] },
    { x: 43, y: 9, rows: ['.Y.', 'YWY', '.Y.'] },
    { x: 8, y: 7, rows: ['W'] },
    { x: 36, y: 4, rows: ['W.', '.W'] },
    { x: 2, y: 33, rows: ['.WW', 'W..', 'W.Y'] },
    { x: 43, y: 33, rows: ['WW.', '..W', 'Y.W'] },
  ],
};

// ───────────────────────── ラスボス ─────────────────────────

/** 前田利家：金の 長い 烏帽子形の かぶと、白糸おどしの よろい、右手に やり（カゼ） */
const toshiieBody = lord(
  [
    '..................GGGGGG',
    '.................GGYGGGG',
    '.................GGYGGGG',
    '................GGGYGGGG',
    '................GGGYGGGG',
    '...............GGGGYGGGG',
    '...............GGGGYGGGG',
    '..............GGGGGGGGGG',
    '.............GGGGGGGGGGG',
    '...........NNNNNGGGGGGGG',
    ...HELMET,
    ...FACE,
  ],
  {
    N: NQ.night,
    L: NQ.slate,
    K: NQ.paper,
    S: NQ.cloud,
    G: NQ.gold,
    Y: NQ.yellow,
    R: NQ.red,
    T: NQ.paper,
    H: NQ.slate,
    E: NQ.silver,
    B: NQ.bark,
  },
  { [NQ.paper]: NQ.cloud },
  [
    // やり（右手。ななめに 立てる。赤い ふさ）
    { x: 38, y: 4, rows: ['.E.', 'EEE', '.E.', '.B.', 'RB.', 'RB.', '.B.'] },
    {
      x: 39,
      y: 11,
      rows: [
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
      ],
    },
  ],
);

const maedaToshiie: MonsterDesign = toshiieBody;

export const ISHIKAWA: Readonly<Record<string, MonsterDesign>> = {
  'ishikawa-gosai-bon': gosaiBon,
  'ishikawa-gosai-musha': gosaiMusha,
  'ishikawa-kinpaku-cho': kinpakuCho,
  'ishikawa-kinran-ageha': kinranAgeha,
  'ishikawa-hamashion': hamashion,
  'ishikawa-oo-hamashion': ooHamashion,
  'ishikawa-wajimanurin': wajimanurin,
  'ishikawa-kaga-nurimaru': kagaNurimaru,
  'ishikawa-midboss-kiriko-taisho': kirikoTaisho,
  'ishikawa-midboss-kiriko-taisho.field': kirikoTaishoField,
  'ishikawa-boss-yukitsuri-oomatsu': yukitsuriOomatsu,
  'ishikawa-boss-yukitsuri-oomatsu.p0': yukitsuriOomatsuP0,
  'ishikawa-lastboss-maeda-toshiie': maedaToshiie,
};
