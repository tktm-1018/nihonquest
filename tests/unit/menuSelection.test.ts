import { describe, expect, it } from 'vitest';
import type { MenuEntry } from '../../src/shared/menuModel';
import { initialMenuIndex } from '../../src/ui/field/MenuOverlay';

const entry = (key: string, known: boolean): MenuEntry => ({
  key,
  name: key,
  known,
  lines: [],
});

describe('メニューの初期選択', () => {
  it('指定項目があれば最優先する', () => {
    const entries = [entry('unknown', false), entry('known', true), entry('focus', false)];
    expect(initialMenuIndex(entries, 'focus')).toBe(2);
  });

  it('指定がなければ最初に発見済みの項目を選ぶ', () => {
    const entries = [entry('unknown-1', false), entry('unknown-2', false), entry('known', true)];
    expect(initialMenuIndex(entries)).toBe(2);
  });

  it('すべて未発見なら先頭を選ぶ', () => {
    expect(initialMenuIndex([entry('unknown', false)])).toBe(0);
    expect(initialMenuIndex([])).toBe(0);
  });
});
