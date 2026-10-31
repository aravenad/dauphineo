<?php

namespace Database\Seeders;

use App\Models\Avis;
use App\Models\Disponibilite;
use App\Models\Guide;
use App\Models\Images;
use App\Models\Reservation;
use App\Models\Spr;
use App\Models\Utilisateur;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Remplit la base à partir des CSV de database/data, les mêmes que ceux du mode démo du frontend.
 */
class DatabaseSeeder extends Seeder
{
    /** Nombre de jours ouverts à la réservation à partir de demain. */
    private const JOURS_OUVERTS = 21;

    public function run(): void
    {
        DB::transaction(function () {
            $this->seedSpr();
            $this->seedImages();
            $utilisateurs = $this->seedUtilisateurs();
            $this->seedGuides();
            $this->seedDisponibilites();
            $this->seedAvis($utilisateurs);
            $this->seedReservations($utilisateurs);
        });
    }

    /** Mot de passe des comptes de démonstration, pour une base locale uniquement. */
    public static function motDePasseDemo(): string
    {
        return env('SEED_DEMO_PASSWORD', 'dauphineo-demo');
    }

    private function seedSpr(): void
    {
        foreach ($this->csv('spr.csv') as $ligne) {
            // Le trigger trg_generate_creneaux crée les créneaux de chaque SPR inséré
            Spr::forceCreate([
                'id' => (int) $ligne['id'],
                'code_departement' => (int) $ligne['code_departement'],
                'nom_du_departement' => $ligne['nom_du_departement'],
                'nom_commune' => $ligne['nom_commune'],
                'capacite_de_visite' => (int) $ligne['capacite_de_visite'],
                'mot_cle' => $ligne['mot_cle'],
                'is_pmr' => $ligne['is_pmr'] === 'true',
                'temps_de_visite' => $ligne['temps_de_visite'],
                'courte_description' => $ligne['courte_description'],
                'longue_description' => $ligne['longue_description'],
            ]);
        }
        $this->resetSequence('spr');
    }

    private function seedImages(): void
    {
        foreach ($this->csv('images.csv') as $ligne) {
            Images::forceCreate([
                'id' => (int) $ligne['id'],
                'image_url' => $ligne['image_url'],
                'auteur' => $ligne['auteur'],
                'licence' => $ligne['licence'],
                'source' => $ligne['source'],
                'id_spr' => (int) $ligne['id_spr'],
            ]);
        }
        $this->resetSequence('images');
    }

    /**
     * @return array<string, Utilisateur> utilisateurs indexés par pseudo
     */
    private function seedUtilisateurs(): array
    {
        $comptes = [
            ['Démo', 'Compte', 'demo@dauphineo.test', 'demo'],
            ['Dupont', 'Jean', 'jean.dupont@dauphineo.test', 'jeandupont'],
            ['Durand', 'Claire', 'claire.durand@dauphineo.test', 'clairedu'],
            ['Lefèvre', 'Sophie', 'sophie.lefevre@dauphineo.test', 'sophiel'],
        ];

        $utilisateurs = [];
        foreach ($comptes as [$nom, $prenom, $email, $pseudo]) {
            $utilisateurs[$pseudo] = Utilisateur::create([
                'nom' => $nom,
                'prenom' => $prenom,
                'email' => $email,
                'pseudo' => $pseudo,
                'mot_de_passe' => self::motDePasseDemo(),
                'verif_age' => true,
                'derniere_activite' => Carbon::now(),
            ]);
        }

        return $utilisateurs;
    }

    private function seedGuides(): void
    {
        foreach ($this->csv('guides.csv') as $ligne) {
            Guide::forceCreate([
                'id' => (int) $ligne['id'],
                'nom' => $ligne['nom'],
                'prenom' => $ligne['prenom'],
                'pseudo' => $ligne['pseudo'],
                'email' => $ligne['pseudo'].'@guides.dauphineo.test',
                'mot_de_passe' => self::motDePasseDemo(),
                'verif_age' => true,
                'is_certif' => $ligne['is_certif'] === 'true',
                'id_spr' => (int) $ligne['id_spr'],
            ]);
        }
        $this->resetSequence('guide');
    }

    /**
     * Un jour sur deux pour chaque guide, sur tous les créneaux de son SPR.
     * Le trigger create_visit_trigger crée la visite correspondante.
     */
    private function seedDisponibilites(): void
    {
        foreach (Guide::with('spr.creneaux')->orderBy('id')->get() as $guide) {
            for ($jour = 1; $jour <= self::JOURS_OUVERTS; $jour++) {
                if (($jour + $guide->id) % 2 !== 0) {
                    continue;
                }
                foreach ($guide->spr->creneaux as $creneau) {
                    Disponibilite::create([
                        'date_jour' => Carbon::today()->addDays($jour)->toDateString(),
                        'id_guide' => $guide->id,
                        'id_creneaux' => $creneau->id,
                    ]);
                }
            }
        }
    }

    /**
     * @param  array<string, Utilisateur>  $utilisateurs
     */
    private function seedAvis(array $utilisateurs): void
    {
        foreach ($this->csv('avis.csv') as $ligne) {
            Avis::create([
                'titre' => $ligne['titre'],
                'commentaire' => $ligne['commentaire'],
                'note' => (int) $ligne['note'],
                'id_utilisateur' => $utilisateurs[$ligne['pseudo']]->id,
                'id_spr' => (int) $ligne['id_spr'],
            ]);
        }
    }

    /**
     * Quelques réservations pour alimenter « les plus réservés ».
     *
     * @param  array<string, Utilisateur>  $utilisateurs
     */
    private function seedReservations(array $utilisateurs): void
    {
        $demandes = [
            ['jeandupont', 18, 4], ['clairedu', 18, 2], ['sophiel', 18, 3],
            ['jeandupont', 13, 2], ['sophiel', 13, 5],
            ['clairedu', 3, 2], ['demo', 3, 2],
            ['sophiel', 15, 4],
        ];

        foreach ($demandes as [$pseudo, $sprId, $taille]) {
            $visite = Spr::findOrFail($sprId)->visites()->with('disponibilite')
                ->orderBy('date_visite')->orderBy('id')->firstOrFail();

            // Le trigger trigger_reserve_visit_capacity retire les places de la visite
            Reservation::create([
                'prix' => $taille * Reservation::PRIX_PAR_PERSONNE,
                'taille' => $taille,
                'id_utilisateur' => $utilisateurs[$pseudo]->id,
                'id_visite' => $visite->id,
                'id_spr' => $sprId,
                'id_guide' => $visite->disponibilite->id_guide,
            ]);
        }
    }

    /**
     * @return list<array<string, string>>
     */
    private function csv(string $fichier): array
    {
        $handle = fopen(database_path('data/'.$fichier), 'r');
        $entete = fgetcsv($handle, separator: ';', escape: '');
        $lignes = [];
        while (($valeurs = fgetcsv($handle, separator: ';', escape: '')) !== false) {
            if ($valeurs === [null]) {
                continue;
            }
            $lignes[] = array_combine($entete, $valeurs);
        }
        fclose($handle);

        return $lignes;
    }

    /** Les id viennent des CSV : la séquence doit repartir après le plus grand. */
    private function resetSequence(string $table): void
    {
        DB::statement("SELECT setval(pg_get_serial_sequence('$table', 'id'), (SELECT MAX(id) FROM $table))");
    }
}
