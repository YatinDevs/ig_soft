<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Level;
use Illuminate\Http\Request;

class LevelController extends Controller
{
    public function index()
    {
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
    }

    public function show(Level $level)
    {
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
    }

    /**
     * Get all weeks for a specific level
     */
    public function weeks(Level $level)
    {
        $weeks = $level->weeks()
            ->whereHas('questionSets', function ($query) use ($level) {
                $query->where('level_id', $level->id)
                      ->where('is_active', true);
            })
            ->withCount(['questionSets' => function ($query) use ($level) {
                $query->where('level_id', $level->id)
                      ->where('is_active', true);
            }])
            ->orderBy('number')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $weeks,
            'message' => 'Weeks for level retrieved successfully'
        ]);
    }
}