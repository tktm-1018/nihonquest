/**
 * 県ごとの 特別な タイル（321〜）。番号は src/shared/specialTiles.ts の SP。
 * 町（青森）の ねぶた・アスパム・八甲田丸・りんご市場、ダンジョン（恐山）の 床・かべ・風車・積み石・地蔵・太鼓橋・宇曽利湖、
 * 裏ステージの 参道、フィールドの かざり（かかし・ホタテ・流木・花・切り株・寒立馬・漁船・岩）。
 * 床と かべ 以外は「すけ」（decor レイヤーで 地面の 上に 重ねる）。色は NQ-48 だけ。
 */
import { NQ } from '../palette';
import { SP } from '../../shared/specialTiles';
import type { Rect, TileApi } from './townTiles';

/** 横長の だ円（cx・cy が 中心、rx・ry が 半径）を 1 行ずつ ぬる */
const oval = (r: Rect, cx: number, cy: number, rx: number, ry: number, col: string) => {
  for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++) {
    const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2)));
    if (hw > 0) r(Math.round(cx - hw), y, hw * 2, 1, col);
  }
};

/** かべの前の面（dungeonTiles と 同じ 形）：ブロックの すじ と 光、上は天井の かげ */
const face = (r: Rect, base: string, line: string, light: string, edge: string) => {
  r(0, 0, 16, 16, base);
  r(0, 5, 16, 1, line);
  r(0, 11, 16, 1, line);
  r(6, 0, 1, 5, line);
  r(12, 6, 1, 5, line);
  r(3, 12, 1, 4, line);
  r(1, 2, 3, 1, light);
  r(8, 8, 2, 1, light);
  r(0, 0, 16, 1, edge);
  r(0, 15, 16, 1, edge);
};

/** はいいろの 砂地（恐山）。sulfur なら いおうの 黄色い しみ */
const ash = (r: Rect, sulfur: boolean) => {
  r(0, 0, 16, 16, NQ.silver);
  for (const [x, y] of [
    [2, 3],
    [9, 1],
    [13, 7],
    [5, 10],
    [11, 13],
    [1, 14],
  ] as const)
    r(x, y, 1, 1, NQ.gray);
  r(6, 5, 2, 1, NQ.cloud);
  r(12, 11, 2, 1, NQ.cloud);
  if (sulfur) {
    // いおうの かたまり：ふちの ぎざぎざした うすい 黄色の しみ（まるく しない）
    for (const [x, y, w] of [
      [3, 6, 4],
      [2, 7, 7],
      [4, 8, 8],
      [7, 9, 6],
      [9, 10, 3],
      [12, 4, 2],
    ] as const)
      r(x, y, w, 1, NQ.cream);
    r(4, 7, 3, 1, NQ.yellow);
    r(7, 8, 3, 1, NQ.yellow);
    r(9, 9, 2, 1, NQ.ochre);
  }
};

