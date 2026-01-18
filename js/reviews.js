// ============================================================================
// reviews.js - Загрузка и отображение отзывов
// ============================================================================

const API_URL = 'https://apitelegram.parkpelikan-alakol.kz/api/reviews';

let allReviews = [];
let currentSort = 'date';

// Критерии оценки с переводом
const CRITERIA = {
    cleanliness: 'Чистота',
    comfort: 'Комфорт',
    location: 'Расположение',
    facilities: 'Удобства',
    staff: 'Персонал',
    value_for_money: 'Цена/Качество'
};

// ===================== ЗАГРУЗКА ДАННЫХ =====================

async function loadReviews() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allReviews = await response.json();
        
        updateStatistics();
        renderReviews();
        
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
        showError();
    }
}

// ===================== СТАТИСТИКА =====================

function updateStatistics() {
    const totalReviews = allReviews.length;
    document.getElementById('total-reviews').textContent = totalReviews;
    
    if (totalReviews === 0) {
        document.getElementById('avg-score').textContent = '0.0';
        document.getElementById('recommend-percent').textContent = '0%';
        return;
    }
    
    // Средняя оценка
    const avgScore = allReviews.reduce((sum, r) => sum + r.avg_score, 0) / totalReviews;
    document.getElementById('avg-score').textContent = avgScore.toFixed(1);
    
    // Процент рекомендаций (оценка >= 8)
    const recommend = allReviews.filter(r => r.avg_score >= 8).length;
    const percent = Math.round((recommend / totalReviews) * 100);
    document.getElementById('recommend-percent').textContent = `${percent}%`;
}

// ===================== РЕНДЕРИНГ =====================

function renderReviews() {
    const container = document.getElementById('reviews-container');
    
    if (allReviews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-comments"></i>
                <h3>Отзывов пока нет</h3>
                <p>Станьте первым, кто оставит отзыв о нашем отеле!</p>
            </div>
        `;
        return;
    }
    
    // Сортировка
    const sorted = sortReviews([...allReviews], currentSort);
    
    container.innerHTML = sorted.map(review => createReviewCard(review)).join('');
}

function createReviewCard(review) {
    const date = new Date(review.date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Детальные оценки
    const detailedScores = Object.entries(CRITERIA).map(([key, label]) => {
        const score = review[key];
        const width = (score / 10) * 100;
        
        return `
            <div class="score-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="score-name">${label}</span>
                    <span class="score-value">${score}/10</span>
                </div>
                <div class="score-bar-container">
                    <div class="score-bar" style="width: ${width}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    // Цвет бейджа в зависимости от оценки
    let badgeColor = '#2d8659';
    if (review.avg_score >= 9) badgeColor = '#4CAF50';
    else if (review.avg_score < 7) badgeColor = '#ff9800';
    
    return `
        <div class="review-card">
            <div class="review-header">
                <div class="review-author">
                    <div class="review-name">${escapeHtml(review.name)}</div>
                    <div class="review-meta">
                        <i class="fas fa-calendar-alt"></i> ${date}
                        ${review.room_number ? `&nbsp;&nbsp;<i class="fas fa-door-open"></i> Номер ${escapeHtml(review.room_number)}` : ''}
                    </div>
                </div>
                <div class="review-score-badge" style="background: linear-gradient(135deg, ${badgeColor} 0%, ${adjustColor(badgeColor, -20)} 100%);">
                    <span class="score-number">${review.avg_score.toFixed(1)}</span>
                    <span class="score-label">из 10</span>
                </div>
            </div>
            
            <div class="detailed-scores">
                ${detailedScores}
            </div>
            
            ${review.pros ? `
                <div class="review-section pros">
                    <div class="review-section-title">
                        <i class="fas fa-check-circle"></i>
                        Что понравилось
                    </div>
                    <div class="review-text">${escapeHtml(review.pros)}</div>
                </div>
            ` : ''}
            
            ${review.cons ? `
                <div class="review-section cons">
                    <div class="review-section-title">
                        <i class="fas fa-exclamation-circle"></i>
                        Что можно улучшить
                    </div>
                    <div class="review-text">${escapeHtml(review.cons)}</div>
                </div>
            ` : ''}
            
            ${review.comment ? `
                <div class="review-section">
                    <div class="review-section-title">
                        <i class="fas fa-comment"></i>
                        Комментарий
                    </div>
                    <div class="review-text">${escapeHtml(review.comment)}</div>
                </div>
            ` : ''}
        </div>
    `;
}

// ===================== СОРТИРОВКА =====================

function sortReviews(reviews, sortType) {
    if (sortType === 'date') {
        return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortType === 'rating') {
        return reviews.sort((a, b) => b.avg_score - a.avg_score);
    }
    return reviews;
}

// ===================== UI HELPERS =====================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function adjustColor(color, amount) {
    // Простая функция для осветления/затемнения цвета
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
}

function showError() {
    const container = document.getElementById('reviews-container');
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-triangle" style="color: #ff9800;"></i>
            <h3>Ошибка загрузки отзывов</h3>
            <p>Пожалуйста, попробуйте обновить страницу</p>
            <button onclick="loadReviews()" class="sort-btn" style="margin-top: 20px;">
                <i class="fas fa-sync-alt"></i> Обновить
            </button>
        </div>
    `;
}

// ===================== СОБЫТИЯ =====================

document.addEventListener('DOMContentLoaded', () => {
    // Загрузка отзывов
    loadReviews();
    
    // Обработчики сортировки
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем active у всех
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            
            // Добавляем active к текущей
            btn.classList.add('active');
            
            // Обновляем сортировку
            currentSort = btn.dataset.sort;
            renderReviews();
        });
    });
});
