const map = L.map('map').setView([-8.05, -34.9], 13);

// mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// ícones
const pinkIcon = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/pink-dot.png',
  iconSize: [32, 32]
});

const blueIcon = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  iconSize: [32, 32]
});

// marcadores
const marker = L.marker([-8.05, -34.9], { icon: pinkIcon }).addTo(map);

L.marker([-8.06, -34.88], { icon: blueIcon }).addTo(map);

// zona
L.circle([-8.05, -34.9], {
  color: 'red',
  fillColor: 'yellow',
  fillOpacity: 0.35,
  radius: 1500
}).addTo(map);

// mover marcador
map.on('click', function(e) {
  marker.setLatLng(e.latlng);
});

/* BOTÕES */
function setActive(el) {
  document.querySelectorAll(".btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
}

function openDashboard() {
  console.log("Dashboard");
}

function openAlerts() {
  console.log("Alertas");
}

function callSupport() {
  console.log("Ligando...");
}

function openMenu() {
  console.log("Menu");
}