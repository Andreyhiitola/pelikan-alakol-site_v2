// src/js/map.js

let mapInitialized = false;

export function initMap() {
  if (mapInitialized) return;

  const LATITUDE = 45.955;
  const LONGITUDE = 81.571;

  const map = L.map('map').setView([LATITUDE, LONGITUDE], 11);

  // Используем CartoDB как источник тайлов (бесплатно, без токена)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CartoDB © OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  const pelicanIcon = L.divIcon({
    html: `<div style="background: linear-gradient(135deg, #2d8659, #4ca876);
      color: white; border-radius: 50%; width: 50px; height: 50px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5em; box-shadow: 0 4px 12px rgba(45, 134, 89, 0.3);
      border: 3px solid white;"></div>`,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  });

  L.marker([LATITUDE, LONGITUDE], { icon: pelicanIcon })
    .bindPopup(`<div style="text-align:center; font-weight:bold; color:#2d8659;">
                <h3>Парк Отель Пеликан</h3><p>Центр семейного отдыха у озера Алаколь</p></div>`)
    .addTo(map)
    .openPopup();

  L.circle([LATITUDE, LONGITUDE], {
    color: '#00d4ff',
    fill: true,
    fillColor: '#00d4ff',
    fillOpacity: 0.1,
    weight: 2,
    radius: 25000
  }).addTo(map);

  mapInitialized = true;
}
