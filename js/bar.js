// ============================================================================
// bar.js - Интеграция меню бара с Telegram ботом "Пеликан Алаколь"
// ============================================================================

// Конфигурация
const CONFIG = {
   // API_URL: 'https://bar.pelikan-alakol.kz/api/order', // URL вашего webhook сервера
    // Для локальной разработки используйте: 'http://localhost:8080/api/order'
    API_URL: 'http://85.192.40.138:8080/api/order',
    MENU_JSON: 'barzakaz.json'
};

// Состояние корзины
let cart = [];
let menuData = [];

// ============================================================================
// ЗАГРУЗКА МЕНЮ
// ============================================================================

/**
 * Загружает меню из JSON файла
 */
async function loadMenuData() {
    try {
        const response = await fetch(CONFIG.MENU_JSON);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        menuData = await response.json();
        
        // Добавляем ID к блюдам, если их нет
        menuData = menuData.map((item, index) => ({
            id: item.id || `dish-${index}`,
            name: item.name,
            category: item.category,
            price: item.price,
            image: item.image || 'img/placeholder.jpg',
            description: item.description || ''
        }));
        
        renderMenu(menuData);
    } catch (error) {
        console.error('Ошибка загрузки меню:', error);
        const container = document.getElementById('menu');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #FFD700;">
                    <h2>❌ Ошибка загрузки меню</h2>
                    <p>${error.message}</p>
                    <button onclick="loadMenuData()" class="add-btn" style="margin-top: 20px;">
                        🔄 Попробовать снова
                    </button>
                </div>
            `;
        }
    }
}

/**
 * Отображает меню на странице
 */
function renderMenu(data) {
    const container = document.getElementById('menu');
    if (!container) return;

    container.innerHTML = '';

    // Группируем по категориям
    const categories = data.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    // Рендерим каждую категорию
    Object.keys(categories).forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';

        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category;
        categoryDiv.appendChild(categoryTitle);

        const grid = document.createElement('div');
        grid.className = 'menu-grid';

        categories[category].forEach(item => {
            const card = createDishCard(item);
            grid.appendChild(card);
        });

        categoryDiv.appendChild(grid);
        container.appendChild(categoryDiv);
    });
}

/**
 * Создаёт карточку блюда
 */
function createDishCard(item) {
    const card = document.createElement('div');
    card.className = 'dish-card';

    card.innerHTML = `
        <img 
            src="${item.image || 'img/placeholder.jpg'}" 
            class="dish-img" 
            alt="${item.name.replace(/"/g, '&quot;')}"
            onerror="this.src='img/placeholder.jpg'"
        >
        <div class="dish-info">
            <h3 class="dish-name">${item.name}</h3>
            ${item.description ? `<p class="dish-description">${item.description}</p>` : ''}
            <p class="dish-price">${item.price.toLocaleString('ru-RU')} ₸</p>
            <button 
                class="add-btn" 
               onclick="addToCart('${item.id}', '${item.name.replace(/'/g, "\\'")}', ${item.price})"
            >
                <i class="fas fa-cart-plus"></i> Добавить
            </button>
        </div>
    `;

    return card;
}

// ============================================================================
// КОРЗИНА
// ============================================================================

/**
 * Добавляет товар в корзину
 */
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();
    saveCartToLocalStorage();
    showNotification(`${name} добавлен в корзину!`);
}

/**
 * Удаляет товар из корзины
 */
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    saveCartToLocalStorage();
}

/**
 * Изменяет количество товара
 */
function updateQuantity(id, newQuantity) {
    const item = cart.find(i => i.id === id);
    
    if (!item) return;

    if (newQuantity <= 0) {
        removeFromCart(id);
    } else {
        item.quantity = newQuantity;
        updateCart();
        saveCartToLocalStorage();
    }
}

/**
 * Очищает всю корзину
 */
function clearCart() {
    if (cart.length === 0) return;

    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        cart = [];
        updateCart();
        localStorage.removeItem('pelikan_cart');
        showNotification('Корзина очищена');
    }
}

/**
 * Подсчитывает итоговую сумму
 */
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Обновляет отображение корзины
 */
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');
    const submitButton = document.querySelector('#order-form button[type="submit"]');

    if (!cartItems || !totalElement) return;

    // Обновляем список товаров
    if (cart.length === 0) {
        cartItems.innerHTML = '<li class="empty-cart">Корзина пуста</li>';
        totalElement.textContent = 'Итого: 0 ₸';
        if (submitButton) submitButton.disabled = true;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <li>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price.toLocaleString('ru-RU')} ₸ × ${item.quantity}</div>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <button 
                    class="btn-quantity" 
                    onclick="updateQuantity('${item.id}', ${item.quantity - 1})"
                >−</button>
                <span style="min-width: 30px; text-align: center; font-weight: bold;">${item.quantity}</span>
                <button 
                    class="btn-quantity" 
                    onclick="updateQuantity('${item.id}', ${item.quantity + 1})"
                >+</button>
                <button 
                    class="remove-btn" 
                    onclick="removeFromCart('${item.id}')"
                    title="Удалить"
                >🗑️</button>
            </div>
        </li>
    `).join('');

    // Обновляем итоговую сумму
    const total = calculateTotal();
    totalElement.textContent = `Итого: ${total.toLocaleString('ru-RU')} ₸`;

    // Активируем кнопку заказа
    if (submitButton) submitButton.disabled = false;
}

