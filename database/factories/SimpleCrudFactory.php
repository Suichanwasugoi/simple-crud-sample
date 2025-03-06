<?php

namespace Database\Factories;

use App\Models\SimpleCrud;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SimpleCrud>
 */
class SimpleCrudFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = SimpleCrud::class;
    public function definition(): array
    {
        return [
            'uid' => $this->faker->unique()->numerify('######'),
            'name' => $this->faker->name(),
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'address' => $this->faker->address   
        ];
    }
}
