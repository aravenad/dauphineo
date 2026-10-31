# Dauphinéo

Site de réservation de visites guidées dans les sites patrimoniaux remarquables (SPR) de l'Isère. On y explore une vingtaine de communes, on réserve un créneau avec un guide, on laisse un avis, et un questionnaire recommande les sites qui correspondent à ses envies.

La démonstration est disponible sur [aravenad.github.io/dauphineo](https://aravenad.github.io/dauphineo/).

## Contexte

Projet d'équipe réalisé pendant la SAÉ 3.01 du BUT Informatique à l'IUT2 de Grenoble (2024). Le projet a été repris en 2026 après la fermeture des serveurs de l'IUT : sécurisation de l'API, migrations Laravel, branchement de toutes les pages sur l'API, recommandation par Claude Haiku 5.5 et version de démonstration publiée sur GitHub Pages.

Les dossiers de conception d'origine sont dans [`conception/`](conception/).

## Fonctionnalités

- page d'accueil avec recherche rapide et sites mis en avant ;
- exploration des sites avec filtres par commune, thème, durée de visite et accessibilité PMR ;
- fiche de chaque site : photos, description, carte, créneaux et avis ;
- réservation d'un créneau avec un guide, au prix fixé par le serveur et dans la limite des places restantes ;
- espace « Mon compte » : réservations à venir et passées, annulation, profil, mot de passe et suppression du compte ;
- avis notés de 1 à 5, un par site et par visiteur ;
- questionnaire de recommandation : Claude Haiku 5.5 quand une clé d'API est configurée, moteur local sinon.

## Deux façons de l'utiliser

**Démonstration (GitHub Pages).** Le site fonctionne sans serveur : les données viennent des fichiers CSV du dépôt et tout ce que vous faites (compte, réservations, avis) reste dans votre navigateur. Les recommandations viennent du moteur local. Le bouton « Utiliser le compte de démo » de la fenêtre de connexion remplit les identifiants.

**Version complète (en local).** Le frontend React parle à l'API Laravel, adossée à PostgreSQL.

## Technologies

- frontend : React 18, TypeScript, Material UI 6, React Router 7 et Vite 6 ;
- API : Laravel 11 avec Sanctum pour l'authentification ;
- base de données : PostgreSQL 17 ;
- recommandation : SDK PHP d'Anthropic avec le modèle `claude-haiku-5-5`, et un moteur de score local en repli.

## Lancer le projet en local

Prérequis : PHP 8.2 ou plus avec l'extension `pdo_pgsql`, Composer, PostgreSQL 17 et Node.js 22.

### API

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Renseignez l'accès à PostgreSQL dans `.env` (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`), créez la base, puis :

```bash
php artisan migrate --seed
php artisan serve
```

L'API répond sur `http://localhost:8000`. Le seeder importe les sites, les guides, les photos et les avis depuis `backend/database/data/`, génère les créneaux des semaines à venir et crée des comptes de démonstration, dont `demo@dauphineo.test`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le site est servi sur `http://localhost:5173`. Pour tester la version de démonstration sans API :

```bash
npm run build -- --mode pages
npx vite preview --mode pages
```

## Recommandation par Claude

La recommandation par IA est facultative. Sans clé, le moteur local classe les sites selon les thèmes, la durée, l'accessibilité et la taille du groupe.

Pour activer Claude Haiku 5.5 :

1. créez un compte sur la [console Anthropic](https://console.anthropic.com/) et ajoutez des crédits (l'abonnement Claude.ai ne couvre pas l'API) ;
2. fixez une limite de dépenses dans les réglages de facturation ;
3. créez une clé dans « API Keys » ;
4. ajoutez-la dans `backend/.env` :

```dotenv
ANTHROPIC_API_KEY=votre-clé
ANTHROPIC_MODEL=claude-haiku-5-5
```

La clé reste côté serveur et n'est jamais envoyée au navigateur. Si l'appel échoue ou dépasse 15 secondes, l'API se rabat sur le moteur local et l'indique dans sa réponse.

## Tests

```bash
cd backend && php artisan test
cd frontend && npm run lint && npm run build
```

Les tests de l'API utilisent une base PostgreSQL `dauphineo_test`. Le workflow GitHub Actions lance ces vérifications à chaque push, puis publie la démonstration sur GitHub Pages.

## Photos

Les 60 photos des sites viennent de [Wikimedia Commons](https://commons.wikimedia.org/), sous licence libre (CC BY, CC BY-SA). Le fichier `backend/database/data/images.csv` garde pour chacune l'auteur, la licence et la page d'origine.

Le site affiche le crédit sous chaque photo de la galerie et la liste complète dans les mentions légales. Une photo qui ne se charge plus est masquée automatiquement.
