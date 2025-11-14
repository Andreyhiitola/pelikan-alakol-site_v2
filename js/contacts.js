// ========================================
// КОНТАКТЫ - contacts.js
// Загружает данные из public/data/contacts.json
// ========================================

/**
 * Загружает данные контактов из JSON и отображает их на странице
 */
async function loadContacts() {
    try {
        console.log('📞 Загружаем контакты...');

        // Загружаем JSON файл
        const response = await fetch(CONFIG.getDataFile('contacts.json'));

        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }

        const data = await response.json();
        const contacts = data.contacts;

        console.log('✓ Контакты загружены:', contacts);

        // Отображаем телефоны
        displayPhones(contacts.phone);

        // Отображаем Telegram
        displayTelegram(contacts.telegram);

        // Отображаем WhatsApp
        displayWhatsApp(contacts.whatsapp);

        // Отображаем Email
        displayEmail(contacts.email);

        // Отображаем Instagram
        displayInstagram(contacts.instagram);

        // Отображаем веб-сайт
        displayWebsite(contacts.website);

        console.log('✓ Все контакты отображены');

    } catch (error) {
        console.error('❌ Ошибка при загрузке контактов:', error);
        showErrorMessage('Не удалось загрузить контакты. Проверьте консоль (F12)');
    }
}

/**
 * Отображает список телефонов
 */
function displayPhones(phones) {
    const phonesList = document.getElementById('phonesList');
    if (!phonesList || !phones) return;

    const html = phones.map(phone => `
        <div class="phone-item">
            <span class="phone-label">${phone.label}</span>
            <a href="tel:${phone.number}" class="phone-number">${phone.display}</a>
        </div>
    `).join('');

    phonesList.innerHTML = html;
    console.log('✓ Телефоны отображены:', phones.length);
}

/**
 * Отображает Telegram информацию
 */
function displayTelegram(telegram) {
    const element = document.getElementById('telegramInfo');
    if (!element || !telegram) return;

    element.innerHTML = `
        <a href="${telegram.url}" target="_blank" rel="noopener">
            <strong>@${telegram.username}</strong>
        </a>
        <p style="font-size: 0.9em; color: var(--text-dark); margin-top: 8px;">
            ${telegram.description}
        </p>
    `;
    console.log('✓ Telegram отображен');
}

/**
 * Отображает WhatsApp информацию
 */
function displayWhatsApp(whatsapp) {
    const element = document.getElementById('whatsappInfo');
    if (!element || !whatsapp) return;

    element.innerHTML = `
        <a href="${whatsapp.url}" target="_blank" rel="noopener">
            <strong>${whatsapp.number}</strong>
        </a>
        <p style="font-size: 0.9em; color: var(--text-dark); margin-top: 8px;">
            ${whatsapp.description}
        </p>
    `;
    console.log('✓ WhatsApp отображен');
}

/**
 * Отображает Email информацию
 */
function displayEmail(email) {
    const element = document.getElementById('emailInfo');
    if (!element || !email) return;

    element.innerHTML = `
        <a href="${email.url}">
            <strong>${email.address}</strong>
        </a>
        <p style="font-size: 0.9em; color: var(--text-dark); margin-top: 8px;">
            ${email.description}
        </p>
    `;
    console.log('✓ Email отображен');
}

/**
 * Отображает Instagram информацию
 */
function displayInstagram(instagram) {
    const element = document.getElementById('instagramInfo');
    if (!element || !instagram) return;

    element.innerHTML = `
        <a href="${instagram.url}" target="_blank" rel="noopener">
            <strong>${instagram.username}</strong>
        </a>
        <p style="font-size: 0.9em; color: var(--text-dark); margin-top: 8px;">
            ${instagram.description}
        </p>
    `;
    console.log('✓ Instagram отображен');
}

/**
 * Отображает информацию о веб-сайте
 */
function displayWebsite(website) {
    const element = document.getElementById('websiteInfo');
    if (!element || !website) return;

    element.innerHTML = `
        <a href="${website.url}" target="_blank" rel="noopener">
            <strong>${website.domain}</strong>
        </a>
        <p style="font-size: 0.9em; color: var(--text-dark); margin-top: 8px;">
            ${website.description}
        </p>
    `;
    console.log('✓ Website отображен');
}

/**
 * Показывает сообщение об ошибке
 */
function showErrorMessage(message) {
    const contactsSection = document.getElementById('contacts');
    if (contactsSection) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'background: #fee; border: 1px solid #fcc; padding: 15px; border-radius: 5px; color: #c33; margin: 10px 0;';
        errorDiv.textContent = message;
        contactsSection.parentNode.insertBefore(errorDiv, contactsSection.nextSibling);
    }
}

// Загружаем контакты когда страница полностью загружена
document.addEventListener('DOMContentLoaded', loadContacts);
console.log('✓ contacts.js загружен');
