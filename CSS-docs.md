CSS ДОКУМЕНТАЦИЯ ДЛЯ ПЕЛИКАН АЛАКОЛЬ
БАЗОВЫЕ ПЕРЕМЕННЫЕ (CSS Variables)
css
:root {
  --primary-green: #2d8659;        /* Основной зелёный цвет */
  --secondary-green: #4ca876;      /* Вторичный зелёный цвет */
  --accent-blue: #0077b6;          /* Акцентный синий цвет */
  --light-blue: #00d4ff;           /* Лёгкий голубой цвет */
  --background-light: #f5faf8;     /* Фон основной (светлый) */
  --white: #fff;                   /* Белый цвет */
  --text-dark: #2c3e50;            /* Текст тёмный */
  --shadow: 0 8px 24px rgba(45, 134, 89, 0.15);     /* Мягкая тень */
  --shadow-lg: 0 16px 40px rgba(45, 134, 89, 0.2);  /* Большая тень */
}
ОСНОВНЫЕ СТРУКТУРНЫЕ БЛОКИ
1. .container - ГЛАВНЫЙ КОНТЕЙНЕР
Назначение: Обёртка всей страницы

Свойства:

display: flex; flex-direction: column; - вертикальный флекс

min-height: 100vh; - минимум на весь экран

background-color: var(--white); - белый фон

Содержит: header, main, nav, модальные окна, плавающие кнопки

На десктопе: max-width: 1200px; + округлённые углы

ВЕРХНЯЯ НАВИГАЦИЯ (HEADER)
2. header - ЛИПКАЯ НАВИГАЦИЯ
Назначение: Верхняя панель навигации

Свойства:

position: sticky; top: 0; z-index: 100;

background: linear-gradient(135deg, rgba(45, 134, 89, 0.95), rgba(76, 168, 118, 0.95));

display: flex; justify-content: space-between;

Содержит: .header-left, .header-center, .header-right, .hamburger

3. .header-left - ЛОГОТИП
Назначение: Заголовок "🌲 Пеликан Алаколь"

Свойства:

h1 { font-size: 1.4em; font-weight: 700; }

На десктопе: font-size: 1.4em;

На мобильном: font-size: 1.1em;

4. .header-center - КНОПКИ НАВИГАЦИИ
Назначение: Контейнер для 5 кнопок (Номера, Активности, Галерея, Погода, Контакты)

Свойства:

display: flex; gap: 8px; flex-wrap: wrap;

На мобильном: order: 3; width: 100%; - переходит на отдельную строку

На десктопе: flex: 1; justify-content: flex-start;

5. .header-btn - КНОПКИ В ХЕДЕРЕ
Назначение: Каждая кнопка навигации (Номера, Активности, etc.)

Свойства:

background: rgba(255, 255, 255, 0.15); - полупрозрачный белый

border: 2px solid rgba(255, 255, 255, 0.3);

border-radius: 8px; padding: 8px 14px;

На hover: background: rgba(255, 255, 255, 0.25); + поднятие на 2px

.active класс: background: rgba(255, 255, 255, 0.3); + свечение

6. .header-right - ПРАВАЯ ЧАСТЬ ХЕДЕРА
Назначение: Кнопка переключения темы

Содержит: .theme-toggle

7. .theme-toggle - КНОПКА ТЕМНОЙ ТЕМЫ
Назначение: Переключение между светлой и тёмной темой

Свойства:

width: 60px; height: 60px;

display: flex; align-items: center; justify-content: center;

cursor: pointer; - стрелка мышки

8. .hamburger - МОБИЛЬНОЕ МЕНЮ (гамбургер)
Назначение: Кнопка меню на мобильных

Свойства:

display: none; - скрыто на десктопе

@media (max-width: 767px) { display: flex; }

3 горизонтальных линии (spans)

При .active: первая линия поворачивается на 45°, вторая исчезает, третья на -45°

9. .nav-mobile - МОБИЛЬНОЕ МЕНЮ (выпадающее)
Назначение: Выпадающее меню на мобильных

Свойства:

display: none; - скрыто по умолчанию

position: absolute; top: 100%; left: 0; right: 0;

При .active: display: flex;

background: linear-gradient(135deg, rgba(45, 134, 89, 0.98), ...)

