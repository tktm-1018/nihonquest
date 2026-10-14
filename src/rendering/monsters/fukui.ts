/** 福井県の モンスター（手描き。docs/06 §4・§6.3〜6.5 の 規格） */
import { NQ } from '../palette';
import type { MonsterDesign } from './design';

// ───────────────────────── 通常 ─────────────────────────

/** スイセンコ：越前海岸の 水仙。白い 花びらの まん中に 黄色い カップ、細長い 葉（モリ） */
const suisenko: MonsterDesign = {
  size: 32,
  colors: {
    P: NQ.paper,
    c: NQ.cloud,
    Y: NQ.gold,
    Q: NQ.ochre,
    G: NQ.leaf,
    g: NQ.green,
    L: NQ.lime,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.paper]: NQ.cloud, [NQ.leaf]: NQ.green },
  layers: [
    // 細長い 葉
    {
      mirror: true,
      y: 8,
      rows: [
        '..L.............',
        '..LL............',
        '..GL............',
        '..GLL...........',
        '...GLL..........',
        '...GGLL.........',
        '....GGLL........',
        '....GGLLL.......',
        '.....GGLLL......',
        '.....GGGLLL.....',
        '......GGGLLLL...',
        '.......GGGLLLLL.',
        '........GGGGGGGG',
      ],
    },
    // 花（白い 花びらと 黄色い カップ）・くき・足
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '...........PPPPP',
        '.........PPPPPPP',
        '........PPPPPPPP',
        '.......PPPPPPPPP',
        '......PPPPPPPPPP',
        '......PPPPPPPPPP',
        '.....PPPPPYYYYYY',
        '.....PPPPYYYYYYY',
        '.....PPPPYYYYYYY',
        '.....PPPPYYYYYYY',
        '.....PPPPYYYYYYY',
        '.....PPPPYYYYYYY',
        '.....PPPPPYYYYYY',
        '......PPPPPPPPPP',
        '......PPPPPPPPPP',
        '.......PPPPPPPPP',
        '........PPPPPPPP',
        '.........PPPPPPP',
        '...........PPPPP',
        '..............GG',
        '..............GG',
        '..............GG',
        '..............GG',
        '..............GG',
        '..............GG',
        '.............GGG',
        '............GG..',
        '............GG..',
      ],
    },
    // 花びらの さかいめ
    { mirror: true, y: 5, rows: ['.......c........', '......c.........', '.....c..........'] },
    { mirror: true, y: 17, rows: ['......c.........', '.......c........'] },
    // かお（黄色い カップの 中）
    {
      mirror: true,
      y: 11,
      rows: [
        '...........WW...',
        '...........Wo...',
        '...........Wo...',
        '.........pp...o.',
        '...............o',
      ],
    },
    // つや
    { x: 8, y: 6, rows: ['.W', 'W.'] },
  ],
};

/** メガネン：鯖江の めがね。まるい レンズが 目、つるが うで。頭の 上に 金の わ（ヒカリ） */
const meganen: MonsterDesign = {
  size: 32,
  colors: {
    N: NQ.navy,
    S: NQ.silver,
    I: NQ.ice,
    W: NQ.white,
    Y: NQ.gold,
    Q: NQ.ochre,
    c: NQ.cloud,
    p: NQ.blush,
  },
  rim: { [NQ.navy]: NQ.ink, [NQ.silver]: NQ.gray },
  layers: [
    // 金の わ
    { mirror: true, y: 2, rows: ['..........YYYYYY', '.........Y......', '..........QQQQQQ'] },
    // つる（うで）
    {
      mirror: true,
      y: 14,
      rows: [
        '.SS.............',
        '.SSS............',
        '..SSS...........',
        '...SSS..........',
        '....SSS.........',
        '.....SS.........',
      ],
    },
    // まるい レンズの わく（顔）
    {
      mirror: true,
      y: 8,
      rows: [
        '.....NNNNNN.....',
        '...NNNNNNNNNN...',
        '..NNIIIIIINNNNNN',
        '..NIIIIIIIINNNNN',
        '.NNIIIIIIIINNNNN',
        '.NIIIIIIIIIINNNN',
        '.NIIIIIIIIIINNNN',
        '.NIIIIIIIIIINNNN',
        '.NIIIIIIIIIINNNN',
        '.NNIIIIIIIINNNNN',
        '..NIIIIIIIINNNNN',
        '..NNIIIIIINNNNNN',
        '...NNNNNNNNNN...',
        '.....NNNNNN.....',
      ],
    },
    // レンズの 光と 目
    { mirror: true, y: 12, rows: ['...WW...........', '..WW............'] },
    { mirror: true, y: 13, rows: ['......ooo.......', '......ooo.......', '......ooo.......'] },
    // ほっぺと 口
    { mirror: true, y: 22, rows: ['...pp...........', '..............oo'] },
    // 小さな 手と 足
    { mirror: true, y: 24, rows: ['....SS..........', '....SS..........'] },
    {
      mirror: true,
      y: 26,
      rows: ['..........SSS...', '.........SSSS...', '.........NNNN...', '.........NNNN...'],
    },
  ],
};

