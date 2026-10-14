/** 愛媛県の モンスター（手描き。docs/06 §4・§6.3〜6.5 の 規格） */
import { NQ } from '../palette';
import type { MonsterDesign } from './design';
import { BEARD_FACE, HELMET, lord } from './lastbosses';

/** コミカン：だんだん畑の みかん。まるい だいだい色の 実に、みどりの ヘタと 葉っぱ（モリ） */
const komikan: MonsterDesign = {
  size: 32,
  colors: {
    O: NQ.orange,
    A: NQ.apricot,
    Q: NQ.amber,
    L: NQ.leaf,
    G: NQ.green,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.orange]: NQ.amber, [NQ.leaf]: NQ.green },
  layers: [
    // 葉っぱ（左上）
    { x: 5, y: 4, rows: ['....LL', '..LLLLL', '.LLGLLL', '..LLLLLLL'] },
    // ヘタ
    { mirror: true, y: 7, rows: ['..............GL', '.............LLL'] },
    {
      mirror: true,
      rows: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '............OOOO',
        '..........OOOOOO',
        '.........OOOOOOO',
        '........OOOOOOOO',
        '.......OOOOOOOOO',
        '.......OOOOOOOOO',
        '......OOOOOOOOOO',
        '......OOOOWWOOOO',
        '......OOOOWoOOOO',
        '......OOOOWoOOOO',
        '......OOppOOOOoO',
        '......OOOOOOOOOo',
        '.......OOOOOOOOO',
        '.......OOOOOOOOO',
        '........OOOOOOOO',
        '.........OOOOOOO',
        '..........OOOOOO',
        '............OOOO',
        '..........QQQ',
        '..........QQQ',
      ],
    },
    // つや（左上）
    { x: 9, y: 13, rows: ['.AA', 'AA.', 'A..'] },
  ],
};

/** イヨカンムシャ（コミカンの しんか）：かわの かぶとと 葉の かざり、葉の たて、きりっと まゆ（モリ） */
const iyokanMusha: MonsterDesign = {
  size: 32,
  colors: {
    O: NQ.orange,
    A: NQ.apricot,
    Q: NQ.amber,
    L: NQ.leaf,
    G: NQ.green,
    M: NQ.lime,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.orange]: NQ.amber, [NQ.leaf]: NQ.green },
  layers: [
    // 葉の かざり（かぶとの 前立て）
    {
      mirror: true,
      y: 4,
      rows: ['...............L', '..............LL', '.............LGL', '.............LLL'],
    },
    {
      mirror: true,
      rows: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '...........OOOOO',
        '.........QQQQQQQ',
        '........QQQQQQQQ',
        '.......QQQQQQQQQ',
        '......OOOOOOOOOO',
        '.....OOOOOOOOOOO',
        '.....OOOOOOOOOOO',
        '.....OOOooOOOOOO',
        '.....OOOOOoOOOOO',
        '.....OOOOOWWOOOO',
        '.....OOOOOWoOOOO',
        '.....OOOOOWoOOOO',
        '.....OOppOOOOoOO',
        '.....OOOOOOOOOoo',
        '.....OOOOOOOOOOO',
        '.....OOOOOOOOOOO',
        '......OOOOOOOOOO',
        '.......OOOOOOOOO',
        '........OOOOOOOO',
        '..........OOOOOO',
        '..........QQQ',
        '..........QQQ',
      ],
    },
    // 葉の かたあて
    { mirror: true, x: 3, y: 13, rows: ['LLL', 'LGLL', 'LLL'] },
    // 葉の たて（左手）
    { x: 1, y: 17, rows: ['..LLL', '.LLLLL', 'LLGLLL', 'LLLLLL', 'LLLLLL', '.LLLLL', '..LLL'] },
    // つや（左上）
    { x: 8, y: 13, rows: ['.AA', 'AA.'] },
  ],
};

