<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\QuestionSet;
use App\Models\Week;
use Illuminate\Http\Request;

class QuestionSetController extends Controller
{
    public function index(Level $level)
    {
        $questionSets = QuestionSet::with(['level', 'week', 'questionTypes', 'questions.questionType'])
            ->where('level_id', $level->id)
            ->where('is_active', true)
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $questionSets,
            'message' => 'Question sets retrieved successfully'
        ]);
    }

    public function show(QuestionSet $questionSet)
    {
        $questionSet->load(['level', 'week', 'questionTypes', 'questions.questionType']);
        
        return response()->json([
            'success' => true,
            'data' => $questionSet,
            'message' => 'Question set retrieved successfully'
        ]);
    }

    public function byWeek(Week $week)
    {
        $questionSets = QuestionSet::with(['level', 'questionTypes', 'questions' => function ($query) {
                $query->orderBy('question_number');
            }])
            ->where('week_id', $week->id)
            ->where('is_active', true)
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $questionSets,
            'message' => 'Question sets for week retrieved successfully'
        ]);
    }
}