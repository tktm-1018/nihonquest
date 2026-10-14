/** 和歌山県の モンスター（手描き。docs/06 §4・§6.3〜6.5 の 規格） */
import { NQ } from '../palette';
import type { MonsterDesign } from './design';
import { FACE, HELMET, lord } from './lastbosses';

/** コロミカン：有田みかん。よこに ひらたい まるい みかん、へたと 葉、皮の つぶつぶ（モリ） */
const koromikan: MonsterDesign = {
  size: 32,
  colors: {
    O: NQ.orange,
    a: NQ.amber,
    Y: NQ.yellow,
    K: NQ.bark,
    E: NQ.leaf,
    M: NQ.lime,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.orange]: NQ.amber, [NQ.leaf]: NQ.green },
  layers: [
    // みかんの からだ
    {
      mirror: true,
      y: 8,
      rows: [
        '..........OOOOOO',
        '.......OOOOOOOOO',
        '.....OOOOOOOOOOO',
        '....OOOOOOOOOOOO',
        '...OOOOOOOOOOOOO',
        '...OOOOOOOOOOOOO',
        '..OOOOOOOOOOOOOO',
        '..OOOOOOOOOOOOOO',
        '..OOOOOOOOWWOOOO',
        '..OOOOOOOOWoOOOO',
        '..OOOOOOOOWoOOOO',
        '..OOOOOOOpOOOOOO',
        '..OOOaOOOOOOOOoO',
        '..OOOOOOOOOOOOOo',
        '...OOOOOOOOOOOOO',
        '...OOOOOOOaOOOOO',
        '....OOOOOOOOOOOO',
        '.....OOOOOOOOOOO',
        '.......OOOOOOOOO',
        '..........OOOOOO',
      ],
    },
    // 足
    { mirror: true, y: 28, rows: ['........aa......', '.......aaa......'] },
    // へた と 葉
    { x: 15, y: 4, rows: ['..EEE.', 'KEMEEE', 'KKEEE.', 'KK....'] },
    // 皮の つぶつぶ・つや
    { x: 13, y: 11, rows: ['a'] },
    { x: 19, y: 13, rows: ['a'] },
    { x: 6, y: 11, rows: ['YY', 'Y.', 'Y.'] },
  ],
};

/** モリモリミカン：コロミカンの しんか。大きな 葉の 前立て、皮を むいた おなかに ふさ、きりっと まゆ（モリ） */
const morimoriMikan: MonsterDesign = {
  size: 32,
  colors: {
    O: NQ.orange,
    a: NQ.amber,
    A: NQ.apricot,
    Y: NQ.yellow,
    K: NQ.bark,
    E: NQ.leaf,
    M: NQ.lime,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.orange]: NQ.amber, [NQ.leaf]: NQ.green },
  layers: [
    // 大きな 葉の 前立て
    {
      mirror: true,
      y: 1,
      rows: [
        '.........EE.....',
        '........EMEE....',
        '........EMMEE...',
        '.........EEEEE..',
        '..........EEEEE.',
        '............EEKK',
        '..............KK',
      ],
    },
    // うで
    { mirror: true, y: 10, rows: ['..OO', '.OOO', '.OOa', '..OO', '...O'] },
    // みかんの からだ（下は 皮を むいて ふさが 見える）
    {
      mirror: true,
      y: 8,
      rows: [
        '.........OOOOOOO',
        '......OOOOOOOOOO',
        '....OOOOOOOOOOOO',
        '...OOOOOOOOOOOOO',
        '..OOOOOOOOOOOOOO',
        '..OOOOOOOooOOOOO',
        '..OOOOOOOOWoOOOO',
        '..OOOOOOOOWoOOOO',
        '..OOOOOOOOWoOOOO',
        '..OOOOOOOpOOOooo',
        '..OOOOOOOOOOOOOO',
        '..OOOaOOOOOOOOOO',
        '..OOOOOOOOOOOOOO',
        '..OOOOOOOOOOaOOO',
        '...OOOOOOOOOOOOO',
        '...OOOOaOOOOOOOO',
        '....OOOOOOOOOOOO',
        '.....OOOOOOOOOOO',
        '......OOOOOOOOOO',
        '........OOOOOOOO',
        '.........aa.....',
        '........aaa.....',
      ],
    },
    // つや
    { x: 5, y: 11, rows: ['YY', 'Y.'] },
  ],
};

