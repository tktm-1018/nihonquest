/** 熊本県の モンスター（手描き。docs/06 §4・§6.3〜6.5 の 規格） */
import { NQ } from '../palette';
import type { Layer, MonsterDesign } from './design';
import { BEARD_FACE, HELMET, lord } from './lastbosses';

/**
 * ボスの 部品（うで・頭など）を ink で ふちどって 重ねる 2 まいの レイヤー。体の 上に 重ねても くっきり 分かれる。
 * mirror の 部品は 地図を まん中（右はし）まで 書き、まん中の がわは ふちどらない
 */
function part(rows: readonly string[], x: number, y: number, mirror = true): Layer[] {
  const w = Math.max(...rows.map((r) => r.length));
  const at = (i: number, j: number) => (rows[j]?.[i] ?? '.') !== '.';
  const edge = Array.from({ length: rows.length + 2 }, (_, j) =>
    Array.from({ length: mirror ? w + 1 : w + 2 }, (_, i) =>
      !at(i - 1, j - 1) && (at(i - 2, j - 1) || at(i, j - 1) || at(i - 1, j - 2) || at(i - 1, j)) ? 'o' : '.',
    ).join(''),
  );
  return [
    { mirror, x: x - 1, y: y - 1, rows: edge },
    { mirror, x, y, rows },
  ];
}

/** シマダマ：まんまるの スイカ。こい みどりの しまもよう、上に つるの ヘタと 葉っぱ（モリ） */
const shimadama: MonsterDesign = {
  size: 32,
  colors: {
    L: NQ.leaf,
    G: NQ.green,
    M: NQ.lime,
    B: NQ.bark,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.leaf]: NQ.green },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '...........MM..B',
        '..........MMMM.B',
        '..........MMMMMB',
        '..........LLLLLL',
        '.......LLLLLLLLL',
        '.....LLLLLLLLLLL',
        '....LLLLLLLLLLLL',
        '...LLLLLLLLLLLLL',
        '..LLLLLLLLLLLLLL',
        '..LLLLLLLLLLLLLL',
        '..LLLLLLLLLLLLLL',
        '..LLLLLLLLLLLLLL',
        '..LLLLLLLLWWLLLL',
        '..LLLLLLLLWoLLLL',
        '..LLLLLLLLWoLLLL',
        '..LLLLpLLLLLLLoL',
        '..LLLLLLLLLLLLLo',
        '..LLLLLLLLLLLLLL',
        '..LLLLLLLLLLLLLL',
        '..LLLLLLLLLLLLLL',
        '...LLLLLLLLLLLLL',
        '....LLLLLLLLLLLL',
        '.....LLLLLLLLLLL',
        '.......LLLLLLLLL',
        '..........LLLLLL',
        '..........LLL...',
        '.........GGGG...',
        '.........GGGG...',
      ],
    },
    // こい みどりの しまもよう
    {
      mirror: true,
      y: 5,
      rows: [
        '..........G....G',
        '.........G.....G',
        '.....G...G.....G',
        '....G....G.....G',
        '....G...G......G',
        '...G....G......G',
        '...G....G......G',
        '...G....G......G',
        '...G....G......G',
        '...G....G......G',
        '...G....G......G',
        '...G....G......G',
        '...G....G......G',
        '...G....G......G',
        '...G....G......G',
        '....G...G......G',
        '....G....G.....G',
        '.....G...G.....G',
        '......G..G.....G',
        '.........G.....G',
        '..........G....G',
      ],
    },
  ],
};

