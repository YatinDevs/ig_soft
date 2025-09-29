<?php

namespace Database\Seeders;

use App\Models\Week;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WeekSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $weeks = [
            ['number' => 1, 'name' => '1st Week'],
            ['number' => 2, 'name' => '2nd Week'],
            ['number' => 3, 'name' => '3rd Week'],
            ['number' => 4, 'name' => '4th Week'],
        ];

        foreach ($weeks as $week) {
            Week::create($week);
        }
    }
}
