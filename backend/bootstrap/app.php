<?php

use App\Http\Middleware\EnTetesSecurite;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(append: [EnTetesSecurite::class]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // L'API répond toujours en JSON, même sans en-tête Accept
        $exceptions->shouldRenderJsonWhen(fn ($request) => $request->is('api/*'));

        // Les messages par défaut de Laravel sont en anglais et nomment parfois le modèle
        // (« No query results for model ... ») : l'API les remplace par des phrases en français
        $exceptions->render(fn (AuthenticationException $e, Request $request) => $request->is('api/*')
            ? response()->json(['message' => 'Connectez-vous pour continuer.'], 401)
            : null);

        $exceptions->render(function (HttpExceptionInterface $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }
            $statut = $e->getStatusCode();
            $message = match ($statut) {
                403 => "Vous n'avez pas accès à cette ressource.",
                404 => "Cette ressource n'existe pas.",
                405 => "Cette action n'est pas possible sur cette adresse.",
                429 => 'Trop de demandes en peu de temps. Réessayez dans '.max(1, (int) ($e->getHeaders()['Retry-After'] ?? 60)).' secondes.',
                503 => 'Le service est momentanément indisponible. Réessayez dans quelques minutes.',
                default => null,
            };

            return $message ? response()->json(['message' => $message], $statut, $e->getHeaders()) : null;
        });

        // Une erreur interne garde son détail en mode débogage, mais le public ne lit jamais « Server Error »
        $exceptions->respond(function ($response, Throwable $e, Request $request) {
            if ($request->is('api/*') && $response->getStatusCode() >= 500 && ! config('app.debug')) {
                return response()->json(['message' => 'Une erreur est survenue sur le serveur. Réessayez dans quelques instants.'], $response->getStatusCode());
            }

            return $response;
        });
    })->create();
