// Функция для добавления CSS-стилей динамически
function addGlobalStyle(css) {
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';
    if (style.styleSheet){
      // Это для IE8 и старее
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
}

// Добавляем стили для темной темы и модальных окон
addGlobalStyle(`
    body.dark-mode {
        --background-color: #121212;
        --text-color: #e0e0e0;
        --card-bg: #1e1e1e;
        --border-color: #333;
        --header-bg: #1f1f1f;
        --nav-bg: #1f1f1f;
        --button-bg: #333;
        --button-hover-bg: #444;
    }
    .modal {
        display: none; 
        position: fixed; 
        z-index: 1000; 
        left: 0;
        top: 0;
        width: 100%; 
        height: 100%; 
        overflow: auto; 
        background-color: rgba(0,0,0,0.6);
    }
`);


document.addEventListener('DOMContentLoaded', () => {

    // --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ТЕМЫ ---
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    // --- ЛОГИКА МОДАЛЬНЫХ ОКОН (ПОГОДА И КАРТА) ---
    const weatherModal = document.getElementById('weatherModal');
    const mapModal = document.getElementById('mapModal');
    const weatherBtn = document.querySelector('.weather-btn');
    const mapBtn = document.querySelector('.map-btn');

    if (weatherModal && weatherBtn) {
        weatherBtn.addEventListener('click', () => {
            weatherModal.style.display = 'block';
        });
    }

    if (mapModal && mapBtn) {
        mapBtn.addEventListener('click', () => {
            mapModal.style.display = 'block';
        });
    }

    // Закрытие модальных окон
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (weatherModal) weatherModal.style.display = 'none';
            if (mapModal) mapModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == weatherModal) {
            weatherModal.style.display = 'none';
        }
        if (event.target == mapModal) {
            mapModal.style.display = 'none';
        }
    });

    console.log('Основной скрипт инициализирован.');
});
