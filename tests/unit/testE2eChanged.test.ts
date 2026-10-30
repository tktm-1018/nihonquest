import { describe, expect, it } from 'vitest';
import { planChangedE2e } from '../../scripts/test-e2e-changed';

describe('planChangedE2e', () => {
  it('skips E2E for documentation-only changes', () => {
    expect(planChangedE2e(['README.md', 'docs/01_ARCHITECTURE.md'])).toEqual([]);
  });

  it('selects only field journeys for field changes', () => {
    expect(planChangedE2e(['src/ui/field/FieldUi.tsx'])).toEqual([
      'tests/e2e/aomori-boss-distance.spec.ts',
      'tests/e2e/area-map-navigation.spec.ts',
      'tests/e2e/field-sounds.spec.ts',
      'tests/e2e/look-heading.spec.ts',
      'tests/e2e/mobile-interaction.spec.ts',
      'tests/e2e/overworld.spec.ts',
      'tests/e2e/virtual-stick.spec.ts',
    ]);
  });

  it('combines affected domains without duplicate specs', () => {
    const specs = planChangedE2e([
      'src/core/battle/turn.ts',
      'src/core/progression/inventory.ts',
      'content/items/apple.json',
    ]);

    expect(specs).toContain('tests/e2e/battle.spec.ts');
    expect(specs).toContain('tests/e2e/bag-interactions.spec.ts');
    expect(new Set(specs).size).toBe(specs.length);
    expect(specs).not.toContain('tests/e2e/area-map-navigation.spec.ts');
  });

  it('routes the top-level Phaser scenes to their owning journeys', () => {
    expect(planChangedE2e(['src/scenes/Battle.ts'])).toContain('tests/e2e/battle.spec.ts');
    expect(planChangedE2e(['src/scenes/Overworld.ts'])).toContain('tests/e2e/area-map-navigation.spec.ts');
    expect(planChangedE2e(['src/scenes/Title.ts'])).toContain('tests/e2e/title-menu-layout.spec.ts');
  });

  it('routes battle settlement and onboarding progression through battle E2E', () => {
    expect(
      planChangedE2e([
        'src/core/progression/battleSettlement.ts',
        'src/core/progression/musubiDamaOnboarding.ts',
      ]),
    ).toContain('tests/e2e/battle.spec.ts');
  });

  it('runs a changed E2E spec directly', () => {
    expect(planChangedE2e(['tests/e2e/story-companion.spec.ts'])).toEqual([
      'tests/e2e/story-companion.spec.ts',
    ]);
  });

  it('falls back to smoke for unknown application and test-infrastructure changes', () => {
    expect(planChangedE2e(['src/shared/contracts.ts', 'playwright.config.ts'])).toEqual([
      'tests/e2e/smoke.spec.ts',
    ]);
  });

  it('normalizes Windows paths before routing', () => {
    expect(planChangedE2e(['src\\scenes\\overworld\\movement.ts'])).toContain(
      'tests/e2e/area-map-navigation.spec.ts',
    );
  });
});
