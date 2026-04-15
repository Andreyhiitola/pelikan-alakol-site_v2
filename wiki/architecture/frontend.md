# Фронтенд-архитектура

## Принцип: без сборки

Нет webpack, vite, npm, typescript, eslint, jest. Просто статические файлы на сервере.
- `python3 -m http.server 9001` — полный dev-сервер.
- Изменения вступают в силу при перезагрузке страницы.

## Паттерн модулей: window.renderXxx

`js/main.js` — центральный оркестратор. Загружает все JSON-файлы параллельно в `window.data`, затем вызывает колбэки, если они задекларированы:

```js
if (window.data.accommodation && window.renderAccommodation) {
    window.renderAccommodation(window.data.accommodation);
}
```

Каждый модуль (`js/accommodation.js`, `js/gallery.js` и т.д.) **экспортирует** свою функцию рендера в `window.*`. Это позволяет подключить модуль на любую страницу тегом `<script>` без системы импортов.

`js/bar.js` — исключение: он самодостаточен, загружает `barzakaz.json` сам и не использует `main.js`.

## Сайтовые модули (на каждой странице)

| Файл | Функция |
|---|---|
| `js/navigation.js` | Sticky-шапка, подсветка активного раздела |
| `js/dark-mode.js` | Переключатель тёмной темы, сохраняет выбор в localStorage |
| `js/mobile-menu.js` | Гамбургер-меню для мобильных |

Эти три скрипта должны присутствовать на каждой странице.

## CSS-организация

| Файл | Покрытие |
|---|---|
| `css/styles.css` | Глобальные стили, большинство страниц |
| `css/infrastructure.css` | Карточки инфраструктуры |
| `css/accommodation.css` | Страница размещения |
| `css/booking.css` | Страница бронирования |
| `css/contacts.css` | Страница контактов |
| `css/logo.css` | Стили логотипа |

**`bar.html`** содержит ~540 строк инлайн CSS прямо в `<style>` внутри HTML.
Это технический долг — планируется вынести в `css/bar.css`.

## Аккордеон (FAQ и условия бронирования)

Реализован в `main.js` через делегирование событий на `document`:
```js
document.addEventListener('click', (event) => {
    const question = event.target.closest('.faq-question');
    ...
    item.classList.toggle('active');
});
```
Класс `active` управляет видимостью ответа через CSS.

## Стоп-файлы (не редактировать)

- `index-annotated.html` — закомментированная справочная версия
- `index.backup_27.01.html` — бэкап от 27.01
- `index_optimized.html` — эксперимент с оптимизацией (не в продакшне)
- `test.json` — тестовый файл