/** カンカンタン：紀州備長炭。銀色に 光る かたい 炭の からだ、ふしと ひび、頭に 3 本の炎（ヒノ） */
const kankantan: MonsterDesign = {
  size: 32,
  colors: {
    L: NQ.slate,
    N: NQ.night,
    g: NQ.silver,
    W: NQ.white,
    p: NQ.blush,
    R: NQ.red,
    V: NQ.vermilion,
    A: NQ.apricot,
    G: NQ.gold,
    C: NQ.cream,
  },
  rim: { [NQ.slate]: NQ.night },
  layers: [
    // 頭の 炎
    {
      mirror: true,
      y: 1,
      rows: [
        '...............C',
        '..............AG',
        '..............VG',
        '...........A.VAG',
        '..........VGVVAA',
        '..........VAAVVA',
      ],
    },
    // 炭の からだ
    {
      mirror: true,
      y: 7,
      rows: [
        '.........RRRRRRR',
        '.........LLLLLLL',
        '........LLgLLLLL',
        '........LLgLLLLL',
        '.........LgLLLLL',
        '.........LLLWWLL',
        '.........LLLWoLL',
        '.........LLLWoLL',
        '.........LLpLLoL',
        '........LLLLLLLo',
        '........LgLLLLLL',
        '........LgLLLLLL',
        '.........LLLLLLL',
        '.........NNNNNNN',
        '.........LLLLLLL',
        '........LLgLLLLL',
        '........LLgLLLLL',
        '.........LLLLLLL',
        '.........LLLLLLL',
        '..........LLLLLL',
        '...........LL...',
        '...........LL...',
      ],
    },
    // うで
    { mirror: true, y: 15, rows: ['......LL', '.....LL.', '.....L..'] },
    // ひび
    { x: 19, y: 22, rows: ['N', '.N', 'N.'] },
  ],
};

/** ビンチョウホムラ：カンカンタンの しんか。ひびから 赤く 光る 太い 炭の からだ、大きな 炎の かんむり、きりっと まゆ、光る こぶし（ヒノ） */
const binchoHomura: MonsterDesign = {
  size: 32,
  colors: {
    L: NQ.slate,
    N: NQ.night,
    g: NQ.silver,
    W: NQ.white,
    p: NQ.blush,
    R: NQ.red,
    V: NQ.vermilion,
    A: NQ.apricot,
    G: NQ.gold,
    C: NQ.cream,
  },
  rim: { [NQ.slate]: NQ.night },
  layers: [
    // 大きな 炎の かんむり
    {
      mirror: true,
      y: 1,
      rows: [
        '.......C.......C',
        '.......G......AG',
        '......AG......VG',
        '......VGA..A.VAG',
        '.....VVAG.VGVVAA',
        '.....VVVAVVAAVVA',
        '......VVVVVVVVVV',
      ],
    },
    // 炭の からだ（ひびが 赤く 光る）
    {
      mirror: true,
      y: 8,
      rows: [
        '......RRRRRRRRRR',
        '......LLLLLLLLLL',
        '.....LLgLLLLLLLL',
        '.....LLgLLLooLLL',
        '.....LLgLLLLWoLL',
        '.....LLLLLLLWoLL',
        '.....LLLLLLLWoLL',
        '.....LLLLLLpLLoo',
        '......LLLLLLLLLL',
        '......LLRLLLLLLL',
        '......LLLRLLLLLL',
        '......LLRLLLLLLL',
        '......NNNNNNNNNN',
        '......LLLLLLLRLL',
        '.....LLgLLLLLLRL',
        '.....LLgLLLLLRLL',
        '......LLLLLLLLLL',
        '.......LLLLLLLLL',
        '........LLL.....',
        '.......LLLL.....',
        '......NNNNN.....',
      ],
    },
    // 光る こぶし
    { mirror: true, y: 14, rows: ['....LL', '..RLL.', '.RAR..', '..R...'] },
  ],
};

