<?php

namespace Database\Seeders;
use App\Models\Question;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $firstLevelQuestions = [
            [
                'question_set_id' => 1,
                'question_type_id' => 1, // Addition
                'question_number' => 1,
                'digits' => [35, 4, 5, 1, 2],
                'operators' => ['+', '-', '+', '+'],
                'answer' => 37,
                'time_limit' => 30,
            ],
            [
                'question_set_id' => 1,
                'question_type_id' => 1,
                'question_number' => 2,
                'digits' => [22, 2, 1, 3, 1],
                'operators' => ['+', '+', '+', '+'],
                'answer' => 29,
                'time_limit' => 30,
            ],
            [
                'question_set_id' => 1,
                'question_type_id' => 2, // Subtraction
                'question_number' => 3,
                'digits' => [62, 12, 4, 1, 5],
                'operators' => ['-', '+', '+', '-'],
                'answer' => 50,
                'time_limit' => 30,
            ],
            [
                'question_set_id' => 1,
                'question_type_id' => 1,
                'question_number' => 4,
                'digits' => [52, 15, 5, 2, 1],
                'operators' => ['+', '-', '+', '+'],
                'answer' => 65,
                'time_limit' => 30,
            ],
            [
                'question_set_id' => 1,
                'question_type_id' => 1,
                'question_number' => 5,
                'digits' => [74, 1, 3, 5, 1],
                'operators' => ['+', '+', '-', '+'],
                'answer' => 74,
                'time_limit' => 30,
            ],
            [
                'question_set_id' => 1,
                'question_type_id' => 1,
                'question_number' => 6,
                'digits' => [23, 15, 5, 1, 1],
                'operators' => ['+', '-', '+', '+'],
                'answer' => 35,
                'time_limit' => 30,
            ],
        ];

        // 2nd Level Questions
        $secondLevelQuestions = [
            [
                'question_set_id' => 2,
                'question_type_id' => 5, // Mixed
                'question_number' => 1,
                'digits' => [52, 35, 85, 95, 55],
                'operators' => ['+', '-', '+', '+'],
                'answer' => 152,
                'time_limit' => 25,
            ],
            [
                'question_set_id' => 2,
                'question_type_id' => 5,
                'question_number' => 2,
                'digits' => [95, 45, 59, 40, 30],
                'operators' => ['-', '+', '+', '+'],
                'answer' => 179,
                'time_limit' => 25,
            ],
            [
                'question_set_id' => 2,
                'question_type_id' => 5,
                'question_number' => 3,
                'digits' => [54, 14, 21, 25, 45],
                'operators' => ['+', '+', '-', '+'],
                'answer' => 109,
                'time_limit' => 25,
            ],
            [
                'question_set_id' => 2,
                'question_type_id' => 5,
                'question_number' => 4,
                'digits' => [82, 13, 20, 83, 40],
                'operators' => ['+', '-', '+', '+'],
                'answer' => 198,
                'time_limit' => 25,
            ],
            [
                'question_set_id' => 2,
                'question_type_id' => 5,
                'question_number' => 5,
                'digits' => [24, 21, 60, 90, 35],
                'operators' => ['+', '+', '+', '-'],
                'answer' => 160,
                'time_limit' => 25,
            ],
        ];

        // 5th & 6th Level Questions
        $advancedLevelQuestions = [
            [
                'question_set_id' => 3,
                'question_type_id' => 5,
                'question_number' => 1,
                'digits' => [1234, 1121, 2134, 1222, 2121],
                'operators' => ['-', '+', '+', '-'],
                'answer' => 1348,
                'time_limit' => 20,
            ],
            [
                'question_set_id' => 3,
                'question_type_id' => 5,
                'question_number' => 2,
                'digits' => [4352, 2134, 1265, 1122, 3175],
                'operators' => ['-', '+', '-', '+'],
                'answer' => 5536,
                'time_limit' => 20,
            ],
            [
                'question_set_id' => 3,
                'question_type_id' => 5,
                'question_number' => 3,
                'digits' => [5436, 2354, 1232, 4532, 4123],
                'operators' => ['-', '+', '-', '+'],
                'answer' => 3905,
                'time_limit' => 20,
            ],
            [
                'question_set_id' => 3,
                'question_type_id' => 5,
                'question_number' => 4,
                'digits' => [2132, 1567, 1657, 3214, 2122],
                'operators' => ['+', '-', '+', '-'],
                'answer' => 3134,
                'time_limit' => 20,
            ],
            [
                'question_set_id' => 3,
                'question_type_id' => 5,
                'question_number' => 5,
                'digits' => [5678, 4323, 1786, 2135, 1896],
                'operators' => ['-', '+', '+', '-'],
                'answer' => 3380,
                'time_limit' => 20,
            ],
            [
                'question_set_id' => 3,
                'question_type_id' => 5,
                'question_number' => 6,
                'digits' => [5643, 2134, 2122, 7121, 6543],
                'operators' => ['-', '+', '+', '-'],
                'answer' => 6209,
                'time_limit' => 20,
            ],
            [
                'question_set_id' => 3,
                'question_type_id' => 5,
                'question_number' => 7,
                'digits' => [4563, 3124, 1253, 3241, 1254],
                'operators' => ['-', '+', '+', '-'],
                'answer' => 4679,
                'time_limit' => 20,
            ],
            [
                'question_set_id' => 3,
                'question_type_id' => 5,
                'question_number' => 8,
                'digits' => [6754, 3452, 1925, 2134, 2210],
                'operators' => ['-', '+', '+', '-'],
                'answer' => 5151,
                'time_limit' => 20,
            ],
            [
                'question_set_id' => 3,
                'question_type_id' => 5,
                'question_number' => 9,
                'digits' => [2134, 4566, 5134, 7187, 5234],
                'operators' => ['+', '-', '+', '-'],
                'answer' => 3519,
                'time_limit' => 20,
            ],
            [
                'question_set_id' => 3,
                'question_type_id' => 5,
                'question_number' => 10,
                'digits' => [4563, 1212, 7685, 3452, 1283],
                'operators' => ['+', '-', '+', '+'],
                'answer' => 2825,
                'time_limit' => 20,
            ],
        ];

        // Insert all questions
        foreach (array_merge($firstLevelQuestions, $secondLevelQuestions, $advancedLevelQuestions) as $question) {
            Question::create($question);
        }
    }
}
