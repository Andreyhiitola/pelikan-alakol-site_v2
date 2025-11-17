// gallery.js
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
    card.innerHTML = `
      <div class="photo-overlay"><i class="fas fa-expand"></i></div>
      <img src="${photo.image}" alt="${photo.name}" style="height: 250px; object-fit: cover;">
      <h3>${photo.name}</h3>
      <p>${photo.description || ''}</p>
    `;
    
    // Обработчик клика для открытия лайтбокса
    card.addEventListener('click', () => {
      openLightbox(photo.image, photo.name, photo.description);
    });
    
    container.appendChild(card);
  });
  console.log('✅ Gallery загружена');
}
window.renderGallery = renderGallery;