/** トウダイン：潮岬の 白い 灯台。金の わっか、あかりの まどから 光の すじ、ろうか、みさきの 岩（ヒカリ） */
const toudain: MonsterDesign = {
  size: 32,
  colors: {
    W: NQ.white,
    N: NQ.navy,
    I: NQ.ice,
    Y: NQ.cream,
    G: NQ.gold,
    Q: NQ.ochre,
    L: NQ.slate,
    g: NQ.silver,
    p: NQ.blush,
  },
  rim: { [NQ.white]: NQ.cloud, [NQ.silver]: NQ.gray },
  layers: [
    // 金の わっか
    { mirror: true, y: 1, rows: ['............GGGG', '...........G....', '............QQQQ'] },
    // 光の すじ
    {
      mirror: true,
      y: 6,
      rows: [
        '.YY.............',
        '.YYYY...........',
        '.YYYYYYYYYY.....',
        '.YYYY...........',
        '.YY.............',
      ],
    },
    // 灯台
    {
      mirror: true,
      y: 4,
      rows: [
        '...............G',
        '.............NNN',
        '............NNNN',
        '...........IYYYY',
        '...........IYYYY',
        '...........IYIYY',
        '.........NNNNNNN',
        '..........WWWWWW',
        '..........WWWWWW',
        '..........WWWWWW',
        '..........WWWWWW',
        '..........WWWWWW',
        '.........WWWWWWW',
        '.........WWWWWWW',
        '.........WWWWWWW',
        '.........WWWWWWW',
        '.........WWWWWWW',
        '.........WWWWWWW',
        '........WWWWWWNN',
        '........WWWWWWNN',
        '........WWWWWWNN',
        '........WWWWWWNN',
        '....ggLLLLLLLLLL',
        '..gggLLLLgLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '...LLLLLLLLLLLLL',
      ],
    },
    // 顔（白い かべに 黒い 目）
    {
      mirror: true,
      y: 16,
      rows: ['...........Wo...', '...........Wo...', '..........p...o.', '...............o'],
    },
  ],
};

/** マモリトウダイ：トウダインの しんか。赤い おびの 灯台、四方へ のびる 光、きりっと まゆ、赤白の うきわを もつ（ヒカリ） */
const mamoriToudai: MonsterDesign = {
  size: 32,
  colors: {
    W: NQ.white,
    N: NQ.navy,
    I: NQ.ice,
    Y: NQ.cream,
    G: NQ.gold,
    Q: NQ.ochre,
    L: NQ.slate,
    g: NQ.silver,
    p: NQ.blush,
    R: NQ.red,
  },
  rim: { [NQ.white]: NQ.cloud, [NQ.red]: NQ.brick },
  layers: [
    // 光の すじ（大きく）
    {
      mirror: true,
      y: 3,
      rows: [
        '.Y..............',
        '.YYY............',
        '.YYYYYY.........',
        '.YYYYYYYYYY.....',
        '.YYYYYY.........',
        '.YYY............',
        '.Y..............',
      ],
    },
    // 灯台
    {
      mirror: true,
      y: 2,
      rows: [
        '...............G',
        '.............NNN',
        '...........GNNNN',
        '...........IYYYY',
        '...........IYYYY',
        '...........IYIYY',
        '.........NNNNNNN',
        '.........N.N.N.N',
        '.........WWWWWWW',
        '.........WWWWWWW',
        '.........WWWooWW',
        '.........WWWWWoW',
        '.........WWWWWoW',
        '.........WWWWpWW',
        '.........WWWWWWo',
        '........RRRRRRRR',
        '........RRRRRRRR',
        '........WWWWWWWW',
        '........WWWWWWWW',
        '........WWWWWWNN',
        '........WWWWWWNN',
        '........WWWWWWNN',
        '........WWWWWWNN',
        '....ggLLLLLLLLLL',
        '..gggLLLLgLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '...LLLLLLLLLLLLL',
      ],
    },
    // 赤白の うきわ（左手）
    { x: 1, y: 16, rows: ['.RRWR.', 'R....W', 'W....R', 'R....R', '.WRRW.'] },
    { x: 7, y: 17, rows: ['WW', 'WW'] },
  ],
};

