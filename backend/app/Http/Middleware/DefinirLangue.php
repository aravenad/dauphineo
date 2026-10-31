<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

/**
 * Le site envoie la langue choisie dans Accept-Language : messages d'erreur, validation et
 * e-mails suivent. Sans en-tête, ou pour une autre langue, l'API reste en français.
 */
class DefinirLangue
{
    public const LANGUES = ['fr', 'en'];

    public function handle(Request $request, Closure $next): Response
    {
        App::setLocale($request->getPreferredLanguage(self::LANGUES) ?? 'fr');

        $response = $next($request);
        $response->headers->set('Vary', 'Accept-Language', false);

        return $response;
    }
}
