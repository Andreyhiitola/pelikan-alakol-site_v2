// Функция для сворачивания/разворачивания инфраструктуры
function setupInfrastructureToggle() {
  const items = document.querySelectorAll('.infrastructure-item');
  
  items.forEach(item => {
    // Находим или создаём заголовок
    let header = item.querySelector('.infrastructure-item-header');
    
    // Обработчик клика на заголовок
    if (header) {
      header.addEventListener('click', function() {
        const btn = item.querySelector('.toggle-btn');
        item.classList.toggle('collapsed');
        if (btn) {
          btn.classList.toggle('open');
          btn.classList.toggle('closed');
        }
      });
    }
  });
}

// Запуск функции после загрузки инфраструктуры
function loadInfrastructure() {
  try {
    const filePath = CONFIG.getDataFile('infrastructure.json');
    console.log('📁 Загрузка:', filePath);
    
    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        const list = document.getElementById('infrastructureList');
        
        if (!list) {
          console.warn('⚠️ Элемент #infrastructureList не найден');
          return;
        }
        
        if (!data.infrastructure || data.infrastructure.length === 0) {
          list.innerHTML = '<p>Инфраструктура не найдена</p>';
          return;
        }
        
        // Рендеринг инфраструктуры с новой структурой
        let html = '';
        data.infrastructure.forEach(item => {
          html += `
            <div class="infrastructure-item collapsed">
              <div class="infrastructure-item-header">
                <h3>${item.title || 'Без названия'}</h3>
                <button class="toggle-btn closed" type="button">+</button>
              </div>
              <div class="infrastructure-item-content">
                <p class="infrastructure-item-description">${item.description || 'Нет описания'}</p>
              </div>
            </div>
          `;
        });
        
        list.innerHTML = html;
        
        // Запускаем функцию сворачивания
        setupInfrastructureToggle();
        
        console.log('✅ Инфраструктура загружена');
      })
      .catch(error => {
        console.error('❌ Ошибка загрузки:', error);
        const list = document.getElementById('infrastructureList');
        if (list) list.innerHTML = '<p>❌ Ошибка: ' + error.message + '</p>';
      });
  } catch(error) {
    console.error('❌ Критическая ошибка:', error);
  }
}

// Запуск при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadInfrastructure);
} else {
  loadInfrastructure();
}
