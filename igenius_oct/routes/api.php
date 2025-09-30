<?php

use Illuminate\Http\Request;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\LevelController;
use App\Http\Controllers\API\QuestionSetController;
use App\Http\Controllers\API\ExamController;
use App\Http\Controllers\API\WeekController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    
    // Admin only routes
    Route::middleware([\App\Http\Middleware\AdminMiddleware::class])->group(function () {
        Route::get('/admin/users', [AdminController::class, 'getUsers']);
        Route::get('/admin/stats', [AdminController::class, 'getStats']);
        Route::post('/admin/users', [AdminController::class, 'createUser']); // New endpoint
        Route::put('/admin/users/{user}', [AdminController::class, 'updateUser']);
        Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser']);
    });
    

     // Your existing protected routes
    Route::get('/levels', [LevelController::class, 'index']);
    Route::get('/levels/{level}', [LevelController::class, 'show']);
    Route::get('/levels/{level}/weeks', [LevelController::class, 'weeks']);
    
    Route::get('/weeks', [WeekController::class, 'index']);
    Route::get('/weeks/{week}', [WeekController::class, 'show']);
    Route::get('/weeks/{week}/question-sets', [WeekController::class, 'questionSets']);
    Route::get('levels/{level}/weeks/{week}/question-sets', [QuestionSetController::class, 'questionSets']);
    
    Route::get('/levels/{level}/question-sets', [QuestionSetController::class, 'index']);
    Route::get('/question-sets/{questionSet}', [QuestionSetController::class, 'show']);
    
    Route::post('/exams/start', [ExamController::class, 'startExam']);
    Route::post('/exams/{exam}/submit-answer', [ExamController::class, 'submitAnswer']);
    Route::post('/exams/{exam}/complete', [ExamController::class, 'completeExam']);
    Route::get('/exams/{exam}/results', [ExamController::class, 'getResults']);
    // Test secured route
    Route::get('/secured-data', function () {
        return response()->json([
            'message' => 'This is secured data!',
            'user' => auth()->user()
        ]);
    });
});

// Public test route
Route::get('/public-data', function () {
    return response()->json([
        'message' => 'This is public data! Anyone can access this.'
    ]);
});