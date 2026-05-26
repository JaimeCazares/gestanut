<?php
// ══════════════════════════════════════════════════════
// GestaNut · data.php
// Reemplaza patients.js y finanzas.js — lee desde MySQL
// Se carga como <script src="api/data.php"></script>
// ══════════════════════════════════════════════════════
header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-store');

require_once __DIR__ . '/config.php';

// ── Cargar todos los pacientes ────────────────────────
$pacientes = $pdo->query('SELECT * FROM pacientes ORDER BY id')->fetchAll();

$patients = [];

foreach ($pacientes as $p) {
    $pid = (int)$p['id'];

    // Historia clínica
    $stmt = $pdo->prepare('SELECT * FROM historia_clinica WHERE paciente_id = ? LIMIT 1');
    $stmt->execute([$pid]);
    $hist = $stmt->fetch();

    // Consentimiento
    $stmt = $pdo->prepare('SELECT * FROM consentimientos WHERE paciente_id = ? LIMIT 1');
    $stmt->execute([$pid]);
    $cons = $stmt->fetch();

    // Laboratorio
    $stmt = $pdo->prepare('SELECT * FROM laboratorio WHERE paciente_id = ? ORDER BY id');
    $stmt->execute([$pid]);
    $labs = $stmt->fetchAll();

    // Recuento 24h (último registro)
    $stmt = $pdo->prepare('SELECT * FROM recuento_24h WHERE paciente_id = ? ORDER BY id DESC LIMIT 1');
    $stmt->execute([$pid]);
    $rec = $stmt->fetch();

    $tiempos = [];
    if ($rec) {
        $stmt = $pdo->prepare('SELECT * FROM recuento_tiempos WHERE recuento_id = ? ORDER BY id');
        $stmt->execute([$rec['id']]);
        $tiempos = $stmt->fetchAll();
    }

    // Historial de peso
    $stmt = $pdo->prepare('SELECT * FROM peso_historial WHERE paciente_id = ? ORDER BY id');
    $stmt->execute([$pid]);
    $history = $stmt->fetchAll();

    // Mediciones (última)
    $stmt = $pdo->prepare('SELECT * FROM mediciones WHERE paciente_id = ? ORDER BY id DESC LIMIT 1');
    $stmt->execute([$pid]);
    $med = $stmt->fetch();

    // Glucosa (si aplica)
    $glucosaData = null;
    if ($p['diabetes_gestacional']) {
        $stmt = $pdo->prepare('SELECT * FROM glucosa_data WHERE paciente_id = ? ORDER BY id DESC');
        $stmt->execute([$pid]);
        $glucosaData = $stmt->fetchAll();
    }

    // Lactancia (si aplica)
    $lactanciaData = null;
    if ($p['lactancia']) {
        $stmt = $pdo->prepare('SELECT * FROM lactancia_data WHERE paciente_id = ? LIMIT 1');
        $stmt->execute([$pid]);
        $lac = $stmt->fetch();
        if ($lac) {
            $stmt = $pdo->prepare('SELECT * FROM lactancia_pesos_bebe WHERE lactancia_id = ? ORDER BY semana');
            $stmt->execute([$lac['id']]);
            $bebes = $stmt->fetchAll();
            $lactanciaData = [
                'semanas'   => (int)$lac['semanas'],
                'produccion'=> $lac['produccion'],
                'tetadas'   => (int)$lac['tetadas'],
                'sintomas'  => json_decode($lac['sintomas'],  true) ?: [],
                'suplementos'=> json_decode($lac['suplementos'], true) ?: [],
                'pesosBebe' => array_map(fn($b) => ['sem' => (int)$b['semana'], 'kg' => (float)$b['kg']], $bebes),
            ];
        }
    }

    // ── Construir objeto que espera la app JS ──────────
    $patient = [
        'id'            => $pid,
        'name'          => $p['nombre'],
        'age'           => (int)$p['edad'],
        'phone'         => $p['telefono'],
        'type'          => $p['tipo'],
        'typeLabel'     => $p['tipo_label'],
        'icon'          => $p['icono'],
        'badge'         => $p['badge'],
        'av'            => $p['avatar'],
        'ini'           => $p['iniciales'],
        'goal'          => $p['objetivo'],
        'sub'           => $p['subtitulo'],
        'weight'        => (float)$p['peso'],
        'height'        => (float)$p['talla'],
        'prePregWeight' => $p['peso_pre_embarazo'] !== null ? (float)$p['peso_pre_embarazo'] : null,
        'semGestacion'  => $p['sem_gestacion']     !== null ? (int)$p['sem_gestacion']     : null,
        'lactancia'     => (bool)$p['lactancia'],
        'dg'            => (bool)$p['diabetes_gestacional'],
        'ultimaVisita'  => $p['ultima_visita'],
        'proxima'       => $p['proxima_cita'],
        'status'        => $p['estatus'],
        'online'        => (bool)$p['online'],
        'bio'           => $p['bio'],
        'plan'          => $p['plan'],
        'historia'      => $hist ? [
            'antecedentes'  => $hist['antecedentes'],
            'alergias'      => $hist['alergias'],
            'intolerancias' => $hist['intolerancias'],
            'medicamentos'  => $hist['medicamentos'],
            'cirugias'      => $hist['cirugias'],
            'patFam'        => $hist['pat_familiares'],
            'actFisica'     => $hist['act_fisica'],
            'ocupacion'     => $hist['ocupacion'],
            'estadoCivil'   => $hist['estado_civil'],
            'tabaco'        => $hist['tabaco'],
            'alcohol'       => $hist['alcohol'],
            'motivo'        => $hist['motivo'],
        ] : [],
        'consentimiento'=> $cons ? [
            'firmado' => (bool)$cons['firmado'],
            'fecha'   => $cons['fecha'] ?: '',
        ] : ['firmado' => false, 'fecha' => ''],
        'laboratorio'   => array_map(fn($l) => [
            'fecha'  => $l['fecha'],
            'prueba' => $l['prueba'],
            'valor'  => (float)$l['valor'],
            'rango'  => $l['rango'],
            'status' => $l['estatus'],
        ], $labs),
        'recuento24'    => $rec ? [
            'fecha'   => $rec['fecha'],
            'tiempos' => array_map(fn($t) => [
                'comida'    => $t['comida'],
                'hora'      => $t['hora'],
                'alimentos' => $t['alimentos'],
            ], $tiempos),
            'agua' => $rec['agua'],
            'nota' => $rec['nota'],
        ] : ['fecha' => '', 'tiempos' => [], 'agua' => '', 'nota' => ''],
        'history'       => array_map(function($h) {
            $e = ['date' => $h['fecha'], 'weight' => (float)$h['peso']];
            if ($h['semana_gestacion'] !== null) $e['sem']   = (int)$h['semana_gestacion'];
            if ($h['delta']            !== null) $e['delta'] = (float)$h['delta'];
            if ($h['grasa']            !== null) $e['grasa'] = (float)$h['grasa'];
            if ($h['nota'])                      $e['note']  = $h['nota'];
            return $e;
        }, $history),
        'measures'      => $med ? [
            'cintura' => (float)$med['cintura'],
            'cadera'  => (float)$med['cadera'],
            'brazo'   => (float)$med['brazo'],
            'muslo'   => (float)$med['muslo'],
        ] : ['cintura' => 0, 'cadera' => 0, 'brazo' => 0, 'muslo' => 0],
    ];

    if ($glucosaData !== null) {
        $patient['glucosaData'] = array_map(fn($g) => [
            'fecha'      => $g['fecha'],
            'ayuno'      => (float)$g['ayuno'],
            'pre_comida' => (float)$g['pre_comida'],
            'post_comida'=> (float)$g['post_comida'],
            'pre_cena'   => (float)$g['pre_cena'],
            'post_cena'  => (float)$g['post_cena'],
            'nota'       => $g['nota'],
        ], $glucosaData);
    }

    if ($lactanciaData !== null) {
        $patient['lactanciaData'] = $lactanciaData;
    }

    $patients[] = $patient;
}

echo 'const PATIENTS = ' . json_encode($patients, JSON_UNESCAPED_UNICODE) . ";\n\n";

// ── Finanzas ──────────────────────────────────────────
$rows = $pdo->query('SELECT * FROM finanzas ORDER BY id')->fetchAll();
$finanzas = array_map(fn($f) => [
    'id'      => (int)$f['id'],
    'fecha'   => $f['fecha'],
    'concepto'=> $f['concepto'],
    'tipo'    => $f['tipo'],
    'monto'   => (float)$f['monto'],
    'pagado'  => (bool)$f['pagado'],
    'px'      => $f['paciente_nombre'],
], $rows);

echo 'const FINANZAS = ' . json_encode($finanzas, JSON_UNESCAPED_UNICODE) . ";\n";
