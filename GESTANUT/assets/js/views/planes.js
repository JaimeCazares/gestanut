// ══════════════════════════════════════════════════════
// VIEW · Planes nutricionales
// ══════════════════════════════════════════════════════
VIEWS.planes = () => `<div class="view active">
  <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px">
    <div><div class="section-eyebrow">Plantillas y planes activos</div><h2 class="h-display">Tus planes <em>nutricionales</em></h2></div>
    <button class="btn btn-primary btn-sm">+ Crear plan</button>
  </div>
  <div class="g3">
    ${[
      ['🤰', 'Embarazo · 2do trim',      '2,200 kcal · 6 tiempos',          '5 pacientes', 'blush'],
      ['⚖️', 'Recomposición mujer',       '2,000-2,400 kcal · alta prot.',   '4 pacientes', 'sage'],
      ['📉', 'Control de peso',           '1,600-1,800 kcal · mediterránea', '3 pacientes', 'terra'],
      ['🤱', 'Lactancia exclusiva',       '2,400 kcal · calcio alto · DHA',  '2 pacientes', 'blush'],
      ['🩺', 'Diabetes gestacional',      '2,100 kcal · CHO complejos',      '1 paciente',  'info'],
      ['📚', 'Recetas saludables',        '15 recetas favoritas para compartir', 'Plantilla','gold'],
    ].map(([i, n, d, u, c]) => `<div class="panel" style="cursor:pointer;transition:all .25s" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 12px 32px rgba(26,51,40,.08)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
      <div style="height:80px;background:linear-gradient(135deg,var(--${c}-l),var(--${c === 'info' ? 'info-l' : c + '-ll'}));display:flex;align-items:center;justify-content:center;font-size:38px">${i}</div>
      <div style="padding:18px 20px">
        <div style="font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:var(--forest);margin-bottom:4px">${n}</div>
        <div class="muted-sm" style="font-size:11px;margin-bottom:12px">${d}</div>
        <div style="display:flex;justify-content:space-between;align-items:center"><span class="badge b-cream">${u}</span><button class="btn btn-outline btn-xs">Ver →</button></div>
      </div>
    </div>`).join('')}
  </div>
</div>`;
