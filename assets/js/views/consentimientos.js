// ══════════════════════════════════════════════════════
// VIEW · Consentimientos informados
// ══════════════════════════════════════════════════════
VIEWS.consentimientos = () => `<div class="view active">
  <div class="g2 mb">
    <div class="stat-card green"><div class="stat-deco"></div><div class="stat-icon-w">✅</div><div class="stat-val">11</div><div class="stat-label">Consentimientos firmados</div></div>
    <div class="stat-card terra"><div class="stat-deco"></div><div class="stat-icon-w">⚠️</div><div class="stat-val">1</div><div class="stat-label">Pendientes</div><div class="stat-trend down">Andrea González · 1ª consulta hoy</div></div>
  </div>
  <div class="g-21">
    <div class="panel">
      <div class="panel-head">
        <div class="panel-title"><span class="pt-icon">📝</span>Consentimientos de pacientes</div>
        <button class="btn btn-primary btn-sm" onclick="openModal('consent-modal')">+ Generar</button>
      </div>
      <div class="panel-body" style="padding:0">
        ${PATIENTS.map(p => `<div style="display:flex;align-items:center;gap:14px;padding:12px 18px;border-bottom:1px solid var(--cream-d)">
          <div class="avatar av-sm ${p.av}">${p.ini}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:500">${p.name}</div>
            <div class="muted-sm" style="font-size:11px">${p.historia.motivo}</div>
          </div>
          ${p.consentimiento.firmado
            ? `<div style="text-align:right"><span class="badge b-green">✓ Firmado</span><div class="muted-sm" style="font-size:10px;margin-top:3px">${p.consentimiento.fecha}</div></div>`
            : `<button class="btn btn-terra btn-xs" onclick="openModal('consent-modal');toast('Generando consentimiento para ${p.name}')">Generar →</button>`}
        </div>`).join('')}
      </div>
    </div>
    <div>
      <div class="panel mb-sm">
        <div class="panel-head"><div class="panel-title" style="font-size:15px"><span class="pt-icon">📄</span>Plantilla de consentimiento</div></div>
        <div class="panel-body">
          <div style="background:var(--sage-lll);border-radius:var(--rs);padding:16px;font-size:12px;line-height:1.9;color:var(--text)">
            <div style="font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;text-align:center;margin-bottom:12px">CARTA DE CONSENTIMIENTO INFORMADO</div>
            <div style="margin-bottom:8px"><strong>Nutrióloga:</strong> Diana Zavala · Cédula: 15304166</div>
            <div style="margin-bottom:8px"><strong>Servicios:</strong> Consulta nutricional, elaboración de plan de alimentación personalizado, seguimiento y evaluación antropométrica.</div>
            <div style="margin-bottom:8px"><strong>Confidencialidad:</strong> Toda la información proporcionada será tratada con estricta confidencialidad conforme a la Ley Federal de Protección de Datos Personales.</div>
            <div style="color:var(--text-l);font-size:11px;margin-top:12px;text-align:center">La paciente declara haber leído y comprendido el presente documento...</div>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="btn btn-sage btn-sm" style="flex:1" onclick="toast('Consentimiento descargado ✓')">📥 Descargar PDF</button>
            <button class="btn btn-outline btn-sm" onclick="toast('Consentimiento enviado por WhatsApp ✓')">📤 Enviar</button>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><div class="panel-title" style="font-size:15px"><span class="pt-icon">💡</span>¿Por qué es importante?</div></div>
        <div class="panel-body">
          ${['Protege legalmente tu práctica', 'Cumple con la NOM-012 de ética médica', 'Establece expectativas claras', 'Genera confianza en la paciente', 'Requerido para ejercer formalmente']
            .map(t => `<div style="font-size:12px;padding:7px 0;border-bottom:1px solid var(--cream-d);display:flex;align-items:center;gap:8px"><span style="color:var(--sage)">✓</span>${t}</div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</div>`;