flex-direction: column; - вертикальное расположение

z-index: 999; - над всем, кроме модалей

ОСНОВНОЙ КОНТЕНТ (MAIN)
10. main - ОСНОВНОЙ КОНТЕЙНЕР КОНТЕНТА
Назначение: Оборачивает весь контент страницы

Свойства:

flex-grow: 1; - занимает всё оставшееся место

padding: 20px; (мобиль) / padding: 60px; (десктоп)

11. .hero-section - ГЕРОИЧЕСКИЙ БАННЕР
Назначение: Вступительный блок с описанием

Содержит: адрес, описание базы

Свойства:

background: linear-gradient(135deg, rgba(45, 134, 89, 0.1), rgba(0, 212, 255, 0.1));

border-radius: 20px;

border-left: 5px solid var(--secondary-green);

padding: 30px; margin-bottom: 30px;

12. h2 - ЗАГОЛОВКИ СЕКЦИЙ
Назначение: Заголовки для Жилья, Активностей, Галереи, etc.

Свойства:

color: var(--primary-green);

border-bottom: 3px solid var(--accent-blue);

font-size: 1.5em;

margin: 30px 0 20px 0;

ФИЛЬТР И ПОИСК
13. .filter-section - СЕКЦИЯ ФИЛЬТРА
Назначение: Блок для поиска и фильтрации номеров

Свойства:

display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

background: var(--white);

border-radius: 15px; padding: 25px;

box-shadow: var(--shadow);

На десктопе: 4 столбца

На мобиле: 1 столбец

14. .filter-group - ГРУППА ПОЛЕЙ ФИЛЬТРА
Назначение: Одна группа (например, "Дата заезда")

Свойства:

display: flex; flex-direction: column;

15. .filter-group label - ПОДПИСЬ ФИЛЬТРА
Назначение: Текст над полем ввода

Цвет: color: var(--primary-green);

Размер: font-size: 0.9em;

16. .filter-group input, select - ПОЛЯ ВВОДА
Назначение: Поля для ввода данных

Свойства:

padding: 10px;

border: 2px solid rgba(45, 134, 89, 0.2);

border-radius: 8px;

На focus: border-color: var(--secondary-green); + свечение

17. .filter-btn - КНОПКА ФИЛЬТРА
Назначение: Кнопка "Применить фильтр"

Свойства:

background: linear-gradient(135deg, var(--primary-green), var(--secondary-green));

color: white; border: none;

padding: 10px 25px; border-radius: 8px;

На hover: поднятие на 2px + тень

СКРОЛИРУЕМЫЕ КАРТОЧКИ
18. .scroll-wrapper - ОБЁРТКА ДЛЯ СКРОЛЛА
Назначение: Контейнер с кнопками навигации

Содержит: .scroll-container и .scroll-nav-btn

Свойства: position: relative; margin-bottom: 30px;

19. .scroll-container - КОНТЕЙНЕР ДЛЯ ПРОКРУТКИ
Назначение: Горизонтальный скролл

Свойства:

display: flex; gap: 20px;

overflow-x: auto; overflow-y: hidden;

scroll-behavior: smooth;

scroll-snap-type: x mandatory;

Скроллбар: кастомный зелёный цвет

20. .scroll-item-rooms - КАРТОЧКА ЖИЛЬЯ
Назначение: Одна карточка номера

Размер:

На мобиле: flex: 0 0 calc(100% - 20px); - полная ширина

На десктопе: flex: 0 0 calc(33.333% - 20px); - 3 в ряд

Свойства:

background: linear-gradient(...);

border-radius: 15px;

border-left: 4px solid var(--secondary-green);

padding: 12px; min-width: 300px;

box-shadow: 0 2px 8px rgba(...);

На hover: тень больше + поднятие на 5px

20.1. .scroll-item-rooms img - ИЗОБРАЖЕНИЕ В КАРТОЧКЕ
Высота: height: 220px;

Размер: width: 50%; - 50% ширины карточки

На hover: transform: scale(1.05); + filter: brightness(0.85);

20.2. .scroll-item-rooms h3 - ЗАГОЛОВОК КАРТОЧКИ
Цвет: color: var(--primary-green);

Размер: font-size: 0.85em;