function drawTown({ tile, block }: TileApi): void {
  // 大きな ねぶた：木の 台車の 上で 光る 武者（4×3）
  block(SP.nebuta, 4, 3, (r) => {
    // 光の にじみ（ちょうちんの あかり）
    oval(r, 32, 22, 30, 18, NQ.orange);
    oval(r, 32, 22, 28, 16, NQ.cream);
    // 台車と 車輪
    r(2, 38, 60, 6, NQ.brown);
    r(2, 38, 60, 1, NQ.tan);
    r(2, 43, 60, 1, NQ.bark);
    for (const x of [6, 26, 50]) {
      r(x, 42, 8, 6, NQ.ink);
      r(x + 3, 44, 2, 2, NQ.gray);
    }
    // かぶと と 金の くわがた
    r(10, 4, 22, 6, NQ.ink);
    r(12, 5, 18, 1, NQ.slate);
    r(18, 0, 2, 5, NQ.gold);
    r(24, 0, 2, 5, NQ.gold);
    r(16, 2, 12, 2, NQ.gold);
    // 顔（白い はだに 赤い くま取り）
    r(12, 10, 18, 15, NQ.white);
    // つりあがった まゆと、赤い ふちの 目（にらむ 顔）
    for (const [x, y, w] of [
      [13, 12, 3],
      [15, 13, 3],
      [17, 14, 3],
      [26, 12, 3],
      [24, 13, 3],
      [22, 14, 3],
    ] as const)
      r(x, y, w, 2, NQ.ink);
    r(14, 16, 6, 3, NQ.red);
    r(22, 16, 6, 3, NQ.red);
    r(15, 17, 4, 1, NQ.white);
    r(23, 17, 4, 1, NQ.white);
    r(16, 17, 2, 1, NQ.ink);
    r(24, 17, 2, 1, NQ.ink);
    r(13, 19, 2, 3, NQ.red);
    r(27, 19, 2, 3, NQ.red);
    r(20, 17, 3, 4, NQ.paper);
    r(17, 21, 9, 2, NQ.red);
    r(18, 23, 7, 1, NQ.brick);
    // 着物（青と 赤と 金の もよう）
    r(8, 25, 40, 13, NQ.blue);
    r(8, 25, 40, 1, NQ.azure);
    r(12, 28, 9, 7, NQ.red);
    r(14, 30, 5, 3, NQ.gold);
    r(26, 28, 9, 7, NQ.yellow);
    r(28, 30, 5, 3, NQ.vermilion);
    r(38, 27, 8, 9, NQ.red);
    // うでと 刀
    r(32, 12, 6, 14, NQ.white);
    r(32, 12, 6, 2, NQ.red);
    r(38, 4, 3, 20, NQ.silver);
    r(38, 4, 1, 20, NQ.white);
    r(36, 22, 7, 3, NQ.gold);
    // もう 1 つの 顔（ねぶたの おに）
    r(46, 12, 12, 13, NQ.vermilion);
    r(47, 15, 4, 2, NQ.ink);
    r(53, 15, 4, 2, NQ.ink);
    r(49, 20, 6, 2, NQ.white);
    r(46, 10, 2, 3, NQ.gold);
    r(56, 10, 2, 3, NQ.gold);
    // ふちの 線
    r(8, 37, 48, 1, NQ.amber);
  });
  // アスパム：三角の 白い ビルに 青い まどガラス（3×3）
  block(SP.aspam, 3, 3, (r) => {
    for (let y = 1; y < 45; y++) {
      const hw = Math.round(((y - 1) * 23) / 44);
      r(24 - hw, y, hw, 1, NQ.white);
      r(24, y, hw, 1, NQ.cloud);
      if (y % 6 === 3 && hw > 3) {
        r(24 - hw + 2, y, hw * 2 - 4, 2, NQ.azure);
        r(24, y, hw - 2, 2, NQ.blue);
      }
    }
    r(23, 0, 2, 3, NQ.red);
    r(0, 44, 48, 4, NQ.gray);
    r(0, 44, 48, 1, NQ.silver);
    r(20, 40, 8, 6, NQ.night);
    r(21, 41, 6, 5, NQ.sky);
  });
  // 八甲田丸：黄色い 船体と 白い 船室（4×2。まわりは 海が すける）
  block(SP.ferry, 4, 2, (r) => {
    r(4, 18, 58, 9, NQ.yellow);
    r(4, 18, 58, 1, NQ.cream);
    r(6, 25, 54, 3, NQ.navy);
    r(2, 18, 4, 6, NQ.yellow);
    r(60, 18, 4, 6, NQ.ochre);
    r(12, 9, 40, 9, NQ.white);
    r(12, 9, 40, 1, NQ.cloud);
    for (let x = 15; x < 50; x += 5) r(x, 12, 3, 3, NQ.blue);
    r(20, 4, 24, 5, NQ.paper);
    for (let x = 23; x < 42; x += 4) r(x, 5, 2, 2, NQ.navy);
    r(46, 0, 5, 9, NQ.yellow);
    r(46, 0, 5, 2, NQ.ink);
    r(8, 21, 50, 1, NQ.ochre);
    // 波しぶき
    r(0, 28, 64, 1, NQ.white);
    r(10, 30, 8, 1, NQ.sky);
    r(40, 30, 10, 1, NQ.sky);
  });
  // りんご箱：木の 箱に 赤い りんご
  tile(SP.appleCrate, (r) => {
    r(2, 7, 12, 8, NQ.tan);
    r(2, 7, 12, 1, NQ.sand);
    r(2, 11, 12, 1, NQ.brown);
    r(2, 14, 12, 1, NQ.bark);
    r(2, 7, 1, 8, NQ.brown);
    r(13, 7, 1, 8, NQ.brown);
    for (const [x, y] of [
      [3, 4],
      [7, 3],
      [10, 4],
    ] as const) {
      r(x, y, 3, 3, NQ.red);
      r(x, y, 1, 1, NQ.apricot);
      r(x + 2, y + 2, 1, 1, NQ.brick);
      r(x + 1, y - 1, 1, 1, NQ.brown);
    }
  });
  // りんごの 屋台：赤白の 日よけと 山もりの りんご
  tile(SP.appleStall, (r) => {
    for (let x = 0; x < 16; x += 4) {
      r(x, 1, 2, 4, NQ.red);
      r(x + 2, 1, 2, 4, NQ.white);
    }
    r(0, 5, 16, 1, NQ.brick);
    r(1, 6, 1, 9, NQ.brown);
    r(14, 6, 1, 9, NQ.brown);
    r(1, 11, 14, 4, NQ.tan);
    r(1, 11, 14, 1, NQ.sand);
    for (const x of [3, 6, 9, 12]) {
      r(x, 8, 2, 3, NQ.red);
      r(x, 8, 1, 1, NQ.apricot);
    }
    r(5, 6, 2, 2, NQ.red);
    r(9, 6, 2, 2, NQ.red);
  });
  // 金魚ねぶた：さおの 先に 赤い 金魚の ちょうちん
  tile(SP.kingyo, (r) => {
    r(7, 6, 1, 10, NQ.brown);
    r(4, 15, 7, 1, NQ.bark);
    oval(r, 8, 4, 6, 3, NQ.red);
    oval(r, 8, 4, 4, 2, NQ.vermilion);
    r(1, 2, 2, 5, NQ.red);
    r(0, 1, 2, 2, NQ.vermilion);
    r(0, 6, 2, 2, NQ.vermilion);
    r(11, 3, 2, 1, NQ.ink);
    r(5, 2, 4, 1, NQ.gold);
    r(6, 6, 3, 1, NQ.gold);
  });
}

