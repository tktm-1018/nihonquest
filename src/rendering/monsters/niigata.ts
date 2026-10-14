/** 新潟県の モンスター（手描き。docs/06 §4・§6.3〜6.5 の 規格） */
import { NQ } from '../palette';
import type { MonsterDesign } from './design';
import { lord } from './lastbosses';

/**
 * 花火の 光：まん中から のびる とげとげ。fill = 中、tips = とげの 先の 色（左右で そろうように えらぶ）。
 * 外周 1 ドットは 空ける
 */
function hanabi(
  size: number,
  cx: number,
  cy: number,
  rIn: number,
  rOut: number,
  n: number,
  fill: string,
  tips: string,
): string[] {
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => {
      if (x < 1 || y < 1 || x > size - 2 || y > size - 2) return '.';
      const d = Math.hypot(x - cx, y - cy);
      const k = ((Math.atan2(x - cx, cy - y) + Math.PI) / (2 * Math.PI)) * n;
      const u = k % 1;
      const r = rIn + (rOut - rIn) * (1 - 2 * Math.min(u, 1 - u));
      if (d > r) return '.';
      const i = Math.round(k) % n;
      return d > r - 3 ? tips[Math.min(i, n - i) % tips.length]! : fill;
    }).join(''),
  );
}

// ───────────────────────── 通常 ─────────────────────────

/** イナホン：たて長の お米の つぶ。頭から 稲穂が のびて 右へ おもそうに たれ、左に 葉が 1 まい（モリ） */
const inahon: MonsterDesign = {
  size: 32,
  colors: {
    P: NQ.paper,
    W: NQ.white,
    p: NQ.blush,
    Y: NQ.gold,
    Q: NQ.ochre,
    G: NQ.green,
    L: NQ.leaf,
    S: NQ.sand,
  },
  rim: { [NQ.paper]: NQ.cloud },
  layers: [
    // 稲穂（くき・つぶつぶの 穂）と 葉
    {
      x: 10,
      rows: [
        '................',
        '.......GGGYY....',
        'L.....G..YYQY...',
        'LL...G....QYYY..',
        '.GL..G....YQYQY.',
        '..GL.G.....YYYQ.',
        '...GLG.....QYQYY',
        '.....G......YYQY',
        '.............QYY',
        '.............YQ.',
        '..............Q.',
      ],
    },
    // お米の つぶの からだ・小さな 手・足
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '.............PPP',
        '............PPPP',
        '...........PPPPP',
        '..........PPPPPP',
        '.........PPPPPPP',
        '........PPPPPPPP',
        '........PPPPPPPP',
        '........PPPPPPPP',
        '.......PPPPPPPPP',
        '.......PPPPPPPPP',
        '.......PPPPPPPPP',
        '.......PPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '......PPPPPPPPPP',
        '.......PPPPPPPPP',
        '........PPPPPPPP',
        '........PPPPPPPP',
        '........PPPPPPPP',
        '.........PPPPPPP',
        '..........PPPPPP',
        '...........PPPPP',
        '............PPPP',
        '..........SSSPPP',
        '.........SSSS...',
      ],
    },
    // かお
    {
      mirror: true,
      y: 15,
      rows: [
        '...........WW...',
        '...........Wo...',
        '...........Wo...',
        '.........pp.....',
        '..............oo',
      ],
    },
    // つや（左上）
    { x: 11, y: 9, rows: ['.W', 'W.', 'W.'] },
  ],
};

/** ヒスイコロ：糸魚川の 海岸を ころがる ヒスイの 石。角を おとした 四角、上の 面は 明るく、白い すじと ひび（ツチ） */
const hisuiKoro: MonsterDesign = {
  size: 32,
  colors: {
    J: NQ.leaf,
    g: NQ.green,
    l: NQ.lime,
    s: NQ.sprout,
    W: NQ.white,
    P: NQ.paper,
    p: NQ.blush,
    T: NQ.tan,
    B: NQ.brown,
  },
  rim: { [NQ.leaf]: NQ.green, [NQ.tan]: NQ.brown },
  rimDepth: 2,
  layers: [
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
        '.........lllllll',
        '........lsslllll',
        '.......lssllllll',
        '......llslllllll',
        '.....JlllJJJJJJJ',
        '....JJJJJJJJJJJJ',
        '....JJJJJJJJJJJJ',
        '....JJJJJJJJJJJJ',
        '....JJJJJJJJJJJJ',
        '....JJJJJJJJJJJJ',
        '....JJJJJJJJJJJJ',
        '....JJJJJJJJJJJJ',
        '....JJJJJJJJJJJJ',
        '....JJJJJJJJJJJJ',
        '....JJJJJJJJJJJJ',
        '....JJJJJJJJJJJJ',
        '.....JJJJJJJJJJJ',
        '......JJJJJJJJJJ',
        '.......JJJJJJJJJ',
        '........JJJJJJJJ',
        '........TTT..JJJ',
        '.......TTTT.....',
        '.......BBBB.....',
      ],
    },
    // 白い すじ（ヒスイの もよう）
    { x: 5, y: 13, rows: ['P..', 'PP.', '.PP', '..P'] },
    { x: 22, y: 15, rows: ['...P', '..PP', '.PP.', 'P...'] },
    { x: 6, y: 21, rows: ['PP...', '.PPP.', '...PP'] },
    // ひび（右上の 面の さかい）
    { x: 20, y: 12, rows: ['.g.', 'g.g', '...', 'g..'] },
    // かお
    {
      mirror: true,
      y: 15,
      rows: [
        '..........WW....',
        '..........Wo....',
        '..........Wo....',
        '........pp...o..',
        '..............oo',
      ],
    },
    // つや と きらり
    { x: 6, y: 13, rows: ['W', 'W'] },
    { x: 2, y: 4, rows: ['.W.', 'WsW', '.W.'] },
  ],
};