/** モフタオル：今治の タオル。ふわふわの 白い ぬのに 青い しま、はしが 風で ひらひら（カゼ） */
const mofutaoru: MonsterDesign = {
  size: 32,
  colors: {
    P: NQ.paper,
    C: NQ.cloud,
    W: NQ.white,
    A: NQ.aqua,
    T: NQ.teal,
    M: NQ.mint,
    p: NQ.blush,
  },
  rim: { [NQ.paper]: NQ.cloud },
  layers: [
    // はしが ひらひら（つばさのように）
    { mirror: true, x: 1, y: 9, rows: ['....P', '..PPP', '.PPPP', 'PPPPP', '.PPPP', '..PPP', '....P'] },
    {
      mirror: true,
      rows: [
        '',
        '',
        '',
        '',
        '',
        '.........PPPPPPP',
        '.......PPPPPPPPP',
        '......PPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPWoPPPP',
        '.....PPPPPooPPPP',
        '.....PPPPPooPPPP',
        '.....PPppPPPPoPP',
        '.....PPPPPPPPPPo',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....AAAAAAAAAAA',
        '.....PPPPPPPPPPP',
        '.....TTTTTTTTTTT',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PCPCPCPCPCP',
        '.....PCPCPCPCPCP',
        '.....PPPPPPPPPPP',
        '......PP..PP..PP',
        '......PP..PP..PP',
      ],
    },
    // 風
    { x: 1, y: 21, rows: ['.MM', 'M..', '.MM'] },
    { x: 27, y: 24, rows: ['MM.', '..M', 'MM.'] },
  ],
};

/** ソラトビタオル（モフタオルの しんか）：大きく ひろげた ぬのの つばさ、青い しま、きりっと まゆ（カゼ） */
const soratobiTaoru: MonsterDesign = {
  size: 32,
  colors: {
    P: NQ.paper,
    C: NQ.cloud,
    W: NQ.white,
    A: NQ.aqua,
    T: NQ.teal,
    M: NQ.mint,
    p: NQ.blush,
  },
  rim: { [NQ.paper]: NQ.cloud },
  layers: [
    // ひろげた つばさ
    {
      mirror: true,
      y: 10,
      rows: [
        '......PP',
        '....PPPP',
        '..PPPPPP',
        '.PPPPPPP',
        '.PAAAAAP',
        '.PPPPPPP',
        '.PTTTTTP',
        '.PPPPPPP',
        '..PPPPPP',
        '...PPPPP',
        '.....PPP',
      ],
    },
    {
      mirror: true,
      rows: [
        '',
        '',
        '',
        '',
        '',
        '',
        '...........PPPPP',
        '.........PPPPPPP',
        '........PPPPPPPP',
        '........PPPPPPPP',
        '........PPPPPPPP',
        '........PPPooPPP',
        '........PPPPPoPP',
        '........PPPWoPPP',
        '........PPPooPPP',
        '........PPPooPPP',
        '........PppPPPoP',
        '........PPPPPPPo',
        '........PPPPPPPP',
        '........AAAAAAAA',
        '........PPPPPPPP',
        '........TTTTTTTT',
        '........PPPPPPPP',
        '........PPPPPPPP',
        '........PPPPPPPP',
        '........PCPCPCPC',
        '........PCPCPCPC',
        '........PPPPPPPP',
        '.........PP..PP.',
        '.........PP..PP.',
      ],
    },
    // 風
    { x: 1, y: 24, rows: ['.MM', 'M..', '.MM'] },
    { x: 27, y: 26, rows: ['MM.', '..M', 'MM.'] },
  ],
};

