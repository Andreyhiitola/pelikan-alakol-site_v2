/* ============================================
   MAIN.JS - Главный файл инициализации
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🐦 Пеликан Алаколь - сайт загружен');

    // Инициализация всех модулей
    initNavigation();
    loadAllContent();
    setupScrollBehavior();
});

/**
 * Инициализация навигации и меню
 */
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle меню на мобильных
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Активная ссылка при скролле
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
    });
}

/**
 * Обновление активной ссылки навигации
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });

            const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

/**
 * Загрузка всего контента
 */
function loadAllContent() {
    loadWeather();
    loadAccommodations();
    loadActivities();
    loadMenu();
    loadGallery();
    loadReviews();
    loadContacts();
}

/**
 * Smooth scroll поведение
 */
function setupScrollBehavior() {
    // Header sticky behavior
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow)';
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
        }
    });
}

/**
 * Универсальная функция загрузки JSON
 */
async function loadJSON(filename) {
    try {
        const response = await fetch(`/public/data/${filename}.json`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${filename}.json`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Ошибка загрузки ${filename}.json:`, error);
        return null;
    }
}

/**
 * Функция для позвонить
 */
function callPhone() {
    window.location.href = 'tel:+77472621234';
}

/**
 * Функция для отправки на email
 */
function sendEmail(email) {
    window.location.href = `mailto:${email}`;
}

/**
 * Открыть модальное окно
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Закрыть модальное окно
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Закрыть модальное окно по клику за его границы
 */
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        const modal = event.target;
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

/**
 * Форматирование цены
 */
function formatPrice(price) {
    return new Intl.NumberFormat('ru-KZ', {
        style: 'currency',
        currency: 'KZT',
        minimumFractionDigits: 0
    }).format(price);
}

/**
 * Форматирование даты
 */
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        locale: 'ru-KZ'
    };
    return new Date(dateString).toLocaleDateString('ru-KZ', options);
}

/**
 * Создание звезд рейтинга
 */
function createRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return stars;
}

console.log('✅ main.js загружен');