/** コトキ：佐渡の トキの ひな。目の まわりが 赤い かお、下へ まがった 黒い くちばし（先は 赤）、とき色の つばさ（カゼ） */
const kotoki: MonsterDesign = {
  size: 32,
  colors: {
    W: NQ.white,
    P: NQ.blush,
    A: NQ.apricot,
    R: NQ.red,
    N: NQ.night,
    n: NQ.slate,
    p: NQ.blush,
    E: NQ.paper,
  },
  rim: { [NQ.white]: NQ.cloud, [NQ.blush]: NQ.berry },
  layers: [
    // とき色の つばさ（からだの よこから のぞく）
    {
      mirror: true,
      y: 9,
      rows: [
        '.A..............',
        '.AP.............',
        '.APP............',
        '.APPP...........',
        '.APPPW..........',
        '..APPPW.........',
        '..APPPWW........',
        '...APPPW........',
        '...APPPW........',
        '....APPW........',
        '.....APW........',
        '......A.........',
      ],
    },
    // かざり羽・まるい からだ・足
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '..........W.....',
        '..........WW..W.',
        '...........WW.WW',
        '...........WWWWW',
        '.............WWW',
        '..........WWWWWW',
        '.........WWWWWWW',
        '........WWWWWWWW',
        '.......WWWWWWWWW',
        '......WWWWWWWWWW',
        '......WWWWWWWWWW',
        '.....WWWWWWWWWWW',
        '.....WWWWWWWWWWW',
        '.....WWWWWWWWWWW',
        '.....WWWWWWWWWWW',
        '....WWWWWWWWWWWW',
        '.....WWWWWWWWWWW',
        '.....WWWWWWWWWWW',
        '.....WWWWWWWWWWW',
        '.....WWWWWWWWWWW',
        '......WWWWWWWWWW',
        '......WWWWWWWWWW',
        '.......WWWWWWWWW',
        '........WWWWWWWW',
        '.........WWWWWWW',
        '..........WWWWWW',
        '.............WWW',
        '............RR..',
        '...........RRRR.',
      ],
    },
    // 赤い かお（目の まわり）と 目
    {
      mirror: true,
      y: 10,
      rows: [
        '...........RRRRR',
        '..........RRRRRR',
        '.........RRWWRRR',
        '.........RRWoRRR',
        '.........RRWoRRR',
        '..........RRRRRR',
        '...........RRRRR',
        '..........pp....',
      ],
    },
    // くちばし（下へ まがる。先は 赤）
    { x: 14, y: 14, rows: ['nNN', 'NNN', 'NNN', '.NN', '.NN', '..NN', '..NR', '...R'] },
    // むねの ふわふわ
    { x: 10, y: 24, rows: ['E.E'] },
    { x: 20, y: 24, rows: ['E.E'] },
  ],
};

/** シオビキン：村上の 塩引き鮭。たて長の 鮭の からだ、白い おなか、頭に わらなわ、下に 大きな 尾びれ（ミズ） */
const shiobikin: MonsterDesign = {
  size: 32,
  colors: {
    A: NQ.apricot,
    V: NQ.vermilion,
    b: NQ.brick,
    N: NQ.navy,
    n: NQ.denim,
    P: NQ.paper,
    W: NQ.white,
    S: NQ.sand,
    T: NQ.tan,
    p: NQ.blush,
  },
  rim: { [NQ.apricot]: NQ.vermilion, [NQ.navy]: NQ.ink },
  layers: [
    // わらなわ（頭の 上）
    { x: 12, y: 2, rows: ['SSTSSTSS', 'TSSTSSTS'] },
    // からだ（せなかは こい 青、おなかは だいだい）
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '................',
        '..........NNNNNN',
        '........NNNNNNNN',
        '.......NNNNNNNNN',
        '......NNNNNNNNNN',
        '......NNNNNNNNNN',
        '.....NNNNNNNNNNN',
        '.....NnnnnnAAAAA',
        '....AAAAAAAAAAAA',
        '....AAAAAAAAAAAA',
        '....AAAAAAAAAAAA',
        '....AAAAAAAAAAAA',
        '....AAAAAAAAAAAA',
        '....AAAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '......AAAAAAAAAA',
        '......AAAAAAAAAA',
        '.......AAAAAAAAA',
        '........AAAAAAAA',
        '.........AAAAAAA',
        '..........VVVVVV',
        '.........VVVVVVV',
        '........VVVVVVVV',
        '.......VVVVVVVVV',
        '......VVVVVVV...',
        '......VVVV......',
      ],
    },
    // 白い おなか
    {
      mirror: true,
      y: 20,
      rows: ['........PPPPPPPP', '.........PPPPPPP', '.........PPPPPPP', '..........PPPPPP'],
    },
    // よこの ひれ
    { x: 1, y: 17, rows: ['..VV', '.VVV', 'VVVV', '.VVb'] },
    { x: 27, y: 17, rows: ['VV..', 'VVV.', 'VVVV', 'bVV.'] },
    // かお（目・ほっぺ・口）
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
    // つや
    { x: 8, y: 13, rows: ['.W', 'W.'] },
  ],
};