function drawDungeon({ tile }: TileApi): void {
  // 恐山：はいいろの 砂地・いおうの しみ・くらい 岩
  tile(SP.ashFloor, (r) => ash(r, false));
  tile(SP.sulfurFloor, (r) => ash(r, true));
  tile(SP.ashWall, (r) => {
    r(0, 0, 16, 16, NQ.slate);
    for (const [x, y] of [
      [3, 4],
      [10, 2],
      [8, 10],
      [2, 12],
      [13, 9],
    ] as const) {
      r(x, y, 2, 1, NQ.gray);
      r(x, y + 1, 1, 1, NQ.night);
    }
  });
  tile(SP.ashFace, (r) => {
    face(r, NQ.gray, NQ.slate, NQ.silver, NQ.night);
    r(9, 12, 3, 2, NQ.yellow);
  });
  // 風車：赤・黄・青の はねが まわる
  tile(SP.pinwheel, (r) => {
    r(7, 7, 1, 9, NQ.bark);
    r(5, 15, 5, 1, NQ.gray);
    r(3, 2, 4, 4, NQ.red);
    r(8, 1, 4, 4, NQ.yellow);
    r(9, 6, 4, 4, NQ.azure);
    r(2, 7, 4, 4, NQ.leaf);
    r(4, 3, 1, 1, NQ.blush);
    r(10, 2, 1, 1, NQ.cream);
    r(7, 6, 2, 2, NQ.white);
  });
  // 積み石：小石を つみあげた 山
  tile(SP.cairn, (r) => {
    oval(r, 8, 14, 6, 2, NQ.slate);
    oval(r, 8, 12, 5, 2, NQ.gray);
    oval(r, 8, 9, 4, 2, NQ.silver);
    oval(r, 8, 6, 3, 2, NQ.gray);
    oval(r, 8, 3, 2, 1.5, NQ.cloud);
    r(6, 12, 2, 1, NQ.cloud);
    r(7, 8, 2, 1, NQ.white);
  });
  // 地蔵：石の 小さな 像に 赤い よだれかけ
  tile(SP.jizo, (r) => {
    oval(r, 8, 14, 5, 1.5, NQ.slate);
    r(5, 8, 6, 7, NQ.silver);
    r(5, 8, 1, 7, NQ.cloud);
    r(10, 8, 1, 7, NQ.gray);
    oval(r, 8, 5, 3, 3, NQ.silver);
    r(6, 4, 1, 1, NQ.cloud);
    r(7, 5, 1, 1, NQ.slate);
    r(9, 5, 1, 1, NQ.slate);
    r(5, 8, 6, 3, NQ.red);
    r(6, 11, 4, 1, NQ.red);
    r(5, 8, 6, 1, NQ.vermilion);
  });
  // 太鼓橋：赤い らんかんと 板（歩ける 床。上下に 水が 見える）
  tile(SP.bridge, (r) => {
    r(0, 0, 16, 16, NQ.teal);
    r(0, 3, 16, 10, NQ.tan);
    for (let x = 1; x < 16; x += 3) r(x, 3, 1, 10, NQ.brown);
    r(0, 2, 16, 2, NQ.red);
    r(0, 12, 16, 2, NQ.red);
    r(0, 2, 16, 1, NQ.vermilion);
    r(3, 1, 2, 2, NQ.red);
    r(11, 1, 2, 2, NQ.red);
    r(3, 14, 2, 1, NQ.brick);
    r(11, 14, 2, 1, NQ.brick);
  });
  // 宇曽利湖：すきとおった 青緑の 水
  tile(SP.lake, (r) => {
    r(0, 0, 16, 16, NQ.teal);
    r(2, 4, 5, 1, NQ.aqua);
    r(9, 10, 5, 1, NQ.aqua);
    r(11, 3, 2, 1, NQ.mint);
    r(4, 12, 2, 1, NQ.mint);
  });
  // お城の 参道：赤い じゅうたん（ふちに 金の 線）
  tile(SP.carpet, (r) => {
    r(0, 0, 16, 16, NQ.red);
    r(0, 0, 2, 16, NQ.gold);
    r(14, 0, 2, 16, NQ.gold);
    r(2, 0, 1, 16, NQ.brick);
    r(13, 0, 1, 16, NQ.brick);
    for (let y = 2; y < 16; y += 6) {
      r(7, y, 2, 2, NQ.gold);
      r(6, y + 1, 4, 1, NQ.orange);
    }
  });
  // さくらの 花びらが ちった 板の間（お城の 床 237 と 同じ 板に ピンクの 花びら）
  tile(SP.petals, (r) => {
    r(0, 0, 16, 16, NQ.sand);
    for (const y of [5, 11]) r(0, y, 16, 1, NQ.tan);
    r(8, 0, 1, 5, NQ.tan);
    r(3, 6, 1, 5, NQ.tan);
    r(12, 12, 1, 4, NQ.tan);
    for (const [x, y] of [
      [2, 2],
      [10, 7],
      [5, 13],
      [13, 2],
    ] as const) {
      r(x, y, 2, 1, NQ.blush);
      r(x + 1, y + 1, 1, 1, NQ.white);
    }
  });
}

