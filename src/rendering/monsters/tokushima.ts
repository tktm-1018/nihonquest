/** 徳島県の モンスター（手描き。docs/06 §4・§6.3〜6.5 の 規格） */
import { NQ } from '../palette';
import type { Layer, MonsterDesign } from './design';
import { FACE, HELMET, lord } from './lastbosses';

/** 地図の まわり 1 ドットを ink にする（重ねる 部品を くっきり させる）。x-1, y-1 に 置く */
function ring(rows: readonly string[], half = false): string[] {
  const w = Math.max(...rows.map((r) => r.length));
  const at = (x: number, y: number) => (rows[y]?.[x] ?? '.') !== '.';
  return Array.from({ length: rows.length + 2 }, (_, j) =>
    Array.from({ length: w + (half ? 1 : 2) }, (_, i) => {
      const x = i - 1;
      const y = j - 1;
      return !at(x, y) && (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1)) ? 'o' : '.';
    }).join(''),
  );
}

/** 部品を ink の ふちどりつきで 置く */
const inked = (rows: readonly string[], x: number, y: number, half = false): Layer[] => [
  { mirror: half, x: x - 1, y: y - 1, rows: ring(rows, half) },
  { mirror: half, x, y, rows },
];

// ───────────────────────── 通常 ─────────────────────────

const sudachiColors = {
  L: NQ.leaf,
  m: NQ.lime,
  s: NQ.sprout,
  B: NQ.bark,
  W: NQ.white,
  p: NQ.blush,
};

/** スダチビ：まるくて 小さな みどりの すだち。へたと 葉っぱ、つぶつぶの 皮（モリ） */
const sudachibi: MonsterDesign = {
  size: 32,
  colors: sudachiColors,
  rim: { [NQ.leaf]: NQ.green },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '..............BB',
        '..............BB',
        '..........LLLLLL',
        '........LLLLLLLL',
        '.......LLmmLLLLL',
        '......LLmLLLLLLL',
        '.....LLmLLLLsLLL',
        '.....LLLLLLLLLLL',
        '....LLLLLLLLLLLL',
        '....LLLLLLLLLLLL',
        '....LLLLLLWWLLLL',
        '....LLLsLLWoLLLL',
        '....LLLLLLWoLLoL',
        '....LLLLppLLLLLo',
        '....LLLLLLLLLLLL',
        '....LLLLLLLLsLLL',
        '....LLLsLLLLLLLL',
        '....LLLLLLLLLLLL',
        '.....LLLLLLLLLLL',
        '.....LLLLLLLLLLL',
        '......LLLLLLLLLL',
        '.......LLLLLLLLL',
        '........LLLLLLLL',
        '..........LLLLLL',
        '........LLL..LLL',
        '........LLL.....',
        '........LLL.....',
      ],
    },
    // 葉っぱ（へたの よこ）
    { x: 16, y: 1, rows: ['..LLL', '.mLLL', 'LLLm.'] },
    // 小さな うで
    { x: 2, y: 15, rows: ['.LL', 'LLL', 'LL.'] },
  ],
};

const kintokiColors = {
  R: NQ.berry,
  h: NQ.blush,
  S: NQ.sand,
  W: NQ.white,
  g: NQ.leaf,
  G: NQ.green,
};

/** キントキン：なると金時。上と 下が とがった 赤むらさきの さつまいも、すなの つぶ、ふたばの め（ツチ） */
const kintokin: MonsterDesign = {
  size: 32,
  colors: kintokiColors,
  rim: { [NQ.berry]: NQ.brick, [NQ.leaf]: NQ.green },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '.............RRR',
        '...........RRRRR',
        '..........RRRRRR',
        '.........RRRRRRR',
        '........RRRRRRRR',
        '.......RRhRRRRRR',
        '.......RhRRRRRRR',
        '......RhRRRRRRRR',
        '......RRRRRRRRRR',
        '......RRRRRWWRRR',
        '.....RRRRRRWoRRR',
        '.....RRRRRRWoRRR',
        '.....RRRhhRRRRoR',
        '.....RRRRRRRRRRo',
        '.....RRRRRRSRRRR',
        '......RRSRRRRRRR',
        '......RRRRRRRRRR',
        '......RRRRRRSRRR',
        '.......RRRRRRRRR',
        '.......RRRSRRRRR',
        '........RRRRRRRR',
        '.........RRRRRRR',
        '........RRRRRRRR',
        '........RRRRRRRR',
        '........RRR..RRR',
        '................',
        '................',
      ],
    },
    // ふたばの め
    { x: 14, y: 2, rows: ['.gg', 'ggg', '.g.'] },
    // 小さな うで
    { x: 3, y: 16, rows: ['.RR', 'RRR', 'RR.'] },
  ],
};

