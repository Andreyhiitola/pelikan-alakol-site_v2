# 🏖️ Pelikan Alakol - Официальный сайт

Сайт базы отдыха "Пеликан Алаколь" с интегрированной системой онлайн-заказов.

## 🎯 Версия: v3-stable

### ✨ Основные возможности

- 🏠 Бронирование номеров
- 🍽️ **[НОВОЕ] Онлайн-заказ из бара**
- 📸 Галерея фотографий
- 🎯 Активности и развлечения
- 📋 Прайс-лист и правила
- 🗺️ Интерактивная карта
- 📞 Контакты

### 🆕 Что нового в v3-stable

#### Система онлайн-заказов
- Полноценная страница заказов (`bar.html`)
- 22 блюда в 8 категориях
- Корзина с управлением
- Интеграция с Telegram ботом (готовность)

#### Интерактивная инфраструктура
- Кликабельные иконки услуг
- Hover эффекты и анимации
- Мгновенная навигация

## 🚀 Быстрый старт

### Локальная разработка
```bash
# Клонировать репозиторий
git clone https://github.com/yourusername/pelikan-alakol-site.git
cd pelikan-alakol-site

# Запустить локальный сервер
python3 -m http.server 9001

# Открыть в браузере
http://localhost:9001
```

### Структура проекта
```
pelikan-alakol-site_v2/
├── index.html              # Главная страница
├── bar.html               # [НОВОЕ] Страница заказов
├── barzakaz.json          # [НОВОЕ] Меню бара
├── infrastructure.json     # Конфигурация услуг
├── js/
│   ├── bar.js            # [НОВОЕ] Логика заказов
│   ├── infrastructure.js  # [ОБНОВЛЕНО] Кликабельные иконки
│   └── ...
├── css/
│   ├── infrastructure.css # [ОБНОВЛЕНО] Стили инфраструктуры
│   └── ...
└── img/
    ├── bg-wood.jpg       # Фон меню бара
    └── ...
```

## 🔗 Интеграция с Telegram ботом

### Требования
- Telegram бот развёрнут на VPS
- Webhook сервер на порту 8080
- Nginx proxy для `/api/order`

### Конфигурация

В `js/bar.js` обновите:
```javascript
const CONFIG = {
    API_URL: 'https://bar.pelikan-alakol.kz/api/order', // ← ВАШ ДОМЕН
    MENU_JSON: 'barzakaz.json'
};
```

### Endpoint API

**POST** `/api/order`

Payload:
```json
{
  "orderId": "1736187645123",
  "name": "Иван",
  "room": "205",
  "telegram": "ivan_ivanov",
  "items": [
    {
      "id": "burger-1",
      "name": "Бургер \"Черный\" (комбо)",
      "price": 3800,
      "quantity": 2
    }
  ],
  "total": 7600,
  "timestamp": "06.01.2025, 20:34"
}
```

Response:
```json
{
  "status": "ok",
  "order_id": "1736187645123"
}
```

## 📦 Развёртывание

### Production
```bash
# Загрузить на сервер
scp -r * user@server:/var/www/pelikan-alakol-site/

# Настроить Nginx
sudo nano /etc/nginx/sites-available/pelikan-alakol

# Перезагрузить Nginx
sudo systemctl reload nginx
```

### Nginx конфигурация
```nginx
server {
    listen 80;
    server_name pelikan-alakol.kz www.pelikan-alakol.kz;
    
    root /var/www/pelikan-alakol-site;
    index index.html;
    
    # Proxy для API заказов
    location /api/order {
        proxy_pass http://127.0.0.1:8080/api/order;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🧪 Тестирование
```bash
# Запустить тесты (если есть)
npm test