function drawFieldDecor({ tile }: TileApi): void {
  // かかし：麦わら帽子と 青い 着物
  tile(SP.scarecrow, (r) => {
    r(7, 6, 2, 10, NQ.brown);
    r(2, 8, 12, 2, NQ.brown);
    r(4, 7, 8, 5, NQ.blue);
    r(4, 7, 8, 1, NQ.azure);
    r(6, 3, 4, 4, NQ.paper);
    r(7, 4, 1, 1, NQ.ink);
    r(9, 4, 1, 1, NQ.ink);
    r(3, 2, 10, 2, NQ.yellow);
    r(5, 0, 6, 2, NQ.ochre);
    r(1, 9, 2, 1, NQ.sand);
    r(13, 9, 2, 1, NQ.sand);
  });
  // ホタテの 貝がら（陸奥湾の 名産）
  tile(SP.shell, (r) => {
    oval(r, 8, 9, 5, 4, NQ.apricot);
    for (const x of [5, 7, 9, 11]) r(x, 6, 1, 6, NQ.vermilion);
    r(6, 12, 4, 2, NQ.tan);
    r(5, 6, 2, 1, NQ.cream);
  });
  // 流木
  tile(SP.driftwood, (r) => {
    r(2, 10, 12, 3, NQ.tan);
    r(2, 10, 12, 1, NQ.beige);
    r(2, 12, 12, 1, NQ.brown);
    r(11, 8, 2, 2, NQ.tan);
    r(4, 13, 2, 1, NQ.brown);
  });
  // 花の むれ（白・黄・ピンク）
  tile(SP.flowers, (r) => {
    for (const [x, y, c] of [
      [3, 4, NQ.white],
      [10, 3, NQ.yellow],
      [6, 9, NQ.blush],
      [12, 10, NQ.white],
      [2, 12, NQ.yellow],
    ] as const) {
      r(x, y + 1, 1, 3, NQ.green);
      r(x - 1, y, 3, 1, c);
      r(x, y - 1, 1, 3, c);
      r(x, y, 1, 1, NQ.gold);
    }
  });
  // 切り株
  tile(SP.stump, (r) => {
    oval(r, 8, 13, 6, 2, NQ.green);
    r(3, 7, 10, 6, NQ.brown);
    oval(r, 8, 7, 5, 2, NQ.tan);
    oval(r, 8, 7, 3, 1, NQ.sand);
    r(3, 7, 1, 6, NQ.bark);
    r(12, 9, 1, 4, NQ.bark);
  });
  // 寒立馬：がっしりした 茶色の 馬
  tile(SP.horse, (r) => {
    r(3, 7, 9, 5, NQ.brown);
    r(3, 7, 9, 1, NQ.tan);
    r(11, 3, 3, 6, NQ.brown);
    r(12, 2, 3, 3, NQ.brown);
    r(14, 4, 1, 1, NQ.ink);
    r(10, 3, 2, 4, NQ.bark);
    for (const x of [3, 5, 9, 11]) r(x, 12, 1, 3, NQ.bark);
    r(2, 8, 1, 4, NQ.bark);
  });
  // 小さな 漁船（海の 上。まわりは 水が すける）
  tile(SP.boat, (r) => {
    r(2, 9, 12, 3, NQ.white);
    r(3, 12, 10, 1, NQ.red);
    r(1, 9, 2, 2, NQ.white);
    r(8, 4, 4, 5, NQ.paper);
    r(9, 5, 2, 2, NQ.blue);
    r(6, 1, 1, 8, NQ.brown);
    r(4, 2, 2, 1, NQ.red);
    r(1, 13, 14, 1, NQ.sky);
  });
  // 岩：ごつごつした 小さな 岩
  tile(SP.rock, (r) => {
    oval(r, 8, 13, 6, 2, NQ.green);
    oval(r, 8, 9, 6, 4, NQ.gray);
    oval(r, 7, 8, 4, 3, NQ.silver);
    r(5, 6, 2, 1, NQ.cloud);
    r(10, 11, 3, 1, NQ.slate);
  });
}

export function drawSpecialTiles(api: TileApi): void {
  drawTown(api);
  drawDungeon(api);
  drawFieldDecor(api);
}
