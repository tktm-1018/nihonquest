/** Fail release validation when a bundled Tohoku asset lacks an explicit rights record. */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

interface AssetRecord {
  path: string;
  author: string;
  productionMethod: string;
  sourceReference: string;
  license: string;
  rightsStatus: string;
  modificationAllowed: boolean;
  redistributionAllowed: boolean | null;
  creditRequired: boolean;
  proofCheckedAt: string;
}

interface Ledger {
  policy: { unknownLicenseAllowed: boolean; approvalRequiresProof: boolean };
  bundledAssets: AssetRecord[];
  audioDecision: { bgm: string; se: string; englishVoice: string };
  externalCredits: Array<Record<string, unknown>>;
  releaseDecision: { status: string; blocker: string };
}

const ROOT = resolve('.');
const ledger = JSON.parse(
  await readFile(resolve(ROOT, 'content/quality/media-rights.json'), 'utf8'),
) as Ledger;

if (ledger.policy.unknownLicenseAllowed) throw new Error('unknown licenses must remain forbidden');
if (!ledger.policy.approvalRequiresProof) throw new Error('rights approval must require proof');
if (ledger.bundledAssets.length !== 86)
  throw new Error(`expected 86 Tohoku asset records, got ${ledger.bundledAssets.length}`);

const seen = new Set<string>();
for (const asset of ledger.bundledAssets) {
  if (seen.has(asset.path)) throw new Error(`duplicate rights record: ${asset.path}`);
  seen.add(asset.path);
  if (!existsSync(resolve(ROOT, asset.path))) throw new Error(`bundled asset missing: ${asset.path}`);
  if (
    !asset.author ||
    !asset.productionMethod ||
    !asset.sourceReference ||
    !asset.license ||
    !asset.proofCheckedAt
  )
    throw new Error(`rights proof incomplete: ${asset.path}`);
  if (asset.license === 'unknown') throw new Error(`unclassified license: ${asset.path}`);
  if (asset.rightsStatus !== 'hold-pending-human-ownership-confirmation')
    throw new Error(`unverified asset was approved: ${asset.path}`);
  if (!asset.modificationAllowed) throw new Error(`generated asset must allow modification: ${asset.path}`);
  if (asset.redistributionAllowed !== null)
    throw new Error(`redistribution must remain undecided before human confirmation: ${asset.path}`);
}

if (!ledger.audioDecision.bgm || !ledger.audioDecision.se || !ledger.audioDecision.englishVoice)
  throw new Error('audio adoption decisions are incomplete');
if (ledger.externalCredits.length < 4) throw new Error('external release credits are incomplete');
if (ledger.releaseDecision.status !== 'NO-GO' || !ledger.releaseDecision.blocker)
  throw new Error('unverified procedural rights must block release');

console.log(
  `media rights: ${seen.size} Tohoku assets recorded, rights hold preserved, audio decisions complete`,
);
