<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$searchId = $_GET['searchId'] ?? '';
$providerId = $_GET['providerId'] ?? '';
$airlineCode = $_GET['airlineCode'] ?? '';

if (!$searchId || !$providerId || !$airlineCode) {
  echo json_encode(['error' => 'Missing searchId, providerId, or airlineCode']);
  exit;
}

// API URL to fetch full details
$url = "https://www.ixigo.com/api/flights/search/result?searchId=" . urlencode($searchId) . "&provider=" . urlencode($providerId);

$headers = [
  'authority: www.ixigo.com',
  'accept: */*',
  'accept-language: en-GB,en-US;q=0.9,en;q=0.8',
  'apikey: ixiweb!2$',
  'ixisrc: ixiweb',
  'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
$response = curl_exec($ch);

if (curl_errno($ch)) {
  echo json_encode(['error' => curl_error($ch)]);
  curl_close($ch);
  exit;
}

curl_close($ch);

// Filter to extract airline name, searchId, and providerId
$data = json_decode($response, true);

// Extract airline names using the code
$airlines = $data['data']['airlines'] ?? [];
$airlineName = 'Not found';
foreach ($airlines as $airline) {
  if ($airline['code'] === $airlineCode) {
    $airlineName = $airline['name'];
    break;
  }
}

// Final output
echo json_encode([
  'SearchProvider' => $providerId,
  'SearchToken' => $searchId,
  'AirlineCode' => $airlineCode,
  'AirlineName' => $airlineName
], JSON_PRETTY_PRINT);