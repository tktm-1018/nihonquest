import { execFileSync, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export interface ChangedTestPlan {
  full: boolean;
  data: boolean;
}

const FULL_TEST_FILES = new Set([
  'package.json',
  'pnpm-lock.yaml',
  'vitest.config.ts',
  'vitest.fast.config.ts',
  'vitest.data.config.ts',
  'vitest.test-groups.ts',
]);

const DATA_PREFIXES = ['assets/', 'maps/', 'public/', 'schemas/', 'scripts/data/', 'tests/fixtures/'];

const normalizePath = (path: string): string => path.replaceAll('\\', '/').replace(/^\.\//, '');

export function planChangedTests(paths: readonly string[]): ChangedTestPlan {
  const changed = paths.map(normalizePath);
  const full = changed.some(
    (path) => FULL_TEST_FILES.has(path) || /^vitest(?:\..+)?\.config\.[cm]?[jt]s$/.test(path),
  );
  const data =
    !full &&
    changed.some(
      (path) =>
        (path.startsWith('content/') && !path.startsWith('content/i18n/')) ||
        DATA_PREFIXES.some((prefix) => path.startsWith(prefix)),
    );
  return { full, data };
}

function gitLines(args: readonly string[]): string[] {
  return execFileSync('git', [...args], { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
}

export function changedFiles(base?: string): string[] {
  if (base) execFileSync('git', ['rev-parse', '--verify', `${base}^{commit}`], { stdio: 'ignore' });
  const paths = [
    ...(base ? gitLines(['diff', '--name-only', '--diff-filter=ACMR', `${base}...HEAD`]) : []),
    ...gitLines(['diff', '--cached', '--name-only', '--diff-filter=ACMR']),
    ...gitLines(['ls-files', '--modified', '--others', '--exclude-standard']),
  ];
  return [...new Set(paths)];
}

function runPnpm(args: readonly string[]): number {
  const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const result = spawnSync(command, [...args], { stdio: 'inherit' });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

function main(): void {
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  if (args.length > 1) throw new Error('Usage: pnpm test:changed [base-ref]');

  const base = args[0];
  const paths = changedFiles(base);
  if (paths.length === 0) {
    console.log('No changed files; no tests to run.');
    return;
  }

  const plan = planChangedTests(paths);
  if (plan.full) {
    console.log('Test infrastructure changed; running the full Vitest suite.');
    process.exitCode = runPnpm(['test']);
    return;
  }

  console.log(`Selecting tests for ${paths.length} changed file(s).`);
  const changedArg = base ? `--changed=${base}` : '--changed';
  const relatedStatus = runPnpm(['exec', 'vitest', 'run', changedArg, '--passWithNoTests']);
  if (relatedStatus !== 0) {
    process.exitCode = relatedStatus;
    return;
  }

  if (plan.data) {
    console.log('Data-bearing files changed; running data audits.');
    process.exitCode = runPnpm(['test:data']);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
