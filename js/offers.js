function renderOffers(data) {
  const container = document.getElementById('offersContainer');
  if (!container) return;

  // Обработка структуры данных (массив или объект {offers: [...]})
  let offers = Array.isArray(data) ? data : (data.offers || []);
  if (!offers.length) return;

  container.innerHTML = '';
  
  offers.forEach(item => {
    const card = document.createElement('div');
    card.className = 'scroll-item';

    // 1. ОСОБОЕ ОФОРМЛЕНИЕ ДЛЯ ОТЗЫВОВ (id="reviews")
    if (item.id === 'reviews') {
       card.style.minWidth = '400px'; // Делаем карточку шире
       card.style.background = 'linear-gradient(135deg, #fff3e0, #ffe0b2)'; // Оранжевый фон
       card.style.borderLeft = '4px solid #ff9800';
    }

    // 2. Логика иконки (картинка или смайлик)
    let iconHtml;
    if (item.icon && (item.icon.includes('.svg') || item.icon.includes('.png') || item.icon.includes('.jpg'))) {
        // Если это файл
        iconHtml = `<img src="./images/offers/${item.icon}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: contain; margin-bottom: 10px;">`;
    } else {
        // Если это смайлик
        iconHtml = `<div style="font-size: 50px; margin-bottom: 15px;">${item.icon || '🎁'}</div>`;
    }

    // 3. Кнопка для ссылки (если есть поле link)
    const buttonHtml = item.link 
      ? `<a href="${item.link}" target="_blank" 
            style="display: inline-block; margin-top: 15px; padding: 10px 20px; 
                   background: #2d8659; color: white; text-decoration: none; 
                   border-radius: 20px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            Читать отзывы →
         </a>`
      : '';

    // Сборка HTML
    card.innerHTML = `
      <div style="text-align: center;">
        ${iconHtml}
        <h3 style="margin: 0 0 10px 0; color: #2d8659;">${item.title}</h3>
        <p style="color: #555; font-size: 1.05em; margin-bottom: 8px;">${item.description}</p>
        
        ${item.bonus ? `<div style="color: #e67e22; font-weight: bold; font-size: 0.9em;">✨ ${item.bonus}</div>` : ''}
        ${item.discount ? `<p style="color: red; font-weight: bold;">Скидка: ${item.discount}%</p>` : ''}
        
        ${buttonHtml}
      </div>
    `;
    
    container.appendChild(card);
  });
  
  console.log(`✅ Offers: загружено ${offers.length} шт.`);
}

// ЗАГРУЗКА ДАННЫХ (Исправлено имя файла на offer.json)
fetch('offer.json')
  .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
  })
  .then(data => renderOffers(data))
  .catch(err => console.error('Ошибка загрузки offer.json:', err));
