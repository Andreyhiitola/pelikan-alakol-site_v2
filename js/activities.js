function renderActivities(data) {
  const container = document.getElementById('activitiesContainer');
  if (!container) return;

  let activities = Array.isArray(data) ? data : (data.activities || []);
  if (!activities.length) return;

  container.innerHTML = '';
  
  activities.forEach(item => {
    const card = document.createElement('div');
    card.className = 'scroll-item'; 
    
    // ПРАВИЛЬНЫЙ ПУТЬ К ПАПКЕ ACTIVITIES
    const iconSrc = item.icon ? `./images/activities/${item.icon}` : './images/activities/placeholder.svg';
    
    // Обработка локации
    const location = item.location || '';

    card.innerHTML = `
      <div style="display: flex; justify-content: center; margin-bottom: 15px;">
         <img src="${iconSrc}" 
              alt="${item.title}" 
              style="width: 80px; height: 80px; object-fit: contain;"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
         <!-- Запасной смайлик -->
         <div style="display:none; font-size: 60px;">🎯</div>
      </div>

      <h3 style="text-align: center; margin-top: 0;">${item.title}</h3>
      
      <div style="text-align: center; margin-bottom: 10px;">
        <span style="background: #e8f5e9; color: #2d8659; padding: 4px 12px; border-radius: 15px; font-weight: bold; font-size: 0.9em;">
           🕐 ${item.time}
        </span>
      </div>

      <p style="text-align: center; color: #555;">${item.description}</p>
      
      ${location ? `<p style="text-align: center; color: #888; font-size: 0.9em; margin-top: 8px;">📍 ${location}</p>` : ''}
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