/** ラプトルン：勝山の 小さな 恐竜。とがった しっぽ、太い 後ろあし、小さな 前あし（ツチ） */
const raputorun: MonsterDesign = {
  size: 32,
  colors: {
    T: NQ.tan,
    S: NQ.sand,
    E: NQ.beige,
    B: NQ.brown,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.tan]: NQ.brown, [NQ.beige]: NQ.sand },
  layers: [
    // しっぽ（こしから 右上へ 太く）
    {
      x: 19,
      y: 10,
      rows: [
        '..........TT',
        '.........TTT',
        '........TTTT',
        '.......TTTT.',
        '......TTTT..',
        '.....TTTT...',
        '....TTTT....',
        '...TTTT.....',
        '..TTTT......',
        '.TTTT.......',
        'TTTT........',
      ],
    },
    // 頭・首・からだ・後ろあし
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '..........TTTTTT',
        '.........TTTTTTT',
        '........TTTTTTTT',
        '........TTTTTTTT',
        '........TTTTTTTT',
        '........TTTTTTTT',
        '........TTTTTTTT',
        '.........TTTTTTT',
        '.........EEEEEEE',
        '..........TTTTTT',
        '...........TTTTT',
        '...........TTTTT',
        '..........TTTTTT',
        '.........TTTTTTT',
        '.........TTEEEEE',
        '........TTTEEEEE',
        '........TTTEEEEE',
        '........TTTEEEEE',
        '........TTTTEEEE',
        '.......TTTTTTTTT',
        '.......TTTTTTTTT',
        '......TTTTTTTTTT',
        '......TTTTTTTTTT',
        '.........TTTTT..',
        '.........TTTTT..',
        '.........TTTTT..',
        '........EEEEEE..',
        '........EEEEEE..',
      ],
    },
    // 前あし（小さな つめ）
    { mirror: true, y: 15, rows: ['.......TT.......', '......TTT.......', '......WTT.......'] },
    // せなかの しま
    { mirror: true, y: 4, rows: ['............B...', '...........B....', '..........B.....'] },
    { mirror: true, y: 19, rows: ['.........B......', '........B.......'] },
    // かお（目・鼻の あな・小さな 歯）
    {
      mirror: true,
      y: 6,
      rows: [
        '..........WW....',
        '..........Wo....',
        '..........Wo....',
        '........pp....o.',
        '............oooo',
        '.............W.W',
      ],
    },
    // つや
    { x: 9, y: 5, rows: ['.S', 'S.'] },
  ],
};

/** カミスキン：すいたばかりの 越前和紙。ひらひらの 紙の からだ、まわりに 風（カゼ） */
const kamisukin: MonsterDesign = {
  size: 32,
  colors: {
    P: NQ.paper,
    c: NQ.cloud,
    W: NQ.white,
    M: NQ.mint,
    A: NQ.aqua,
    S: NQ.sand,
    B: NQ.brown,
    p: NQ.blush,
  },
  rim: { [NQ.paper]: NQ.cloud },
  layers: [
    // 風
    { x: 1, y: 8, rows: ['.MMM.', 'M....', 'M..MM', '.MMA.'] },
    { x: 26, y: 18, rows: ['.MMM.', '....M', 'MM..M', '.AMM.'] },
    // 紙の からだ（下は ひらひら）
    {
      mirror: true,
      y: 5,
      rows: [
        '.........PPPPPPP',
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
        '....PPPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '......PPPPPPPPPP',
        '......PPPPPPPPPP',
        '.......PPPPPPPPP',
        '.......PcPPcPPcP',
        '........PPPPPPPP',
        '........P.PPPPPP',
        '.........P..PPPP',
        '.........P...PPP',
        '..........P..PPP',
        '..........P...PP',
      ],
    },
    // すきげたの ぼう（右手）
    { x: 26, y: 8, rows: ['SB', 'SB', 'SB', 'SB', 'SB'] },
    // かお
    {
      mirror: true,
      y: 14,
      rows: [
        '..........WW....',
        '..........Wo....',
        '..........Wo....',
        '........pp......',
        '.............ooo',
      ],
    },
    { x: 7, y: 9, rows: ['.W', 'W.'] },
  ],
};

