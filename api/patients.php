<?php
// ══════════════════════════════════════════════════════
// GestaNut · API · Pacientes
// GET    /api/patients.php         → lista todas
// GET    /api/patients.php?id=N    → una paciente
// POST   /api/patients.php         → crear nueva
// PUT    /api/patients.php?id=N    → actualizar
// DELETE /api/patients.php?id=N    → eliminar
// ══════════════════════════════════════════════════════
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

match ($method) {
    'GET'    => $id ? getOne($pdo, $id) : getAll($pdo),
    'POST'   => create($pdo),
    'PUT'    => $id ? update($pdo, $id) : badRequest('ID requerido'),
    'DELETE' => $id ? remove($pdo, $id) : badRequest('ID requerido'),
    default  => badRequest('Método no permitido'),
};

// ── Helpers ───────────────────────────────────────────

function ok($data)        { echo json_encode($data, JSON_UNESCAPED_UNICODE); }
function badRequest($msg) { http_response_code(400); ok(['error' => $msg]); exit; }
function notFound($msg)   { http_response_code(404); ok(['error' => $msg]); exit; }

// ── Leer todas ────────────────────────────────────────
function getAll($pdo) {
    $rows = $pdo->query(
        'SELECT id, nombre, edad, telefono, tipo, tipo_label, icono, badge, avatar,
                iniciales, objetivo, subtitulo, peso, talla, estatus, online,
                ultima_visita, proxima_cita, fecha_registro
         FROM pacientes ORDER BY id'
    )->fetchAll();
    ok($rows);
}

// ── Leer una ──────────────────────────────────────────
function getOne($pdo, $id) {
    $stmt = $pdo->prepare('SELECT * FROM pacientes WHERE id = ?');
    $stmt->execute([$id]);
    $p = $stmt->fetch();
    if (!$p) notFound('Paciente no encontrada');
    ok($p);
}

// ── Crear nueva ───────────────────────────────────────
function create($pdo) {
    $d = json_decode(file_get_contents('php://input'), true);
    if (!$d) badRequest('JSON inválido');

    $nombre = trim($d['name'] ?? '');
    $edad   = (int)($d['age']    ?? 0);
    $tel    = trim($d['phone']   ?? '');
    $label  = trim($d['typeLabel'] ?? 'Control de peso');
    $peso   = (float)($d['weight'] ?? 0);
    $talla  = (float)($d['height'] ?? 0);
    $online = !empty($d['online']) ? 1 : 0;
    $goal   = trim($d['goal']    ?? '');

    if (!$nombre || !$edad || !$tel || !$peso || !$talla) {
        badRequest('Faltan campos obligatorios: nombre, edad, teléfono, peso, talla');
    }

    $tipos = [
        'Materno-infantil' => ['tipo' => 'materna', 'icono' => '🤰', 'badge' => 'b-blush', 'av' => 'av-c3'],
        'Recomposición'    => ['tipo' => 'recomp',  'icono' => '⚖️', 'badge' => 'b-sage',  'av' => 'av-c1'],
        'Control de peso'  => ['tipo' => 'peso',    'icono' => '📉', 'badge' => 'b-terra', 'av' => 'av-c2'],
    ];
    $tm = $tipos[$label] ?? $tipos['Control de peso'];

    // Iniciales (primera letra de cada palabra, máx. 2)
    $partes = array_filter(explode(' ', $nombre));
    $ini    = implode('', array_map(fn($p) => mb_strtoupper(mb_substr($p, 0, 1)), array_slice($partes, 0, 2)));

    $stmt = $pdo->prepare(
        'INSERT INTO pacientes
         (nombre, edad, telefono, tipo, tipo_label, icono, badge, avatar, iniciales,
          objetivo, subtitulo, peso, talla, estatus, online,
          ultima_visita, proxima_cita, bio, plan)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,\'new\',?,\'—\',\'Pendiente · 1ª consulta\',\'\',\'Por definir en primera consulta\')'
    );
    $stmt->execute([
        $nombre, $edad, $tel,
        $tm['tipo'], $label, $tm['icono'], $tm['badge'], $tm['av'], $ini,
        $goal, '1ª consulta próxima',
        $peso, $talla,
        $online,
    ]);

    $newId = (int)$pdo->lastInsertId();

    // Registros vacíos asociados
    $pdo->prepare('INSERT INTO historia_clinica (paciente_id, motivo) VALUES (?,?)')->execute([$newId, $goal]);
    $pdo->prepare('INSERT INTO consentimientos (paciente_id, firmado) VALUES (?,0)')->execute([$newId]);
    $pdo->prepare('INSERT INTO mediciones (paciente_id) VALUES (?)')->execute([$newId]);
    $pdo->prepare('INSERT INTO recuento_24h (paciente_id) VALUES (?)')->execute([$newId]);

    http_response_code(201);
    ok(['success' => true, 'id' => $newId, 'mensaje' => 'Paciente registrada correctamente']);
}

// ── Actualizar ────────────────────────────────────────
function update($pdo, $id) {
    $d = json_decode(file_get_contents('php://input'), true);
    if (!$d) badRequest('JSON inválido');

    $allowed = [
        'nombre', 'edad', 'telefono', 'peso', 'talla',
        'objetivo', 'subtitulo', 'estatus', 'online',
        'plan', 'bio', 'ultima_visita', 'proxima_cita',
        'sem_gestacion', 'lactancia', 'diabetes_gestacional',
    ];

    $fields = []; $values = [];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $d)) {
            $fields[] = "`$f` = ?";
            $values[] = $d[$f];
        }
    }

    if (!$fields) badRequest('Sin campos para actualizar');

    $values[] = $id;
    $pdo->prepare('UPDATE pacientes SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($values);
    ok(['success' => true, 'mensaje' => 'Paciente actualizada']);
}

// ── Eliminar ──────────────────────────────────────────
function remove($pdo, $id) {
    $pdo->prepare('DELETE FROM pacientes WHERE id = ?')->execute([$id]);
    ok(['success' => true, 'mensaje' => 'Paciente eliminada']);
}
