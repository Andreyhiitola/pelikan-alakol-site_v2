// ✅ ФИНАЛЬНАЯ ВЕРСИЯ JS/CONTACTS.JS
// (Одинаковые иконки "Карта" для обоих кнопок)

async function loadContacts() {
    try {
        const response = await fetch('contacts.json');
        
        if (!response.ok) throw new Error('Ошибка загрузки contacts.json');
        const data = await response.json();
        
        // Ищем контейнер для карточек
        const grid = document.getElementById('contactGridModal') || document.querySelector('.contact-grid');
        
        if(grid) {
            grid.innerHTML = ''; // Очищаем перед рендером
            
            // Генерируем карточки
            if(data.contacts && data.contacts.office) {
                grid.appendChild(createLocationCard(data.contacts.office, 'fa-building'));
            }
            if(data.contacts && data.contacts.resort) {
                grid.appendChild(createLocationCard(data.contacts.resort, 'fa-umbrella-beach'));
            }
        } else {
            console.warn('Контейнер contactGridModal не найден!');
        }
    } catch (error) {
        console.error('Ошибка контактов:', error);
    }
}

// Функция создания HTML-карточки
function createLocationCard(info, iconClass) {
    const card = document.createElement('div');
    card.className = 'contact-card';
    
    // 1. ТЕЛЕФОНЫ
    let phonesHtml = '';
    if(info.phones) {
        info.phones.forEach(p => {
            let icon = p.isWhatsapp ? '<i class="fab fa-whatsapp" style="color:#25D366"></i>' : '<i class="fas fa-phone-alt"></i>';
            let link = p.isWhatsapp ? `https://wa.me/${p.number.replace(/\D/g, '')}` : `tel:${p.number}`;
            
            phonesHtml += `
            <div class="phone-item">
                <span class="phone-label">${icon} ${p.label}:</span> 
                <a href="${link}" class="phone-number" target="${p.isWhatsapp ? '_blank' : '_self'}" title="Позвонить">
                    ${p.display}
                </a>
            </div>`;
        });
    }

    // 2. АДРЕС И ГРАФИК
    let addressHtml = `<p><strong>Адрес:</strong><br>${info.address}</p>`;
    if (info.schedule) addressHtml += `<p><strong>График:</strong><br>${info.schedule}</p>`;
    if (info.gps && iconClass === 'fa-umbrella-beach') addressHtml += `<p><strong>GPS:</strong> ${info.gps}</p>`;

    // 3. КНОПКИ
    let buttonsHtml = '';
    
    // Единый стиль и иконка для кнопок карты
    const mapBtnStyle = "background: linear-gradient(135deg, #4ECDC4, #44A08D);";
    // ИСПОЛЬЗУЕМ ОДНУ И ТУ ЖЕ ИКОНКУ: fa-map-marked-alt (Карта с меткой)
    const mapIcon = '<i class="fas fa-map-marked-alt"></i>';

    if (iconClass === 'fa-umbrella-beach') {
        // === БАЗА ОТДЫХА (Встроенная карта) ===
        buttonsHtml += `<button onclick="if(window.closeContactsModal) closeContactsModal(); if(window.openMapModal) openMapModal();" class="contact-btn" style="${mapBtnStyle}">${mapIcon} Показать на карте</button>`;
    } else {
        // === ОФИС В ГОРОДЕ (Google Maps) ===
        buttonsHtml += `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.address)}" target="_blank" class="contact-btn" style="${mapBtnStyle}">${mapIcon} Показать на карте</a>`;
    }
    
    // Telegram Бот (общая кнопка)
    buttonsHtml += `<a href="https://t.me/pelikanalacol" target="_blank" class="contact-btn" style="margin-top: 10px; background: linear-gradient(135deg, #0088cc, #005f8f);"><i class="fab fa-telegram-plane"></i> Telegram бот</a>`;

    // Сборка
    card.innerHTML = `
        <h3><i class="fas ${iconClass}"></i> ${info.title}</h3>
        <div class="contact-info">
            ${addressHtml}
            <div style="margin-top:15px; border-top:1px solid #eee; padding-top:10px">
                ${phonesHtml}
            </div>
            <p style="margin-top:10px">
                <i class="fas fa-envelope"></i> <a href="mailto:${info.email}">${info.email}</a>
            </p>
        </div>
        <div class="contact-buttons" style="margin-top: 20px;">
            ${buttonsHtml}
        </div>
    `;
    return card;
}

// Глобальные функции для модального окна
if (typeof window.openContactsModal === 'undefined') {
    window.openContactsModal = function() {
        const modal = document.getElementById('contactsModal');
        if(modal) {
            modal.classList.add('active');
            loadContacts(); 
        }
    };
}

if (typeof window.closeContactsModal === 'undefined') {
    window.closeContactsModal = function() {
        const modal = document.getElementById('contactsModal');
        if(modal) modal.classList.remove('active');
    };
}

// Слушатель клика на фон
if (!window.contactsClickListenerAdded) {
    document.addEventListener('click', (e) => {
        if (e.target.id === 'contactsModal') {
            if(window.closeContactsModal) window.closeContactsModal();
        }
    });
    window.contactsClickListenerAdded = true;
}
