// gallery.js — с РАБОТАЮЩЕЙ галереей!
function renderGallery(data) {
  const container = document.getElementById('galleryContainer');
  if (!container || !data) return;

  let photos = Array.isArray(data) ? data : (data.gallery || []);
  if (!photos.length) return;

  container.innerHTML = '';
  
  photos.forEach((photo) => {
    const card = document.createElement('div');
    card.className = 'scroll-item';
    card.style.cursor = 'pointer';
    
    let imgSrc = photo.image;
    let iconClass = 'fa-expand';
    
    if (photo.image.endsWith('/*')) {
      const folder = photo.image.replace('/*', '');
      imgSrc = `${folder}/thumbnail.jpg`;
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
    
    card.addEventListener('click', () => {
      if (photo.image.endsWith('/*')) {
        openGalleryCarousel(photo.image.replace('/*', ''), photo);
      } else {
        openLightbox(photo.image, photo.name, photo.description);
      }
    });
    
    container.appendChild(card);
  });
}

// ✅ НОВАЯ ФУНКЦИЯ: КАРУСЕЛЬ ГАЛЕРЕИ
function openGalleryCarousel(folder, photoData) {
  const galleryImages = [
    `${folder}/01.jpg`,
    `${folder}/02.jpg`,
    `${folder}/03.jpg`,
    `${folder}/04.jpg`
  ].filter(img => img); // убираем пустые
  
  openLightboxCarousel(galleryImages, photoData.name);
}

// ✅ КАРУСЕЛЬ ЛАЙТБОКС (простая реализация)
function openLightboxCarousel(images, title) {
  const lightbox = document.createElement('div');
  lightbox.id = 'galleryLightbox';
  lightbox.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center;
  `;
  
  let currentIndex = 0;
  
  lightbox.innerHTML = `
    <button onclick="closeLightbox()" style="position: absolute; top: 20px; right: 30px; background: none; border: none; color: white; font-size: 30px; cursor: pointer;">×</button>
    <button id="prevBtn" style="position: absolute; left: 20px; background: none; border: none; color: white; font-size: 40px; cursor: pointer;">‹</button>
    <img id="carouselImg" src="${images[0]}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
    <button id="nextBtn" style="position: absolute; right: 20px; background: none; border: none; color: white; font-size: 40px; cursor: pointer;">›</button>
    <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); color: white;">
      ${title} (${currentIndex + 1}/${images.length})
    </div>
  `;
  
  document.body.appendChild(lightbox);
  
  // Навигация
  document.getElementById('prevBtn').onclick = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    document.getElementById('carouselImg').src = images[currentIndex];
    updateCounter();
  };
  
  document.getElementById('nextBtn').onclick = () => {
    currentIndex = (currentIndex + 1) % images.length;
    document.getElementById('carouselImg').src = images[currentIndex];
    updateCounter();
  };
  
  function updateCounter() {
    lightbox.querySelector('div').textContent = `${title} (${currentIndex + 1}/${images.length})`;
  }
  
  // Клавиши
  document.onkeydown = (e) => {
    if (e.key === 'ArrowLeft') document.getElementById('prevBtn').click();
    if (e.key === 'ArrowRight') document.getElementById('nextBtn').click();
    if (e.key === 'Escape') closeLightbox();
  };
}

function closeLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox) lightbox.remove();
  document.onkeydown = null;
}

window.renderGallery = renderGallery;