/** シブキン：那智の 滝の しぶきから 生まれた まるい 生きもの。上から おちる 白い 水の すじ、ひれ（ミズ） */
const shibukin: MonsterDesign = {
  size: 32,
  colors: {
    I: NQ.ice,
    S: NQ.sky,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.ice]: NQ.sky, [NQ.sky]: NQ.azure },
  layers: [
    // 上から おちる 滝の しぶき
    {
      mirror: true,
      x: 4,
      y: 1,
      rows: [
        '.WW.....',
        '.WI.....',
        '.WI..WW.',
        '.WI..WI.',
        '.WI..WI.',
        '.WI..WI.',
        '.WI..WI.',
        '.WI..WI.',
        '.WI..WI.',
      ],
    },
    // ひれ
    { mirror: true, x: 1, y: 19, rows: ['SS.', 'SSS', 'SSS', 'SS.'] },
    // しぶきの からだ
    {
      mirror: true,
      y: 10,
      rows: [
        '..........IIIIII',
        '........IIIIIIII',
        '......IIIIIIIIII',
        '.....IIIIIIIIIII',
        '....IIIIIIIIIIII',
        '....IIIIIIIIIIII',
        '...IIIWWIIIIIIII',
        '...IIIWoIIIIIIII',
        '...IIIWoIIIIIIII',
        '...IIIIIIIIIIIII',
        '...IpIIIIIIIIooo',
        '...IIIIIIIIIIIoo',
        '....IIIIIIIIIIII',
        '....IIIIIIIIIIII',
        '.....IIIIIIIIIII',
        '......IIIIIIIIII',
        '.......IIIIIIIII',
        '........IIIIIIII',
        '.........IIIIIII',
        '.........IIIIIII',
      ],
    },
    // つや
    { x: 8, y: 12, rows: ['WW', 'W.'] },
  ],
};

/** オオタキマル：シブキンの しんか。せなかに 那智の 滝を せおった すがた。きりっと まゆ、大きな ひれ（ミズ） */
const ootakimaru: MonsterDesign = {
  size: 32,
  colors: {
    A: NQ.azure,
    S: NQ.sky,
    I: NQ.ice,
    W: NQ.white,
    c: NQ.cloud,
    p: NQ.blush,
  },
  rim: { [NQ.azure]: NQ.blue, [NQ.sky]: NQ.azure },
  layers: [
    // せなかの 滝
    {
      mirror: true,
      x: 3,
      y: 1,
      rows: [
        'WWWWWWWWWWWWW',
        'WWIWWIWWIWWIW',
        'WWIWWIWWIWWIW',
        'WWIWWIWWIWWIW',
        'WWIWWIWWIWWIW',
        'WWIWWIWWIWWIW',
        'WWIWWIWWIWWIW',
        'WWIWWIWWIWWIW',
        'WWIWWIWWIWWIW',
        'WWIWWIWWIWWIW',
        'WWIWWIWWIWWIW',
        '.WIWWIWWIWWIW',
        '..IWWIWWIWWIW',
      ],
    },
    // 滝つぼの しぶき
    { mirror: true, x: 1, y: 27, rows: ['cc.', '.cc'] },
    // からだ
    {
      mirror: true,
      y: 9,
      rows: [
        '.........AAAAAAA',
        '.......AAAAAAAAA',
        '......AAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '....oooAAAAAAAAA',
        '...AAAAooAAAAAAA',
        '...AWWoAAAAAAAAA',
        '...AWWoAAAAAAAAA',
        '..AAAAAAAAAAAAAA',
        '..AAAAAAAAAAAAAA',
        '..AApAAAAAoooooo',
        '..AAAAAAAAAAoooo',
        '..AAAAAAAAAAAAAA',
        '..AAAAAAAAAAAAAA',
        '...AAAAAAAAAAAAA',
        '...AAAAAAAAAAAAA',
        '....AAAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '......AAAAAAAAAA',
        '.......AAAAAAAAA',
        '........AAAAAAAA',
      ],
    },
    // 大きな ひれ
    { mirror: true, x: 1, y: 22, rows: ['.SS.', 'SSSS', 'SSSS', '.SSS', '..SS'] },
  ],
};

