<?php

namespace App\Providers;

use Anthropic\Client;
use App\Services\Recommandation\ClaudeRecommender;
use App\Services\Recommandation\LocalRecommender;
use App\Services\RecommandationService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Sans clé API, la recommandation passe directement par le moteur local
        $this->app->singleton(RecommandationService::class, function ($app) {
            $cle = config('services.anthropic.key');

            $claude = filled($cle) ? new ClaudeRecommender(
                new Client(apiKey: $cle, requestOptions: ['timeout' => 15, 'maxRetries' => 1]),
                config('services.anthropic.model'),
            ) : null;

            return new RecommandationService($app->make(LocalRecommender::class), $claude);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Mêmes règles que les formulaires du site : 8 caractères, une majuscule, une minuscule,
        // un chiffre et un caractère spécial
        Password::defaults(fn () => Password::min(8)->mixedCase()->numbers()->symbols());

        // Écritures d'un compte connecté (avis, réservations, profil) : sans limite, un script pourrait
        // bloquer toutes les places ou essayer des mots de passe actuels en boucle
        RateLimiter::for('ecriture', fn (Request $request) => Limit::perMinute(20)->by($request->user()?->id ?: $request->ip()));
    }
}
