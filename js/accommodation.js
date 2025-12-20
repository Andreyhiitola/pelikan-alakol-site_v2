function renderAccommodation(data) {
  const container = document.getElementById('roomsContainer');
  if (!container) return;

  container.innerHTML = '';

  const rooms = Array.isArray(data) ? data : (data.accommodations || []);

  rooms.forEach(room => {
    // Проверка на валидность данных
    if (!room.id || !room.name) {
      console.warn('Пропущена некорректная карточка', room);
      return;
    }
    
    // Создаем карточку
    const card = document.createElement('div');
    card.className = 'scroll-item accommodation-card';

    const link = document.createElement('a');
    link.href = `accommodation.html?id=${encodeURIComponent(room.id)}`;
    link.style.textDecoration = 'none';
    link.style.color = 'inherit';

    // Картинка
    const imgSrc = room.imageThumb || room.imageFull || room.image;
    if (imgSrc) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = room.name;
      // убрали height/width/object-fit/borderRadius — всё уедет в CSS
      img.onerror = () => {
        img.style.display = 'none'; // Просто скрыть
      };
      link.appendChild(img);
    }

    // Заголовок
    const h3 = document.createElement('h3');
    h3.textContent = `${room.icon || '🏠'} ${room.name}`;
    h3.style.marginTop = '10px';
    link.appendChild(h3);

    // Описание (обрезанное)
    if (room.description) {
      const p = document.createElement('p');
      p.textContent = room.description;
      p.className = 'accommodation-description'; 
      p.style.fontSize = '0.9em';
      p.style.color = '#666';
      p.style.margin = '5px 0';
      p.style.display = '-webkit-box';
      p.style.webkitLineClamp = '3';
      p.style.webkitBoxOrient = 'vertical';
      p.style.overflow = 'hidden';
      link.appendChild(p);
    }

    // Цена (обновлённый блок)
    const pPrice = document.createElement('p');
    const strong = document.createElement('strong');
    strong.style.color = 'var(--primary-green, #2d8659)';
    strong.style.fontSize = '1.1em';

    if (room.priceRange) {
      strong.textContent = `от ${room.priceRange} ₸ / сутки`;
    } else {
      strong.textContent = 'Цена по запросу';
    }

    pPrice.appendChild(strong);
    link.appendChild(pPrice);

    card.appendChild(link);
    container.appendChild(card);
  });

  console.log(`✅ Accommodation: ${rooms.length} номеров загружено`);
}

function loadAccommodationData(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      renderAccommodation(data);
    })
    .catch(error => {
      const container = document.getElementById('roomsContainer');
      if (container) {
        container.innerHTML = `<div style="color:red; padding:20px;">Ошибка загрузки: ${error.message}</div>`;
      }
      console.error('Ошибка загрузки номеров:', error);
    });
}

// ЗАПУСК
document.addEventListener('DOMContentLoaded', () => {
  loadAccommodationData('accommodation.json'); 
});
