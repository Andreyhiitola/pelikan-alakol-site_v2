// booking.js

console.log('✅ booking.js загружен');

// Рендер условий бронирования
window.renderBookingConditions = function (data) {
  const container = document.getElementById('bookingConditionsContainer');
  if (!container || !data) {
    console.warn('bookingConditionsContainer или данные для условий не найдены');
    return;
  }

  // Очищаем контейнер
  container.innerHTML = '';

  // Внешний блок
  const wrapper = document.createElement('div');
  wrapper.className = 'booking-block';

  // Внутренний блок
  const inner = document.createElement('div');
  inner.className = 'booking-inner';

  // Заголовок "ВНИМАНИЕ"
  if (data.warningTitle) {
    const titleP = document.createElement('p');
    titleP.className = 'booking-warning-title';
    titleP.textContent = data.warningTitle;
    inner.appendChild(titleP);
  }

  // Абзацы с условиями
  if (Array.isArray(data.paragraphs)) {
    data.paragraphs.forEach(text => {
      const p = document.createElement('p');
      p.className = 'booking-paragraph';
      p.textContent = text;
      inner.appendChild(p);
    });
  }

  wrapper.appendChild(inner);
  container.appendChild(wrapper);
};
