import { expect, test, type Page } from '@playwright/test';

async function clickThroughDialogue(page: Page): Promise<void> {
  for (let step = 0; step < 80; step += 1) {
    const dialogue = page.locator('.nq-dlg');
    if (!(await dialogue.isVisible())) return;
    await dialogue.click({ position: { x: 420, y: 410 } });
    await page.waitForTimeout(60);
  }
  throw new Error('会話を最後まで進められませんでした');
}

async function seedComparableWeapons(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('nihonquest');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction('saves', 'readwrite');
      const store = transaction.objectStore('saves');
      const get = store.get('save:1');
      get.onerror = () => reject(get.error);
      get.onsuccess = () => {
        const state = get.result;
        state.player.equipment.weapon = 'common-dou-no-ken';
        state.inventory['aomori-nebuta-no-uchiwa'] = 1;
        state.progress.counters['story.prologue'] = 1;
        state.updatedAt = Date.now();
        store.put(state, 'save:1');
      };
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    database.close();
  });
}

test('バッグの装備候補に現在装備との差を表示する', async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto('/');
  await expect(page.getByRole('menuitem', { name: /はじめから/ })).toBeVisible({ timeout: 30_000 });
  await page.waitForTimeout(500);
  await page.getByRole('menuitem', { name: /はじめから/ }).click();
  await page.getByRole('button', { name: /スロット 1/ }).click();
  await page.getByRole('button', { name: 'はじめる' }).click();
  await expect(page.getByRole('button', { name: 'バッグ' })).toBeVisible({ timeout: 30_000 });
  await clickThroughDialogue(page);

  await page.reload();
  await expect(page.getByRole('menuitem', { name: 'つづきから' })).toBeEnabled({ timeout: 30_000 });
  await seedComparableWeapons(page);
  await page.getByRole('menuitem', { name: 'つづきから' }).click();
  await page.getByRole('button', { name: /スロット 1 ハル/ }).click();
  await expect(page.getByRole('button', { name: 'バッグ' })).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'バッグ' }).click();

  const fan = page.getByRole('button', { name: /ねぶたの うちわ/ });
  await expect(fan).toBeVisible();
  await fan.click();
  await expect(page.getByText(/^いまより/)).toHaveText(/こうげき\+1.*すばやさ\+2/);
});