# Проверить линки
# Проверить адаптивность
# Проверить заказы в bar.html
```

## 📝 TODO

- [ ] Развернуть Telegram бота на VPS
- [ ] Настроить webhook endpoint
- [ ] Добавить payment gateway
- [ ] Добавить трекинг заказов
- [ ] Multilanguage support (RU/EN/KZ)

## 👥 Разработчики

- **Frontend**: andysag
- **AI Assistant**: Claude (Anthropic)
- **Design**: Custom

## 📄 Лицензия

© 2025 Pelikan Alakol. Все права защищены.

## 🔗 Ссылки

- 🌐 Сайт: https://parkpelikan-alakol.kz
- 📱 Telegram бот: @pelikan_alakol_bot
- 📧 Email: info@pelikan-alakol.kz
- 📞 Телефон: +7 (XXX) XXX-XX-XX
# 🏨 Pelikan Alakol Bot - Система Отзывов

## 📋 Обновление v2.0 - Добавлена система отзывов

### ✨ Новые возможности

- ⭐ **Опрос гостей через Telegram** - 12 шагов с оценками по 6 критериям
- 👨‍💼 **Модерация отзывов** - менеджеры проверяют перед публикацией
- 🌐 **Автоматическая публикация на сайт** - через API
- 📊 **Детальная статистика** - средние оценки и рекомендации

---

## 🚀 Установка

### 1. Клонирование репозитория

```bash
git clone https://github.com/Andreyhiitola/pelikan-bot.git
cd pelikan-bot
```

### 2. Установка зависимостей

```bash
pip install -r requirements.txt
```

**Requirements:**
```
aiogram==3.4.1
aiosqlite==0.19.0
aiohttp==3.9.1
python-dotenv==1.0.0
reportlab==4.0.9
Pillow==10.2.0
```

### 3. Настройка переменных окружения

Создайте файл `.env`:

```bash
# Telegram Bot
BOT_TOKEN=your_bot_token_here

# Роли (ID пользователей через запятую)
ADMIN_IDS=123456789
MANAGER_IDS=987654321
WAITER_IDS=

# База данных
DB_FILE=/app/data/orders.db

# Веб-сервер
WEBHOOK_PORT=8080
ALLOWED_ORIGIN=https://parkpelikan-alakol.kz
```

### 4. Запуск бота

```bash
python main.py
```

Или через Docker:

```bash
docker-compose up -d
```

---

## 📚 Как использовать систему отзывов

### Для гостей:

1. Открыть бота в Telegram
2. Нажать кнопку **"⭐ Оставить отзыв"** или команду `/review`
3. Пройти опрос из 12 шагов:
   - Имя гостя
   - Номер комнаты
   - Оценки по 6 критериям (1-10):
     - 🧹 Чистота
     - 🛏️ Комфорт
     - 📍 Расположение
     - 🏊 Удобства
     - 👥 Персонал
     - 💰 Цена/Качество
   - Текстовые отзывы (необязательно):
     - ✅ Что понравилось
     - ❌ Что улучшить
     - 💬 Общий комментарий
4. Подтвердить отправку

### Для менеджеров:

1. Получить уведомление о новом отзыве
2. Команда `/admin_reviews` - список на модерации
3. Выбрать отзыв для проверки
4. Нажать:
   - **✅ Одобрить и опубликовать** - отзыв появится на сайте
   - **❌ Отклонить** - отзыв будет скрыт

---

## 🔧 Структура проекта

```
pelikan-bot/
├── main.py                # Главный файл бота
├── reviews_handler.py     # Модуль отзывов
├── .env                   # Переменные окружения
├── requirements.txt       # Зависимости
├── data/
│   ├── orders.db         # SQLite база данных
│   └── receipts/         # PDF и изображения накладных
└── README.md
```

---

## 🗄️ База данных

### Таблица `reviews`

```sql
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_user_id INTEGER NOT NULL,
    telegram_username TEXT,
    guest_name TEXT NOT NULL,
    room_number TEXT,
    
    -- Оценки (1-10)
    cleanliness INTEGER,
    comfort INTEGER,
    location INTEGER,
    facilities INTEGER,
    staff INTEGER,
    value_for_money INTEGER,
    
    -- Текстовые отзывы
    pros TEXT,
    cons TEXT,
    comment TEXT,
    
    -- Модерация
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    moderated_at TIMESTAMP,
    moderated_by INTEGER,
    
    -- Публикация
    display_name TEXT,
    is_published INTEGER DEFAULT 0
);
```

---

## 🌐 API Endpoints

### GET /api/reviews

Возвращает опубликованные отзывы для сайта.

**Response:**
```json
[
  {
    "name": "Иван",
    "room_number": "205",
    "cleanliness": 9,
    "comfort": 10,
    "location": 9,
    "facilities": 8,
    "staff": 10,
    "value_for_money": 9,
    "avg_score": 9.2,
    "pros": "Отличный сервис, чистые номера",
    "cons": null,
    "comment": "Прекрасный отдых!",
    "date": "2026-01-18T10:30:00"
  }
]
```

**CORS:**
- Разрешённые домены: настройте в `ALLOWED_ORIGIN`
- Методы: GET, OPTIONS

---

## 👨‍💻 Команды бота

### Для гостей:
- `/start` - Главное меню
- `/review` - Оставить отзыв
- `/help` - Справка

### Для администраторов:
- `/admin_reviews` - Модерация отзывов
- `/admin_panel` - Админ-панель (заказы)
- `/stats` - Статистика за день

---

## 🔐 Система ролей

| Роль | Права |
|------|-------|
| **Admin** | Все права + очистка БД |
| **Manager** | Просмотр заказов, экспорт, статистика, модерация отзывов |
| **Waiter** | Просмотр и изменение статусов заказов |

Настройте роли в `.env`:
```bash
ADMIN_IDS=123456789,987654321
MANAGER_IDS=111111111,222222222
WAITER_IDS=333333333
```

---

## 📊 Интеграция с сайтом

### 1. Подключение API

```javascript
// js/reviews.js
const API_URL = 'https://apitelegram.parkpelikan-alakol.kz/api/reviews';

