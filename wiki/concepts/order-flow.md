# Поток заказа в баре

Полный путь от нажатия «Добавить» до получения заказа в боте.

## 1. Добавление в корзину

`addToCart(id, name, price)` в `js/bar.js`.
- Ищет элемент по `id` в массиве `cart[]`; если есть — увеличивает `quantity`, если нет — пушит новый объект.
- После каждого изменения вызывает `updateCart()` (перерисовка DOM) и `saveCartToLocalStorage()` (сохранение в `localStorage` по ключу `pelikan_cart`).

## 2. Форма заказа

`bar.html` содержит `<form id="order-form">` с полями `name` и `room`.
**Известный баг:** форма продублирована (строки 594/596) — два вложенных `<form>` с одинаковым `id`.

## 3. Submit → выбор оплаты

`handleOrderSubmit(e)` собирает объект `order`:
```js
{
  orderId: 'ORD' + Date.now().toString().slice(-6),  // ← только 6 цифр, возможны коллизии
  name, room,
  telegram: tg?.initDataUnsafe?.user?.username || '',
  telegram_user_id: tg?.initDataUnsafe?.user?.id || null,
  items: [...cart],
  total,
  timestamp: new Date().toLocaleString('ru-RU')
}
```
Затем вызывает `showPaymentModal(order, orderText)` — модалка выбора «Картой» / «Наличными».

## 4. Отправка на API

`submitOrderWithPayment(order, orderText, paymentMethod)`:
- Добавляет в payload `payment_method`, `telegramInitData`, `telegramUser`.
- `POST CONFIG.API_URL` (`https://apitelegram.parkpelikan-alakol.kz/api/order`).
- При успехе:
  - **card + `result.payment_url` есть** → `showPayboxRedirectModal()` — ссылка на Paybox. Внутри Mini App открывает через `tg.openLink()`, снаружи — `window.open()`.
  - **cash или нет payment_url** → `showContactModal()` — сообщение об успехе + номер телефона (или «ожидайте уведомление», если Mini App).
- Корзина очищается (массив + localStorage + reset формы) только после успешного ответа.

## 5. Бот обрабатывает заказ

Бот (`pelikan-bot`, Python/aiogram) получает POST, сохраняет в SQLite (`orders.db`), отправляет уведомление в Telegram-группу персонала, затем обновляет статус: принят → готовится → готов → выдан.

## Известные проблемы в потоке

| Место | Проблема |
|---|---|
| `bar.html:594/596` | Вложенные `<form>` — невалидный HTML |
| `bar.js:606` | `orderId` обрезается до 6 цифр — коллизии при одновременных заказах |
| `bar.js:578` | `window.currentOrderText` — данные заказа в глобальной переменной, не очищается |
| `showContactModal` | `order.name` и `order.room` вставляются в `innerHTML` без экранирования (XSS) |
