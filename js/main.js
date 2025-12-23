// ========================================
// ГЛАВНЫЙ JS ФАЙЛ - main.js
// ========================================

console.log('🚀 Приложение запускается...');

async function loadJSON(filename) {
  try {
    const response = await fetch(`./${filename}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log(`✅ Загружено: ${filename}`);
    return data;
  } catch (error) {
    console.error(`❌ Ошибка ${filename}:`, error);
    return null;
  }
}

async function initializeData() {
  console.log('🔄 Загружаю данные...');

  window.data = {
    accommodation: await loadJSON('accommodation.json'),
    activities: await loadJSON('activities.json'),
    menu: await loadJSON('menu.json'),
    gallery: await loadJSON('gallery.json'),
    reviews: await loadJSON('reviews.json'),
    contacts: await loadJSON('contacts.json'),
    offer: await loadJSON('offer.json'),
    booking: await loadJSON('booking.json')
  };

  console.log('✅ Все данные загружены:', window.data);

  // Вызываем функции рендеринга если они есть
  if (window.data.accommodation && window.renderAccommodation) {
    window.renderAccommodation(window.data.accommodation);
  }
  if (window.data.activities && window.renderActivities) {
    window.renderActivities(window.data.activities);
  }
  if (window.data.menu && window.renderMenu) {
    window.renderMenu(window.data.menu);
  }
  if (window.data.gallery && window.renderGallery) {
    window.renderGallery(window.data.gallery);
  }
  if (window.data.reviews && window.renderReviews) {
    window.renderReviews(window.data.reviews);
  }
  if (window.data.offer && window.renderOffers) {
    window.renderOffers(window.data.offer);
  }
  // Рендер условий бронирования (данные в корне booking.json)
  if (window.data.booking && window.renderBookingConditions) {
    window.renderBookingConditions(window.data.booking);
  }
}

// Аккордеон для .faq-item (в том числе блока условий бронирования)
document.addEventListener('click', (event) => {
  const question = event.target.closest('.faq-question');
  if (!question) return;

  const item = question.closest('.faq-item');
  if (!item) return;

  item.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM загружен');
  initializeData();
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq-item.active").forEach(item => {
    item.classList.remove("active");
  });
  console.log("✅ Аккордеоны закрыты");
});