/** カミフブキ（カミスキンの しんか）：何まいもの 和紙を まきあげて とぶ すがた（カゼ） */
const kamiFubuki: MonsterDesign = {
  size: 32,
  colors: {
    P: NQ.paper,
    c: NQ.cloud,
    W: NQ.white,
    M: NQ.mint,
    A: NQ.aqua,
    I: NQ.ice,
    S: NQ.sand,
    B: NQ.brown,
    p: NQ.blush,
  },
  rim: { [NQ.paper]: NQ.cloud, [NQ.mint]: NQ.aqua },
  layers: [
    // まいあがる 紙（うしろ）
    { mirror: true, y: 2, rows: ['..cccc..........', '.cccccc.........', '..cccc..........'] },
    { x: 24, y: 6, rows: ['cccc', 'cccc', '.cc.'] },
    { x: 2, y: 20, rows: ['cccc', 'cccc', '.cc.'] },
    // 風の うず
    { x: 1, y: 11, rows: ['.MMM.', 'M...M', 'M..MM', '.MMA.'] },
    { x: 26, y: 24, rows: ['.MMM.', '....M', 'MM..M', '.AMM.'] },
    {
      mirror: true,
      y: 4,
      rows: [
        '........PPPPPPPP',
        '......PPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '....PPPPPPPPPPPP',
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
        '.....PPPPPPPPPPP',
        '......PPPPPPPPPP',
        '......PcPPcPPcPP',
        '.......PPPPPPPPP',
        '.......P.PPPPPPP',
        '........P..PPPPP',
        '........P...PPPP',
        '.........P..PPPP',
        '.........P...PPP',
        '..........P..PPP',
      ],
    },
    // すきげたの ぼう
    { x: 27, y: 10, rows: ['SB', 'SB', 'SB', 'SB', 'SB', 'SB'] },
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
        '........pp......',
        '............oooo',
      ],
    },
    { x: 5, y: 9, rows: ['.I', 'I.'] },
  ],
};

// ───────────────────────── しんか ─────────────────────────

/** ユキノスイセン（スイセンコの しんか）：雪の 中で さく 水仙。花が ふえ、花びらに 雪（モリ） */
const yukiNoSuisen: MonsterDesign = {
  size: 32,
  colors: {
    P: NQ.paper,
    c: NQ.cloud,
    Y: NQ.gold,
    Q: NQ.ochre,
    G: NQ.leaf,
    g: NQ.green,
    L: NQ.lime,
    W: NQ.white,
    I: NQ.ice,
    p: NQ.blush,
  },
  rim: { [NQ.paper]: NQ.cloud, [NQ.leaf]: NQ.green },
  layers: [
    // 細長い 葉
    {
      mirror: true,
      y: 10,
      rows: [
        '.L..............',
        '.LL.............',
        '.GLL............',
        '..GLL...........',
        '..GGLL..........',
        '...GGLL.........',
        '...GGLLL........',
        '....GGLLL.......',
        '....GGGLLL......',
        '.....GGGLLLL....',
        '......GGGLLLLL..',
        '.......GGGGGGGGG',
      ],
    },
    // わきの 小さな 花
    { x: 1, y: 6, rows: ['.PPP.', 'PPYPP', 'PPYPP', '.PPP.'] },
    { x: 26, y: 8, rows: ['.PPP.', 'PPYPP', 'PPYPP', '.PPP.'] },
    // 大きな 花・くき・足
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '..........PPPPPP',
        '........PPPPPPPP',
        '.......PPPPPPPPP',
        '......PPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '....PPPPYYYYYYYY',
        '....PPPYYYYYYYYY',
        '....PPPYYYYYYYYY',
        '....PPPYYYYYYYYY',
        '....PPPYYYYYYYYY',
        '....PPPYYYYYYYYY',
        '....PPPPYYYYYYYY',
        '....PPPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '......PPPPPPPPPP',
        '.......PPPPPPPPP',
        '........PPPPPPPP',
        '..........PPPPPP',
        '..............GG',
        '..............GG',
        '..............GG',
        '..............GG',
        '..............GG',
        '.............GGG',
        '............GG..',
        '............GG..',
      ],
    },
    // 花びらに つもった 雪
    { mirror: true, y: 2, rows: ['..........IWWWWW', '........IWWIWWWW', '.......IWWWPPPPP'] },
    // かお（きりっと）
    {
      mirror: true,
      y: 10,
      rows: [
        '.........o......',
        '..........oo....',
        '..........WW....',
        '..........Wo....',
        '..........Wo....',
        '........pp....o.',
        '...............o',
      ],
    },
    // 雪の きらめき
    { x: 2, y: 20, rows: ['.I.', 'IWI', '.I.'] },
    { x: 27, y: 22, rows: ['.I.', 'IWI', '.I.'] },
  ],
};

