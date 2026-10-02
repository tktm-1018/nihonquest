import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const ROOT = resolve('.');
const checkedAt = '2026-10-03';
const sources = {
  era: 'https://www.kantei.go.jp/jp/headline/singengou/singengou_sentei.html',
  population: 'https://population.un.org/wpp/',
  northern: 'https://www.mofa.go.jp/mofaj/area/hoppo/hoppo_qa.html',
  sdgs: 'https://sdgs.un.org/2030agenda',
  copyright: 'https://www.bunka.go.jp/seisaku/chosakuken/taisetsu/point/index.html',
  apple: 'https://www.maff.go.jp/j/tokei/kodomo/pdf/jiten_2025.pdf',
  curriculum: 'https://www.mext.go.jp/a_menu/shotou/new-cs/1384661.htm',
};

const dated = [
  [
    'legacy.shakai.g3.cur-1403-04.a01c7b064a91',
    sources.era,
    '一次資料と記述は整合。改元日を固定したが、学術責任者の承認待ち。',
  ],
  [
    'legacy.shakai.g5.soc-5-1.0ae70760ab50',
    sources.population,
    '国連2024年推計の順位と整合。版固定済み、学術責任者の承認待ち。',
  ],
  [
    'legacy.shakai.g5.soc-5-1.02a8f9fd7f49',
    sources.northern,
    '外務省の政府見解と本文は整合。地図原票が未照合。',
  ],
  [
    'legacy.shakai.g6.soc-6-10.a1cdaaf35c0b',
    sources.northern,
    '外務省一次資料と本文は整合。地図原票が未照合。',
  ],
  ['legacy.shakai.g6.soc-6-11.909ef5541685', sources.sdgs, '2015年採択・17目標は国連一次資料と整合。'],
  ['legacy.shakai.g5.soc-5-8.e688d0da836d', sources.sdgs, '名称・17目標・対象領域は国連一次資料と整合。'],
  [
    'legacy.shakai.g5.soc-5-4.661afeb79b7f',
    sources.apple,
    '令和5年産の上位産地は青森・長野で設問正答と整合。',
  ],
  ['legacy.shakai.g5.soc-5-7.2cb80e8887d4', sources.copyright, '無断アップロードの説明は文化庁資料と整合。'],
  ['legacy.shakai.g5.soc-5-7.e793396648b7', '', 'IoTの語義を支える一次資料の版・参照日が教材に未記録。'],
  ['legacy.shakai.g5.soc-5-6.a8c96b1c1aa6', '', '2017年の輸出入グラフ原票と画像の対応を未確認。'],
  ['legacy.shakai.g5.soc-5-7.b0f4467ddc1c', '', '2010年代の情報量増加を支える統計表の特定が未完了。'],
  ['legacy.shakai.g5.soc-5-8.4642deacf8fd', '', '公害対策の法令・年次を一次資料へ結び付ける作業が未完了。'],
].map(([id, sourceUrl, note]) => ({
  id,
  kind: 'dated-fact',
  evidenceStatus: sourceUrl ? 'primary-source-matched' : 'primary-source-missing',
  academicApproval: false,
  sourceUrl,
  checkedAt,
  note,
}));

const visualIds = [
  'legacy.kokugo.g3.jpn-3-22.1d96f31c3027',
  'legacy.kokugo.g3.jpn-3-9.52c149818807',
  'legacy.sansu.g6.math-6-7.35928a01856e',
  'legacy.shakai.g3.cur-1403-04.215488f29d8a',
  'legacy.shakai.g3.cur-1403-04.aea73505c390',
  'legacy.shakai.g5.soc-5-1.02a8f9fd7f49',
  'legacy.shakai.g5.soc-5-6.a8c96b1c1aa6',
  'legacy.shakai.g5.soc-5-6.b059945f3dcc',
  'legacy.shakai.g6.soc-6-4.0afc196c9f52',
  'legacy.shakai.g6.soc-6-6.7193778e8e8e',
  'legacy.shakai.g6.soc-6-7.4908eef92d6b',
  'legacy.shakai.g6.soc-6-10.a1cdaaf35c0b',
  'legacy.sansu.g6.math-6-9.337d7e0826ac',
  'legacy.sansu.g6.math-6-9.cea54380c2ee',
  'legacy.shakai.g3.cur-1403-04.317c29b9a8d8',
  'legacy.shakai.g4.cur-1404-01.23873eb36d36',
  'legacy.shakai.g4.cur-1404-05.e2c978bf2b0a',
  'legacy.sansu.g4.math-4-2.ca71f3ca3730',
];
const visual = visualIds.map((id) => ({
  id,
  kind: 'visual-context',
  evidenceStatus: 'blocked-missing-source-visual',
  academicApproval: false,
  sourceUrl: sources.curriculum,
  checkedAt,
  note: '本文だけでは図・写真・グラフとの対応を確認できない。画像原票の照合後に再審査する。',
}));

const manifest = JSON.parse(await readFile(resolve(ROOT, 'content/manifest.json'), 'utf8')) as {
  questions: string[];
};
const files = manifest.questions.filter((path) => !path.startsWith('questions/_samples/'));
if (files.length !== 44) throw new Error(`production question files: expected 44, got ${files.length}`);
const output = {
  version: 1,
  generatedFrom: 'content/manifest.json',
  policy: {
    unverifiedIsApproved: false,
    approvalRequiresNamedReviewer: true,
    visualContextRequiresSourceVisual: true,
  },
  highPriority: [...dated, ...visual],
  questionFiles: files.map((path) => ({
    path,
    status: 'pending-human-academic-review',
    reviewer: null,
    reviewedAt: null,
    note: '構造検証済み。学術承認は未実施。',
  })),
};
await writeFile(
  resolve(ROOT, 'content/quality/release-reviews.json'),
  `${JSON.stringify(output, null, 2)}\n`,
);
console.log(`release reviews: ${dated.length} dated + ${visual.length} visual + ${files.length} files`);
