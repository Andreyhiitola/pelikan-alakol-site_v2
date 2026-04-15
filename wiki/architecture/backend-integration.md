# Бэкенд-интеграция

## Схема

```
Браузер / Telegram Mini App
        │
        │  POST /api/order
        │  GET  /api/reviews
        ▼
  Nginx (pelikan-alakol.kz)
        │
        │  proxy_pass http://127.0.0.1:8080
        ▼
  pelikan-bot (Python/aiogram, Docker)
  VPS: 85.192.40.138, порт 8080
        │
        ├── SQLite: orders.db, reviews (таблица)
        └── Telegram Bot API
```

## Эндпоинты

### POST `/api/order`
Принимает заказ, сохраняет в БД, уведомляет персонал в Telegram-группе.
При `payment_method: "card"` бот создаёт платёж в Paybox и возвращает `payment_url`.

### GET `/api/reviews`
Возвращает массив опубликованных (прошедших модерацию) отзывов.
CORS разрешён только для `ALLOWED_ORIGIN` из `.env` бота.

## Paybox (оплата картой)

- Интегрирован на стороне **бота** (не фронтенда).
- Фронтенд передаёт `payment_method: "card"` в payload.
- Бот создаёт платёж в Paybox API, получает ссылку и возвращает её в `payment_url`.
- Фронтенд открывает ссылку: `tg.openLink(url)` внутри Mini App или `window.open()` в браузере.

## Конфигурация для локальной разработки

В `js/bar.js` поменять:
```js
const CONFIG = {
    API_URL: 'http://localhost:8080/api/order',  // ← локальный бот
    ...
};
```
В `js/reviews.js` поменять:
```js
const API_URL = 'http://localhost:8080/api/reviews';
```

**Известный технический долг:** оба URL захардкожены. Нужен автодетект по `location.hostname`.

## Nginx-конфиг (production)

```nginx
server {
    listen 80;
    server_name pelikan-alakol.kz www.pelikan-alakol.kz;
    root /var/www/pelikan-alakol-site;
    index index.html;

    location /api/order {
        proxy_pass http://127.0.0.1:8080/api/order;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Бот (внешний репозиторий)

Repo: https://github.com/Andreyhiitola/pelikan-bot  
Стек: Python, aiogram 3.4, aiosqlite, aiohttp, reportlab (PDF-накладные).

Переменные окружения бота:
```
BOT_TOKEN=...
ADMIN_IDS=...
MANAGER_IDS=...
WAITER_IDS=...
DB_FILE=/app/data/orders.db
WEBHOOK_PORT=8080
ALLOWED_ORIGIN=https://parkpelikan-alakol.kz
```

### Роли в боте

| Роль | Права |
|---|---|
| Admin | Все + очистка БД |
| Manager | Просмотр заказов, экспорт, статистика, модерация отзывов |
| Waiter | Просмотр и смена статуса заказов |

### Жизненный цикл отзыва
1. Гость пишет `/review` в боте → проходит 12-шаговый опрос.
2. Отзыв попадает в БД со статусом `pending`.
3. Менеджер получает уведомление, модерирует через `/admin_reviews`.
4. После одобрения → `is_published=1`, отзыв появляется на сайте через `GET /api/reviews`.