/** キタカゼザケ（シオビキンの しんか）：北風を まとって とびはねる 大きな 鮭。赤い すじと きりっと した まゆ（ミズ） */
const kitakazeZake: MonsterDesign = {
  size: 32,
  colors: {
    A: NQ.apricot,
    V: NQ.vermilion,
    b: NQ.brick,
    N: NQ.navy,
    n: NQ.denim,
    P: NQ.paper,
    W: NQ.white,
    M: NQ.mint,
    I: NQ.ice,
    p: NQ.blush,
  },
  rim: { [NQ.apricot]: NQ.vermilion, [NQ.navy]: NQ.ink },
  layers: [
    // 北風（うしろ）
    { x: 1, y: 6, rows: ['.MMM.', 'M....', 'M..MM', '.MMI.'] },
    { x: 26, y: 20, rows: ['.MMM.', '....M', 'MM..M', '.IMM.'] },
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '.........NNNNNNN',
        '.......NNNNNNNNN',
        '......NNNNNNNNNN',
        '.....NNNNNNNNNNN',
        '.....NNNNNNNNNNN',
        '....NNNNNNNNNNNN',
        '....NnnnnnnAAAAA',
        '...AAAAAAAAAAAAA',
        '...AAAAAAAAAAAAA',
        '...AAAAAAAAAAAAA',
        '...AAAAAAAAAAAAA',
        '...AAAAAAAAAAAAA',
        '...AAAAAAAAAAAAA',
        '...AAAAAAAAAAAAA',
        '....AAAAAAAAAAAA',
        '....AAAAAAAAAAAA',
        '....AAAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '.....AAAAAAAAAAA',
        '......AAAAAAAAAA',
        '.......AAAAAAAAA',
        '........AAAAAAAA',
        '.........VVVVVVV',
        '........VVVVVVVV',
        '.......VVVVVVVVV',
        '......VVVVVVVVVV',
        '.....VVVVVVVVVV.',
        '.....VVVVVVV....',
        '.....VVVV.......',
      ],
    },
    // 白い おなかと 赤い すじ
    {
      mirror: true,
      y: 19,
      rows: ['.......PPPPPPPPP', '.......PPPPPPPPP', '........PPPPPPPP', '.........PPPPPPP'],
    },
    { mirror: true, y: 13, rows: ['....bbbbbbbbbbbb'] },
    // 大きな よこひれ
    { x: 1, y: 16, rows: ['...VV', '..VVV', '.VVVV', 'VVVVV', '.VVbb'] },
    { x: 26, y: 16, rows: ['VV...', 'VVV..', 'VVVV.', 'VVVVV', 'bbVV.'] },
    // かお（きりっと した まゆ）
    {
      mirror: true,
      y: 8,
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
    { x: 7, y: 11, rows: ['.W', 'W.'] },
  ],
};

// ───────────────────────── しんか ─────────────────────────

/** ミノリマル（イナホンの しんか）：実った 稲穂を 左右に たらした かぶと、わらなわの おび、米俵の たて（モリ） */
const minoriMaru: MonsterDesign = {
  size: 32,
  colors: {
    P: NQ.paper,
    W: NQ.white,
    p: NQ.blush,
    Y: NQ.gold,
    Q: NQ.ochre,
    G: NQ.green,
    S: NQ.sand,
    T: NQ.tan,
    B: NQ.brown,
  },
  rim: { [NQ.paper]: NQ.cloud, [NQ.sand]: NQ.tan },
  layers: [
    // 左右に たれた 稲穂の かざり
    {
      mirror: true,
      y: 1,
      rows: [
        '........QYYYGG..',
        '......QYQYQ..GG.',
        '.....YQYQ.....G.',
        '....QYQY......GG',
        '....YQYQ........',
        '....QYQ.........',
        '.....Q..........',
      ],
    },
    // からだ・わらなわの おび・足
    {
      mirror: true,
      rows: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '..............PP',
        '............PPPP',
        '..........PPPPPP',
        '.........PPPPPPP',
        '........PPPPPPPP',
        '.......PPPPPPPPP',
        '......PPPPPPPPPP',
        '......PPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '....STSTSTSTSTST',
        '....TSTSTSTSTSTS',
        '....PPPPPPPPPPPP',
        '....PPPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '.....PPPPPPPPPPP',
        '......PPPPPPPPPP',
        '.......PPPPPPPPP',
        '........PPP.....',
        '.......SSSS.....',
        '.......BBBB.....',
      ],
    },
    // かお（きりっと した まゆ）
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
        '..............oo',
      ],
    },
    // 米俵の たて（左手。3 本の なわ、左の はしは まるい ふた）
    {
      x: 1,
      y: 17,
      rows: [
        '...SBSSBSSBo',
        '.TTSBSSBSSBo',
        'TTTSBSSBSSBo',
        'TBTSBSSBSSBo',
        'TTTSBSSBSSBo',
        'TBTSBSSBSSBo',
        'TTTSBSSBSSBo',
        '.TTTBTTBTTBo',
        '...TBTTBTTo.',
      ],
    },
    // 右手（こぶしを あげる）
    { x: 27, y: 14, rows: ['PPP', 'PPP', '.PP', '.PP', 'PP.'] },
    // つや（左上）
    { x: 9, y: 8, rows: ['.W', 'W.'] },
  ],
};