const musasabiColors = {
  B: NQ.brown,
  b: NQ.bark,
  T: NQ.tan,
  W: NQ.white,
  p: NQ.blush,
  L: NQ.leaf,
  g: NQ.green,
  M: NQ.mint,
  A: NQ.aqua,
};

/** カズラムササビ：祖谷の 森の ムササビ。つるを あんだ マントを ひろげて 谷を わたる（カゼ） */
const kazuraMusasabi: MonsterDesign = {
  size: 32,
  colors: musasabiColors,
  rim: { [NQ.brown]: NQ.bark, [NQ.leaf]: NQ.green },
  layers: [
    // つるの マント（あみ目）
    {
      mirror: true,
      y: 12,
      rows: [
        '.......LLLLLLLLL',
        '....LLLLgLLLgLLL',
        '..LLLLLLLLLLLLLL',
        '.LLgLLLgLLLgLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LgLLLgLLLgLLLLL',
        '.LLLLLLLLLLLLLLL',
        '..LLLgLLLgLLLLLL',
        '..LLLLLLLLLLLLLL',
        '...LLLLLLLLLLLLL',
        '....LLLLLLLLLLLL',
        '......LLLLLLLLLL',
      ],
    },
    // 耳・頭・からだ
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '.........BB.....',
        '........BTTB....',
        '........BTTBBBBB',
        '.......BBBBBBBBB',
        '......BBBBBBBBBB',
        '......BBBBBBBBBB',
        '.....BBBBBBBBBBB',
        '.....BBBBWWWBBBB',
        '.....BBBBWWoBBBB',
        '.....BBBBWWoBBBB',
        '.....BBBpBBBBBBB',
        '......BBBBBWWWWW',
        '.......BBBWWWWWW',
        '.......BWWWWWWWW',
        '.......WWWWWWWWW',
        '.......WWWWWWWWW',
        '.......WWWWWWWWW',
        '.......WWWWWWWWW',
        '........WWWWWWWW',
        '........WWWWWWWW',
        '.........WWWWWWW',
        '..........BBBBBB',
        '.........BBBBBBB',
        '........BBBBBBBB',
        '.......BBBBBBBBB',
        '.......bBBBBBBBB',
        '.......BBBBBBBBB',
      ],
    },
    // 風
    { x: 1, y: 8, rows: ['MA..', '..AM'] },
    { x: 27, y: 10, rows: ['..AM', 'MA..'] },
  ],
};

// ───────────────────────── しんか ─────────────────────────

/** スダチムシャ（スダチビの しんか）：葉の かぶとを かぶった すだちの 武者。白い はちまき、きりっと した まゆ（モリ） */
const sudachiMusha: MonsterDesign = {
  size: 32,
  colors: { ...sudachiColors, P: NQ.paper, S: NQ.sprout },
  rim: { [NQ.leaf]: NQ.green },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '..............BB',
        '..............BB',
        '.........LLLLLLL',
        '.......LLLLLLLLL',
        '......LLmmLLLLLL',
        '.....LLmLLLLLLLL',
        '....LLmLLLLLsLLL',
        '....LLLLLLLLLLLL',
        '...LLLLLLLLLLLLL',
        '...PPPPPPPPPPPPP',
        '...PPPPPPPPPPPPP',
        '...LLLLLoLLLLLLL',
        '...LLLLLLLooLLLL',
        '...LLLLLLLWWLLLL',
        '...LLLsLLLWoLLLL',
        '...LLLLLLLWoLLoL',
        '...LLLLppLLLLLoo',
        '...LLLLLLLLLLLLL',
        '...LLLLLLLLLsLLL',
        '...LLLsLLLLLLLLL',
        '....LLLLLLLLLLLL',
        '....LLLLLLLLLLLL',
        '.....LLLLLLLLLLL',
        '......LLLLLLLLLL',
        '........LLLLLLLL',
        '.......LLL...LLL',
        '.......LLL......',
        '.......LLL......',
      ],
    },
    // 葉の かぶと（左右に ひろがる くわがた）
    {
      mirror: true,
      y: 1,
      rows: ['.....mm.........', '...mmLL.........', '..mLLLL.........', '..LLLL..........'],
    },
    // はちまきの むすび目（左へ）
    { x: 1, y: 11, rows: ['PP..', '.PPP', 'P...'] },
    // うで
    { x: 1, y: 16, rows: ['.LL', 'LLL', 'LL.'] },
  ],
};

