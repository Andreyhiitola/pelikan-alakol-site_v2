// ============================================================================
// bar.js - Бар "Пеликан Алаколь"
// Меню + корзина + заказ с сайта и Telegram Mini App
// + Paybox оплата картой (debug-режим)
// ============================================================================

const CONFIG = {
  API_URL: 'https://apitelegram.parkpelikan-alakol.kz/api/order',
  MENU_JSON: 'barzakaz.json',
};

let cart = [];
let menuData = [];

// ===================== УТИЛИТЫ =====================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================== TELEGRAM MINI APP DETECT =====================

function isInsideTelegramMiniApp() {
    return !!window.Telegram?.WebApp?.initData;
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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        menuData = await response.json();
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
        categories[category].forEach(item => grid.appendChild(createDishCard(item)));

        categoryDiv.appendChild(grid);
        container.appendChild(categoryDiv);
    });

    document.dispatchEvent(new Event('menuRendered'));
}

function createDishCard(item) {
    const card = document.createElement('div');
    card.className = 'dish-card';

    const img = document.createElement('img');
    img.src = item.image || 'img/placeholder.jpg';
    img.className = 'dish-img';
    img.alt = item.name;
    img.onerror = function() { this.src = 'img/placeholder.jpg'; };

    const dishInfo = document.createElement('div');
    dishInfo.className = 'dish-info';

    const dishName = document.createElement('h3');
    dishName.className = 'dish-name';
    dishName.textContent = item.name;
    dishInfo.appendChild(dishName);

    if (item.description) {
        const dishDesc = document.createElement('p');
        dishDesc.className = 'dish-description';
        dishDesc.textContent = item.description;
        dishInfo.appendChild(dishDesc);
    }

    const foot = document.createElement('div');
    foot.className = 'dish-footer';

    const dishPrice = document.createElement('span');
    dishPrice.className = 'dish-price';
    dishPrice.textContent = `${item.price.toLocaleString('ru-RU')} ₸`;

    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.innerHTML = '<i class="fas fa-cart-plus"></i> В корзину';
    addBtn.addEventListener('click', () => addToCart(item.id, item.name, item.price));

    foot.appendChild(dishPrice);
    foot.appendChild(addBtn);
    dishInfo.appendChild(foot);
    card.appendChild(img);
    card.appendChild(dishInfo);
    return card;
}

// ===================== КОРЗИНА =====================

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
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
    const badge = document.getElementById('cart-badge');

    if (!cartItems || !totalElement) return;

    const totalQty = cart.reduce((s, i) => s + i.quantity, 0);
    if (badge) badge.textContent = totalQty;

    if (cart.length === 0) {
        cartItems.innerHTML = '<li class="empty-cart">Корзина пуста</li>';
        totalElement.textContent = '0';
        if (submitButton) submitButton.disabled = true;
        return;
    }

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');

        const itemInfo = document.createElement('div');
        itemInfo.className = 'cart-item-info';

        const itemName = document.createElement('div');
        itemName.className = 'cart-item-name';
        itemName.textContent = item.name;

        const itemPrice = document.createElement('div');
        itemPrice.className = 'cart-item-price';
        itemPrice.textContent = `${item.price.toLocaleString('ru-RU')} ₸ × ${item.quantity}`;

        itemInfo.appendChild(itemName);
        itemInfo.appendChild(itemPrice);

        const controls = document.createElement('div');
        const controlsInner = document.createElement('div');
        controlsInner.style.cssText = 'display: flex; gap: 10px; align-items: center;';

        const btnMinus = document.createElement('button');
        btnMinus.className = 'btn-quantity';
        btnMinus.textContent = '−';
        btnMinus.addEventListener('click', () => updateQuantity(item.id, item.quantity - 1));

        const quantity = document.createElement('span');
        quantity.style.cssText = 'min-width: 30px; text-align: center; font-weight: bold;';
        quantity.textContent = item.quantity;

        const btnPlus = document.createElement('button');
        btnPlus.className = 'btn-quantity';
        btnPlus.textContent = '+';
        btnPlus.addEventListener('click', () => updateQuantity(item.id, item.quantity + 1));

        const btnRemove = document.createElement('button');
        btnRemove.className = 'remove-btn';
        btnRemove.textContent = '×';
        btnRemove.title = 'Удалить из заказа';
        btnRemove.addEventListener('click', () => removeFromCart(item.id));

        controlsInner.appendChild(btnMinus);
        controlsInner.appendChild(quantity);
        controlsInner.appendChild(btnPlus);
        controlsInner.appendChild(btnRemove);
        controls.appendChild(controlsInner);

        li.appendChild(itemInfo);
        li.appendChild(controls);
        cartItems.appendChild(li);
    });

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
    if (loader) loader.style.display = show ? 'flex' : 'none';

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

// ===================== ТЕКСТ ЗАКАЗА =====================

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

// ===================== PAYBOX: МОДАЛКА ВЫБОРА ОПЛАТЫ =====================

