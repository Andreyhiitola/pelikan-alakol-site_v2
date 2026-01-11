// ============================================================================
// bar.js - Бар "Пеликан Алаколь"
// Меню + корзина + заказ с сайта и Telegram Mini App
// ============================================================================

// Конфигурация API и меню
const CONFIG = {
    API_URL: 'https://pelican-alacol.kz/api/order', // уже конечный боевой домен
    MENU_JSON: 'barzakaz.json'
};

    // JSON с меню бара
    MENU_JSON: 'barzakaz.json'
};

// Состояние корзины и меню
let cart = [];
let menuData = [];


// ===================== TELEGRAM MINI APP DETECT =====================

function isInsideTelegramMiniApp() {
    return !!window.Telegram?.WebApp?.initDataUnsafe?.user;
}

function getTelegramWebApp() {
    const tg = window.Telegram?.WebApp;
    if (!tg) return null;
    if (!getTelegramWebApp._inited) {
        tg.ready();
        tg.expand();
        getTelegramWebApp._inited = true;
    }
    return tg;
}

// ===================== ЗАГРУЗКА И РЕНДЕР МЕНЮ =====================

async function loadMenuData() {
    try {
        const response = await fetch(CONFIG.MENU_JSON);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        menuData = await response.json();

        // Нормализуем данные
        menuData = menuData.map((item, index) => ({
            id: item.id || `dish-${index}`,
            name: item.name,
            category: item.category,
            price: Number(item.price) || 0,
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

// ===================== КОРЗИНА =====================

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1
        });
    }
    updateCart();
    saveCartToLocalStorage();
    showNotification(`${name} добавлен в корзину`, 'success');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    saveCartToLocalStorage();
}

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

function clearCart() {
    if (cart.length === 0) return;
    if (!confirm('Очистить корзину?')) return;

    cart = [];
    updateCart();
    localStorage.removeItem('pelikan_cart');
    showNotification('Корзина очищена', 'success');
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');
    const submitButton = document.querySelector('#order-form button[type="submit"]');

    if (!cartItems || !totalElement) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<li class="empty-cart">Корзина пуста</li>';
        totalElement.textContent = '0';
        if (submitButton) submitButton.disabled = true;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <li>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">
                    ${item.price.toLocaleString('ru-RU')} ₸ × ${item.quantity}
                </div>
            </div>
            <div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button class="btn-quantity" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                    <span style="min-width: 30px; text-align: center; font-weight: bold;">
                        ${item.quantity}
                    </span>
                    <button class="btn-quantity" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')" title="Удалить из заказа">
                        ×
                    </button>
                </div>
            </div>
        </li>
    `).join('');

    const total = calculateTotal();
    totalElement.textContent = total.toLocaleString('ru-RU');

    if (submitButton) submitButton.disabled = false;
}

function saveCartToLocalStorage() {
    localStorage.setItem('pelikan_cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const saved = localStorage.getItem('pelikan_cart');
    if (!saved) return;

    try {
        cart = JSON.parse(saved) || [];
        updateCart();
    } catch (e) {
        console.error('Ошибка загрузки корзины:', e);
        cart = [];
    }
}

// ===================== UI: ЛОАДЕР И УВЕДОМЛЕНИЯ =====================

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

// ===================== ТЕКСТ ЗАКАЗА ДЛЯ МЕССЕНДЖЕРОВ =====================

function formatOrderText(order) {
    let text = `Заказ #${order.orderId}\n`;
    text += `Гость: ${order.name}\n`;
    text += `Комната: ${order.room}\n\n`;
    text += 'Позиции:\n';

    order.items.forEach(item => {
        const sum = item.price * item.quantity;
        text += `• ${item.name} x${item.quantity} — ${sum.toLocaleString('ru-RU')} ₸\n`;
    });

    text += `\nИтого: ${order.total.toLocaleString('ru-RU')} ₸`;
    return text;
}

// ===================== МОДАЛКА ДЛЯ САЙТА (WhatsApp / Telegram / Звонок) =====================

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
    const telegramUrl = `https://t.me/Pelicanalacolhotelbot?text=${encodedText}`;
    const phoneUrl = 'tel:+77283330002';

    modal.innerHTML = `
        <div class="modal-content">
            <h2>Заказ #${order.orderId}</h2>
            <p style="font-size: 1.2em; margin: 15px 0;">
                Сумма: <strong>${order.total.toLocaleString('ru-RU')} ₸</strong>
            </p>

            <h3 style="margin: 25px 0 20px;">Выберите способ связи</h3>

            <div style="display: flex; flex-direction: column; gap: 15px;">
                <a href="${whatsappUrl}" class="contact-button whatsapp" target="_blank">
                    <span style="font-size: 2em;">🟢</span>
                    <div>
                        <div style="font-size: 1.2em; font-weight: bold;">WhatsApp</div>
                        <div style="font-size: 0.9em; opacity: 0.8;">Отправить заказ администратору</div>
                    </div>
                </a>

                <a href="${telegramUrl}" class="contact-button telegram" target="_blank">
                    <span style="font-size: 2em;">🔵</span>
                    <div>
                        <div style="font-size: 1.2em; font-weight: bold;">Telegram</div>
                        <div style="font-size: 0.9em; opacity: 0.8;">Открыть бота отеля</div>
                    </div>
                </a>

                <a href="${phoneUrl}" class="contact-button phone">
                    <span style="font-size: 2em;">📞</span>
                    <div>
                        <div style="font-size: 1.2em; font-weight: bold;">Позвонить</div>
                        <div style="font-size: 0.9em; opacity: 0.8;">+7 728 33 30002</div>
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
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===================== ОФОРМЛЕНИЕ ЗАКАЗА (ОБЩЕЕ) =====================

async function handleOrderSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const roomInput = document.getElementById('room');

    const name = nameInput?.value?.trim();
    const room = roomInput?.value?.trim();

    if (!name || !room) {
        showNotification('Пожалуйста, заполните имя и номер комнаты', 'error');
        return;
    }

    if (cart.length === 0) {
        showNotification('Корзина пуста. Добавьте блюда для заказа.', 'error');
        return;
    }

    const orderId = 'ORD' + Date.now().toString().slice(-6);
    const total = calculateTotal();

    const order = {
        orderId,
        name,
        room,
        items: cart,
        total,
        timestamp: new Date().toISOString()
    };

    const orderText = formatOrderText(order);
    const isMiniApp = isInsideTelegramMiniApp();

    showLoading(true);

    try {
        if (isMiniApp) {
            await handleMiniAppOrder(order, orderText);
        } else {
            await handleBrowserOrder(order, orderText);
        }

        // Очистка состояния
        cart = [];
        updateCart();
        localStorage.removeItem('pelikan_cart');

        const form = document.getElementById('order-form');
        if (form) form.reset();

        showNotification('Заказ оформлен! Спасибо.', 'success');
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
        showNotification('Ошибка оформления заказа. Попробуйте ещё раз.', 'error');
    } finally {
        showLoading(false);
    }
}

// ===================== MINI APP: HTTP + POPUP =====================

async function handleMiniAppOrder(order, orderText) {
    const tg = getTelegramWebApp();

    // 1. Отправляем данные боту через WebApp API (необязательно, но полезно)
    if (tg) {
        try {
            tg.sendData(JSON.stringify(order));
        } catch (e) {
            console.warn('Ошибка tg.sendData:', e);
        }
    }

    // 2. Отправляем заказ на backend с initData / user (как было)
    const payload = {
        ...order,
        telegramInitData: tg?.initData || null,
        telegramUser: tg?.initDataUnsafe?.user || null
    };

    const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`API error (MiniApp): ${response.status}`);
    }

    // 3. Вместо tg.showPopup показываем наше модальное окно c 3 вариантами
    showContactModal(order, orderText);
}

// ===================== БРАУЗЕР: HTTP + МОДАЛКА =====================

async function handleBrowserOrder(order, orderText) {
    const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
    });

    if (!response.ok) {
        throw new Error(`API error (browser): ${response.status}`);
    }

    // Показываем модалку с WhatsApp/Telegram/звонком
    showContactModal(order, orderText);
}

// ===================== ИНИЦИАЛИЗАЦИЯ =====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🍹 Инициализация бара...');

    loadMenuData();
    loadCartFromLocalStorage();

    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }

    const clearBtn = document.querySelector('.clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCart);
    }

    // Если это Telegram Mini App — инициализируем WebApp
    if (isInsideTelegramMiniApp()) {
        getTelegramWebApp();
    }

    console.log('✅ Система заказов бара готова!');
});

// Экспорт в глобальную область, чтобы работали onclick в HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.closeContactModal = closeContactModal;
window.loadMenuData = loadMenuData;