/** カルデラン：阿蘇山の 火口が 頭に なった 小さな 山。草原の すそ、火口から けむりと 炎（ヒノ） */
const karuderan: MonsterDesign = {
  size: 32,
  colors: {
    L: NQ.leaf,
    G: NQ.green,
    g: NQ.gray,
    N: NQ.slate,
    W: NQ.white,
    c: NQ.cloud,
    V: NQ.vermilion,
    A: NQ.apricot,
    Y: NQ.gold,
    p: NQ.blush,
  },
  rim: { [NQ.leaf]: NQ.green, [NQ.gray]: NQ.slate },
  layers: [
    // けむりと 炎
    { x: 8, y: 1, rows: ['.cW.', 'WWWc', '.WW.'] },
    {
      mirror: true,
      y: 2,
      rows: ['..............Y.', '.............AYA', '.............AYA', '...........VAYAV'],
    },
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '..........gggggg',
        '.........gNooooN',
        '........gggggggg',
        '.......ggggggggg',
        '......ggLLLLLLLL',
        '.....gLLLLLLLLLL',
        '.....LLLLLLLLLLL',
        '....LLLLLLLLLLLL',
        '....LLLLLLLLLLLL',
        '...LLLLLLLWWLLLL',
        '...LLLLLLLWoLLLL',
        '...LLLLLLLWoLLLL',
        '...LLLpLLLLLLLoL',
        '..LLLLLLLLLLLLLo',
        '..LLLLLLLLLLLLLL',
        '..LLLLLLLLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.GGGGGGGGGGGGGGG',
        '....GGG.........',
        '....GGG.........',
      ],
    },
  ],
};

/** エビグルマ：天草の 車えび。しまもようの からだ、長い ひげ、下に ひろがる 尾びれ（ミズ） */
const ebiguruma: MonsterDesign = {
  size: 32,
  colors: {
    C: NQ.cream,
    E: NQ.beige,
    V: NQ.vermilion,
    R: NQ.brick,
    A: NQ.azure,
    S: NQ.sky,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.cream]: NQ.beige, [NQ.vermilion]: NQ.brick },
  layers: [
    // 長い ひげ
    {
      mirror: true,
      y: 1,
      rows: [
        '....V...........',
        '.....V..........',
        '.....V..........',
        '......V.........',
        '......V.........',
        '.......V........',
        '.......V........',
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
        '...........CCCCC',
        '.........CCCCCCC',
        '........CCCCCCCC',
        '.......CCCCCCCCC',
        '......CCCCCCCCCC',
        '......CCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '.....CCCCCWWCCCC',
        '.....CCCCCWoCCCC',
        '.....CCCCCWoCCCC',
        '.....CCCpCCCCCoC',
        '.....CCCCCCCCCCo',
        '.....CCCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '......CCCCCCCCCC',
        '......CCCCCCCCCC',
        '.......CCCCCCCCC',
        '.......CCCCCCCCC',
        '........CCCCCCCC',
        '........CCCCCCCC',
        '.........CCCCCCC',
        '.....VVVVVVVVVVV',
        '...VVVVSVVVVSVVV',
        '..VVVVVVVVVVVVVV',
      ],
    },
    // しまもよう
    {
      mirror: true,
      y: 10,
      rows: [
        '......VVV.......',
        '',
        '.....V..........',
        '',
        '',
        '',
        '',
        '.....VV.........',
        '',
        '',
        '......VV........',
        '',
        '',
        '.......VV.......',
      ],
    },
    // 足
    {
      mirror: true,
      y: 22,
      rows: ['....A...........', '....A...........', '...A............', '...A............'],
    },
  ],
};

/**
 * キンドウロウ（中ボス）：山鹿灯籠まつりの 金色の 灯籠が 動きだした すがた。六角の 屋根の はしは つのの ように はね上がり、
 * てっぺんに 赤い 宝珠。まっ暗な まどの 中で 目が ぎらりと 光り、口から 火の 光。金の よろいの うでに つめ、
 * 紙の すそから 火が ちろちろ（ヒカリ）
 */
