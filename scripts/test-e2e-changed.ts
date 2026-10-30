import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { changedFiles } from './test-changed';

type E2eGroup = 'field' | 'bag' | 'battle' | 'onboarding' | 'tools' | 'flows';

const GROUP_SPECS: Record<E2eGroup, readonly string[]> = {
  field: [
    'tests/e2e/aomori-boss-distance.spec.ts',
    'tests/e2e/area-map-navigation.spec.ts',
    'tests/e2e/field-sounds.spec.ts',
    'tests/e2e/look-heading.spec.ts',
    'tests/e2e/mobile-interaction.spec.ts',
    'tests/e2e/virtual-stick.spec.ts',
  ],
  bag: ['tests/e2e/bag-interactions.spec.ts'],
  battle: [
    'tests/e2e/battle-menu-readability.spec.ts',
    'tests/e2e/battle-question-audit.spec.ts',
    'tests/e2e/battle-sounds.spec.ts',
    'tests/e2e/battle.spec.ts',
    'tests/e2e/enemy-knockout.spec.ts',
    'tests/e2e/music.spec.ts',
    'tests/e2e/musubi-dama.spec.ts',
    'tests/e2e/skill-gauge-cost.spec.ts',
  ],
  onboarding: [
    'tests/e2e/empty-save-slots.spec.ts',
    'tests/e2e/journey-setup.spec.ts',
    'tests/e2e/mvp-regions.spec.ts',
    'tests/e2e/new-game-appearance.spec.ts',
    'tests/e2e/opening-cutscene.spec.ts',
    'tests/e2e/title-menu-layout.spec.ts',
  ],
  tools: ['tests/e2e/playground-list.spec.ts', 'tests/e2e/questions.spec.ts'],
  flows: [
    'tests/e2e/island-progression.spec.ts',
    'tests/e2e/progress.spec.ts',
    'tests/e2e/regional-progression.spec.ts',
    'tests/e2e/startup-retry.spec.ts',
    'tests/e2e/story-companion.spec.ts',
    'tests/e2e/ui-accessibility.spec.ts',
  ],
};

const ROUTES: ReadonlyArray<{ pattern: RegExp; groups: readonly E2eGroup[] }> = [
  {
    pattern:
      /^(src\/(?:core\/world|scenes\/overworld|rendering\/overworld|ui\/field)\/|src\/scenes\/(?:Overworld\.ts|entries\/overworld\.ts)$|maps\/|content\/world\/)/,
    groups: ['field'],
  },
  {
    pattern:
      /^(src\/(?:core\/battle|scenes\/battle|rendering\/battle|ui\/battle|questions)\/|src\/scenes\/(?:Battle\.ts|entries\/battle\.ts)$|content\/(?:arena|balance|monsters|questions)\/)/,
    groups: ['battle'],
  },
  {
    pattern:
      /^src\/core\/progression\/(?:battleResult|battleSettlement|battleTutorial|musubiDamaOnboarding|specialty)\.ts$/,
    groups: ['battle'],
  },
  {
    pattern: /(^|\/)(?:bag|inventory|equipment|items?|shop|barber|inn)(?:[./_-]|\/)/i,
    groups: ['bag'],
  },
  {
    pattern:
      /^(src\/(?:core\/state|scenes\/title|rendering\/title|ui\/(?:title|cutscene))\/|src\/scenes\/(?:Boot|Title)\.ts$|src\/scenes\/entries\/(?:boot|title)\.ts$|content\/i18n\/)/,
    groups: ['onboarding'],
  },
  {
    pattern: /^(src\/tools\/|(?:playground|editor|battle-question-audit)\.html$)/,
    groups: ['tools'],
  },
  {
    pattern: /^(src\/core\/(?:learning|progression|regions)\/|content\/(?:curriculum|prefectures|quality)\/)/,
    groups: ['flows'],
  },
];

const APP_FILES = new Set([
  'index.html',
  'package.json',
  'pnpm-lock.yaml',
  'playwright.config.ts',
  'vite.config.ts',
]);
const APP_PREFIXES = ['src/', 'content/', 'maps/', 'assets/', 'public/'];

const normalizePath = (path: string): string => path.replaceAll('\\', '/').replace(/^\.\//, '');

export function planChangedE2e(paths: readonly string[]): string[] {
  const specs = new Set<string>();

  for (const rawPath of paths) {
    const path = normalizePath(rawPath);
    if (/^tests\/e2e\/[^/]+\.spec\.ts$/.test(path)) {
      specs.add(path);
      continue;
    }

    let matched = false;
    for (const route of ROUTES) {
      if (!route.pattern.test(path)) continue;
      matched = true;
      for (const group of route.groups) for (const spec of GROUP_SPECS[group]) specs.add(spec);
    }

    if (!matched && (APP_FILES.has(path) || APP_PREFIXES.some((prefix) => path.startsWith(prefix)))) {
      specs.add('tests/e2e/smoke.spec.ts');
    }
  }

  return [...specs].sort();
}

function runPlaywright(specs: readonly string[]): number {
  const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const result = spawnSync(
    command,
    ['exec', 'playwright', 'test', ...specs, '--grep-invert', '全問題をバトル問題枠'],
    { stdio: 'inherit' },
  );
  if (result.error) throw result.error;
  return result.status ?? 1;
}

function main(): void {
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  if (args.length > 1) throw new Error('Usage: pnpm test:e2e:changed [base-ref]');

  const specs = planChangedE2e(changedFiles(args[0]));
  if (specs.length === 0) {
    console.log('No E2E-relevant changes; skipping browser tests.');
    return;
  }

  console.log(`Running ${specs.length} affected E2E spec(s).`);
  process.exitCode = runPlaywright(specs);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
