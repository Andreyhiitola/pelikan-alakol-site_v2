/* ============================================
   ACCOMMODATION.JS - Загрузка и отображение номеров
   ============================================ */

let currentRoomModal = null;

/**
 * Загрузка номеров из accommodation.json
 */
async function loadAccommodations() {
    try {
        const data = await loadJSON('accommodation');
        if (!data || !data.accommodations) {
            console.warn('Данные номеров не загружены');
            return;
        }
        displayAccommodations(data.accommodations);
    } catch (error) {
        console.error('Ошибка загрузки номеров:', error);
    }
}

/**
 * Отображение номеров в scroll контейнере
 */
function displayAccommodations(accommodations) {
    const container = document.getElementById('roomsContainer');
    if (!container) return;

    container.innerHTML = '';

    accommodations.forEach(room => {
        const item = document.createElement('div');
        item.className = 'scroll-item room-item';
        item.innerHTML = `
            <div class="room-icon">${room.icon}</div>
            <img src="/public/images/rooms/${room.image}" alt="${room.name}" onerror="this.src='/public/images/placeholder.jpg'">
            <div class="scroll-item-content">
                <h3>${room.name}</h3>
                <p class="room-capacity">👥 Максимум ${room.capacity} гостей</p>
                <p class="room-description">${room.description}</p>
                <div class="room-price">${formatPrice(room.price)}</div>
                <button class="btn btn-sm btn-primary" onclick="openRoomModal(${room.id})">
                    Подробнее
                </button>
            </div>
        `;
        container.appendChild(item);
    });

    console.log(`✅ Загружено ${accommodations.length} номеров`);
}

/**
 * Открытие модального окна с деталями номера
 */
function openRoomModal(roomId) {
    loadJSON('accommodation').then(data => {
        if (!data || !data.accommodations) return;

        const room = data.accommodations.find(r => r.id === roomId);
        if (!room) return;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="room-modal-content">
                <div class="room-modal-header">
                    <h2>${room.icon} ${room.name}</h2>
                </div>

                <div class="room-modal-image">
                    <img src="/public/images/rooms/${room.image}" alt="${room.name}" onerror="this.src='/public/images/placeholder.jpg'">
                </div>

                <div class="room-modal-details">
                    <div class="detail-row">
                        <span class="label">Описание:</span>
                        <span class="value">${room.description}</span>
                    </div>

                    <div class="detail-row">
                        <span class="label">Максимум гостей:</span>
                        <span class="value">👥 ${room.capacity} человек</span>
                    </div>

                    <div class="detail-row">
                        <span class="label">Полная информация:</span>
                        <span class="value">${room.details}</span>
                    </div>

                    <div class="detail-row">
                        <span class="label">Удобства:</span>
                        <div class="amenities">
                            ${room.amenities.map(amenity => `
                                <span class="amenity-badge">✓ ${amenity}</span>
                            `).join('')}
                        </div>
                    </div>

                    <div class="detail-row">
                        <span class="label">Цена:</span>
                        <span class="value price">${formatPrice(room.price)} за ночь</span>
                    </div>
                </div>

                <div class="room-modal-actions">
                    <button class="btn btn-primary" onclick="bookRoom(${room.id})">
                        🗓️ Забронировать номер
                    </button>
                    <button class="btn btn-secondary" onclick="callPhone()">
                        📞 Позвонить
                    </button>
                </div>
            </div>
        `;

        const modal = document.getElementById('roomModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        currentRoomModal = roomId;
    });
}

/**
 * Закрытие модального окна номера
 */
function closeRoomModal() {
    const modal = document.getElementById('roomModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    currentRoomModal = null;
}

/**
 * Бронирование номера
 */
function bookRoom(roomId) {
    loadJSON('accommodation').then(data => {
        if (!data || !data.accommodations) return;
        const room = data.accommodations.find(r => r.id === roomId);
        if (!room) return;

        // Отправка в Telegram или форма бронирования
        const message = `📋 Запрос на бронирование:\\n\\n🏠 Номер: ${room.name}\\n💰 Цена: ${room.price} ₸/ночь\\n👥 Вместимость: ${room.capacity} гостей`;
        
        // Можно отправить в Telegram бота или открыть форму
        console.log('Бронирование:', message);
        alert('Спасибо за интерес! Свяжитесь с нами для подтверждения бронирования.');
        closeRoomModal();
    });
}

/**
 * Добавление стилей для модального окна номера
 */
function addRoomModalStyles() {
    if (document.getElementById('room-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'room-modal-styles';
    style.textContent = `
        .room-modal-content {
            animation: slideUp 0.3s ease;
        }

        .room-modal-header {
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 1rem;
            margin-bottom: 1rem;
        }

        .room-modal-header h2 {
            margin: 0;
            color: var(--text-dark);
        }

        .room-modal-image {
            margin-bottom: 1.5rem;
            border-radius: 12px;
            overflow: hidden;
        }

        .room-modal-image img {
            width: 100%;
            height: auto;
            max-height: 300px;
            object-fit: cover;
        }

        .room-modal-details {
            margin-bottom: 1.5rem;
        }

        .detail-row {
            display: flex;
            flex-direction: column;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-row .label {
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }

        .detail-row .value {
            color: var(--text-light);
            line-height: 1.6;
        }

        .detail-row .price {
            font-size: 1.3rem;
            font-weight: bold;
            color: var(--primary-color);
        }

        .amenities {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .amenity-badge {
            background: var(--background-light);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            color: var(--primary-color);
        }

        .room-modal-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .room-modal-actions .btn {
            flex: 1;
            min-width: 150px;
        }

        .room-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        @media (max-width: 576px) {
            .room-modal-actions {
                flex-direction: column;
            }

            .room-modal-actions .btn {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}

// Инициализация стилей при загрузке
addRoomModalStyles();

console.log('✅ accommodation.js загружен');
