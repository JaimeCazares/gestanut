// ══════════════════════════════════════════════════════
// NAVIGATION · Sidebar buttons + view routing
// ══════════════════════════════════════════════════════
$$('.nav-btn').forEach(b => b.addEventListener('click', () => {
  const v = b.dataset.view;
  if (!v) return;
  currentPatient = null;
  $$('.nav-btn').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  showView(v);
}));

function showView(name) {
  currentView = name;
  currentPatient = null;
  const c = $('#content-area');
  c.innerHTML = '';
  const fn = VIEWS[name];
  if (fn) c.innerHTML = fn();
  const ti = {
    dashboard:      ['Buenos días, <em>Diana</em> 🌿',           ''],
    pacientes:      ['Mis <em>Pacientes</em>',                   '12 pacientes activas · Expedientes digitales completos'],
    agenda:         ['<em>Agenda</em>',                          'Semana del 5 al 10 de mayo · Sincronizado con Google Calendar'],
    planes:         ['Planes <em>Nutricionales</em>',            'Crea, edita y envía planes personalizados'],
    calculadoras:   ['<em>Calculadoras</em> Clínicas',           'IMC · Calorías · Macros · Agua · Gestacional'],
    consentimientos:['<em>Consentimientos</em> Informados',      'Control y firma de consentimientos'],
    finanzas:       ['<em>Finanzas</em>',                        'Mayo 2025 · Ingresos, gastos y recibos'],
    reportes:       ['<em>Reportes</em>',                        'Estadísticas y métricas de tu práctica'],
    config:         ['<em>Configuración</em>',                   'Personaliza tu sistema profesional'],
  };
  if (ti[name]) {
    $('#tb-title').innerHTML = ti[name][0];
    $('#tb-sub').textContent = ti[name][1];
  }
  setTimeout(() => {
    if (name === 'dashboard')    initDash();
    if (name === 'pacientes')    renderGrid();
    if (name === 'agenda')       loadAgendaGcalEvents();
    if (name === 'calculadoras') { recalcIMC(); recalcKcal(); recalcWater(); recalcGest(); }
    if (name === 'reportes')     initReportes();
  }, 40);
}

function navTo(n) {
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === n));
  showView(n);
}
