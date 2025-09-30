<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Level;
use App\Models\Week;
use Illuminate\Http\Request;

class LevelController extends Controller
{
    public function index()
    {
        try {
            $levels = Level::withCount(['weeks' => function ($query) {
                    $query->whereHas('questionSets', function ($q) {
                        $q->where('is_active', true);
                    });
                }])
                ->orderBy('order')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $levels
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch levels'
            ], 500);
        }
    }

    public function show($levelId)
    {
        try {
            $level = Level::findOrFail($levelId);
            
            $level->load(['weeks' => function ($query) {
                $query->whereHas('questionSets', function ($q) {
                    $q->where('is_active', true);
                })->withCount(['questionSets' => function ($q) {
                    $q->where('is_active', true);
                }]);
            }]);

            return response()->json([
                'success' => true,
                'data' => $level
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Level not found'
            ], 404);
        }
    }

    public function weeks($levelId)
    {
        try {
            $level = Level::findOrFail($levelId);
            
            $weeks = $level->weeks()
                ->whereHas('questionSets', function ($query) use ($levelId) {
                    $query->where('level_id', $levelId)
                          ->where('is_active', true);
                })
                ->withCount(['questionSets' => function ($query) use ($levelId) {
                    $query->where('level_id', $levelId)
                          ->where('is_active', true);
                }])
                ->orderBy('number')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $weeks,
                'message' => 'Weeks for level retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Level not found'
            ], 404);
        }
    }

    /**
     * Get question sets for a specific week
     */
    public function questionSets($levelId, $weekId)
    {
        try {
            $level = Level::findOrFail($levelId);
            $week = Week::where('id', $weekId)
                        ->where('level_id', $levelId)
                        ->firstOrFail();
            
            $questionSets = $week->questionSets()
                ->where('level_id', $levelId)
                ->where('is_active', true)
                ->orderBy('order')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $questionSets,
                'message' => 'Question sets retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Question sets not found'
            ], 404);
        }
    }
}