async function loadInfrastructure() {
  try {
    const response = await fetch(CONFIG.getDataFile('infrastructure.json'));
    const data = await response.json();
    const list = document.getElementById('infrastructureList');
    if (list) {
      list.innerHTML = data.infrastructure.map(item => `
        <div class="infrastructure-item">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>`
      ).join('');
    }
  } catch(error) {
    console.error(error);
  }
}
window.addEventListener('DOMContentLoaded', loadInfrastructure);
