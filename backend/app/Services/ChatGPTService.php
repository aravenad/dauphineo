<?php

namespace App\Services;

use GuzzleHttp\Client;

class ChatGPTService
{
    private $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://api.openai.com/v1/',
            'headers' => [
                'Authorization' => 'Bearer ***REMOVED***', // Replace with your key
                'Content-Type'  => 'application/json',
            ],
        ]);
    }

    public function sendMessage(array $messages)
    {
        $response = $this->client->post('chat/completions', [
            'json' => [
                'model' => 'gpt-4',
                'messages' => $messages,
                'temperature' => 0.7,
            ],
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }
}
