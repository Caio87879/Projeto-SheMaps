let map, heatmap, geocoder;

// Pontos concentrados no bairro Passarinho (Recife - Norte)
const denunciasBase = [
  // núcleo central — vermelho forte
  { lat: -7.9685, lng: -34.9108, peso: 5 },
  { lat: -7.9700, lng: -34.9100, peso: 5 },
  { lat: -7.9692, lng: -34.9095, peso: 4 },
  { lat: -7.9710, lng: -34.9115, peso: 4 },
  // espalhamento interno
  { lat: -7.9678, lng: -34.9120, peso: 3 },
  { lat: -7.9720, lng: -34.9090, peso: 3 },
  { lat: -7.9665, lng: -34.9105, peso: 2 },
  { lat: -7.9730, lng: -34.9125, peso: 2 },
  { lat: -7.9695, lng: -34.9080, peso: 2 },
  { lat: -7.9715, lng: -34.9135, peso: 2 },
  // borda — amarelo
  { lat: -7.9660, lng: -34.9090, peso: 1 },
  { lat: -7.9740, lng: -34.9100, peso: 1 },
  { lat: -7.9705, lng: -34.9145, peso: 1 },
  { lat: -7.9680, lng: -34.9070, peso: 1 },
];

function getLocaisSalvos() {
  return JSON.parse(localStorage.getItem("locaisSalvos") || "[]");
}

function initMap() {
  const center = { lat: -8.05, lng: -34.9 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13, minZoom: 11, center,
    disableDefaultUI: true,
    styles: [
      { elementType: "geometry",             stylers: [{ color: "#1a1530" }] },
      { elementType: "labels.text.stroke",   stylers: [{ color: "#1a1530" }] },
      { elementType: "labels.text.fill",     stylers: [{ color: "#9a8aaa" }] },
      { featureType: "road", elementType: "geometry",        stylers: [{ color: "#2c2445" }] },
      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a1530" }] },
      { featureType: "road.highway", elementType: "geometry",stylers: [{ color: "#3d2f5e" }] },
      { featureType: "water",   elementType: "geometry", stylers: [{ color: "#0d1b2a" }] },
      { featureType: "poi",     elementType: "geometry", stylers: [{ color: "#201839" }] },
      { featureType: "transit", elementType: "geometry", stylers: [{ color: "#201839" }] },
      { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#4a3870" }] },
    ]
  });

  geocoder = new google.maps.Geocoder();
 
  construirHeatmap();

  map.addListener("zoom_changed", () => {
    const z = map.getZoom();
    document.getElementById("zoom-num").textContent = z;
    const leg = document.getElementById("legenda");
    if (z < 13) {
      heatmap.setMap(null); leg.classList.add("hidden");
    } else if (z < 14) {
      heatmap.setOptions({ opacity: 0.38, radius: 55 });
      heatmap.setMap(map); leg.classList.remove("hidden");
    } else {
      heatmap.setOptions({ opacity: 0.78, radius: 80 });
      heatmap.setMap(map); leg.classList.remove("hidden");
    }
  });

  document.getElementById("search-input").addEventListener("keydown", e => {
    if (e.key === "Enter") buscarNaMapa(e.target.value);
  });

  // Badge de alertas
  const dot = document.getElementById("badge-dot");
  if (dot) dot.style.display = getLocaisSalvos().length > 0 ? "block" : "none";
}

function construirHeatmap() {
  const locais = getLocaisSalvos();
  const todos = [
    ...locais.map(l => ({ location: new google.maps.LatLng(l.lat, l.lng), weight: 2 })),
    ...denunciasBase.map(d => ({ location: new google.maps.LatLng(d.lat, d.lng), weight: d.peso })),
  ];
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: todos, map,
    radius: 80, opacity: 0.78,
    gradient: ["rgba(255,220,0,0)","rgba(255,220,0,0.6)","rgba(255,140,0,0.85)","rgba(224,92,92,0.95)","rgba(180,30,60,1)"]
  });
}

function zoomIn()  { map && map.setZoom(map.getZoom() + 1); }
function zoomOut() { map && map.setZoom(map.getZoom() - 1); }

function buscarNaMapa(val) {
  if (!val || !geocoder) return;
  geocoder.geocode({ address: val + ", Recife, PE" }, (res, status) => {
    if (status === "OK" && res[0]) {
      map.panTo(res[0].geometry.location);
      map.setZoom(15);
      toast("📍 " + res[0].formatted_address.split(",")[0]);
    } else {
      toast("Local não encontrado");
    }
  });
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2800);
}
