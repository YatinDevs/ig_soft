<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\QuestionSet;

class QuestionSetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sets = [
            [
                'level_id' => 1,
                'week_id' => 1,
                'name' => '1st Level 1st Week-QS1',
                'set_number' => 1,
                'total_questions' => 6,
                'time_limit' => 30,
                'is_active' => true,
            ],
            [
                'level_id' => 2,
                'week_id' => 1,
                'name' => '2nd Level 1st Week-QS1',
                'set_number' => 1,
                'total_questions' => 5,
                'time_limit' => 25,
                'is_active' => true,
            ],
            [
                'level_id' => 5,
                'week_id' => 1,
                'name' => '5th & 6th Level 1st Week-QS1',
                'set_number' => 1,
                'total_questions' => 10,
                'time_limit' => 20,
                'is_active' => true,
            ],
        ];

        foreach ($sets as $set) {
            QuestionSet::create($set);
        }
    }
}
