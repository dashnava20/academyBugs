// utils/bugInformation.js
            
export async function bugInformation(page, expectedCount, nombreBug, tipoBug, respuesta, academyBugId) {
    await page.waitForLoadState();

    if (await page.getByRole('heading', { name: 'You found a crash bug,' }).isVisible().catch(()=>false)) {
        console.log('✅ → Popup Crash: visible. Continuando en 7 segundos...');
        await page.waitForTimeout(7000);
    } else {
        console.log('⛔ → Popup Crash: no visible. Continuando...');
    }

    const bugPopup = page.locator('#bug-popup');
    try {
        await bugPopup.waitFor({ state: 'visible', timeout: 10000 });
        console.log('✅ → Popup Cuestionario: visible. Respondiendo...');
        await answerQuestionary(page, tipoBug, respuesta);

        const reportBtn = page.getByRole('button', { name: 'View Issue Report' });
        await reportBtn.click();
    } catch (err) {
        console.log('⛔ → Popup Cuestionario: no visible. Continuando...');
    }

    await closePopup(page, 'academy-custom-popup');
    await page.waitForLoadState();
    await closePopup(page, 'popmake-4393');
    await page.waitForLoadState();

    console.log(`🐞 → Bug "${academyBugId}" registrado correctamente\n`);
}

async function answerQuestionary(page, tipoBug, respuesta) {
    await page.locator(`input[type="radio"][value="${tipoBug}"]`).check();
    await page.getByText(respuesta).check();
    
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    await submitBtn.click();
    console.log('✅ → Popup Cuestionario: respondido. Mostrando reporte...');
}

async function closePopup(page, id) {
    const popup = await page.locator(`#${id}`, { timeout: 6000 });
    const isVisible = await popup.isVisible().catch(() => false);

    const popupMessages = {
        'academy-custom-popup': 'Reporte del Bug',
        'popmake-4393': 'Bugs Pendientes'
    };
    if (!isVisible) {
        if (popupMessages[id]) {
            console.log(`⛔ → Popup ${popupMessages[id]}: no visible. Continuando...`);
        } else {
            console.log(`⛔ → Popup ${id} - no visible. Continuando...`); //Mensaje genérico
        }
        return;
    }

    if (popupMessages[id]) console.log(`✅ → Popup ${popupMessages[id]}: visible. Intentando cerrar...`);
    try {
        const closeBtn = popup.locator('.pum-close.popmake-close');
        await closeBtn.click({ timeout: 2000 });
        await popup.waitFor({ state: 'hidden', timeout: 2000 });
        console.log(`✅ → Popup ${popupMessages[id]}: cerrado. Continuando...`);
    } catch (err) {
        console.warn(`⛔ → No se pudo cerrar el popup ${id}: ${err.message}`);
    }
}
