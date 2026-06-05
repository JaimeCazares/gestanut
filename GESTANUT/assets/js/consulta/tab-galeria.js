// ══════════════════════════════════════════════════════
// TAB · Galería de fotos de progreso
// ══════════════════════════════════════════════════════
function tabGaleria(p) {
  return `<div class="panel">
    <div class="panel-head">
      <div class="panel-title"><span class="pt-icon">📸</span>Galería de progreso</div>
      <button class="btn btn-sage btn-xs">+ Subir foto</button>
    </div>
    <div class="panel-body">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
        ${['28 Abr · Frente', '28 Abr · Lateral', '14 Abr · Frente', '14 Abr · Lateral', '31 Mar · Frente', '31 Mar · Lateral', '17 Mar · Inicio · Frente', '17 Mar · Inicio · Lateral']
          .map(g => `<div style="aspect-ratio:3/4;background:linear-gradient(135deg,var(--sage-ll),var(--cream-d));border-radius:var(--rs);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:all .2s" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform=''">
            <div style="font-size:28px;opacity:.4">📷</div>
            <div style="position:absolute;bottom:8px;left:8px;right:8px"><span class="badge b-cream" style="font-size:9px;width:100%;justify-content:center">${g}</span></div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}
