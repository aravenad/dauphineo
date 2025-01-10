<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Création des types ENUM
        DB::statement("CREATE TYPE statut_reservation AS ENUM ('confirmee', 'annulee', 'termine')");
        DB::statement("CREATE TYPE statut_paiement AS ENUM ('payee', 'non_reglee', 'en_attente')");

        // Création de la table SPR
        Schema::create('spr', function (Blueprint $table) {
            $table->id();
            $table->integer('code_departement')->notNullable();
            $table->string('nom_du_departement', 100)->notNullable();
            $table->string('nom_commune', 100)->notNullable();
            $table->integer('capacite_de_visite')->notNullable();
            $table->text('mot_cle')->notNullable();
            $table->boolean('is_pmr')->notNullable();
            $table->time('temps_de_visite')->notNullable();
        });

        // Création de la table IMAGES
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->string('image_url', 500)->notNullable();
            $table->foreignId('id_spr')->constrained('spr');
        });

        // Création de la table UTILISATEUR
        Schema::create('utilisateur', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 50)->notNullable();
            $table->string('prenom', 50)->notNullable();
            $table->string('mot_de_passe', 255)->notNullable();
            $table->string('email', 255)->unique()->notNullable();
            $table->string('pseudo', 50)->unique()->notNullable();
            $table->boolean('verif_age')->notNullable();
            $table->timestamp('derniere_activite')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // Création de la table GUIDE
        Schema::create('guide', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 50)->notNullable();
            $table->string('prenom', 50)->notNullable();
            $table->string('mot_de_passe', 255)->notNullable();
            $table->string('email', 255)->unique()->notNullable();
            $table->string('pseudo', 50)->unique()->notNullable();
            $table->boolean('verif_age')->notNullable();
            $table->timestamp('derniere_activite')->nullable();
            $table->boolean('is_certif')->default(false)->notNullable();
            $table->rememberToken();
            $table->timestamps();
            $table->foreignId('id_spr')->constrained('spr');
        });

        // Création de la table CRENEAUX
        Schema::create('creneaux', function (Blueprint $table) {
            $table->id();
            $table->time('heure_debut')->notNullable();
            $table->time('heure_fin')->notNullable();
            $table->foreignId('id_spr')->constrained('spr')->onDelete('cascade');
        });

        // Création de la table DISPONIBILITE
        Schema::create('disponibilite', function (Blueprint $table) {
            $table->id();
            $table->date('date_jour')->notNullable();
            $table->foreignId('id_guide')->constrained('guide')->onDelete('cascade');
            $table->foreignId('id_creneaux')->constrained('creneaux')->onDelete('cascade');
        });

        // Création de la table VISITE
        Schema::create('visite', function (Blueprint $table) {
            $table->id();
            $table->integer('capacite_actuelle')->notNullable();
            $table->integer('capacite_max')->notNullable();
            $table->date('date_visite')->notNullable();
            $table->foreignId('id_spr')->constrained('spr')->onDelete('cascade');
            $table->foreignId('id_disponibilite')->constrained('disponibilite')->onDelete('cascade');
        });

        // Création de la table RESERVATION
        Schema::create('reservation', function (Blueprint $table) {
            $table->id();
            $table->double('prix')->notNullable();
            $table->integer('taille')->notNullable();
            $table->foreignId('id_utilisateur')->constrained('utilisateur')->onDelete('cascade');
            $table->foreignId('id_visite')->constrained('visite')->onDelete('cascade');
            $table->foreignId('id_spr')->constrained('spr')->onDelete('cascade');
            $table->foreignId('id_guide')->constrained('guide')->onDelete('cascade');
            $table->timestamps();
        });

        DB::statement("ALTER TABLE reservation ADD statut_reservation statut_reservation NOT NULL DEFAULT 'confirmee'");
        DB::statement("ALTER TABLE reservation ADD statut_paiement statut_paiement NOT NULL DEFAULT 'en_attente'");

        // Création de la table AVIS
        Schema::create('avis', function (Blueprint $table) {
            $table->id();
            $table->text('titre')->notNullable();
            $table->text('commentaire')->notNullable();
            $table->integer('note')->notNullable()->check('note >= 1 AND note <= 5');
            $table->timestamp('date_de_publication')->notNullable();
            $table->foreignId('id_utilisateur')->constrained('utilisateur')->onDelete('cascade');
            $table->foreignId('id_spr')->constrained('spr')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avis');
        Schema::dropIfExists('reservation');
        Schema::dropIfExists('visite');
        Schema::dropIfExists('disponibilite');
        Schema::dropIfExists('creneaux');
        Schema::dropIfExists('guide');
        Schema::dropIfExists('utilisateur');
        Schema::dropIfExists('image');
        Schema::dropIfExists('spr');
        DB::statement("DROP TYPE statut_reservation");
        DB::statement("DROP TYPE statut_paiement");
        DB::statement("DROP TYPE statut_avis");
    }
};