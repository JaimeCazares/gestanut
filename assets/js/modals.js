// ══════════════════════════════════════════════════════
// MODALS · Inyección, apertura y cierre
// ══════════════════════════════════════════════════════
function injectModals() {
  $('#modal-root').innerHTML = `
  <!-- NUEVA PACIENTE -->
  <div class="modal-overlay" id="newpx-modal">
    <div class="modal" style="max-width:640px">
      <div class="modal-head"><div class="modal-title">Nueva <em>paciente</em></div><button class="modal-close" onclick="closeModal('newpx-modal')">✕</button></div>
      <div class="modal-body">
        <div class="field-row"><div class="field"><label class="field-label">Nombre completo*</label><input id="npx-nombre" class="input" placeholder="Ej. Laura García Méndez"></div><div class="field"><label class="field-label">Edad*</label><input id="npx-edad" class="input" type="number" placeholder="28"></div></div>
        <div class="field-row"><div class="field"><label class="field-label">WhatsApp*</label><input id="npx-telefono" class="input" placeholder="667 123 4567"></div><div class="field"><label class="field-label">Tipo de consulta*</label><select id="npx-tipo" class="select"><option>Materno-infantil</option><option>Recomposición</option><option>Control de peso</option></select></div></div>
        <div class="field-row"><div class="field"><label class="field-label">Peso (kg)*</label><input id="npx-peso" class="input" type="number" placeholder="68"></div><div class="field"><label class="field-label">Talla (m)*</label><input id="npx-talla" class="input" type="number" step="0.01" placeholder="1.65"></div></div>
        <div class="field"><label class="field-label">Modalidad</label><select id="npx-modalidad" class="select"><option>Presencial</option><option>Online</option></select></div>
        <div class="field"><label class="field-label">Objetivo principal</label><input id="npx-objetivo" class="input" placeholder="Ej. Perder 8 kg antes de julio"></div>
        <div style="background:var(--terra-l);border-radius:var(--rs);padding:12px 16px;margin-top:4px;border-left:3px solid var(--terra)">
          <div style="font-size:12px;font-weight:600;color:var(--terra-d);margin-bottom:4px">⚠️ Consentimiento informado</div>
          <div style="font-size:11px;color:var(--text-m)">Se generará automáticamente al crear el expediente. Recuerda obtener la firma de la paciente en la primera consulta.</div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline" onclick="closeModal('newpx-modal')">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarNuevaPaciente()">Crear expediente</button>
      </div>
    </div>
  </div>

  <!-- NUEVA CITA -->
  <div class="modal-overlay" id="appt-modal">
    <div class="modal" style="max-width:560px">
      <div class="modal-head"><div class="modal-title">Agendar <em>cita</em></div><button class="modal-close" onclick="closeModal('appt-modal')">✕</button></div>
      <div class="modal-body">
        <div class="field"><label class="field-label">Paciente</label><select class="select">${PATIENTS.map(p => `<option>${p.name}</option>`).join('')}</select></div>
        <div class="field-row"><div class="field"><label class="field-label">Fecha</label><input class="input" type="date" value="${new Date().toISOString().split('T')[0]}"></div><div class="field"><label class="field-label">Hora</label><select class="select">${['8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','14:00','15:00','16:00','17:00'].map(t => `<option>${t}</option>`).join('')}</select></div></div>
        <div class="field"><label class="field-label">Modalidad</label><div style="display:flex;gap:12px"><label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="radio" name="mod" checked> Presencial</label><label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="radio" name="mod"> Online</label></div></div>
        <div class="field"><label class="field-label">Tipo de consulta</label><select class="select"><option>Control / Seguimiento</option><option>Primera consulta</option><option>Urgencia</option></select></div>
        <div class="field"><label class="field-label">Notas previas</label><textarea class="textarea" style="min-height:60px" placeholder="Ej. Traer estudios de laboratorio recientes..."></textarea></div>
        <div style="background:var(--sage-lll);border-radius:var(--rs);padding:10px 14px;font-size:12px;color:var(--text-m)">💬 Se enviará recordatorio por WhatsApp 24h antes</div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline" onclick="closeModal('appt-modal')">Cancelar</button>
        <button class="btn btn-primary" onclick="closeModal('appt-modal');toast('Cita agendada ✓ · Recordatorio programado')">Confirmar cita</button>
      </div>
    </div>
  </div>

  <!-- ENVIAR PLAN -->
  <div class="modal-overlay" id="send-plan-modal">
    <div class="modal" style="max-width:580px">
      <div class="modal-head"><div class="modal-title">Enviar <em>plan</em> por WhatsApp</div><button class="modal-close" onclick="closeModal('send-plan-modal')">✕</button></div>
      <div class="modal-body">
        <div id="send-plan-preview" style="background:var(--sage-lll);border-radius:var(--rs);padding:18px;border-left:4px solid var(--sage);font-size:13px;line-height:1.9;white-space:pre-wrap;margin-bottom:14px">Cargando...</div>
        <div class="field"><label class="field-label">Mensaje adicional (opcional)</label><textarea class="textarea" id="plan-extra" placeholder="Ej. Cualquier duda, escríbeme. ¡Tú puedes! 💪"></textarea></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline" onclick="closeModal('send-plan-modal')">Cancelar</button>
        <div id="plan-wa-btn"></div>
      </div>
    </div>
  </div>

  <!-- RECIBO -->
  <div class="modal-overlay" id="receipt-modal">
    <div class="modal" style="max-width:520px">
      <div class="modal-head"><div class="modal-title">Generar <em>recibo</em></div><button class="modal-close" onclick="closeModal('receipt-modal')">✕</button></div>
      <div class="modal-body">
        <div id="receipt-preview" style="background:var(--white);border:1px solid rgba(107,158,120,.15);border-radius:var(--rs);padding:24px;font-size:13px;line-height:1.9">
          <div style="text-align:center;margin-bottom:16px">
            <div style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:var(--forest)">GestaNut</div>
            <div style="font-size:11px;color:var(--text-m)">Diana Zavala · Nutrióloga · Cédula 15304166</div>
            <div style="font-size:11px;color:var(--text-m)">📱 667 305 6211 · @gestanut</div>
            <div style="width:100%;height:1px;background:rgba(107,158,120,.2);margin:12px 0"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:12px"><span style="color:var(--text-m)">Folio</span><span style="font-weight:600">#REC-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:12px"><span style="color:var(--text-m)">Fecha</span><span>6 de Mayo, 2025</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:12px"><span style="color:var(--text-m)">Concepto</span><span id="rcpt-concepto">Consulta nutricional</span></div>
          <div style="width:100%;height:1px;background:rgba(107,158,120,.1);margin:14px 0"></div>
          <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:600;color:var(--forest)"><span>Total</span><span id="rcpt-total">$400</span></div>
          <div style="margin-top:16px;padding:10px 14px;background:var(--sage-lll);border-radius:var(--rs);font-size:11px;color:var(--text-m);text-align:center">Este recibo es un comprobante informal de pago. No es una factura fiscal.</div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline" onclick="closeModal('receipt-modal')">Cerrar</button>
        <button class="btn btn-sage" onclick="toast('📥 Guardando recibo...');setTimeout(()=>toast('Recibo guardado ✓ · Compartiendo por WhatsApp'),800)">💾 Guardar</button>
        <button class="btn btn-primary" onclick="closeModal('receipt-modal');toast('🧾 Recibo enviado por WhatsApp ✓')">📤 Enviar por WhatsApp</button>
      </div>
    </div>
  </div>

  <!-- CONSENTIMIENTO -->
  <div class="modal-overlay" id="consent-modal">
    <div class="modal" style="max-width:680px">
      <div class="modal-head"><div class="modal-title">Consentimiento <em>informado</em></div><button class="modal-close" onclick="closeModal('consent-modal')">✕</button></div>
      <div class="modal-body">
        <div style="background:var(--white);border:1px solid rgba(107,158,120,.15);border-radius:var(--rs);padding:28px;font-size:12.5px;line-height:2;color:var(--text);font-family:'DM Sans',sans-serif;max-height:55vh;overflow-y:auto">
          <div style="text-align:center;margin-bottom:20px">
            <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--forest)">CARTA DE CONSENTIMIENTO INFORMADO</div>
            <div style="font-size:11px;color:var(--text-m);margin-top:4px">Consulta Nutricional · GestaNut</div>
          </div>
          <p><strong>NUTRIÓLOGA:</strong> Diana Zavala Lic. en Nutrición, Cédula Profesional: 15304166</p>
          <p><strong>DESCRIPCIÓN DE SERVICIOS:</strong> Consulta nutricional individualizada que incluye evaluación antropométrica, anamnesis alimentaria, elaboración de plan de alimentación personalizado, seguimiento y control del estado nutricional.</p>
          <p><strong>BENEFICIOS ESPERADOS:</strong> Mejora del estado nutricional, alcance de objetivos de peso o composición corporal, educación alimentaria y hábitos saludables sostenibles.</p>
          <p><strong>RIESGOS Y LIMITACIONES:</strong> La nutrición es una ciencia individualizada. Los resultados pueden variar según la adherencia al plan, condiciones de salud concomitantes y otros factores. La nutrióloga no es responsable del tratamiento médico de enfermedades diagnosticadas.</p>
          <p><strong>CONFIDENCIALIDAD:</strong> Toda la información proporcionada por la paciente será tratada con estricta confidencialidad, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).</p>
          <p><strong>COMPROMISO DE LA PACIENTE:</strong> Proporcionar información veraz sobre su historial médico y alimentario, seguir las indicaciones del plan alimentario y comunicar cualquier reacción adversa.</p>
          <div style="margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:28px">
            <div><div style="border-top:1px solid var(--text-l);padding-top:6px;font-size:11px;color:var(--text-m)">Firma de la paciente</div><div style="height:50px"></div></div>
            <div><div style="border-top:1px solid var(--text-l);padding-top:6px;font-size:11px;color:var(--text-m)">Diana Zavala · Nutrióloga</div><div style="height:50px"></div></div>
          </div>
          <div style="text-align:center;margin-top:16px;font-size:11px;color:var(--text-l)">Culiacán, Sinaloa · Fecha: ________________</div>
        </div>
        <div class="field" style="margin-top:14px"><label class="field-label">Paciente</label><select class="select">${PATIENTS.map(p => `<option>${p.name}</option>`).join('')}</select></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline" onclick="closeModal('consent-modal')">Cerrar</button>
        <button class="btn btn-sage" onclick="toast('📥 Descargando PDF...')">📥 Descargar PDF</button>
        <button class="btn btn-primary" onclick="closeModal('consent-modal');toast('📤 Consentimiento enviado por WhatsApp ✓')">📤 Enviar por WhatsApp</button>
      </div>
    </div>
  </div>`;
}

