/** 香川県の モンスター（手描き。docs/06 §4・§6.3〜6.5 の 規格） */
import { NQ } from '../palette';
import type { Layer, MonsterDesign } from './design';

/** コロリーブ：小豆島の オリーブの 実。たて長の みどりの 実に、銀色の すじの ある 細長い 葉（モリ） */
const kororibu: MonsterDesign = {
  size: 32,
  colors: {
    L: NQ.leaf,
    G: NQ.green,
    M: NQ.lime,
    K: NQ.forest,
    s: NQ.silver,
    B: NQ.brown,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.leaf]: NQ.green },
  layers: [
    // 細長い オリーブの 葉（左は 大きく、右は 小さく）
    { x: 5, y: 1, rows: ['.KK', 'KKKK', 'KssKK', '.KKssKK', '...KKsKKK', '.....KKsKK', '........KK'] },
    { x: 17, y: 3, rows: ['.......KK', '....KKsKK', '.KKssKKK', 'KKKKK'] },
    {
      mirror: true,
      rows: [
        '',
        '',
        '',
        '',
        '',
        '...............B',
        '...............B',
        '...............B',
        '.............LLL',
        '...........LLLLL',
        '..........LLLLLL',
        '.........LLLLLLL',
        '........LLLLLLLL',
        '........LLLLLLLL',
        '.......LLLLLLLLL',
        '.......LLLLLLLLL',
        '.......LLLWWLLLL',
        '.......LLLWoLLLL',
        '.......LLLWoLLLL',
        '.......LppLLLLoL',
        '.......LLLLLLLLo',
        '.......LLLLLLLLL',
        '.......LLLLLLLLL',
        '.......LLLLLLLLL',
        '........LLLLLLLL',
        '........LLLLLLLL',
        '.........LLLLLLL',
        '..........LLLLLL',
        '............LLLL',
        '...........GGG',
        '...........GGG',
      ],
    },
    // つや（左上）
    { x: 9, y: 10, rows: ['.MM', 'MM.', 'M..'] },
  ],
};

/** ミノリーブ（コロリーブの しんか）：3 まいの 葉の かざり、両わきに じゅくした むらさきの 実、きりっと まゆ（モリ） */
const minoribu: MonsterDesign = {
  size: 32,
  colors: {
    L: NQ.leaf,
    G: NQ.green,
    M: NQ.lime,
    K: NQ.forest,
    s: NQ.silver,
    B: NQ.brown,
    V: NQ.violet,
    I: NQ.indigo,
    l: NQ.lavender,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.leaf]: NQ.green, [NQ.violet]: NQ.indigo },
  layers: [
    // 葉の かざり（まん中と ななめ 2 まい）
    {
      mirror: true,
      rows: [
        '',
        '...............K',
        '.....KK.......KK',
        '....KKKK......KG',
        '....KssKK.....KG',
        '.....KKssKK...KG',
        '.......KKKssK.KK',
        '.........KKKKK.K',
      ],
    },
    // じゅくした むらさきの 実（両わきに ぶらさがる）
    { mirror: true, x: 1, y: 5, rows: ['...B', '..B', '.lV', '.VVI', '.VII', '..I'] },
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
        '.............LLL',
        '...........LLLLL',
        '.........LLLLLLL',
        '........LLLLLLLL',
        '.......LLLLLLLLL',
        '.......LLLLLLLLL',
        '......LLLLLLLLLL',
        '......LLLooLLLLL',
        '......LLLLLoLLLL',
        '......LLLLWWLLLL',
        '......LLLLWoLLLL',
        '......LLLLWoLLLL',
        '......LLppLLLoLL',
        '......LLLLLLLLoo',
        '......LLLLLLLLLL',
        '......LLLLLLLLLL',
        '......LLLLLLLLLL',
        '.......LLLLLLLLL',
        '.......LLLLLLLLL',
        '........LLLLLLLL',
        '.........LLLLLLL',
        '...........LLLLL',
        '..........GGG',
        '.........GGGG',
      ],
    },
    // うで
    { mirror: true, x: 3, y: 19, rows: ['.LL', 'LLL', 'LL.'] },
    // つや（左上）
    { x: 8, y: 9, rows: ['.MM', 'MM.', 'M..'] },
  ],
};