/** ヒスイの 結晶（とがった 六角の 柱。左の 面が 明るく、右の 面が こい） */
const CRYSTAL = ['..l..', '.llJ.', '.lsJg', 'llsJg', 'lsJJg', 'lsJJg', 'lJJJg'];
const CRYSTAL_S = ['.l.', 'llJ', 'lsg', 'lJg', 'lJg'];

/** ヒスイゴロウ（ヒスイコロの しんか）：灰色の 岩の からだに ヒスイの 結晶が 生えた ゴロウ。むねに 大きな ヒスイ（ツチ） */
const hisuiGoro: MonsterDesign = {
  size: 32,
  colors: {
    J: NQ.leaf,
    g: NQ.green,
    l: NQ.lime,
    s: NQ.sprout,
    W: NQ.white,
    p: NQ.blush,
    R: NQ.silver,
    r: NQ.gray,
    K: NQ.slate,
    P: NQ.cloud,
  },
  rim: { [NQ.silver]: NQ.gray },
  rimDepth: 2,
  layers: [
    // 頭と かたの 結晶
    { x: 13, y: 1, rows: CRYSTAL },
    { x: 9, y: 4, rows: CRYSTAL_S },
    { x: 20, y: 4, rows: CRYSTAL_S },
    { x: 2, y: 7, rows: CRYSTAL_S },
    { x: 27, y: 7, rows: CRYSTAL_S },
    // 岩の からだ（かた・うで・足）
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
        '.........RRRRRRR',
        '.......RRRRRRRRR',
        '......RRRRRRRRRR',
        '.RRRR.RRRRRRRRRR',
        '.RRRRRRRRRRRRRRR',
        '.RRRRRRRRRRRRRRR',
        '.RRRRRRRRRRRRRRR',
        '.RRRRoRRRRRRRRRR',
        '..RRRoRRRRRRRRRR',
        '..RRRoRRRRRRRRRR',
        '..RRRoRRRRRRRRRR',
        '..RRRoRRRRRRRRRR',
        '.RRRRoRRRRRRRRRR',
        '.RRRRRoRRRRRRRRR',
        '.RRRRRoRRRRRRRRR',
        '..RRR.RRRRRRRRRR',
        '......RRRRRRRRRR',
        '.......RRRRRRRRR',
        '.......RRRRR....',
        '.......RRRRR....',
        '......RRRRRR....',
        '......RRRRRR....',
        '......KKKKKK....',
      ],
    },
    // むねの 大きな ヒスイ
    {
      mirror: true,
      y: 19,
      rows: [
        '.............lll',
        '............llsl',
        '...........lssJJ',
        '...........lsJJJ',
        '...........lJJJJ',
        '............JJJJ',
        '.............JJJ',
      ],
    },
    { x: 17, y: 21, rows: ['.g', 'gg', 'gg', 'g.'] },
    { x: 18, y: 20, rows: ['g', 'g', 'g', 'g', 'g'] },
    // 岩の ひび
    { x: 8, y: 10, rows: ['.K', 'K.', '.K'] },
    { x: 23, y: 23, rows: ['K.', '.K', 'K.'] },
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
        '.............ooo',
      ],
    },
    // 岩の つや
    { x: 8, y: 8, rows: ['.PP', 'P..'] },
    { x: 2, y: 11, rows: ['PP'] },
  ],
};

/** アケボノトキ（コトキの しんか）：ななめ上へ 大きく ひろげた とき色の つばさ（先は 指のように わかれる）、長い かざり羽と くちばし（カゼ） */
const akebonoToki: MonsterDesign = {
  size: 32,
  colors: {
    W: NQ.white,
    P: NQ.blush,
    A: NQ.apricot,
    O: NQ.vermilion,
    R: NQ.red,
    N: NQ.night,
    n: NQ.slate,
    p: NQ.blush,
    E: NQ.paper,
  },
  rim: { [NQ.white]: NQ.cloud, [NQ.blush]: NQ.berry },
  layers: [
    // つばさ（肩から 左右 ななめ上へ。うらは とき色、ふちは だいだい）
    {
      mirror: true,
      y: 2,
      rows: [
        '.O..............',
        '.OA.............',
        '.OAA............',
        '..OAP...........',
        '.OAPPW..........',
        '..OAPPW.........',
        '.OAPPPWW........',
        '..OAPPPWW.......',
        '...OAPPPWW......',
        '..OAAPPPPWW.....',
        '...OAPPPPPWW....',
        '....OAPPPPPW....',
        '.....OAPPPPW....',
        '......OAPPPW....',
        '.......AAPPW....',
        '........AP......',
      ],
    },
    // かざり羽（うしろへ 長く）・からだ・足
    {
      mirror: true,
      rows: [
        '................',
        '..........W.....',
        '.........WW...W.',
        '..........WW..WW',
        '...........WWWWW',
        '...........WWWWW',
        '..........WWWWWW',
        '.........WWWWWWW',
        '.........WWWWWWW',
        '.........WWWWWWW',
        '.........WWWWWWW',
        '.........WWWWWWW',
        '.........WWWWWWW',
        '........WWWWWWWW',
        '........WWWWWWWW',
        '........WWWWWWWW',
        '........WWWWWWWW',
        '.......WWWWWWWWW',
        '.......WWWWWWWWW',
        '.......WWWWWWWWW',
        '.......WWWWWWWWW',
        '........WWWWWWWW',
        '.........WWWWWWW',
        '..........WWWWWW',
        '...........WWWWW',
        '............WWWW',
        '............R..R',
        '............R..R',
        '...........RR.RR',
      ],
    },
    // 赤い かお と 目（きりっと）
    {
      mirror: true,
      y: 7,
      rows: [
        '...........oo...',
        '..........RRoRRR',
        '.........RRWWRRR',
        '.........RRWoRRR',
        '.........RRWoRRR',
        '..........RRRRRR',
        '...........RRRRR',
        '..........pp....',
      ],
    },
    // 長い くちばし
    { x: 14, y: 11, rows: ['nNN', 'NNN', 'NNN', '.NN', '.NN', '.NN', '..NN', '..NN', '..NR', '...R'] },
    // むねの ふわふわ
    { x: 11, y: 21, rows: ['E.E'] },
    { x: 19, y: 21, rows: ['E.E'] },
  ],
};

