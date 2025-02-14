<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    
    if (empty($input)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Dados não recebidos'
        ]);
        exit();
    }

    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'JSON inválido: ' . json_last_error_msg()
        ]);
        exit();
    }

    // Validate required fields
    if (empty($data['codigo']) || empty($data['nome']) || !isset($data['quantidade'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Campos obrigatórios faltando'
        ]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO pecas (codigo, nome, quantidade, localizacao) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['codigo'],
            $data['nome'],
            $data['quantidade'],
            $data['localizacao'] ?? ''
        ]);
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Peça adicionada com sucesso',
            'id' => $pdo->lastInsertId()
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Erro ao adicionar peça: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Método não permitido'
    ]);
}
?>
