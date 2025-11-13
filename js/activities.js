/* ============================================
   ACTIVITIES.JS - Загрузка и отображение мероприятий
   ============================================ */

const dayNames = {
    'monday': 'Понедельник',
    'tuesday': 'Вторник',
    'wednesday': 'Среда',
    'thursday': 'Четверг',
    'friday': 'Пятница',
    'saturday': 'Суббота',
    'sunday': 'Воскресенье'
};

/**
 * Загрузка мероприятий из activities.json
 */
async function loadActivities() {
    try {
        const data = await loadJSON('activities');
        if (!data || !data.activities) {
            console.warn('Данные мероприятий не загружены');
            return;
        }
        displayActivities(data.activities);
    } catch (error) {
        console.error('Ошибка загрузки мероприятий:', error);
    }
}

/**
 * Отображение мероприятий в grid контейнере
 */
function displayActivities(activities) {
    const container = document.getElementById('activitiesContainer');
    if (!container) return;

    container.innerHTML = '';

    activities.forEach(activity => {
        const card = document.createElement('div');
        card.className = 'activity-card';
        card.innerHTML = `
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-header">
                <h3>${activity.title}</h3>
                <span class="activity-day">${dayNames[activity.day] || activity.day}</span>
            </div>
            <div class="activity-details">
                <p class="detail">
                    <span class="label">⏰ Время:</span>
                    <span>${activity.time}</span>
                </p>
                <p class="detail">
                    <span class="label">📍 Место:</span>
                    <span>${activity.location}</span>
                </p>
                <p class="detail">
                    <span class="label">👨‍🏫 Инструктор:</span>
                    <span>${activity.instructor}</span>
                </p>
                <p class="activity-description">${activity.description}</p>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="enrollActivity('${activity.title}')">
                Записаться
            </button>
        `;
        container.appendChild(card);
    });

    addActivityStyles();
    console.log(`✅ Загружено ${activities.length} мероприятий`);
}

/**
 * Запись на мероприятие
 */
function enrollActivity(activityTitle) {
    alert(`Спасибо за интерес к "${activityTitle}"!\\nСвяжитесь с администрацией базы для подтверждения.`);
    console.log('Запись на:', activityTitle);
}

/**
 * Добавление стилей для мероприятий
 */
function addActivityStyles() {
    if (document.getElementById('activity-styles')) return;

    const style = document.createElement('style');
    style.id = 'activity-styles';
    style.textContent = `
        #activitiesContainer {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }

        .activity-card {
            background: var(--white);
            border-left: 5px solid var(--primary-color);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: var(--shadow-sm);
            transition: var(--transition);
            display: flex;
            flex-direction: column;
        }

        .activity-card:hover {
            box-shadow: var(--shadow);
            transform: translateY(-8px);
            border-left-color: var(--accent-color);
        }

        .activity-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        .activity-header {
            margin-bottom: 1rem;
        }

        .activity-header h3 {
            margin: 0 0 0.5rem;
            font-size: 1.2rem;
            color: var(--text-dark);
        }

        .activity-day {
            display: inline-block;
            background: var(--background-light);
            color: var(--primary-color);
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .activity-details {
            flex: 1;
            margin-bottom: 1rem;
        }

        .activity-details .detail {
            margin: 0.75rem 0;
            font-size: 0.95rem;
            color: var(--text-light);
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .activity-details .label {
            font-weight: 600;
            color: var(--primary-color);
        }

        .activity-description {
            font-style: italic;
            color: var(--text-light);
            margin: 1rem 0 0;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
        }

        .activity-card .btn {
            align-self: flex-start;
        }

        @media (max-width: 768px) {
            #activitiesContainer {
                grid-template-columns: 1fr;
            }

            .activity-icon {
                font-size: 2rem;
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ activities.js загружен');