/**
 * Сохраняет корзину в localStorage
 */
function saveCartToLocalStorage() {
    localStorage.setItem('pelikan_cart', JSON.stringify(cart));
}

/**
 * Загружает корзину из localStorage
 */
function loadCartFromLocalStorage() {
    const saved = localStorage.getItem('pelikan_cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
            updateCart();
        } catch (e) {
            console.error('Ошибка загрузки корзины:', e);
            cart = [];
        }
    }
}

// ============================================================================
// ОФОРМЛЕНИЕ ЗАКАЗА
// ============================================================================

/**
 * Обрабатывает отправку формы заказа
 */

/**
 * Показывает сообщение об успешном заказе
 */
function showSuccessMessage(orderId, telegram) {
    const message = telegram 
        ? `
            <div style="text-align: center; padding: 20px;">
                <h2 style="color: #4CAF50; margin-bottom: 15px;">✅ Заказ успешно оформлен!</h2>
                <p style="font-size: 1.2em; margin-bottom: 10px;">Номер заказа: <strong>#${orderId}</strong></p>
                <p>Вы получите уведомление в Telegram.</p>
                <p>Для проверки статуса напишите боту <strong>@pelikan_alakol_bot</strong>:</p>
                <p style="font-family: monospace; background: #f0f0f0; padding: 10px; border-radius: 5px; color: #333;">
                    /status ${orderId}
                </p>
                <p style="margin-top: 15px; color: #666;">💳 Оплата при получении в баре.</p>
            </div>
        `
        : `
            <div style="text-align: center; padding: 20px;">
                <h2 style="color: #4CAF50; margin-bottom: 15px;">✅ Заказ успешно оформлен!</h2>
                <p style="font-size: 1.2em; margin-bottom: 10px;">Номер заказа: <strong>#${orderId}</strong></p>
                <p>Запомните номер заказа для отслеживания статуса.</p>
                <p style="margin-top: 15px; color: #666;">💳 Оплата при получении в баре.</p>
            </div>
        `;

    // Создаём модальное окно с сообщением
    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.innerHTML = `
        <div class="notification-modal-content">
            ${message}
            <button onclick="this.parentElement.parentElement.remove()" class="add-btn" style="margin-top: 20px;">
                Закрыть
            </button>
        </div>
    `;
    document.body.appendChild(modal);

    // Автоматически удаляем через 10 секунд
    setTimeout(() => modal.remove(), 10000);
}

/**
 * Показывает/скрывает индикатор загрузки
 */
function showLoading(show) {
    const loader = document.getElementById('loading-overlay');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }

    const submitBtn = document.querySelector('#order-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = show;
        submitBtn.textContent = show ? 'Отправка...' : 'Оформить заказ';
    }
}

