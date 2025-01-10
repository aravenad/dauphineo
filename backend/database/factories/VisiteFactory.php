<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Visite>
 * @author nael
 */
class VisiteFactory extends Factory
{
    /**
     * Define the model's default state for a visite. 
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'capacite_actuelle' => $this->faker->randomNumber(2),
            'capacite_max' => $this->faker->randomNumber(2),
            'date_visite' => $this->faker->date(),
            'id_spr' => $this->faker->NumberBetween(1, 20),
            'id_disponibilite' => $this->faker->numberBetween(1,2)
        ];
    }
}