/** アオギン：丸亀うちわ。まるい 紙に 青い 波の もよう、竹の え が 1 本足、小さな 風の つばさ（カゼ） */
const aogin: MonsterDesign = {
  size: 32,
  colors: {
    T: NQ.teal,
    A: NQ.aqua,
    M: NQ.mint,
    W: NQ.white,
    P: NQ.paper,
    S: NQ.sand,
    B: NQ.brown,
    p: NQ.blush,
  },
  rim: { [NQ.sand]: NQ.tan, [NQ.aqua]: NQ.teal },
  layers: [
    // 風の つばさ
    { mirror: true, y: 9, rows: ['...TT', '..TAA', '.TAMA', '.TAAM', '.TAMA', '..TAA', '...TA'] },
    {
      mirror: true,
      rows: [
        '',
        '............TTTT',
        '..........TTPPPP',
        '.........TPPPPPP',
        '........TPPPPPPP',
        '.......TPPPPPPPP',
        '......TPPPPPPPPP',
        '......TPPPPPPPPP',
        '.....TPPPPPPPPPP',
        '.....TPPPPPPPPPP',
        '.....TPPPPPWoPPP',
        '.....TPPPPPooPPP',
        '.....TPPPPPooPPP',
        '.....TPPppPPPPoP',
        '.....TPPPPPPPPPo',
        '.....TPPPPPPPPPP',
        '.....TPPPPPPPPPP',
        '......TPMMPPPMMP',
        '......TMAAMPMAAM',
        '.......TAAAAAAAA',
        '........TAAMAAAA',
        '.........TAAAAAA',
        '...........TAAAA',
        '.............TTS',
        '...............S',
        '...............S',
        '...............S',
        '...............B',
        '...............S',
        '..............SS',
        '..............SS',
      ],
    },
    // 紙の つや
    { x: 8, y: 4, rows: ['.W', 'W.'] },
    // 風
    { x: 1, y: 22, rows: ['.MMW', 'M...', '.MM.'] },
    { x: 26, y: 25, rows: ['WMM.', '...M', '.MM.'] },
  ],
};

/** ツムジウチワ（アオギンの しんか）：大きく なった 風の つばさ、はちまき、きりっと まゆ、足もとに つむじ風（カゼ） */
const tsumujiUchiwa: MonsterDesign = {
  size: 32,
  colors: {
    T: NQ.teal,
    A: NQ.aqua,
    M: NQ.mint,
    W: NQ.white,
    P: NQ.paper,
    S: NQ.sand,
    B: NQ.brown,
    p: NQ.blush,
  },
  rim: { [NQ.sand]: NQ.tan, [NQ.aqua]: NQ.teal },
  layers: [
    // 大きな 風の つばさ（うしろから）
    {
      mirror: true,
      y: 3,
      rows: [
        '.T',
        '.TT',
        '.TAT',
        '.TAAT',
        '.TAMAT',
        '.TAAMAT',
        '.TAAAMAT',
        '..TAAAMA',
        '.TTAAAAA',
        '.TAMAAAA',
        '..TAMAAA',
        '.TTAAMAA',
        '.TAAAAMA',
        '..TTAAAA',
        '....TTAA',
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
        '............TTTT',
        '..........TTPPPP',
        '.........TPPPPPP',
        '........TAAAAAAA',
        '.......TPPPPPPPP',
        '.......TPPPPPPPP',
        '......TPPPooPPPP',
        '......TPPPPPoPPP',
        '......TPPPPWoPPP',
        '......TPPPPooPPP',
        '......TPPPPooPPP',
        '......TPppPPPPPP',
        '......TPPPPPPoPP',
        '......TPPPPPPPoo',
        '......TPMMPPPMMP',
        '.......TAAMPMAAM',
        '.......TAAAAAAAA',
        '........TAAMAAAA',
        '.........TAAAAAA',
        '..........TTAAAA',
        '............TTTS',
        '...............S',
        '...............S',
        '...............B',
        '..............SS',
        '..............SS',
      ],
    },
    // はちまきの むすび目（右へ なびく）
    { x: 24, y: 6, rows: ['..AA', '.AAA.A', 'AA..AA', '.....A'] },
    // 紙の つや
    { x: 10, y: 9, rows: ['W'] },
    // 足もとの 風
    { x: 1, y: 25, rows: ['.MMW', 'M...', '.MM.'] },
    { x: 26, y: 26, rows: ['WMM.', '...M', '.MM.'] },
  ],
};

const ZENI_COLORS = {
  S: NQ.sand,
  T: NQ.tan,
  B: NQ.brown,
  E: NQ.beige,
  R: NQ.red,
  A: NQ.apricot,
  W: NQ.white,
  p: NQ.blush,
};

