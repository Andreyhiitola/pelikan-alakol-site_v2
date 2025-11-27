// gallery.js — с поддержкой галерей "./images/gallery/lake-view/*"
function renderGallery(data) {
  const container = document.getElementById('galleryContainer');
  if (!container || !data) return;

  let photos = Array.isArray(data) ? data : (data.gallery || []);
  if (!photos.length) return;

  container.innerHTML = '';

  photos.forEach((photo, i) => {
    const card = document.createElement('div');
    card.className = 'scroll-item';
    card.style.cursor = 'pointer';

    // ✅ ПРОВЕРКА: галерея или одиночное фото?
    if (photo.image.endsWith('/*')) {
      // ГАЛЕРЕЯ — показываем превью + счётчик
      const folder = photo.image.replace('/*', '');
      card.innerHTML = `
        <div class="photo-overlay">
          <i class="fas fa-images"></i>
          <span class="gallery-count">${photo.tags?.length || 3}+</span>
        </div>
        <img src="${folder}/thumbnail.jpg" alt="${photo.name}" style="height: 250px; object-fit: cover;">
        <h3>${photo.icon} ${photo.name}</h3>
        <p>${photo.description || ''}</p>
      `;
      
      // Клик открывает галерею (carousel)
      card.addEventListener('click', () => openGallery(folder, photo));
      
    } else {
      // ОДИНОЧНОЕ ФОТО
      card.innerHTML = `
        <div class="photo-overlay"><i class="fas fa-expand"></i></div>
        <img src="${photo.image}" alt="${photo.name}" style="height: 250px; object-fit: cover;">
        <h3>${photo.name}</h3>
        <p>${photo.description || ''}</p>
      `;
      
      card.addEventListener('click', () => {
        openLightbox(photo.image, photo.name, photo.description);
      });
    }
    
    container.appendChild(card);
  });
  
  console.log('✅ Gallery загружена с поддержкой галерей');
}

// ✅ НОВЫЕ ФУНКЦИИ ДЛЯ ГАЛЕРЕЙ
function openGallery(folder, photoData) {
  // Загружаем все изображения из папки
  fetchGalleryImages(folder).then(images => {
    openLightboxCarousel(images, photoData);
  });
}

async function fetchGalleryImages(folder) {
  // Загружаем список файлов из папки (через API или статический JSON)
  const response = await fetch(`/api/gallery/${folder}`);
  return response.json(); // ["01.jpg", "02.jpg", "03.jpg"]
}

window.renderGallery = renderGallery;
