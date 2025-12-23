// ========================================
// ✅ js/offers.js — ПОДСВЕТКА КНОПОК + АВТОПЕРЕХОД В БЛОКИ АКЦИИ/ОТЗЫВЫ
// ========================================
//
// ИНСТРУКЦИЯ:
// 1. ENABLE_PROMO_HIGHLIGHT = true  → ВКЛЮЧИТЬ подсветку + автопереход
// 2. ENABLE_PROMO_HIGHLIGHT = false → ОТКЛЮЧИТЬ
// ========================================

const ENABLE_PROMO_HIGHLIGHT = true;

// ✅ 1. ПОДСВЕТКА ТОЛЬКО КНОПОК "АКЦИИ" + "ОТЗЫВЫ"
function highlightPromoButtons() {
    if (!ENABLE_PROMO_HIGHLIGHT) return;
    
    document.querySelectorAll('a, li a, nav a, .menu a, .mobile-menu a').forEach(el => {
        const text = el.textContent.toLowerCase();
        const href = el.getAttribute('href') || '';
        
        // 🔥 АКЦИИ
        if ((text.includes('акци') || href.includes('offers')) && 
            !el.classList.contains('promo-highlighted')) {
            el.classList.add('promo-highlighted');
            if (!el.innerHTML.startsWith('🔥')) el.innerHTML = '🔥 ' + el.innerHTML;
            autoScrollToOffers(); // Автопереход
        }
        
        // ⭐ ОТЗЫВЫ
        if ((text.includes('отзыв') || href.includes('reviews')) && 
            !el.classList.contains('promo-highlighted')) {
            el.classList.add('promo-highlighted');
            if (!el.innerHTML.startsWith('⭐')) el.innerHTML = '⭐ ' + el.innerHTML;
            autoScrollToReviews(); // Автопереход
        }
    });
}

// ✅ 2. АВТОПЕРЕХОД В БЛОК АКЦИИ
function autoScrollToOffers() {
    const offersSection = document.querySelector('#offers, [id*="offer"], .offers-section');
    if (offersSection) {
//         offersSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ✅ 3. АВТОПЕРЕХОД В БЛОК ОТЗЫВЫ
function autoScrollToReviews() {
    const reviewsSection = document.querySelector('#reviews, [id*="review"], .reviews-section');
    if (reviewsSection) {
//         reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ✅ CSS ДЛЯ ПОДСВЕТКИ КНОПОК
if (!document.querySelector('#promo-style')) {
    const style = document.createElement('style');
    style.id = 'promo-style';
    style.textContent = `
        .promo-highlighted {
            background: linear-gradient(135deg, #ff4444, #ff6b6b) !important;
            color: white !important;
            box-shadow: 0 0 25px rgba(255,68,68,0.8) !important;
            border-radius: 15px !important;
            padding: 12px 20px !important;
            margin: 5px 0 !important;
            font-weight: bold !important;
            font-size: 16px !important;
            animation: glow 2s infinite alternate !important;
            position: relative !important;
            z-index: 1000 !important;
        }
        .promo-highlighted[href*="#reviews"],
        .promo-highlighted:has([href*="#reviews"]) {
            background: linear-gradient(135deg, #ffaa00, #ffdd44) !important;
            box-shadow: 0 0 25px rgba(255,170,0,0.8) !important;
        }
        @keyframes glow {
            0% { 
                box-shadow: 0 0 20px rgba(255,68,68,0.7), 0 0 0 rgba(255,255,255,0.5);
            }
            100% { 
                box-shadow: 0 0 30px rgba(255,68,68,1), 0 0 20px rgba(255,255,255,0.3);
                transform: scale(1.05);
            }
        }
    `;
    document.head.appendChild(style);
}

// ✅ ЗАПУСК ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(highlightPromoButtons, 500); // Ждем загрузки меню
});

// ✅ ГАМБУРГЕР МЕНЮ
document.addEventListener('click', (e) => {
    if (e.target.closest('.hamburger, .menu-toggle, .mobile-menu-toggle')) {
        setTimeout(highlightPromoButtons, 200);
    }
});

// ✅ ОСНОВНАЯ ФУНКЦИЯ АКЦИЙ (ваш код)
async function loadOffers() {
    try {
        const response = await fetch('offer.json');
        if (!response.ok) throw new Error('Ошибка загрузки offer.json');
        const data = await response.json();
        console.log(`✅ Offers: загружено ${data.length} шт.`);
    } catch (error) {
        console.error('Ошибка акций:', error);
    }
}

loadOffers();
