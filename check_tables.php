<?php
require 'GESTANUT/api/db.php';
$t = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
echo implode("\n", $t) . "\n";
