<?php
// ══════════════════════════════════════════════════════
// GestaNut · Configuración de base de datos
// Edita los valores si tu XAMPP usa contraseña o un nombre de BD distinto
// ══════════════════════════════════════════════════════
define('DB_HOST',    'localhost');
define('DB_NAME',    'gestanut');
define('DB_USER',    'root');
define('DB_PASS',    '');          // Contraseña de MySQL (vacía en XAMPP por defecto)
define('DB_CHARSET', 'utf8mb4');

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'error'   => 'Error de conexión a la base de datos',
        'detalle' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
