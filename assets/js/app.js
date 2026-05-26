// ══════════════════════════════════════════════════════
// APP · Initialisation
// ══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  injectModals();
  showView('dashboard');
  const h = new Date().getHours();
  const g = h < 12 ? 'Buenos días' : 'Buenos tardes';
  $('#tb-title').innerHTML = `${g}, <em>Diana</em> 🌿`;
});
