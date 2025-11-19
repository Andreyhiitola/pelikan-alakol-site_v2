async function loadInfrastructure() {
  try {
    const response = await fetch(CONFIG.getDataFile('infrastructure.json'));
    if (!response.ok) throw new Error('HTTP ошибка: ' + response.status);
    const data = await response.json();

    if (!Array.isArray(data)) throw new Error('Неверная структура данных: ожидается массив');

    const container = document.getElementById('infrastructureContainer');
    if (!container) return;

    container.innerHTML = '';

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'scroll-item';

      card.innerHTML = `
        ${item.image ? `<img src="${item.image}" alt="${item.name || ''}">` : ''}
        <h3>${item.name || ''}</h3>
        <p>${item.description || ''}</p>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error('[translate:Ошибка загрузки инфраструктуры]', error);
    const container = document.getElementById('infrastructureContainer');
    if (container) {
      container.innerHTML = '<div class="error">[translate:Не удалось загрузить инфраструктуру.]</div>';
    }
  }
}
