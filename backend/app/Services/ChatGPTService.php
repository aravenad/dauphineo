<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use InvalidArgumentException;
use RuntimeException;
use Exception;

/**
 * ChatGPTService - Service de recommandation de Sites Patrimoniaux Remarquables (SPR)
 * 
 * Ce service utilise l'API OpenAI GPT-4o-mini pour générer des recommandations
 * personnalisées de SPR en fonction des préférences utilisateur. Les recommandations
 * sont basées sur une liste prédéfinie de sites avec leurs caractéristiques détaillées.
 * 
 * Exemple d'utilisation:
 * ```php
 * $chatGPTService = new ChatGPTService();
 * $userAnswers = [
 *     "tailleGroupe" => "2",
 *     "themesInteret" => ["Histoire", "Nature"],
 *     "dureeVisite" => "Entre 2 et 3 heures",
 *     "accessibilitePMR" => "Oui",
 *     "experiencesSpecifiques" => ["Randonnée ou balade", "Exploration d'un château"]
 * ];
 * $recommendations = $chatGPTService->getSPRRecommendations($userAnswers);
 * ```
 * 
 * @package App\Services
 * @version 1.0.0
 * @see README.md Documentation détaillée
 */
class ChatGPTService
{
    private Client $client;
    private const API_VERSION = 'v1';
    private const MODEL = 'gpt-4o-mini';
    private const SPR_DETAILS_PATH = __DIR__ . '/../../resources/data/spr-details.json';
    private const SSL_CERT_PATH = __DIR__ . '/../../config/ssl/cacert.pem';
    private array $config;
    private bool $debug;

