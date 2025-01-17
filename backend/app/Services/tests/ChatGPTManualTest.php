<?php

require_once __DIR__ . '/../../../vendor/autoload.php';

use App\Services\ChatGPTService;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

// Configuration for testing
$config = [
    'validation' => [
        'duree_visites' => [
            'Entre 1 et 2 heures',
            'Entre 2 et 3 heures',
            'Entre 3 et 4 heures',
            'Plus de 4 heures'
        ],
        'max_taille_groupe' => 30,
        'themes_disponibles' => [
            'Histoire',
            'Nature',
            'Architecture',
            'Culture',
            'Art',
            'Religion',
            'Patrimoine industriel'
        ]
    ]
];

try {
    // Initialize service with configuration and debug enabled
    $chatGPTService = new ChatGPTService($config, true);

    // Test data
    $userAnswers = [
        "tailleGroupe" => "2",
        "themesInteret" => ["Histoire", "Nature"],
        "dureeVisite" => "Entre 2 et 3 heures",
        "accessibilitePMR" => "Oui",
        "experiencesSpecifiques" => ["Randonnée ou balade", "Exploration d'un château"]
    ];

    echo "Envoi de la requête...\n";
    $result = $chatGPTService->getSPRRecommendations($userAnswers);

    echo "\nRéponse reçue :\n";
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";

} catch (Exception $e) {
    echo "Erreur : " . $e->getMessage() . "\n";
    echo "Trace :\n" . $e->getTraceAsString() . "\n";
}
