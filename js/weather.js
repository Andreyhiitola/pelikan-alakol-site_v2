/* ============================================
   WEATHER.JS - Интеграция OpenWeatherMap API
   ============================================ */

const WEATHER_API_KEY = 'f59a23d3c33e1335a9226aad91b13cdf';
const WEATHER_LAT = 45.955;      // Широта озера Алаколь
const WEATHER_LON = 81.5714;     // Долгота озера Алаколь
const WEATHER_CACHE_TIME = 10 * 60 * 1000; // Кэш на 10 минут

let lastWeatherUpdate = 0;
let cachedWeatherData = null;

/**
 * Загрузка данных погоды
 */
async function loadWeather() {
    const now = Date.now();
    
    // Проверка кэша
    if (cachedWeatherData && (now - lastWeatherUpdate) < WEATHER_CACHE_TIME) {
        displayWeather(cachedWeatherData);
        return;
    }

    const weatherWidget = document.getElementById('weatherWidget');
    if (!weatherWidget) return;

    try {
        weatherWidget.innerHTML = '<div class="weather-loading">⏳ Загрузка погоды...</div>';

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${WEATHER_LAT}&lon=${WEATHER_LON}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        cachedWeatherData = data;
        lastWeatherUpdate = now;
        
        displayWeather(data);
    } catch (error) {
        console.error('Ошибка загрузки погоды:', error);
        weatherWidget.innerHTML = `
            <div class="weather-error">
                <p>❌ Не удалось загрузить данные погоды</p>
                <p style="font-size: 0.9em; color: var(--text-light);">Попробуйте перезагрузить страницу</p>
            </div>
        `;
    }
}

/**
 * Отображение погоды
 */
function displayWeather(data) {
    const weatherWidget = document.getElementById('weatherWidget');
    if (!weatherWidget) return;

    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6); // м/с в км/ч
    const pressure = Math.round(data.main.pressure);

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;

    weatherWidget.innerHTML = `
        <div class="weather-container">
            <div class="weather-main">
                <div class="weather-icon">
                    <img src="${iconUrl}" alt="${description}">
                </div>
                <div class="weather-info">
                    <div class="weather-temp">
                        <span class="temp-value">${temp}°C</span>
                        <span class="temp-feels">Ощущается как ${feelsLike}°C</span>
                    </div>
                    <div class="weather-description">
                        ${description.charAt(0).toUpperCase() + description.slice(1)}
                    </div>
                </div>
            </div>

            <div class="weather-details">
                <div class="weather-detail">
                    <span class="detail-label">💧 Влажность</span>
                    <span class="detail-value">${humidity}%</span>
                </div>
                <div class="weather-detail">
                    <span class="detail-label">💨 Ветер</span>
                    <span class="detail-value">${windSpeed} км/ч</span>
                </div>
                <div class="weather-detail">
                    <span class="detail-label">🔽 Давление</span>
                    <span class="detail-value">${pressure} мб</span>
                </div>
            </div>

            <div class="weather-location">
                📍 озеро Алаколь, пос. Акши
                <br>
                <small>Обновлено: ${new Date().toLocaleTimeString('ru-KZ')}</small>
            </div>
        </div>
    `;

    // Добавить стили если их нет
    addWeatherStyles();
}

/**
 * Добавление стилей для погоды (если не подключены отдельные CSS)
 */
function addWeatherStyles() {
    if (document.getElementById('weather-styles')) return;

    const style = document.createElement('style');
    style.id = 'weather-styles';
    style.textContent = `
        .weather-container {
            background: linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 100%);
            color: var(--white);
            border-radius: 12px;
            padding: 2rem;
            box-shadow: var(--shadow);
        }

        .weather-main {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .weather-icon img {
            width: 120px;
            height: 120px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .weather-info {
            flex: 1;
        }

        .weather-temp {
            display: flex;
            flex-direction: column;
            margin-bottom: 0.5rem;
        }

        .temp-value {
            font-size: 2.5rem;
            font-weight: bold;
        }

        .temp-feels {
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .weather-description {
            font-size: 1.1rem;
            opacity: 0.95;
            margin-top: 0.5rem;
        }

        .weather-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            backdrop-filter: blur(10px);
        }

        .weather-detail {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .detail-label {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-bottom: 0.5rem;
        }

        .detail-value {
            font-size: 1.3rem;
            font-weight: 600;
        }

        .weather-location {
            font-size: 0.9rem;
            text-align: center;
            opacity: 0.8;
        }

        .weather-location small {
            display: block;
            margin-top: 0.5rem;
            opacity: 0.7;
        }

        .weather-loading,
        .weather-error {
            text-align: center;
            padding: 2rem;
            color: var(--text-light);
        }

        .weather-error {
            background: #ffebee;
            color: var(--error);
            border-radius: 8px;
        }

        @media (max-width: 768px) {
            .weather-container {
                padding: 1.5rem;
            }

            .weather-main {
                flex-direction: column;
                text-align: center;
                gap: 1rem;
            }

            .weather-icon img {
                width: 80px;
                height: 80px;
            }

            .temp-value {
                font-size: 2rem;
            }

            .weather-details {
                grid-template-columns: 1fr;
                gap: 0.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ weather.js загружен');
