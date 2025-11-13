/* ============================================
   CONTACTS.JS - Загрузка контактов и карта
   ============================================ */

/**
 * Загрузка контактов из contacts.json
 */
async function loadContacts() {
    try {
        const data = await loadJSON('contacts');
        if (!data) {
            console.warn('Данные контактов не загружены');
            return;
        }
        displayContacts(data);
        initMap();
    } catch (error) {
        console.error('Ошибка загрузки контактов:', error);
    }
}

/**
 * Отображение контактной информации
 */
function displayContacts(data) {
    const container = document.getElementById('contactsInfo');
    if (!container) return;

    const contact = data.contacts[0] || {};

    container.innerHTML = `
        <div class="contact-section">
            <h3>📍 Адрес</h3>
            <p>${contact.address || 'озеро Алаколь, пос. Акши, Восточно-Казахстанская область'}</p>
        </div>

        <div class="contact-section">
            <h3>📞 Телефон</h3>
            ${contact.phones ? contact.phones.map(phone => `
                <p>
                    <strong>${phone.label}:</strong>
                    <a href="tel:${phone.number}" class="contact-link">${phone.number}</a>
                </p>
            `).join('') : '<p><a href="tel:+77472621234" class="contact-link">+7 (747) 262-12-34</a></p>'}
        </div>

        <div class="contact-section">
            <h3>📧 Email</h3>
            ${contact.email ? `
                <p>
                    <a href="mailto:${contact.email}" class="contact-link">${contact.email}</a>
                </p>
            ` : '<p><a href="mailto:pelikan@mail.ru" class="contact-link">pelikan@mail.ru</a></p>'}
        </div>

        ${contact.social ? `
            <div class="contact-section">
                <h3>🌐 Социальные сети</h3>
                <div class="social-links">
                    ${contact.social.instagram ? `
                        <a href="${contact.social.instagram}" target="_blank" class="social-link">
                            📱 Instagram
                        </a>
                    ` : ''}
                    ${contact.social.telegram ? `
                        <a href="${contact.social.telegram}" target="_blank" class="social-link">
                            ✈️ Telegram
                        </a>
                    ` : ''}
                    ${contact.social.whatsapp ? `
                        <a href="${contact.social.whatsapp}" target="_blank" class="social-link">
                            💬 WhatsApp
                        </a>
                    ` : ''}
                </div>
            </div>
        ` : ''}

        <div class="contact-section">
            <h3>🕐 Режим работы</h3>
            <p>${contact.workingHours || 'Круглосуточно'}</p>
        </div>
    `;

    addContactsStyles();
}

/**
 * Инициализация карты Leaflet
 */
function initMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;

    // Координаты озера Алаколь
    const lat = 45.955;
    const lon = 81.5714;

    try {
        const map = L.map('mapContainer').setView([lat, lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        // Маркер базы
        L.marker([lat, lon], {
            icon: L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            })
        }).addTo(map).bindPopup('<b>🐦 Пеликан Алаколь</b><br>озеро Алаколь, пос. Акши');

        console.log('✅ Карта инициализирована');
    } catch (error) {
        console.error('Ошибка инициализации карты:', error);
        mapContainer.innerHTML = '<p style="text-align: center; color: var(--text-light);">Карта недоступна</p>';
    }
}

/**
 * Добавление стилей для контактов
 */
function addContactsStyles() {
    if (document.getElementById('contacts-inline-styles')) return;

    const style = document.createElement('style');
    style.id = 'contacts-inline-styles';
    style.textContent = `
        .contact-section {
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-color);
        }

        .contact-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .contact-section h3 {
            margin: 0 0 0.75rem;
            font-size: 1.1rem;
            color: var(--primary-color);
        }

        .contact-section p {
            margin: 0.5rem 0;
            color: var(--text-light);
            line-height: 1.6;
        }

        .contact-link {
            color: var(--accent-color);
            text-decoration: none;
            font-weight: 500;
            transition: var(--transition);
        }

        .contact-link:hover {
            color: var(--primary-color);
            text-decoration: underline;
        }

        .social-links {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .social-link {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: var(--background-light);
            color: var(--primary-color);
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: var(--transition);
        }

        .social-link:hover {
            background: var(--primary-color);
            color: var(--white);
        }

        #mapContainer {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: var(--shadow-sm);
            margin-top: 2rem;
        }

        .leaflet-container {
            background: #e5e3df;
            font-family: var(--font-primary);
        }

        @media (max-width: 768px) {
            .social-links {
                flex-direction: column;
            }

            .social-link {
                width: 100%;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ contacts.js загружен');
