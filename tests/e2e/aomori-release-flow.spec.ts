import { expect, test, type Page } from '@playwright/test';

async function winDebugFlow(page: Page, url: string, enemyName: string): Promise<void> {
  await page.goto(url);
  await expect(page.locator('.nq-box-text')).toContainText(enemyName, { timeout: 30_000 });
  await expect(page.locator('.nq-box-next')).toBeVisible({ timeout: 10_000 });
  await page.locator('.nq-box').click();
  await page.locator('.nq-cmd[data-cmd="attack"]:not([disabled])').click({ timeout: 20_000 });
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline && !(await page.locator('.nq-result-victory').isVisible())) {
    if (await page.locator('.nq-cmd[data-cmd="attack"]:not([disabled])').isVisible())
      await page.locator('.nq-cmd[data-cmd="attack"]:not([disabled])').click();
    else if (await page.locator('.nq-box-next').isVisible()) await page.locator('.nq-box').click();
    await page.waitForTimeout(100);
  }
  await expect(page.locator('.nq-result-victory')).toBeVisible({ timeout: 30_000 });
  if (await page.locator('.nq-result-recruit').isVisible())
    await page.locator('.nq-result-btns .nq-cmd').nth(1).click();
  else await page.locator('[data-result-close]').dispatchEvent('click');
  const returnDeadline = Date.now() + 30_000;
  while (Date.now() < returnDeadline && (await page.locator('.nq-battle').count()) > 0) {
    if (await page.locator('.nq-box-next').isVisible()) await page.locator('.nq-box').click();
    await page.waitForTimeout(100);
  }
  await expect(page.locator('.nq-battle')).toHaveCount(0, { timeout: 10_000 });
}

test('タイトル→青森→県ボス→しるし獲得→セーブ続行', async ({ page }) => {
  test.setTimeout(120_000);
  await winDebugFlow(
    page,
    '/?debug=battle&flow=boss&enemy=aomori-boss-tsugaru-no-nushi&lv=1&zone=dungeon',
    'ツガルのぬし',
  );
  await page.waitForTimeout(2_000);
  await page.goto('/');
  await expect(page.getByRole('menuitem', { name: 'つづきから' })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('menuitem', { name: 'つづきから' }).click();
  await expect(page.getByRole('button', { name: /スロット 1 ハル.*★1/ })).toBeVisible();
});

test('青森の対戦場：勝利後に賞金処理へ戻る', async ({ page }) => {
  test.setTimeout(90_000);
  await winDebugFlow(page, '/?debug=battle&flow=arena&enemy=aomori-ringoron&lv=1', 'リンゴロン');
  await page.waitForTimeout(1_000);
  const saved = await page.evaluate(
    () =>
      new Promise<{ badges: number; gold: number }>((resolve, reject) => {
        const request = indexedDB.open('nihonquest');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const get = request.result.transaction('saves').objectStore('saves').get('save:1');
          get.onerror = () => reject(get.error);
          get.onsuccess = () => {
            const game = get.result as { arena: { badges: number }; player: { gold: number } };
            resolve({ badges: game.arena.badges, gold: game.player.gold });
          };
        };
      }),
  );
  expect(saved.badges).toBe(1);
  expect(saved.gold).toBeGreaterThanOrEqual(160);
});
