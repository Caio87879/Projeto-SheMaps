const CATS = {
  rua:         { emoji: '🛣️', label: 'Via Pública' },
  casa:        { emoji: '🏠', label: 'Residência' },
  festa:       { emoji: '🎉', label: 'Festa / Bar' },
  transporte:  { emoji: '🚌', label: 'Transporte' },
  trabalho:    { emoji: '🏢', label: 'Trabalho' },
  outro:       { emoji: '📍', label: 'Outro' },
};

function getLocais() {
  return JSON.parse(localStorage.getItem("locaisSalvos") || "[]");
}
function salvarLocais(lista) {
  localStorage.setItem("locaisSalvos", JSON.stringify(lista));
}

function renderizar() {
  const lista = getLocais();
  const container = document.getElementById("lista-container");
  const badge     = document.getElementById("contador-badge");
  const dot       = document.getElementById("badge-dot");
  const n = lista.length;

  badge.textContent = n === 0 ? "Nenhum local" : `${n} local${n > 1 ? 'is' : ''}`;
  if (dot) dot.style.display = n > 0 ? "block" : "none";

  if (n === 0) {
    container.innerHTML = `
      <div class="alertas-vazio">
        <div class="vazio-icone">🗺️</div>
        <p>Nenhum local perigoso salvo ou que foi passado ainda.<br>Registre locais de risco pelo mapa para sua segurança.</p>
        <a href="denuncia.html">+ Registrar local</a>
      </div>`;
    return;
  }

  container.innerHTML = `<div class="alertas-lista">` +
    lista.map(loc => {
      const cat = CATS[loc.cat] || CATS.outro;
      return `
      <div class="alerta-card" onclick="irParaMapa(${loc.lat}, ${loc.lng})">
        <div class="alerta-icone ${loc.cat}">${cat.emoji}</div>
        <div class="alerta-info">
          <div class="alerta-tipo">${cat.label}</div>
          <div class="alerta-end">${loc.end}</div>
          <div class="alerta-data">${loc.data}</div>
        </div>
        <div class="alerta-acoes">
          <button class="btn-ir"  onclick="event.stopPropagation();irParaMapa(${loc.lat},${loc.lng})">Ver mapa</button>
          <button class="btn-del" onclick="event.stopPropagation();remover(${loc.id})">Remover</button>
        </div>
      </div>`;
    }).join('') +
  `</div>`;
}

function irParaMapa(lat, lng) {
  localStorage.setItem("mapaFoco", JSON.stringify({ lat, lng }));
  window.location.href = "mapa.html";
}

function remover(id) {
  const nova = getLocais().filter(l => l.id !== id);
  salvarLocais(nova);
  renderizar();
  toast("Local removido");
}

function limparTodos() {
  if (getLocais().length === 0) return;
  salvarLocais([]);
  renderizar();
  toast("Lista limpa");
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2800);
}

// Inicializa
renderizar();
