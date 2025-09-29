<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Level;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = [
            ['name' => '1st Level', 'slug' => '1st-level', 'order' => 1, 'description' => 'Beginner level'],
            ['name' => '2nd Level', 'slug' => '2nd-level', 'order' => 2, 'description' => 'Elementary level'],
            ['name' => '3rd Level', 'slug' => '3rd-level', 'order' => 3, 'description' => 'Intermediate level'],
            ['name' => '4th Level', 'slug' => '4th-level', 'order' => 4, 'description' => 'Advanced level'],
            ['name' => '5th Level', 'slug' => '5th-level', 'order' => 5, 'description' => 'Expert level'],
            ['name' => '6th Level', 'slug' => '6th-level', 'order' => 6, 'description' => 'Master level'],
        ];

        foreach ($levels as $level) {
            Level::create($level);
        }
    }
}
