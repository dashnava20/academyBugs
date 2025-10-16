// utils/elementHelper.js

export async function clickElement(page, element) {
  // Convert string to locator if needed
  const locator = typeof element === 'string' ? page.locator(element) : element;
  await locator.waitFor({ state: 'visible', timeout: 5000 });
  await locator.click();
}

export async function gotoPage(page, url) {
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');
  await console.log('🌐 → Sitio cargado con éxito');
}

export async function clickByRole(page, role, name) {
  return clickElement(page, page.getByRole(role, { name }));
}

export async function clickByText(page, text) {
  return clickElement(page, page.getByText(text));
}

export async function safeType(page, selector, text) {
  const element = page.locator(selector);
  if (await element.isVisible().catch(() => false)) {
    await element.fill(text);
    return true;
  }
  console.warn('⛔ → No se pudo escribir en el selector: ${selector}');
  return false;
}

//Login con credenciales seguras
export async function loginUser(page, url, email, password) {
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');
  await console.log('🌐 → Página de login cargada');

  await safeType(page, '#email', email);
  await safeType(page, '#password', password);
  await clickByRole(page, 'button', 'SIGN IN');
  await page.waitForLoadState('domcontentloaded');
  await console.log('🔐 → Usuario logueado con éxito');
  await page.waitForTimeout(2000); //Espera adicional para asegurar que la sesión esté completamente iniciada
  return true;
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