const {test, expect} = require('@playwright/test');

/**
    correo: testing_dash@mail.com
    pass:   123456789
 */

// 🐞 Función principal de procesamiento del bug
async function bugInformation(page, expectedCount, nombreBug, tipoBug, respuesta, pageURL) {
    await page.waitForLoadState();
    //console.log(pageURL);
    //await expect(page).toHaveURL(pageURL);
    //console.log('✅ → URL correcta para ejecución del bug');

    // 1. Confirmar si es bug tipo Crash
    if (await page.getByRole('heading', { name: 'You found a crash bug,' }).isVisible().catch(()=>false)) {
        console.log('✅ → Popup Crash mostrado, esperando 5 segundos...');
        await page.waitForTimeout(7000);
    } else {
        console.log(`⛔ → Popup Crash no mostrado. Continuando...`);
    }
    
    // 2. Mostrar y responder cuestionario (si aplica)
    const bugPopup = page.locator('#bug-popup');
    try {
        await bugPopup.waitFor({ state: 'visible', timeout: 20000 });
        console.log('✅ → Popup de cuestionario visible');
        await answerQuestionary(page, tipoBug, respuesta);

        const reportBtn = page.getByRole('button', { name: 'View Issue Report' });
        await expect(reportBtn).toBeVisible({ timeout: 7000 });
        await reportBtn.click();
    } catch (err) {
        console.log('⛔ → Popup cuestionario no mostrado. Continuando...');
    }

    // 3. Cerrar popups finales

    await closePopup(page, 'popmake-4406'); // Resultados
    await page.waitForLoadState();
    await closePopup(page, 'popmake-4393'); // "Más bugs"

    // 4. Validar contador de bugs
    page.waitForLoadState();
    const counterText = await page.locator('#bugs-counter-badge > span').textContent();
    const counterNum = Number(counterText);
    //console.log(`🐞 → Bug #${counterText} encontrado: ${nombreBug}`);

    expect(counterNum).toBe(expectedCount + 1);
    console.log(`🐞 → Bug #${expectedCount + 1} registrado correctamente | Contador en pantalla: ${counterNum}/25\n`);
}

// ✅ Función de respuesta al cuestionario
async function answerQuestionary(page, tipoBug, respuesta) {
    await page.locator(`input[type="radio"][value="${tipoBug}"]`).check();
    await page.getByText(respuesta).check();
    
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    await expect(submitBtn).toBeVisible({ timeout: 7000 });
    await submitBtn.click();
}

// ✅ Función de cierre de popups si están visibles
async function closePopup(page, id) {
    const popup = await page.locator(`#${id}`, { timeout: 6000 });
    const isVisible = await popup.isVisible().catch(() => false);

    if (!isVisible) {
        console.log(`⛔ → Popup ${id} no visible`);
        return;
    }
    console.log(`✅ → Popup ${id} visible. Intentando cerrar...`);
     try {
        const closeBtn = popup.locator('.pum-close.popmake-close');
        await closeBtn.click({ timeout: 5000 });

        // Esperamos un poco para ver si se oculta
        await popup.waitFor({ state: 'hidden', timeout: 6000 });
        console.log(`✅ → Popup ${id} cerrado`);
    } catch (err) {
        console.warn(`⛔ → No se pudo cerrar el popup ${id}: ${err.message}`);
    }
}

