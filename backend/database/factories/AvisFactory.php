<?php

namespace Database\Factories;

use App\Models\Spr;
use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Avis>
 */
class AvisFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titre' => fake()->sentence(),
            'commentaire' => fake()->paragraph(),
            'note' => fake()->numberBetween(1, 5),
            'id_utilisateur' => Utilisateur::inRandomOrder()->first()->id ?? Utilisateur::factory()->create()->id,
            'id_spr' => Spr::inRandomOrder()->first()->id ?? Spr::factory()->create()->id,
        ];
    }
}
