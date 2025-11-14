// ========================================
// ГЛАВНЫЙ JS ФАЙЛ - main.js
// Инициализация приложения
// ========================================

console.log('🚀 Приложение запускается...');

/**
 * Переключение темы (светлая/темная)
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    console.log('🌙 Dark mode:', isDark ? 'включен' : 'выключен');
}

/**
 * Переключение мобильного меню
 */
function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('navMobile');

    if (hamburger && navMobile) {
        hamburger.classList.toggle('active');
        navMobile.classList.toggle('active');
    }
}

/**
 * Закрытие мобильного меню
 */
function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('navMobile');

    if (hamburger) hamburger.classList.remove('active');
    if (navMobile) navMobile.classList.remove('active');
}

/**
 * Установка активной кнопки меню
 */
function setActive(element) {
    const buttons = document.querySelectorAll('.header-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');
}

/**
 * Прокрутка контейнера (для галереи и т.д.)
 */
function scrollItems(container, direction) {
    const scrollContainer = document.getElementById(container + 'Container');
    if (!scrollContainer) return;

    const scrollAmount = 300;
    if (direction === -1) {
        scrollContainer.scrollLeft -= scrollAmount;
    } else {
        scrollContainer.scrollLeft += scrollAmount;
    }
}

/**
 * Фильтр номеров
 */
function filterRooms() {
    const checkIn = document.getElementById('checkIn')?.value;
    const checkOut = document.getElementById('checkOut')?.value;
    const guests = document.getElementById('guests')?.v
