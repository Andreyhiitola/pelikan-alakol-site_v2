function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text)
    .then(() => showNotification(`${label} скопирован в буфер обмена!`))
    .catch(err => {
      console.error('Ошибка копирования:', err);
      alert('Не удалось скопировать. Текст: ' + text);
    });
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'copy-notification';
  notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

async function loadContacts() {
  try {
    const response = await fetch(CONTACTS_JSON_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.contacts;
  } catch (error) {
    console.error('Ошибка при загрузке контактов:', error);
    return null;
  }
}

function createContactCard({ icon, title, bodyHtml, buttonsHtml }) {
  const card = document.createElement('div');
  card.className = 'contact-card';
  card.innerHTML = `
    <h3><i class="${icon}"></i> ${title}</h3>
    <div class="contact-info">
      ${bodyHtml}
    </div>
    <div class="contact-buttons">
      ${buttonsHtml}
    </div>
  `;
  return card;
}

// КЛИКАБЕЛЬНЫЕ НОМЕРА
function createPhoneCard(phones) {
  const bodyHtml = phones.map(phone => `
    <div class="phone-item">
      <span class="phone-label">${phone.label}:</span>
      <a href="tel:${phone.number}" class="phone-number">
        ${phone.display}
      </a>
    </div>
  `).join('');

  const buttonsHtml = phones.map(phone => `
    <div class="contact-btn-group">
      <a href="tel:${phone.number}" class="contact-btn" title="Позвонить">
        <i class="fas fa-phone"></i> Позвонить
      </a>
      <button
        class="contact-btn copy-btn"
        onclick="copyToClipboard('${phone.display}', '${phone.label}')"
        title="Скопировать номер"
      >
        <i class="fas fa-copy"></i> Копировать
      </button>
    </div>
  `).join('');

  return createContactCard({
    icon: 'fas fa-phone-alt',
    title: 'Телефон',
    bodyHtml,
    buttonsHtml
  });
}

function createTelegramCard(telegram) {
  return createContactCard({
    icon: 'fab fa-telegram',
    title: 'Telegram',
    bodyHtml: `
      <strong>Оперативная связь</strong><br>
      ${telegram.description}<br>
      Ответим в течение 30 минут
    `,
    buttonsHtml: `
      <a href="${telegram.url}" target="_blank" class="contact-btn">
        <i class="fab fa-telegram"></i> Открыть Telegram
      </a>
    `
  });
}

function createWhatsappCard(whatsapp) {
  return createContactCard({
    icon: 'fab fa-whatsapp',
    title: 'WhatsApp',
    bodyHtml: `
      <strong>${whatsapp.description}</strong><br>
      Отправьте сообщение
    `,
    buttonsHtml: `
      <a href="${whatsapp.url}" target="_blank" class="contact-btn">
        <i class="fab fa-whatsapp"></i> Открыть WhatsApp
      </a>
    `
  });
}

function createEmailCard(email) {
  return createContactCard({
    icon: 'fas fa-envelope',
    title: 'Email',
    bodyHtml: `
      <strong>${email.description}</strong><br>
      ${email.address}
    `,
    buttonsHtml: `
      <a href="${email.url}" class="contact-btn">
        <i class="fas fa-envelope"></i> Отправить Email
      </a>
    `
  });
}

function createInstagramCard(instagram) {
  return createContactCard({
    icon: 'fab fa-instagram',
    title: 'Instagram',
    bodyHtml: `
      <strong>${instagram.description}</strong><br>
      ${instagram.username}
    `,
    buttonsHtml: `
      <a href="${instagram.url}" target="_blank" class="contact-btn">
        <i class="fab fa-instagram"></i> Открыть Instagram
      </a>
    `
  });
}

function createWebsiteCard(website) {
  return createContactCard({
    icon: 'fas fa-globe',
    title: 'Веб-сайт',
    bodyHtml: `
      <strong>${website.description}</strong><br>
      ${website.domain}
    `,
    buttonsHtml: `
      <a href="${website.url}" target="_blank" class="contact-btn">
        <i class="fas fa-globe"></i> Посетить сайт
      </a>
    `
  });
}

async function renderContacts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const contacts = await loadContacts();
  if (!contacts) {
    container.innerHTML = '<div class="error">❌ Ошибка загрузки контактов</div>';
    return;
  }

  container.innerHTML = '';
  container.appendChild(createPhoneCard(contacts.phone));
  container.appendChild(createTelegramCard(contacts.telegram));
  container.appendChild(createWhatsappCard(contacts.whatsapp));
  container.appendChild(createEmailCard(contacts.email));
  container.appendChild(createInstagramCard(contacts.instagram));
  container.appendChild(createWebsiteCard(contacts.website));
}

function openContactsModal() {
  document.getElementById('contactsModal').classList.add('active');
  renderContacts('contactGridModal');
}

function closeContactsModal() {
  document.getElementById('contactsModal').classList.remove('active');
}

document.getElementById('contactsModal').addEventListener('click', (e) => {
  if (e.target.id === 'contactsModal') closeContactsModal();
});
