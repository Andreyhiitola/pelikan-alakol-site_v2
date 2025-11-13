/* ============================================
   GALLERY.JS - Загрузка и отображение галереи
   ============================================ */

let currentLightboxImage = 0;
let lightboxImages = [];

/**
 * Загрузка галереи из gallery.json
 */
async function loadGallery() {
    try {
        const data = await loadJSON('gallery');
        if (!data || !data.albums) {
            console.warn('Данные галереи не загружены');
            return;
        }
        displayGallery(data.albums);
    } catch (error) {
        console.error('Ошибка загрузки галереи:', error);
    }
}

/**
 * Отображение галереи с альбомами
 */
function displayGallery(albums) {
    const container = document.getElementById('galleryContainer');
    if (!container) return;

    container.innerHTML = '';

    albums.forEach(album => {
        const albumElement = document.createElement('div');
        albumElement.className = 'gallery-album';
        
        // Заголовок альбома
        const albumTitle = document.createElement('h3');
        albumTitle.className = 'album-title';
        albumTitle.textContent = album.title;
        albumElement.appendChild(albumTitle);

        // Сетка фото
        const photosGrid = document.createElement('div');
        photosGrid.className = 'photos-grid';

        album.photos.forEach((photo, index) => {
            const photoElement = document.createElement('img');
            photoElement.src = `/public/images/gallery/${album.id}/${photo.filename}`;
            photoElement.alt = photo.caption || 'Фото';
            photoElement.onerror = function() { this.src = '/public/images/placeholder.jpg'; };
            photoElement.style.cursor = 'pointer';
            photoElement.addEventListener('click', () => {
                openLightbox(album, index);
            });
            photosGrid.appendChild(photoElement);
        });

        albumElement.appendChild(photosGrid);
        container.appendChild(albumElement);
    });

    addGalleryStyles();
    console.log(`✅ Загружено ${albums.length} альбомов`);
}

/**
 * Открытие лайтбокса
 */
function openLightbox(album, index) {
    currentLightboxImage = index;
    lightboxImages = album.photos;

    const lightbox = document.getElementById('lightbox') || createLightbox();
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');

    const photo = album.photos[index];
    lightboxImg.src = `/public/images/gallery/${album.id}/${photo.filename}`;
    lightboxImg.onerror = function() { this.src = '/public/images/placeholder.jpg'; };
    lightboxCaption.textContent = photo.caption || '';

    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * Закрытие лайтбокса
 */
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Переход к предыдущему фото
 */
function prevLightboxImage() {
    currentLightboxImage = (currentLightboxImage - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage();
}

/**
 * Переход к следующему фото
 */
function nextLightboxImage() {
    currentLightboxImage = (currentLightboxImage + 1) % lightboxImages.length;
    updateLightboxImage();
}

/**
 * Обновление изображения в лайтбоксе
 */
function updateLightboxImage() {
    const photo = lightboxImages[currentLightboxImage];
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');

    lightboxImg.src = `/public/images/gallery/${photo.filename}`;
    lightboxCaption.textContent = photo.caption || '';
}

/**
 * Создание лайтбокса
 */
function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img class="lightbox-img" src="" alt="Фото">
            <div class="lightbox-caption"></div>
        </div>
        <button class="lightbox-close" onclick="closeLightbox()">✕</button>
        <button class="lightbox-prev" onclick="prevLightboxImage()">❮</button>
        <button class="lightbox-next" onclick="nextLightboxImage()">❯</button>
    `;

    // Закрытие лайтбокса по клику вне изображения
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Клавиатурная навигация
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'ArrowLeft') prevLightboxImage();
        if (e.key === 'ArrowRight') nextLightboxImage();
        if (e.key === 'Escape') closeLightbox();
    });

    document.body.appendChild(lightbox);
    return lightbox;
}

/**
 * Добавление стилей для галереи
 */
function addGalleryStyles() {
    if (document.getElementById('gallery-inline-styles')) return;

    const style = document.createElement('style');
    style.id = 'gallery-inline-styles';
    style.textContent = `
        .gallery-album {
            margin-bottom: 2rem;
        }

        .album-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--primary-color);
            margin: 0 0 1rem 0;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 0.5rem;
        }

        .photos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
        }

        .photos-grid img {
            width: 100%;
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: var(--shadow-sm);
            transition: var(--transition);
        }

        .photos-grid img:hover {
            transform: scale(1.05);
            box-shadow: var(--shadow);
        }

        .lightbox {
            display: none;
            position: fixed;
            z-index: 3000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.95);
            padding: 1rem;
        }

        .lightbox.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .lightbox-content {
            position: relative;
            width: 90%;
            max-width: 900px;
            max-height: 80vh;
        }

        .lightbox-img {
            width: 100%;
            height: auto;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 8px;
        }

        .lightbox-caption {
            position: absolute;
            bottom: -40px;
            left: 0;
            right: 0;
            text-align: center;
            color: var(--white);
            font-size: 0.95rem;
        }

        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: var(--white);
            font-size: 2rem;
            cursor: pointer;
            transition: var(--transition);
        }

        .lightbox-close:hover {
            color: var(--accent-color);
        }

        .lightbox-prev,
        .lightbox-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: var(--white);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 1rem;
            transition: var(--transition);
            backdrop-filter: blur(5px);
        }

        .lightbox-prev:hover,
        .lightbox-next:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .lightbox-prev {
            left: 1rem;
        }

        .lightbox-next {
            right: 1rem;
        }

        @media (max-width: 768px) {
            .photos-grid {
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                gap: 0.5rem;
            }

            .lightbox-prev,
            .lightbox-next {
                padding: 0.5rem;
                font-size: 1.2rem;
            }
        }

        @media (max-width: 576px) {
            .lightbox {
                padding: 0;
            }

            .lightbox-close {
                top: 1rem;
                right: 1rem;
                font-size: 1.5rem;
            }

            .lightbox-prev {
                left: 0.5rem;
                padding: 0.5rem;
            }

            .lightbox-next {
                right: 0.5rem;
                padding: 0.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Инициализация лайтбокса при загрузке
createLightbox();

console.log('✅ gallery.js загружен');