/**
 * Показывает уведомление
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🍽 Инициализация системы заказов бара...');

    // Загружаем меню
    loadMenuData();

    // Загружаем корзину из localStorage
    loadCartFromLocalStorage();

    // Привязываем обработчик формы
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }

    // Обработчик кнопки очистки корзины
    const clearBtn = document.querySelector('.clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCart);
    }

    console.log('✅ Система заказов готова к работе!');
});

// Экспортируем функции для использования в HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
// ===== ОТПРАВКА ЧЕРЕЗ TELEGRAM MINI APP =====
function sendOrderViaTelegram(order, orderText) {
    try {
        // Отправляем данные боту через WebApp API
        window.Telegram.WebApp.sendData(JSON.stringify(order));
        
        // Показываем успешное сообщение
        showSuccessNotification(order.orderId);
        
        // Очищаем корзину
        cart = [];
        updateCart();
        
    } catch (error) {
        console.error('Ошибка отправки через Telegram:', error);
        alert('Ошибка отправки заказа. Попробуйте через модалку.');
        showContactModal(order, orderText);
    }
}

function showSuccessNotification(orderId) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #27ae60, #229954);
        color: white;
        padding: 30px 40px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="font-size: 4em; margin-bottom: 15px;">✅</div>
        <h2 style="margin-bottom: 10px; font-size: 1.5em;">Заказ принят!</h2>
        <p style="font-size: 1.1em;">Заказ #${orderId}</p>
        <p style="margin-top: 15px; opacity: 0.9;">Мы уведомим вас когда заказ будет готов</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== МОДАЛКА С ВЫБОРОМ СВЯЗИ (ДЛЯ БРАУЗЕРА) =====
function showContactModal(order, orderText) {
    let modal = document.getElementById('contactModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'contactModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    const encodedText = encodeURIComponent(orderText);
    const whatsappUrl = `https://wa.me/77283330002?text=${encodedText}`;
    const telegramUrl = `https://t.me/Pelican_alacol_hotel_bot?text=${encodedText}`;
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>📋 Заказ #${order.orderId}</h2>
            <p style="font-size: 1.2em; margin: 15px 0;"><strong>Итого: ${order.total}₸</strong></p>
            
            <h3 style="margin: 25px 0 20px;">Выберите способ связи:</h3>
            
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <a href="${whatsappUrl}" class="contact-button whatsapp" target="_blank">
                    <span style="font-size: 2em;">📱</span>
                    <div>
                        <div style="font-size: 1.2em; font-weight: bold;">WhatsApp</div>
                        <div style="font-size: 0.9em; opacity: 0.8;">Отправить заказ</div>
                    </div>
                </a>
                
                <a href="${telegramUrl}" class="contact-button telegram" target="_blank">
                    <span style="font-size: 2em;">✈️</span>
                    <div>
                        <div style="font-size: 1.2em; font-weight: bold;">Telegram</div>
                        <div style="font-size: 0.9em; opacity: 0.8;">Открыть бота</div>
                    </div>
                </a>
                
                <a href="tel:+77283330002" class="contact-button phone">
                    <span style="font-size: 2em;">📞</span>
                    <div>
                        <div style="font-size: 1.2em; font-weight: bold;">Позвонить</div>
                        <div style="font-size: 0.9em; opacity: 0.8;">+7 (72833) 30002</div>
                    </div>
                </a>
            </div>
            
            <button onclick="closeContactModal()" class="close-button" style="margin-top: 25px;">
                Закрыть
            </button>
        </div>
    `;
    
    modal.style.display = 'flex';
    window.currentOrderText = orderText;
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) modal.style.display = 'none';
    cart = [];
    updateCart();
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) modal.style.display = 'none';
    cart = [];
    updateCart();
}



function formatOrderForTelegram(order) {
    let text = `🛎️ Новый заказ из бара\n\n`;
    text += `📋 Заказ #${order.orderId}\n`;
    text += `👤 ${order.name}\n`;
    text += `🏨 Комната: ${order.room}\n\n`;
    text += `🍽️ Заказ:\n`;
    
    order.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        text += `• ${item.name} x${item.quantity} - ${itemTotal}₸\n`;
    });
    
    text += `\n💰 Итого: ${order.total}₸`;
    return text;
}

function showTelegramOrderModal(order, orderText) {
    let modal = document.getElementById('telegramOrderModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'telegramOrderModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    const encodedText = encodeURIComponent(orderText);
    const telegramUrl = `https://t.me/Pelican_alacol_hotel_bot?text=${encodedText}`;
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>✅ Заказ сформирован!</h2>
            
            <div class="order-info">
                <p><strong>📋 Заказ #${order.orderId}</strong></p>
                <p><strong>💰 Итого: ${order.total} ₸</strong></p>
            </div>
            
            <div class="telegram-instructions">
                <h3>📱 Завершите оформление в Telegram</h3>
                
                <div class="steps">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-text">Нажмите "Открыть Telegram"</div>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-text">Откроется бот с готовым сообщением</div>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-text">Нажмите "Отправить" в Telegram</div>
                    </div>
                </div>
                
                <a href="${telegramUrl}" class="telegram-button" target="_blank">
                    📱 Открыть Telegram
                </a>
                
                <div class="alternative-method">
                    <p class="or-text">или</p>
                    <button onclick="copyOrderText()" class="copy-button">
                        📋 Скопировать текст
                    </button>
                    <p class="manual-hint">
                        <a href="https://t.me/Pelican_alacol_hotel_bot" target="_blank">
                            @Pelican_alacol_hotel_bot
                        </a>
                    </p>
                </div>
            </div>
            
            <button onclick="closeTelegramModal()" class="close-button">
                Закрыть
            </button>
        </div>
    `;
    
    modal.style.display = 'flex';
    window.currentOrderText = orderText;
}

function copyOrderText() {
    if (window.currentOrderText) {
        navigator.clipboard.writeText(window.currentOrderText).then(() => {
            alert('✅ Текст скопирован!\n\nОткройте Telegram и отправьте боту');
        }).catch(() => {
            prompt('Скопируйте текст:', window.currentOrderText);
        });
    }
}

function closeTelegramModal() {
    const modal = document.getElementById('telegramOrderModal');
    if (modal) modal.style.display = 'none';
    cart = [];
    updateCart();
    document.getElementById('order-form').reset();
}
async function handleOrderSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const room = document.getElementById('room').value.trim();
    
    if (!name || !room) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    if (cart.length === 0) {
        alert('Корзина пуста');
        return;
    }
    
    // Генерируем ID заказа
    const orderId = 'ORD' + Date.now().toString().slice(-6);
    
    // Формируем заказ
    const order = {
        orderId: orderId,
        name: name,
        room: room,
        items: cart,
        total: calculateTotal()
    };
    
    // Формируем текст для Telegram
    const orderText = formatOrderForTelegram(order);
    
    // ===== ОПРЕДЕЛЯЕМ ОТКУДА ЗАПУЩЕН =====
    const isTelegramApp = window.Telegram?.WebApp?.initData;
    
    if (isTelegramApp) {
        // TELEGRAM MINI APP - отправка через WebApp API
        sendOrderViaTelegram(order, orderText);
    } else {
        // БРАУЗЕР - модалка с выбором связи
        showContactModal(order, orderText);
    }
}

function formatOrderForTelegram(order) {
    let text = `🛎️ Новый заказ из бара\n\n`;
    text += `📋 Заказ #${order.orderId}\n`;
    text += `👤 ${order.name}\n`;
    text += `🏨 Комната: ${order.room}\n\n`;
    text += `🍽️ Заказ:\n`;
    
    order.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        text += `• ${item.name} x${item.quantity} - ${itemTotal}₸\n`;
    });
    
    text += `\n💰 Итого: ${order.total}₸`;
    return text;
}

function showTelegramOrderModal(order, orderText) {
    let modal = document.getElementById('telegramOrderModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'telegramOrderModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    const encodedText = encodeURIComponent(orderText);
    const telegramUrl = `https://t.me/Pelican_alacol_hotel_bot?text=${encodedText}`;
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>✅ Заказ сформирован!</h2>
            
            <div class="order-info">
                <p><strong>📋 Заказ #${order.orderId}</strong></p>
                <p><strong>💰 Итого: ${order.total} ₸</strong></p>
            </div>
            
            <div class="telegram-instructions">
                <h3>📱 Завершите оформление в Telegram</h3>
                
                <div class="steps">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-text">Нажмите "Открыть Telegram"</div>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-text">Откроется бот с готовым сообщением</div>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-text">Нажмите "Отправить" в Telegram</div>
                    </div>
                </div>
                
                <a href="${telegramUrl}" class="telegram-button" target="_blank">
                    📱 Открыть Telegram
                </a>
                
                <div class="alternative-method">
                    <p class="or-text">или</p>
                    <button onclick="copyOrderText()" class="copy-button">
                        📋 Скопировать текст
                    </button>
                    <p class="manual-hint">
                        <a href="https://t.me/Pelican_alacol_hotel_bot" target="_blank">
                            @Pelican_alacol_hotel_bot
                        </a>
                    </p>
                </div>
            </div>
            
            <button onclick="closeTelegramModal()" class="close-button">
                Закрыть
            </button>
        </div>
    `;
    
    modal.style.display = 'flex';
    window.currentOrderText = orderText;
}

function copyOrderText() {
    if (window.currentOrderText) {
        navigator.clipboard.writeText(window.currentOrderText).then(() => {
            alert('✅ Текст скопирован!\n\nОткройте Telegram и отправьте боту');
        }).catch(() => {
            prompt('Скопируйте текст:', window.currentOrderText);
        });
    }
}

function closeTelegramModal() {
    const modal = document.getElementById('telegramOrderModal');
    if (modal) modal.style.display = 'none';
    cart = [];
    updateCart();
    document.getElementById('order-form').reset();
}