// 🧪 Test Principal ---------------------------------------------------------------- //
test.describe("🕷️ Finding all 25 Bugs", () => {
    test.beforeEach(async ({page}) => {
        //await page.goto("https://google.com");
        await page.goto("https://academybugs.com/find-bugs");
        await page.context().clearCookies();
        await page.getByRole('button', { name: 'Accept cookies' }).click();

        //const initial = await page.locator('#bugs-counter-badge span').textContent();
        //console.log('🐞 → Contador al inicio:', initial);
    });

    test("🧪 Ejecutar bugs definidos", async ({page}) => {
        const bugs = [
            { //🐞 Bug #1: Paginator
                nombre: 'Paginator',
                tipo: 'Crash',
                respuesta: 'The selected number of',
                urlBug:"https://academybugs.com/find-bugs/#",
                action: async(page)=>{
                    const bugAction = page.locator('a.what-we-offer-pagination-link', { hasText: '10' });
                    await bugAction.click();
                }
            },
            { //🐞 Bug #2: Broken Image
                nombre: 'Broken Image',
                tipo: 'Visual',
                respuesta: 'The product image fills the box entirely',
                urlBug:"https://academybugs.com/find-bugs/#",
                action: async(page)=>{
                    const bugAction = page.locator('#ec_product_image_effect_4281370');
                    await bugAction.click();
                }
            },
            { //🐞 Bug #3: Currency
                nombre: 'Currency',
                tipo: 'NA',
                respuesta: 'NA',
                urlBug:"https://academybugs.com/store/dark-grey-jeans/",
                action: async(page)=>{
                    const bugAction = page.locator('#ec_currency_conversion');
                    const initial = await page.locator('#ec_currency_conversion').inputValue();
                    expect (initial).toBe('USD');
                    await bugAction.selectOption('EUR');
                }
            },
            /*{ //🐞 Bug #4: Manufacturer (404)
                nombre: 'Manufacturer',
                tipo: 'Functional',
                respuesta: 'The manufacturer link shows an appropriate page',
                urlBug:"https://academybugs.com/store/dark-grey-jeans/",//"https://academybugs.com/store/dark-grey-jeans/",
                action: async (page) => {
                    const bugAction = page.locator('#manufacturer-bug');

                    const oldURL = page.url();
                    console.log("🌐 URL antes del clic:", oldURL);

                    await bugAction.click();
                    console.log(`⚠️ Enlace de Manufactura clickeado. Esperando redirección o carga de contenido...`);

                    // Esperar hasta 15 segundos por el contenido del nuevo sitio
                    const timeoutMs = 15000;
                    const start = Date.now();
                    let success = false;

                    while (Date.now() - start < timeoutMs) {
                        const currentURL = page.url();
                        if (currentURL !== oldURL) {
                            console.log("✅ La URL cambió:", currentURL);
                            success = true;
                            break;
                        }

                        const isContentVisible = await page.locator('#sq-content').isVisible().catch(() => false);
                        if (isContentVisible) {
                            console.log("✅ Contenido 404 detectado sin cambio de URL");
                            success = true;
                            break;
                        }

                        await page.waitForTimeout(300);
                    }

                    if (!success) {
                        throw new Error("❌ La URL no cambió ni se cargó el contenido esperado.");
                    }

                    // Confirmar que se cargó el contenido
                    await expect(page.locator('#sq-content')).toBeVisible({ timeout: 5000 });
                    console.log("✅ Contenedor 404 visible");
                }
            },*/
            { //🐞 Bug #5: Broken Social Media Link (X)
                nombre: 'Broken Social Media Link (X)',
                tipo: 'Functional',
                respuesta: 'The twitter share button should show an appropriate page to share the product on Twitter',
                urlBug:"https://academybugs.com/store/dark-grey-jeans/",
                action: async(page)=>{
                    await page.goto("https://academybugs.com/store/dark-grey-jeans/");
                    const page1Promise = page.waitForEvent('popup');
                    const bugAction = page.getByRole('link', { name: 'X', exact: true });
                    await bugAction.click();
                    const page1 = await page1Promise;    
                    await page1.close();       
                }
            },
            { //🐞 Bug #6: Color Selector Name
                nombre: 'Color Selector Name',
                tipo: 'Content',
                respuesta: 'The color variant spellings should be written as',
                urlBug:"https://academybugs.com/store/professional-suit/",
                action: async(page)=>{
                    await page.goto("https://academybugs.com/store/professional-suit/");
                    const bugAction = page.getByRole('img', { name: 'Orang' });
                    await bugAction.click();
                    await page.getByText('Orang').click();
                }
            },
            { //🐞 Bug #7: Product Description
                nombre: 'Product Description',
                tipo: 'Content',
                respuesta: 'The text should be in English language',
                urlBug:"https://academybugs.com/store/professional-suit/",
                action: async(page)=>{
                    const bugAction = page.getByText('Nam nec tellus a odio').first();
                    //const bugAction = page.locator('.ec_details_description academy-bug', {hasText:'Nam nec tellus a odio'});
                    await bugAction.click();
                }
            },
            { //🐞 Bug #8: Post Comment
                nombre: 'Post Comment',
                tipo: 'Crash',
                respuesta: 'The comment is posted under the product',
                urlBug:"https://academybugs.com/store/professional-suit/",
                action: async(page)=>{
                    //const bugAction = page.locator('#submit').hasText('Post Comment');
                    const bugAction = page.getByRole('button', { name: 'Post Comment' });
                    await bugAction.click();
                }
            },
            { //🐞 Bug #9: Sign In Button
                nombre: 'Sign In Button',
                tipo: 'Visual',
                respuesta: 'The Sign In button should be above the footer',
                urlBug:"https://academybugs.com/store/professional-suit/",
                action: async(page)=>{
                    //const bugAction = page.locator('.ec_login_widget_button ec-widget-login');
                    const bugAction = page.getByRole('button', { name: 'SIGN IN' });
                    await bugAction.click();
                }
            },
            { //🐞 Bug #11: Russian Text
                nombre: 'Russian Text',
                tipo: 'Content',
                respuesta: 'The text under the New User section is in English',
                urlBug:"https://academybugs.com/account/?ec_page=login&account_error=login_failed",
                action: async(page)=>{
                    const bugAction = page.locator('.ec_account_subheader.untranslated-russian');
                    await bugAction.click();
                }
            },
            { //🐞 Bug #12: Password Label
                nombre: 'Password Label',
                tipo: 'Visual',
                respuesta: 'The Password label should aligned to the left',
                urlBug:"https://academybugs.com/account/?ec_page=login&account_error=login_failed",
                action: async(page)=>{
                    //const bugAction = page.locator('element');
                    await page.goto("https://academybugs.com/account/?ec_page=login&account_error=login_failed");
                    const bugAction = page.getByText('Password*'); //page.getByRole('button', { name: 'Password*' });
                    await bugAction.click();
                }
            },
            { //🐞 Bug #13: Retrieve Password
                nombre: 'Retrieve Password',
                tipo: 'Visual',
                respuesta: 'The Password label should aligned to the left',
                urlBug:"https://academybugs.com/account/?ec_page=login&account_error=login_failed",
                action: async(page)=>{
                    //const bugAction = page.locator('element');
                    await page.goto("https://academybugs.com/account/?ec_page=forgot_password");
                    const bugAction = page.getByRole('button', { name: 'RETRIEVE PASSWORD' });
                    await page.getByRole('textbox', { name: 'Email', exact: true }).fill('test_dash@mail.com');
                    await bugAction.click();
                }
            },
            { //🐞 Bug #13: Sign In Button | Sign In Page
                nombre: 'Sign In Button | Sign In Page',
                tipo: 'NA',
                respuesta: 'NA',
                urlBug:"https://academybugs.com/account/?ec_page=login&account_error=login_failed",
                action: async(page)=>{
                    await page.goto("https://academybugs.com/account/?ec_page=login&account_error=login_failed");
                    const bugAction = page.getByRole('button', { name: 'SIGN IN' });
                    await page.getByRole('textbox', { name: 'Email Address*' }).fill('testing_dash@mail.com');
                    await page.locator('#ec_account_login_password').fill('132456789');
                    await bugAction.click();
                }
            },
            { //🐞 Bug #14: Billing Address Information
                nombre: 'Billing Address Information',    
                tipo: 'Performance',
                respuesta: 'The Billing Address section shows appropriate info',
                urlBug:"https://academybugs.com/account/?ec_page=dashboard",
                action: async(page)=>{
                    //await page.goto("https://academybugs.com/account/?ec_page=dashboard");
                    await page.goto("https://academybugs.com/account/?ec_page=dashboard&account_success=login_success");
                    //await console.log("🥑 → Página accedida correctamente.")
                    //const bugAction = page.locator('#ec_account_dashboard span');
                    //const bugAction = page.locator("#ec_account_dashboard > div.ec_account_left > div:nth-child(6) > span");
                    const bugAction = page.locator('.academy-bug-18');
                    //*[@id="ec_account_dashboard"]/div[2]/div[6]/span
                    await bugAction.click();
                }
            },
            
            { //🐞 Bug #17: Product Page Not Loading
                nombre: 'Product Page Not Loading',
                tipo: 'Performance',
                respuesta: 'The product in the Hot Item section is properly loaded and displayed',
                urlBug:"https://academybugs.com/anchor-bracelet/",
                action: async(page)=>{
                    await page.goto("https://academybugs.com/anchor-bracelet/");
                    const bugAction = page.locator('.ec_cart_billing_info_update_loader.academy-bug-19');
                    await bugAction.click({ force: true });
                }
            },
            { //🐞 Bug #18: Order History Page
                nombre: 'Order History Page',
                tipo: 'Performance',
                respuesta: 'Your Order History section shows appropriate info',
                urlBug:"https://academybugs.com/account/?ec_page=orders",
                action: async(page)=>{
                    await page.goto("https://academybugs.com/account/?ec_page=orders");
                    /*await page.evaluate(() => {
                        const el = document.querySelector('.ec_cart_billing_info_update_loader.academy-bug17');
                        if (el) el.click();
                    });*/
                    //const bugAction = page.locator('.ec_cart_billing_info_update_loader.academy-bug17');
                    const bugAction = page.locator("span[class*='billing_info_update_loader']");
                    await bugAction.click({ force: true });
                }
            },
            { //🐞 Bug #19: Price Filter
                nombre: 'Price Filter',
                tipo: 'Functional',
                respuesta: 'A list of products in the selected price range is shown',
                urlBug:"https://academybugs.com/store/?perpage=25&pricepoint=5",
                action: async(page)=>{
                    const bugAction = page.locator('Greater Than $299.99 (1)');
                    //div mayor → ec_pricepoint_widget
                    await bugAction.click();
                }
            },
            { //🐞 Bug #20: Cart Total Amount
                nombre: 'Cart Total Amount',
                tipo: 'Functional',
                respuesta: 'The grand total is equal to the sum of all products in the cart',
                urlBug:"https://academybugs.com/my-cart/",
                action: async(page)=>{
                    const bugAction = page.locator('#ec_cart_total');
                    await bugAction.click();
                }
            },
            { //🐞 Bug #21: Cart Product Increment Update
                nombre: 'Cart Product Increment Update',
                tipo: 'NA',
                respuesta: 'NA',
                urlBug:"https://academybugs.com/my-cart/",
                action: async(page)=>{
                    const bugAction = page.locator('#ec_cartitem_update_2003288'); //Botón 'update'
                    //.ec_plus_column //Botón '+'
                    //#ec_quantity_2003287 //valor del contador

                    await bugAction.click();
                }
            },
            /*{ //🐞 Bug #22: Cart Button Return
                nombre: 'Cart Button Return',
                tipo: 'Content',
                respuesta: 'The caption of the',
                urlBug:"https://academybugs.com/my-cart/",
                action: async(page)=>{
                    const bugAction = page.locator('.ec_cart_empty_button academy-bug');
                    await bugAction.click();
                }
            },*/
            { //🐞 Bug #23: Image Space Underneath
                nombre: 'Image Space Underneath',
                tipo: 'Visual',
                respuesta: 'Item images have no space underneath',
                urlBug:"https://academybugs.com/store/all-items/",
                action: async(page)=>{
                    await page.goto("https://academybugs.com/store/all-items/");
                    const bugAction = page.locator('#ec_product_image_effect_4881370');
                    await bugAction.click();
                }
            },
            /*{ //🐞 Bug #24: Description
                nombre: 'name',
                tipo: 'NA',
                respuesta: 'NA',
                urlBug:"https://academybugs.com/find-bugs/",
                action: async(page)=>{
                    const bugAction = page.locator('element');
                    await bugAction.click();
                }
            },*/
            /*{ //🐞 Bug #25: Description
                nombre: 'name',
                tipo: 'NA',
                respuesta: 'NA',
                urlBug:"https://academybugs.com/find-bugs/",
                action: async(page)=>{
                    const bugAction = page.locator('element');
                    await bugAction.click();
                }
            },*/
            { //🐞 Bug #10: Sign In Page
                nombre: 'Sign In Page',
                tipo: 'NA',
                respuesta: 'NA',
                urlBug:"https://academybugs.com/account/?ec_page=login&account_error=login_failed",
                action: async(page)=>{
                    const bugAction = page.locator('#wpeasycart_account_holder');
                    await bugAction.click();
                }
            },
            /*{ //🐞 Bug #15: User Register Page
                nombre: 'name',
                tipo: 'NA',
                respuesta: 'NA',
                urlBug:"https://academybugs.com/account/?ec_page=register",
                action: async(page)=>{
                    const bugAction = page.locator('element');
                    await bugAction.click();
                }
            },*/
        ];

        // 📚 Variables de bugs
        for (let i = 0; i < bugs.length; i++) {
            const { nombre, tipo, respuesta, action, urlBug } = bugs[i];
            try {
                console.log(`🔎 → Ejecutando bug #${i + 1} - ${nombre}`);
                await action(page);
                await bugInformation(page, i, nombre, tipo, respuesta, urlBug);
            } catch (error) {
                console.error(`⛔ → Error en bug #${i + 1}:`, error);
            }
        }
    });
});