/** メガネハカセ（メガネンの しんか）：金の わくの 大きな めがね。白い ひげと 大きな 金の わ（ヒカリ） */
const meganeHakase: MonsterDesign = {
  size: 32,
  colors: {
    Y: NQ.gold,
    Q: NQ.ochre,
    I: NQ.ice,
    W: NQ.white,
    S: NQ.silver,
    c: NQ.cloud,
    C: NQ.cream,
    p: NQ.blush,
  },
  rim: { [NQ.gold]: NQ.ochre, [NQ.silver]: NQ.gray },
  layers: [
    // 大きな 金の わ
    { mirror: true, y: 1, rows: ['........YYYYYYYY', '.......Y........', '........QQQQQQQQ'] },
    // つる（うで）
    {
      mirror: true,
      y: 13,
      rows: [
        '.SS.............',
        '.SSS............',
        '..SSS...........',
        '...SSS..........',
        '....SSS.........',
        '.....SSS........',
        '......SS........',
      ],
    },
    // まるい レンズの わく
    {
      mirror: true,
      y: 6,
      rows: [
        '.....YYYYYY.....',
        '...YYYYYYYYYY...',
        '..YYIIIIIIYYYYYY',
        '..YIIIIIIIIYYYYY',
        '.YYIIIIIIIIYYYYY',
        '.YIIIIIIIIIIYYYY',
        '.YIIIIIIIIIIYYYY',
        '.YIIIIIIIIIIYYYY',
        '.YIIIIIIIIIIYYYY',
        '.YIIIIIIIIIIYYYY',
        '.YYIIIIIIIIYYYYY',
        '..YIIIIIIIIYYYYY',
        '..YYIIIIIIYYYYYY',
        '...YYYYYYYYYY...',
        '.....YYYYYY.....',
      ],
    },
    // レンズの 光と 目（きりっと）
    { mirror: true, y: 10, rows: ['...WW...........', '..WW............'] },
    {
      mirror: true,
      y: 10,
      rows: ['......ooo.......', '......ooo.......', '......ooo.......', '......ooo.......'],
    },
    // 白い ひげ
    {
      mirror: true,
      y: 22,
      rows: [
        '....CCCCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '......CCCCCCCCCC',
        '.......CCCCCCCCC',
        '........CCCCCCCC',
        '..........CCCCCC',
      ],
    },
    { mirror: true, y: 21, rows: ['...pp...........'] },
    // 小さな 手（ゆびを 立てる）と 足
    { mirror: true, y: 21, rows: ['...SS...........', '...SS...........'] },
    { mirror: true, y: 28, rows: ['.........SSS....', '........SSSS....', '........QQQQ....'] },
  ],
};

/** フクイラプトル（ラプトルンの しんか）：大きく 走る 恐竜。頭の とさか、するどい 目、しっぽを まっすぐ のばす（ツチ） */
const fukuiRaptor: MonsterDesign = {
  size: 32,
  colors: {
    T: NQ.tan,
    S: NQ.sand,
    E: NQ.beige,
    B: NQ.brown,
    W: NQ.white,
    p: NQ.blush,
    G: NQ.leaf,
  },
  rim: { [NQ.tan]: NQ.brown, [NQ.beige]: NQ.sand },
  layers: [
    // 長い しっぽ
    {
      x: 20,
      y: 8,
      rows: [
        '.........TT',
        '........TTT',
        '.......TTTT',
        '......TTTT.',
        '.....TTTT..',
        '....TTTT...',
        '...TTTTT...',
        '..TTTTT....',
        '.TTTTT.....',
        'TTTTT......',
        'TTTT.......',
      ],
    },
    // 頭の とさか
    { mirror: true, y: 1, rows: ['..........GG....', '.........GGG....', '........GG......'] },
    // 頭・首・からだ・後ろあし
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '..........TTTTTT',
        '.........TTTTTTT',
        '........TTTTTTTT',
        '.......TTTTTTTTT',
        '.......TTTTTTTTT',
        '.......TTTTTTTTT',
        '.......TTTTTTTTT',
        '.......TTTTTTTTT',
        '........TTTTTTTT',
        '........EEEEEEEE',
        '.........TTTTTTT',
        '..........TTTTTT',
        '..........TTTTTT',
        '.........TTTTTTT',
        '........TTTTTTTT',
        '........TTEEEEEE',
        '.......TTTEEEEEE',
        '.......TTTEEEEEE',
        '.......TTTEEEEEE',
        '.......TTTTEEEEE',
        '......TTTTTTTTTT',
        '......TTTTTTTTTT',
        '.....TTTTTTTTTTT',
        '.....TTTTTTTTTTT',
        '........TTTTTT..',
        '........TTTTTT..',
        '........TTTTTT..',
        '.......EEEEEEE..',
        '.......EEEEEEE..',
      ],
    },
    // 前あし（するどい つめ）
    { mirror: true, y: 15, rows: ['......TTT.......', '.....TTTT.......', '.....WWTT.......'] },
    // せなかの しま
    {
      mirror: true,
      y: 4,
      rows: ['...........B....', '..........B.....', '.........B......', '........B.......'],
    },
    { mirror: true, y: 19, rows: ['........B.......', '.......B........'] },
    // かお（きりっとした まゆ・目・歯）
    {
      mirror: true,
      y: 4,
      rows: [
        '.........o......',
        '..........oo....',
        '..........WW....',
        '..........Wo....',
        '..........Wo....',
        '........pp....o.',
        '...........ooooo',
        '............W.W.',
      ],
    },
    // つや
    { x: 8, y: 5, rows: ['.S', 'S.'] },
  ],
};

