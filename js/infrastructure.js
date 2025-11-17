async function loadInfrastructure() {
  try {
    const filePath = CONFIG.getDataFile('infrastructure.json');
    console.log('📁 Загрузка:', filePath);
    
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    const list = document.getElementById('infrastructureList');
    
    if (!list) {
      console.warn('⚠️ Элемент #infrastructureList не найден');
      return;
    }
    
    if (!data.infrastructure || data.infrastructure.length === 0) {
      list.innerHTML = '<p>Инфраструктура не найдена</p>';
      return;
    }
    
    list.innerHTML = data.infrastructure.map(item => `
      <div class="infrastructure-item">
        <h3>${item.title || 'Без названия'}</h3>
        <p>${item.description || 'Нет описания'}</p>
      </div>`
    ).join('');
    
    console.log('✅ Инфраструктура загружена');
  } catch(error) {
    console.error('❌ Ошибка загрузки:', error);
    const list = document.getElementById('infrastructureList');
    if (list) list.innerHTML = `<p>❌ Ошибка: ${error.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadInfrastructure);
