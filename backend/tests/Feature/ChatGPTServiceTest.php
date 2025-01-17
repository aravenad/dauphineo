<?php

use App\Services\ChatGPTService;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7\Request;

beforeEach(function () {
    // Mock successful API response without double encoding
    $mockResponse = new Response(200, [], json_encode([
        'choices' => [
            [
                'message' => [
                    'content' => '{
                        "recommendations": [
                            {
                                "spr": "SAINT-ANTOINE-L\'ABBAYE",
                                "reasons": [
                                    "Site accessible PMR",
                                    "Durée de visite adaptée (2-3h)",
                                    "Correspond aux thèmes d\'intérêt"
                                ]
                            }
                        ]
                    }'
                ]
            ]
        ]
    ]));

    $mock = new MockHandler([$mockResponse]);
    $handlerStack = HandlerStack::create($mock);
    $client = new Client(['handler' => $handlerStack]);

    $this->chatGPTService = new ChatGPTService();
    // Inject mocked client
    $reflection = new ReflectionClass($this->chatGPTService);
    $property = $reflection->getProperty('client');
    $property->setAccessible(true);
    $property->setValue($this->chatGPTService, $client);
});

test('getSPRRecommendations returns valid recommendations', function () {
    $userAnswers = [
        'tailleGroupe' => '2',
        'themesInteret' => ['Histoire', 'Nature'],
        'dureeVisite' => 'Entre 2 et 3 heures',
        'accessibilitePMR' => 'Oui',
        'experiencesSpecifiques' => ['Randonnée ou balade', 'Exploration d\'un château']
    ];

    $result = $this->chatGPTService->getSPRRecommendations($userAnswers);

    expect($result)->toBeArray()
        ->toHaveKey('recommendations')
        ->and($result['recommendations'])->toBeArray()
        ->and($result['recommendations'][0])->toHaveKeys(['spr', 'reasons'])
        ->and($result['recommendations'][0]['reasons'])->toBeArray();
});

test('getSPRRecommendations validates user answers format', function () {
    $invalidUserAnswers = [
        'tailleGroupe' => '2',
        // Missing required fields
    ];

    expect(fn() => $this->chatGPTService->getSPRRecommendations($invalidUserAnswers))
        ->toThrow(InvalidArgumentException::class);
});

test('getSPRRecommendations handles API errors gracefully', function () {
    $request = new Request('POST', 'chat/completions');
    $mockErrorResponse = new Response(500, [], 'API Error');
    
    $mock = new MockHandler([
        new RequestException(
            'Server error: `POST chat/completions` resulted in a `500 Internal Server Error` response: API Error',
            $request,
            $mockErrorResponse
        )
    ]);
    
    $handlerStack = HandlerStack::create($mock);
    $client = new Client(['handler' => $handlerStack]);

    $reflection = new ReflectionClass($this->chatGPTService);
    $property = $reflection->getProperty('client');
    $property->setAccessible(true);
    $property->setValue($this->chatGPTService, $client);

    $userAnswers = [
        'tailleGroupe' => '2',
        'themesInteret' => ['Histoire'],
        'dureeVisite' => 'Entre 2 et 3 heures',
        'accessibilitePMR' => 'Oui',
        'experiencesSpecifiques' => ['Randonnée']
    ];

    $exception = null;
    try {
        $this->chatGPTService->getSPRRecommendations($userAnswers);
    } catch (RuntimeException $e) {
        $exception = $e;
    }

    expect($exception)->toBeInstanceOf(RuntimeException::class)
        ->and($exception->getMessage())->toContain('Server error');
});

test('it validates theme interests correctly', function () {
    $userAnswers = [
        'tailleGroupe' => '2',
        'themesInteret' => ['Theme_Invalid'],
        'dureeVisite' => 'Entre 2 et 3 heures',
        'accessibilitePMR' => 'Oui',
        'experiencesSpecifiques' => ['Randonnée']
    ];

    expect(fn() => $this->chatGPTService->getSPRRecommendations($userAnswers))
        ->toThrow(InvalidArgumentException::class, 'Thème invalide');
});

test('it validates group size correctly', function () {
    $userAnswers = [
        'tailleGroupe' => '50', // Too large
        'themesInteret' => ['Histoire'],
        'dureeVisite' => 'Entre 2 et 3 heures',
        'accessibilitePMR' => 'Oui',
        'experiencesSpecifiques' => ['Randonnée']
    ];

    expect(fn() => $this->chatGPTService->getSPRRecommendations($userAnswers))
        ->toThrow(InvalidArgumentException::class, 'Taille de groupe invalide');
});

test('it validates visit duration correctly', function () {
    $userAnswers = [
        'tailleGroupe' => '2',
        'themesInteret' => ['Histoire'],
        'dureeVisite' => 'Durée invalide',
        'accessibilitePMR' => 'Oui',
        'experiencesSpecifiques' => ['Randonnée']
    ];

    expect(fn() => $this->chatGPTService->getSPRRecommendations($userAnswers))
        ->toThrow(InvalidArgumentException::class, 'Durée de visite invalide');
});