async function loadReviews() {
    const response = await fetch(API_URL);
    const reviews = await response.json();
    // Отображение отзывов...
}
```

### 2. Страница отзывов

Создайте `reviews.html` на сайте с подключением `reviews.js`.

Пример: `https://parkpelikan-alakol.kz/reviews.html`

---

## 🐳 Docker Compose

```yaml
version: '3.8'

services:
  pelikan-bot:
    build: .
    container_name: pelikan-bot
    restart: unless-stopped
    environment:
      - BOT_TOKEN=${BOT_TOKEN}
      - ADMIN_IDS=${ADMIN_IDS}
      - MANAGER_IDS=${MANAGER_IDS}
      - WAITER_IDS=${WAITER_IDS}
      - DB_FILE=/app/data/orders.db
      - WEBHOOK_PORT=8080
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
```

---

## 🔄 Обновление

### Обновление с GitHub:

```bash
git pull origin main
pip install -r requirements.txt
# Перезапустить бота
```

### Миграция базы данных:

При первом запуске обновлённого бота таблица `reviews` создастся автоматически.

---

## 📝 Changelog

### v2.0 (2026-01-18)
- ✅ Добавлена система отзывов
- ✅ Опрос гостей с 6 критериями оценки
- ✅ Модерация отзывов менеджерами
- ✅ API endpoint для сайта
- ✅ Обновлён главный экран с кнопкой отзывов

### v1.0 (2025-12-01)
- ✅ Базовая система заказов из бара
- ✅ Генерация PDF накладных
- ✅ Админ-панель
- ✅ Система ролей

---

## 🤝 Поддержка

При возникновении проблем:
1. Проверьте логи: `docker logs -f pelikan-bot`
2. Убедитесь, что все переменные в `.env` настроены
3. Проверьте права доступа к `/app/data/`

---

## 📄 Лицензия

MIT License

---

## 👨‍💻 Автор

Developed by Andrey Hiitola
- GitHub: [@Andreyhiitola](https://github.com/Andreyhiitola)
- Project: [pelikan-bot](https://github.com/Andreyhiitola/pelikan-bot)