const kindouro: MonsterDesign = {
  size: 40,
  colors: {
    G: NQ.gold,
    W: NQ.paper,
    Y: NQ.yellow,
    C: NQ.cream,
    O: NQ.orange,
    V: NQ.vermilion,
    R: NQ.red,
  },
  rim: { [NQ.gold]: NQ.ochre, [NQ.paper]: NQ.cloud },
  rimDepth: 2,
  layers: [
    // 屋根の つのの 先に ゆれる 火
    { mirror: true, y: 1, rows: ['.V', '.VO', 'VOV', '.V'] },
    // 屋根・灯籠の まど・紙の すそ
    {
      mirror: true,
      rows: [
        '....................',
        '...................R',
        '..................RR',
        '...................G',
        '..................GG',
        '.G...............GGG',
        '.GG.............GGGG',
        '..GG...........GGGGG',
        '..GGG.......GGGGGGGG',
        '...GGGGGGGGGGGGGGGGG',
        '....GGGGGGGGGGGGGGGG',
        '.......ooooooooooooo',
        '.......GGGGGGGGGGGGG',
        '.......GGGGGGGGGGGGG',
        '.......GGGGGGGGGGGGG',
        '.......GGGGGGGGGGGGG',
        '.......GGGGGGGGGGGGG',
        '.......GGGGGGGGGGGGG',
        '.......GGGGGGGGGGGGG',
        '.......GGGGGGGGGGGGG',
        '.......GGGGGGGGGGGGG',
        '.......GGGGGGGGGGGGG',
        '.......GGGGGGGGGGGGG',
        '.......GGGGGGGGGGGGG',
        '.......GGGGGGGGGGGGG',
        '......GGGGGGGGGGGGGG',
        '.......WWWWWWWWWWWWW',
        '.......WWWWWWWWWWWWW',
        '......RRRRRRRRRRRRRR',
        '......WWWWWWWWWWWWWW',
        '.....WWWWWWWWWWWWWWW',
        '.....WWWWWWWWWWWWWWW',
        '....WWWWWWWWWWWWWWWW',
        '....WWWWWWWWWWWWWWWW',
        '...WWWWWWWWWWWWWWWWW',
        '...WWWWWWWWWWWWWWWWW',
        '..WWOWWWWWOWWWWWWOWW',
        '..OVOOVVOVOOVOOVVOVO',
        '...V..V..V..V...V..V',
        '....................',
      ],
    },
    // すその 金の おび・紙の ほね
    { mirror: true, y: 25, rows: ['......GoGGoGGoGGoGGo'] },
    {
      mirror: true,
      y: 29,
      rows: [
        '.......G....G....G..',
        '.......G....G....G..',
        '.......G....G....G..',
        '......G....G.....G..',
        '......G....G.....G..',
        '.....G....G......G..',
        '.....G....G......G..',
      ],
    },
    // 金の よろいの うでと つめ
    ...part(
      [
        '....GGG............',
        '...GGGG............',
        '..GGGG.............',
        '.GGGG..............',
        '.GoGG..............',
        '.GGG...............',
        'GGGG...............',
        'GoGo...............',
        'G.G.G..............',
      ],
      1,
      14,
    ),
    // 内がわから 光る まどに うかぶ いかりの 顔（つり上がった 目・赤い ひとみ・きばの 口）
    {
      mirror: true,
      x: 8,
      y: 13,
      rows: [
        'OOOOOOOOOOOO',
        'OYYYYYYYYYYY',
        'OYoYYYYYYYYY',
        'OYoooYYYYYYY',
        'OYYooooYYYYY',
        'OYYoRRooYYYY',
        'OYYYooooYYYY',
        'OYYoYYYYYYYY',
        'OYYoWWoooWWo',
        'OYYYoWoooWoo',
        'OOOOoooWoooW',
      ],
    },
  ],
};

/** キンドウロウ（フィールドに立つ 32×32）：バトルの すがたを 小さく した もの */
const kindouroField: MonsterDesign = {
  size: 32,
  colors: {
    G: NQ.gold,
    W: NQ.paper,
    Y: NQ.yellow,
    C: NQ.cream,
    O: NQ.orange,
    V: NQ.vermilion,
    R: NQ.red,
  },
  rim: { [NQ.gold]: NQ.ochre, [NQ.paper]: NQ.cloud },
  layers: [
    { mirror: true, y: 4, rows: ['.V', 'VOV', '.V'] },
    {
      mirror: true,
      y: 2,
      rows: [
        '................',
        '...............R',
        '..............RR',
        '..............GG',
        '.G..........GGGG',
        '.GG.......GGGGGG',
        '..GGG..GGGGGGGGG',
        '...GGGGGGGGGGGGG',
        '......oooooooooo',
        '......GGGGGGGGGG',
        '......GGGGGGGGGG',
        '......GGGGGGGGGG',
        '......GGGGGGGGGG',
        '......GGGGGGGGGG',
        '......GGGGGGGGGG',
        '......GGGGGGGGGG',
        '......GGGGGGGGGG',
        '......GGGGGGGGGG',
        '.....GGGGGGGGGGG',
        '......WWWWWWWWWW',
        '.....RRRRRRRRRRR',
        '.....WWWWWWWWWWW',
        '....WWWWWWWWWWWW',
        '....WWWWWWWWWWWW',
        '...WWWWWWWWWWWWW',
        '...WWWWWWWWWWWWW',
        '..WWOWWWWOWWWWOW',
        '..OVOVVOVOOVVOVO',
        '...V..V..V...V..',
      ],
    },
    ...part(
      [
        '...GG..........',
        '..GGG..........',
        '.GGG...........',
        '.GoG...........',
        'GGG............',
        'GoGo...........',
        'G.G............',
      ],
      1,
      13,
    ),
    {
      mirror: true,
      x: 7,
      y: 12,
      rows: ['OOOOOOOOO', 'OYoYYYYYY', 'OYoooYYYY', 'OYYoRooYY', 'OYYYoooYY', 'OYYoWoooW', 'OOOOooWoo'],
    },
  ],
};