Отступ: margin: 4px 0 3px 0;

20.3. .scroll-item-rooms p - ОПИСАНИЕ КАРТОЧКИ
Размер: font-size: 0.85em;

Высота строки: line-height: 1.3;

Цвет: color: var(--text-dark);

21. .scroll-item-activities - КАРТОЧКА АКТИВНОСТЕЙ
Идентичен .scroll-item-rooms - такая же структура и стили

Различие: Может использоваться для другого контента

22. .scroll-item-gallery - КАРТОЧКА ГАЛЕРЕИ
Похож на .scroll-item-rooms, но:

padding: 15px; (больше)

Изображение height: 280px; (выше)

width: 70%; (больше)

На hover видна кнопка .photo-overlay

23. .scroll-nav-btn - КНОПКИ НАВИГАЦИИ (< >)
Назначение: Кнопки "предыдущее/следующее"

Свойства:

position: absolute; top: 50%;

width: 45px; height: 45px; border-radius: 50%;

background: linear-gradient(...); color: white;

На hover: transform: scale(1.1);

.prev { left: 0; } - левая кнопка

.next { right: 0; } - правая кнопка

На мобиле: display: none;

24. .photo-overlay - ЗНАЧОК "РАЗВЕРНУТЬ" НА КАРТИНКЕ
Назначение: Иконка лупы при наведении

Свойства:

position: absolute; top: 20px; right: 20px;

width: 50px; height: 50px; border-radius: 50%;

background: rgba(45, 134, 89, 0.9);

opacity: 0; - скрыто

На hover родителя: opacity: 1; - видно

display: flex; - центрирование иконки

ГАЛЕРЕЯ И ЛАЙТБОКС
25. .lightbox - ПОЛНОЭКРАННЫЙ ПРОСМОТР ФОТО
Назначение: Модальное окно для просмотра фото на весь экран

Свойства:

position: fixed; top: 0; left: 0; width: 100%; height: 100%;

background: rgba(0, 0, 0, 0.95);

display: none; - скрыто

При .active: display: flex;

z-index: 3000; - выше всего

26. .lightbox-content - КОНТЕЙНЕР ФОТО
Свойства:

position: relative;

max-width: 90%; max-height: 90vh;

display: flex; align-items: center; justify-content: center;

27. .lightbox-img - БОЛЬШОЕ ФОТО
Свойства:

max-width: 100%; max-height: 85vh;

border-radius: 10px;

28. .lightbox-close - КРЕСТИК ЗАКРЫТИЯ (×)
Свойства:

position: absolute; top: 20px; right: 30px;

font-size: 3em; cursor: pointer;

На hover: transform: rotate(90deg);

29. .lightbox-nav - СТРЕЛКИ ВЛЕВО/ВПРАВО
Свойства:

position: absolute; top: 50%;

width: 50px; height: 50px; border-radius: 50%;

background: rgba(45, 134, 89, 0.3);

display: none; - скрыто

При .lightbox.active: display: flex;

.lightbox-prev { left: 20px; }

.lightbox-next { right: 20px; }

30. .lightbox-counter - СЧЁТЧИК ФОТ (1/5)
Назначение: Показывает текущее фото и всего

Свойства:

position: absolute; bottom: 20px; left: 50%;

transform: translateX(-50%);

color: white; background: rgba(45, 134, 89, 0.3);

МОДАЛЬНЫЕ ОКНА
31. .modal - МОДАЛЬНОЕ ОКНО
Назначение: Окна для контактов, погоды, карты, FAQ

Свойства:

position: fixed; top: 0; left: 0; width: 100%; height: 100%;

background: rgba(0, 0, 0, 0.7);

display: none; - скрыто

При .active: display: flex;

z-index: 2000; - над контентом, но под лайтбоксом

align-items: center; justify-content: center;

32. .modal-content - КОНТЕНТ МОДАЛЬНОГО ОКНА
Назначение: Белый прямоугольник с контентом

Свойства:

background: var(--white);

border-radius: 20px; padding: 30px;

max-width: 95%; max-height: 90vh; overflow-y: auto;

Анимация входа: .slideUp (снизу вверх)

33. .modal-close - КРЕСТИК ЗАКРЫТИЯ МОДАЛИ
Свойства:

position: absolute; top: 15px; right: 20px;

background: none; border: none;

font-size: 2em; cursor: pointer;

color: var(--primary-green);

На hover: transform: rotate(90deg);

КОНТАКТЫ (в модальном окне)
34. .contact-grid - СЕТКА КАРТОЧЕК КОНТАКТОВ
Свойства:

display: grid;

grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));

gap: 20px; margin-top: 20px;

На мобиле: 1 столбец

На десктопе: 2-3 столбца

35. .contact-card - ОДНА КАРТОЧКА КОНТАКТА
Назначение: Карточка для телефона, Telegram, Email, etc.

Свойства:

background: linear-gradient(135deg, rgba(45, 134, 89, 0.1), ...);

padding: 20px; border-radius: 12px;

border-left: 4px solid var(--secondary-green);

На hover: тень больше + поднятие на 3px

36. .contact-card h3 - ЗАГОЛОВОК КОНТАКТА
Свойства:

display: flex; align-items: center; gap: 10px;

color: var(--primary-green); font-size: 1.1em;

Иконка: font-size: 1.5em;

37. .contact-buttons - ГРУППА КНОПОК
Свойства:

display: flex; flex-direction: column; gap: 12px;

38. .contact-btn - КНОПКА ДЕЙСТВИЯ
Свойства:

background: linear-gradient(135deg, var(--primary-green), ...);

color: white; padding: 12px 16px;

border-radius: 8px; border: none; cursor: pointer;

display: flex; align-items: center; justify-content: center; gap: 10px;

На hover: поднятие на 2px + тень

На active: масштаб 0.98

39. .phone-item - СТРОКА С ТЕЛЕФОНОМ
Свойства:

display: flex; justify-content: space-between;

padding: 8px 0; border-bottom: 1px solid rgba(...);

40. .phone-label - ПОДПИСЬ (Основной, Доп.)
Свойства:

font-weight: 500; color: var(--primary-green);

41. .phone-number - НОМЕР ТЕЛЕФОНА
Свойства:

color: var(--text-dark); font-family: monospace;

Моношрифт для ровного отступа цифр

42. .copy-notification - УВЕДОМЛЕНИЕ О КОПИРОВАНИИ
Назначение: "✓ Скопировано!" сообщение

Свойства:

position: fixed; bottom: 20px; right: 20px;

background: var(--primary-green); color: white;

padding: 15px 20px; border-radius: 8px;

Анимация: слайд в (0.3s) + слайд вверх через 2.7s

ПОГОДА (в модальном окне)
43. .weather-grid - СЕТКА ПРОГНОЗА
Свойства:

display: grid;

grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));

gap: 15px; margin-top: 20px;

На десктопе: 5 столбцов (5 дней)

44. .weather-card - КАРТОЧКА ОДНОГО ДНЯ
Свойства:

background: linear-gradient(...);

padding: 20px; border-radius: 12px;

text-align: center;

На hover: поднятие на 5px + новая тень

45. .weather-day - ДЕНЬ НЕДЕЛИ
Свойства:

font-weight: 600; color: var(--secondary-green);

46. .weather-icon - ИКОНКА ПОГОДЫ
Свойства:

font-size: 2.5em; display: block;

47. .weather-temp - ТЕМПЕРАТУРА
Свойства:

font-size: 1.6em; font-weight: 700;

color: var(--primary-green);

48. .weather-label - ОПИСАНИЕ ПОГОДЫ
Свойства:

font-size: 0.85em; color: var(--text-dark);

КАРТА (в модальном окне)
49. #map - CANVAS КАРТЫ
Свойства:

width: 100%; height: 400px;

border-radius: 12px;

box-shadow: var(--shadow); margin-top: 20px;

На мобиле: height: 300px;

50. .map-tabs - КНОПКИ ТАБОВ
Свойства:

display: flex; gap: 10px; flex-wrap: wrap;

51. .map-tab-btn - ОДНА КНОПКА ТАБА
Свойства:

background: rgba(45, 134, 89, 0.1);

border: 2px solid var(--primary-green);

color: var(--primary-green); padding: 10px 20px;

На hover: background: rgba(45, 134, 89, 0.2);

При .active: background: var(--primary-green); color: white;

