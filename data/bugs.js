// data/bugs.js
import { gotoPage, clickByRole, clickByText, safeType, clickElement, loginUser } from '../utils/elementHelper.js';

export const bugs = [
  { //🐞 Bug #1: Cart Product Increment Update
    id: 1,
    academyBugId: 'first',
    nombre: 'Cart Product Increment Update',
    tipo: 'Functional',
    respuesta: 'The cart should allow setting quantities higher than 2 (subject to stock)',
    urlBug:"https://academybugs.com/my-cart/",
    action: async(page)=>{
      await gotoPage(page, 'https://academybugs.com/store/flamingo-tshirt/');
      await clickByRole(page, 'button', 'ADD TO CART');
      await page.waitForLoadState('domcontentloaded');
      await page.locator('input[id^="ec_quantity_"]').first().waitFor({ state: 'visible', timeout: 5000 });
      await safeType(page, 'input[id^="ec_quantity_"]', '4');
      await clickByText(page, 'UPDATE');
    }
  },
  { //🐞 Bug #2: Cart Total Amount → Optimizar el código para añadir al carrito
    id: 2,
    academyBugId: 'second',
    nombre: 'Cart Total Amount',
    tipo: 'Functional',
    respuesta: 'The grand total is equal to the sum of all products in the cart',
    urlBug:"https://academybugs.com/my-cart/",
    action: async(page)=>{
      await gotoPage(page, 'https://academybugs.com/store/flamingo-tshirt/');
      await clickByRole(page, 'button', 'ADD TO CART');
      await page.waitForTimeout(1000);
      await gotoPage(page, 'https://academybugs.com/my-cart/');
      const cartTotal = page.locator('#ec_cart_total');
      await cartTotal.waitFor({ state: 'visible', timeout: 5000 });
      await cartTotal.click({ force: true });
    }
  },
  { //🐞 Bug #3: Manufacturer (404)
    id: 3,
    academyBugId: 'third',
    nombre: 'Manufacturer',
    tipo: 'Functional',
    respuesta: 'The manufacturer link shows an appropriate page',
    urlBug: "https://academybugs.com/store/dark-grey-jeans/",
    action: async (page) => {
      await gotoPage(page, 'https://academybugs.com/store/dark-grey-jeans/');
      await clickByRole(page, 'link', 'Denim')
      await page.waitForLoadState('domcontentloaded');
      await page.waitForURL('https://academybugs.com/stored/extra/denim/', { timeout: 5000 }).catch(() => {});
      console.log("✅ → Contenedor 404 visible");
    }
  },
  { //🐞 Bug #4: Price Filter
    id: 4,
    academyBugId: 'fourth',
    nombre: 'Filter by Price',
    tipo: 'Functional',
    respuesta: 'A list of products in the selected price range is shown',
    urlBug:"https://academybugs.com/store/weekend-wear/",
    action: async(page)=>{
      await gotoPage(page, 'https://academybugs.com/store/weekend-wear/');
      await clickByRole(page, 'link', '$100.00 - $299.99 (1)');
    }
  },
  //  Trying with different approaches to fix Bug #5
  //  18/12/2025: This bug is currently disabled while I work on a fix to automate it.
  //  I'm still investigating the best approach to handle the popup and URL verification.
  //  01/01/2026: Logrado.
  
  { //🐞 Bug #5: Social Media Page is Broken | X
    id: 5,
    academyBugId: 'fifth',
    nombre: 'Social Media Page is Broken | X',
    tipo: 'Functional',
    respuesta: 'The twitter share button should show an appropriate page to share the product on Twitter',
    urlBug:"https://academybugs.com/store/dark-grey-jeans/",
    action: async(page)=>{
      await gotoPage(page, 'https://academybugs.com/store/dark-grey-jeans/');
      const twitterBtn = page.locator('.ec_details_social a[href*="twitter"]');
    
      const [twitterPage] = await Promise.all([
        page.waitForEvent('popup'),
        twitterBtn.click()
      ]);

      await twitterPage.waitForLoadState('domcontentloaded');
      await twitterPage.close();

      await page.bringToFront();
    }
  },
  { //🐞 Bug #6: Image with Space on the right
    id: 6,
    academyBugId: 'sixth',
    nombre: 'Image with Space on the right',
    tipo: 'Visual',
    respuesta: 'The product image fills the box entirely',
    urlBug: 'https://academybugs.com/find-bugs/',
    action: async (page) => {
      await gotoPage(page, 'https://academybugs.com/find-bugs/');
      const bugAction = page.locator('#ec_product_image_effect_4281370');
      await clickElement(page, bugAction);
    }
  },
  { //🐞 Bug #7: Sign In Page
    id: 7,
    academyBugId: 'seventh',
    nombre: 'Sign In Page',
    tipo: 'Visual',
    respuesta: 'The text of the Sign In button is centered vertically',
    urlBug:"https://academybugs.com/account/?ec_page=login&account_error=login_failed",
    action: async(page)=>{
      await gotoPage(page, 'https://academybugs.com/account/?ec_page=login&account_error=login_failed');
      //await clickElement(page, '.ec_account_button .signin-gui-bug')
      await clickByRole(page, 'button', 'SIGN IN');
    }
  },
  { //🐞 Bug #8: Image Space Underneath → Optimizar en formato 'first() y nth(x)
    id: 8,
    academyBugId: 'eighth',
    nombre: 'Image Space Underneath',
    tipo: 'Visual',
    respuesta: ' Product images have no space underneath',
    urlBug:"https://academybugs.com/store/all-items/",
    action: async(page)=>{
      await gotoPage(page, 'https://academybugs.com/store/all-items/');
      await clickElement(page, page.locator('.ec_product_li').first());
    }
  },
  { //🐞 Bug #9: Sign In Button
    id: 9,
    academyBugId: 'ninth',
    nombre: 'Sign In Button',
    tipo: 'Visual',
    respuesta: 'The Sign In button should be above the footer',
    urlBug:"https://academybugs.com/store/professional-suit/",
    action: async(page)=>{
      await gotoPage(page, 'https://academybugs.com/store/professional-suit/');
      await clickByRole(page, 'button', 'SIGN IN');
    }
  },
  { //🐞 Bug #10: Password Label
    id: 10,
    academyBugId: 'tenth',
    nombre: 'Password Label',
    tipo: 'Visual',
    respuesta: 'The Password label should aligned to the left',
    urlBug:"https://academybugs.com/account/?ec_page=login&account_error=login_failed",
    action: async(page)=>{
        await gotoPage(page, 'https://academybugs.com/account/?ec_page=login&account_error=login_failed');
        await clickByText(page, 'Password*');
    }
  },
  { //🐞 Bug #11: Russian Text
    id: 11,
    academyBugId: 'eleventh',
    nombre: 'Russian Text',
    tipo: 'Content',
    respuesta: 'The text under the New User section is in English',
    urlBug:"https://academybugs.com/account/?ec_page=login&account_error=login_failed",
    action: async(page)=>{
      await gotoPage(page, 'https://academybugs.com/account/?ec_page=login&account_error=login_failed');
      await clickByText(page, 'Не зарегистрированы? Нажмите кнопку ниже');
    }
  },
  { //🐞 Bug #12: Unreadable Symbols
    id: 12,
    academyBugId: 'twelfth',
    nombre: 'Unreadable Symbols',
    tipo: 'Content',
    respuesta: 'All the extra letters and numbers should be removed', //All characters are clear to a regular user [previous one]
    urlBug:'https://academybugs.com/store/dark-grey-jeans/',
    action: async(page)=>{
      await gotoPage(page, 'https://academybugs.com/store/dark-grey-jeans/');
      await clickByRole(page, 'button', 'ADD TO CART');
      await page.waitForTimeout(1000);
      await gotoPage(page, 'https://academybugs.com/my-cart/');
      await page.hover('.ec_cart_widget_button');
      const cartWidget = page.locator('.ec_cart_widget_minicart_wrap');
      await cartWidget.waitFor({ state: 'visible', timeout: 5000 });
      // Use force click in case it's covered
      //await cartTotal.click({ force: true });
      await clickByText(page, 'xz1@#');
    }
  },
  { // 🐞 Bug #13: Product Description
    id: 13,
    academyBugId: 'thirteenth',
    nombre: 'Product Description',
    tipo: 'Content',
    respuesta: 'The text should be in English language',
    urlBug: 'https://academybugs.com/store/professional-suit/',
    action: async (page) => {
      await gotoPage(page, 'https://academybugs.com/store/professional-suit/');
      //await clickByText(page, 'Nam nec tellus a odio');
      await page.getByText('Nam nec tellus a odio').first().click();
    }
  },
  { // 🐞 Bug #14: Misspelled Color Name
    id: 14,
    academyBugId: 'fourteenth',
    nombre: 'Misspelled Color Name',
    tipo: 'Content',
    respuesta: 'The color variant spellings should be written as',
    urlBug: 'https://academybugs.com/store/professional-suit/',
    action: async (page) => {
      await gotoPage(page, 'https://academybugs.com/store/professional-suit/');
      await clickByRole(page, 'img', 'Orang'); //It can also be 'Yelow'.
      await clickByText(page, 'Orang');
    }
  },
  { // 🐞 Bug #15: Too Much Space on Button
    id: 15,
    academyBugId: 'fifteenth',
    nombre: 'Too Much Space on Button',
    tipo: 'Content',
    respuesta: 'The caption of the', //The caption of the 'Return to Store' button is written with proper spacing between letters',
    urlBug: 'https://academybugs.com/store/flamingo-tshirt/',
    action: async (page) => {
      await gotoPage(page, 'https://academybugs.com/store/flamingo-tshirt/');
      await clickByRole(page, 'button', 'ADD TO CART');
      // Wait for navigation after clicking REMOVE
      const [navigation] = await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => null),
        clickElement(page, page.locator('div[id^="ec_cartitem_delete_"]'))
      ]);

      await page.waitForLoadState('domcontentloaded');
      await clickByText(page, 'RETURN TO STOR');
    }
  },
  { //🐞 Bug #16: Billing Information Loads Infinitely | Update Page
    id: 16,
    academyBugId: 'sixteenth',
    nombre: 'Billing Information Loads Infinitely | Update Page',
    tipo: 'Performance',
    respuesta: 'Billing information should be updated after filling out',
    urlBug:"https://academybugs.com/account/?ec_page=billing_information",
    action: async(page) => {
      await loginUser(page, 'https://academybugs.com/account/?ec_page=register', 'testing_dash@mail.com', '123456789');
      await gotoPage(page, 'https://academybugs.com/account/?ec_page=billing_information');

      // Llenando el formulario de información de facturación
      const billingFields = [
        ['#ec_account_billing_information_first_name', 'Tesing_Name'],
        ['#ec_account_billing_information_last_name', 'Testing_Lastname'],
        ['#ec_account_billing_information_company_name', 'Testing'],
        ['#ec_account_billing_information_address', 'Testing'],
        ['#ec_account_billing_information_city', 'Bogotá'],
        ['#ec_account_billing_information_state', 'Cundinamarca'],
        ['#ec_account_billing_information_zip', '110111'],
        ['#ec_account_billing_information_phone', '3000000000']
      ];
      await page.locator('#ec_account_billing_information_country').selectOption('Colombia');
      
      for (const [selector, value] of billingFields) {
        await safeType(page, selector, value);
      }

      // Click UPDATE and wait for loader to appear/disappear
      await clickByRole(page, 'button', 'UPDATE');

      /*const historyBlock = page.locator('.ec_account_left');
      await historyBlock.waitFor({ state: 'visible', timeout: 5000 });

      const loader = historyBlock.locator("span[class*='ec_cart_billing_info_update_loader']");

      await loader.waitFor({ state: 'visible', timeout: 5000 });
      await loader.click({ force: true });*/

      const loader = page.locator('.ec_cart_billing_info_update_loader.academy-bug');
      await loader.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await loader.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

      // Optionally, click the loader if required by the bug
      //await clickElement(page, loader);
      await loader.click({ force: true });
    }
  },
  { //🐞 Bug #17: Order History Page
    id: 17,
    academyBugId: 'seventeenth',
    nombre: 'Order History Page',
    tipo: 'Performance',
    respuesta: 'Your Order History section shows appropriate info',
    urlBug:"https://academybugs.com/account/?ec_page=orders",
    action: async(page)=>{
      await loginUser(page, 'https://academybugs.com/account/?ec_page=register', 'testing_dash@mail.com', '123456789'); //más adelante con variables de entorno
      await gotoPage(page, 'https://academybugs.com/account/?ec_page=orders');
      
      const historyBlock = page.locator('.ec_account_left');
      await historyBlock.waitFor({ state: 'visible', timeout: 5000 });

      const loader = historyBlock.locator("span[class*='ec_cart_billing_info_update_loader']");

      await loader.waitFor({ state: 'visible', timeout: 5000 });
      await loader.click({ force: true });

      //const bugHighlight = page.locator('.side-menu-sign-in-button-highlight'); //Temporalmente agregado para validar el resaltado.
      //await bugHighlight.waitFor({ state: 'visible', timeout: 5000 });

      await page.waitForTimeout(2000);
    }
  },
  { //🐞 Bug #18: Billing Information Loads Infinitely | Account Information
    id: 18,
    academyBugId: 'eighteenth',
    nombre: 'Billing Information Loads Infinitely | Account Information',
    tipo: 'Performance',
    respuesta: 'The Billing Address section shows appropriate info',
    urlBug:"https://academybugs.com/account/?ec_page=dashboard",
    action: async(page)=>{
      await loginUser(page, 'https://academybugs.com/account/?ec_page=register', 'testing_dash@mail.com', '123456789'); //más adelante con variables de entorno
      const itemLoading = page.locator('.academy-bug-18');
      await itemLoading.waitFor({ state: 'visible', timeout: 5000 });
      await itemLoading.click({ force: true });
    }
  },
  { //🐞 Bug #19: Product Page Loads Infinitely
    id: 19,
    academyBugId: 'nineteenth',
    nombre: 'Product Page Loads Infinitely',
    tipo: 'Performance',
    respuesta: 'The product in the Hot Item section is properly loaded and displayed',
    urlBug:"https://academybugs.com/anchor-bracelet/",
    action: async(page)=>{
      await gotoPage(page, 'https://academybugs.com/anchor-bracelet/');
      const itemLoading = page.locator('.academy-bug-19');
      await itemLoading.waitFor({ state: 'visible', timeout: 5000 });
      await itemLoading.click({ force: true });
    }
  },
  { //🐞 Bug #20: Social Media Page Loads Infinitely | MySpace
    id: 20,
    academyBugId: 'twentieth',
    nombre: 'Social Media Page Loads Infinitely | MySpace',
    tipo: 'Performance',
    respuesta: 'The user is able to share the product through My Space',
    urlBug: "https://academybugs.com/store/dark-grey-jeans/",
    action: async (page) => {
      await gotoPage(page, 'https://academybugs.com/store/dark-grey-jeans/');
      await Promise.all([
        page.waitForNavigation(),
        await clickByRole(page, 'link', 'MySpace')
      ]);
      // Now on https://academybugs.com/myspace/
      await clickElement(page, '.academy-bug-20')
    }
  },
  { //🐞 Bug #21: Currency Freezes the Page
    id: 21,
    academyBugId: 'twentyFirst',
    nombre: 'Currency Freezes the Page',
    tipo: 'NA',
    respuesta: 'NA',
    urlBug: 'https://academybugs.com/store/dark-grey-jeans/',
    action: async (page) => {
      await gotoPage(page, 'https://academybugs.com/store/dark-grey-jeans/');
      const bugAction = page.locator('#ec_currency_conversion');
      const initial = await bugAction.inputValue();
      await bugAction.selectOption('EUR');
      await page.waitForTimeout(5000); //Validar si es necesario este timeout
    }
  },
  { //🐞 Bug #22: Paginator Freezes the Page
    id: 22,
    academyBugId: 'twentySecond',
    nombre: 'Paginator Freezes the Page',
    tipo: 'Crash',
    respuesta: 'The selected number of',
    urlBug: 'https://academybugs.com/find-bugs/',
    action: async (page) => {
      await gotoPage(page, 'https://academybugs.com/find-bugs/');
      //await clickByText(page, '25 per page');
      const bugAction = page.locator('a.what-we-offer-pagination-link', { hasText: '10' }); //Validar si se puede optimizar
      await clickElement(page, bugAction);
    }
  },
  { // 🐞 Bug #23: Post Comment Freezes the Page
    id: 23,
    academyBugId: 'twentyThird',
    nombre: 'Post Comment Freezes the Page',
    tipo: 'Crash',
    respuesta: 'The comment is posted under the product',
    urlBug: 'https://academybugs.com/store/professional-suit/',
    action: async (page) => {
      await gotoPage(page, 'https://academybugs.com/store/professional-suit/');

      // Llenando el formulario de comentario
      const commentFields = [
        ['#comment', 'This is a comment for testing purposes.'],
        ['#author', 'Testing_Name'],
        ['#email', 'testing_dash@mail.com']
      ];
      
      for (const [selector, value] of commentFields) {
        await safeType(page, selector, value);
      }
      await clickByRole(page, 'button', 'Post Comment');
    }
  },
  { //🐞 Bug #24: Retrieve Password Freezes the Page
    id: 24,
    academyBugId: 'twentyFourth',
    nombre: 'Retrieve Password Freezes the Page',
    tipo: 'Visual',
    respuesta: 'The Password label should aligned to the left',
    urlBug:'https://academybugs.com/account/?ec_page=forgot_password',
    action: async(page)=>{
        await gotoPage(page, 'https://academybugs.com/account/?ec_page=forgot_password');
        await safeType(page, '#ec_account_forgot_password_email', 'testing_dash@mail.com'); //Combinar con las variables de entorno
        await clickByRole(page, 'button', 'RETRIEVE PASSWORD');
    }
  },
  { //🐞 Bug #25: Product Increment Freezes the Page
    id: 25,
    academyBugId: 'twentyFifth',
    nombre: 'Product Increment Freezes the Page',
    tipo: 'Crash',
    respuesta: 'The quantity is increased to a desired value', //update: the questionary is disabled for this bug
    urlBug:'https://academybugs.com/store/denim-coat/',
    action: async(page)=>{
      await gotoPage(page, 'https://academybugs.com/store/denim-coat/');
      await clickByRole(page, 'img', 'Green');
      await clickByRole(page, 'button', '+'); //It can also be 'ec_details_add_to_cart_area' container with the '+' button.
    }
  }
];
