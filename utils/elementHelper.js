// utils/elementHelper.js

export async function clickElement(page, element) {
  // Convert string to locator if needed
  const locator = typeof element === 'string' ? page.locator(element) : element;
  await locator.waitFor({ state: 'visible', timeout: 5000 });
  await locator.click();
}

export async function gotoPage(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  console.log('🌐 → Sitio cargado con éxito. Iniciando prueba...');
}

export async function clickByRole(page, role, name) {
  return clickElement(page, page.getByRole(role, { name }));
}

export async function clickByText(page, text) {
  return clickElement(page, page.getByText(text));
}

export async function safeType(page, selector, text) {
  const element = page.locator(selector);

  try {
    await element.waitFor({ state: 'visible', timeout: 5000 });
    await element.fill('');
    await element.fill(text);

    console.log(`✅ → Texto escrito en ${selector}: ${text}`);
    return true;
  } catch (e) {
      console.warn(`⛔ → No se pudo escribir en el selector: ${selector}`);
      console.warn(`⛔ → Motivo: ${e.message}`);
    return false;
  }
}


//Login con credenciales seguras
export async function loginUser(page, url, email, password) {
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');

  await console.log('🌐 → Página de login cargada');

  await page.waitForSelector('#ec_account_login_email', { state: 'visible' });
  await page.waitForSelector('#ec_account_login_password', { state: 'visible' });

  const emailSelector = '#ec_account_login_email';
  const passwordSelector = '#ec_account_login_password';

  await safeType(page, emailSelector, email);
  await safeType(page, passwordSelector, password);

    // Botón roto → click via JS
  await page.evaluate(() => {
    document.querySelector('button[name="ec_account_form_action"]')?.click();
  });
  console.log('🔄 → Enviando formulario sin usar el botón defectuoso...');
  
  // Espera a que cargue y verifiquemos si realmente hubo login
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  // Verificación real del login
  const loggedIn = await page.locator('.ec_cart_input_row').isVisible().catch(() => false);

  if (loggedIn) {
    console.log('🔐 → Usuario logueado con éxito');
    return true;
  } else {
    console.warn('⛔ → El login NO se completó (probablemente por otro bug)');
    console.log('🔎 → URL actual:', await page.url());
    return false;
  }
}

export async function addToCart(page, buttonSelectorOrLocator) {
  await clickElement(page, buttonSelectorOrLocator);
  await page.waitForLoadState('domcontentloaded');
  console.log('✅ → Producto añadido al carrito');
  return true;
}

/**
 * await gotoPage(page, 'https://academybugs.com/store/flamingo-tshirt/');
      await clickByRole(page, 'button', 'ADD TO CART'); 
      */
// ...existing code...



// Usage example in your test or another function:
// await addToCart(page, 'button[aria-label="Add to cart"]');
// or
// await addToCart(page, page.getByRole('button', { name: 'Add to cart' }));

// ...existing code...