// ───────────────────────── 中ボス ─────────────────────────

const kasumiColors = {
  P: NQ.paper,
  c: NQ.cloud,
  g: NQ.slate,
  K: NQ.silver,
  n: NQ.night,
  B: NQ.brown,
  W: NQ.white,
  Y: NQ.gold,
  Q: NQ.ochre,
  R: NQ.red,
};

/**
 * カスミマル（中ボス）：丸岡城の 天守が 目を さました 石の 巨人。屋根の かどに 金の しゃちほこの つの、
 * 暗い 窓の 中で 赤く 光る つり目、門の きば、はねた 屋根の かたと 石垣の うで・こぶし、足もとに 霞（ツチ）
 */
const kasumiMaru: MonsterDesign = {
  size: 40,
  colors: kasumiColors,
  rim: { [NQ.slate]: NQ.night, [NQ.paper]: NQ.cloud, [NQ.silver]: NQ.gray },
  rimDepth: 2,
  layers: [
    {
      mirror: true,
      rows: [
        '....................',
        '........Y...........',
        '........YY..........',
        '.........YY.........',
        '.........YYY........',
        '..........YYY...gggg',
        '...........YYggggggg',
        '..........gggggggggg',
        '........gggggggggggg',
        '.......ggggggggggggg',
        '..........BBBBBBBBBB',
        '..........nnnnnnnnnn',
        '..........nnnnnnnnnn',
        '..........nnnnnnnnnn',
        '..........nnnnnnnnnn',
        '..........PPPPPPPPPP',
        '..g.......PPPPPPPPPP',
        '..gg......PPPPPPPPPP',
        '...ggg..gggggggggggg',
        '...ggggggggggggggggg',
        '..gggggggggggggggggg',
        '.....BBBBBBBBBBBBBBB',
        '........PPPPPPPPPPPP',
        '........PnnPPPnnPPPn',
        '........PnnPPPnnPPPn',
        '........PPPPPPPPPPPP',
        '.......ggggggggggggg',
        '......gggggggggggggg',
        '........KKKKKKKKKKKK',
        '........KKKKKKKKKKKK',
        '........KKKKKKKKKKKK',
        '.......KKKKKKKKKKKKK',
        '.......KKKKKKKKKKKKK',
        '.......KKKKKKKKKKKKK',
        '......KKKKKKKKKKKKKK',
        '......KKKKKKKKKKKKKK',
      ],
    },
    // 石垣の うでと こぶし
    {
      mirror: true,
      y: 21,
      rows: [
        '..KKKKK.............',
        '..KKKK..............',
        '..KKKK..............',
        '..KKKK..............',
        '.KKKKKK.............',
        '.KKKKKK.............',
        '.KKKKKK.............',
        '.KKKKK..............',
        '..KKK...............',
      ],
    },
    { mirror: true, x: 1, y: 22, rows: ['.n..', '..n.', '.n..', '......', '..n.n', '..n.n'] },
    // 石垣の めじ
    {
      mirror: true,
      y: 29,
      rows: [
        '.........n...n...n..',
        '........n...n...n...',
        '..........n...n...n.',
        '.......n...n...n....',
        '.........n...n...n..',
        '......n...n...n.....',
      ],
    },
    // 暗い 窓の 中で 赤く 光る つり目と まゆ
    {
      mirror: true,
      y: 11,
      rows: [
        '..........oo........',
        '...........oooo.....',
        '...........RRoooo...',
        '...........RWWRRoo..',
        '............RRRRRR..',
      ],
    },
    // 門の きば（口）
    {
      mirror: true,
      y: 15,
      rows: ['............oooooooo', '............oWoWWoWW', '.............ooWooWo', '..............oooooo'],
    },
    // 赤い 宝石（屋根の まん中）
    { mirror: true, x: 18, y: 7, rows: ['QQ', 'YR', 'QQ'] },
    // 霞（足もとに たなびく）
    { y: 34, rows: ['.cc....cccc..................cccc....cc.', '...cccc....cc..................cccc.....'] },
    { y: 37, rows: ['..ccc.....cccccc..........cccccc.....ccc'] },
  ],
};

