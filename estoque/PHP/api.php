<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch($method) {
        case 'GET':
            $stmt = $pdo->query("SELECT * FROM pecas ORDER BY codigo");
            $pecas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'data' => $pecas]);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                throw new Exception("Dados inválidos: " . json_last_error_msg());
            }

            // Log the received data
            error_log("Dados recebidos: " . print_r($data, true));

            // Validate required fields with detailed messages
            if (empty($data['codigo'])) {
                throw new Exception("Código da peça é obrigatório");
            }
            if (empty($data['nome'])) {
                throw new Exception("Nome da peça é obrigatório");
            }
            if (!isset($data['quantidade'])) {
                throw new Exception("Quantidade é obrigatória");
            }

            try {
                $stmt = $pdo->prepare("INSERT INTO pecas (codigo, nome, quantidade, localizacao) VALUES (?, ?, ?, ?)");
                $result = $stmt->execute([
                    $data['codigo'],
                    $data['nome'],
                    $data['quantidade'],
                    $data['localizacao'] ?? ''
                ]);
                
                if (!$result) {
                    throw new Exception("Erro na execução do SQL: " . implode(" ", $stmt->errorInfo()));
                }
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Peça adicionada com sucesso',
                    'id' => $pdo->lastInsertId()
                ]);
            } catch(PDOException $e) {
                // Check for duplicate entry
                if ($e->getCode() == 23000) {
                    throw new Exception("Já existe uma peça com este código");
                }
                throw new Exception("Erro ao inserir no banco: " . $e->getMessage());
            }
            break;

        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                throw new Exception("Dados inválidos");
            }

            $stmt = $pdo->prepare("UPDATE pecas SET nome = ?, quantidade = ?, localizacao = ? WHERE codigo = ?");
            $stmt->execute([
                $data['nome'],
                $data['quantidade'],
                $data['localizacao'] ?? '',
                $data['codigo']
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Peça atualizada com sucesso'
            ]);
            break;

        case 'DELETE':
            $codigo = $_GET['codigo'] ?? null;
            
            if (!$codigo) {
                throw new Exception("Código não fornecido");
            }

            $stmt = $pdo->prepare("DELETE FROM pecas WHERE codigo = ?");
            $stmt->execute([$codigo]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Peça removida com sucesso'
            ]);
            break;

        default:
            throw new Exception("Método não suportado");
    }
} catch (Exception $e) {
    error_log("Erro na API: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'details' => [
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
}
?>