function openModal(id) {
  const m = $('#' + id);
  if (m) m.classList.add('open');
  if (id === 'receipt-modal' && currentReceipt) {
    $('#rcpt-concepto').textContent = currentReceipt.concepto;
    $('#rcpt-total').textContent = fmt$(currentReceipt.monto);
  }
}

function closeModal(id) {
  const m = $('#' + id);
  if (m) m.classList.remove('open');
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('open');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') $$('.modal-overlay.open').forEach(m => m.classList.remove('open'));
});

function quickWA(id) {
  const p = PATIENTS.find(x => x.id === id);
  if (!p) return;
  const msg = `Hola ${p.name.split(' ')[0]}! 🌿 Soy Diana, tu nutrióloga. Te confirmo tu próxima cita. ¿Tienes alguna duda antes de tu consulta?`;
  window.open(waLink(p.phone, msg), '_blank');
}

function openSendPlan(id) {
  const p = PATIENTS.find(x => x.id === id) || currentPatient;
  if (!p) return;
  const msg = `🌿 *Plan Nutricional · ${p.name}*\n\n*${p.plan}*\n\n📋 _Horarios de comida (${p.semGestacion ? '6' : '5'} tiempos):_\n🌅 7:30 Desayuno\n🥗 10:30 Colación AM\n🍽 2:00 Comida\n🍵 5:30 Colación PM\n🌙 8:00 Cena\n\n💧 Agua: ${(calcWater(p.weight, p.semGestacion || 0) / 1000).toFixed(1)} L/día\n\n_Cualquier duda, escríbeme Diana 🌿_`;
  const prev = $('#send-plan-preview');
  if (prev) prev.textContent = msg;
  const btn = $('#plan-wa-btn');
  if (btn) btn.innerHTML = `<a href="${waLink(p.phone, msg)}" target="_blank" class="btn-wa"><svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>Enviar por WhatsApp</a>`;
  openModal('send-plan-modal');
}