/** オオキントキ（キントキンの しんか）：大きく そだった なると金時。すなの よろいの おび、ふたばの かざり、たくましい うで（ツチ） */
const ooKintoki: MonsterDesign = {
  size: 32,
  colors: { ...kintokiColors, B: NQ.brown, E: NQ.beige },
  rim: { [NQ.berry]: NQ.brick, [NQ.leaf]: NQ.green, [NQ.sand]: NQ.brown },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '................',
        '..............RR',
        '.............RRR',
        '............RRRR',
        '..........RRRRRR',
        '.........RhRRRRR',
        '........RhRRRRRR',
        '.......RhRRRRRRR',
        '.......RRRRRRRRR',
        '......RRRRRoRRRR',
        '......RRRRRRRooR',
        '.....RRRRRRWWRRR',
        '.....RRRRRRWoRRR',
        '.....RRRhhRWoRRo',
        '.....RRRRRRRRRoo',
        '....SSSSSSSSSSSS',
        '....SESSSSSESSSS',
        '....SSSSSSSSSSSS',
        '.....RRRRRRSRRRR',
        '.....RRRSRRRRRRR',
        '......RRRRRRRRRR',
        '......RRRRRRSRRR',
        '.......RRRRRRRRR',
        '........RRRRRRRR',
        '..........RRRRRR',
        '.......RRR...RRR',
        '.......RRR......',
      ],
    },
    // ふたばの かざり
    {
      mirror: true,
      y: 1,
      rows: ['.........gg.....', '........ggGg....', '.........gg.gg..', '............gg..'],
    },
    // ふとい うで
    { x: 1, y: 16, rows: ['..RR', '.RRR', 'RRRR', 'RRR.'] },
  ],
};

/** ソラワタリ（カズラムササビの しんか）：マントを いっぱいに ひろげ、風に のって 空を わたる ムササビ（カゼ） */
const sorawatari: MonsterDesign = {
  size: 32,
  colors: musasabiColors,
  rim: { [NQ.brown]: NQ.bark, [NQ.leaf]: NQ.green },
  layers: [
    // 大きく ひろげた つるの マント
    {
      mirror: true,
      y: 9,
      rows: [
        '......LLLLLLLLLL',
        '...LLLLgLLLgLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLgLLLgLLLgLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LgLLLgLLLgLLLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLLgLLLgLLLgLLL',
        '.LLLLLLLLLLLLLLL',
        '.LLLgLLLgLLLLLLL',
        '.LLLLLLLLLLLLLLL',
        '..LLLLLLLLLLLLLL',
        '...LLLLLLLLLLLLL',
        '.....LLLLLLLLLLL',
      ],
    },
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '........BB......',
        '.......BTTB.....',
        '.......BTTBB....',
        '.......BBBBBBBBB',
        '......BBBBBBBBBB',
        '.....BBBBBBBBBBB',
        '.....BBBBBBBBBBB',
        '....BBBBBoBBBBBB',
        '....BBBBBBBooBBB',
        '....BBBBWWWoBBBB',
        '....BBBBWWWoBBBB',
        '....BBBpBBBBBBBB',
        '.....BBBBBWWWWWW',
        '......BBBWWWWWWW',
        '......BWWWWWWWWW',
        '......WWWWWWWWWW',
        '......WWWWWWWWWW',
        '......WWWWWWWWWW',
        '.......WWWWWWWWW',
        '.......WWWWWWWWW',
        '........WWWWWWWW',
        '.........WWWWWWW',
        '.........BBBBBBB',
        '........BBBBBBBB',
        '.......BBBBBBBBB',
        '......BBBBBBBBBB',
        '......bBBBBBBBBB',
        '......BBBBBBBBBB',
      ],
    },
    // 風の うず
    { x: 1, y: 5, rows: ['MMA.', 'A..M', '.AMM'] },
    { x: 27, y: 7, rows: ['.AMM', 'M..A', 'MMA.'] },
  ],
};

