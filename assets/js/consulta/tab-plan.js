// ══════════════════════════════════════════════════════
// TAB · Plan nutricional
// ══════════════════════════════════════════════════════
function tabPlan(p) {
  const tmb = calcTMB(p.weight, p.height, p.age);
  const fac = p.type === 'recomp' ? 1.55 : 1.4;
  const tot = Math.round(tmb * fac);
  return `<div class="g-21"><div>
    <div class="panel mb-sm">
      <div class="panel-head"><div class="panel-title"><span class="pt-icon">🥗</span>Plan diario</div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-outline btn-xs">✏️ Editar</button>
          <button class="btn-wa" style="padding:5px 12px;font-size:11px" onclick="openSendPlan(${p.id})"><svg viewBox="0 0 24 24" style="width:11px;height:11px;fill:#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>Enviar</button>
        </div>
      </div>
      <div class="panel-body">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px">
          ${[
            ['Kcal', tot, 'sage'],
            ['Prot.', Math.round(tot * .30 / 4) + 'g', 'terra'],
            ['Carbos', Math.round(tot * .45 / 4) + 'g', 'gold'],
            ['Grasa', Math.round(tot * .25 / 9) + 'g', 'blush']
          ].map(([l, v, c]) => `<div style="text-align:center;padding:14px 8px;background:var(--${c}-ll);border-radius:var(--rs)"><div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--forest)">${v}</div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:var(--text-m);margin-top:3px">${l}</div></div>`).join('')}
        </div>
        ${[
          { m: '🌅 Desayuno',    t: '7:30',  k: Math.round(tot * .25), i: ['Avena 1 taza + frutos rojos', 'Yogurt natural 200ml', '10 almendras'] },
          { m: '🥗 Colación AM', t: '10:30', k: Math.round(tot * .10), i: ['Fruta 1 pieza', 'Mantequilla de almendra 1 cda'] },
          { m: '🍽 Comida',      t: '2:00',  k: Math.round(tot * .35), i: ['Proteína 150g (pollo/salmón/res)', 'Arroz integral 1 taza', 'Verduras al vapor', 'Aguacate ½'] },
          { m: '🍵 Colación PM', t: '5:30',  k: Math.round(tot * .10), i: ['Hummus 3 cdas', 'Vegetales crudos'] },
          { m: '🌙 Cena',        t: '8:00',  k: Math.round(tot * .20), i: ['Proteína ligera 100g', 'Ensalada verde libre', 'Carbohidrato complejo pequeño'] },
        ].map(tm => `<div style="background:var(--cream);border-radius:var(--rs);padding:13px 16px;margin-bottom:8px;border-left:3px solid var(--sage)"><div style="display:flex;justify-content:space-between;margin-bottom:7px"><div style="font-weight:500;font-size:13px">${tm.m} <span class="muted-sm" style="font-weight:400;font-size:12px">${tm.t}</span></div><span class="badge b-sage">${tm.k} kcal</span></div>${tm.i.map(x => `<div style="font-size:12px;color:var(--text-m);padding-left:12px;position:relative"><span style="position:absolute;left:0;color:var(--sage)">·</span>${x}</div>`).join('')}</div>`).join('')}
      </div>
    </div>
  </div>
  <div>
    <div class="panel mb-sm"><div class="panel-head"><div class="panel-title" style="font-size:15px"><span class="pt-icon">💊</span>Suplementación</div></div>
      <div class="panel-body">${
        p.semGestacion
          ? '<div style="font-size:12px;padding:8px 0;border-bottom:1px solid var(--cream-d)">🟢 Ácido fólico 600mcg · AM</div><div style="font-size:12px;padding:8px 0;border-bottom:1px solid var(--cream-d)">🟢 Hierro 45mg · con cítricos</div><div style="font-size:12px;padding:8px 0;border-bottom:1px solid var(--cream-d)">🟢 DHA 200mg · con comida</div><div style="font-size:12px;padding:8px 0">🟢 Calcio 1200mg (dieta)</div>'
          : p.type === 'recomp'
          ? '<div style="font-size:12px;padding:8px 0;border-bottom:1px solid var(--cream-d)">🟢 Creatina 5g · diario</div><div style="font-size:12px;padding:8px 0;border-bottom:1px solid var(--cream-d)">🟢 Omega 3 2g · comida</div><div style="font-size:12px;padding:8px 0">🟢 Vit D3 2000UI · AM</div>'
          : '<div style="font-size:12px;padding:8px 0;border-bottom:1px solid var(--cream-d)">🟢 Multivitamínico · AM</div><div style="font-size:12px;padding:8px 0">🟢 Omega 3 1g · comida</div>'
      }</div>
    </div>
    <div class="panel"><div class="panel-head"><div class="panel-title" style="font-size:15px"><span class="pt-icon">💧</span>Hidratación</div></div>
      <div class="panel-body" style="text-align:center">
        <div style="font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:600;color:var(--info)">${(calcWater(p.weight, p.semGestacion || 0) / 1000).toFixed(1)}L</div>
        <div class="muted-sm">${p.semGestacion ? 'Incluye extra por embarazo' : p.lactancia ? 'Incluye extra por lactancia' : '35 ml por kg de peso'}</div>
      </div>
    </div>
  </div></div>`;
}
