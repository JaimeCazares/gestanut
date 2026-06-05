// ══════════════════════════════════════════════════════
// VIEW · Dashboard principal
// ══════════════════════════════════════════════════════
VIEWS.dashboard = () => `<div class="view active">
  <div style="background:linear-gradient(120deg,var(--forest) 0%,var(--forest-l) 100%);border-radius:var(--r);padding:24px 28px;margin-bottom:20px;color:var(--cream);position:relative;overflow:hidden">
    <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(107,158,120,.18)"></div>
    <div style="position:relative;z-index:1;display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap">
      <div>
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--sage-l);margin-bottom:4px">Tu día hoy</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:28px;line-height:1.15;margin-bottom:6px">Tienes <em style="color:var(--sage-l);font-style:italic">4 consultas</em> programadas</div>
        <div style="color:rgba(250,246,239,.7);font-size:13px">Primera cita: <strong>9:00 AM</strong> con Sofía López · Control prenatal 28 sem</div>
      </div>
      <button class="btn btn-sm" onclick="openPatient(1)" style="background:var(--cream);color:var(--forest)">Iniciar sesión →</button>
    </div>
  </div>
  <div class="g4 mb">
    ${[
      ['green', '👩', '12', 'Pacientes activas', '↑ +2 este mes'],
      ['terra', '📅', '4',  'Citas hoy',         '3 confirmadas'],
      ['blush', '🤰', '5',  'Embarazos activos',  'Seguimiento'],
      ['gold',  '💵', '$4,800', 'Ingresos Mayo', '↑ 18% vs Abril'],
    ].map(([c, i, v, l, t]) => `<div class="stat-card ${c}"><div class="stat-deco"></div><div class="stat-icon-w">${i}</div><div class="stat-val">${v}</div><div class="stat-label">${l}</div><div class="stat-trend">${t}</div></div>`).join('')}
  </div>
  <div class="g-21 mb">
    <div class="panel">
      <div class="panel-head"><div class="panel-title"><span class="pt-icon">📅</span>Citas de hoy</div><button class="btn btn-ghost btn-xs" onclick="navTo('agenda')">Ver agenda →</button></div>
      <div class="panel-body" style="padding-top:8px">
        ${[
          { id: 1, t: '9:00',  n: 'Sofía López',     d: 'Control prenatal · 28 sem',    av: 'av-c3', ini: 'SL' },
          { id: 2, t: '10:30', n: 'María Rodríguez',  d: 'Recomposición · Seguimiento',  av: 'av-c1', ini: 'MR' },
          { id: 3, t: '12:00', n: 'Andrea González',  d: '1ª consulta · Control peso',   av: 'av-c2', ini: 'AG' },
          { id: 4, t: '15:00', n: 'Karla Vega 💻',    d: 'Online · Lactancia',           av: 'av-c3', ini: 'KV' },
        ].map(a => `<div style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--cream-d)">
          <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--sage);font-weight:600;min-width:48px">${a.t}</div>
          <div class="avatar av-md ${a.av}">${a.ini}</div>
          <div style="flex:1;min-width:0"><div style="font-weight:500;font-size:14px">${a.n}</div><div class="muted-sm">${a.d}</div></div>
          <button class="btn btn-sage btn-xs" onclick="openPatient(${a.id})">Iniciar →</button>
        </div>`).join('')}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="panel">
        <div class="panel-head"><div class="panel-title" style="font-size:15px"><span class="pt-icon">⚡</span>Accesos rápidos</div></div>
        <div class="panel-body" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${[
            ['var(--sage-ll)', 'var(--forest)',  '🧮', 'Calculadoras',   'calculadoras'],
            ['var(--terra-l)', 'var(--terra-d)', '👤', 'Nueva paciente', 'newpx-modal'],
            ['var(--blush-l)', '#9e3a5a',        '🥗', 'Crear plan',     'planes'],
            ['var(--gold-l)',  '#8a6a14',         '💰', 'Finanzas',       'finanzas'],
          ].map(([bg, co, ic, l, v]) => `<button onclick="${v.includes('-modal') ? `openModal('${v}')` : `navTo('${v}')`}" style="padding:14px;background:${bg};border:none;border-radius:var(--rs);cursor:pointer;text-align:center;font-family:'DM Sans',sans-serif;transition:all .2s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''"><div style="font-size:22px;margin-bottom:6px">${ic}</div><div style="font-size:12px;font-weight:500;color:${co}">${l}</div></button>`).join('')}
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><div class="panel-title" style="font-size:15px"><span class="pt-icon">📈</span>Ingresos · 6 meses</div></div>
        <div class="panel-body"><canvas id="dash-chart" height="110"></canvas></div>
      </div>
    </div>
  </div>
  <div class="panel">
    <div class="panel-head"><div class="panel-title"><span class="pt-icon">⏰</span>Seguimientos urgentes</div><span class="badge b-terra">3 pendientes</span></div>
    <div class="panel-body" style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
      ${[
        { id: 6, n: 'María José Pérez',  s: 'Sin datos 8 días · SOP',       av: 'av-c2', ini: 'MJ' },
        { id: 4, n: 'Karla Vega',        s: 'Ferritina baja · revisar',     av: 'av-c3', ini: 'KV' },
        { id: 3, n: 'Andrea González',   s: 'Consentimiento pendiente',     av: 'av-c2', ini: 'AG' },
      ].map(p => `<div style="background:var(--sage-lll);border-radius:var(--rs);padding:14px 16px;border:1px solid rgba(107,158,120,.1)">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div class="avatar av-sm ${p.av}">${p.ini}</div>
          <div><div style="font-weight:500;font-size:13px">${p.n}</div><div class="muted-sm" style="font-size:11px">${p.s}</div></div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-outline btn-xs" onclick="openPatient(${p.id})">Ver →</button>
          <button class="btn-wa" style="padding:4px 10px;font-size:10px" onclick="quickWA(${p.id})"><svg viewBox="0 0 24 24" style="width:10px;height:10px;fill:currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>Contactar</button>
        </div>
      </div>`).join('')}
    </div>
  </div>
</div>`;

function initDash() {
  makeChart('#dash-chart', {
    type: 'line',
    data: {
      labels: ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'],
      datasets: [{
        data: [3200, 3500, 2800, 4200, 4100, 4800],
        borderColor: '#6b9e78', backgroundColor: 'rgba(107,158,120,.12)',
        tension: .4, fill: true,
        pointBackgroundColor: '#1a3328', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 5, pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#1a3328', padding: 10, titleFont: { family: 'DM Sans' }, bodyFont: { family: 'DM Sans' }, callbacks: { label: c => '$' + c.parsed.y.toLocaleString() } }
      },
      scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: '#8a9e84', font: { family: 'DM Sans', size: 11 } } } }
    }
  });
}
