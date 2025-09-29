<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\QuestionType;

class QuestionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['name' => 'Addition', 'slug' => 'addition'],
            ['name' => 'Subtraction', 'slug' => 'subtraction'],
            ['name' => 'Multiplication', 'slug' => 'multiplication'],
            ['name' => 'Division', 'slug' => 'division'],
            ['name' => 'Mixed Operations', 'slug' => 'mixed'],
        ];

        foreach ($types as $type) {
            QuestionType::create($type);
        }
    }
}
