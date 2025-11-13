/* ============================================
   REVIEWS.JS - Загрузка отзывов и управление
   ============================================ */

/**
 * Загрузка отзывов из reviews.json
 */
async function loadReviews() {
    try {
        const data = await loadJSON('reviews');
        if (!data || !data.reviews) {
            console.warn('Данные отзывов не загружены');
            return;
        }
        displayReviews(data.reviews);
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
    }
}

/**
 * Отображение отзывов в контейнере
 */
function displayReviews(reviews) {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;

    container.innerHTML = '';

    // Фильтруем только одобренные отзывы
    const approvedReviews = reviews.filter(review => review.approved);

    if (approvedReviews.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light);">Отзывы еще не добавлены</p>';
        return;
    }

    approvedReviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-header">
                <h3 class="review-author">${review.author}</h3>
                <span class="review-date">${formatDate(review.date)}</span>
            </div>
            
            <div class="review-rating">${createRatingStars(review.rating)}</div>
            
            <p class="review-text">${review.text}</p>
            
            ${review.photos && review.photos.length > 0 ? `
                <div class="review-photos">
                    ${review.photos.map(photo => `
                        <img src="/public/images/reviews/${photo}" alt="Фото отзыва" onerror="this.src='/public/images/placeholder.jpg'">
                    `).join('')}
                </div>
            ` : ''}
        `;
        container.appendChild(reviewCard);
    });

    addReviewStyles();
    console.log(`✅ Загружено ${approvedReviews.length} отзывов`);
}

/**
 * Добавление стилей для отзывов
 */
function addReviewStyles() {
    if (document.getElementById('review-inline-styles')) return;

    const style = document.createElement('style');
    style.id = 'review-inline-styles';
    style.textContent = `
        #reviewsContainer {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }

        .review-card {
            background: var(--white);
            border-left: 5px solid var(--accent-color);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: var(--shadow-sm);
            transition: var(--transition);
        }

        .review-card:hover {
            box-shadow: var(--shadow);
            transform: translateY(-4px);
        }

        .review-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .review-author {
            margin: 0;
            font-size: 1.1rem;
            color: var(--text-dark);
        }

        .review-date {
            font-size: 0.85rem;
            color: var(--text-light);
            white-space: nowrap;
        }

        .review-rating {
            font-size: 1.2rem;
            letter-spacing: 3px;
            color: #ffc107;
            margin-bottom: 1rem;
        }

        .review-text {
            color: var(--text-light);
            line-height: 1.6;
            margin: 0 0 1rem 0;
            font-size: 0.95rem;
        }

        .review-photos {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 0.75rem;
            margin-top: 1rem;
        }

        .review-photos img {
            width: 100%;
            height: 80px;
            object-fit: cover;
            border-radius: 6px;
            cursor: pointer;
            transition: var(--transition);
        }

        .review-photos img:hover {
            transform: scale(1.08);
        }

        @media (max-width: 768px) {
            #reviewsContainer {
                grid-template-columns: 1fr;
            }

            .review-header {
                flex-direction: column;
                gap: 0.25rem;
            }

            .review-author {
                font-size: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ reviews.js загружен');