/** 下ほど 広がる「武者返し」の 石垣（左半分、y 24〜46） */
const MUSHA_WALL = [
  '............ssssssssssss',
  '............gggggggggggg',
  '...........gggsgggsgggsg',
  '...........ggggggggggggg',
  '...........ggggggggggggg',
  '..........ssssssssssssss',
  '..........gggggggggggggg',
  '..........gggsgggsgggsgg',
  '.........ggggggggggggggg',
  '.........sssssssssssssss',
  '........gggggggggggggggg',
  '........gggsgggsgggsgggs',
  '.......ggggggggggggggggg',
  '.......sssssssssssssssss',
  '......gggggggggggggggggg',
  '......gggsgggsgggsgggsgg',
  '.....ggggggggggggggggggg',
  '.....sssssssssssssssssss',
  '....gggggggggggggggggggg',
  '....gggsgggsgggsgggsgggs',
  '....gggggggggggggggggggg',
  '....ssssssssssssssssssss',
  '....gggggggggggggggggggg',
];

/**
 * ムシャガエシ（県ボス）：熊本城の 石垣から 生まれた 岩の 巨人。黒い 天守の 屋根が かぶとに なり、
 * 金の しゃちほこが 大きな つのの ように そり立つ。かげの 顔に 黄色い 目が ぎらりと 光り、白い 歯を くいしばる。
 * 屋根がわらの かたあて、石の 大きな こぶし、からだは 下ほど 広がる「武者返し」の 石垣（ツチ）
 */
const mushagaeshi: MonsterDesign = {
  size: 48,
  colors: {
    N: NQ.night,
    W: NQ.paper,
    g: NQ.gray,
    s: NQ.silver,
    G: NQ.gold,
    R: NQ.red,
    Y: NQ.yellow,
  },
  rim: { [NQ.gray]: NQ.slate, [NQ.paper]: NQ.cloud, [NQ.gold]: NQ.ochre },
  rimDepth: 2,
  layers: [
    { mirror: true, y: 24, rows: MUSHA_WALL },
    // 石の 大きな うでと こぶし
    ...part(
      [
        '..ggggg................',
        '..gsggg................',
        '..ggggg................',
        '.gggggg................',
        '.ggsggg................',
        '.gggggg................',
        '.gggggg................',
        'gggggggg...............',
        'gsggsggg...............',
        'gggggggg...............',
        'gsggsggg...............',
        'gggggggg...............',
        '.gggggg................',
      ],
      1,
      25,
    ),
    // 屋根がわらの かたあて（黒い 屋根と 白い かべ）
    ...part(
      [
        '.......NNNN............',
        '....NNNNNNNNN..........',
        '.NNNNNNNNNNNNNN........',
        'NNNNNNNNNNNNNNN........',
        '.sssssssssssss.........',
        '.WWWWWWWWWWWW..........',
        '.WWoWWWoWWWW...........',
        '.WWoWWWoWWW............',
        '..WWWWWWWW.............',
      ],
      1,
      16,
    ),
    // 金の しゃちほこの つの
    {
      mirror: true,
      y: 1,
      rows: [
        '.........GG.G',
        '..........GGG',
        '...........GG',
        '...........GGG',
        '............GGG',
        '.............GGGG',
        '..............GGGGG',
        '................GGGG',
      ],
    },
    // 天守の 屋根の かぶと
    ...part(
      [
        '..........NNNNNNNN',
        '........NNNNNNNNNN',
        '......NNNNNNNNNNNN',
        'N...NNNNNNNNNNNNNN',
        'NNNNNNNNNNNNNNNNNN',
        '.NNNNNNNNNNNNNNNNN',
        '...sssssssssssssss',
      ],
      6,
      8,
    ),
    // かげの 顔と 白かべの ほお当て
    ...part(
      [
        'WWWNNNNNNNNNN',
        'WoWNNNNNNNNNN',
        'WWWNNNNNNNNNN',
        'WoWNNNNNNNNNN',
        'WWWNNNNNNNNNN',
        'WoWNNNNNNNNNN',
        'WWWNNNNNNNNNN',
        '.WWWNNNNNNNNN',
        '...WWNNNNNNNN',
      ],
      11,
      15,
    ),
    // 赤い 宝石・つり上がった 光る 目・くいしばった 歯
    {
      mirror: true,
      x: 14,
      y: 9,
      rows: [
        '..........',
        '.........R',
        '........RR',
        '.........R',
        '..........',
        '.........',
        '.........',
        '.YY......',
        '.YYYYW...',
        '..YYYYY..',
        '.........',
        '...oWoWoW',
        '....WoWoW',
      ],
    },
  ],
};

