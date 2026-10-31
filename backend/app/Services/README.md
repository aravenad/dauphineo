# Service de Recommandation SPR avec ChatGPT

Service permettant de générer des recommandations personnalisées de Sites Patrimoniaux Remarquables (SPR) en utilisant l'API ChatGPT.

## Prérequis

- Clé API OpenAI valide (à configurer dans `.env`)
- PHP 8.0+
- Extension GuzzleHTTP
- Fichier de données SPR (`resources/data/spr-details.json`)

## Configuration

1. Ajouter la clé API OpenAI dans le fichier `.env`:
```env
OPENAI_API_KEY="votre-clé-api"
```

2. S'assurer que le fichier `spr-details.json` est présent et correctement formaté

## Format des Données d'Entrée

Les préférences utilisateur doivent être fournies sous forme de tableau avec la structure suivante:

```json
{
  "tailleGroupe": "2",
  "themesInteret": ["Histoire", "Nature"],
  "dureeVisite": "Entre 2 et 3 heures",
  "accessibilitePMR": "Oui",
  "experiencesSpecifiques": ["Randonnée ou balade", "Exploration d'un château"]
}
```

### Description des Champs
- `tailleGroupe`: Nombre de personnes (string)
- `themesInteret`: Tableau des thèmes d'intérêt
- `dureeVisite`: Durée de visite souhaitée
- `accessibilitePMR`: Besoin d'accessibilité PMR ("Oui"/"Non")
- `experiencesSpecifiques`: Tableau des expériences souhaitées

## Format de Réponse

Le service retourne un tableau JSON structuré:

```json
{
  "recommendations": [
    {
      "SPR": "NOM_DU_SPR",
      "reasons": [
        "Raison 1 de la recommandation",
        "Raison 2 de la recommandation",
        "..."
      ]
    }
  ]
}
```

## Gestion des Erreurs

Le service peut lever plusieurs types d'exceptions:
- `RuntimeException`: Erreurs de configuration ou de communication API
- `InvalidArgumentException`: Format de données invalide

## Exemple d'Utilisation

```php
try {
    $chatGPTService = new ChatGPTService();
    $userAnswers = [
        "tailleGroupe" => "2",
        "themesInteret" => ["Histoire", "Nature"],
        "dureeVisite" => "Entre 2 et 3 heures",
        "accessibilitePMR" => "Oui",
        "experiencesSpecifiques" => ["Randonnée ou balade"]
    ];
    
    $recommendations = $chatGPTService->getSPRRecommendations($userAnswers);
    // Traitement des recommandations...
    
} catch (Exception $e) {
    // Gestion des erreurs...
}
```

## Notes Techniques

- Le service utilise le modèle GPT-4 Turbo d'OpenAI
- Les recommandations sont générées en français
- Les données des SPR sont stockées dans un fichier JSON détaillé
