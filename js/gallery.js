// gallery.js — ПОЛНАЯ ВЕРСИЯ с галереями и полноэкранной каруселью
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
    let isGallery = false;
    
    if (photo.image && photo.image.endsWith('/*')) {
      const folder = photo.image.replace('/*', '');
      imgSrc = `${folder}/thumbnail.jpg`;
      iconClass = 'fa-images';
      isGallery = true;
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
      if (isGallery) {
        openGalleryCarousel(photo.image.replace('/*', ''), photo);
      } else {
        openLightbox(imgSrc, photo.name, photo.description);
      }
    });
    
    container.appendChild(card);
  });
  
  console.log('✅ Gallery загружена (галереи + одиночные)');
}

function openGalleryCarousel(folder, photoData) {
  const galleryImages = [
    `${folder}/01.jpg`,
    `${folder}/02.jpg`,
    `${folder}/03.jpg`,
    `${folder}/04.jpg`,
    `${folder}/05.jpg`
  ].filter(img => img);
  
  if (galleryImages.length === 0) {
    alert('❌ Изображения галереи не найдены!');
    return;
  }
  
  openLightboxCarousel(galleryImages, photoData.name, photoData.description);
}

// ✅ ПОЛНОЭКРАННАЯ КАРУСЕЛЬ (100VW/100VH)
function openLightboxCarousel(images, title, description = '') {
  const lightbox = document.createElement('div');
  lightbox.id = 'galleryLightbox';
  lightbox.style.cssText = `
    position: fixed; top: 0; left: 0; 
    width: 100vw; height: 100vh; 
    background: rgba(0,0,0,0.95); 
    z-index: 9999; 
    display: flex; 
    padding: 0;
  `;
  
  let currentIndex = 0;
  
  lightbox.innerHTML = `
    <button id="closeBtn" style="
      position: absolute; top: 20px; right: 30px; 
      background: rgba(0,0,0,0.7); border: none; 
      color: white; font-size: 28px; cursor: pointer; 
      width: 50px; height: 50px; border-radius: 50%; 
      display: flex; align-items: center; justify-content: center;
      z-index: 10001;
    ">×</button>
    
    <button id="prevBtn" style="
      position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
      background: rgba(0,0,0,0.7); border: none; color: white; 
      font-size: 40px; cursor: pointer; width: 60px; height: 60px; 
      border-radius: 50%; display: flex; align-items: center; 
      justify-content: center; z-index: 10001;
    ">‹</button>
    
    <img id="carouselImg" 
         src="${images[0]}" 
         style="
           position: fixed;
           top: 0;
           left: 0;
           width: 100vw;
           height: 100vh;
           object-fit: contain;
           z-index: 10000;
           margin: 0;
           padding: 0;
         ">
    
    <button id="nextBtn" style="
      position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
      background: rgba(0,0,0,0.7); border: none; color: white; 
      font-size: 40px; cursor: pointer; width: 60px; height: 60px; 
      border-radius: 50%; display: flex; align-items: center; 
      justify-content: center; z-index: 10001;
    ">›</button>
    
    <div id="infoBar" style="
      position: absolute; bottom: 30px; left: 50%; 
      transform: translateX(-50%); 
      background: rgba(0,0,0,0.8); padding: 15px 25px; 
      border-radius: 25px; color: white; font-size: 16px;
      text-align: center; min-width: 200px; z-index: 10001;
    ">
      ${title} (${currentIndex + 1}/${images.length})
    </div>
  `;
  
  document.body.appendChild(lightbox);
  
  const img = document.getElementById('carouselImg');
  const infoBar = document.getElementById('infoBar');
  
  document.getElementById('closeBtn').onclick = closeLightbox;
  document.getElementById('prevBtn').onclick = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    img.src = images[currentIndex];
    updateCounter();
  };
  
  document.getElementById('nextBtn').onclick = () => {
    currentIndex = (currentIndex + 1) % images.length;
    img.src = images[currentIndex];
    updateCounter();
  };
  
  function updateCounter() {
    infoBar.textContent = `${title} (${currentIndex + 1}/${images.length})`;
  }
  
  document.onkeydown = (e) => {
    if (e.key === 'ArrowLeft') document.getElementById('prevBtn').click();
    if (e.key === 'ArrowRight') document.getElementById('nextBtn').click();
    if (e.key === 'Escape') closeLightbox();
  };
  
  img.onclick = () => document.getElementById('nextBtn').click();
}

function openLightbox(imageSrc, title, description) {
  const lightbox = document.createElement('div');
  lightbox.id = 'simpleLightbox';
  lightbox.innerHTML = `
    <div style="
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
      background: rgba(0,0,0,0.95); z-index: 9999; 
      display: flex; align-items: center; justify-content: center; padding: 0;
    ">
      <button onclick="closeLightbox()" style="
        position: absolute; top: 20px; right: 30px; 
        background: none; border: none; color: white; font-size: 30px; z-index: 10001;
      ">×</button>
      <img src="${imageSrc}" style="
        position: fixed; top: 0; left: 0;
        width: 100vw; height: 100vh; 
        object-fit: contain; z-index: 10000;
      ">
      <div style="position: absolute; bottom: 30px; color: white; z-index: 10001;">
        ${title}
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);
  
  document.onkeydown = (e) => {
    if (e.key === 'Escape') closeLightbox();
  };
}

function closeLightbox() {
  const lightbox = document.getElementById('galleryLightbox') || 
                   document.getElementById('simpleLightbox');
  if (lightbox) lightbox.remove();
  document.onkeydown = null;
}

window.renderGallery = renderGallery;
window.openLightboxCarousel = openLightboxCarousel;
window.closeLightbox = closeLightbox;
