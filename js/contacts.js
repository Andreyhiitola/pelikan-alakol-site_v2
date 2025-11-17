document.addEventListener('DOMContentLoaded', () => {
  const phoneBtn = document.getElementById('contactPhoneButton');
  const telegramBtn = document.getElementById('contactTelegramButton');
  const modal = document.getElementById('contactsModal');
  const closeBtn = modal.querySelector('.close-btn');
  const container = document.getElementById('contactsContainer');

  function openModal() {
    modal.style.display = 'block';
  }
  function closeModal() {
    modal.style.display = 'none';
  }

  phoneBtn.addEventListener('click', openModal);
  telegramBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Номер скопирован в буфер обмена');
    });
  };

  async function loadContacts() {
    try {
      const response = await fetch('./public/data/contacts.json');
      if (!response.ok) throw new Error(`Ошибка ${response.status}`);
      const data = await response.json();
      renderContacts(data.contacts);
    } catch (err) {
      container.innerHTML = `<p>❌ Ошибка загрузки контактов: ${err.message}</p>`;
      console.error('Ошибка загрузки контактов:', err);
    }
  }

  function renderContacts(contacts) {
    container.innerHTML = '';
    if (contacts.phone) {
      const phonesHTML = contacts.phone.map(phone => `
        <div>
          <strong>${phone.label}:</strong>
          <a href="tel:${phone.number}" class="contact-btn">
            <i class="fas fa-phone"></i> ${phone.display}
          </a>
          <button class="contact-btn" onclick="copyToClipboard('${phone.display}')">
            <i class="fas fa-copy"></i>
          </button>
        </div>
      `).join('');
      container.insertAdjacentHTML('beforeend', `<section><h3>Телефоны</h3>${phonesHTML}</section>`);
    }
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
  }

  loadContacts();
});
