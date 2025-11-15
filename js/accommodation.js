
accommodation-final.js
// ========================================
// РЕНДЕРИНГ ACCOMMODATION (НОМЕРА)
// ========================================

/**
 * Рендерит список номеров.
 * Поддерживает два формата данных:
 * 1) массив объектов: [{...}, {...}]
 * 2) объект: { accommodations: [{...}, {...}] }
 */
function renderAccommodation(data) {
  const container = document.getElementById('roomsContainer');
  
  if (!container) {
    console.error('❌ Контейнер roomsContainer не найден на странице');
    return;
  }

  // Поддержка двух форматов данных
  let rooms = [];

  if (Array.isArray(data)) {
    rooms = data;
  } else if (data && Array.isArray(data.accommodations)) {
    rooms = data.accommodations;
  }

  if (!rooms.length) {
    console.error('❌ Нет данных для accommodation или массив пуст');
    container.innerHTML = '<p style="color: red;">Нет доступных номеров</p>';
    return;
  }

  // Очистить контейнер перед отрисовкой
  container.innerHTML = '';

  // Рендеринг через создание элементов DOM
  rooms.forEach((room, index) => {
    // Безопасная обработка полей
    const name = room?.name ?? 'Номер';
    const icon = room?.icon ?? '🏠';
    const image = room?.image ?? '';
    const description = room?.description ?? '';
    const price = room?.price ?? '';
    const amenities = Array.isArray(room?.amenities) ? room.amenities : [];

    // Создаем карточку
    const card = document.createElement('div');
    card.className = 'scroll-item';

    // Добавляем photo-overlay
    const overlay = document.createElement('div');
    overlay.className = 'photo-overlay';
    overlay.innerHTML = '<i class="fas fa-expand"></i>';
    card.appendChild(overlay);

    // Фото
    if (image) {
      const img = document.createElement('img');
      img.src = image;
      img.alt = name;
      img.style.height = '250px';
      img.style.objectFit = 'cover';
      card.appendChild(img);
    } else {
      // Placeholder если фото нет
      const placeholder = document.createElement('div');
      placeholder.style.height = '250px';
      placeholder.style.display = 'flex';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      placeholder.style.background = '#eee';
      placeholder.style.color = '#666';
      placeholder.textContent = 'Нет изображения';
      card.appendChild(placeholder);
    }

    // Заголовок
    const h3 = document.createElement('h3');
    h3.textContent = `${icon} ${name}`;
    card.appendChild(h3);

    // Описание
    if (description) {
      const pDesc = document.createElement('p');
      pDesc.textContent = description;
      card.appendChild(pDesc);
    }

    // Удобства
    if (amenities.length > 0) {
      const ul = document.createElement('ul');
      ul.className = 'infra-features';
      amenities.forEach(a => {
        const li = document.createElement('li');
        li.textContent = `✓ ${a}`;
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }

    // Цена
    if (price) {
      const pPrice = document.createElement('p');
      const strong = document.createElement('strong');
      strong.style.color = 'var(--primary-green)';
      strong.style.fontSize = '1.1em';
      strong.textContent = `от ${price} / ночь`;
      pPrice.appendChild(strong);
      card.appendChild(pPrice);
    }

    container.appendChild(card);
  });

  console.log(`✅ Accommodation загружены и отрисованы (${rooms.length} номеров)`);
}

// Экспорт функции для использования в main.js
window.renderAccommodation = renderAccommodation;