// ══════════════════════════════════════════════════════
// GUARDAR NUEVA PACIENTE en la base de datos
// ══════════════════════════════════════════════════════
async function guardarNuevaPaciente() {
  const nombre   = $('#npx-nombre').value.trim();
  const edad     = parseInt($('#npx-edad').value);
  const telefono = $('#npx-telefono').value.trim().replace(/\s/g, '');
  const typeLabel= $('#npx-tipo').value;
  const peso     = parseFloat($('#npx-peso').value);
  const talla    = parseFloat($('#npx-talla').value);
  const modalidad= $('#npx-modalidad').value;
  const objetivo = $('#npx-objetivo').value.trim();

  if (!nombre || !edad || !telefono || !peso || !talla) {
    toast('Completa los campos obligatorios (*)', '⚠️'); return;
  }

  const payload = { name: nombre, age: edad, phone: telefono, typeLabel, weight: peso, height: talla, online: modalidad === 'Online', goal: objetivo };

  try {
    const res  = await fetch('api/patients.php', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) { toast(data.error || 'Error al guardar', '✕'); return; }

    // Mapeo visual igual que patients.js
    const tm = { 'Materno-infantil':{ tipo:'materna',icono:'🤰',badge:'b-blush',av:'av-c3' }, 'Recomposición':{ tipo:'recomp',icono:'⚖️',badge:'b-sage',av:'av-c1' }, 'Control de peso':{ tipo:'peso',icono:'📉',badge:'b-terra',av:'av-c2' } }[typeLabel] || { tipo:'peso',icono:'📉',badge:'b-terra',av:'av-c2' };
    const ini = nombre.split(' ').slice(0,2).map(p=>p[0].toUpperCase()).join('');

    PATIENTS.push({
      id: data.id, name: nombre, age: edad, phone: telefono,
      type: tm.tipo, typeLabel, icon: tm.icono, badge: tm.badge, av: tm.av, ini,
      goal: objetivo, sub: '1ª consulta próxima',
      weight: peso, height: talla, prePregWeight: null, semGestacion: null,
      lactancia: false, dg: false,
      ultimaVisita: '—', proxima: 'Pendiente',
      status: 'new', online: modalidad === 'Online', bio: '', plan: 'Por definir en primera consulta',
      historia:{ antecedentes:'', alergias:'', intolerancias:'', medicamentos:'', cirugias:'', patFam:'', actFisica:'', ocupacion:'', estadoCivil:'', tabaco:'No', alcohol:'No', motivo: objetivo },
      consentimiento:{ firmado:false, fecha:'' },
      laboratorio:[], recuento24:{ fecha:'', tiempos:[], agua:'', nota:'' },
      history:[], measures:{ cintura:0, cadera:0, brazo:0, muslo:0 },
    });

    // Limpiar campos
    ['npx-nombre','npx-edad','npx-telefono','npx-peso','npx-talla','npx-objetivo'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });

    closeModal('newpx-modal');
    toast('Paciente registrada ✓ · Consentimiento pendiente de firma');

    if (currentView === 'pacientes' || currentView === 'dashboard') showView(currentView);
  } catch(e) {
    console.error(e);
    toast('Error de conexión con el servidor', '✕');
  }
}
