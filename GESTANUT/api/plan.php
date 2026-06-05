<?php
// ══════════════════════════════════════════════════════
// API · Plan nutricional
// GET  ?paciente_id=X   — plan activo
// PUT  body JSON         — crear/actualizar plan activo
// ══════════════════════════════════════════════════════
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require __DIR__ . '/db.php';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $pid = (int)($_GET['paciente_id'] ?? 0);
    if (!$pid) { http_response_code(400); echo json_encode(['error'=>'paciente_id requerido']); exit; }
    $stmt = $pdo->prepare('SELECT * FROM planes_nutricionales WHERE paciente_id = ? AND activo = 1 ORDER BY id DESC LIMIT 1');
    $stmt->execute([$pid]);
    $p = $stmt->fetch();
    echo json_encode($p ? ['plan' => $p['descripcion'] ?? ''] : ['plan' => '']);
    exit;
}

if ($method === 'PUT') {
    $d   = json_decode(file_get_contents('php://input'), true);
    $pid = (int)($d['paciente_id'] ?? 0);
    if (!$pid) { http_response_code(400); echo json_encode(['error'=>'paciente_id requerido']); exit; }

    // Desactivar planes anteriores
    $pdo->prepare('UPDATE planes_nutricionales SET activo=0 WHERE paciente_id=?')->execute([$pid]);

    $stmt = $pdo->prepare('INSERT INTO planes_nutricionales
        (paciente_id, fecha_creacion, descripcion, activo)
        VALUES (:pid, :fecha, :desc, 1)');
    $stmt->execute([
        ':pid'  => $pid,
        ':fecha'=> date('Y-m-d'),
        ':desc' => trim($d['descripcion'] ?? ''),
    ]);
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