// ───────────────────────── 中ボス ─────────────────────────

/** (x, y) → 文字 の 関数で 文字の 地図を 作る（'.' は とうめい。外周 1 ドットは 空ける） */
const plot = (S: number, f: (x: number, y: number) => string): string[] =>
  Array.from({ length: S }, (_, y) =>
    Array.from({ length: S }, (_, x) => (x < 1 || y < 1 || x > S - 2 || y > S - 2 ? '.' : f(x, y))).join(''),
  );

type Pt = readonly [number, number];
/** 折れ線に そった 太い ひも（はじめ r0 → おわり r1）。入れば 0〜1（はじめ→おわり）、入らなければ -1 */
const tube = (pts: readonly Pt[], r0: number, r1: number) => {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i]![0], p[1] - pts[i]![1]));
  const total = lens.reduce((a, b) => a + b, 0);
  return (x: number, y: number): number => {
    let run = 0;
    let best = -1;
    for (let i = 0; i < lens.length; i++) {
      const [ax, ay] = pts[i]!;
      const [bx, by] = pts[i + 1]!;
      const L = lens[i]!;
      const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / (L * L)));
      const u = (run + t * L) / total;
      const d = Math.hypot(x - (ax + t * (bx - ax)), y - (ay + t * (by - ay)));
      if (d <= r0 + (r1 - r0) * u) best = u;
      run += L;
    }
    return best;
  };
};

/** サンシャクドンの 鉄の 花火だま（S＝キャンバス。40 と 32 で 同じ 形を ちぢめて つかう） */
const sanjakuParts = (S: number) => {
  const k = S / 40;
  const c = (S - 1) / 2;
  const cy = 21 * k;
  const R = 12.5 * k;
  const ball = (x: number, y: number) => Math.hypot(x - c, y - cy) <= R;
  // まわりの 鉄の とげ（上は 金の つのと 導火線、下は 足なので あける）
  const spikeAt = [55, 95, 135].flatMap((a) => [a, -a]).map((a) => (a * Math.PI) / 180);
  const spike = (x: number, y: number) => {
    const d = Math.hypot(x - c, y - cy);
    const len = R + 5.5 * k;
    if (d < R - 1 || d > len) return false;
    const ang = Math.atan2(x - c, cy - y);
    return spikeAt.some((a) => Math.abs(ang - a) * d <= (len - d) * 0.6);
  };
  // 金の つの（ななめ上へ そりあがる）
  const hornL = tube(
    [
      [c - 5.5 * k, cy - 10 * k],
      [c - 9.5 * k, cy - 15 * k],
      [c - 9 * k, cy - 19.5 * k],
    ],
    2.2 * k,
    0.6,
  );
  const horn = (x: number, y: number) => hornL(x, y) >= 0 || hornL(S - 1 - x, y) >= 0;
  /** からだの 色：左上が 明るい 朱、ほかは れんが（右下の ふちは rim で こげ茶） */
  const body = (x: number, y: number) => {
    const u = (x - c) / R;
    const v = (y - cy) / R;
    if (Math.hypot(u + 0.45, v + 0.5) < 0.28) return 'A';
    return u + v < -0.55 ? 'V' : 'b';
  };
  return { c, cy, R, ball, spike, horn, body };
};

/** 足もとで はぜる 火の粉 */
const SPARK_L = ['.G..', 'GAG.', '.AV.', '..V.'];
const SPARK_R = ['..G.', '.GAG', '.VA.', '.V..'];

/**
 * サンシャクドン（中ボス）：長岡の 正三尺玉の 花火だまが 鉄の とげを はやした すがた。うしろで 花火が 大きく はじけ、
 * 頭に 金の つの と 火花の とぶ 導火線。顔は 黒い かげの 中で 黄色い 目が つりあがって 光り、
 * 金の たがの まん中に 赤い 宝石、大きく あけた 口に きば（ヒノ）
 */
