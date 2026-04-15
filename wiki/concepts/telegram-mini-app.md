# Telegram Mini App

## Как определяется контекст

```js
// js/bar.js
function isInsideTelegramMiniApp() {
    return !!window.Telegram?.WebApp?.initData;
}
```

`window.Telegram.WebApp` инжектируется Telegram-клиентом, когда страница открыта как Mini App. Если `initData` не пустой — пользователь внутри Mini App.

Объект `tg` получается через `getTelegramWebApp()`, который лениво вызывает `tg.ready()` и `tg.expand()` ровно один раз (флаг `_inited`).

## Что меняется в поведении

| Контекст | Поведение |
|---|---|
| **Mini App** | `showContactModal` показывает «ожидайте уведомление в чате» вместо номера телефона |
| **Mini App** | Открытие Paybox через `tg.openLink(url)` (не теряет сессию Mini App) |
| **Браузер** | Paybox через `window.open(url, '_blank')` |
| **Mini App** | Данные пользователя извлекаются из `tg.initDataUnsafe.user` (id, username) |
| **Браузер** | Поля `telegram_user_id` и `telegram_username` приходят пустыми или из формы |

## Точки входа

- `bar.html` — основная страница бара, работает и в браузере, и как Mini App
- `miniapp.html` — выделенная точка входа специально для Mini App (упрощённый вид)

Оба файла подключают SDK:
```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

## Предостережение

В `bar.html` `tg.ready()` / `tg.expand()` вызываются дважды: один раз инлайн-скриптом в HTML, и второй раз через `getTelegramWebApp()`. Повторный вызов безвреден, но это дублирование.