/** ジャコテンギョ：宇和島の じゃこ天の 魚。きつね色の からだに つぶつぶ、青い ひれと 尾びれ（ミズ） */
const jakotengyo: MonsterDesign = {
  size: 32,
  colors: {
    T: NQ.tan,
    S: NQ.sand,
    B: NQ.brown,
    A: NQ.azure,
    b: NQ.blue,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.tan]: NQ.brown, [NQ.azure]: NQ.blue },
  layers: [
    // せびれ（とげの ある ひれ）
    { mirror: true, y: 8, rows: ['...........A.A.A', '..........AAAAAA', '...........AAAAA'] },
    // むなびれ
    { mirror: true, x: 2, y: 17, rows: ['...A', '.AAA', 'AAAA', 'AbAA', '.AAA', '...A'] },
    // 尾びれ
    {
      mirror: true,
      y: 26,
      rows: ['...........AAAAA', '.........AAAAAAA', '........AAAAAAAA', '........AAAAAAAA'],
    },
    {
      mirror: true,
      rows: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '............TTTT',
        '..........TTTTTT',
        '.........TTTTTTT',
        '........TTTTTTTT',
        '.......TTTTTTTTT',
        '.......TTTTWWTTT',
        '......TTTTTWoTTT',
        '......TTTTTWoTTT',
        '......TTppTTTToT',
        '......TTTTTTTTTo',
        '......TTTTTTTTTT',
        '.......TTTTTTTTT',
        '.......TTTTTTTTT',
        '........TTTTTTTT',
        '.........TTTTTTT',
        '...........TTTTT',
      ],
    },
    // あげた つぶつぶ と つや
    { x: 8, y: 21, rows: ['B..B', '..B.', 'B..B'] },
    { x: 19, y: 14, rows: ['.B.', 'B.B'] },
    { x: 9, y: 13, rows: ['.SS', 'SS.'] },
  ],
};

/** ジャコテンダイ（ジャコテンギョの しんか）：タイのように 大きな せびれと 尾びれ、きりっと まゆ（ミズ） */
const jakotendai: MonsterDesign = {
  size: 32,
  colors: {
    T: NQ.tan,
    S: NQ.sand,
    B: NQ.brown,
    A: NQ.azure,
    b: NQ.blue,
    I: NQ.ice,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.tan]: NQ.brown, [NQ.azure]: NQ.blue },
  layers: [
    // とがった せびれ
    {
      mirror: true,
      y: 3,
      rows: [
        '.........A.A.A.A',
        '........AAAAAAAA',
        '.......AAAIAAAAA',
        '.......AAAAAAAAA',
        '........AAAAAAAA',
      ],
    },
    // 大きな むなびれ
    {
      mirror: true,
      x: 1,
      y: 16,
      rows: ['....A', '..AAA', '.AAAA', 'AAbAA', 'AAAAA', '.AAAA', '..AAA', '....A'],
    },
    // 大きな 尾びれ
    {
      mirror: true,
      y: 25,
      rows: [
        '..........AAAAAA',
        '........AAAAAAAA',
        '.......AAAIAAAAA',
        '......AAAAAAAAAA',
        '......AAAAAAAAAA',
      ],
    },
    {
      mirror: true,
      rows: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '..........TTTTTT',
        '........TTTTTTTT',
        '.......TTTTTTTTT',
        '......TTTTTTTTTT',
        '......TTTooTTTTT',
        '......TTTTToTTTT',
        '......TTTTWWTTTT',
        '......TTTTWoTTTT',
        '......TTTTWoTTTT',
        '.....TTppTTTToTT',
        '.....TTTTTTTTToo',
        '.....TTTTTTTTTTT',
        '.....TTTTTTTTTTT',
        '......TTTTTTTTTT',
        '......TTTTTTTTTT',
        '.......TTTTTTTTT',
        '........TTTTTTTT',
        '..........TTTTTT',
      ],
    },
    // あげた つぶつぶ と つや
    { x: 7, y: 20, rows: ['B..B', '..B.', 'B..B'] },
    { x: 19, y: 17, rows: ['.B.', 'B.B'] },
    { x: 8, y: 11, rows: ['.SS', 'SS.'] },
  ],
};

/**
 * ユアミサギ（中ボス）：道後温泉の 湯から まいあがる 白い サギ。大きく ふりあげた とがった はねの つばさ、
 * 頭の うしろに 赤と 金の かざり羽、怒りまゆと 赤く 光る 目、とがった 長い くちばし、金の するどい 足の つめ。
 * 足もとは わきたつ 湯ぶねと うずまく ゆげ（カゼ）
 */
