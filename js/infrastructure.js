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
      
      // Сразу создаем кнопку (пока скрытую display: none или не добавляем в DOM)
      // Но лучше добавить и скрыть, чтобы layout не прыгал
      card.innerHTML = `
        ${item.icon ? `
          <div class="infra-img-wrapper">
            <img src="${item.icon}" alt="${item.title}" loading="lazy">
          </div>
        ` : '<div class="infra-img-wrapper"><span>🖼️</span></div>'}
        <h3>${item.title}</h3>
        <p class="infrastructure-description">${item.description}</p>
        <button class="read-more-btn" style="display: none;">Читать далее</button>
      `;

      container.appendChild(card); // Сначала добавляем в DOM, чтобы измерить высоту

      const p = card.querySelector('p');
      const btn = card.querySelector('.read-more-btn');

      // Проверяем переполнение
      // Используем requestAnimationFrame, чтобы браузер успел отрисовать и посчитать высоту
      requestAnimationFrame(() => {
        // Сравниваем высоту контента с высотой блока (с учетом line-clamp в CSS)
        // Важно: в CSS у p должно быть ограничение высоты или line-clamp
        if (p.scrollHeight > p.clientHeight) {
          btn.style.display = 'inline-block'; // Показываем кнопку
          
          // Вешаем клик на кнопку
          btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Чтобы клик не ушел выше
            toggleText(btn, p);
          });
        }
      });
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
