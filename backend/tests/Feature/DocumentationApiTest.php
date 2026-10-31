<?php

use Illuminate\Support\Facades\File;

// La CI ne publie pas la documentation : ce test vérifie qu'une montée de version de l5-swagger
// ou de swagger-php sait toujours lire les annotations des contrôleurs.
it('génère la documentation OpenAPI à partir des annotations', function () {
    $dossier = storage_path('framework/testing/api-docs');
    config(['l5-swagger.defaults.paths.docs' => $dossier]);

    try {
        $this->artisan('l5-swagger:generate')->assertSuccessful();

        $doc = json_decode(File::get("{$dossier}/api-docs.json"), true);

        expect($doc['info']['title'])->toBe('Dauphineo API')
            ->and($doc['paths'])->toHaveKeys(['/api/auth/login', '/api/spr', '/api/reservations'])
            ->and(count($doc['paths']))->toBeGreaterThanOrEqual(20);
    } finally {
        File::deleteDirectory($dossier);
    }
});