// ───────────────────────── 中ボス ─────────────────────────

const uzuColors = {
  A: NQ.azure,
  N: NQ.blue,
  V: NQ.navy,
  K: NQ.sky,
  I: NQ.ice,
  W: NQ.white,
  G: NQ.gold,
  Q: NQ.ochre,
  R: NQ.red,
};

/** うずの もよう（からだの まん中に 重ねる。26×15） */
const UZU_SPIRAL = [
  '........IIIIIIIIII........',
  '.....IIIIWWWWWWWWWWII.....',
  '...KIIWWWWKKKKKKKKWWWWI...',
  '..KIIWWKKKKIIIIIIKKKKWWI..',
  '.KIIWWKKIIIIWWWWIIIIKKWWI.',
  'KIIWWKKIIIWWKKKWWWWIIKKWWI',
  'KIIWWKKIIWWVVVVKKWWWIIKKWW',
  'KIIWWKKIIWVVGGVVKKWWIIKKWW',
  'KIIWWKKIIIWVVVVIKKWWIIKKWW',
  'KKIIWWKKKIIIIIIKKKWWIIKKWW',
  '.KKIIWWWKKKKKKKKWWWIIKKWW.',
  '..KKIIIWWWWWWWWWWIIIKKWW..',
  '...KKKIIIIIIIIIIIIKKKWW...',
  '.....KKKKKIIIIKKKKKWW.....',
  '........WKKKKKKWWW........',
];

/**
 * ウズシオン（中ボス）：鳴門の うず潮の 主。うずを まく 大きな からだから 波の つめの うでを ふり上げ、
 * 頭には 金の ひれの かんむりと 赤い 玉。こい 青の かげの 顔に つり上がった 金の 目、きばの ならぶ 大きな 口（ミズ）
 */
const uzushion: MonsterDesign = {
  size: 40,
  colors: uzuColors,
  rim: { [NQ.azure]: NQ.blue, [NQ.white]: NQ.cloud },
  rimDepth: 2,
  layers: [
    {
      mirror: true,
      rows: [
        '....................',
        '.......G............',
        '.......GG...........',
        '.......GG...........',
        '........GG..........',
        '.W......GGQ........W',
        '.WI.W....GQQ......WI',
        '.WIWI....AQQAAAAAAAA',
        '.KIII...AAAAAAAAAAAA',
        '.KKII...AAAAAAAAAAGR',
        '..KKA..AAAAAAAAAAAAG',
        '..KAA..AAAVVVVVVVVVV',
        '..KAA..AAVoooVVVVVVV',
        '..KAA..AAVGGGoooVVVV',
        '..AAA..AAVVGGGGooVVV',
        '..AAAA.AAVVVGGGGVVVV',
        '..AAAAAAAVVVVVVVVVVV',
        '...AAAAAAAVVoooooooo',
        '....AAAAAAVoWWooWWoo',
        '.....AAAAAVoRWRRRWRR',
        '.....AAAAAVoRRRWRRRW',
        '....AAAAAAAVooWWooWW',
        '...AAAAAAAAAVVVVVVVV',
        '..AAAAAAAAAAAAAAAAAA',
        '.WAAAAAAAAAAAAAAAAAA',
        'WWAAAAAAAAAAAAAAAAAA',
        '.WAAAAAAAAAAAAAAAAAA',
        '..AAAAAAAAAAAAAAAAAA',
        '.WAAAAAAAAAAAAAAAAAA',
        'WWAAAAAAAAAAAAAAAAAA',
        '.WAAAAAAAAAAAAAAAAAA',
        '..AAAAAAAAAAAAAAAAAA',
        '..AAAAAAAAAAAAAAAAAA',
        '...AAAAAAAAAAAAAAAAA',
        '..WAAAAAAAAAAAAAAAAA',
        '.WWKAAAAAAAAAAAAAAAA',
        '.WKKKAAAAAAAAAAAAAAA',
        '.WWKKKKAAAAAAAAAAAAA',
        '..WWWWWKKKKKKKKKKKKK',
      ],
    },
    { x: 7, y: 23, rows: UZU_SPIRAL },
  ],
};

