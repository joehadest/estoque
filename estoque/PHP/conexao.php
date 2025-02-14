<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$dbHost = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbName = "estoque";  // Updated database name

try {
    $conexao = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);
    
    if ($conexao->connect_error) {
        throw new Exception("Erro na conexão: " . $conexao->connect_error);
    }
    
    if (!$conexao->set_charset("utf8mb4")) {
        throw new Exception("Erro ao configurar charset: " . $conexao->error);
    }

} catch (Exception $e) {
    die(json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]));
}
?>