/** ムシャガエシ 後半（ヒノ）：阿蘇の 火が 石垣の すきまから もえあがり、目は 白く 光る。両がわに 炎 */
const mushagaeshiHot: MonsterDesign = {
  ...mushagaeshi,
  colors: { ...mushagaeshi.colors, s: NQ.vermilion, V: NQ.vermilion, A: NQ.apricot, C: NQ.cream },
  layers: [
    ...mushagaeshi.layers,
    // 石垣の わきの 炎
    {
      mirror: true,
      x: 1,
      y: 37,
      rows: ['..C.', '..A.', '.VAV', 'VVAV', '.CA.', 'VAAV', 'VAAV'],
    },
    // かたの 上に ゆらめく 炎
    { mirror: true, x: 2, y: 9, rows: ['..V.', '.VAV', '.ACA', 'VACAV'] },
    // 白く 光る 目
    { mirror: true, x: 14, y: 16, rows: ['.CC......', '.CCCCC...', '..CCCCC..'] },
  ],
};

/** 加藤清正：銀色の 長い 烏帽子形の かぶとと ひげ、黒い よろい（ミズ） */
const katoKiyomasa = lord(
  [
    '......................SS',
    '.....................SSS',
    '.....................SSS',
    '....................SSSS',
    '....................SGGG',
    '...................SGSSG',
    '..................SSGGGS',
    '.................SSSSSSS',
    '...............NNSSSSSSS',
    '..............NNNNNNNNNN',
    ...HELMET,
    ...BEARD_FACE,
  ],
  {
    N: NQ.night,
    L: NQ.slate,
    K: NQ.night,
    S: NQ.silver,
    G: NQ.gold,
    Y: NQ.yellow,
    R: NQ.red,
    T: NQ.slate,
    H: NQ.gray,
    M: NQ.hairBlack,
  },
  { [NQ.silver]: NQ.gray },
);

// ───────────────────────── しんか ─────────────────────────