const yuamisagi: MonsterDesign = {
  size: 40,
  colors: {
    W: NQ.white,
    C: NQ.cloud,
    L: NQ.silver,
    Y: NQ.yellow,
    G: NQ.gold,
    Q: NQ.ochre,
    R: NQ.red,
    A: NQ.azure,
    S: NQ.sky,
    K: NQ.slate,
    T: NQ.tan,
    B: NQ.brown,
  },
  rim: { [NQ.white]: NQ.cloud, [NQ.azure]: NQ.blue },
  rimDepth: 2,
  layers: [
    // ふりあげた つばさ（はねの 先は とがって 上と 外へ）と 頭・くちばし・からだ
    {
      mirror: true,
      rows: [
        '',
        '.L.............G....',
        '.WL...L.......GR....',
        '.WWL..WL..L...RR....',
        '.WWWL.WWL.WL..oRRWWW',
        '.WWWWLWWWLWWLo.WWWWW',
        '.CWWWWWWWWWWWo.WWWWW',
        '.CCWWWWWWWWWWo.ooWWW',
        '..CWWWWWWWWWWoRRRooW',
        '..CCWWWWWWWWWoKRWRoo',
        '..LCCWWWWWWWWoKKRRRo',
        '..L.LCCWWWWWWWoKKKWY',
        '..L..LCCWWWWWWWo.WYY',
        '.....L.LCCWWWWWWoWYY',
        '.......L.LCWWWWWoWQY',
        '..........LCWWWWoWQY',
        '...........LCWWoWWQY',
        '............LCoWWWQY',
        '............oWWWWWWY',
        '............WWWCWWWW',
        '...........WWCWWCWWW',
        '...........WCWWCWWCW',
        '...........WWCWWCWWW',
        '...........WCWWCWWCW',
        '...........WWCWWCWWW',
        '............WWWCWWCW',
        '............WWWWWWWW',
        '.............WWWWWWW',
        '..............WWWWWW',
        '...............G....',
        '...............G....',
        '...............G....',
        '..............GQG...',
        '.............Q.Q.Q..',
      ],
    },
    // わきたつ 湯ぶねと お湯
    {
      mirror: true,
      y: 34,
      rows: ['..S.AS.AASAAAAAAAAAA', '..AASAAAAAAAAAAAAAAA', '..TTTTTTTTTTTTTTTTTT', '..BBBBBBBBBBBBBBBBBB'],
    },
    // 立ちのぼる ゆげ
    { mirror: true, x: 2, y: 24, rows: ['..W', '.WC', 'WC.', 'WW.', '.WW', '..W', '.WC', 'WC.'] },
  ],
};

/** ユアミサギ（フィールドに 立つ 32×32）：バトルの すがたを 小さく した もの */
const yuamisagiField: MonsterDesign = {
  size: 32,
  colors: {
    W: NQ.white,
    C: NQ.cloud,
    L: NQ.silver,
    Y: NQ.yellow,
    G: NQ.gold,
    Q: NQ.ochre,
    R: NQ.red,
    A: NQ.azure,
    K: NQ.slate,
    T: NQ.tan,
    B: NQ.brown,
  },
  rim: { [NQ.white]: NQ.cloud },
  layers: [
    {
      mirror: true,
      rows: [
        '',
        '.L..........G...',
        '.WL..L.....GR...',
        '.WWL.WL.L..RR...',
        '.WWWLWWLWL.oRWWW',
        '.CWWWWWWWWo.WWWW',
        '.CCWWWWWWWo.ooWW',
        '..CWWWWWWWoRRRoo',
        '..LCWWWWWWoKRWRo',
        '..L.LCWWWWWoKKRo',
        '.....LCWWWWWoKWY',
        '.......LCWWWWoYY',
        '.........LCWWoQY',
        '...........LoWQY',
        '...........oWWWY',
        '.........WWCWWCW',
        '.........WCWWCWW',
        '.........WWCWWCW',
        '.........WCWWCWW',
        '..........WWWCWW',
        '...........WWWWW',
        '............G...',
        '............G...',
        '...........GQG..',
        '..........Q.Q.Q.',
      ],
    },
    {
      mirror: true,
      y: 25,
      rows: ['..A.AAAAAAAAAAAA', '..AAAAAAAAAAAAAA', '..TTTTTTTTTTTTTT', '..BBBBBBBBBBBBBB'],
    },
    { mirror: true, x: 2, y: 17, rows: ['..W', '.WC', 'WC.', '.W.', '..W', '.WC'] },
  ],
};

