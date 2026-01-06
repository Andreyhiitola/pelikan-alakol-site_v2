// Функция для переключения текста (теперь принимает кнопку и параграф)
function toggleText(button, paragraph) {
  const isExpanded = paragraph.classList.contains('expanded');
  
  if (isExpanded) {
    paragraph.classList.remove('expanded');
    button.textContent = 'Читать далее';
  } else {
    paragraph.classList.add('expanded');
    button.textContent = 'Свернуть';
  }
}

// Конфигурация ссылок для карточек инфраструктуры
const INFRASTRUCTURE_LINKS = {
  "СТОЛОВАЯ": "index_menu.html",
  "Блюда на заказ": "bar.html",
  "Магазин/Бар": null, // Пока нет страницы
  "Детский досуг": null,
  "Паром/Пляж": null,
  "Трансфер с/из жд.вокзала Акши": null,
  "Бассейны / Бани / Массаж": null,
  "Прачечная / Бытовые услуги": null,
  "Бильярд/теннис": null
};

async function initInfrastructure() {
  const container = document.getElementById('infrastructureContainer');
  
  try {
    const response = await fetch('infrastructure.json');
    if (!response.ok) throw new Error('Ошибка загрузки JSON');
    
    const data = await response.json();
    console.log('✅ JSON загружен:', data.length, 'элементов');
    
    container.innerHTML = '';
    data.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'scroll-item infra-card';
      
      // Проверяем, есть ли ссылка для этой карточки
      const linkUrl = INFRASTRUCTURE_LINKS[item.title];
      const hasLink = !!linkUrl;
      
      // Основная структура карточки
      card.innerHTML = `
        ${item.icon ? `
          <div class="infra-img-wrapper" style="${hasLink ? 'cursor: pointer;' : ''}">
            <img src="${item.icon}" alt="${item.title}" loading="lazy" style="${hasLink ? 'cursor: pointer;' : ''}">
          </div>
        ` : '<div class="infra-img-wrapper"><span>🖼️</span></div>'}
        <h3>${item.title}</h3>
        <p class="infrastructure-description">${item.description}</p>
        ${hasLink ? `<button class="infra-action-btn" style="margin-top: 15px;">
          <i class="fas fa-arrow-right"></i> Перейти
        </button>` : '<button class="read-more-btn" style="display: none;">Читать далее</button>'}
      `;
      
      container.appendChild(card);
      
      // ✅ Если есть ссылка - делаем иконку и кнопку кликабельными
      if (hasLink) {
        const imgWrapper = card.querySelector('.infra-img-wrapper');
        const img = card.querySelector('img');
        const btn = card.querySelector('.infra-action-btn');
        
        // Клик на обёртку иконки
        if (imgWrapper) {
          imgWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = linkUrl;
          });
        }
        
        // Клик на саму иконку
        if (img) {
          img.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = linkUrl;
          });
        }
        
        // Клик на кнопку
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = linkUrl;
          });
          
          // Специальная иконка для "Блюда на заказ"
          if (item.title === "Блюда на заказ") {
            btn.innerHTML = '<i class="fas fa-utensils"></i> Сделать заказ';
          }
          // Специальная иконка для "СТОЛОВАЯ"
          else if (item.title === "СТОЛОВАЯ") {
            btn.innerHTML = '<i class="fas fa-book-open"></i> Посмотреть меню';
          }
        }
      } 
      // ❌ Если нет ссылки - проверяем переполнение для кнопки "Читать далее"
      else {
        const p = card.querySelector('p');
        const btn = card.querySelector('.read-more-btn');
        
        requestAnimationFrame(() => {
          if (p.scrollHeight > p.clientHeight) {
            btn.style.display = 'inline-block';
            
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              toggleText(btn, p);
            });
          }
        });
      }
    });
  } catch (error) {
    console.error('❌ Ошибка:', error);
    if (container) container.innerHTML = '<p style="color:red; text-align:center;">Не удалось загрузить данные</p>';
  }
}

// Запускаем
document.addEventListener('DOMContentLoaded', () => {
  initInfrastructure();
});
