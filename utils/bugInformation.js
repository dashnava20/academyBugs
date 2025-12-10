// utils/bugInformation.js
            
export async function bugInformation(page, tipoBug, respuesta, academyBugId) {
    await page.waitForLoadState();

    if (await page.getByRole('heading', { name: 'You found a crash bug,' }).isVisible().catch(()=>false)) {
        console.log('✅ → Popup Crash: visible. Continuando en 7 segundos...');
        await page.waitForTimeout(7000);
    } else {
        console.log('⛔ → Popup Crash: oculto. Continuando...');
    }

    const bugPopup = page.locator('#bug-popup'); // Selector del popup del cuestionario
    try {
        await bugPopup.waitFor({ state: 'visible', timeout: 4000 });
        console.log('✅ → Popup Cuestionario: visible. Respondiendo...');

        await answerQuestionary(page, tipoBug, respuesta);
        
        const reportBtn = page.getByRole('button', { name: 'View Issue Report' });
        await reportBtn.click();

    } catch (err) {
        console.log('⛔ → Popup Cuestionario: oculto. Continuando...');
    }

    await closePopup(page, '.academy-custom-popup'); // Selector del popup de reporte
    await page.waitForLoadState();
    await page.waitForTimeout(2000);
    await closePopup(page, '#popmake-4393'); // Selector del popup de bugs pendientes
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
    
    //console.log(`🔍 → Verificando popup ${id}...`);
    const popup = await page.locator(`${id}`);
    const exists = await popup.count() > 0;

    const popupMessages = {
        '.academy-custom-popup': 'Reporte del Bug',
        '#popmake-4393': 'Bugs Pendientes'
    };

    const label = popupMessages[id] ?? id;
    const isVisible = await popup.isVisible();

    if (!exists) {
        console.log(`⛔ → Popup ${label}: no existe. Continuando...`);
        return;
    }

    if (!isVisible) {
        console.log(`⛔ → Popup ${label}: oculto. Continuando...`);
        return;
    }

    //console.log(`${exists ? '✅' : '⛔'} → Popup ${label}: existe.`);
    console.log(`✅ → Popup ${label}: visible. Intentando cerrar...`);
    
    try {
        const closeBtn = popup.locator('.pum-close.popmake-close');
        await closeBtn.click({ timeout: 2000 });
        await popup.waitFor({ state: 'hidden', timeout: 3000 });
        console.log(`✅ → Popup ${label}: cerrado. Continuando...`);
    } catch (err) {
        console.warn(`⛔ → No se pudo cerrar el popup ${label}: ${err.message}`);
    }
}
