<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Prepare safe fallback
function respond($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

$query = $_GET['q'] ?? '';

if (!$query) {
    respond(["success" => false, "message" => "Missing 'q' query parameter"], 400);
}

$url = "https://www.ixigo.com/action/content/city?searchFor=airportSuggestions&value=" . urlencode($query) . "&nearByAirport=true";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT'] ?? 'PHP Client');

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    respond([
        "success" => false,
        "message" => "CURL error: " . curl_error($ch)
    ], 500);
}

curl_close($ch);

// Validate if response is JSON
$json = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    respond([
        "success" => false,
        "message" => "Invalid JSON response from upstream",
        "raw" => $response
    ], 502);
}

// Successful response
respond([
    "success" => true,
    "data" => $json
]);