/** イシヅチオウの からだ（左半分）。太い 岩の つの・とげの かた・食いしばった きば・こぶし・ふんばる 足 */
const ISHIZUCHI_BODY = [
  '',
  '........GG..............',
  '........GGG............G',
  '........TGGo..........GG',
  '........TTTTo........GGG',
  '.........TTTTo.......GGR',
  '..G.......TTTTo...TTGGRR',
  '..GG...G...TTTTTTTTTGGRR',
  '..SGK..GG...SSTTTTTTTTGG',
  '..STK..SGK..oSSSTTTTTTTT',
  '..STTK.STTK.oooooTTTTTTT',
  '.SSTTK.STTTKoKYYoooooTTT',
  '..SSTK.STTTKoKYWYYooooTT',
  '..STTTKSTTTToKKYYYYYKooo',
  '.SSTTTTKTTTToTKKKKKKKKTT',
  '.STTTTTTTTTToTTTTTTTTTBB',
  '.STTTTTTTTTToToooooooooo',
  '.STTTTTTTTTToTToWWoooooo',
  '.TTTTTTTTTTToTToWooooWoo',
  '.ooooooooooooTTooooooWWo',
  '..........ooTTTTTTTTTTTT',
  '..SSTTT.STTTTTTTTTTTTTTT',
  '.SSTTTT.STTTTTTTTTTTTTTT',
  '.STTTTT.Tnnnnnnnnnnnnnnn',
  '.STTTTT.TTTTTTTTTTTTTTTT',
  '.TTTTTT.TTTTTTTTTTTTTTTT',
  '.TTTTTT..TTTTTTTTTTTTTTT',
  '.TTTTTT..ToooooTTTTooooT',
  '.TTTTTT...TTTTToooooTTTT',
  '.GGGGGG...TTTTTTTTTTTTTT',
  '.QQQQQQ...KKKKKKKKKKKKKK',
  '.SSTTTTT..KKKKKKKKKKKGRR',
  '.STTTTTTT.TTTTTTTTTTTTTT',
  '.TTTTTTTT.TTTTTTTTTTTTTT',
  '.ToToToTT.TTTTTTTT......',
  '.TTTTTTTT.TTTTTTTT......',
  '.KTTTTTTK.TTTTTTTT......',
  '..KKKKKK..TTTTTTTT......',
  '..........TTTTTTTT......',
  '.........TTTTTTTTT......',
  '.........TTTTTTTTT......',
  '.........TTTTTTTTT......',
  '........TTTTTTTTTT......',
  '.......KKKKKKKKKKK......',
  '......KKKKKKKKKKKK......',
  '......KKKKKKKKKKKK......',
];

/**
 * イシヅチオウ（県ボス）：石鎚山の 岩から 生まれた 大おとこ。山の みねの ような 金の 先の 岩の つの、
 * 赤い 宝石の 前立て、まっ黒な かげの 中で 光る 黄色い 目と 太い 怒りまゆ、食いしばった 歯、
 * とげとげの 岩の かた、金の うでわの 大きな こぶし、むねに くさり、体を 走る 銅の すじ（ツチ → 後半 ヒノ）
 */
