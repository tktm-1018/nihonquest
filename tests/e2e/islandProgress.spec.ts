import { expect, test, type Page } from '@playwright/test';

async function advanceDialogue(page: Page, times = 1): Promise<void> {
  for (let i = 0; i < times; i += 1) {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(80);
  }
}

async function openWorldMap(page: Page): Promise<void> {
  await page.getByRole('button', { name: /ちずを ひらく/ }).click();
  await page.getByRole('button', { name: 'にほんちず' }).click();
}

/** localforage のIndexedDBセーブを、通し時間短縮用の既存進行データにする。 */
async function prepareTohokuBoss(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('nihonquest');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const state = await new Promise<Record<string, any>>((resolve, reject) => {
      const request = db.transaction('saves', 'readonly').objectStore('saves').get('save:1');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    state.progress.areaSigns = ['aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'];
    state.player.level = 99;
    state.player.hp = 9999;
    state.player.baseStats = { ...state.player.baseStats, hp: 9999, atk: 999999, def: 9999, spd: 9999 };
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('saves', 'readwrite');
      tx.objectStore('saves').put(state, 'save:1');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  });
}

test('地方ボス勝利→次島の結界→再ロード後も東北クリアを維持する', async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto('/');
  await page.getByRole('menuitem', { name: /はじめから/ }).click();
  await page.getByRole('button', { name: /スロット 1/ }).click();
  await page.getByRole('textbox', { name: 'なまえ' }).fill('テスト');
  await page.getByRole('button', { name: 'はじめる' }).click();
  await expect(page.getByRole('button', { name: 'メニュー' })).toBeVisible({ timeout: 30_000 });
  await advanceDialogue(page, 16); // 初回プロローグを閉じる
  await page.waitForTimeout(1_000); // はじめのオートセーブを待つ
  await prepareTohokuBoss(page);

  await page.reload();
  await page.getByRole('menuitem', { name: 'つづきから' }).click();
  await page.getByRole('button', { name: /スロット 1 テスト/ }).click();
  await expect(page.getByRole('button', { name: 'メニュー' })).toBeVisible({ timeout: 30_000 });
  await openWorldMap(page);
  // RubyText の読みを表示する版と、ひらがなだけの版のどちらでも地方ボス導線を選ぶ。
  await page.getByRole('button', { name: /ボス.*いどむ/ }).last().click();

  await advanceDialogue(page, 12);
  await expect(page.locator('.nq-battle')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.nq-cmd[data-cmd="attack"]:not([disabled])')).toBeVisible({ timeout: 30_000 });
  await page.locator('.nq-cmd[data-cmd="attack"]:not([disabled])').click();
  await expect(page.locator('.nq-result')).toBeVisible({ timeout: 30_000 });
  await page.locator('[data-result-close]').click();

  await expect(page.locator('.nq-dlg')).toBeVisible({ timeout: 20_000 });
  let sawBarrier = false;
  for (let i = 0; i < 30; i += 1) {
    if ((await page.locator('.nq-dlg-text').textContent())?.includes('結界')) sawBarrier = true;
    await advanceDialogue(page, 1);
    if (sawBarrier && !(await page.locator('.nq-dlg').isVisible())) break;
  }
  expect(sawBarrier).toBe(true);
  await expect(page.getByRole('button', { name: 'メニュー' })).toBeVisible();

  await page.reload();
  await page.getByRole('menuitem', { name: 'つづきから' }).click();
  await page.getByRole('button', { name: /スロット 1 テスト/ }).click();
  await expect(page.getByRole('button', { name: 'メニュー' })).toBeVisible({ timeout: 30_000 });
  await openWorldMap(page);
  await expect(page.getByText('ちほうボス クリア！')).toBeVisible();
  await expect(page.getByRole('button', { name: /ボス.*いどむ/ })).toHaveCount(0);
});