    /**
     * Initialise le service ChatGPT
     * 
     * Configure le client GuzzleHttp avec la configuration de l'API OpenAI.
     * La clé API doit être définie dans le fichier .env sous OPENAI_API_KEY.
     * 
     * @throws RuntimeException Si la clé API OpenAI n'est pas configurée dans .env
     */
    public function __construct(array $config = null, bool $debug = false)
    {
        $this->debug = $debug;
        $apiKey = getenv('OPENAI_API_KEY');
        if (!$apiKey) {
            throw new RuntimeException('OpenAI API key not configured');
        }

        $this->client = new Client([
            'base_uri' => 'https://api.openai.com/' . self::API_VERSION . '/',
            'headers' => [
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type'  => 'application/json',
            ],
            'verify' => self::SSL_CERT_PATH // Use the SSL certificate
        ]);

        // Default configuration if none provided
        $this->config = $config ?? [
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
    }

    private function log(string $message, array $context = []): void
    {
        if ($this->debug) {
            $timestamp = date('Y-m-d H:i:s');
            $contextStr = !empty($context) ? ' ' . json_encode($context, JSON_UNESCAPED_UNICODE) : '';
            echo "[$timestamp] $message$contextStr\n";
        }
    }

    /**
     * Valide le format et le contenu des réponses utilisateur
     * 
     * @param array $userAnswers
     * @throws InvalidArgumentException
     */
    private function validateUserAnswers(array $userAnswers): void
    {
        // Validate required fields
        $requiredFields = ['tailleGroupe', 'themesInteret', 'dureeVisite', 'accessibilitePMR', 'experiencesSpecifiques'];
        foreach ($requiredFields as $field) {
            if (!isset($userAnswers[$field])) {
                throw new InvalidArgumentException("Champ requis manquant : $field");
            }
        }

        // Validate taille groupe
        if (!is_numeric($userAnswers['tailleGroupe']) || 
            intval($userAnswers['tailleGroupe']) > $this->config['validation']['max_taille_groupe']) {
            throw new InvalidArgumentException("Taille de groupe invalide");
        }

        // Validate themes
        foreach ($userAnswers['themesInteret'] as $theme) {
            if (!in_array($theme, $this->config['validation']['themes_disponibles'])) {
                throw new InvalidArgumentException("Thème invalide : $theme");
            }
        }

        // Validate duree
        if (!in_array($userAnswers['dureeVisite'], $this->config['validation']['duree_visites'])) {
            throw new InvalidArgumentException("Durée de visite invalide");
        }
    }

    /**
     * Génère des recommandations de SPR basées sur les réponses utilisateur
     * 
     * @param array $userAnswers Tableau des préférences utilisateur avec la structure suivante:
     *                          - tailleGroupe: string (nombre de personnes)
     *                          - themesInteret: array (thèmes d'intérêt)
     *                          - dureeVisite: string (durée de visite souhaitée)
     *                          - accessibilitePMR: string ("Oui" ou "Non")
     *                          - experiencesSpecifiques: array (expériences souhaitées)
     * @return array Retourne un tableau avec la structure suivante:
     *               [
     *                 "recommendations" => [
     *                   [
     *                     "SPR" => string (nom du SPR),
     *                   ],
     *                   ...
     *                 ]
     *               ]
     * @throws RuntimeException Si la communication API échoue ou si la réponse est invalide
     * @throws InvalidArgumentException Si le format des réponses utilisateur est invalide
     */
    public function getSPRRecommendations(array $userAnswers): array
    {
        try {
            $this->log('Début de la génération de recommandations', ['userAnswers' => $userAnswers]);
            
            $this->validateUserAnswers($userAnswers);

            $sprList = $this->readSPRList();
            $response = $this->sendMessage([
                [
                    'role' => 'system',
                    'content' => "You are a French tourism expert specializing in Sites Patrimoniaux Remarquables (SPR). 
                        Analyze the user preferences and the list of available SPR sites to provide personalized recommendations.
                        Your response must be in valid JSON format with this exact structure:
                        {
                            \"recommendations\": [
                                {
                                    \"spr\": \"Name of SPR\"
                                }
                            ]
                        }
                        Provide 2-3 recommendations maximum, ensure the SPR names match exactly with the provided list."
                ],
                [
                    'role' => 'user',
                    'content' => "Voici les préférences de l'utilisateur:\n" . 
                                json_encode($userAnswers, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . 
                                "\n\nListe des SPR disponibles:\n" . $sprList
                ]
            ]);

            $content = $response['choices'][0]['message']['content'] ?? null;
            if (!$content) {
                throw new RuntimeException('Empty response from API');
            }

            // Clean and parse the response
            $content = trim($content);
            // Remove any potential markdown code block indicators
            $content = preg_replace('/^```json\s*|\s*```$/m', '', $content);
            
            $recommendations = json_decode($content, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->log('JSON parsing error', [
                    'error' => json_last_error_msg(),
                    'content' => $content
                ]);
                throw new RuntimeException('Invalid JSON in API response: ' . json_last_error_msg());
            }

            if (!isset($recommendations['recommendations']) || !is_array($recommendations['recommendations'])) {
                $this->log('Invalid response structure', ['response' => $recommendations]);
                throw new RuntimeException('Invalid response structure from API');
            }

            // Validate each recommendation
            foreach ($recommendations['recommendations'] as $rec) {
                if (!isset($rec['spr'])) {
                    throw new RuntimeException('Invalid recommendation format in API response');
                }
            }

            $this->log('Recommandations générées avec succès', ['recommendations' => $recommendations]);
            return $recommendations;

        } catch (Exception $e) {
            $this->log('Erreur lors de la génération des recommandations', [
                'error' => $e->getMessage(),
                'userAnswers' => $userAnswers
            ]);
            throw $e;
        }
    }

    /**
     * Envoie un message à l'API ChatGPT et récupère la réponse
     * 
     * Méthode interne pour gérer la communication avec l'API OpenAI.
     * Valide le format du message et gère la réponse de l'API.
     * 
     * @param array $messages Tableau de messages à envoyer à ChatGPT
     *                       Chaque message doit avoir les clés 'role' et 'content'
     * @return array Réponse traitée de l'API
     * @throws InvalidArgumentException Si le format du message est invalide
     * @throws RuntimeException Si la requête API échoue
     * @throws GuzzleException Si une erreur réseau ou HTTP survient
     */
    private function sendMessage(array $messages): array
    {
        $this->validateMessages($messages);

        try {
            $startTime = microtime(true);
            
            $response = $this->client->post('chat/completions', [
                'json' => [
                    'model' => self::MODEL,
                    'messages' => $messages,
                    'temperature' => 0.7,
                ],
            ]);

            $endTime = microtime(true);
            $duration = round(($endTime - $startTime) * 1000); // Convert to milliseconds
            
            $this->log("API request completed", ['duration_ms' => $duration]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (GuzzleException $e) {
            throw new RuntimeException('Server error: ' . $e->getMessage());
        }
    }

    /**
     * Lit et valide la liste des SPR depuis le fichier JSON
     * 
     * Lit la liste prédéfinie des Sites Patrimoniaux Remarquables
     * depuis le fichier JSON spécifié dans SPR_DETAILS_PATH.
     * 
     * @return string Contenu formaté de la liste des SPR
     * @throws RuntimeException Si le fichier est introuvable ou illisible
     */
    private function readSPRList(): string
    {
        if (!file_exists(self::SPR_DETAILS_PATH)) {
            throw new RuntimeException('SPR details file not found');
        }
        
        $jsonContent = file_get_contents(self::SPR_DETAILS_PATH) ?: 
            throw new RuntimeException('Failed to read SPR details');
        
        $data = json_decode($jsonContent, true);
        if (json_last_error() !== JSON_ERROR_NONE || !isset($data['spr'])) {
            throw new RuntimeException('Invalid SPR details format');
        }

        // Format the locations with detailed information for the prompt
        return "Sites Patrimoniaux Remarquables disponibles:\n\n" . 
               implode("\n\n", array_map(function($site) {
                   return "- {$site['name']}\n" .
                          "  Description: {$site['description']}\n" .
                          "  Thèmes: " . implode(', ', $site['features']['themes']) . "\n" .
                          "  Activités: " . implode(', ', $site['features']['activities']) . "\n" .
                          "  Durée moyenne: {$site['features']['average_duration']}\n" .
                          "  Accessible PMR: " . ($site['features']['pmr_accessible'] ? 'Oui' : 'Non');
               }, $data['spr']));
    }

    /**
     * Valide le format des messages à envoyer à l'API
     * 
     * Vérifie que chaque message dans le tableau possède les clés requises
     * 'role' et 'content' et que les rôles sont valides.
     * 
     * @param array $messages Tableau de messages à valider
     * @throws InvalidArgumentException Si le tableau est vide ou contient un format invalide
     */
    private function validateMessages(array $messages): void
    {
        if (empty($messages)) {
            throw new InvalidArgumentException('Messages array cannot be empty');
        }

        foreach ($messages as $message) {
            if (!isset($message['role'], $message['content'])) {
                throw new InvalidArgumentException('Each message must have a role and content');
            }
            if (!in_array($message['role'], ['system', 'user', 'assistant'])) {
                throw new InvalidArgumentException('Invalid message role');
            }
        }
    }
}
