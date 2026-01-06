function renderMenu(data) {
  const container = document.getElementById('menuContainer');
  if (!container) return;

  container.innerHTML = '';

  // Группируем по категориям
  const categories = data.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  Object.keys(categories).forEach(category => {
    const catDiv = document.createElement('div');
    catDiv.innerHTML = `<h2 style="color: #FFD700;">${category}</h2>`;
    const itemsDiv = document.createElement('div');
    itemsDiv.className = 'menu-container';

    categories[category].forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-card';
      card.innerHTML = `
        <h3>${item.name}</h3>
        <p>Цена: ${item.price} ₸</p>
        <button class="add-to-cart" data-name="${item.name}" data-price="${item.price}">Добавить в корзину</button>
      `;
      itemsDiv.appendChild(card);
    });

    catDiv.appendChild(itemsDiv);
    container.appendChild(catDiv);
  });

  // Добавляем обработчики для кнопок
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', addToCart);
  });
}

function loadMenuData() {
  fetch('barzakaz.json')
    .then(response => response.json())
    .then(data => renderMenu(data))
    .catch(error => {
      document.getElementById('menuContainer').innerHTML = `Ошибка: ${error.message}`;
    });
}

function addToCart(event) {
  const name = event.target.dataset.name;
  const price = parseInt(event.target.dataset.price);
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({ name, price });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const totalEl = document.getElementById('total');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - ${item.price} ₸`;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Удалить';
    removeBtn.onclick = () => removeFromCart(index);
    li.appendChild(removeBtn);
    cartItems.appendChild(li);
    total += item.price;
  });
  totalEl.textContent = `Итого: ${total} ₸`;
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function handleOrderSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const room = document.getElementById('room').value;
  const telegram = document.getElementById('telegram').value;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    alert('Корзина пуста!');
    return;
  }

  const order = {
    name,
    room,
    telegram,
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price, 0),
    timestamp: new Date().toISOString()
  };

  fetch('https://your-worker.yourusername.workers.dev/order', {  // Замените на URL вашего worker
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  .then(response => response.json())
  .then(data => {
    alert(`Заказ отправлен! ID: ${data.orderId}. Отслеживайте в Telegram-боте.`);
    localStorage.removeItem('cart');
    updateCart();
  })
  .catch(error => alert(`Ошибка: ${error.message}`));
}

document.addEventListener('DOMContentLoaded', () => {
  loadMenuData();
  updateCart();
  document.getElementById('order-form').addEventListener('submit', handleOrderSubmit);
});
