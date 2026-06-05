// ══════════════════════════════════════════════════════
// VIEW · Agenda semanal
// ══════════════════════════════════════════════════════

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

function getWeekDates(offset) {
  const today = new Date();
  const day = today.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function agendaNav(delta) {
  agendaWeekOffset += delta;
  showView('agenda');
}

VIEWS.agenda = () => {
  const horas = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const DAY_NAMES = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  const days = getWeekDates(agendaWeekOffset);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekNum  = getWeekNumber(days[0]);
  const firstDay = days[0];
  const lastDay  = days[days.length - 1];
  const sameMonth = firstDay.getMonth() === lastDay.getMonth();
  const rangeText = sameMonth
    ? `${firstDay.getDate()} al ${lastDay.getDate()} de ${MONTHS[lastDay.getMonth()].toLowerCase()}`
    : `${firstDay.getDate()} ${MONTHS[firstDay.getMonth()].toLowerCase()} al ${lastDay.getDate()} ${MONTHS[lastDay.getMonth()].toLowerCase()}`;
  const monthYear  = `${MONTHS[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
  const isConnected = typeof gcalIsConnected === 'function' && gcalIsConnected();

  return `<div class="view active">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:12px">
      <div style="display:flex;align-items:center;gap:12px">
        <button class="btn-icon" onclick="agendaNav(-1)">‹</button>
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--forest)">${monthYear} · <em style="color:var(--terra)">Semana ${weekNum}</em></div>
          <div class="muted-sm">${rangeText}</div>
        </div>
        <button class="btn-icon" onclick="agendaNav(1)">›</button>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        ${isConnected
          ? `<span class="badge b-sage"><span class="dot-pulse"></span>&nbsp;Google Calendar sync</span>
             <button class="btn btn-outline btn-xs" style="font-size:11px" onclick="gcalDisconnect()">Desconectar</button>`
          : `<button class="btn btn-outline btn-sm" onclick="gcalConnect()">📅 Conectar Google Calendar</button>`
        }
        <button class="btn btn-primary btn-sm" onclick="openModal('appt-modal')">+ Nueva cita</button>
      </div>
    </div>
    <div class="panel">
      <div style="display:grid;grid-template-columns:56px repeat(6,1fr);border-bottom:1px solid rgba(107,158,120,.1)">
        <div></div>
        ${days.map((d, i) => {
          const isToday = d.getTime() === today.getTime();
          return `<div style="padding:14px 10px;text-align:center;border-right:1px solid rgba(107,158,120,.06);${isToday ? 'background:var(--sage-lll)' : ''}">
            <div style="font-size:10px;color:var(--text-m);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">${DAY_NAMES[i]}</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600">${d.getDate()}</div>
          </div>`;
        }).join('')}
      </div>
      <div style="display:grid;grid-template-columns:56px repeat(6,1fr);min-height:500px">
        <div>${horas.map(h => `<div style="height:55px;display:flex;align-items:flex-start;justify-content:flex-end;padding:5px 8px 0;border-bottom:1px solid var(--cream-d)"><span style="font-size:10px;color:var(--text-l)">${h < 12 ? h + 'am' : h === 12 ? '12pm' : (h - 12) + 'pm'}</span></div>`).join('')}</div>
        ${days.map((d, di) => {
          const isToday = d.getTime() === today.getTime();
          return `<div id="agenda-col-${di}" style="position:relative;border-right:1px solid rgba(107,158,120,.06);${isToday ? 'background:rgba(107,158,120,.02)' : ''}">
            ${horas.map(() => `<div style="height:55px;border-bottom:1px solid var(--cream-d)"></div>`).join('')}
          </div>`;
        }).join('')}
      </div>
    </div>
    ${!isConnected ? `
    <div style="margin-top:16px;background:var(--sage-lll);border-radius:var(--rs);padding:16px 20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <div style="font-size:32px">📅</div>
      <div style="flex:1;min-width:200px">
        <div style="font-weight:500;font-size:14px;margin-bottom:4px">Conecta Google Calendar para ver tus citas aquí</div>
        <div style="font-size:12px;color:var(--text-m)">Sincroniza tu agenda automáticamente y visualiza todas tus citas en una sola vista.</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="gcalConnect()">Conectar ahora</button>
    </div>` : ''}
  </div>`;
};
