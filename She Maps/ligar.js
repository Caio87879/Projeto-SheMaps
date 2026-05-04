// Badge de alertas
const dot = document.getElementById("badge-dot");
const locais = JSON.parse(localStorage.getItem("locaisSalvos") || "[]");
if (dot) dot.style.display = locais.length > 0 ? "block" : "none";
