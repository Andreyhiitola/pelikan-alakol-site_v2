async function loadInfrastructure() {
  try {
    const response = await fetch(CONFIG.getDataFile('infrastructure.json'));
    if (!response.ok) throw new Error('HTTP ' + response.status);

    const data = await response.json();
    const container = document.getElementById('infrastructureContainer');
    if (!container) return;

    container.innerHTML = '';

    // Ожидаем формат: { "infrastructure": [ { "title": "...", "description": "...", "icon": "...", "image": "..." } ] }
    data.infrastructure.forEach(item => {
      const card = document.createElement('div');
      card.className = 'scroll-item';

      card.innerHTML = `
        ${item.image ? `<img src="${item.image}" alt="${item.title || ''}">` : ''}
        <h3>${item.title || ''}</h3>
        <p>${item.description || ''}</p>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error('loadInfrastructure error', error);
    const container = document.getElementById('infrastructureContainer');
    if (container) {
      container.innerHTML = '<div class="error">Не удалось загрузить инфраструктуру.</div>';
    }
  }
}

// запуск вместе с остальными
window.addEventListener('DOMContentLoaded', () => {
  loadInfrastructure();
});
