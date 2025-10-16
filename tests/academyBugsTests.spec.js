// tests/academyBugs.spec.js

import { test, expect } from '@playwright/test';
import { bugs } from '../data/bugs.js';
import { bugInformation } from '../utils/bugInformation.js';
import { saveBug, resetFile, callBugs } from '../utils/bugTracker.js';

test.describe("🐞 → Finding all 25 Bugs", () => {
  test.beforeAll(() => {
    resetFile();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("https://academybugs.com/find-bugs");
    await page.context().clearCookies();

    const acceptCookies = page.getByRole('button', { name: 'Accept cookies' });
    if (await acceptCookies.isVisible().catch(() => false)) {
      await acceptCookies.click();
    }

    await page.waitForLoadState('domcontentloaded');
  });

  for (const bug of bugs) { //bugs.slice(2, 3)
    test(`🐞 → Bug #${bug.id}: ${bug.nombre}`, async ({ page }) => {

      if (bug.action) {
        //console.log('🔄 → Ejecutando acción del bug');
        await bug.action(page);
        //console.log('✅ → Acción completada');
      }

      // Usamos el ID como índice base para contador esperado
      await bugInformation(page, bug.id - 1, bug.nombre, bug.tipo, bug.respuesta, bug.academyBugId);
      saveBug(`Bug #${bug.id}: ${bug.nombre}`);
    });
  }

  test.afterAll(() => {
    const encontrados = callBugs();

    console.log('\n📋 → Resumen de bugs encontrados:');
    for (const bug of encontrados) {
      console.log(`✅ → ${bug}`);
    }
    console.log(`\n🔢 → Total: ${encontrados.length} bugs detectados\n`);
  });
});