/**
 * ウメボシヨコヅナ（中ボス）：南高梅の うめぼしの 大横綱。りょう うでを まげて ちからこぶを 見せつけ、
 * 大きく 足を ひらいて しこを ふむ。へたの 葉の かざりと 金の つの、太い 怒りまゆ と 光る 黄色い 目、
 * くいしばった きば、白い つなと こん色の まわし（金の ふち）、まわりに すっぱい 怒りの ほのお（ツチ → ヒノ）
 */
const umeboshiYokozuna: MonsterDesign = {
  size: 40,
  colors: {
    R: NQ.red,
    r: NQ.brick,
    A: NQ.apricot,
    P: NQ.vermilion,
    K: NQ.bark,
    Y: NQ.yellow,
    W: NQ.white,
    c: NQ.cloud,
    N: NQ.navy,
    G: NQ.gold,
    Q: NQ.ochre,
    E: NQ.leaf,
    e: NQ.green,
  },
  rim: { [NQ.red]: NQ.brick },
  rimDepth: 2,
  layers: [
    // 怒りの ほのお（こぶしの 上）
    { mirror: true, x: 1, y: 0, rows: ['....', '.P..', 'PAP.'] },
    // うめぼしの からだ、するどい 顔、まわし、しこを ふむ 足
    {
      mirror: true,
      rows: [
        '.......G............',
        '.......GG.......E...',
        '........GG.....EEE..',
        '........GGG...eEEEEK',
        '.........GGGRRRRRRKK',
        '.........QGGRRRRRRRR',
        '........RRRRRRRRRRRR',
        '.......RRAARRRRRRRRR',
        '.......RAARRRRRRRRRR',
        '......RRARRRRRRRRRRR',
        '......RRRooRRRRRRRRR',
        '......RRRoooooRRRRRR',
        '......RRRRrooooooRRR',
        '......RRRrrrYYYoooRR',
        '......RRRrrrrYooorRR',
        '......RRRRrrrrrrrRRR',
        '......RRRRRRRRRRRRRR',
        '......RRRRRRRRRooooo',
        '......RRRRRRRRoWoWWW',
        '......RRRRRRRRoooooo',
        '......RRRRRRRRoWWoWW',
        '......RRRRRRRRRooooo',
        '......RRRRRRRRRRRRRR',
        '......RRRRRRRRRRRRRR',
        '......WWcWWcWWcWWcWW',
        '......cWWcWWcWWcWWcW',
        '......GGGGGGGGGGGGGG',
        '......NNNNNNNNNNNNNN',
        '.....RRNNNNNNNNNNNNN',
        '....RRRRNNoNNNoNNNoN',
        '...RRRRRRRR.........',
        '...RRRRRRRR.........',
        '..RRRRRRRRR.........',
        '..RRRRRRRR..........',
        '..RRRRRRR...........',
        '..RRRRRRR...........',
        '..RRRRRRR...........',
        '.RRRRRRRRR..........',
        '.RRRRRRRRRR.........',
      ],
    },
    // ちからこぶを 見せる うでと こぶし
    {
      mirror: true,
      y: 3,
      rows: [
        '.RRRR',
        '.RRRRR',
        '.RoRoR',
        '.RRRRR',
        '.RRRRR',
        '..RRRR',
        '..RRRR',
        '..RRRR',
        '..RRRRR',
        '..RRRRRRR',
        '...RRRRRRR',
        '....RRRRRR',
        '.....RRRRR',
      ],
    },
    // ちからこぶの つや
    { mirror: true, x: 4, y: 12, rows: ['AA', '.A'] },
    // しこの 土けむり
    { mirror: true, x: 11, y: 36, rows: ['c...', '.cc.'] },
    // しわ
    { x: 27, y: 9, rows: ['.rr', 'r..'] },
    { x: 9, y: 21, rows: ['rr.', '..r'] },
  ],
};

