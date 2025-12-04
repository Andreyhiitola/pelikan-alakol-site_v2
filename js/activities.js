function renderActivities(data) {
  const container = document.getElementById('activitiesContainer');
  if (!container) return;

  let activities = Array.isArray(data) ? data : (data.activities || []);
  if (!activities.length) return;

  container.innerHTML = '';
  
  activities.forEach(item => {
    const card = document.createElement('div');
    card.className = 'scroll-item'; 
    
    // ВОТ ГЛАВНОЕ ИСПРАВЛЕНИЕ: Формируем путь к иконке
    const iconSrc = item.icon ? `./images/activities/${item.icon}` : './images/activities/placeholder.svg';

    card.innerHTML = `
      <!-- Блок с картинкой -->
      <div style="display: flex; justify-content: center; margin-bottom: 15px;">
         <img src="${iconSrc}" 
              alt="${item.title}" 
              style="width: 80px; height: 80px; object-fit: contain;"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
         <!-- Запасной смайлик, если картинка не загрузится -->
         <div style="display:none; font-size: 60px;">🎯</div>
      </div>

      <h3 style="text-align: center; margin-top: 0;">${item.title}</h3>
      
      <div style="text-align: center; margin-bottom: 10px;">
        <span style="background: #e8f5e9; color: #2d8659; padding: 4px 12px; border-radius: 15px; font-weight: bold; font-size: 0.9em;">
           🕐 ${item.time}
        </span>
      </div>

      <p style="text-align: center; color: #555;">${item.description}</p>
    `;
    
    container.appendChild(card);
  });
  
  console.log(`✅ Activities: загружено ${activities.length} шт.`);
}

function loadActivitiesData() {
    fetch('activities.json')
      .then(res => {
          if (!res.ok) throw new Error('Ошибка загрузки activities.json');
          return res.json();
      })
      .then(data => renderActivities(data))
      .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', loadActivitiesData);
