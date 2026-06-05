<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// ── GET: listar pacientes ──────────────────────────────────────────
if ($method === 'GET') {
    $stmt = $pdo->query('
        SELECT p.*, c.firmado AS con_firmado, c.fecha_firma
        FROM pacientes p
        LEFT JOIN consentimientos c ON c.paciente_id = p.id
        ORDER BY p.created_at DESC
    ');
    echo json_encode(array_map('mapRow', $stmt->fetchAll()));
    exit;
}

// ── POST: crear paciente ───────────────────────────────────────────
if ($method === 'POST') {
    $d = json_decode(file_get_contents('php://input'), true);

    $tipoMap = [
        'Materno-infantil' => 'materna',
        'Recomposición'    => 'recomp',
        'Control de peso'  => 'peso',
    ];
    $tipo = $tipoMap[$d['tipo_consulta']] ?? 'peso';
    $mod  = strtolower($d['modalidad'] ?? 'presencial');

    $sql = 'INSERT INTO pacientes
              (usuario_id, nombre, edad, whatsapp, tipo_consulta,
               peso_actual, altura, modalidad, objetivo_principal, estado)
            VALUES (1,:nom,:edad,:wa,:tipo,:peso,:alt,:mod,:obj,"nueva")';

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nom'  => trim($d['nombre']),
        ':edad' => (int)$d['edad'],
        ':wa'   => trim($d['whatsapp']),
        ':tipo' => $tipo,
        ':peso' => (float)$d['peso'],
        ':alt'  => (float)$d['altura'],
        ':mod'  => $mod,
        ':obj'  => trim($d['objetivo'] ?? ''),
    ]);

    $id   = $pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM pacientes WHERE id = ?');
    $stmt->execute([$id]);
    echo json_encode(mapRow($stmt->fetch()));
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);

// ── Helper ────────────────────────────────────────────────────────
function mapRow($r) {
    $tipos = [
        'materna' => ['label' => 'Materno-infantil', 'icon' => '🤰', 'badge' => 'b-blush', 'av' => 'av-c3'],
        'recomp'  => ['label' => 'Recomposición',    'icon' => '⚖️',  'badge' => 'b-sage',  'av' => 'av-c1'],
        'peso'    => ['label' => 'Control de peso',  'icon' => '📉',  'badge' => 'b-terra', 'av' => 'av-c2'],
    ];
    $estados = ['nueva' => 'new', 'activa' => 'active', 'seguimiento' => 'follow-up', 'inactiva' => 'inactive'];

    $t    = $tipos[$r['tipo_consulta']] ?? $tipos['peso'];
    $pars = array_filter(explode(' ', trim($r['nombre'])));
    $ini  = strtoupper(mb_substr($pars[0] ?? '', 0, 1) . mb_substr($pars[1] ?? '', 0, 1));

    return [
        'id'           => (int)$r['id'],
        'name'         => $r['nombre'],
        'age'          => (int)$r['edad'],
        'phone'        => $r['whatsapp'],
        'type'         => $r['tipo_consulta'],
        'typeLabel'    => $t['label'],
        'icon'         => $t['icon'],
        'badge'        => $t['badge'],
        'av'           => $t['av'],
        'ini'          => $ini,
        'weight'       => (float)$r['peso_actual'],
        'height'       => (float)$r['altura'],
        'modalidad'    => $r['modalidad'],
        'online'       => $r['modalidad'] === 'online',
        'status'       => $estados[$r['estado']] ?? 'active',
        'goal'         => $r['objetivo_principal'] ?? '',
        'sub'          => $r['modalidad'] === 'online' ? 'Online' : 'Presencial',
        'proxima'      => $r['proxima_cita']  ?? '—',
        'ultimaVisita' => $r['ultima_visita'] ?? '—',
        'consentimiento' => isset($r['con_firmado']) && $r['con_firmado'] !== null
            ? ['firmado' => (bool)$r['con_firmado'],
               'fecha'   => $r['fecha_firma'] ? date('d M Y', strtotime($r['fecha_firma'])) : '']
            : null,
    ];
}