/** カスミマル（フィールドに立つ 32×32） */
const kasumiMaruField: MonsterDesign = {
  size: 32,
  colors: kasumiColors,
  rim: { [NQ.slate]: NQ.night, [NQ.paper]: NQ.cloud, [NQ.silver]: NQ.gray },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '.......Y........',
        '.......YY.......',
        '........YY......',
        '.........YY.gggg',
        '.........ggggggg',
        '.......ggggggggg',
        '.......ggggggggg',
        '........BBBBBBBB',
        '........nnnnnnnn',
        '........nnnnnnnn',
        '........nnnnnnnn',
        '........PPPPPPPP',
        '........PPPPPPPP',
        '..g.....gggggggg',
        '..gg..gggggggggg',
        '...ggggggggggggg',
        '.....BBBBBBBBBBB',
        '......PPPPPPPPPP',
        '......PnnPPnnPPn',
        '......PPPPPPPPPP',
        '....gggggggggggg',
        '......KKKKKKKKKK',
        '......KKKKKKKKKK',
        '......KKKKKKKKKK',
        '.....KKKKKKKKKKK',
        '.....KKKKKKKKKKK',
        '.....KKKKKKKKKKK',
      ],
    },
    {
      mirror: true,
      y: 17,
      rows: [
        '...KK...........',
        '..KKKK..........',
        '..KKKK..........',
        '..KKK...........',
        '..KKK...........',
        '.KKKKK..........',
        '.KKKKKK.........',
        '.KKKKKK.........',
        '..KKKK..........',
      ],
    },
    { mirror: true, y: 23, rows: ['.......n...n...n', '.....n...n...n..', '.......n...n...n'] },
    {
      mirror: true,
      y: 9,
      rows: ['........o.......', '........RRooo...', '........RWRRRo..', '.........RRRR...'],
    },
    { mirror: true, y: 12, rows: ['..........oooooo', '..........oWoWWo'] },
    { mirror: true, x: 14, y: 5, rows: ['QQ', 'YR'] },
    { y: 28, rows: ['.cc...cccc...............cc....', '...ccc....ccc........cccc..cc..'] },
  ],
};

// ───────────────────────── 県ボス ─────────────────────────

const ganiColors = {
  V: NQ.vermilion,
  b: NQ.brick,
  A: NQ.apricot,
  n: NQ.night,
  W: NQ.white,
  Y: NQ.gold,
  Q: NQ.ochre,
  R: NQ.red,
  S: NQ.sky,
  Z: NQ.azure,
  B: NQ.blue,
  I: NQ.ice,
};

/**
 * エチゼンガニオウ（県ボス）：越前の 海の ぬしの 大きな ずわいがに。とげだらけの こうらに 金の つのと 赤い 宝石、
 * 頭の 上に ふりあげた 大きな はさみ、暗い 顔に つり上がって 光る 目と きば、ふんばる 足、足もとに 冬の 荒波（ミズ）
 */
