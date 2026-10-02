import { createHash } from 'node:crypto';
import { access, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { questionBaseSchema, type QuestionBase } from '../src/questions/contracts';

const ROOT = resolve('.');
const CONTENT = resolve(ROOT, 'content');
const checkedAt = '2026-10-03';

const sources = {
  curriculum: {
    id: 'mext-elementary-curriculum-2017',
    title: '平成29・30・31年改訂 学習指導要領（本文、解説）',
    authority: '文部科学省',
    version: '平成29・30・31年改訂',
    url: 'https://www.mext.go.jp/a_menu/shotou/new-cs/1384661.htm',
    location: '小学校学習指導要領および各教科解説',
  },
  era: {
    id: 'cabinet-reiwa-selection',
    title: '新元号「令和」について',
    authority: '内閣官房',
    version: '2019年4月1日公表',
    url: 'https://www.kantei.go.jp/jp/headline/singengou/singengou_sentei.html',
    location: '新元号の施行日（2019年5月1日）',
  },
  population: {
    id: 'un-wpp-2024',
    title: 'World Population Prospects 2024',
    authority: 'United Nations, DESA Population Division',
    version: '2024 Revision',
    url: 'https://population.un.org/wpp/',
    location: '2024年推計・国別総人口順位',
  },
  northern: {
    id: 'mofa-northern-territories-qa',
    title: '北方領土問題 Q&A',
    authority: '外務省',
    version: '参照時公開版',
    url: 'https://www.mofa.go.jp/mofaj/area/hoppo/hoppo_qa.html',
    location: '北方四島の名称・現況',
  },
  sdgs: {
    id: 'un-2030-agenda',
    title: 'Transforming our world: the 2030 Agenda for Sustainable Development',
    authority: 'United Nations',
    version: 'A/RES/70/1 (2015)',
    url: 'https://sdgs.un.org/2030agenda',
    location: 'Preambleおよび17 Sustainable Development Goals',
  },
  copyright: {
    id: 'bunka-copyright-point',
    title: '著作権について知っておきたい大切なこと',
    authority: '文化庁',
    version: '参照時公開版',
    url: 'https://www.bunka.go.jp/seisaku/chosakuken/taisetsu/point/index.html',
    location: 'インターネットで著作物を利用する場合',
  },
  apple: {
    id: 'maff-kodomo-norinsuisan-2025',
    title: 'こども農林水産白書／統計資料',
    authority: '農林水産省',
    version: '2025年版（令和5年産統計掲載）',
    url: 'https://www.maff.go.jp/j/tokei/kodomo/pdf/jiten_2025.pdf',
    location: 'りんごの主な産地・収穫量',
  },
  iot: {
    id: 'meti-sme-whitepaper-2019-iot',
    title: '2019年版 中小企業白書 第3部 第1章 第1節 2 デジタル化',
    authority: '中小企業庁',
    version: '2019年版',
    url: 'https://www.chusho.meti.go.jp/pamflet/hakusyo/2019/2019/html/b3_1_1_2.html',
    location: '脚注23「Internet of Things：モノのインターネット」',
  },
  trade2017: {
    id: 'customs-trade-statistics-2017',
    title: '財務省貿易統計 2017年版',
    authority: '財務省関税局',
    version: '2017年確定値',
    url: 'https://www.customs.go.jp/toukei/info/tsdl.htm',
    location: '主要商品別輸出入額（元図版との対応は未照合）',
  },
  digital2019: {
    id: 'meti-sme-whitepaper-2019-digital',
    title: '2019年版 中小企業白書 第3部 第1章 第1節 2 デジタル化',
    authority: '中小企業庁',
    version: '2019年版（総務省 平成29年通信利用動向調査を引用）',
    url: 'https://www.chusho.meti.go.jp/pamflet/hakusyo/2019/2019/html/b3_1_1_2.html',
    location: '2010～2017年のスマートフォン普及・SNS利用の説明',
  },
  environment: {
    id: 'moe-history-50',
    title: '環境省五十年史',
    authority: '環境省',
    version: '令和3年12月（補遺版 令和5年7月）',
    url: 'https://www.env.go.jp/publication/history/50th/index.html',
    location: '公害対策基本法、環境庁設置、環境基本法、環境省発足の年表',
  },
} as const;

type SourceKey = keyof typeof sources;
interface FindingSeed {
  id: string;
  kind: 'dated-fact' | 'visual-context';
  sourceKey: SourceKey;
  evidenceStatus: 'primary-source-matched' | 'primary-source-partial' | 'blocked-missing-source-visual';
  note: string;
}

const dated: FindingSeed[] = [
  {
    id: 'legacy.shakai.g3.cur-1403-04.a01c7b064a91',
    kind: 'dated-fact',
    sourceKey: 'era',
    evidenceStatus: 'primary-source-matched',
    note: '施行日と元号名は一次資料と整合。人間の学術承認待ち。',
  },
  {
    id: 'legacy.shakai.g5.soc-5-1.0ae70760ab50',
    kind: 'dated-fact',
    sourceKey: 'population',
    evidenceStatus: 'primary-source-matched',
    note: '国連2024年推計の1位インド・2位中国と整合。版固定済み。',
  },
  {
    id: 'legacy.shakai.g5.soc-5-1.02a8f9fd7f49',
    kind: 'dated-fact',
    sourceKey: 'northern',
    evidenceStatus: 'primary-source-partial',
    note: '本文は外務省資料と整合するが、設問で使う地図原票は未照合。',
  },
  {
    id: 'legacy.shakai.g6.soc-6-10.a1cdaaf35c0b',
    kind: 'dated-fact',
    sourceKey: 'northern',
    evidenceStatus: 'primary-source-partial',
    note: '本文は外務省資料と整合するが、赤丸位置を含む地図原票は未照合。',
  },
  {
    id: 'legacy.shakai.g6.soc-6-11.909ef5541685',
    kind: 'dated-fact',
    sourceKey: 'sdgs',
    evidenceStatus: 'primary-source-matched',
    note: '2015年採択・17目標は国連決議と整合。',
  },
  {
    id: 'legacy.shakai.g5.soc-5-8.e688d0da836d',
    kind: 'dated-fact',
    sourceKey: 'sdgs',
    evidenceStatus: 'primary-source-matched',
    note: '名称、2030年までの17目標という説明は国連決議と整合。',
  },
  {
    id: 'legacy.shakai.g5.soc-5-4.661afeb79b7f',
    kind: 'dated-fact',
    sourceKey: 'apple',
    evidenceStatus: 'primary-source-matched',
    note: '令和5年産統計の主要産地（青森・長野）と整合。',
  },
  {
    id: 'legacy.shakai.g5.soc-5-7.2cb80e8887d4',
    kind: 'dated-fact',
    sourceKey: 'copyright',
    evidenceStatus: 'primary-source-matched',
    note: 'インターネットへの無断掲載と著作権の説明は文化庁資料と整合。',
  },
  {
    id: 'legacy.shakai.g5.soc-5-7.e793396648b7',
    kind: 'dated-fact',
    sourceKey: 'iot',
    evidenceStatus: 'primary-source-matched',
    note: 'IoTの略称と「モノのインターネット」の説明は中小企業庁白書と整合。',
  },
  {
    id: 'legacy.shakai.g5.soc-5-6.a8c96b1c1aa6',
    kind: 'dated-fact',
    sourceKey: 'trade2017',
    evidenceStatus: 'primary-source-partial',
    note: '財務省貿易統計の該当表は特定したが、教材画像がその原表を正確に転記したものか未照合。',
  },
  {
    id: 'legacy.shakai.g5.soc-5-7.b0f4467ddc1c',
    kind: 'dated-fact',
    sourceKey: 'digital2019',
    evidenceStatus: 'primary-source-partial',
    note: 'スマートフォン・SNS普及の方向性は政府白書と整合するが、「情報量が急速に増えた」の定量原表は未特定。',
  },
  {
    id: 'legacy.shakai.g5.soc-5-8.4642deacf8fd',
    kind: 'dated-fact',
    sourceKey: 'environment',
    evidenceStatus: 'primary-source-matched',
    note: '1967・1971・1993・2001年の制度・組織変遷は環境省五十年史と整合。',
  },
];

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

const manifest = JSON.parse(await readFile(resolve(CONTENT, 'manifest.json'), 'utf8')) as {
  questions: string[];
};
const files = manifest.questions.filter((path) => !path.startsWith('questions/_samples/'));
if (files.length !== 44) throw new Error(`production question files: expected 44, got ${files.length}`);

const indexed = new Map<string, { file: string; question: QuestionBase }>();
const fileRows = new Map<string, { bytes: Buffer; questions: QuestionBase[] }>();
for (const file of files) {
  const bytes = await readFile(resolve(CONTENT, file));
  const questions = questionBaseSchema.array().parse(JSON.parse(bytes.toString())) as QuestionBase[];
  fileRows.set(file, { bytes, questions });
  for (const question of questions) indexed.set(question.id, { file, question });
}

async function visualStatus(question: QuestionBase) {
  const image = String((question.payload as Record<string, unknown>).promptImage ?? '');
  if (!image)
    return {
      assetPath: null,
      assetExists: false,
      assetSha256: null,
      provenanceStatus: 'missing-or-not-linked',
    };
  const path = resolve(ROOT, 'assets', image);
  try {
    await access(path);
    const bytes = await readFile(path);
    return {
      assetPath: image,
      assetExists: true,
      assetSha256: createHash('sha256').update(bytes).digest('hex'),
      provenanceStatus: 'local-copy-found-origin-unverified',
    };
  } catch {
    return {
      assetPath: image,
      assetExists: false,
      assetSha256: null,
      provenanceStatus: 'referenced-file-missing',
    };
  }
}

const datedRows = dated.map((seed) => {
  const indexedQuestion = indexed.get(seed.id);
  if (!indexedQuestion) throw new Error(`review target not found: ${seed.id}`);
  const source = sources[seed.sourceKey];
  return {
    ...seed,
    questionFile: indexedQuestion.file,
    prompt: String((indexedQuestion.question.payload as Record<string, unknown>).prompt ?? ''),
    sourceId: source.id,
    sourceTitle: source.title,
    sourceAuthority: source.authority,
    sourceVersion: source.version,
    sourceUrl: source.url,
    sourceLocation: source.location,
    accessedAt: checkedAt,
    academicApproval: false,
    reviewer: null,
  };
});
const visualRows = await Promise.all(
  visualIds.map(async (id) => {
    const indexedQuestion = indexed.get(id);
    if (!indexedQuestion) throw new Error(`visual review target not found: ${id}`);
    return {
      id,
      kind: 'visual-context',
      questionFile: indexedQuestion.file,
      prompt: String((indexedQuestion.question.payload as Record<string, unknown>).prompt ?? ''),
      evidenceStatus: 'blocked-missing-source-visual',
      academicApproval: false,
      reviewer: null,
      sourceId: sources.curriculum.id,
      sourceTitle: sources.curriculum.title,
      sourceAuthority: sources.curriculum.authority,
      sourceVersion: sources.curriculum.version,
      sourceUrl: sources.curriculum.url,
      sourceLocation: sources.curriculum.location,
      accessedAt: checkedAt,
      ...(await visualStatus(indexedQuestion.question)),
      note: 'ローカル画像の有無だけでは原票との同一性を証明できない。出典・版・図表番号を人間が照合するまでブロック。',
    };
  }),
);
const highPriority = [...datedRows, ...visualRows];

const questionFiles = files.map((path) => {
  const row = fileRows.get(path)!;
  const subjects = [...new Set(row.questions.map((question) => question.subject))].sort();
  const grades = [...new Set(row.questions.map((question) => question.grade))].sort((a, b) => a - b);
  const types = [...new Set(row.questions.map((question) => question.type))].sort();
  return {
    path,
    subjects,
    grades,
    questionCount: row.questions.length,
    types,
    sha256: createHash('sha256').update(row.bytes).digest('hex'),
    structuralValidation: 'passed-question-base-schema',
    academicReviewStatus: 'pending-human-academic-review',
    reviewer: null,
    reviewedAt: null,
    sourceIds: subjects
      .map(() => sources.curriculum.id)
      .filter((value, index, all) => all.indexOf(value) === index),
    requiredFixCount: highPriority.filter((finding) => finding.questionFile === path).length,
    note: '構造検証済み。内容の学術承認は未実施。',
  };
});

const tohokuPrefectures = ['aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'];
const tohokuQuestions = [...indexed.values()]
  .map((row) => row.question)
  .filter((question) =>
    question.tags?.some((tag) => tohokuPrefectures.some((prefecture) => tag === `prefecture:${prefecture}`)),
  );
const bossReviewQuestions = tohokuQuestions.filter((question) =>
  question.tags?.includes('boss-review:tohoku'),
);
const aggregate = (key: (question: QuestionBase) => string[]) =>
  Object.fromEntries(
    [...new Set(tohokuQuestions.flatMap(key))]
      .sort()
      .map((value) => [value, tohokuQuestions.filter((question) => key(question).includes(value)).length]),
  );

const output = {
  version: 2,
  generatedFrom: 'content/manifest.json',
  generatedAt: checkedAt,
  policy: {
    unverifiedIsApproved: false,
    approvalRequiresNamedReviewer: true,
    visualContextRequiresSourceVisual: true,
    aiMayNotActAsAcademicReviewer: true,
  },
  sources: Object.values(sources),
  summary: {
    productionQuestionFiles: questionFiles.length,
    highPriority: highPriority.length,
    datedFact: datedRows.length,
    visualContext: visualRows.length,
    approvedFiles: 0,
    pendingFiles: questionFiles.length,
  },
  highPriority,
  questionFiles,
  tohoku: {
    questionCount: tohokuQuestions.length,
    byPrefecture: aggregate((question) =>
      tohokuPrefectures.filter((prefecture) => question.tags?.includes(`prefecture:${prefecture}`)),
    ),
    bySubject: aggregate((question) => [question.subject]),
    byGrade: aggregate((question) => [`g${question.grade}`]),
    byType: aggregate((question) => [question.type]),
    regionalBossQuery: {
      sharedTag: 'boss-review:tohoku',
      questionIdsByPrefecture: Object.fromEntries(
        tohokuPrefectures.map((prefecture) => [
          prefecture,
          bossReviewQuestions
            .filter((question) => question.tags?.includes(`prefecture:${prefecture}`))
            .map((question) => question.id),
        ]),
      ),
      selectionPolicy: '6県から最低1問ずつ選ぶ。単一県への偏りを禁止。',
    },
  },
};

await writeFile(resolve(CONTENT, 'quality/release-reviews.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(
  `release reviews: ${datedRows.length} dated + ${visualRows.length} visual + ${questionFiles.length} files; tohoku ${tohokuQuestions.length} questions`,
);
