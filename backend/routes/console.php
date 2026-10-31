<?php

use App\Models\Utilisateur;
use Illuminate\Support\Facades\Schedule;

Schedule::command('sanctum:prune-expired --hours=24')->daily();

// RGPD : les comptes inactifs depuis trois ans sont supprimés avec leurs avis et réservations
// (suppressions en cascade). Remplace la tâche pg_cron prévue pendant la SAÉ.
Schedule::call(function () {
    Utilisateur::where('derniere_activite', '<', now()->subYears(3))->each(function (Utilisateur $utilisateur) {
        $utilisateur->tokens()->delete();
        $utilisateur->delete();
    });
})->name('supprimer-utilisateurs-inactifs')->daily();