const SJ = sanjakuParts(40);
const sanjakuDon: MonsterDesign = {
  size: 40,
  colors: {
    V: NQ.vermilion,
    b: NQ.brick,
    A: NQ.apricot,
    G: NQ.gold,
    Q: NQ.ochre,
    R: NQ.red,
    Y: NQ.yellow,
    C: NQ.cream,
    W: NQ.white,
    N: NQ.night,
    L: NQ.slate,
    T: NQ.tan,
  },
  rim: { [NQ.gold]: NQ.ochre, [NQ.brick]: NQ.bark },
  rimDepth: 2,
  layers: [
    // うしろで はじける 花火
    { rows: hanabi(40, 19.5, 20, 14, 19, 12, 'G', 'CA') },
    // 鉄の とげ・金の つの
    {
      rows: plot(40, (x, y) => {
        if (SJ.horn(x, y)) return 'G';
        if (!SJ.spike(x, y)) return '.';
        return x < SJ.c && (x + y) % 3 === 0 ? 'L' : 'N';
      }),
    },
    // 花火だまの からだ
    { rows: plot(40, (x, y) => (SJ.ball(x, y) ? SJ.body(x, y) : '.')) },
    // 鉄の 足（ふんばる）
    {
      mirror: true,
      y: 32,
      rows: [
        '.........NNNN.......',
        '........NNNNN.......',
        '.......NNNNNN.......',
        '......NNNNNNN.......',
        '.....NNNNNNNN.......',
        '.....LLLLLLLL.......',
      ],
    },
    // 顔の 黒い かげ（上の ふちが V の 字の まゆに なる）と つりあがって 光る 目
    {
      mirror: true,
      y: 11,
      rows: [
        '....................',
        '...........NNN......',
        '..........NNNNNN....',
        '.........NNNNNNNNN..',
        '.........NYYNNNNNNNN',
        '........NNYWWYYYNNNN',
        '........NNNYYYYYYNNN',
        '........NNNNNNYYNNNN',
        '.........NNNNNNNNNNN',
      ],
    },
    // 金の たが（びょう）と 赤い 宝石
    { mirror: true, y: 20, rows: ['........GGGGGGGGGGGG', '........QGGGQGGGQGGG'] },
    { x: 18, y: 18, rows: ['.RR.', 'RWRR', 'RRRR', '.RR.'] },
    // 大きく あけた 口・きば・した
    {
      mirror: true,
      y: 22,
      rows: [
        '.........ooooooooooo',
        '.........oWWoWWWoWWW',
        '..........oWooWWooWo',
        '..........ooooooRRRR',
        '...........oWoooRRRR',
        '...........WWoWWoWWo',
        '............oooooooo',
      ],
    },
    // 導火線と 火花
    { x: 19, y: 6, rows: ['T', 'T', 'T'] },
    { x: 17, y: 1, rows: ['A...A', '.YWY.', 'AWWWA', '.YWY.', 'A...A'] },
    // 足もとの 火の粉
    { x: 3, y: 33, rows: SPARK_L },
    { x: 33, y: 33, rows: SPARK_R },
  ],
};

/** サンシャクドン（フィールドに立つ 32×32）：バトルの すがたを ちぢめた もの */
const SJF = sanjakuParts(32);
const sanjakuDonField: MonsterDesign = {
  size: 32,
  colors: {
    V: NQ.vermilion,
    b: NQ.brick,
    A: NQ.apricot,
    G: NQ.gold,
    Q: NQ.ochre,
    R: NQ.red,
    Y: NQ.yellow,
    W: NQ.white,
    N: NQ.night,
    L: NQ.slate,
  },
  rim: { [NQ.gold]: NQ.ochre, [NQ.brick]: NQ.bark },
  layers: [
    { rows: hanabi(32, 15.5, 16.8, 11, 15, 10, 'G', 'A') },
    {
      rows: plot(32, (x, y) => {
        if (SJF.horn(x, y)) return 'G';
        if (!SJF.spike(x, y)) return '.';
        return 'N';
      }),
    },
    { rows: plot(32, (x, y) => (SJF.ball(x, y) ? SJF.body(x, y) : '.')) },
    {
      mirror: true,
      y: 26,
      rows: ['.......NNN......', '......NNNN......', '.....NNNNN......', '.....LLLLL......'],
    },
    {
      mirror: true,
      y: 9,
      rows: [
        '.........NN.....',
        '........NNNNN...',
        '.......NYYNNNNNN',
        '.......NYWYYYNNN',
        '.......NNNNYYNNN',
        '........NNNNNNNN',
      ],
    },
    { mirror: true, y: 15, rows: ['.......GGGGGGGGG'] },
    { x: 14, y: 14, rows: ['.RR.', 'RRRR', '.RR.'] },
    {
      mirror: true,
      y: 17,
      rows: [
        '........oooooooo',
        '........oWWoWWoW',
        '.........oooRRRR',
        '.........WWoWWoW',
        '..........oooooo',
      ],
    },
    { x: 15, y: 4, rows: ['W', 'W'] },
    { x: 14, y: 1, rows: ['A.A', '.W.', 'A.A'] },
  ],
};

// ───────────────────────── 県ボス ─────────────────────────