const echizenGaniOu: MonsterDesign = {
  size: 48,
  colors: ganiColors,
  rim: { [NQ.vermilion]: NQ.brick, [NQ.azure]: NQ.blue, [NQ.gold]: NQ.ochre },
  rimDepth: 2,
  layers: [
    // ふんばる 足（3 本ずつ。ひざを 上げて 外へ ひろげる）
    {
      mirror: true,
      y: 18,
      rows: [
        '..VV....................',
        '.VVVV...................',
        '.VVVVVV.................',
        '.VVAVVVVV...............',
        '.VV..VVVVVV.............',
        '.VV...VVVVVVV...........',
        '.VV....VV..VVVV.........',
        '.VV...VVVV...VVV........',
        '.VV..VVVVVV.............',
        '.VV..VVAVVVVV...........',
        '.VV..VV...VVVVV.........',
        '.VV..VV....VVVVVV.......',
        '.VV..VV...VVV...........',
        '.VV..VV...VVVV..........',
        '.VV..VV...VVVVVVV.......',
        '.VV..VV...VV...VVVVV....',
        '.VV..VV...VV............',
        '.VV..VV...VV............',
        '.VV..VV...VV............',
        '.V...VV...VV............',
        '.V...V....VV............',
        '.V...V....V.............',
        '.....V....V.............',
      ],
    },
    // ふりあげた 大きな はさみ（左右）
    {
      mirror: true,
      y: 0,
      rows: [
        '........................',
        '..V.....V...............',
        '.VVV...VVV..............',
        '.VVV...VVV..............',
        '.VVVA..VVVV.............',
        '.VVVV..VVVV.............',
        '.VVVVVVVVVV.............',
        '.VVAVVVVVVV.............',
        '.VVVVVVVAVVV............',
        '..VVVVVVVVVV............',
        '..VVAVVVVVVV............',
        '...VVVVVVVVVV...........',
        '....VVVVVVVVVV..........',
        '......VVVVVVVVV.........',
        '........VVVVVVVV........',
        '..........VVVVVVV.......',
        '............VVVVVV......',
      ],
    },
    // はさみの 切れこみと ふし
    { mirror: true, x: 4, y: 3, rows: ['.', 'o', 'o', 'o'] },
    { mirror: true, x: 2, y: 11, rows: ['.oo', '...', '...'] },
    // とげだらけの こうら
    {
      mirror: true,
      y: 9,
      rows: [
        '...................VVVVV',
        '................VVVVVVVV',
        '.............VVVVVVVVVVV',
        '...........VVVVVVVVVVVVV',
        '.........VVVVVVVVVVVVVVV',
        '......V.VVVVVVVVVVVVVVVV',
        '.....VVVVVVVVVVVVVVVVVVV',
        '.......VVVVVVVVVVVVVVVVV',
        '....VVVVVVVVVVVVVVVVVVVV',
        '......VVVVVVVVVVVVVVVVVV',
        '.....VVVVVVVVVVVVVVVVVVV',
        '...VVVVVVVVVVVVVVVVVVVVV',
        '......VVVVVVVVVVVVVVVVVV',
        '.......VVVVVVVVVVVVVVVVV',
        '.....VVVVVVVVVVVVVVVVVVV',
        '........VVVVVVVVVVVVVVVV',
        '.........VVVVVVVVVVVVVVV',
        '..........bbbbbbbbbbbbbb',
        '...........bbbbbbbbbbbbb',
        '.............bbbbbbbbbbb',
        '...............bbbbbbbbb',
      ],
    },
    // こうらの とげつぶ
    {
      mirror: true,
      y: 12,
      rows: [
        '.............A..........',
        '..........A......A......',
        '..............A.........',
        '.........A..............',
        '............A...........',
        '........A...............',
        '..........A.............',
      ],
    },
    // 金の つの と 赤い 宝石
    {
      mirror: true,
      y: 0,
      rows: [
        '................Y.......',
        '................YY......',
        '................YYY.....',
        '.................YYY....',
        '.................YYYY...',
        '..................YYYY..',
        '...................YYYY.',
        '....................YYYY',
        '.....................YYY',
      ],
    },
    { mirror: true, x: 19, y: 8, rows: ['YYYYY', '.YRRW', '.YRRR', '..YRR', '...YR'] },
    // 暗い 顔の かげ（目の まわり）
    {
      mirror: true,
      y: 16,
      rows: [
        '.............nnnnnnnnnnn',
        '............nnnnnnnnnnnn',
        '............nnnnnnnnnnnn',
        '.............nnnnnnnnnnn',
        '...............nnnnnnnnn',
      ],
    },
    // つり上がって 光る 目と 太い まゆ
    {
      mirror: true,
      y: 15,
      rows: [
        '..........ooo...........',
        '...........oooooo.......',
        '............oooooooo....',
        '............YYYYooooo...',
        '............YWWWYYYoo...',
        '.............YYYYYYYo...',
        '..............YYYYYY....',
        '...............YYY......',
      ],
    },
    // きばの 生えた 口
    {
      mirror: true,
      y: 23,
      rows: [
        '.................ooooooo',
        '................oWWoWWoW',
        '................ooWooWoW',
        '.................ooooooo',
        '..................oWooWo',
      ],
    },
    // 足もとの 冬の 荒波
    {
      mirror: true,
      y: 38,
      rows: [
        '..I.........I...........',
        '.ISI.......ISI.........I',
        '.SSSI.....SSSSI.......IS',
        '.SSSSS...SSSSSSS.....SSS',
        '.ZZZZZZZZZZZZZZZZZZZZZZZ',
        '.ZZZZZZZZZZZZZZZZZZZZZZZ',
        '.BBBBBBBBBBBBBBBBBBBBBBB',
        '..BBBBBBBBBBBBBBBBBBBBBB',
      ],
    },
  ],
};

/** エチゼンガニオウ 後半：こうらが まっかに 燃え、ひびから 金の 光、目が 白く 光り、まわりに あわと しぶき */
const echizenGaniOuP0: MonsterDesign = {
  ...echizenGaniOu,
  colors: { ...ganiColors, V: NQ.red, A: NQ.gold, Y: NQ.gold, c: NQ.cream },
  rim: { [NQ.red]: NQ.brick, [NQ.azure]: NQ.blue, [NQ.gold]: NQ.ochre },
  layers: [
    ...echizenGaniOu.layers,
    // こうらの ひび（金に 光る）
    { mirror: true, x: 8, y: 12, rows: ['c.....', '.c....', '.cc...', '...c..', '...cc.', '.....c'] },
    { mirror: true, x: 5, y: 21, rows: ['cc..', '..cc'] },
    // 光る 目
    { mirror: true, x: 12, y: 18, rows: ['cccc', 'cWWWccc', '.ccccccc', '..cccccc', '...ccc'] },
    // あわ と しぶき
    { x: 2, y: 20, rows: ['.I.', 'IWI', '.I.'] },
    { x: 43, y: 22, rows: ['.I.', 'IWI', '.I.'] },
    { x: 2, y: 30, rows: ['I'] },
    { x: 45, y: 31, rows: ['I'] },
  ],
};

// ───────────────────────── ラスボス ─────────────────────────

