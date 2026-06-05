// ══════════════════════════════════════════════════════
// GOOGLE CALENDAR · OAuth2 + sincronización de eventos
// ══════════════════════════════════════════════════════
const GCAL_CLIENT_ID_KEY = 'gcal_client_id';
const GCAL_TOKEN_KEY     = 'gcal_token';
const GCAL_EXPIRY_KEY    = 'gcal_token_expiry';

// Mapeo de colorId de Google Calendar a la paleta de la app
const GCAL_COLOR_MAP = {
  '1': 'info',   // Lavender
  '2': 'sage',   // Sage
  '3': 'blush',  // Grape
  '4': 'blush',  // Flamingo
  '5': 'gold',   // Banana
  '6': 'terra',  // Tangerine
  '7': 'info',   // Peacock
  '8': 'sage',   // Graphite
  '9': 'info',   // Blueberry
  '10': 'sage',  // Basil
  '11': 'terra', // Tomato
};

function gcalIsConnected() {
  const token  = localStorage.getItem(GCAL_TOKEN_KEY);
  const expiry = localStorage.getItem(GCAL_EXPIRY_KEY);
  return !!(token && expiry && Date.now() < parseInt(expiry));
}

function gcalConnect() {
  const clientId = localStorage.getItem(GCAL_CLIENT_ID_KEY);
  if (!clientId) {
    _gcalShowSetupModal();
    return;
  }
  _gcalRequestToken(clientId);
}

function _gcalRequestToken(clientId) {
  if (!window.google?.accounts?.oauth2) {
    toast('⚠️ La biblioteca de Google aún no cargó. Intenta en unos segundos.');
    return;
  }
  const client = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    callback: (resp) => {
      if (resp.error) {
        toast('⚠️ Error de autorización: ' + resp.error);
        return;
      }
      localStorage.setItem(GCAL_TOKEN_KEY, resp.access_token);
      localStorage.setItem(GCAL_EXPIRY_KEY, String(Date.now() + resp.expires_in * 1000));
      toast('Google Calendar conectado ✓ · Cargando citas...');
      if (currentView === 'agenda') {
        showView('agenda');
      } else if (currentView === 'config') {
        showView('config');
      }
    },
  });
  client.requestAccessToken();
}

function gcalDisconnect() {
  const token = localStorage.getItem(GCAL_TOKEN_KEY);
  if (token && window.google?.accounts?.oauth2) {
    google.accounts.oauth2.revoke(token, () => {});
  }
  localStorage.removeItem(GCAL_TOKEN_KEY);
  localStorage.removeItem(GCAL_EXPIRY_KEY);
  toast('Google Calendar desconectado');
  if (currentView === 'agenda') showView('agenda');
  if (currentView === 'config') showView('config');
}

async function gcalFetchWeekEvents(startDate, endDate) {
  const token = localStorage.getItem(GCAL_TOKEN_KEY);
  if (!token) return [];
  try {
    const params = new URLSearchParams({
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '250',
    });
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.status === 401) {
      localStorage.removeItem(GCAL_TOKEN_KEY);
      localStorage.removeItem(GCAL_EXPIRY_KEY);
      toast('⚠️ Sesión de Google expirada. Reconecta el calendario.');
      if (currentView === 'agenda') showView('agenda');
      return [];
    }
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    return data.items || [];
  } catch (e) {
    console.error('gcalFetchWeekEvents:', e);
    toast('⚠️ No se pudieron cargar los eventos de Google Calendar');
    return [];
  }
}

