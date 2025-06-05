<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$searchToken = $_GET['searchToken'] ?? '';
$searchProvider = $_GET['searchProvider'] ?? '';

if (!$searchToken || !$searchProvider) {
  echo json_encode(['error' => 'Missing parameters']);
  exit;
}

$url = "https://www.ixigo.com/api/flights/search/poll/$searchToken?searchProviderIds=$searchProvider";

$headers = [
  'accept: */*',
  'accept-language: en-GB,en-US;q=0.9,en;q=0.8',
  'accept-encoding: gzip, deflate',
  'apikey: ixiweb!2$',
  'ixisrc: ixiweb',
  'user-agent: Mozilla/5.0 (X11; Linux x86_64)'
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_ENCODING, ''); // <- This line tells cURL to handle gzip/deflate automatically

$response = curl_exec($ch);

if (curl_errno($ch)) {
  echo json_encode(['error' => curl_error($ch)]);
  curl_close($ch);
  exit;
}

curl_close($ch);
echo $response;