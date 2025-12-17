window.renderBookingConditions = function (data) {
  const container = document.getElementById('bookingConditionsContainer');
  if (!container || !data) return;

  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'booking-block';

  const inner = document.createElement('div');
  inner.className = 'booking-inner';

  // Заголовок ВНИМАНИЕ сверху
  if (data.warningTitle) {
    const titleP = document.createElement('p');
    titleP.className = 'booking-warning-title';
    titleP.textContent = data.warningTitle;
    inner.appendChild(titleP);
  }

  // Абзацы
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
