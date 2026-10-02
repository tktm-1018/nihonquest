import { readFile } from 'node:fs/promises';
const reviews = JSON.parse(await readFile('content/quality/release-reviews.json', 'utf8')) as {
  highPriority: { kind: string; evidenceStatus: string; academicApproval: boolean }[];
  questionFiles: { path: string }[];
};
const rights = JSON.parse(await readFile('content/quality/media-rights.json', 'utf8')) as {
  bundledAssets: { license?: string; sourceUrl?: string }[];
};
const backlog = JSON.parse(await readFile('imports/asset-backlog.json', 'utf8')) as {
  total: number;
  assets: { area: string; priority: number }[];
};
const dated = reviews.highPriority.filter((x) => x.kind === 'dated-fact');
const visual = reviews.highPriority.filter((x) => x.kind === 'visual-context');
if (dated.length !== 12 || visual.length !== 18)
  throw new Error(`high-priority ledger count mismatch: ${dated.length}/${visual.length}`);
if (reviews.questionFiles.length !== 44 || new Set(reviews.questionFiles.map((x) => x.path)).size !== 44)
  throw new Error('question-file ledger must cover 44 unique files');
if (reviews.highPriority.some((x) => !x.evidenceStatus)) throw new Error('evidence status missing');
if (reviews.highPriority.some((x) => x.academicApproval))
  throw new Error('unreviewed high-priority material must not be approved');
if (rights.bundledAssets.some((x) => !x.license || !x.sourceUrl))
  throw new Error('media rights record incomplete');
if (backlog.total !== backlog.assets.length) throw new Error('asset backlog total mismatch');
const aomoriP0 = backlog.assets.filter((x) => x.area === 'aomori' && x.priority === 1).length;
console.log(
  `quality: dated=${dated.length}, visual=${visual.length}, files=44, assets=${backlog.total}, aomoriP0=${aomoriP0}`,
);