function showPaymentModal(order, orderText) {
    // Удаляем старую модалку если есть
    document.getElementById('paymentModal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'paymentModal';
    modal.className = 'modal';
    modal.style.display = 'flex';

    const content = document.createElement('div');
    content.className = 'modal-content';
    content.style.cssText = 'max-width: 420px; width: 100%;';

    // Заголовок
    const title = document.createElement('div');
    title.style.cssText = 'text-align: center; margin-bottom: 24px;';
    title.innerHTML = `
        <div style="font-size: 2.5em; margin-bottom: 12px;">💳</div>
        <h2 style="margin: 0 0 8px;">Способ оплаты</h2>
        <p style="margin: 0; color: #FFD700; font-size: 1.2em;">
            Итого: <strong>${order.total.toLocaleString('ru-RU')} ₸</strong>
        </p>
    `;
    content.appendChild(title);

    // Кнопка — Картой (Paybox) — только в Telegram Mini App
    if (isInsideTelegramMiniApp()) {
        const btnCard = document.createElement('button');
        btnCard.style.cssText = `
            display: flex; align-items: center; gap: 16px;
            width: 100%; padding: 18px 20px; margin-bottom: 14px;
            border: none; border-radius: 14px;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: #fff; font-size: 1.05em; cursor: pointer; text-align: left;
        `;
        btnCard.innerHTML = `
            <span style="font-size: 1.8em;">💳</span>
            <div>
                <div style="font-weight: bold; font-size: 1.1em;">Оплатить картой</div>
                <div style="opacity: 0.85; font-size: 0.9em;">Visa / MasterCard (Paybox)</div>
            </div>
        `;
        btnCard.addEventListener('click', () => {
            modal.remove();
            submitOrderWithPayment(order, orderText, 'card');
        });
        content.appendChild(btnCard);
    }

    // Кнопка — Наличными
    const btnCash = document.createElement('button');
    btnCash.style.cssText = `
        display: flex; align-items: center; gap: 16px;
        width: 100%; padding: 18px 20px; margin-bottom: 14px;
        border: 2px solid rgba(255,255,255,0.2); border-radius: 14px;
        background: rgba(255,255,255,0.05); color: #fff;
        font-size: 1.05em; cursor: pointer; text-align: left;
    `;
    btnCash.innerHTML = `
        <span style="font-size: 1.8em;">💵</span>
        <div>
            <div style="font-weight: bold; font-size: 1.1em;">Наличными при получении</div>
            <div style="opacity: 0.7; font-size: 0.9em;">Оплата в баре</div>
        </div>
    `;
    btnCash.addEventListener('click', () => {
        modal.remove();
        submitOrderWithPayment(order, orderText, 'cash');
    });
    content.appendChild(btnCash);

    // Отмена
    const btnCancel = document.createElement('button');
    btnCancel.style.cssText = `
        width: 100%; padding: 12px; border: none; background: none;
        color: rgba(255,255,255,0.45); font-size: 0.95em; cursor: pointer;
    `;
    btnCancel.textContent = 'Отмена';
    btnCancel.addEventListener('click', () => modal.remove());
    content.appendChild(btnCancel);

    modal.appendChild(content);
    document.body.appendChild(modal);
}

// ===================== ОТПРАВКА ЗАКАЗА С МЕТОДОМ ОПЛАТЫ =====================

async function submitOrderWithPayment(order, orderText, paymentMethod) {
    showLoading(true);

    try {
        const tg = getTelegramWebApp();
        const user = tg?.initDataUnsafe?.user;

        const payload = {
            ...order,
            payment_method: paymentMethod,
            telegram_user_id: user?.id || order.telegram_user_id || null,
            telegram_username: user?.username || order.telegram_username || null,
            telegramInitData: tg?.initData || null,
            telegramUser: user || null,
        };


        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const result = await response.json();
        showLoading(false);

        if (result.status !== 'ok') {
            showNotification('Ошибка оформления заказа', 'error');
            return;
        }

        if (paymentMethod === 'card' && result.payment_url) {
            // Открываем страницу Paybox
            showPayboxRedirectModal(order, result.payment_url);
        } else {
            // Наличные или fallback (нет ссылки)
            if (paymentMethod === 'card' && !result.payment_url) {
                console.warn('Paybox URL не получен, fallback на наличные');
            }
            showContactModal(order, orderText);
        }

        // Очистка
        cart = [];
        updateCart();
        localStorage.removeItem('pelikan_cart');
        const form = document.getElementById('order-form');
        if (form) form.reset();

    } catch (error) {
        showLoading(false);
        console.error('Ошибка оформления заказа:', error);
        showNotification('Ошибка оформления заказа. Попробуйте ещё раз.', 'error');
    }
}

// ===================== PAYBOX: МОДАЛКА РЕДИРЕКТА =====================

function showPayboxRedirectModal(order, paymentUrl) {
    document.getElementById('payboxRedirectModal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'payboxRedirectModal';
    modal.className = 'modal';
    modal.style.display = 'flex';

    const content = document.createElement('div');
    content.className = 'modal-content';
    content.style.cssText = 'max-width: 420px; width: 100%; text-align: center;';

    content.innerHTML = `
        <div style="font-size: 3em; margin-bottom: 16px;">✅</div>
        <h2 style="margin: 0 0 8px;">Заказ #${order.orderId} создан!</h2>
        <p style="color: #FFD700; font-size: 1.2em; margin: 0 0 20px;">
            ${order.total.toLocaleString('ru-RU')} ₸
        </p>
        <div style="
            background: rgba(37,99,235,0.15); border-left: 4px solid #2563eb;
            padding: 16px; border-radius: 10px; margin-bottom: 24px; text-align: left;
        ">
            <p style="margin: 0; line-height: 1.6; font-size: 0.95em;">
                Нажмите кнопку ниже для перехода на страницу оплаты. 
                После оплаты вернитесь в Telegram — мы пришлём уведомление.
            </p>
        </div>
    `;

    // Кнопка перехода к оплате
    const btnPay = document.createElement('button');
    btnPay.className = 'add-btn';
    btnPay.style.cssText = 'width: 100%; padding: 16px; font-size: 1.1em; margin-bottom: 12px;';
    btnPay.textContent = '💳 Перейти к оплате';
    btnPay.addEventListener('click', () => {
        const tg = window.Telegram?.WebApp;
        if (tg?.openLink) {
            tg.openLink(paymentUrl);
        } else {
            window.open(paymentUrl, '_blank');
        }
        modal.remove();
    });
    content.appendChild(btnPay);

    // Закрыть без оплаты
    const btnClose = document.createElement('button');
    btnClose.style.cssText = `
        width: 100%; padding: 12px; border: none; background: none;
        color: rgba(255,255,255,0.45); font-size: 0.9em; cursor: pointer;
    `;
    btnClose.textContent = 'Закрыть (оплачу позже)';
    btnClose.addEventListener('click', () => modal.remove());
    content.appendChild(btnClose);

    modal.appendChild(content);
    document.body.appendChild(modal);
}

// ===================== МОДАЛКА ДЛЯ САЙТА (наличные / звонок) =====================

function showContactModal(order, orderText) {
    let modal = document.getElementById('contactModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'contactModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    const phoneUrl = 'tel:+77283330002';
    const isTelegramMiniApp = window.Telegram?.WebApp;

    if (isTelegramMiniApp) {
        modal.innerHTML = `
            <div class="modal-content">
                <div style="text-align: center;">
                    <div style="font-size: 3em; margin-bottom: 20px;">✅</div>
                    <h2>Заказ принят!</h2>
                    <p style="font-size: 1.5em; color: #FFD700; margin: 20px 0;">
                        #${order.orderId}
                    </p>
                    <p style="font-size: 1.2em; margin: 15px 0;">
                        Сумма: <strong>${order.total.toLocaleString('ru-RU')} ₸</strong>
                    </p>
                    <div style="background: rgba(76, 175, 80, 0.15); border-left: 4px solid #4CAF50; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: left;">
                        <p style="margin: 0; line-height: 1.6;">
                            Вы получите уведомление о статусе заказа в этом чате.
                            Оплата наличными при получении в баре.
                        </p>
                    </div>
                    <button onclick="closeContactModal()" class="close-button" style="margin-top: 15px;">
                        Понятно
                    </button>
                </div>
            </div>
        `;
    } else {
        modal.innerHTML = `
            <div class="modal-content">
                <div style="text-align: center;">
                    <div style="font-size: 3em; margin-bottom: 20px;">✅</div>
                    <h2>Заказ #${order.orderId}</h2>
                    <p style="font-size: 1.2em; margin: 15px 0;">
                        Сумма: <strong>${order.total.toLocaleString('ru-RU')} ₸</strong>
                    </p>
                    <h3 style="margin: 25px 0 20px; color: #FFD700;">📞 Для уточнения статуса заказа</h3>
                    <a href="${phoneUrl}" class="contact-button phone" style="text-decoration: none; width: 100%; max-width: 400px; margin: 0 auto;">
                        <span style="font-size: 2.5em;">📞</span>
                        <div>
                            <div style="font-size: 1.4em; font-weight: bold;">Позвонить в бар</div>
                            <div style="font-size: 1.1em; opacity: 0.9;">+7 728 33 30002</div>
                        </div>
                    </a>
                    <button onclick="closeContactModal()" class="close-button" style="margin-top: 30px; width: 100%; max-width: 400px;">
                        Закрыть
                    </button>
                </div>
            </div>
        `;
    }

    modal.style.display = 'flex';
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) modal.style.display = 'none';
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

    const tg = getTelegramWebApp();
    const user = tg?.initDataUnsafe?.user;

    const order = {
        orderId,
        name,
        room,
        items: cart,
        total,
        timestamp: new Date().toISOString(),
        telegram_user_id: user?.id || null,
        telegram_username: user?.username || null,
    };

    const orderText = formatOrderText(order);

    // ── Показываем выбор способа оплаты ──
    showPaymentModal(order, orderText);
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

    if (isInsideTelegramMiniApp()) {
        getTelegramWebApp();
    }

    console.log('✅ Система заказов бара готова!');
});

// Экспорт в глобальную область
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.closeContactModal = closeContactModal;
window.loadMenuData = loadMenuData;
