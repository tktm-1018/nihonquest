import { expect, test, type Page } from '@playwright/test';

test.use({ hasTouch: true });

async function newGame(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByRole('menuitem', { name: /はじめから/ }).click();
  await page.getByRole('button', { name: /スロット 2/ }).click();
  await page.getByRole('textbox', { name: 'なまえ' }).fill('品質');
  await page.getByRole('button', { name: 'はじめる' }).click();
  await expect(page.getByRole('button', { name: 'メニュー' })).toBeVisible({ timeout: 20_000 });
}

test('性能予算：初回ロード、メニュー初回表示、戦闘開始', async ({ page }) => {
  const start = Date.now();
  await page.goto('/');
  await expect(page.locator('.nq-loading')).toHaveCount(0, { timeout: 15_000 });
  expect(Date.now() - start, 'cold title load').toBeLessThan(5_000);
  await page.getByRole('menuitem', { name: /はじめから/ }).click();
  await page.getByRole('button', { name: /スロット 1/ }).click();
  await page.getByRole('textbox', { name: 'なまえ' }).fill('計測');
  await page.getByRole('button', { name: 'はじめる' }).click();
  await expect(page.getByRole('button', { name: 'メニュー' })).toBeVisible({ timeout: 20_000 });
  const menuStart = Date.now();
  await page.getByRole('button', { name: 'メニュー' }).click();
  await expect(page.getByRole('region', { name: 'がくしゅうロードマップ' })).toBeVisible();
  expect(Date.now() - menuStart, 'first menu display').toBeLessThan(1_000);
  const battleStart = Date.now();
  await page.goto('/?debug=battle&enemy=aomori-ringoron&lv=1');
  await expect(page.locator('.nq-battle')).toBeVisible({ timeout: 15_000 });
  expect(Date.now() - battleStart, 'debug battle start').toBeLessThan(5_000);
});

test('タッチ幅・ルビ・保護者画面', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await newGame(page);
  await page.getByRole('button', { name: 'メニュー' }).tap();
  await page.getByRole('button', { name: /ほごしゃ/ }).tap();
  const parent = page.getByRole('region', { name: 'ほごしゃメニュー' });
  await expect(parent).toBeVisible();
  await parent.getByRole('textbox', { name: /こたえ/ }).fill('12');
  await parent.getByRole('button', { name: /ひらく/ }).tap();
  await expect(parent).toContainText('がくしゅう');
  await page.goto('/playground.html?q=shakai.g4.tohoku.0001');
  await expect(page.locator('ruby rt').first()).toBeVisible({ timeout: 15_000 });
});