/** スイカブト：シマダマの しんか。スイカの かわの かぶとと、赤い 実の むね当て。たねの つぶてを にぎる（モリ） */
const suikabuto: MonsterDesign = {
  size: 32,
  colors: {
    L: NQ.leaf,
    G: NQ.green,
    M: NQ.lime,
    R: NQ.red,
    r: NQ.brick,
    W: NQ.white,
    B: NQ.bark,
    p: NQ.blush,
  },
  rim: { [NQ.leaf]: NQ.green, [NQ.red]: NQ.brick },
  layers: [
    // スイカの ひと切れの かぶと
    {
      mirror: true,
      rows: [
        '................',
        '..............BB',
        '.............MMB',
        '...........MMMMM',
        '.........GGGGGGG',
        '........GWWWWWWW',
        '.......GWRRRRRRR',
        '......GWRRRoRRRR',
        '.....GWRRRRRRRRR',
        '.....GWRRoRRRRRR',
        '....GWRRRRRRRRRR',
        '....LLLLLLLLLLLL',
        '...LLLLLLLLLLLLL',
        '...LLLLLLLLLLLLL',
        '..LLLLLLLLooLLLL',
        '..LLLLLLLLWWLLLL',
        '..LLLLLLLLWoLLLL',
        '..LLLLpLLLWoLLLL',
        '..LLLLLLLLLLLooo',
        '..LLLLLLLLLLLoWW',
        '..LLLLLLLLLLLLoo',
        '..LLLLLLLLLLLLLL',
        '...LLLLLLLLLLLLL',
        '....LLLLLLLLLLLL',
        '.....LLLLLLLLLLL',
        '.......LLLLLLLLL',
        '..........LLLLLL',
        '..........LLL...',
        '.........GGGG...',
        '.........GGGG...',
      ],
    },
    // しまもよう
    {
      mirror: true,
      y: 12,
      rows: [
        '.....G...G......',
        '....G....G......',
        '...G....G.......',
        '...G....G.......',
        '...G....G.......',
        '...G....G.......',
        '...G....G.......',
        '...G....G.......',
        '....G...G.......',
        '.....G...G......',
        '......G..G......',
        '.........G......',
      ],
    },
    // たねの つぶて
    { x: 1, y: 18, rows: ['.LL', 'LLL', 'LoL', 'LLL'] },
  ],
};

/** ダイカルデラ：カルデランの しんか。二重の 火口と 広い 草原、もくもくの けむりと 大きな 炎（ヒノ） */
const daiKarudera: MonsterDesign = {
  size: 32,
  colors: {
    L: NQ.leaf,
    G: NQ.green,
    g: NQ.gray,
    N: NQ.slate,
    W: NQ.white,
    c: NQ.cloud,
    V: NQ.vermilion,
    A: NQ.apricot,
    Y: NQ.gold,
    p: NQ.blush,
  },
  rim: { [NQ.leaf]: NQ.green, [NQ.gray]: NQ.slate },
  layers: [
    { x: 6, y: 1, rows: ['.cWW.', 'WWWWc', 'cWWW.'] },
    {
      mirror: true,
      y: 1,
      rows: [
        '.............Y..',
        '............AYA.',
        '...........AAYAA',
        '...........VAYAV',
        '...........VVAVV',
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
        '.........ggggggg',
        '........gNVVVVVN',
        '........gNooooVN',
        '.......ggggggggg',
        '......gggggggggg',
        '.....ggLLLLLLLLL',
        '....gLLLLLLLLLLL',
        '....LLLLLLooLLLL',
        '...LLLLLLLWWLLLL',
        '...LLLLLLLWoLLLL',
        '...LLLLLLLWoLLLL',
        '...LLLpLLLLLLLoL',
        '..LLLLLLLLLLLLLo',
        '..LLLLLLLLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.GGGGGGGGGGGGGGG',
        '.GGGGGGGGGGGGGGG',
        '....GGG.........',
      ],
    },
  ],
};

/** エビムシャ：エビグルマの しんか。ひげを かぶとの かざりのように なびかせ、大きな はさみを かまえる（ミズ） */
const ebiMusha: MonsterDesign = {
  size: 32,
  colors: {
    C: NQ.cream,
    E: NQ.beige,
    V: NQ.vermilion,
    R: NQ.brick,
    A: NQ.azure,
    S: NQ.sky,
    W: NQ.white,
    p: NQ.blush,
  },
  rim: { [NQ.cream]: NQ.beige, [NQ.vermilion]: NQ.brick },
  layers: [
    // 長い ひげ（かぶとの かざりの ように 外へ そる）
    {
      mirror: true,
      y: 1,
      rows: [
        '..V.............',
        '..V.............',
        '...V............',
        '...V............',
        '....V...........',
        '.....V..........',
        '......V.........',
        '.......V........',
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
        '..........VVVVVV',
        '........VVVVVVVV',
        '.......VCCCCCCCC',
        '......CCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '....CCCCCCooCCCC',
        '....CCCCCCWWCCCC',
        '....CCCCCCWoCCCC',
        '....CCCCCCWoCCCC',
        '....CCCpCCCCCCoC',
        '....CCCCCCCCCCCo',
        '....VVVVVVVVVVVV',
        '.....CCCCCCCCCCC',
        '.....CCCCCCCCCCC',
        '.....VVVVVVVVVVV',
        '......CCCCCCCCCC',
        '......CCCCCCCCCC',
        '......VVVVVVVVVV',
        '.......CCCCCCCCC',
        '.......CCCCCCCCC',
        '........CCCCCCCC',
        '.....VVVVVVVVVVV',
        '...VVVVSVVVVSVVV',
        '..VVVVVVVVVVVVVV',
      ],
    },
    // かまえた はさみ
    { mirror: true, y: 13, rows: ['..CCC', '.CCCC', '.CCoC', '.CCCC', '..CCC', '..AA.'] },
  ],
};

