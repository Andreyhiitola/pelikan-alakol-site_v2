// Функция для переключения полного и укороченного текста
function toggleFullText(e) {
  const element = e.currentTarget;
  if (element.classList.contains('full-text')) {
    element.classList.remove('full-text');
  } else {
    element.classList.add('full-text');
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
      console.log(`📁 Проверяем ${index}: ${item.title}, icon:`, item.icon);
      
      const card = document.createElement('div');
      card.className = 'scroll-item infra-card';
      
      card.innerHTML = `
        ${item.icon ? `
          <div class="infra-img-wrapper">
            <img src="${item.icon}" alt="${item.title}" loading="lazy">
          </div>
        ` : '<div class="infra-img-wrapper"><span>🖼️</span></div>'}
        <h3>${item.title}</h3>
        <p class="infrastructure-description">${item.description}</p>
      `;

      const descriptionEl = card.querySelector('p');
      if (descriptionEl && item.description) {
        requestAnimationFrame(() => {
          if (descriptionEl.scrollHeight > descriptionEl.clientHeight) {
            descriptionEl.classList.add('has-more');
            descriptionEl.title = item.description;
            descriptionEl.dataset.fullText = item.description;
            descriptionEl.style.cursor = 'pointer';
            descriptionEl.addEventListener('click', toggleFullText);
          }
        });
      }

      container.appendChild(card);
    });

  } catch (error) {
    console.error('❌ Ошибка:', error);
    if (container) container.innerHTML = '<p style="color:red; text-align:center;">Не удалось загрузить данные</p>';
  }
}

// Запускаем загрузку после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  initInfrastructure();
});
