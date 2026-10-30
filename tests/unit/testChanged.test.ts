import { describe, expect, it } from 'vitest';
import { planChangedTests } from '../../scripts/test-changed';

describe('planChangedTests', () => {
  it('uses the Vitest dependency graph for ordinary source changes', () => {
    expect(planChangedTests(['src/ui/field/FieldUi.tsx'])).toEqual({
      full: false,
      data: false,
    });
  });

  it('adds data audits for content, map, asset, and fixture changes', () => {
    expect(
      planChangedTests([
        'content/questions/math.json',
        'maps/aomori.json',
        'assets/items/apple.png',
        'tests/fixtures/content.json',
      ]),
    ).toEqual({ full: false, data: true });
  });

  it('keeps i18n changes on the dependency-based path', () => {
    expect(planChangedTests(['content/i18n/ja.json'])).toEqual({
      full: false,
      data: false,
    });
  });

  it('falls back to the full suite when test infrastructure changes', () => {
    expect(planChangedTests(['pnpm-lock.yaml', 'vitest.fast.config.ts'])).toEqual({
      full: true,
      data: false,
    });
  });

  it('normalizes Windows paths before routing', () => {
    expect(planChangedTests(['scripts\\data\\towns.ts'])).toEqual({
      full: false,
      data: true,
    });
  });
});
