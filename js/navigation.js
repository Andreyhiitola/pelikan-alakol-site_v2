// navigation.js - Функции навигации для Google Maps и Яндекс Карт

// Координаты отеля
const HOTEL_LOCATION = {
    lat: 45.953120,
    lng: 81.568958
};

/**
 * Открыть маршрут в Google Maps
 */
function openGoogleMaps(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

/**
 * Открыть маршрут в Яндекс Картах
 */
function openYandexMaps(lat, lng) {
    const yandexNaviUrl = `yandexnavi://build_route_on_map?lat_to=${lat}&lon_to=${lng}`;
    const yandexMapsUrl = `https://yandex.ru/maps/?rtext=~${lat},${lng}&rtt=auto`;
    
    const now = Date.now();
    window.location.href = yandexNaviUrl;
    
    setTimeout(function() {
        if (Date.now() - now < 1000) {
            window.open(yandexMapsUrl, '_blank');
        }
    }, 500);
}

// Делаем функции доступными глобально для onclick
window.openGoogleMaps = openGoogleMaps;
window.openYandexMaps = openYandexMaps;

/**
 * Добавить обработчики событий на кнопки навигации
 */
function initNavigationButtons() {
    document.querySelectorAll('[data-navigation="google"]').forEach(btn => {
        btn.addEventListener('click', () => openGoogleMaps(HOTEL_LOCATION.lat, HOTEL_LOCATION.lng));
    });
    
    document.querySelectorAll('[data-navigation="yandex"]').forEach(btn => {
        btn.addEventListener('click', () => openYandexMaps(HOTEL_LOCATION.lat, HOTEL_LOCATION.lng));
    });
}

// Инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigationButtons);
} else {
    initNavigationButtons();
}
