// ========================================
// РЕНДЕРИНГ ACCOMMODATION (НОМЕРА)
// ========================================

function renderAccommodation(data) {
  const container = document.getElementById('roomsContainer');
  
  if (!container) {
    console.error('❌ roomsContainer не найден');
    return;
  }

  if (!data) {
    console.error('❌ data не передана');
    return;
  }

  // Если приходит просто массив — берем его, если объект с полем accommodations — берем его
  const rooms = Array.isArray(data) ? data : (data.accommodations || []);
  
  if (!rooms.length) {
    console.error('❌ нет данных accommodation');
    container.innerHTML = '<div class="error-message">Номера не найдены</div>';
    return;
  }

  container.innerHTML = '';

  rooms.forEach(room => {
    const card = document.createElement('div');
    card.className = 'scroll-item';

    // Ссылка на страницу номера
    const link = document.createElement('a');
    link.href = `accommodation.html?id=${encodeURIComponent(room.id)}`; // ← ВАЖНО: тут новое имя файла
    link.style.textDecoration = 'none';
    link.style.color = 'inherit';

    // Картинка
    const imgSrc = room.imageThumb || room.imageFull || room.image;
    if (imgSrc) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = room.name;
      img.style.height = '250px';
      img.style.objectFit = 'cover';
      img.onerror = () => {
        img.src = './images/placeholder.jpg';
      };
      link.appendChild(img);
    }

    // Заголовок
    const h3 = document.createElement('h3');
    h3.textContent = `${room.icon || '🏠'} ${room.name}`;
    link.appendChild(h3);

    // Краткое описание (description)
    if (room.description) {
      const p = document.createElement('p');
      p.textContent = room.description;
      link.appendChild(p);
    }

    // Цена
    if (room.price) {
      const pPrice = document.createElement('p');
      const strong = document.createElement('strong');
      strong.style.color = 'var(--primary-green)';
      strong.style.fontSize = '1.1em';
      strong.textContent = `от ${room.price} ₸ / ночь`;
      pPrice.appendChild(strong);
      link.appendChild(pPrice);
    }

    // Всё содержание внутрь ссылки
    card.appendChild(link);
    container.appendChild(card);
  });

  console.log(`✅ Accommodation: ${rooms.length} номеров`);
}

window.renderAccommodation = renderAccommodation;