52. .route-card - КАРТОЧКА МАРШРУТА
Свойства:

background: linear-gradient(...);

border-radius: 12px; border-left: 4px solid ...

padding: 15px; margin-bottom: 15px;

53. .route-card h4 - НАЗВАНИЕ МАРШРУТА
Свойства:

display: flex; align-items: center; gap: 8px;

color: var(--primary-green);

FAQ (в модальном окне)
54. .faq-item - ОДИН ВОПРОС-ОТВЕТ
Свойства:

background: linear-gradient(...);

border-radius: 12px; border-left: 4px solid ...

margin-bottom: 15px; overflow: hidden;

55. .faq-question - ВОПРОС (кликабельный)
Свойства:

padding: 20px;

background: linear-gradient(...);

cursor: pointer;

display: flex; justify-content: space-between; align-items: center;

font-weight: 600; color: var(--primary-green);

На hover: чуть светлее

56. .faq-icon - СТРЕЛКА РАСКРЫТИЯ
Свойства:

font-size: 1.2em; transition: transform 0.3s;

При .faq-item.active .faq-icon: transform: rotate(180deg);

57. .faq-answer - ОТВЕТ (скрытый/видимый)
Свойства:

padding: 0 20px;

max-height: 0; overflow: hidden;

При .faq-item.active .faq-answer: padding: 20px; max-height: 500px;

Плавный переход: transition: all 0.3s ease;

ПЛАВАЮЩИЕ КНОПКИ
58. .floating-buttons - КОНТЕЙНЕР ПЛАВАЮЩИХ КНОПОК
Назначение: Группа кнопок в углу экрана

Свойства:

position: fixed; bottom: 30px; right: 30px;

display: flex; flex-direction: column; gap: 15px;

z-index: 500; - выше контента, но ниже модалей

На мобиле: bottom: 80px; right: 15px; gap: 10px;

59. .floating-btn - ОДНА ПЛАВАЮЩАЯ КНОПКА
Назначение: Кнопка (погода, карта, контакты, FAQ)

Свойства:

border-radius: 50%; - круглая

width: 60px; height: 60px;

display: flex; align-items: center; justify-content: center;

box-shadow: var(--shadow-lg);

На hover: transform: scale(1.1);

На мобиле: width: 50px; height: 50px;

Цветовые варианты:

.weather-btn: оранжевый градиент

.map-btn: голубой градиент

.contact-btn: розовый градиент

.faq-btn: фиолетовый градиент

НИЖНЯЯ НАВИГАЦИЯ
60. nav - НИЖНЯЯ НАВИГАЦИЯ
Назначение: Горизонтальное меню внизу

Свойства:

background: linear-gradient(90deg, var(--primary-green), ...);

display: flex; justify-content: center;

На мобиле: flex-direction: column;

61. nav a - ССЫЛКА В НИЖНЕЙ НАВИГАЦИИ
Свойства:

color: white; text-decoration: none;

padding: 15px 20px; display: flex;

align-items: center; gap: 8px;

border-right: 1px solid rgba(255, 255, 255, 0.2);

На hover: background: rgba(255, 255, 255, 0.15);

На мобиле: flex: 1; text-align: center; justify-content: center;

АДАПТИВНОСТЬ
МЕДИА-ЗАПРОСЫ:
@media (max-width: 767px) - МОБИЛЬНЫЕ УСТРОЙСТВА
Горячие изменения:

Header padding: 12px 15px

Main padding: 20px

Все элементы на полную ширину

Скроллируемые элементы: 100% ширины

Плавающие кнопки меньше

Нижняя навигация: вертикальная колонка

@media (min-width: 768px) - ДЕСКТОПНЫЕ УСТРОЙСТВА
Горячие изменения:

Container: max-width: 1200px; + border-radius

Header padding: 20px 40px

Main padding: 60px

Скролл элементы: 33% ширины (3 в ряд)

Фон: градиент 135°

Нижняя навигация: горизонтальная

ТЁМНАЯ ТЕМА
body.dark-mode - АЛЬТЕРНАТИВНЫЕ ЦВЕТА
css
body.dark-mode {
  --background-light: #1a1a1a;      /* Чёрный фон */
  --white: #2a2a2a;                 /* Тёмно-серый вместо белого */
  --text-dark: #e0e0e0;             /* Светлый текст */
}
Все переменные применяются автоматически