/** 正面の 錦鯉：はばの ひろい 頭と、水から 出た むね（まん中 23.5） */
const koiHead = (x: number, y: number) => {
  const dy = y - 18;
  const rx = 13.5 + (dy > 0 ? 1.2 : 0) - Math.max(0, -dy - 6) * 0.9;
  return Math.abs(x - 23.5) <= rx * Math.sqrt(Math.max(0, 1 - (dy / 12.5) ** 2));
};
const koiBody = (x: number, y: number) => ((x - 23.5) / 13) ** 2 + ((y - 36) / 9) ** 2 <= 1;
/** 左右へ つばさの ように ひろがる とがった むなびれ（ゆびの ような とげ） */
const koiFin = (x: number, y: number) => {
  const xl = x < 24 ? x : 47 - x;
  const d = Math.hypot(xl - 13, y - 27);
  const a = (Math.atan2(13 - xl, y - 27) * 180) / Math.PI; // 0 = 下、90 = 外がわ、180 = 上
  if (a < 35 || a > 150 || xl > 15) return '.';
  const u = ((a - 35) % 23) / 23;
  const tip = 7.5 + 6 * (1 - 2 * Math.abs(u - 0.5));
  if (d > tip) return '.';
  return d < 5 || Math.abs(u - 0.5) < 0.09 ? 'j' : 'I';
};
/** 金の つの（頭の 左右から うしろへ そりあがる）と 竜の ような 金の ひげ */
const KOI_HORN = tube(
  [
    [15, 10],
    [10, 5],
    [8, 1.5],
  ],
  2,
  0.6,
);
const KOI_WHISKER = tube(
  [
    [16, 27],
    [12, 30],
    [13, 34],
    [9, 37],
  ],
  0.7,
  0.5,
);
const mirrored = (f: (x: number, y: number) => number) => (x: number, y: number) =>
  f(x, y) >= 0 || f(47 - x, y) >= 0;
const koiHorn = mirrored(KOI_HORN);
const koiWhisker = mirrored(KOI_WHISKER);

/** 紅白の 赤い もよう（ひたい・ほお・むね） */
const koiRed = (x: number, y: number) =>
  ((x - 23.5) / 7) ** 2 + ((y - 10) / 4) ** 2 <= 1 ||
  ((Math.abs(x - 23.5) - 10) / 3) ** 2 + ((y - 21) / 3.5) ** 2 <= 1 ||
  ((Math.abs(x - 23.5) - 6) / 4) ** 2 + ((y - 36) / 3) ** 2 <= 1;

/** 頭の 上の とげの せびれ（まん中が いちばん 高い） */
const KOI_CREST = [
  '......................II',
  '.................I....II',
  '.................II..III',
  '................IIIj.IjI',
  '................IIIjIIjI',
  '...............IIIIjIIjI',
  '...............IIIIIIIjI',
];

/** からだ（うろこは 金の ふちどりの よろい）・頭・赤い もよう */
const KOI_SKIN = plot(48, (x, y) => {
  const head = koiHead(x, y);
  if (!head && !koiBody(x, y)) return '.';
  if (koiRed(x, y)) return 'R';
  if (!head) {
    // うろこ（3 ドットの 段ごとに ずらした 金の ふち）
    const row = Math.floor((y - 28) / 3);
    const sx = (x + row * 2) % 4;
    if ((y - 28) % 3 === 2 && sx === 2) return 'Y';
    if (sx === 0) return 'c';
  }
  return 'P';
});

/** 顔：太い いかりの まゆ・光る 目・大きく ひらいた 口と はの ならび（左半分） */
const KOI_FACE = [
  '..........ooo...........',
  '..........ooooo.........',
  '...........ooooooo......',
  '.........oEEEoooooo.....',
  '.........oEWEEERo.......',
  '..........oEEERRo.......',
  '...........ooooo........',
  '........................',
  '...................o....',
  '.................ccccccc',
  '...............ccooooooo',
  '..............ccWWoWWoWW',
  '..............coWooWooWo',
  '..............cooooorrrr',
  '..............coWoorWrrW',
  '..............ccWWoWWoWW',
  '...............ccooooooo',
  '.................ccccccc',
];

/** 足もとの 信濃川の 大波と しぶき */
const KOI_WAVE = [
  '..........W.....W................W......W.....',
  '.........WSW...WSW..............WSW....WSW....',
  '....W.....S.....S........W.......S......S.....',
  '...WSW...SSS...SSS......WSW.....SSS....SSS....',
  '....S...SSASS.SSASS......S.....SSASS..SSASS...',
  '...SSS.SAAAAASAAAAAS....SSS...SAAAAASSAAAAAS..',
  '..SSASSAAAAAAAAAAAASS..SSASS..SAAAAAAAAAAAAS..',
  '.SAAAAAAAAAAAAAAAAAAASSAAAAASSAAAAAAAAAAAAAAS.',
  '.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.',
  '.BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB.',
  '.BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB.',
  '..BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB..',
];

const koiColors = {
  P: NQ.paper,
  c: NQ.cloud,
  R: NQ.red,
  r: NQ.brick,
  W: NQ.white,
  Y: NQ.gold,
  I: NQ.red,
  j: NQ.brick,
  S: NQ.sky,
  A: NQ.azure,
  B: NQ.blue,
  E: NQ.yellow,
  n: NQ.navy,
};

/**
 * シナノガワノヌシ（県ボス）：信濃川に すむ 大きな 錦鯉（紅白）が 川から 正面へ ぬっと 立ちあがる。頭に 金の つのと
 * とげの せびれ、左右へ つばさの ように ひろがる 赤い むなびれ、むねの うろこは 金の ふちどりの よろい。
 * 太い いかりの まゆの 下で 黄色い 目が 光り、大きく ひらいた 口から 竜の ような 金の ひげが たれる（ミズ）
 */