/** ウズシオン（フィールドに 立つ 32×32）：バトルの すがたを 小さく した もの */
const uzushionField: MonsterDesign = {
  size: 32,
  colors: uzuColors,
  rim: { [NQ.azure]: NQ.blue, [NQ.white]: NQ.cloud },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '.....G..........',
        '.....GG.........',
        'W.....GQ.......W',
        'WIW....GQQ....WI',
        'KII...AQQAAAAAAA',
        'KKI...AAAAAAAAGR',
        '.KA..AAAAAAAAAAG',
        '.KA..AAVVVVVVVVV',
        '.KA..AVooVVVVVVV',
        '.AA..AVGGooVVVVV',
        '.AAA.AVVGGGoVVVV',
        '.AAAAAVVVVVVVVVV',
        '..AAAAAVVooooooo',
        '...AAAAVoWWooWWo',
        '...AAAAVoRRRRRRR',
        '...AAAAAVoooWooW',
        '..AAAAAAAVVVVVVV',
        '.WAAAAAAAAAAAAAA',
        'WWAAAAAAAAAAAAAA',
        '.WAAAAAAAAAAAAAA',
        '..AAAAAAAAAAAAAA',
        '.WAAAAAAAAAAAAAA',
        '.WWAAAAAAAAAAAAA',
        '..AAAAAAAAAAAAAA',
        '..WAAAAAAAAAAAAA',
        '.WWKAAAAAAAAAAAA',
        '.WKKKAAAAAAAAAAA',
        '..WWWWKKKKKKKKKK',
      ],
    },
    {
      x: 6,
      y: 18,
      rows: [
        '.....IIIIIIIIII.....',
        '...IIIWWWWWWWWWWI...',
        '..KIWWKKKKKKKKWWWI..',
        '.KIWKKIIIIIIIIKKWWI.',
        'KIWKKIIWWWWWWIIKKWWI',
        'KIWKIIWVVVVKKWIIKKWW',
        'KIWKIIWVGGVVKWIIKKWW',
        'KIWKIIIWVVVIKKWIIKWW',
        '.KIWKKIIIIIIKKWWIKW.',
        '..KIWWKKKKKKKWWIKW..',
        '...KKIIIIIIIIIKKW...',
      ],
    },
  ],
};

// ───────────────────────── 県ボス ─────────────────────────

const odoriColors = {
  S: NQ.sand,
  T: NQ.tan,
  F: NQ.skinLight,
  f: NQ.skinMid,
  W: NQ.white,
  P: NQ.paper,
  N: NQ.navy,
  D: NQ.denim,
  X: NQ.night,
  E: NQ.cream,
  R: NQ.red,
  G: NQ.gold,
  M: NQ.mint,
};

/** 大きく そりかえった 編みがさ（両はしが つのの ように とがる）・高く かかげた 手・顔・はっぴ・ふんばる 足（左半分） */
const ODORI = [
  '........................',
  '.......T................',
  '.......TT...............',
  '.FF....TST..............',
  'FFFF...TSST.............',
  'FFFFF..TSSSTT...........',
  '.FFFF...SSSSSTT.........',
  '.fFFf...SSSSSSSTTT......',
  '..NNN...TSSSSSSSSSTTTTTT',
  '..NNN....SSSSSSSSSSSSSSS',
  '..NNNN...GGGSSSSSSSSSSSS',
  '...NNN....GGGGGGGGGGGGGG',
  '...NNNN.....XXXXXXXXXXXX',
  '...NNNN.....XXEEXXXXXXXX',
  '....NNNN....XXXEEEEXXXXX',
  '....NNNN....FXXXXXEEXXXX',
  '.....NNNN...FfFFFFFFFFFF',
  '.....NNNN...FfFFFFoooooo',
  '......NNNN..FFfFFoWWoWWo',
  '......NNNNN.FFFFoWWoWWoW',
  '.......NNNNNFFFoooooooRR',
  '.......NNNNNNFFFFFFFFFFF',
  '........NNNNNNNNNNPPFFFF',
  '.......NNNNNNNNNNNNPPPFF',
  '......NNNNNNNNNNNNNNPPPP',
  '......NNNWWNNNNNNNNNNPPP',
  '......NNNNNNNNNNNNNNNNPP',
  '.......NNNNWWNNNNNNNNNPP',
  '.......NNNNNNNNNNNNNNNNP',
  '........NNNNNNNNNNNNNNNN',
  '........RRRRRRRRRRRRRRRR',
  '........RRRRRRRRRRRRRRGG',
  '........DDDDDDDDDDDDDDGG',
  '.......DDDDDDDDDDDDDDDDD',
  '.......DDDDDDDDDDD......',
  '......DDDDDDDDDD........',
  '......DDDDDDDDD.........',
  '.....DDDDDDDDD..........',
  '.....DDDDDDDD...........',
  '....DDDDDDDD............',
  '....DDDDDDDD............',
  '...DDDDDDDD.............',
  '...DDDDDDDD.............',
  '...PPPPPPPP.............',
  '..PPPPPPPPP.............',
  '..WWWWWWWWWW............',
  '..WWWWWWWWWW............',
];