/** ゼニガニ：銭形砂絵の 砂の カニ。こうらは 四角い あなの あいた まるい お金、目は 2 本の 柄の 先、赤い はさみ（ツチ） */
const zenigani: MonsterDesign = {
  size: 32,
  colors: ZENI_COLORS,
  rim: { [NQ.red]: NQ.brick },
  layers: [
    {
      mirror: true,
      rows: [
        '',
        '',
        '',
        '..R..R.....WW',
        '.RR..RR....Wo',
        '.ARRRRR....Wo',
        '.RRRRRR.....B',
        '..RRRR......B',
        '...RR.......B',
        '....RR......TTTT',
        '.....RR...TTSSSS',
        '......RR.TSSSSSS',
        '.......RTSSSSSoS',
        '.......TSSppSSSo',
        '.......TSSSSSTTT',
        '......TSSSSSST..',
        '......TSSBSSST..',
        '......TSSBSSST..',
        '......TSSSSSST..',
        '......TSSSSSSTTT',
        '......RTSSSSSSSS',
        '.....R.TSSSSSSSB',
        '....R...TSSSSSSB',
        '....R...RTSSSSSS',
        '...R...R..TTSSSS',
        '......R....RTTTT',
        '......R...R',
        '.....R....R',
        '.........R',
        '.........R',
      ],
    },
    // こうらの つや（左上）
    { x: 9, y: 11, rows: ['.E', 'E.'] },
  ],
};

/** オオゼニガニ（ゼニガニの しんか）：大きな お金の こうら、ふとい はさみを 高く、まゆの ついた 目、4 本ずつの 足（ツチ） */
const oozenigani: MonsterDesign = {
  size: 32,
  colors: ZENI_COLORS,
  rim: { [NQ.red]: NQ.brick },
  layers: [
    {
      mirror: true,
      rows: [
        '',
        '..RR..RR..oo',
        '.RRR..RR....o',
        '.RARRRRR...WW',
        '.RRRRRRR...Wo',
        '..RRRRR....Wo',
        '...RRR......B',
        '....RRR.....B',
        '.....RRR....B',
        '......RR...TTTTT',
        '.......RRTTSSSSS',
        '........TSSSSSSS',
        '.......TSSSSSSSS',
        '......TSSSSSoSSS',
        '......TSSSppSooo',
        '.....TSSSSSSSSSS',
        '.....TSSSSSSSTTT',
        '.....TSSSSSSST..',
        '.....TSSSBSSST..',
        '.....TSSSBSSST..',
        '....RTSSSSSSST..',
        '...R.TSSSSSSSTTT',
        '..R..RTSSSSSSSSS',
        '..R.R..TSSSSSSBB',
        '..R.R..RTSSSSSSS',
        '...R..R..TTSSSSS',
        '...R..R...RTTTTT',
        '.....R...R',
        '.....R...R',
        '........R',
      ],
    },
    // こうらの つや（左上）と ふちの 光
    { x: 8, y: 12, rows: ['.EE', 'EE.', 'E..'] },
  ],
};

/** ミズカガミ：父母ヶ浜の 空をうつす 薄い水の精（ミズ） */
const mizukagami: MonsterDesign = {
  size: 32,
  colors: { S: NQ.sky, A: NQ.azure, I: NQ.ice, W: NQ.white, C: NQ.cloud, Y: NQ.cream, p: NQ.blush },
  rim: { [NQ.sky]: NQ.azure, [NQ.ice]: NQ.sky },
  layers: [
    {
      mirror: true,
      y: 1,
      rows: [
        '.......III......',
        '.....IIIIIII....',
        '....IIIIIIIII...',
        '...IIIISIIIII...',
        '..IIIISSSIIIII..',
        '..IIISSSSSIIII..',
        '.IIISSSSSSSIIII.',
        '.IISSSSSSSSSIII.',
        '.IISSSWWSSSSIII.',
        '.IISSSWoSSSSIII.',
        '.IISSSSSSSSSIII.',
        '.IIISSpSSSSIIII.',
        '..IIISSSSSIIII..',
        '..IIIISSSIIIII..',
        '...IIIIIIIIII...',
        '....IIIIIIII....',
        '.....IIIIII.....',
        '......IIII......',
        '.......II.......',
        '................',
        '...SSSSSSSSSS...',
        '..SSSSSSSSSSSS..',
        '.SSSSSSSSSSSSSS.',
        '.SSSSSSSSSSSSSS.',
        '..SSSSSSSSSSSS..',
        '...SSSSSSSSSS...',
        '....AAAAAAAA....',
        '...AA......AA...',
        '..AA........AA..',
      ],
    },
  ],
};