/** ウメボシヨコヅナ（フィールドに立つ 32×32） */
const umeboshiYokozunaField: MonsterDesign = {
  size: 32,
  colors: {
    R: NQ.red,
    r: NQ.brick,
    A: NQ.apricot,
    Y: NQ.yellow,
    W: NQ.white,
    c: NQ.cloud,
    N: NQ.navy,
    G: NQ.gold,
    K: NQ.bark,
    E: NQ.leaf,
  },
  rim: { [NQ.red]: NQ.brick },
  layers: [
    // からだ、顔、まわし、足
    {
      mirror: true,
      y: 1,
      rows: [
        '................',
        '.......G....E...',
        '........G..EEEEK',
        '........GRRRRRKK',
        '.......GRRRRRRRR',
        '......RRRRRRRRRR',
        '.....RRAARRRRRRR',
        '.....RARRRRRRRRR',
        '.....RRooRRRRRRR',
        '.....RRRoooooRRR',
        '.....RRrrYYooooR',
        '.....RRrrrYoorRR',
        '.....RRRRRRRRRRR',
        '.....RRRRRRooooo',
        '.....RRRRRRoWoWW',
        '.....RRRRRRooooo',
        '.....RRRRRRRoWWo',
        '.....RRRRRRRRRRR',
        '.....WcWWcWWcWWc',
        '.....GGGGGGGGGGG',
        '.....NNNNNNNNNNN',
        '....RRNNNoNNNoNN',
        '...RRRRRRR......',
        '...RRRRRRR......',
        '..RRRRRRR.......',
        '..RRRRRR........',
        '..RRRRRR........',
        '..RRRRRR........',
        '.RRRRRRRR.......',
        '.RRRRRRRRR......',
      ],
    },
    // ちからこぶの うで
    {
      mirror: true,
      y: 3,
      rows: ['.RRR', '.RoR', '.RRR', '..RR', '..RR', '..RRR', '..RRRRR', '...RRRRR', '....RRR'],
    },
    { mirror: true, x: 3, y: 9, rows: ['A'] },
  ],
};

/**
 * クロシオリュウの 左半分：うしろへ そりかえる 長い 金の 角、ひたいの 赤い 宝玉、頭の とげ、
 * 白い しぶきの とがった たてがみ、太い まゆの 下で 光る 目、きばの ならぶ 大きな 口、
 * 左右に ひろげた つめの 前足、大波から 立ちあがる からだ
 */
