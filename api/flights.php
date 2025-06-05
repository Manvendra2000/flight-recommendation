<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$origin = $_GET['origin'] ?? '';
$destination = $_GET['destination'] ?? '';
$class = $_GET['class'] ?? 'e';
$startDate = $_GET['startDate'] ?? '';
$endDate = $_GET['endDate'] ?? '';

if (!$origin || !$destination || !$startDate || !$endDate) {
  echo json_encode(['error' => 'Missing parameters']);
  exit;
}

$url = "https://www.ixigo.com/api/v2/graphs/data/new?origin=$origin&destination=$destination&class=$class&startDate=$startDate&endDate=$endDate&currency=INR";

$headers = [
  'authority: www.ixigo.com',
  'accept: */*',
  'accept-language: en-GB,en-US;q=0.9,en;q=0.8',
  'apikey: ixiweb!2$',
  'user-agent: Mozilla/5.0 (X11; Linux x86_64)'
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
$response = curl_exec($ch);
curl_close($ch);

echo $response;