// ══════════════════════════════════════════════════════
// TAB · Notas de consulta
// ══════════════════════════════════════════════════════
function tabNotas(p) {
  return `<div class="g-21">
    <div class="panel">
      <div class="panel-head"><div class="panel-title"><span class="pt-icon">📝</span>Notas de consulta</div><button class="btn btn-sage btn-xs" onclick="toast('+ Nueva nota')">+ Agregar</button></div>
      <div class="panel-body">
        <div style="margin-bottom:18px"><textarea class="textarea" id="note-text" placeholder="Escribe aquí las notas de la sesión actual: peso, observaciones, ajustes al plan, comentarios de la paciente..." style="min-height:100px"></textarea>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
            <button class="btn btn-outline btn-xs">🎤 Dictar</button>
            <button class="btn btn-sage btn-xs" onclick="saveNote()">💾 Guardar</button>
          </div>
        </div>
        ${[
          { d: '28 Abr · 9:35', t: 'Px refiere mejor descanso. Cumplió plan al 90% esta semana. Peso estable. Continúa con plan actual.' },
          { d: '14 Abr · 9:45', t: 'Análisis ok. Hierro en niveles normales. Apetito mejoró en 2do trimestre. Tolera bien las colaciones.' },
          { d: '31 Mar · 10:00', t: 'Plan ajustado +200kcal por demanda gestacional. Px solicita más recetas de desayunos. Se le envían 5 opciones.' },
        ].map(n => `<div style="border-left:3px solid var(--sage);padding:12px 16px;background:var(--sage-lll);border-radius:0 var(--rs) var(--rs) 0;margin-bottom:10px">
          <div style="font-size:10px;color:var(--text-m);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">${n.d}</div>
          <div style="font-size:13px;color:var(--text);line-height:1.7">${n.t}</div>
        </div>`).join('')}
      </div>
    </div>
    <div>
      <div class="panel mb-sm"><div class="panel-head"><div class="panel-title" style="font-size:15px"><span class="pt-icon">💚</span>Wellness</div></div>
        <div class="panel-body">
          <div class="muted-sm" style="margin-bottom:10px;font-size:11px">¿Cómo se siente hoy?</div>
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-bottom:14px">
            ${['😞', '😐', '🙂', '😊', '🥰'].map((e, i) => `<button style="aspect-ratio:1;border:1px solid ${i === 3 ? 'var(--sage)' : 'rgba(107,158,120,.15)'};border-radius:var(--rs);background:${i === 3 ? 'var(--sage-ll)' : 'var(--white)'};cursor:pointer;font-size:18px;transition:all .2s" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform=''">${e}</button>`).join('')}
          </div>
          <div style="background:var(--sage-ll);border-radius:var(--rs);padding:10px 12px;font-size:12px;color:var(--forest)">✨ Selección: se siente <strong>bien</strong></div>
        </div>
      </div>
    </div>
  </div>`;
}

function saveNote() {
  const t = $('#note-text');
  if (!t?.value.trim()) { toast('Escribe algo primero', '⚠️'); return; }
  toast('Nota guardada ✓');
  t.value = '';
}
