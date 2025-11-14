async function loadOffers() {
  try {
    const response = await fetch(CONFIG.getDataFile('offers.json') + '?t=' + new Date().getTime());
    if (!response.ok) throw new Error('Ошибка загрузки offers: ' + response.status);
    const data = await response.json();
    const container = document.getElementById('offersContainer');
    if (container && data.offers) {
      container.innerHTML = data.offers.map(offer => `
        <div class="offer-item">
          <h3>${offer.title}</h3>
          <p>${offer.description}</p>
          <p><strong>Цена: </strong>${offer.price}</p>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('❌ Ошибка при загрузке offers:', error);
    document.getElementById('offersContainer').innerHTML = '<p style="color: red;">Ошибка загрузки данных предложений</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadOffers);
