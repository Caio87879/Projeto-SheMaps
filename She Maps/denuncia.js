let geocoder, miniMap, miniMarcador;
let latSel = null, lngSel = null, catSel = null;

function initGeocoder() {
  geocoder = new google.maps.Geocoder();
  // badge
  const dot = document.getElementById("badge-dot");
  const locais = JSON.parse(localStorage.getItem("locaisSalvos") || "[]");
  if (dot) dot.style.display = locais.length > 0 ? "block" : "none";
}

// ── CATEGORIA ──
function selCat(el, cat) {
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("sel"));
  el.classList.add("sel");
  catSel = cat;
}

// ── GPS ──
function usarGPS() {
  if (!navigator.geolocation) { toast("Geolocalização não disponível"); return; }
  navigator.geolocation.getCurrentPosition(
    pos => definirLocal(pos.coords.latitude, pos.coords.longitude),
    ()  => { toast("Não foi possível obter localização"); }
  );
}

// ── MINI MAPA ──
function abrirMiniMapa() {
  let overlay = document.getElementById("mini-mapa-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "mini-mapa-overlay";
    overlay.className = "mini-mapa-overlay";
    overlay.innerHTML = `
      <div class="mini-mapa-hint">📍 Toque no mapa para marcar o local</div>
      <div id="mini-map"></div>
      <button class="mini-mapa-fechar" onclick="fecharMiniMapa()">Confirmar local</button>`;
    document.body.appendChild(overlay);

    miniMap = new google.maps.Map(document.getElementById("mini-map"), {
      zoom: 14, minZoom: 11,
      center: { lat: -8.05, lng: -34.9 },
      disableDefaultUI: true,
    });

    miniMap.addListener("click", e => {
      definirLocal(e.latLng.lat(), e.latLng.lng(), true);
    });
  }
  overlay.classList.add("show");
}

function fecharMiniMapa() {
  const overlay = document.getElementById("mini-mapa-overlay");
  if (overlay) overlay.classList.remove("show");
}

// ── DEFINIR LOCAL ──
function definirLocal(lat, lng, noMiniMapa = false) {
  latSel = lat; lngSel = lng;

  // marcador no mini mapa
  if (noMiniMapa && miniMap) {
    if (miniMarcador) miniMarcador.setMap(null);
    miniMarcador = new google.maps.Marker({
      position: { lat, lng }, map: miniMap,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10, fillColor: "#e05c5c", fillOpacity: 1,
        strokeColor: "white", strokeWeight: 2
      },
      animation: google.maps.Animation.DROP
    });
  }

  const coordEl = document.getElementById("coord-display");
  coordEl.textContent = `📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  coordEl.classList.add("ok");

  if (geocoder) {
    geocoder.geocode({ location: { lat, lng } }, (res, status) => {
      if (status === "OK" && res[0])
        document.getElementById("endereco-input").value = res[0].formatted_address;
    });
  }

  toast("📍 Local definido!");
}

// ── BUSCA ──
let buscaTimer;
function buscarEndereco(val) {
  clearTimeout(buscaTimer);
  if (val.length < 4 || !geocoder) return;
  buscaTimer = setTimeout(() => {
    geocoder.geocode({ address: val + ", Recife, PE" }, (res, status) => {
      if (status === "OK" && res[0]) {
        const loc = res[0].geometry.location;
        definirLocal(loc.lat(), loc.lng());
      }
    });
  }, 600);
}

// ── ENVIAR ──
function enviar() {
  if (!latSel || !lngSel) { toast("⚠️ Defina a localização primeiro"); return; }
  if (!catSel)             { toast("⚠️ Selecione o tipo de local");     return; }

  const endVal = document.getElementById("endereco-input").value
    || `${latSel.toFixed(4)}, ${lngSel.toFixed(4)}`;
  const hoje = new Date().toLocaleDateString("pt-BR");

  const locais = JSON.parse(localStorage.getItem("locaisSalvos") || "[]");
  const proximoId = locais.length > 0 ? Math.max(...locais.map(l => l.id)) + 1 : 1;

  locais.unshift({ id: proximoId, cat: catSel, lat: latSel, lng: lngSel, end: endVal, data: hoje });
  localStorage.setItem("locaisSalvos", JSON.stringify(locais));

  toast("✅ Local salvo nos alertas!");
  setTimeout(() => window.location.href = "alerta.html", 1200);
}

// ── TOAST ──
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2800);
}
