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

  let rooms = Array.isArray(data) ? data : (data.accommodations || []);
  
  if (!rooms.length) {
    console.error('❌ нет данных accommodation');
    return;
  }

  container.innerHTML = '';

  rooms.forEach(room => {
    const card = document.createElement('div');
    card.className = 'scroll-item';

    const overlay = document.createElement('div');
    overlay.className = 'photo-overlay';
    overlay.innerHTML = '<i class="fas fa-expand"></i>';
    card.appendChild(overlay);

    if (room.image) {
      const img = document.createElement('img');
      img.src = room.image;
      img.alt = room.name;
      img.style.height = '250px';
      img.style.objectFit = 'cover';
      card.appendChild(img);
    }

    const h3 = document.createElement('h3');
    h3.textContent = `${room.icon || '🏠'} ${room.name}`;
    card.appendChild(h3);

    if (room.description) {
      const p = document.createElement('p');
      p.textContent = room.description;
      card.appendChild(p);
    }

    if (room.amenities && room.amenities.length > 0) {
      const ul = document.createElement('ul');
      ul.className = 'infra-features';
      room.amenities.forEach(a => {
        const li = document.createElement('li');
        li.textContent = `✓ ${a}`;
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }

    if (room.price) {
      const pPrice = document.createElement('p');
      const strong = document.createElement('strong');
      strong.style.color = 'var(--primary-green)';
      strong.style.fontSize = '1.1em';
      strong.textContent = `от ${room.price} / ночь`;
      pPrice.appendChild(strong);
      card.appendChild(pPrice);
    }

    container.appendChild(card);
  });

  console.log(`✅ Accommodation: ${rooms.length} номеров`);
}

window.renderAccommodation = renderAccommodation;
