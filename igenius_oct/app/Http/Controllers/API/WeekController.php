<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Week;
use App\Models\Level;
use Illuminate\Http\Request;

class WeekController extends Controller
{
    /**
 * Get all weeks for a specific level
 */
public function byLevel(Level $level)
{
    $weeks = Week::select('weeks.*')
        ->join('question_sets', 'question_sets.week_id', '=', 'weeks.id')
        ->where('question_sets.level_id', $level->id)
        ->where('question_sets.is_active', true)
        ->withCount(['questionSets' => function ($query) use ($level) {
            $query->where('level_id', $level->id)
                  ->where('is_active', true);
        }])
        ->groupBy('weeks.id')
        ->orderBy('weeks.number')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $weeks,
        'message' => 'Weeks retrieved successfully'
    ]);
}

    /**
     * Get all question sets for a specific week
     */
    public function questionSets(Week $week)
    {
        $questionSets = $week->questionSets()
            ->with(['level', 'questionTypes', 'questions' => function ($query) {
                $query->orderBy('question_number');// Preview first 3 questions
            }])
            ->where('is_active', true)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $questionSets,
            'message' => 'Question sets for week retrieved successfully'
        ]);
    }

    /**
     * Get all weeks (for debugging or admin purposes)
     */
    public function index()
    {
        $weeks = Week::withCount('questionSets')
            ->orderBy('number')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $weeks,
            'message' => 'All weeks retrieved successfully'
        ]);
    }

    /**
     * Get specific week details
     */
    public function show(Week $week)
    {
        $week->load(['questionSets.level', 'questionSets.questionTypes']);

        return response()->json([
            'success' => true,
            'data' => $week,
            'message' => 'Week retrieved successfully'
        ]);
    }
}