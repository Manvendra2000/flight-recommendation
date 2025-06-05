<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$token = $_GET['token'] ?? '';
$provider = $_GET['provider'] ?? '';

if (!$token || !$provider) {
  echo json_encode(['error' => 'Missing parameters']);
  exit;
}

$url = "https://www.ixigo.com/api/flights/search/poll/$token?searchProviderIds=$provider";

$headers = [
  "accept: */*",
  "accept-encoding: gzip, deflate, br",
  "accept-language: en-GB,en-US;q=0.9,en;q=0.8",
  "apikey: ixiweb!2$",
  "ixisrc: ixiweb",
  "user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_ENCODING, ''); // Enable gzip
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$response = curl_exec($ch);

if (curl_errno($ch)) {
  echo json_encode(['error' => curl_error($ch)]);
  curl_close($ch);
  exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 500) {
  echo json_encode(['error' => 'Server error from Ixigo', 'status' => $httpCode]);
  exit;
}

echo $response;