const RYU_HORN = [
  '..GG....................',
  '..GGG...................',
  '...GGQ..................',
  '....GGQ.................',
  '.....GGQ................',
  '......GGQQ..............',
  '.......GGGQQ............',
  '.........GGGQQ..........',
  '...........GGQQ.........',
];
const RYU_MANE = [
  '........WW..............',
  '......WWWW..............',
  '..WWWWWWWW..............',
  '.....WWWWWW.............',
  '.WWWWWWWWWW.............',
  '....WWWWWWW.............',
  '..WWWWWWWWW.............',
  '.WWWWWWWWWW.............',
  '....WWWWWWW.............',
  '...WWWWWWWW.............',
  '.....WWWWWW.............',
  '.......WWWW.............',
];
const RYU_HEAD = [
  '.......................N',
  '..................N...NB',
  '..................NB.NBB',
  '.................NBBNBBB',
  '...............NNBBBBBBB',
  '.............NNBBBBBBBBG',
  '...........NNBBBBBBBBBGR',
  '..........NBBBBBBBBBBBGR',
  '.........NBBBBBBBBBBBBBG',
  '........NBBNNNBBBBBBBBBB',
  '........NBBBBNNNNBBBBBBB',
  '.......NBBBBBBBNNNNNBBBB',
  '.......NBBBBBNEEEENNNNBB',
  '.......NBBBBBNNEEEoNNBBB',
  '.......NBBBBBBNNNNNNBBBB',
  '........NBBBBBBBBBBBBBBB',
  '........NBBBBBBBBBBBBoBB',
  '.........NBBBBBBBBBBBBBB',
  '.........NBBoooooooooooo',
  '..........NoWWoooWWooooR',
  '..........NooWooooWooRRR',
  '..........NBooooRRRRRRRR',
  '...........NBoWooooWoooo',
  '...........NBoWWoooWWooo',
  '............NBBooooooooo',
  '.............NBBBBBBBBBB',
];
const RYU_BODY = [
  '...........NBBBBBBBBBBBB',
  '..........NBBBBBBBSSSSSS',
  '..........NBBBBBBBIIIIII',
  '.........NBBBBBBBBSSSSSS',
  '.........NBBBBBBBBIIIIII',
  '........NBBBBBBBBBSSSSSS',
  '........NBBBBBBBBBIIIIII',
  '.......NBBBBBBBBBBSSSSSS',
  '.......NBBBBBBBBBBIIIIII',
  '......NBBBBBBBBBBBSSSSSS',
];
const RYU_WAVE = [
  '..WWW...................',
  '.WWIIW..................',
  '.WIBBIW.................',
  '.WBBBBIW................',
  '.BBBBBBIW.....WWW.......',
  '.BBBBBBBIW...WWIIW......',
  '.ABBBBBBBIW.WIBBBIW.....',
  '.ABBBBBBBBIWIBBBBBIW....',
  '.ABBBBBBBBBBBBBBBBBIWWWW',
  '.BBBBBBBBBBBBBBBBBBBBIII',
  '.BBNBBBBBBBBBBNBBBBBBBBB',
  '.BBBNNBBBBBBBBBNNBBBBBBB',
  '..BBBBBBBBBBBBBBBBBBBBBB',
  '..NBBBBBBNBBBBBBBBNBBBBB',
  '...BBBBBBBNNBBBBBBBNNBBB',
  '...NNNNNNNNNNNNNNNNNNNNN',
];
const RYU_ARM = [
  '.W.W.W........',
  '.W.W.W........',
  '.BBBBB........',
  '.ABBBBB.......',
  '..ABBBB.......',
  '..ABBBB.......',
  '...ABBBB......',
  '....ABBBB.....',
  '.....ABBBB....',
  '......ABBBB...',
  '.......ABBBBB.',
  '........NBBBBB',
];

const ryuColors = {
  N: NQ.navy,
  B: NQ.blue,
  A: NQ.azure,
  S: NQ.sky,
  I: NQ.ice,
  W: NQ.white,
  G: NQ.gold,
  Q: NQ.ochre,
  R: NQ.red,
  E: NQ.yellow,
};

const ryuLayers = [
  { mirror: true, y: 9, rows: RYU_MANE },
  { mirror: true, y: 1, rows: RYU_HORN },
  { mirror: true, y: 2, rows: RYU_HEAD },
  { mirror: true, y: 27, rows: RYU_BODY },
  { mirror: true, y: 31, rows: RYU_WAVE },
  { mirror: true, y: 21, rows: RYU_ARM },
  // むねの うろこの つや
  { x: 20, y: 28, rows: ['AA', 'A.'] },
];

/**
 * クロシオリュウ（県ボス）：潮岬の おきを ながれる 黒潮の 海竜。大波から 立ちあがり、つめの 前足を ひろげて ほえる。
 * うしろへ そる 長い 金の 角、ひたいの 赤い 宝玉、太い まゆの 下で 黄色く 光る 目、きばの 口、白い しぶきの たてがみ（ミズ → カゼ）
 */