const ishizuchiOu: MonsterDesign = {
  size: 48,
  colors: {
    T: NQ.brown,
    S: NQ.tan,
    B: NQ.bark,
    K: NQ.bark,
    n: NQ.silver,
    G: NQ.gold,
    Q: NQ.ochre,
    R: NQ.red,
    A: NQ.amber,
    C: NQ.bark,
    Y: NQ.yellow,
    W: NQ.white,
  },
  rim: { [NQ.brown]: NQ.bark, [NQ.gold]: NQ.ochre },
  rimDepth: 2,
  layers: [
    { mirror: true, rows: ISHIZUCHI_BODY },
    // 銅の すじ（別子銅山）
    { x: 3, y: 22, rows: ['.A', 'A.', '.A', '..A', '.A', 'A.'] },
    { x: 42, y: 21, rows: ['A.', '.A', 'A.', '.A', '..A'] },
    { x: 12, y: 25, rows: ['..A.', '.A..', 'A...', '.A..', '..A.'] },
    { x: 31, y: 32, rows: ['.A', 'A.', '.A', 'A.'] },
    // 岩の ひび（C）
    { x: 15, y: 27, rows: ['C..C', '.CC.', '.C..'] },
    { x: 28, y: 26, rows: ['C..', '.C.', '.CC', 'C..'] },
    { x: 12, y: 38, rows: ['.C', 'C.', '.C'] },
    { x: 34, y: 39, rows: ['C.', '.C', 'C.'] },
    // 岩の つや（左上）
    { x: 15, y: 9, rows: ['SS', 'S.'] },
    { x: 3, y: 33, rows: ['S.', '.S'] },
  ],
};

/** イシヅチオウ 後半（いかり）：目が 赤く もえ、銅の すじと ひびが まっ赤に 光り、うしろに 大きな 炎（ヒノ） */
const ishizuchiOuP0: MonsterDesign = {
  ...ishizuchiOu,
  colors: { ...ishizuchiOu.colors, A: NQ.vermilion, C: NQ.vermilion, Y: NQ.red, W: NQ.gold, F: NQ.apricot },
  layers: [
    // うしろの 炎（かたの 上から 立ちのぼる）
    {
      mirror: true,
      x: 1,
      y: 1,
      rows: [
        '..A.....',
        '..AA....',
        '.AFA..A.',
        '.AFAA.AA',
        'AFFGA.AFA',
        'AFGGA.AFA',
        'AFGFA.AFA',
        'AFFFAAFFA',
        '.AFFAAFA',
        '.AAFFFA',
        '..AAAA',
      ],
    },
    ...ishizuchiOu.layers,
    // 光る ひびの 火の粉
    { x: 20, y: 34, rows: ['.A.', 'A.A'] },
    { x: 26, y: 35, rows: ['A.A', '.A.'] },
  ],
};

/** 村上武吉：金の 波の 前立てと 青い よろい、白い ひげ（ミズ → 後半 カゼ） */
const murakamiTakeyoshi = lord(
  [
    '........................',
    '........................',
    '.....GG.................',
    '....GYYG................',
    '....GYYG......GG........',
    '.....GGYG....GYYG.......',
    '......GGYGG..GYYGG......',
    '........GGYGGGGYYGGGGGG.',
    '..........GGGGGGGGGGGGGG',
    '...............NNNNNNNGG',
    ...HELMET,
    ...BEARD_FACE,
  ],
  {
    N: NQ.navy,
    L: NQ.blue,
    K: NQ.navy,
    S: NQ.azure,
    G: NQ.gold,
    Y: NQ.yellow,
    R: NQ.red,
    T: NQ.blue,
    H: NQ.teal,
    M: NQ.hairBlack,
  },
  { [NQ.azure]: NQ.blue },
);

export const EHIME: Readonly<Record<string, MonsterDesign>> = {
  'ehime-midboss-yuamisagi': yuamisagi,
  'ehime-midboss-yuamisagi.field': yuamisagiField,
  'ehime-boss-ishizuchi-ou': ishizuchiOu,
  'ehime-boss-ishizuchi-ou.p0': ishizuchiOuP0,
  'ehime-lastboss-murakami-takeyoshi': murakamiTakeyoshi,
  'ehime-komikan': komikan,
  'ehime-iyokan-musha': iyokanMusha,
  'ehime-mofutaoru': mofutaoru,
  'ehime-soratobi-taoru': soratobiTaoru,
  'ehime-jakotengyo': jakotengyo,
  'ehime-jakotendai': jakotendai,
};