Переключение через кнопку .theme-toggle

Состояние сохраняется в localStorage

АНИМАЦИИ И ПЕРЕХОДЫ
.slideUp - ПОЯВЛЕНИЕ СНИЗУ
css
@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
Где: модальные окна

.fadeIn - ПЛАВНОЕ ПОЯВЛЕНИЕ
css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
Где: модальные окна, лайтбокс

.slideDown - ПОЯВЛЕНИЕ С ВЕРХУ
css
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
Где: мобильное меню

.slideIn, .slideOut - УВЕДОМЛЕНИЕ
css
@keyframes slideIn {
  from { transform: translateX(400px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(400px); opacity: 0; }
}
Где: уведомление о копировании

ТАБЛИЦА БЫСТРОГО ПОИСКА
Класс	Назначение	Где используется
.container	Главный контейнер	Весь сайт
header	Верхняя навигация	Вверху страницы
.header-btn	Кнопки навигации	Header
main	Основной контент	После header
.hero-section	Вступительный баннер	Начало main
.scroll-container	Горизонтальный скролл	Жилье, Активности, Галерея
.scroll-item-rooms	Карточка номера	Scroll для номеров
.scroll-item-activities	Карточка активности	Scroll для активностей
.scroll-item-gallery	Карточка галереи	Scroll для фото
.modal	Модальное окно	Контакты, Погода, Карта, FAQ
.lightbox	Просмотр фото	Галерея
.contact-card	Карточка контакта	Modal контактов
.weather-card	Карточка дня	Modal погоды
.faq-item	Вопрос-ответ	Modal FAQ
.floating-btn	Плавающие кнопки	Углы экрана
nav	Нижняя навигация	Внизу страницы
.hamburger	Мобильное меню	Header на мобиле
.nav-mobile	Выпадающее меню	Под header на мобиле
ОСНОВНЫЕ ЦВЕТА И ИХ ИСПОЛЬЗОВАНИЕ
Цвет	Код	Используется для
Основной зелёный	#2d8659	Header, кнопки, заголовки
Вторичный зелёный	#4ca876	Границы, акценты
Синий	#0077b6	Подчёркивание h2, элементы
Голубой	#00d4ff	Фоны, подсвечивание
Светлый фон	#f5faf8	Background страницы
Белый	#fff	Карточки, модальные окна
Тёмный текст	#2c3e50	Весь текст
Тень	rgba(...)	Все элементы со снимком
КРАТКАЯ СТРУКТУРА БЛОКОВ
text
.container
├── header
│   ├── .header-left (логотип)
│   ├── .header-center (кнопки навигации)
│   ├── .header-right (кнопка темы)
│   ├── .hamburger (мобильное меню)
│   └── .nav-mobile (выпадающее меню)
│
├── main
│   ├── .hero-section (описание)
│   ├── h2 + .scroll-wrapper (все категории)
│   │   ├── .scroll-container
│   │   │   ├── .scroll-item-rooms
│   │   │   ├── .scroll-item-activities
│   │   │   ├── .scroll-item-gallery
│   │   │   └── .scroll-nav-btn (.prev, .next)
│
├── .floating-buttons
│   ├── .floating-btn.weather-btn
│   ├── .floating-btn.map-btn
│   ├── .floating-btn.contact-btn
│   └── .floating-btn.faq-btn
│
├── nav (нижняя навигация)
│
├── .modal#contactsModal
│   └── .modal-content
│       ├── .contact-grid
│       │   └── .contact-card
│
├── .modal#weatherModal
│   └── .modal-content
│       └── .weather-grid
│           └── .weather-card
│
├── .modal#mapModal
│   └── .modal-content
│       ├── .map-tabs
│       └── #map
│
├── .modal#faqModal
│   └── .modal-content
│       └── .faq-item
│           ├── .faq-question
│           └── .faq-answer
│
└── .lightbox
    └── .lightbox-content
        ├── .lightbox-img
        ├── .lightbox-close
        ├── .lightbox-nav
        └── .lightbox-counter
ГОТОВО! 📚 Вот полная документация всех CSS блоков и их назначения!
