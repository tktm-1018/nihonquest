/**
 * 青森の モンスターの うち、フィールドの マップに 立つ 中ボス（.field、32×32）だけ。
 * バトル・メニューの 絵は ドット 2 倍・ポーズつきの aomoriPoses1〜3.ts（ふだん <id> と こうげき前 <id>.atk）。
 */
import { NQ } from '../palette';
import type { MonsterDesign } from './design';

const nebutaTaishoColors = {
  C: NQ.cream,
  A: NQ.apricot,
  V: NQ.vermilion,
  R: NQ.red,
  b: NQ.brick,
  G: NQ.gold,
  Q: NQ.ochre,
  B: NQ.blue,
  Z: NQ.azure,
  P: NQ.paper,
  c: NQ.cloud,
  W: NQ.white,
};

/** ネブタイショウ（フィールドに立つ 32×32） */
const nebutaTaishoField: MonsterDesign = {
  size: 32,
  colors: nebutaTaishoColors,
  rim: { [NQ.vermilion]: NQ.brick, [NQ.paper]: NQ.cloud },
  layers: [
    {
      mirror: true,
      rows: [
        '................',
        '........GGG.....',
        '.........oG.....',
        '.........VoG....',
        '....V....VoGGoGG',
        '....VVV..VAooZoR',
        '.....VoGBooBBBoG',
        '.....VoGBBooooBo',
        '......oooooooooo',
        '......VAGGGoPPPP',
        '.VVVVVAGGGRooPPP',
        '..VAAAGGGGoRoooP',
        '...VAGGGGGoRWWPP',
        '....VAGGGGGoWoPP',
        '....VAGGGGGoWoPP',
        '...VAooooooGoooo',
        '..VAoGGGGGGoGGoo',
        '.VooZZZZZZZoPPoR',
        '..ZZZZZZZZoPPPPP',
        '..ZZZZZZZZZoPPPR',
        '...BBooooooZZZRA',
        '...ooGGGGGGoZZZZ',
        '...VAAAGGGGGoooR',
        '...VVVVAGGGGoooo',
        '..VV...VAAooVVVV',
        '.......VVoVVVVVV',
        '........oVVVVVVV',
        '.......VVVVVVVVV',
        '........oooo....',
        '........ZBBB....',
        '........ZBBB....',
        '................',
      ],
    },
    {
      x: 1,
      y: 1,
      rows: [
        '............................WW',
        '...........................WWW',
        '...........................WWW',
        '..........................WWW.',
        '.........................oWW..',
        '.........................WWW..',
        '.......................oGooo..',
        '.........................P....',
        '.......................oPPo...',
        '.......................ooo....',
        '......................oZZo....',
        '......................oZZo....',
        '......................oZo.....',
        '.....................oZZo.....',
        '.....................ZZZ......',
        '....................ZZZo......',
        '.......................o......',
        '...................oZ.o.......',
        'Po..ooooo.............o.......',
        'PPoo.VVVV.....................',
        'PP.BoVVVo.....................',
        'PPooooooo.....................',
      ],
    },
  ],
};

export const AOMORI: Readonly<Record<string, MonsterDesign>> = {
  'aomori-midboss-nebuta-taisho.field': nebutaTaishoField,
};
