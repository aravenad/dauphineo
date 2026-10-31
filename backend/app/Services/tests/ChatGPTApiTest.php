<?php

$api_key = '***REMOVED***'; 
$certPath = __DIR__ . '/../../../config/ssl/cacert.pem';

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => 'https://api.openai.com/v1/chat/completions',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_CAINFO => $certPath,
    CURLOPT_POSTFIELDS => json_encode([
        'model' => 'gpt-4',
        'messages' => [
            ['role' => 'user', 'content' => 'Say hello in French']
        ],
        'temperature' => 0.7
    ]),
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $api_key,
        'Content-Type: application/json'
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    echo $response;
}
