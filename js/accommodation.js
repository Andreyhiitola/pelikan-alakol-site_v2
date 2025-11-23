function renderAccommodation(data) {
  const container = document.getElementById('roomsContainer');
  if (!container) return;

  container.innerHTML = '';

  const rooms = Array.isArray(data) ? data : (data.accommodations || []);

  rooms.forEach(room => {
    if (!room.id || !room.name) {
      console.warn('Пропущена некорректная карточка', room);
      return;
    }
    const price = Number(room.price);
    if (isNaN(price) || price <= 0) {
      console.warn(`Пропущена карточка с некорректной ценой для id=${room.id}`);
      return;
    }

    const card = document.createElement('div');
    card.className = 'scroll-item accommodation-card'; // добавлен класс для CSS

    const link = document.createElement('a');
    link.href = `accommodation.html?id=${encodeURIComponent(room.id)}`;
    link.style.textDecoration = 'none';
    link.style.color = 'inherit';

    const imgSrc = room.imageThumb || room.imageFull || room.image;
    if (imgSrc) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = room.name;
      img.style.height = '150px';
      img.style.objectFit = 'cover';
      img.style.width = '70%';
      img.onerror = () => {
        img.src = './images/accommodation/placeholder.jpg';
      };
      link.appendChild(img);
    }

    const h3 = document.createElement('h3');
    h3.textContent = `${room.icon || '🏠'} ${room.name}`;
    link.appendChild(h3);

    if (room.description) {
      const p = document.createElement('p');
      p.textContent = room.description;
      p.className = 'accommodation-description'; // добавлен класс для CSS обрезки
      link.appendChild(p);
    }

    const pPrice = document.createElement('p');
    const strong = document.createElement('strong');
    strong.style.color = 'var(--primary-green)';
    strong.style.fontSize = '1.1em';
    strong.textContent = `от ${price} ₸ / ночь`;
    pPrice.appendChild(strong);
    link.appendChild(pPrice);

    card.appendChild(link);
    container.appendChild(card);
  });

  console.log(`✅ Accommodation: ${rooms.length} номеров (валидных)`);
}

function loadAccommodationData(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      renderAccommodation(data);
    })
    .catch(error => {
      const container = document.getElementById('roomsContainer');
      if (container) {
        container.innerHTML = `<div class="error-message" style="color:red;">Ошибка загрузки данных: ${error.message}</div>`;
      }
      console.error('Ошибка загрузки JSON:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadAccommodationData('accommodation.json'); // Укажите правильный путь к JSON
});