/** ソラウツシ：夕焼けの空と海を ひとつの体にうつす ミズカガミの進化（ミズ） */
const sorautsushi: MonsterDesign = {
  ...mizukagami,
  colors: { ...mizukagami.colors, V: NQ.vermilion, O: NQ.apricot, G: NQ.gold },
  layers: [
    ...mizukagami.layers,
    {
      mirror: true,
      y: 5,
      rows: ['....VVVVVVV....', '...VOOOOOOV....', '..VOOOGOOOOV...', '...VOOOOOOV....'],
    },
    { mirror: true, y: 21, rows: ['..GGGGGGGGGGG...', '...VVVVVVVVV....', '....OOOOOOO.....'] },
  ],
};

/**
 * リツリンノヌシ（中ボス）：栗林公園の 池の ぬしの 大きな 錦鯉（紅白）。池の 大波から 左むきに とび上がる。
 * きばの ならぶ 大きな 口、太い いかりまゆの 下で 金色に 光る 目、金の ひげ、金の 先の とげとげの 赤い せびれ、
 * よろいの ような うろこ、赤い ふちの むなびれ（ミズ）
 */
const ritsurinNoNushi: MonsterDesign = {
  size: 40,
  colors: {
    P: NQ.paper,
    C: NQ.cloud,
    W: NQ.white,
    R: NQ.red,
    r: NQ.brick,
    G: NQ.gold,
    N: NQ.night,
    A: NQ.azure,
    S: NQ.sky,
    I: NQ.ice,
    B: NQ.blue,
  },
  rim: { [NQ.paper]: NQ.cloud, [NQ.red]: NQ.brick, [NQ.azure]: NQ.blue },
  rimDepth: 2,
  layers: [
    // 池から あがる 大波（うしろ）
    {
      y: 26,
      rows: [
        '..I.................................I',
        '..SI...............................IS',
        '.ISA..............................ASI',
        '.SAA.I..........................I.AAS',
        '.AAAASI........................ISAAAA',
        '.AAAAAAS......................SAAAAAA',
        '.AAAAAAAAS..I..........I....SAAAAAAAA',
        '.BAAAAAAAAAAAS.........SAAAAAAAAAAAAA',
        '.BBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB',
        '..BBBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB',
        '...BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      ],
    },
    // とげとげの 赤い せびれ（先は 金）
    {
      y: 4,
      rows: [
        '............................G',
        '...........................GR',
        '..........................RRR...G',
        '.........................RRRR..GR',
        '........................RRRrR.RRR',
        '........................RRRRrRRR',
        '........................RRRRRrRRR...G',
        '........................RRRRRRrRR.GR',
        '........................RRRRRRRrRRRR',
        '........................RRRRRRRRrRR',
        '........................RRRRRRRRRrR',
        '........................RRRRRRRRRR..G',
        '........................RRRRRRRRRRRGR',
        '........................RRRRRRRRRRRR',
        '........................RRRRRRRrRRR',
        '........................RRRRRRRRR',
        '.......................RRRRRRRR',
        '.......................RRRRRR',
        '.......................RRRR',
      ],
    },
    {
      rows: [
        '',
        '',
        '..........PPPPPPPP',
        '........PPPPPPPPPPPP',
        '......PPPPPRRRRRRPPPPP',
        '....PPPPRRRRRRRRRRRPPPP',
        '..PPPPPRRRRRRRooRRRRPPPP',
        '.PPPPPPRRRRRooNNRRRRRPPPP',
        '.ooooooPRRRoNGGWNRRRRPPPP',
        '.oWrWrWoPRRNGRGGNRRRPPPPP',
        '.orrrrrroPPNNNNNPPPPPPPPP',
        '.orWrWrroPPPPPPPPPPPPPPPP',
        '.ooooooooPPPPPPPPCPPPPPPP',
        '..PPPPPPPPPPPPPPPPCPPPPP',
        '...PCPPCCPPCCPPCCPPCCPPC',
        '....PPCPPPCPPPRRRRRPPPCP',
        '.....CCPPCCPPRRRRRRRPCCP',
        '......PPCPPPCRRRRRRRRPPP',
        '.......CCPPCCPRRRRRRCPPC',
        '........PPCPPPCPPPCPPPCP',
        '........PCCPPCCPPCCPPCCP',
        '.........PPPRRRPCPPPCPP',
        '.........PPRRRRRCPPCCPP',
        '..........CRRRRPPPCPPP',
        '..........CPPCCPPCCPP',
        '...........PCPPPCPPP',
        '...........CCPPCCPP',
        '............PPPPPP',
        '............PPPPP',
        '..........PPPPPPPP',
        '......PPPPPCPPPPCPPPP',
        '...PPPCPPPCPPPPPCPPPPPP',
        '..RPCPPPCPP....PPCPPPCPRR',
        '.RRRPPP..........PPPPRRRR',
      ],
    },
    // むなびれ（赤い ふち）
    {
      y: 16,
      rows: [
        '....oPPo',
        '...oRPPPo',
        '..oRRrPPo',
        '.oRRrRPPo',
        '.oRrRRPo',
        '.oRRrRPo',
        '..oRRrRo',
        '...oRRo',
        '....oo',
      ],
    },
    // えらの すじ（頭と からだの さかい）
    {
      x: 18,
      y: 3,
      rows: ['.o', '..o', '...o', '...o', '....o', '....o', '....o', '...o', '...o', '..o', '.o'],
    },
    // 金の ひげ
    { x: 1, y: 13, rows: ['G', 'G', '.G'] },
    // 水しぶき
    { x: 7, y: 32, rows: ['I.I', '.W.'] },
    { x: 26, y: 32, rows: ['I.I', '.W.'] },
    { x: 36, y: 20, rows: ['.I.', 'ISI', '.A.'] },
    { x: 33, y: 1, rows: ['I.', 'SI'] },
  ],
};

/** リツリンノヌシ（フィールドに 立つ 32×32）：バトルと 同じ 大波から とび上がる すがたを 小さく */
const ritsurinNoNushiField: MonsterDesign = {
  size: 32,
  colors: {
    P: NQ.paper,
    C: NQ.cloud,
    W: NQ.white,
    R: NQ.red,
    r: NQ.brick,
    G: NQ.gold,
    N: NQ.night,
    A: NQ.azure,
    S: NQ.sky,
    I: NQ.ice,
    B: NQ.blue,
  },
  rim: { [NQ.paper]: NQ.cloud, [NQ.red]: NQ.brick, [NQ.azure]: NQ.blue },
  layers: [
    {
      y: 20,
      rows: [
        '.I............................I',
        '.SI..........................IS',
        '.AAS.I....................I.SAA',
        '.AAAAS..................SAAAAAA',
        '.AAAAAAS..I........I...SAAAAAAA',
        '.BAAAAAAAAAS......SAAAAAAAAAAAA',
        '.BBAAAAAAAAAAAAAAAAAAAAAAAAAAAB',
        '..BBBAAAAAAAAAAAAAAAAAAAAAAABB',
        '...BBBBBBBBBBBBBBBBBBBBBBBBBB',
      ],
    },
    {
      y: 4,
      rows: [
        '.......................G',
        '......................GR...G',
        '.....................RRR..GR',
        '....................RRRrRRRR',
        '....................RRRRrRR..G',
        '....................RRRRRrRRGR',
        '....................RRRRRRrRR',
        '....................RRRRRRRrR',
        '....................RRRRRRRR.G',
        '...................RRRRRRRRRGR',
        '...................RRRRRRRRR',
        '...................RRRRRRR',
        '...................RRRR',
      ],
    },
    {
      y: 2,
      rows: [
        '',
        '........PPPPPP',
        '......PPPPPPPPPP',
        '....PPPPRRRRRRPPP',
        '..PPPPRRRRRooRRPPP',
        '.PPPPPRRRRooNNRRPPP',
        '.oooooPRRoNGGWNRRPPP',
        '.oWrWroPRNGRGNRRPPPP',
        '.orrrrroPPNNNPPPPPPP',
        '.oWrWrroPPPPPPPPPPPP',
        '.oooooooPPPPPPPCPPPP',
        '..PPPPPPPPPPPPPPCPPP',
        '...PCPPCCPPRRRRPPCP',
        '....CCPPCRRRRRRPCCP',
        '.....PPCPPRRRRRPPPP',
        '......CCPPCCPPCCPP',
        '.......PCPPRRRPCPP',
        '........CPRRRRPPC',
        '.........PPCPPCP',
        '..........PPPPP',
        '..........PPPP',
        '........PPPPPPP',
        '.....PPPCPPPCPPP',
        '..RPCPPCP...PCPPRR',
        '.RRRPP.......PPRRR',
      ],
    },
    { y: 15, rows: ['...oPPo', '..oRPPo', '.oRRrPo', '.oRrRo', '..oRRo', '...oo'] },
    { x: 15, y: 4, rows: ['.o', '..o', '..o', '..o', '..o', '..o', '.o', 'o'] },
    { x: 1, y: 14, rows: ['G', 'G'] },
  ],
};

const UDON_COLORS = {
  P: NQ.paper,
  C: NQ.cloud,
  W: NQ.white,
  V: NQ.vermilion,
  A: NQ.apricot,
  Y: NQ.gold,
  G: NQ.gold,
  Q: NQ.ochre,
  R: NQ.red,
  D: NQ.red,
  r: NQ.brick,
  N: NQ.night,
  E: NQ.gold,
  L: NQ.lime,
  l: NQ.leaf,
};

/** 地図の まわり 1 ドットを ink にする（重ねる 部品を くっきり させる）。x-1, y-1 に 置く */
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

/** 部品を ink の ふちどりつきで 置く */
const inked = (rows: readonly string[], x: number, y: number): Layer[] => [
  { x: x - 1, y: y - 1, rows: ring(rows) },
  { x, y, rows },
];

/**
 * オウドンリュウ（県ボス）：讃岐うどんの 大がまから うねって 立ちのぼる 竜。白い めんの からだ、
 * 左むきの 長い はなづらと きばの ならぶ 大きな 口、太い いかりまゆの 下で 光る 金の 目、ひたいの 赤い 宝石、
 * えだわかれ した 金の つの、とげの たてがみ、金の つめの うで、ねぎ、うしろに 大きな 炎（ヒノ）
 */
const oudonRyuLayers: Layer[] = [
  // うしろの 炎
  {
    mirror: true,
    y: 12,
    rows: [
      '...Y',
      '..AY',
      '..AYA......Y',
      '.VAYA.....AY',
      '.VVAV....AYA',
      '..VVV...VAYAV',
      '..VVVV..VVAVV',
      '.VVVVVV.VVVVV',
      '.VVVVVVVVVVVV',
      '..VVVVVVVVVVVV',
      '..VVVVVVVVVVVV',
      '...VVVVVVVVVVVY',
      '...VVVVVVVVVVAY',
      '..VVVVVVVVVVVAYA',
      '..VVVVVVVVVVVVAV',
      '...VVVVVVVVVVVVV',
      '...VVVVVVVVVVVVVV',
      '....VVVVVVVVVVVVV',
      '....VVVVVVVVVVVVVV',
      '.....VVVVVVVVVVVVVV',
      '......VVVVVVVVVVVVVV',
      '.......VVVVVVVVVVVVV',
      '.........VVVVVVVVVVV',
      '...........VVVVVVVVV',
    ],
  },
  // めんの からだ（かまから うねって 立ちのぼる）
  ...inked(
    [
      '...PPPPPP',
      '..PPPPPPPP',
      '..PPCPPCPPP',
      '...PPCPPCPPP',
      '....PPCPPCPPP',
      '.....PPCPPCPPP',
      '......PPCPPCPPP',
      '.......PPCPPCPPP',
      '.......PPPCPPCPPP',
      '........PPPCPPCPPP',
      '........PPPPCPPCPP',
      '.......PPPPCPPCPPP',
      '......PPPPCPPCPPP',
      '.....PPPPCPPCPPP',
      '....PPPPCPPCPPP',
      '...PPPPCPPCPPP',
      '..PPPPCPPCPPP',
      '.PPPPCPPCPPP',
      'PPPPCPPCPPP',
      'PPPCPPCPPP',
      'PPCPPCPPP',
    ],
    19,
    14,
  ),
  // 頭の うしろの 赤い とげの たてがみ
  ...inked(
    [
      '.......RR',
      '...RR.RRR',
      '..RRRRRR...R',
      '.RRRRrRRRRRR',
      'RRRrRRRRRRR',
      '.RRRRRrRR',
      'RRRRrRRRRRRR',
      '.RRRRRRRR',
      'RRRrRRRRRR',
      '.RRRRRR',
      '..RRR',
    ],
    25,
    4,
  ),
  // えだわかれ した 金の つの
  ...inked(
    [
      '..................GGQ',
      '..........G......GGQ',
      '..........GQ...GGQ',
      '.........GGQ.GGQ',
      '........GGGQGGQ',
      '......GGGGQQQ',
      '....GGGQQQ',
      '..GGGQQ',
      'GGQQ',
    ],
    19,
    1,
  ),
  // 頭（左むき。長い はなづら、ひらいた あご、光る 目）
  ...inked(
    [
      '...............PPPP',
      '.............PPPPPPPP',
      '...........PPPPPPPPPPP',
      '.PPP......PPPPPPPRRPPPP',
      'PPPPP...PPPPPPPPPPoooPPPP',
      'PoPPPPPPPPPPPPoooooNNNPPPP',
      'PPPPPPPPPPPPoNNEEEEWNPPPP',
      'PPPPPPPPPPPPPNEEEREENPPPP',
      'PPPPPPPPPPPPPPNNNNNNPPPPP',
      'oooooooooooPPPPPPPPPPPPPP',
      'oWrWrrWrrWoPPPPPPPPPPPPP',
      '.orrrrrRRRRoPPPPPPPPPPP',
      '..orRRRRRRRroPPPPPPPPP',
      '...oWrrWrrWrroPPPPPPPP',
      '....oooooooooPPPPPPPP',
      '.....PPPPPPPPPPPPPPP',
      '.......PPPPPPPPPPPP',
      '.........PPPPPPPP',
    ],
    2,
    3,
  ),
  // つき出した うでと 金の つめ
  ...inked(
    [
      'GG.........PPPPPPPPPP',
      '.GGQ....PPPPCPPCPPPP',
      '...PPPPPPPPPPPPPPPP',
      'GGGQPPPPPPPPPPPP',
      '...PPPPPPPP',
      '.GGQPP',
      'GG',
    ],
    8,
    22,
  ),
  // 大がま
  ...inked(
    [
      'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
      'QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ',
      '.DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
      '.DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
      '..GGGGGGGGGGGGGGGGGGGGGGGGGGGG',
      '..DDDDDDDDDDDDDDDDDDDDDDDDDDDD',
      '...DDDDDDDDDDDDDDDDDDDDDDDDDD',
      '....DDDDDDDDDDDDDDDDDDDDDDDD',
      '......DDDDDDDDDDDDDDDDDDDD',
      '........QQQQQQQQQQQQQQQQ',
      '........QQQQQQQQQQQQQQQQ',
    ],
    8,
    35,
  ),
  // ふちから たれる めんと ねぎ
  { x: 13, y: 34, rows: ['.Ll.....LlL', 'PP.......P', 'P........P', 'P'] },
  { x: 31, y: 34, rows: ['lL.PP', '...P', '...P'] },
];

const oudonRyu: MonsterDesign = {
  size: 48,
  colors: UDON_COLORS,
  rim: { [NQ.red]: NQ.brick, [NQ.paper]: NQ.cloud, [NQ.vermilion]: NQ.brick },
  rimDepth: 2,
  layers: oudonRyuLayers,
};

/**
 * オウドンリュウ 後半：つめたい 水で しめた すがた。炎が うずまく 水と しぶきに、かまが 青に かわり、
 * 目が 白く ぎらりと 光る。まわりに 氷の つぶが はげしく 舞う（ミズ）
 */
const oudonRyuP0: MonsterDesign = {
  size: 48,
  colors: { ...UDON_COLORS, V: NQ.azure, A: NQ.sky, Y: NQ.ice, D: NQ.blue, r: NQ.navy, E: NQ.ice },
  rim: { [NQ.blue]: NQ.navy, [NQ.paper]: NQ.cloud, [NQ.azure]: NQ.blue },
  rimDepth: 2,
  layers: [
    ...oudonRyuLayers,
    // 大波の しぶきが 頭の 上まで はね上がる
    { x: 40, y: 3, rows: ['..Y', '.YA', 'YAV', 'AV.', 'V'] },
    { x: 1, y: 6, rows: ['.Y', 'YA', 'AV', 'V'] },
    { x: 38, y: 10, rows: ['.Y', 'YW', 'AV'] },
    // 氷の つぶ
    { x: 1, y: 31, rows: ['.Y.', 'YWY', '.Y.'] },
    { x: 44, y: 20, rows: ['.Y.', 'YWY', '.Y.'] },
    { x: 33, y: 1, rows: ['W.', 'YW'] },
    { x: 15, y: 0, rows: ['', 'Y', 'W'] },
  ],
};

/**
 * 平賀源内（裏ステージの ラスボス）：江戸時代の 発明家。ちょんまげに 羽織はかま、
 * 両手で エレキテルの はこを かかえ、上の どう線から 金色の 火花が とぶ（ヒカリ）
 */
const hiragaGennai: MonsterDesign = {
  size: 48,
  colors: {
    F: NQ.skinLight,
    f: NQ.skinMid,
    W: NQ.white,
    H: NQ.hairBlack,
    D: NQ.denim,
    N: NQ.navy,
    P: NQ.paper,
    S: NQ.slate,
    s: NQ.gray,
    b: NQ.bark,
    G: NQ.gold,
    Y: NQ.cream,
    R: NQ.red,
  },
  rim: { [NQ.denim]: NQ.navy, [NQ.skinLight]: NQ.skinMid, [NQ.slate]: NQ.gray },
  rimDepth: 2,
  layers: [
    {
      mirror: true,
      rows: [
        '',
        '......................HH',
        '.....................HHH',
        '....................HHHH',
        '.....................HHH',
        '................FFFFFFFF',
        '..............FFFFFFFFFF',
        '............HHFFFFFFFFFF',
        '...........HHHFFFFFFFFFF',
        '...........HHFFoooFFFFFF',
        '...........HHFFWoFFFFFFF',
        '...........HHFFFFFFFFfFF',
        '...........HHFFFFFFFFoFF',
        '...........HHfFFFFFFFFoo',
        '............HffFFFFFFFFF',
        '.............fffffffffff',
        '................ffffffff',
        '..........DDDDDDDDPPFFFF',
        '........DDDDDDDDDDDPPFFF',
        '.......DDDDDDDDDDDDDPPFF',
        '......DDDDDDDDDDDDDDDPPF',
        '......DDDDDGGDDDDDDDDDPP',
        '......DDDDDGGDDDDDDDDRRR',
        '......DDDDDDDDDDDDDDDRRR',
        '......DDDDDDDDDDDDDDDDDD',
        '......DDDDDDDDDDDDDDDDDD',
        '......DDDDDDDDDDDDDDDDDD',
        '......DDDDDDDDDDDDDDDDDD',
        '......DDDDDDDDDDDDDDDDDD',
        '......DDDDDDDDDDDDDDDDDD',
        '......DDDDDDDDDDDDDDDDDD',
        '......DDDDDDDDDDDDDDDDDD',
        '......DDDDDDDDDDDDDDDDDD',
        '.......SSSSSSSSSSSSSSSSS',
        '.......SsSSSSsSSSSsSSSSS',
        '.......SSSSSSSSSSSSSSSSS',
        '......SsSSSSsSSSSsSSSSSS',
        '......SSSSSSSSSSSSSSSSSS',
        '......SsSSSSsSSSSsSSSSSS',
        '.....SSSSSSSSSSSSSSSSSSS',
        '.....SsSSSSsSSSSsSSSSSSS',
        '.....SSSSSSSSSSSSSSSSSSS',
        '....SsSSSSsSSSSsSSSSSSSS',
        '....SSSSSSSSSSSSSSSSSSSS',
        '....SSSSSSSSSSSSSSSSSSSS',
        '.....WWWWW',
        '.....WWWWW',
      ],
    },
    // 羽織の そで（たもと）
    {
      mirror: true,
      y: 19,
      rows: [
        '.....DDN',
        '....DDDN',
        '...DDDDN',
        '..DDDDDN',
        '..DDDDDN',
        '..DDDDDN',
        '..DDDDDN',
        '..DDDDDN',
        '..DDDDDN',
        '..DDDDDN',
        '..DDDDDN',
        '..DDDDDN',
        '..DDDDDN',
        '..DDDDDN',
        '...DDDDN',
        '....DDDN',
      ],
    },
    // うでと 手
    { mirror: true, x: 8, y: 30, rows: ['FFFFFF', 'FFFFFF', 'FffFFF'] },
    // エレキテル（木の はこ・金の かざり）
    {
      x: 14,
      y: 28,
      rows: [
        'GGbbbbbbbbbbbbbbbbGG',
        'bbbbbbbbbbbbbbbbbbbb',
        'bbbGGGGGGGGGGGGGGbbb',
        'bbbbbbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbbbbbb',
        'bbbGGGGGGGGGGGGGGbbb',
        'bbbbbbbbbbbbbbbbbbbb',
        'GGbbbbbbbbbbbbbbbbGG',
      ],
    },
    // ハンドル
    { x: 34, y: 30, rows: ['ss', '.ss', '..ss', '..ss'] },
    // どう線
    { x: 23, y: 23, rows: ['GG', 'GG', 'GG', 'GG', 'GG'] },
    // 火花
    { x: 25, y: 13, rows: ['....YW', '...WY.', '..YW..', '.WY...', 'YW....', 'W.....'] },
    { x: 33, y: 11, rows: ['.Y.', 'YWY', '.Y.'] },
    { x: 8, y: 14, rows: ['.Y.', 'YWY', '.Y.'] },
  ],
};

export const KAGAWA: Readonly<Record<string, MonsterDesign>> = {
  'kagawa-boss-oudon-ryu': oudonRyu,
  'kagawa-boss-oudon-ryu.p0': oudonRyuP0,
  'kagawa-lastboss-hiraga-gennai': hiragaGennai,
  'kagawa-midboss-ritsurin-no-nushi': ritsurinNoNushi,
  'kagawa-midboss-ritsurin-no-nushi.field': ritsurinNoNushiField,
  'kagawa-kororibu': kororibu,
  'kagawa-minoribu': minoribu,
  'kagawa-aogin': aogin,
  'kagawa-tsumuji-uchiwa': tsumujiUchiwa,
  'kagawa-zenigani': zenigani,
  'kagawa-oozenigani': oozenigani,
  'kagawa-mizukagami': mizukagami,
  'kagawa-sorautsushi': sorautsushi,
};
