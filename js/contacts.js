// ✅ ФИНАЛЬНАЯ ВЕРСИЯ JS/CONTACTS.JS
// (Крестик в одной строке со "Свяжитесь с нами" + WhatsApp поддержка)

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
    
    // 1. ТЕЛЕФОНЫ (НОВАЯ ЛОГИКА ДЛЯ JSON)
    let phonesHtml = '';
    if(info.phones) {
        info.phones.forEach(p => {
            // ✅ Определяем WhatsApp по полю whatsapp ИЛИ иконке
            const isWhatsapp = p.whatsapp || (p.icon && p.icon.includes('whatsapp'));
            
            // Иконка
            let icon = isWhatsapp 
                ? '<i class="fab fa-whatsapp" style="color:#25D366"></i>' 
                : '<i class="fas fa-phone-alt"></i>';
            
            // Ссылка (приоритет whatsapp_url из JSON)
            let link = '';
            if (isWhatsapp && p.whatsapp_url) {
                link = p.whatsapp_url;
            } else if (isWhatsapp) {
                link = `https://wa.me/${p.number.replace(/\D/g, '')}`;
            } else {
                link = `tel:${p.number}`;
            }
            
            // Target и title
            let target = isWhatsapp ? '_blank' : '_self';
            let title = isWhatsapp ? 'Открыть WhatsApp' : 'Позвонить';
            
            phonesHtml += `
            <div class="phone-item">
                <span class="phone-label">${icon} ${p.label}:</span> 
                <a href="${link}" class="phone-number" target="${target}" title="${title}">
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
    const mapIcon = '<i class="fas fa-map-marked-alt"></i>';

    if (iconClass === 'fa-umbrella-beach') {
        // === БАЗА ОТДЫХА (Встроенная карта) ===
        buttonsHtml += `<button onclick="if(window.closeContactsModal) closeContactsModal(); if(window.openMapModal) openMapModal();" class="contact-btn" style="${mapBtnStyle}">${mapIcon} Показать на карте</button>`;
    } else {
        // === ОФИС В ГОРОДЕ (Google Maps) ===
        buttonsHtml += `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.address)}" target="_blank" class="contact-btn" style="${mapBtnStyle}">${mapIcon} Показать на карте</a>`;
    }
    
    // Telegram Бот (общая кнопка)
    buttonsHtml += `<a href="https://t.me/Pelican_alacol_hotel_bot" target="_blank" class="contact-btn" style="margin-top: 10px; background: linear-gradient(135deg, #0088cc, #005f8f);"><i class="fab fa-telegram-plane"></i> Telegram бот</a>`;

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

// ✅ КРЕСТИК: добавляем в модалку при открытии
if (typeof window.openContactsModal === 'undefined') {
    window.openContactsModal = function() {
        const modal = document.getElementById('contactsModal');
        if(modal) {
            modal.classList.add('active');
            
            // ✅ ДОБАВЛЯЕМ/ОБНОВЛЯЕМ КРЕСТИК в правом верхнем углу
            let closeBtn = modal.querySelector('.modal-close-btn');
            if (!closeBtn) {
                closeBtn = document.createElement('button');
                closeBtn.className = 'modal-close-btn';
                closeBtn.innerHTML = '×';
                closeBtn.style.cssText = `
                    position: absolute !important;
                    top: 28px !important;      /* ← В ОДНУ СТРОКУ со "Свяжитесь с нами" */
                    right: 20px !important;
                    width: 36px !important;
                    height: 36px !important;
                    background: rgba(255,255,255,0.95) !important;
                    border: 2px solid #ddd !important;
                    border-radius: 50% !important;
                    font-size: 22px !important;
                    font-weight: bold !important;
                    color: #666 !important;
                    cursor: pointer !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    z-index: 10001 !important;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
                    line-height: 1 !important;
                `;
                closeBtn.onclick = () => window.closeContactsModal();
                modal.appendChild(closeBtn);
            }
            
            loadContacts(); 
        }
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
