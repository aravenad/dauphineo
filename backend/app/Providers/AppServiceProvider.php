<?php

namespace App\Providers;

use Anthropic\Client;
use App\Services\Recommandation\ClaudeRecommender;
use App\Services\Recommandation\LocalRecommender;
use App\Services\RecommandationService;
use Illuminate\Support\ServiceProvider;

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
        //
    }
}
