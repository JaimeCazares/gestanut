// ══════════════════════════════════════════════════════
// VIEW · Finanzas
// ══════════════════════════════════════════════════════
VIEWS.finanzas = () => {
  const ing = FINANZAS.filter(m => m.tipo === 'in').reduce((s, m) => s + m.monto, 0);
  const gas = FINANZAS.filter(m => m.tipo === 'out').reduce((s, m) => s + m.monto, 0);
  return `<div class="view active">
    <div class="g3 mb">
      <div class="panel" style="background:var(--forest);border:none;padding:24px;border-radius:var(--r);position:relative;overflow:hidden">
        <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:rgba(107,158,120,.18)"></div>
        <div style="position:relative;z-index:1;color:var(--cream)">
          <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--sage-l);margin-bottom:4px">Ingresos · Mayo</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:600;line-height:1;margin:6px 0">${fmt$(ing)}</div>
          <div style="color:rgba(250,246,239,.65);font-size:12px">${FINANZAS.filter(m => m.tipo === 'in').length} consultas</div>
        </div>
      </div>
      <div class="panel" style="padding:24px">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--terra);margin-bottom:4px">Gastos</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:600;color:var(--terra-d);line-height:1;margin:6px 0">${fmt$(gas)}</div>
        <div class="muted-sm">${FINANZAS.filter(m => m.tipo === 'out').length} movimientos</div>
      </div>
      <div class="panel" style="background:linear-gradient(135deg,var(--sage),var(--forest-l));border:none;padding:24px;border-radius:var(--r)">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--sage-l);margin-bottom:4px">Utilidad neta</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:600;color:var(--cream);line-height:1;margin:6px 0">${fmt$(ing - gas)}</div>
        <div style="color:rgba(250,246,239,.7);font-size:12px">↑ 18% vs Abril</div>
      </div>
    </div>
    <div class="g-21">
      <div class="panel">
        <div class="panel-head"><div class="panel-title"><span class="pt-icon">📋</span>Movimientos · Mayo 2025</div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-outline btn-xs" onclick="toast('Exportando a Excel 📊')">📊 Excel</button>
            <button class="btn btn-sage btn-xs" onclick="toast('Registrando movimiento ✓')">+ Registrar</button>
          </div>
        </div>
        <div style="max-height:460px;overflow-y:auto">
          <table style="width:100%;border-collapse:collapse">
            ${FINANZAS.map(m => `<tr style="border-bottom:1px solid var(--cream-d)">
              <td style="padding:11px 14px;font-size:11px;color:var(--text-m);width:72px">${m.fecha}</td>
              <td style="padding:11px 6px;font-size:13px">${m.concepto}</td>
              <td style="padding:11px 14px;text-align:right">
                <div style="font-weight:600;color:${m.tipo === 'in' ? 'var(--sage)' : 'var(--terra)'};font-family:'Cormorant Garamond',serif;font-size:16px">${m.tipo === 'in' ? '+' : '-'}${fmt$(m.monto)}</div>
              </td>
              <td style="padding:11px 14px;text-align:right">
                ${m.tipo === 'in' ? `<button class="btn btn-xs btn-outline" onclick="openReceipt(${m.id})" title="Generar recibo">🧾</button>` : ''}
              </td>
            </tr>`).join('')}
          </table>
        </div>
      </div>
      <div>
        <div class="panel mb-sm">
          <div class="panel-head"><div class="panel-title" style="font-size:15px"><span class="pt-icon">💰</span>Pendientes de cobro</div></div>
          <div class="panel-body" style="padding:0">
            ${[
              { n: 'Sofía López', h: 'Hoy 9:00 AM',         m: 400, av: 'av-c3', ini: 'SL' },
              { n: 'Karla Vega',  h: 'Hoy 3:00 PM · Online', m: 350, av: 'av-c3', ini: 'KV' },
            ].map(p => `<div style="display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--cream-d)">
              <div class="avatar av-sm ${p.av}">${p.ini}</div>
              <div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:500">${p.n}</div><div class="muted-sm" style="font-size:11px">${p.h}</div></div>
              <span class="badge b-gold">${fmt$(p.m)}</span>
            </div>`).join('')}
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><div class="panel-title" style="font-size:15px"><span class="pt-icon">📊</span>Por tipo · Mayo</div></div>
          <div class="panel-body">
            ${[
              ['Prenatales',    1600, 33, 'blush'],
              ['Recomposición',  900, 19, 'sage'],
              ['Control peso',  1300, 27, 'terra'],
              ['Online',         630, 13, 'gold'],
            ].map(([l, v, p, c]) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span>${l}</span><span style="font-weight:600">${fmt$(v)}</span></div><div class="progress"><div class="progress-fill" style="width:${p}%;background:var(--${c})"></div></div></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

function openReceipt(id) {
  currentReceipt = FINANZAS.find(m => m.id === id);
  openModal('receipt-modal');
}
