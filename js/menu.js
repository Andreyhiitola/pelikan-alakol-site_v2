/* ============================================
   MENU.JS - Загрузка и отображение меню ресторана
   ============================================ */

let activeMenuCategory = 'breakfast';

/**
 * Загрузка меню из menu.json
 */
async function loadMenu() {
    try {
        const data = await loadJSON('menu');
        if (!data || !data.categories) {
            console.warn('Данные меню не загружены');
            return;
        }
        displayMenu(data.categories);
    } catch (error) {
        console.error('Ошибка загрузки меню:', error);
    }
}

/**
 * Отображение меню по категориям
 */
function displayMenu(categories) {
    const container = document.getElementById('menuContainer');
    if (!container) return;

    container.innerHTML = '';

    // Создание фильтров по категориям
    const filterContainer = document.createElement('div');
    filterContainer.className = 'menu-filters';
    filterContainer.innerHTML = categories.map(cat => `
        <button class="menu-filter-btn ${activeMenuCategory === cat.id ? 'active' : ''}" 
                onclick="switchMenuCategory('${cat.id}')">
            ${cat.icon} ${cat.name}
        </button>
    `).join('');
    container.appendChild(filterContainer);

    // Отображение товаров текущей категории
    const itemsContainer = document.createElement('div');
    itemsContainer.id = 'menuItemsContainer';
    itemsContainer.className = 'menu-items-scroll';
    container.appendChild(itemsContainer);

    switchMenuCategory(activeMenuCategory);
    addMenuStyles();
    console.log(`✅ Загружено ${categories.length} категорий меню`);
}

/**
 * Переключение категории меню
 */
function switchMenuCategory(categoryId) {
    activeMenuCategory = categoryId;

    // Обновление активного кнопки
    document.querySelectorAll('.menu-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchMenuCategory('${categoryId}')"]`).classList.add('active');

    // Загрузка и отображение товаров
    loadJSON('menu').then(data => {
        if (!data || !data.categories) return;

        const category = data.categories.find(c => c.id === categoryId);
        if (!category) return;

        const itemsContainer = document.getElementById('menuItemsContainer');
        itemsContainer.innerHTML = '';

        category.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item scroll-item';
            itemElement.innerHTML = `
                <img src="/public/images/menu/${item.image}" alt="${item.name}" onerror="this.src='/public/images/placeholder.jpg'">
                <div class="scroll-item-content">
                    <div class="menu-item-header">
                        <h4>${item.name}</h4>
                        ${item.vegetarian ? '<span class="vegetarian-badge">🌱 Вегетарианское</span>' : ''}
                    </div>
                    <p class="menu-item-description">${item.description}</p>
                    <div class="menu-item-footer">
                        <span class="menu-item-price">${formatPrice(item.price)}</span>
                    </div>
                </div>
            `;
            itemsContainer.appendChild(itemElement);
        });
    });
}

/**
 * Добавление стилей для меню
 */
function addMenuStyles() {
    if (document.getElementById('menu-styles')) return;

    const style = document.createElement('style');
    style.id = 'menu-styles';
    style.textContent = `
        .menu-filters {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            overflow-x: auto;
            padding-bottom: 0.5rem;
        }

        .menu-filter-btn {
            padding: 0.75rem 1.5rem;
            border: 2px solid var(--border-color);
            background: var(--white);
            color: var(--text-dark);
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            white-space: nowrap;
            transition: var(--transition);
        }

        .menu-filter-btn:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
        }

        .menu-filter-btn.active {
            background: var(--primary-color);
            color: var(--white);
            border-color: var(--primary-color);
        }

        .menu-items-scroll {
            display: flex;
            overflow-x: auto;
            gap: 1.5rem;
            padding: 1rem 0;
            scroll-behavior: smooth;
        }

        .menu-items-scroll::-webkit-scrollbar {
            height: 8px;
        }

        .menu-items-scroll::-webkit-scrollbar-track {
            background: var(--background-light);
        }

        .menu-items-scroll::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 4px;
        }

        .menu-item {
            min-width: 280px;
            flex-shrink: 0;
        }

        .menu-item img {
            width: 100%;
            height: 180px;
            object-fit: cover;
        }

        .menu-item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }

        .menu-item-header h4 {
            margin: 0;
            font-size: 1rem;
            color: var(--text-dark);
            flex: 1;
        }

        .vegetarian-badge {
            display: inline-block;
            background: #c8e6c9;
            color: #2e7d32;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            white-space: nowrap;
        }

        .menu-item-description {
            font-size: 0.85rem;
            color: var(--text-light);
            margin: 0.5rem 0;
            line-height: 1.4;
        }

        .menu-item-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .menu-item-price {
            font-size: 1.2rem;
            font-weight: bold;
            color: var(--primary-color);
        }

        @media (max-width: 768px) {
            .menu-filters {
                gap: 0.5rem;
            }

            .menu-filter-btn {
                padding: 0.5rem 1rem;
                font-size: 0.8rem;
            }

            .menu-item {
                min-width: 220px;
            }

            .menu-item img {
                height: 140px;
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ menu.js загружен');
