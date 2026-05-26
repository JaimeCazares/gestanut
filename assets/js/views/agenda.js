// ══════════════════════════════════════════════════════
// VIEW · Agenda semanal
// ══════════════════════════════════════════════════════
VIEWS.agenda = () => {
  const cols  = { sage: 'var(--sage-ll)', blush: 'var(--blush-l)', terra: 'var(--terra-l)', gold: 'var(--gold-l)', info: 'var(--info-l)' };
  const bords = { sage: 'var(--sage)',    blush: 'var(--blush)',   terra: 'var(--terra)',   gold: 'var(--gold)',   info: 'var(--info)'   };
  const horas = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const diasData = [
    [{ t: 105, n: 'Laura Méndez',    s: 'Recomp.',        c: 'sage'  }, { t: 255, n: 'Elena Torres',    s: 'Prenatal 14sem', c: 'blush' }],
    [{ t: 50,  n: 'Sofía López',     s: 'Prenatal 28sem', c: 'blush' }, { t: 135, n: 'María Rodríguez', s: 'Recomp.',        c: 'sage'  }, { t: 215, n: 'Andrea González', s: '1ª consulta', c: 'terra' }, { t: 380, n: 'Karla Vega 💻', s: 'Online', c: 'gold' }],
    [{ t: 82,  n: 'Paola Ramírez',   s: 'Post-parto',     c: 'sage'  }, { t: 242, n: 'Gabriela M. 💻',  s: 'Online',        c: 'gold'  }],
    [{ t: 105, n: 'Isabel Ramos',    s: 'DG · Prenatal',  c: 'gold'  }, { t: 242, n: 'María José',      s: 'Control peso',  c: 'terra' }],
    [{ t: 82,  n: 'Isabel Ramos',    s: 'Prenatal 32sem', c: 'blush' }, { t: 160, n: 'Sandra Flores',   s: 'Recomp.',       c: 'sage'  }],
    [{ t: 82,  n: 'Valeria Cruz 💻', s: 'Online',         c: 'gold'  }],
  ];

  return `<div class="view active">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:12px">
      <div style="display:flex;align-items:center;gap:12px">
        <button class="btn-icon">‹</button>
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--forest)">Mayo 2025 · <em style="color:var(--terra)">Semana 19</em></div>
          <div class="muted-sm">5 al 10 de mayo</div>
        </div>
        <button class="btn-icon">›</button>
      </div>
      <div style="display:flex;gap:8px">
        <span class="badge b-sage"><span class="dot-pulse"></span>&nbsp;Google Calendar sync</span>
        <button class="btn btn-primary btn-sm" onclick="openModal('appt-modal')">+ Nueva cita</button>
      </div>
    </div>
    <div class="panel">
      <div style="display:grid;grid-template-columns:56px repeat(6,1fr);border-bottom:1px solid rgba(107,158,120,.1)">
        <div></div>
        ${['LUN 5', 'MAR 6', 'MIÉ 7', 'JUE 8', 'VIE 9', 'SÁB 10'].map((d, i) => {
          const isToday = i === 1;
          return `<div style="padding:14px 10px;text-align:center;border-right:1px solid rgba(107,158,120,.06);${isToday ? 'background:var(--sage-lll)' : ''}">
            <div style="font-size:10px;color:var(--text-m);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">${d.split(' ')[0]}</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600">${d.split(' ')[1]}</div>
          </div>`;
        }).join('')}
      </div>
      <div style="display:grid;grid-template-columns:56px repeat(6,1fr);min-height:500px">
        <div>${horas.map(h => `<div style="height:55px;display:flex;align-items:flex-start;justify-content:flex-end;padding:5px 8px 0;border-bottom:1px solid var(--cream-d)"><span style="font-size:10px;color:var(--text-l)">${h < 12 ? h + 'am' : h === 12 ? '12pm' : (h - 12) + 'pm'}</span></div>`).join('')}</div>
        ${diasData.map((day, di) => {
          const isToday = di === 1;
          return `<div style="position:relative;border-right:1px solid rgba(107,158,120,.06);${isToday ? 'background:rgba(107,158,120,.02)' : ''}">
            ${horas.map(() => `<div style="height:55px;border-bottom:1px solid var(--cream-d)"></div>`).join('')}
            ${day.map(e => `<div style="position:absolute;left:3px;right:3px;top:${e.t}px;height:50px;background:${cols[e.c]};border-left:3px solid ${bords[e.c]};border-radius:6px;padding:6px 8px;cursor:pointer;transition:all .2s;overflow:hidden" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform=''"><div style="font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e.n}</div><div style="font-size:10px;opacity:.75">${e.s}</div></div>`).join('')}
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
};
