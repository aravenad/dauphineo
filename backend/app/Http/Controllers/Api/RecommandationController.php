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
            'interets.*' => ['string', Rule::in(Preferences::INTERETS)],
            'duree' => ['required', Rule::in(Preferences::DUREES)],
            'pmr' => 'required|boolean',
            'experiences' => 'required|array|min:1',
            'experiences.*' => ['string', Rule::in(Preferences::EXPERIENCES)],
        ]);

        $resultat = $this->service->recommander(Preferences::fromArray($donnees));

        return response()->json($resultat);
    }
}
