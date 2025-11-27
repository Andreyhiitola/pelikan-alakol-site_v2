// gallery.js — ПОЛНАЯ улучшенная версия
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
    
    // ✅ ЛОГИКА: галерея или одиночное?
    let imgSrc = photo.image;
    let iconClass = 'fa-expand';
    
    if (photo.image.endsWith('/*')) {
      // ГАЛЕРЕЯ
      imgSrc = photo.image.replace('/*', '') + '/thumbnail.jpg';
      iconClass = 'fa-images';
    }
    
    card.innerHTML = `
      <div class="photo-overlay">
        <i class="fas ${iconClass}"></i>
      </div>
      <img src="${imgSrc}" alt="${photo.name}" style="height: 250px; object-fit: cover;">
      <h3>${photo.icon || ''} ${photo.name}</h3>
      <p>${photo.description || ''}</p>
    `;
    
    // ✅ КЛИК обработчик
    card.addEventListener('click', () => {
      if (photo.image.endsWith('/*')) {
        alert(`🖼️ Галерея "${photo.name}"\n📁 Папка: ${photo.image}`);
        // TODO: openGalleryCarousel(photo.image.replace('/*', ''));
      } else {
        openLightbox(photo.image, photo.name, photo.description);
      }
    });
    
    container.appendChild(card);
  });
  
  console.log('✅ Gallery загружена (с галереями)');
}

window.renderGallery = renderGallery;