/** タタミン：八代のい草で おられた 小さな畳の子（ツチ） */
const tatamin: MonsterDesign = {
  size: 32,
  colors: { L: NQ.leaf, G: NQ.green, M: NQ.lime, T: NQ.tan, B: NQ.brown, W: NQ.white, p: NQ.blush },
  rim: { [NQ.leaf]: NQ.green, [NQ.tan]: NQ.brown },
  layers: [
    {
      mirror: true,
      y: 1,
      rows: [
        '....TTTTTTTT....',
        '...TBBBBBBBBT...',
        '..TBBLLLLLLBBT..',
        '.TBBLMLMLMLLBBT.',
        '.TBBLLMLMLMLBBT.',
        '.TBBLMLMLMLLBBT.',
        '.TBBLLMLMLMLBBT.',
        '.TBBLMLMLMLLBBT.',
        '.TBBLLWWLLLLBBT.',
        '.TBBLLWoLLLLBBT.',
        '.TBBLLLLLLLLBBT.',
        '.TBBLLpLLLLLBBT.',
        '.TBBLMLMLMLLBBT.',
        '.TBBLLMLMLMLBBT.',
        '.TBBLMLMLMLLBBT.',
        '.TBBLLMLMLMLBBT.',
        '.TBBLMLMLMLLBBT.',
        '.TBBLLMLMLMLBBT.',
        '.TBBLMLMLMLLBBT.',
        '.TBBLLMLMLMLBBT.',
        '.TBBLLLLLLLLBBT.',
        '..TBBBBBBBBBBT..',
        '...TTTTTTTTTT...',
        '......BBBB......',
        '.....BB..BB.....',
        '....BB....BB....',
        '...BB......BB...',
        '...BB......BB...',
        '...BB......BB...',
      ],
    },
  ],
};

/** オリタタミン：何枚もの畳を折り重ねた タタミンの進化（ツチ） */
const oritatamin: MonsterDesign = {
  ...tatamin,
  colors: { ...tatamin.colors, Y: NQ.gold },
  layers: [
    ...tatamin.layers,
    { mirror: true, y: 4, rows: ['..YYYYYYYYYYYY..', '...Y........Y...', '..YYYYYYYYYYYY..'] },
    { mirror: true, y: 14, rows: ['..BBBBBBBBBBBB..', '.BLLLLLLLLLLLLB.', '..BBBBBBBBBBBB..'] },
    { mirror: true, y: 20, rows: ['...YYYYYYYYYY...', '....Y......Y....'] },
  ],
};

export const KUMAMOTO: Readonly<Record<string, MonsterDesign>> = {
  'kumamoto-midboss-kindouro': kindouro,
  'kumamoto-midboss-kindouro.field': kindouroField,
  'kumamoto-boss-mushagaeshi': mushagaeshi,
  'kumamoto-boss-mushagaeshi.p0': mushagaeshiHot,
  'kumamoto-lastboss-kato-kiyomasa': katoKiyomasa,
  'kumamoto-shimadama': shimadama,
  'kumamoto-suikabuto': suikabuto,
  'kumamoto-karuderan': karuderan,
  'kumamoto-dai-karudera': daiKarudera,
  'kumamoto-ebiguruma': ebiguruma,
  'kumamoto-ebi-musha': ebiMusha,
  'kumamoto-tatamin': tatamin,
  'kumamoto-oritatamin': oritatamin,
};
