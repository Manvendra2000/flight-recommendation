<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// $searchToken = '07062025105411000';
// $providerId = '1044';

$searchToken = $_GET['token'] ?? '';
$providerId = $_GET['provider'] ?? '';

if (!$searchToken || !$providerId) {
  echo json_encode(['error' => 'Missing parameters']);
  exit;
}


$url = "https://www.ixigo.com/api/flights/search/poll/$searchToken?searchProviderIds=$providerId";

$headers = [
  'authority: www.ixigo.com',
  'accept: application/json, text/plain, */*',
  'accept-language: en-GB,en-US;q=0.9,en;q=0.8',
  'apikey: ixiweb!2$',
  'ixisrc: ixiweb',
  'referer: https://www.ixigo.com/',
  'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'X-Forwarded-For: 103.21.244.0', // Any public IP
'Client-IP: 103.21.244.0',
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_COOKIEFILE, ''); // creates temporary cookie jar in memory
curl_setopt($ch, CURLOPT_COOKIEJAR, '');  // stores cookie data between requests
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_ENCODING, ''); // To decode gzip responses
$response = curl_exec($ch);

if (curl_errno($ch)) {
  echo json_encode(['error' => curl_error($ch)]);
} else {
  echo $response;
}
curl_close($ch);