async function loadAgendaGcalEvents() {
  if (!gcalIsConnected()) return;
  const days = getWeekDates(agendaWeekOffset);
  const start = new Date(days[0]);
  const end = new Date(days[days.length - 1]);
  end.setDate(end.getDate() + 1);

  const events = await gcalFetchWeekEvents(start, end);

  const colStyle = {
    sage:  { bg: 'var(--sage-ll)',  border: 'var(--sage)'  },
    blush: { bg: 'var(--blush-l)', border: 'var(--blush)' },
    terra: { bg: 'var(--terra-l)', border: 'var(--terra)' },
    gold:  { bg: 'var(--gold-l)',  border: 'var(--gold)'  },
    info:  { bg: 'var(--info-l)',  border: 'var(--info)'  },
  };

  const dayIndex = {};
  days.forEach((d, i) => { dayIndex[d.toDateString()] = i; });

  // Limpiar eventos previos de GCal
  $$('.gcal-event').forEach(el => el.remove());

  for (const ev of events) {
    const dtStart = ev.start?.dateTime;
    if (!dtStart) continue; // eventos de día completo se ignoran

    const evStart  = new Date(dtStart);
    const evEnd    = ev.end?.dateTime ? new Date(ev.end.dateTime) : new Date(evStart.getTime() + 3600000);
    const colIdx   = dayIndex[evStart.toDateString()];
    if (colIdx === undefined) continue;

    const col = $(`#agenda-col-${colIdx}`);
    if (!col) continue;

    const startH  = evStart.getHours() + evStart.getMinutes() / 60;
    const endH    = evEnd.getHours()   + evEnd.getMinutes()   / 60;
    const topPx   = Math.round((startH - 8) * 55);
    const heightPx = Math.max(22, Math.round((endH - startH) * 55) - 4);

    if (topPx < 0 || topPx > 550) continue;

    const colorKey = GCAL_COLOR_MAP[ev.colorId] || 'sage';
    const cs       = colStyle[colorKey];
    const timeStr  = `${evStart.getHours()}:${String(evStart.getMinutes()).padStart(2, '0')}`;

    const div = document.createElement('div');
    div.className = 'gcal-event';
    div.style.cssText = `position:absolute;left:3px;right:3px;top:${topPx}px;height:${heightPx}px;background:${cs.bg};border-left:3px solid ${cs.border};border-radius:6px;padding:6px 8px;cursor:pointer;transition:transform .2s;overflow:hidden`;
    div.innerHTML = `
      <div style="font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${ev.summary || 'Sin título'}</div>
      <div style="font-size:10px;opacity:.75">${timeStr}</div>`;
    div.addEventListener('mouseover', () => { div.style.transform = 'scale(1.02)'; });
    div.addEventListener('mouseout',  () => { div.style.transform = ''; });
    col.appendChild(div);
  }
}

function _gcalShowSetupModal() {
  if (!$('#gcal-setup-modal')) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div class="modal-overlay" id="gcal-setup-modal">
      <div class="modal" style="max-width:540px">
        <div class="modal-head">
          <div class="modal-title">Conectar <em>Google Calendar</em></div>
          <button class="modal-close" onclick="closeModal('gcal-setup-modal')">✕</button>
        </div>
        <div class="modal-body">
          <div style="background:var(--sage-lll);border-radius:var(--rs);padding:14px 16px;font-size:12px;color:var(--text-m);margin-bottom:16px;line-height:1.9">
            <div style="font-weight:600;color:var(--forest);margin-bottom:8px">Pasos para obtener tu ID de cliente:</div>
            <ol style="margin:0;padding-left:18px">
              <li>Entra a <strong>console.cloud.google.com</strong></li>
              <li>Crea un proyecto nuevo y habilita la <strong>Google Calendar API</strong></li>
              <li>Ve a "Credenciales" → "Crear credenciales" → <strong>ID de cliente OAuth 2.0</strong></li>
              <li>Tipo de aplicación: <strong>Aplicación web</strong></li>
              <li>En "Orígenes de JavaScript autorizados" agrega:<br>
                <code style="background:var(--cream-d);padding:2px 6px;border-radius:3px;font-size:11px">http://localhost</code>
              </li>
              <li>Copia el <strong>ID de cliente</strong> generado y pégalo aquí abajo</li>
            </ol>
          </div>
          <div class="field">
            <label class="field-label">ID de cliente OAuth 2.0</label>
            <input id="gcal-client-id-input" class="input" placeholder="123456789-xxxxxxxxxxxx.apps.googleusercontent.com">
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" onclick="closeModal('gcal-setup-modal')">Cancelar</button>
          <button class="btn btn-primary" onclick="_gcalSaveClientId()">Guardar y conectar</button>
        </div>
      </div>
    </div>`;
    document.getElementById('modal-root').appendChild(wrapper.firstElementChild);
  }
  openModal('gcal-setup-modal');
}

function _gcalSaveClientId() {
  const input = $('#gcal-client-id-input');
  const id = input?.value?.trim();
  if (!id || !id.includes('.apps.googleusercontent.com')) {
    toast('⚠️ Ingresa un ID de cliente válido de Google');
    return;
  }
  localStorage.setItem(GCAL_CLIENT_ID_KEY, id);
  closeModal('gcal-setup-modal');
  _gcalRequestToken(id);
}