const ODORI_RIM = {
  [NQ.navy]: NQ.ink,
  [NQ.denim]: NQ.navy,
  [NQ.sand]: NQ.tan,
  [NQ.skinLight]: NQ.skinMid,
  [NQ.red]: NQ.brick,
};

/**
 * アワオドリオウ（県ボス）：阿波おどりの 大おどり手。両はしが つのの ように そりかえった 編みがさを 深く かぶり、
 * かげに なった 顔に ぎらりと 光る 目、くいしばった 歯。藍染めの はっぴの 両うでを 高く かかげ、足を 大きく ひらいて ふんばる（カゼ）
 */
const awaodoriOu: MonsterDesign = {
  size: 48,
  colors: odoriColors,
  rim: ODORI_RIM,
  rimDepth: 2,
  layers: [{ mirror: true, rows: ODORI }],
};

/** アワオドリオウ 後半：おどりが はやく なり、目が 赤く もえ、歯が 光り、まわりに 風の うずが まう */
const awaodoriOuP0: MonsterDesign = {
  ...awaodoriOu,
  colors: { ...odoriColors, E: NQ.red, W: NQ.cream },
  layers: [
    { mirror: true, y: 14, rows: ['M.......', '.M......', '.M......', 'M.......'] },
    { mirror: true, y: 26, rows: ['..M.....', '.M......', '.M......', '..M.....'] },
    { mirror: true, y: 37, rows: ['.M......', 'M.......', 'M.......', '.M......'] },
    { mirror: true, rows: ODORI },
  ],
};

// ───────────────────────── 裏ステージ ─────────────────────────

/** 蜂須賀家政：金の くわがたと うず潮の まるい 前立て、藍色の よろい（ミズ） */
const hachisukaIemasa = lord(
  [
    '.........GG.............',
    '.........GG.............',
    '..........GG............',
    '...........GG...........',
    '............GG..........',
    '.............GG.....GGGG',
    '..............GG..GGWWWG',
    '...............GGGGWGGWG',
    '................GGGWWGGG',
    '...............NNNNNGGGG',
    ...HELMET,
    ...FACE,
  ],
  {
    N: NQ.navy,
    L: NQ.denim,
    K: NQ.navy,
    S: NQ.denim,
    G: NQ.gold,
    Y: NQ.yellow,
    R: NQ.red,
    T: NQ.indigo,
    H: NQ.denim,
    W: NQ.white,
  },
  { [NQ.denim]: NQ.navy },
  [
    // 高く かかげた 軍配（ぐんばい）
    ...inked(
      [
        '.GGGGG.',
        'GRRRRRG',
        'GRRRRRG',
        'GRRRRRG',
        'GRRRRRG',
        '.GGGGG.',
        '...W...',
        '...W...',
        '...W...',
        '...W...',
        '...W...',
        '...W...',
      ],
      38,
      3,
    ),
    ...inked(['.FFF', 'FFFF', '.FF.'], 38, 15),
    { x: 39, y: 18, rows: ['KKK', 'KKK', 'KKK', 'KKK', 'KKK', 'KKK', 'KKK'] },
    // うずの 光
    { x: 2, y: 6, rows: ['.Y.', 'YGY', '.Y.'] },
    { x: 33, y: 22, rows: ['.Y.', 'YGY', '.Y.'] },
  ],
);

// ───────────────────────── 日和佐の ウミガメ ─────────────────────────

const umigameColors = {
  A: NQ.azure,
  B: NQ.blue,
  K: NQ.sky,
  S: NQ.sand,
  T: NQ.tan,
  W: NQ.white,
  p: NQ.blush,
};