const kuroshioRyu: MonsterDesign = {
  size: 48,
  colors: ryuColors,
  rim: { [NQ.blue]: NQ.navy, [NQ.white]: NQ.cloud },
  rimDepth: 2,
  layers: ryuLayers,
};

/**
 * クロシオリュウ 後半（カゼ）：からだが 青みどりに かわり、目は 赤く もえる。
 * つめの まわりに 風の うず、海を はしる 風の すじ
 */
const kuroshioRyuP0: MonsterDesign = {
  ...kuroshioRyu,
  colors: { ...ryuColors, B: NQ.teal, A: NQ.aqua, S: NQ.mint, E: NQ.red, M: NQ.mint },
  rim: { [NQ.teal]: NQ.navy, [NQ.white]: NQ.cloud },
  layers: [
    ...ryuLayers,
    // 目の 光
    { mirror: true, x: 14, y: 14, rows: ['W'] },
    // つめの まわりの 風の うず
    { mirror: true, x: 6, y: 20, rows: ['.MM', 'M..', 'M.M', '.M.'] },
    // 海を はしる 風の すじ
    { mirror: true, x: 1, y: 39, rows: ['.MMMM...', 'MM..MMM.'] },
    { mirror: true, x: 2, y: 43, rows: ['MMMM....', '...MMMM.'] },
  ],
};

/**
 * 徳川吉宗：大きな 金の 鍬形（くわがた）と 葵（あおい）の 前立て、紀州（木の 国）の みどりの よろい。
 * 大きな 肩の よろい（そで）と 黒い 陣羽織、するどい まゆ、まわりに 金の 光（モリ）
 */
const tokugawaYoshimune = lord(
  [
    '....GYG.................',
    '....GYYG................',
    '.....GYYG...............',
    '......GYYG..........GGGG',
    '.......GYYG........GNNNY',
    '........GYYG......GNNYYY',
    '.........GYYGG....GNNNYY',
    '...........GYYGG..GYYNNN',
    '.............GYYGGGYYYNN',
    '...............GGGGGGGGG',
    ...HELMET,
    ...FACE,
  ],
  {
    N: NQ.night,
    L: NQ.slate,
    K: NQ.forest,
    S: NQ.green,
    G: NQ.gold,
    Y: NQ.yellow,
    R: NQ.red,
    T: NQ.forest,
    H: NQ.bark,
    C: NQ.cream,
  },
  { [NQ.green]: NQ.forest },
  [
    // 陣羽織（よろいの 上に はおる 黒い ベスト。むねの まえが あく）
    { mirror: true, x: 16, y: 22, rows: ['NNN', 'NNN', 'NNN', 'NNN', 'NNN', 'NNN', 'NNN', 'NN.', 'NN.'] },
    // するどい まゆ
    { mirror: true, x: 18, y: 15, rows: ['o..', 'Foo', 'FWo'] },
    // まわりの 金の 光
    { x: 2, y: 8, rows: ['GC', 'CG'] },
    { x: 43, y: 6, rows: ['CG', 'GC'] },
    { x: 1, y: 11, rows: ['CG', 'GC'] },
    { x: 45, y: 13, rows: ['GC', 'CG'] },
  ],
);

export const WAKAYAMA: Readonly<Record<string, MonsterDesign>> = {
  'wakayama-koromikan': koromikan,
  'wakayama-morimori-mikan': morimoriMikan,
  'wakayama-kankantan': kankantan,
  'wakayama-bincho-homura': binchoHomura,
  'wakayama-toudain': toudain,
  'wakayama-mamori-toudai': mamoriToudai,
  'wakayama-shibukin': shibukin,
  'wakayama-ootakimaru': ootakimaru,
  'wakayama-midboss-umeboshi-yokozuna': umeboshiYokozuna,
  'wakayama-midboss-umeboshi-yokozuna.field': umeboshiYokozunaField,
  'wakayama-boss-kuroshio-ryu': kuroshioRyu,
  'wakayama-boss-kuroshio-ryu.p0': kuroshioRyuP0,
  'wakayama-lastboss-tokugawa-yoshimune': tokugawaYoshimune,
};
