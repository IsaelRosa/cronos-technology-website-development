<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['success' => false, 'message' => 'Método não permitido.']);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$requestHost = strtolower((string) parse_url('http://' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST));
$originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
if ($origin !== '' && ($requestHost === '' || $originHost !== $requestHost)) {
    respond(403, ['success' => false, 'message' => 'Origem não autorizada.']);
}

$rawBody = file_get_contents('php://input');
if ($rawBody === false || strlen($rawBody) > 12_288) {
    respond(413, ['success' => false, 'message' => 'Solicitação muito grande.']);
}

$data = json_decode($rawBody, true);
if (!is_array($data)) {
    respond(400, ['success' => false, 'message' => 'Dados inválidos.']);
}

$fields = ['nome', 'empresa', 'email', 'telefone', 'servico', 'assunto', 'mensagem'];
$values = [];
foreach ($fields as $field) {
    $value = $data[$field] ?? '';
    if (!is_string($value)) {
        respond(400, ['success' => false, 'message' => 'Dados inválidos.']);
    }
    $values[$field] = trim($value);
}

if (!empty($data['website'])) {
    respond(400, ['success' => false, 'message' => 'Solicitação inválida.']);
}

$limits = [
    'nome' => 120,
    'empresa' => 160,
    'email' => 254,
    'telefone' => 40,
    'servico' => 120,
    'assunto' => 180,
    'mensagem' => 5000,
];
foreach ($limits as $field => $limit) {
    if (strlen($values[$field]) > $limit) {
        respond(400, ['success' => false, 'message' => 'Um ou mais campos excedem o limite permitido.']);
    }
}

if (
    strlen($values['nome']) < 3
    || !filter_var($values['email'], FILTER_VALIDATE_EMAIL)
    || strlen(preg_replace('/\D/', '', $values['telefone']) ?? '') < 10
    || strlen($values['servico']) === 0
    || strlen($values['assunto']) < 3
    || strlen($values['mensagem']) < 20
) {
    respond(400, ['success' => false, 'message' => 'Preencha os campos obrigatórios corretamente.']);
}

$recipient = 'contato@khronostecnologiaesistemas.com.br';
$subject = 'Nova solicitacao de contato - Site Kronos';
$message = implode("\n", [
    'Nova solicitação recebida pelo site Kronos.',
    '',
    'Nome: ' . $values['nome'],
    'Empresa: ' . ($values['empresa'] !== '' ? $values['empresa'] : '-'),
    'E-mail: ' . $values['email'],
    'Telefone: ' . $values['telefone'],
    'Serviço: ' . $values['servico'],
    'Assunto: ' . $values['assunto'],
    '',
    'Mensagem:',
    $values['mensagem'],
]);
$headers = [
    'From: Kronos Website <' . $recipient . '>',
    'Reply-To: ' . $values['email'],
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

if (!mail($recipient, $subject, $message, implode("\r\n", $headers))) {
    error_log('The Hostinger contact form could not send an email.');
    respond(503, ['success' => false, 'message' => 'Não foi possível enviar a mensagem agora.']);
}

respond(200, ['success' => true]);