/** ハマガメン：日和佐の 大浜海岸の 小さな ウミガメ。すなの 色の こうらと、ひれの ような まえあし（ミズ） */
const hamagamen: MonsterDesign = {
  size: 32,
  colors: umigameColors,
  rim: { [NQ.azure]: NQ.blue, [NQ.sand]: NQ.tan },
  layers: [
    // ひれ（まえあし）
    { mirror: true, x: 1, y: 18, rows: ['..AAA', '.AAAA', 'AAAAA', 'AAAAA', '.AAAA', '..AAA'] },
    // からだ
    {
      mirror: true,
      y: 8,
      rows: [
        '..........AAAAAA',
        '........AAAAAAAA',
        '.......AAAAAAAAA',
        '......AAAAAAAAAA',
        '......AAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '.....AAAAAWWAAAA',
        '.....AAAAAWoAAAA',
        '.....AAAAAWoAAAA',
        '.....AAAppAAAAoA',
        '.....AAAAAAAAAAo',
        '.....AAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '......AAAAAAAAAA',
        '......AAAAAAAAAA',
        '.......AAAAAAAAA',
        '........AAAAAAAA',
        '.....AAA..AAAAAA',
        '.....AAA..AAA...',
      ],
    },
    // すなの こうら
    {
      mirror: true,
      y: 1,
      rows: [
        '..........SSSSSS',
        '........SSSSSSSS',
        '.......SSSSSSSSS',
        '......SSTSSSSTSS',
        '......SSSSSSSSSS',
        '......STSSSSSTSS',
        '.......SSSSSSSSS',
        '.......SSTSSSSSS',
        '........SSSSSSSS',
      ],
    },
    // 波
    { x: 1, y: 26, rows: ['.KK', 'K..', '.KK'] },
    { x: 27, y: 24, rows: ['KK.', '..K', 'KK.'] },
  ],
};

/** オオガメドン（ハマガメンの しんか）：ひとまわり 大きな ウミガメ。ごつごつの こうらと きりっと した まゆ（ミズ） */
const oogamedon: MonsterDesign = {
  size: 32,
  colors: umigameColors,
  rim: { [NQ.azure]: NQ.blue, [NQ.sand]: NQ.tan },
  layers: [
    { mirror: true, x: 1, y: 17, rows: ['..AAA', '.AAAA', 'AAAAA', 'AAAAA', 'AAAAA', '.AAAA', '..AAA'] },
    {
      mirror: true,
      y: 7,
      rows: [
        '.........AAAAAAA',
        '.......AAAAAAAAA',
        '......AAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '.....AAAoooAAAAA',
        '.....AAAAAAoAAAA',
        '....AAAAAAWWAAAA',
        '....AAAAAAWoAAAA',
        '....AAAAAAWoAAAA',
        '....AAAAppAAAAoA',
        '....AAAAAAAAAAoo',
        '....AAAAAAAAAAAA',
        '....AAAAAAAAAAAA',
        '....AAAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '......AAAAAAAAAA',
        '.......AAAAAAAAA',
        '....AAAA..AAAAAA',
        '....AAAA..AAAA..',
      ],
    },
    {
      mirror: true,
      rows: [
        '.........SSSSSSS',
        '.......SSSSSSSSS',
        '......SSSSSSSSSS',
        '.....SSTSSSSSTSS',
        '.....SSSSSSSSSSS',
        '....STSSSSSTSSSS',
        '....SSSSSSSSSSSS',
        '....SSTSSSSSSTSS',
        '.....SSSSSSSSSSS',
        '......SSSSSSSSSS',
      ],
    },
    { x: 1, y: 27, rows: ['.KK', 'K..', '.KK'] },
    { x: 27, y: 23, rows: ['KK.', '..K', 'KK.'] },
  ],
};

export const TOKUSHIMA: Readonly<Record<string, MonsterDesign>> = {
  'tokushima-sudachibi': sudachibi,
  'tokushima-sudachi-musha': sudachiMusha,
  'tokushima-kintokin': kintokin,
  'tokushima-oo-kintoki': ooKintoki,
  'tokushima-kazura-musasabi': kazuraMusasabi,
  'tokushima-sorawatari': sorawatari,
  'tokushima-hamagamen': hamagamen,
  'tokushima-oogamedon': oogamedon,
  'tokushima-midboss-uzushion': uzushion,
  'tokushima-midboss-uzushion.field': uzushionField,
  'tokushima-boss-awaodori-ou': awaodoriOu,
  'tokushima-boss-awaodori-ou.p0': awaodoriOuP0,
  'tokushima-lastboss-hachisuka-iemasa': hachisukaIemasa,
};
