document.addEventListener('DOMContentLoaded', () => {
  const contactBtn = document.getElementById('contactButton');
  const modal = document.getElementById('contactsModal');
  const closeBtn = modal.querySelector('.close-btn');
  const container = document.getElementById('contactsContainer');

  contactBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Функция копирования в буфер (для кнопок копирования номера)
  window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Номер скопирован в буфер обмена');
    });
  };

  // Загрузка и рендер контактов из JSON
  async function loadContacts() {
    try {
      const response = await fetch('./public/data/contacts.json');
      const data = await response.json();
      renderContacts(data.contacts);
    } catch (err) {
      console.error('Ошибка загрузки контактов:', err);
    }
  }

  function renderContacts(contacts) {
    container.innerHTML = '';

    // Телефоны
    if (contacts.phone) {
      const phoneHTML = contacts.phone.map(phone => `
        <div>
          <strong>${phone.label}:</strong>
          <a href="tel:${phone.number}" class="contact-btn">
            <i class="fas fa-phone"></i>${phone.display}
          </a>
          <button class="contact-btn" onclick="copyToClipboard('${phone.display}')">
            <i class="fas fa-copy"></i>
          </button>
        </div>
      `).join('');
      container.insertAdjacentHTML('beforeend', `<section><h3>Телефоны</h3>${phoneHTML}</section>`);
    }

    // Telegram
    if (contacts.telegram && contacts.telegram.url) {
      container.insertAdjacentHTML('beforeend', `
        <section>
          <h3><i class="fab fa-telegram"></i> Telegram</h3>
          <a href="${contacts.telegram.url}" target="_blank" class="contact-btn">
            <i class="fab fa-telegram"></i> Связаться с ботом
          </a>
        </section>
      `);
    }

    // Дополнительные контакты (Whatsapp, email, Instagram) можно добавить аналогично
  }

  loadContacts();
});
