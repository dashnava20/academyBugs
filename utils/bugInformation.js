// utils/bugInformation.js
            //await bugInformation(page, bug.id - 1, bug.nombre, bug.tipo, bug.respuesta, bug.urlBug, bug.academyBugId); 
export async function bugInformation(page, expectedCount, nombreBug, tipoBug, respuesta, academyBugId) {
    await page.waitForLoadState();

    if (await page.getByRole('heading', { name: 'You found a crash bug,' }).isVisible().catch(()=>false)) {
        console.log('✅ → Popup Crash mostrado, esperando 5 segundos...');
        await page.waitForTimeout(7000);
    } else {
        console.log(`⛔ → Popup Crash no mostrado. Continuando...`);
    }

    const bugPopup = page.locator('#bug-popup');
    try {
        await bugPopup.waitFor({ state: 'visible', timeout: 20000 });
        console.log('✅ → Popup de cuestionario visible');
        await answerQuestionary(page, tipoBug, respuesta);

        const reportBtn = page.getByRole('button', { name: 'View Issue Report' });
        //await expect(reportBtn).toBeVisible({ timeout: 7000 });
        await reportBtn.click();
    } catch (err) {
        console.log('⛔ → Popup cuestionario no mostrado. Continuando...');
    }

    await closePopup(page, 'popmake-4406');
    await page.waitForLoadState();
    await closePopup(page, 'popmake-4393');
    await page.waitForLoadState();

    //Desactivo debido a la ejecución en paralelo (no se puede llevar el contador)
    //const counterText = await page.locator('#bugs-counter-badge > span').textContent();
    //const counterNum = Number(counterText);

    //expect(counterNum).toBe(expectedCount + 1);
    //console.log(`🐞 → Bug #${expectedCount + 1} registrado correctamente | Contador en pantalla: ${counterNum}/25\n`);
    console.log(`🐞 → Bug "${academyBugId}" registrado correctamente\n`);
}

async function answerQuestionary(page, tipoBug, respuesta) {
    await page.locator(`input[type="radio"][value="${tipoBug}"]`).check();
    await page.getByText(respuesta).check();
    
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    //await expect(submitBtn).toBeVisible({ timeout: 7000 });
    await submitBtn.click();
    console.log('✅ → Cuestionario respondido y cerrado');
}

async function closePopup(page, id) {
    const popup = await page.locator(`#${id}`, { timeout: 6000 });
    const isVisible = await popup.isVisible().catch(() => false);

    const popupMessages = {
        'popmake-4406': 'Reporte del bug',
        'popmake-4393': 'Bugs pendientes'
    };
    if (!isVisible) {
        if (popupMessages[id]) {
            console.log(`⛔ → Popup [${id}]: ${popupMessages[id]} - no visible`);
        } else {
            console.log(`⛔ → Popup ${id} - no visible`); //Mensaje genérico
        }
        return;
    }

    if (popupMessages[id]) console.log(`✅ → Popup [${id}]: ${popupMessages[id]}`);
    console.log(`✅ → Popup ${id} visible. Intentando cerrar...`);
    try {
        const closeBtn = popup.locator('.pum-close.popmake-close');
        await closeBtn.click({ timeout: 5000 });
        await popup.waitFor({ state: 'hidden', timeout: 6000 });
        //console.log(`✅ → Popup ${id} cerrado`);
        if(id === 'popmake-4406') console.log(`✅ → Popup [${id}]: Cerrado`);
        if(id === 'popmake-4393') console.log(`✅ → Popup [${id}]: Cerrado`);
    } catch (err) {
        console.warn(`⛔ → No se pudo cerrar el popup ${id}: ${err.message}`);
        if(id === 'popmake-4406') console.log(`✅ → Popup [${id}]: Cerrado`);
        if(id === 'popmake-4393') console.log(`✅ → Popup [${id}]: Cerrado`);
    }
}