const shinanogawaNoNushi: MonsterDesign = {
  size: 48,
  colors: koiColors,
  rim: {
    [NQ.paper]: NQ.cloud,
    [NQ.red]: NQ.brick,
    [NQ.azure]: NQ.blue,
    [NQ.gold]: NQ.ochre,
  },
  rimDepth: 2,
  layers: [
    { mirror: true, rows: KOI_CREST },
    { rows: plot(48, koiFin) },
    { rows: KOI_SKIN },
    { rows: plot(48, (x, y) => (koiHorn(x, y) || koiWhisker(x, y) ? 'Y' : '.')) },
    { mirror: true, y: 13, rows: KOI_FACE },
    { x: 1, y: 35, rows: KOI_WAVE },
  ],
};

/** 後半の うしろの いなずま（左右に 1 本ずつ） */
const BOLT_L = ['..E.', '.EE.', 'EE..', '.EEE', '..EE', '.EE.', '.E..', 'E...'];
const BOLT_R = ['.E..', '.EE.', '..EE', 'EEE.', 'EE..', '.EE.', '..E.', '...E'];

/**
 * シナノガワノヌシ 後半：滝を のぼった 鯉は 竜に なる…。うしろに 黒い うずと 金の いなずま、ひれは 朱に もえ、
 * うろこの よろいが 金に かがやく。目は 白く 光る
 */
const shinanogawaNoNushiP0: MonsterDesign = {
  ...shinanogawaNoNushi,
  colors: { ...koiColors, I: NQ.vermilion, S: NQ.white },
  rim: {
    [NQ.paper]: NQ.cloud,
    [NQ.red]: NQ.brick,
    [NQ.vermilion]: NQ.brick,
    [NQ.azure]: NQ.blue,
    [NQ.gold]: NQ.ochre,
  },
  layers: [
    // 黒い うず（とげとげの 先は 金）
    { rows: hanabi(48, 23.5, 20, 16, 23, 14, 'n', 'Y') },
    ...shinanogawaNoNushi.layers.slice(0, 4),
    {
      mirror: true,
      y: 13,
      rows: KOI_FACE.map((r, i) => (i >= 3 && i <= 5 ? r.replace(/E/g, 'W').replace(/R/g, 'E') : r)),
    },
    { x: 2, y: 2, rows: BOLT_L },
    { x: 42, y: 2, rows: BOLT_R },
    shinanogawaNoNushi.layers[5]!,
  ],
};

// ───────────────────────── ラスボス ─────────────────────────

/** 紺地に 日の丸の 旗（うしろに 立てる。さおは 黒うるし） */
const KENSHIN_BANNER = [
  'TZZZZZZZZ',
  'TZZZZZZZZ',
  'TZZZRRZZZ',
  'TZZRRRRZZ',
  'TZZRRRRZZ',
  'TZZZRRZZZ',
  'TZZZZZZZZ',
  'TZZZZZZZZ',
  ...Array.from({ length: 34 }, () => 'T'),
];

/** 上杉謙信：白い 頭巾（行人包み）と むらさきの よろい。頭巾の はしが 風に なびき、うしろに 紺地 日の丸の 旗（ヒカリ） */
const kenshinBody = lord(
  [
    '................PPPPPPPP',
    '..............PPPPPPPPPP',
    '.............PPPPPPPPPPP',
    '.............PPcPPPPPPPP',
    '............PPcPPPPPPPPP',
    '............PPPPPPFFFFFF',
    '............PPPPPPoooFFF',
    '............PPPPPPFWoFFF',
    '............PPPPPPFFFFFF',
    '............PPPPPPfFFFoo',
    '............PPPPPPPPPPPP',
    '...........PPPPPPPPPPPPP',
  ],
  {
    P: NQ.paper,
    c: NQ.cloud,
    K: NQ.indigo,
    S: NQ.violet,
    G: NQ.gold,
    R: NQ.red,
    T: NQ.night,
    H: NQ.slate,
    Z: NQ.navy,
  },
  { [NQ.paper]: NQ.cloud, [NQ.violet]: NQ.indigo },
  [
    // 首も 頭巾で つつむ
    { mirror: true, y: 21, rows: ['.................PPPPPPP'] },
    // 風に なびく 頭巾の はし（右）
    { x: 34, y: 12, rows: ['PP.....', 'PPP....', '.PPPP..', '..PPcP.', '...PPPP', '....PPc', '.....PP'] },
  ],
);

const uesugiKenshin: MonsterDesign = {
  ...kenshinBody,
  layers: [{ x: 2, y: 2, rows: KENSHIN_BANNER }, ...kenshinBody.layers],
};

export const NIIGATA: Readonly<Record<string, MonsterDesign>> = {
  'niigata-inahon': inahon,
  'niigata-minori-maru': minoriMaru,
  'niigata-hisui-koro': hisuiKoro,
  'niigata-hisui-goro': hisuiGoro,
  'niigata-kotoki': kotoki,
  'niigata-akebono-toki': akebonoToki,
  'niigata-shiobikin': shiobikin,
  'niigata-kitakaze-zake': kitakazeZake,
  'niigata-midboss-sanjaku-don': sanjakuDon,
  'niigata-midboss-sanjaku-don.field': sanjakuDonField,
  'niigata-boss-shinanogawa-no-nushi': shinanogawaNoNushi,
  'niigata-boss-shinanogawa-no-nushi.p0': shinanogawaNoNushiP0,
  'niigata-lastboss-uesugi-kenshin': uesugiKenshin,
};
