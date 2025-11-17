// Функция для сворачивания/разворачивания инфраструктуры
function setupInfrastructureToggle() {
  const items = document.querySelectorAll('.infrastructure-item');
  
  items.forEach(item => {
    // Добавляем класс collapsed по умолчанию
    item.classList.add('collapsed');
    
    // Находим или создаём заголовок
    let header = item.querySelector('.infrastructure-item-header');
    
    if (!header) {
      // Если заголовка нет, преобразуем структуру
      const title = item.querySelector('h3')?.textContent || 'Без названия';
      const description = item.querySelector('p')?.textContent || '';
      
      item.innerHTML = `
        <div class="infrastructure-item-header">
          <h3>${title}</h3>
          <button class="toggle-btn closed" aria-label="Развернуть"></button>
        </div>
        <div class="infrastructure-item-content">
          <p class="infrastructure-item-description">${description}</p>
        </div>
      `;
      
      header = item.querySelector('.infrastructure-item-header');
    }
    
    // Обработчик клика на заголовок
    header.addEventListener('click', function() {
      const btn = item.querySelector('.toggle-btn');
      item.classList.toggle('collapsed');
      btn.classList.toggle('open');
      btn.classList.toggle('closed');
    });
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
          list.innerHTML = '<p>Инф
