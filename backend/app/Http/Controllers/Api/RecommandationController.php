<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Recommandation\Preferences;
use App\Services\RecommandationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RecommandationController extends Controller
{
    public function __construct(private readonly RecommandationService $service) {}

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'taille_groupe' => 'required|integer|between:1,20',
            'interets' => 'required|array|min:1',
            'interets.*' => ['string', Rule::in(Preferences::THEMES)],
            'cadre' => ['required', Rule::in(Preferences::CADRES)],
            'duree' => ['required', Rule::in(Preferences::DUREES)],
            'pmr' => 'required|boolean',
            'langue' => ['sometimes', Rule::in(Preferences::LANGUES)],
        ]);

        $resultat = $this->service->recommander(Preferences::fromArray($donnees));

        return response()->json($resultat);
    }
}