/** 松平春嶽：幕末の 福井藩の とのさま。こんの 羽織に 金の 三つ葉あおいの もん、白い 着もの、手に せんす（ヒカリ） */
const matsudairaShungaku: MonsterDesign = {
  size: 48,
  colors: {
    H: NQ.hairBlack,
    F: NQ.skinLight,
    f: NQ.skinMid,
    W: NQ.white,
    P: NQ.paper,
    c: NQ.cloud,
    K: NQ.indigo,
    k: NQ.violet,
    D: NQ.denim,
    S: NQ.slate,
    Y: NQ.gold,
    Q: NQ.ochre,
    R: NQ.red,
  },
  rim: { [NQ.indigo]: NQ.ink, [NQ.paper]: NQ.cloud, [NQ.skinLight]: NQ.skinMid },
  rimDepth: 2,
  layers: [
    // まげ（ちょんまげ）
    { x: 20, y: 2, rows: ['HHHH', 'HHHH', 'HHHH'] },
    // かみと かお
    {
      mirror: true,
      y: 4,
      rows: [
        '..............HHHHHHHHHH',
        '............HHHHHHHHHHHH',
        '...........HHHHHHHHHHHHH',
        '..........HHHHHHHHHHHHHH',
        '..........HHHHHHHFFFFFFF',
        '..........HHHHFFFFFFFFFF',
        '..........HHHFFFFFFFFFFF',
        '..........HHFFFoooFFFFFF',
        '..........HHFFFFWoFFFFFF',
        '..........HHFFFFFFFFFfFF',
        '..........HHfFFFFFFFFFoo',
        '...........HffFFFFFFFFFF',
        '............fffffffffFFF',
      ],
    },
    // 羽織（こん）と 白い 着もの
    {
      mirror: true,
      y: 17,
      rows: [
        '..............KKKKKKKKKK',
        '...........KKKKKKKPPPPPP',
        '.........KKKKKKKKKKPPPPP',
        '........KKKKKKKKKKKKPPPP',
        '.......KKKKKKKKKKKKKKPPP',
        '......KKKKKKKKKKKKKKKKPP',
        '......KKKKKKKKKKKKKKKKKP',
        '.....KKKKKKKKKKKKKKKKKKK',
        '.....KKKKKKKKKKKKKKKKKKK',
        '.....KKKKKKKKKKKKKKKKKKK',
        '.....KKKKKKKKKKKKKKKKKKK',
        '.....KKKKKKKKKKKKKKKKKKK',
        '.....KKKKKKKKKKKKKKKKKKK',
        '.....KKKKKKKKKKKKKKKKKKK',
        '.....KKKKKKKKKKKKKKKKKKK',
        '.....KKKKKKKKKRRRRRRRRRR',
        '.....KKKKKKKKKKKKKKKKKKK',
        '......KKKKKKKKKKKKKKKKKK',
        '......DDDDDDDDDDDDDDDDDD',
        '......DDDDDDDDDDDDDDDDDD',
        '......DDDDDDDDDDDDDDDDDD',
        '......DDDDDDDDDDDDDDDDDD',
        '.......DDDDDDDDDDDDDDDDD',
        '.......DDDDDDDDDDDDDDDDD',
        '........SSSSSSSSSSSSSSSS',
        '........SSSSSSSSSSSSSSSS',
        '.........SSSSSS...SSSSSS',
        '.........WWWWWW...WWWWWW',
        '.........WWWWWW...WWWWWW',
      ],
    },
    // 羽織の おりめ と 三つ葉あおいの もん（かたと むね）
    { mirror: true, y: 20, rows: ['..........k.............', '.........k..............'] },
    { x: 8, y: 22, rows: ['.YY.', 'YYYY', 'YYYY', '.YY.'] },
    { x: 36, y: 22, rows: ['.YY.', 'YYYY', 'YYYY', '.YY.'] },
    { x: 21, y: 30, rows: ['.YY..', 'YYYYY', 'YYYYY', '.YYY.'] },
    // 白い えり
    {
      mirror: true,
      y: 17,
      rows: ['..............PPP.......', '.............PPP........', '............PPP.........'],
    },
    // せんす（右手に 立てて もつ）
    { x: 38, y: 24, rows: ['PYP', 'PYP', 'PYP', 'PYP', 'PYP', 'PYP', 'PYP', 'PYP', 'cYc', 'RRR'] },
    // 手
    { x: 36, y: 33, rows: ['FFF', 'FFf'] },
    { x: 9, y: 33, rows: ['FFF', 'fFF'] },
  ],
};

export const FUKUI: Readonly<Record<string, MonsterDesign>> = {
  'fukui-suisenko': suisenko,
  'fukui-yuki-no-suisen': yukiNoSuisen,
  'fukui-meganen': meganen,
  'fukui-megane-hakase': meganeHakase,
  'fukui-raputorun': raputorun,
  'fukui-fukui-raptor': fukuiRaptor,
  'fukui-kamisukin': kamisukin,
  'fukui-kami-fubuki': kamiFubuki,
  'fukui-midboss-kasumi-maru': kasumiMaru,
  'fukui-midboss-kasumi-maru.field': kasumiMaruField,
  'fukui-boss-echizen-gani-ou': echizenGaniOu,
  'fukui-boss-echizen-gani-ou.p0': echizenGaniOuP0,
  'fukui-lastboss-matsudaira-shungaku': matsudairaShungaku,
};
