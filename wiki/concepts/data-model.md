# Модель данных

## JSON-файлы (статические, в корне репозитория)

### `barzakaz.json` — меню бара
```json
{
  "id": "burger-black",
  "category": "FAST-FOOD",
  "name": "Бургер (комбо)",
  "price": 3900,
  "description": "Сочный говяжий бургер...",
  "image": "img/burger-black.jpg"
}
```
Категории: `FAST-FOOD`, а также другие (проверь в файле — добавляются вручную).
Поле `"Столбец 7": null` — артефакт экспорта из Excel, игнорируется.

### `infrastructure.json` — карточки инфраструктуры
```json
{ "title": "СТОЛОВАЯ", "description": "...", "icon": "images/infra/stolovay.svg" }
```
Порядок карточек = порядок в файле. `INFRASTRUCTURE_LINKS` в `js/infrastructure.js` сопоставляет `title` → URL страницы (или `null`, если страница ещё не сделана).

### `accommodation.json` — типы номеров
Рендерится через `window.renderAccommodation()` из `js/accommodation.js`.

### `reviews.json` — статические отзывы (fallback)
Используется `js/main.js` как запасной вариант. Живые отзывы приходят через `GET /api/reviews` и рендерятся в `reviews.html`.

### Прочие JSON
| Файл | Используется в |
|---|---|
| `activities.json` | `js/activities.js` → `window.renderActivities()` |
| `gallery.json` | `js/gallery.js` → `window.renderGallery()` |
| `booking.json` | `js/booking.js` → `window.renderBookingConditions()` |
| `offer.json` | `js/offers.js` → `window.renderOffers()` |
| `contacts.json` | `js/contacts.js` |
| `faq.json` | `js/faq.js` |
| `menu.json` | `js/menu.js` — столовая (`index_menu.html`) |
| `price.json` | `js/price_pravila.js` |
| `rules.json` | правила проживания |

## API-данные (от бота)

### GET `/api/reviews` — опубликованные отзывы
```json
{
  "name": "Иван",
  "room_number": "205",
  "cleanliness": 9, "comfort": 10, "location": 9,
  "facilities": 8, "staff": 10, "value_for_money": 9,
  "avg_score": 9.2,
  "pros": "Отличный сервис",
  "cons": null,
  "comment": "Прекрасный отдых!",
  "date": "2026-01-18T10:30:00"
}
```
Критерии оценки (1–10): `cleanliness`, `comfort`, `location`, `facilities`, `staff`, `value_for_money`.

### POST `/api/order` — создание заказа
```json
{
  "orderId": "ORD645123",
  "name": "Иван",
  "room": "205",
  "telegram": "ivan_ivanov",
  "telegram_user_id": 123456789,
  "items": [{ "id": "burger-black", "name": "Бургер", "price": 3900, "quantity": 1 }],
  "total": 3900,
  "timestamp": "15.04.2026, 14:30",
  "payment_method": "card",
  "telegramInitData": "...",
  "telegramUser": { "id": 123456789, "username": "ivan_ivanov", ... }
}
```
Ответ:
```json
{ "status": "ok", "order_id": "ORD645123", "payment_url": "https://paybox.kz/..." }
```
`payment_url` присутствует только при `payment_method: "card"` и успешном создании платежа в Paybox.

## Корзина в localStorage

Ключ: `pelikan_cart`. Формат: `[{ id, name, price, quantity }, ...]`.
Загружается при старте `bar.js` через `loadCartFromLocalStorage()`. Не проверяет актуальность цен из JSON — известное ограничение.
