function renderActivities(data) {
  // 1. Ищем контейнер для активностей (не путать с номерами!)
  const container = document.getElementById('activitiesContainer');
  if (!container) return;

  container.innerHTML = '';

  // 2. Получаем массив
  const activities = Array.isArray(data) ? data : (data.activities || []);

  activities.forEach(item => {
    // 3. Создаем карточку
    const card = document.createElement('div');
    card.className = 'scroll-item activity-card'; // Класс activity-card для стилей

    // 4. Путь к SVG иконке
    const iconPath = item.icon 
        ? `./images/activities/${item.icon}` 
        : './images/activities/activity-pools.svg';

    // 5. Собираем HTML
    card.innerHTML = `
        <div class="activity-icon-box" style="width: 80px; height: 80px; margin: 0 auto 15px;">
            <img src="${iconPath}" 
                 alt="${item.title}" 
                 style="width: 100%; height: 100%; object-fit: contain;"
                 onerror="this.style.opacity=0.5">
        </div>

        <h3>${item.title}</h3>

        <div class="time-badge" style="background: #FFF3E0; color: #E65100; padding: 4px 12px; border-radius: 20px; display: inline-block; font-weight: bold; font-size: 0.9em; margin: 10px 0;">
            🕐 ${item.time}
        </div>

        <p style="color: #666; font-size: 0.95em; margin-top: 10px;">
            ${item.description}
        </p>
    `;

    container.appendChild(card);
  });

  console.log(`✅ Activities: загружено ${activities.length} элементов`);
}

// Загрузка данных
function loadActivitiesData() {
  fetch('activities.json')
    .then(res => res.json())
    .then(data => renderActivities(data))
    .catch(err => console.error('Ошибка activities:', err));
}

// Запуск
document.addEventListener('DOMContentLoaded', loadActivitiesData);
