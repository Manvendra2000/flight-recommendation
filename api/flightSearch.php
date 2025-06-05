<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$origin = $_GET['origin'] ?? '';
$destination = $_GET['destination'] ?? '';
$date = $_GET['date'] ?? '';
$class = $_GET['class'] ?? 'e';

if (!$origin || !$destination || !$date) {
  echo json_encode(['error' => 'Missing parameters']);
  exit;
}

$url = "https://www.ixigo.com/api/flights/search?origin=$origin&destination=$destination&leave=$date&return=&adults=1&children=0&infants=0&class=$class&version=2.0&searchSrc=ixibook";

$headers = [
  'authority: www.ixigo.com',
  'accept: */*',
  'accept-language: en-GB,en-US;q=0.9,en;q=0.8',
  'apikey: ixiweb!2$',
  'ixisrc: ixiweb',
  'user-agent: Mozilla/5.0 (X11; Linux x86_64)'
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
echo $response;