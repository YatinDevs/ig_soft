<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\QuestionSet;
use App\Models\ExamAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExamController extends Controller
{
    public function startExam(Request $request)
    {
        $request->validate([
            'question_set_id' => 'required|exists:question_sets,id'
        ]);

        $questionSet = QuestionSet::findOrFail($request->question_set_id);

        $exam = Exam::create([
            'user_id' => "1",
            'question_set_id' => $questionSet->id,
            'started_at' => now(),
            'metadata' => [
                'level_name' => $questionSet->level->name,
                'week_name' => $questionSet->week->name,
                'set_name' => $questionSet->name
            ]
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'exam' => $exam,
                'first_question' => $questionSet->questions()->orderBy('question_number')->first()
            ]
        ]);
    }

    public function submitAnswer(Request $request, Exam $exam)
    {
        $request->validate([
            'question_id' => 'required|exists:questions,id',
            'user_answer' => 'required|numeric',
            'time_taken' => 'required|numeric'
        ]);

        $question = $exam->questionSet->questions()->findOrFail($request->question_id);

        $answer = ExamAnswer::create([
            'exam_id' => $exam->id,
            'question_id' => $question->id,
            'user_answer' => $request->user_answer,
            'is_correct' => $request->user_answer == $question->answer,
            'time_taken' => $request->time_taken
        ]);

        $nextQuestion = $exam->questionSet->questions()
            ->where('question_number', '>', $question->question_number)
            ->orderBy('question_number')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'answer_result' => $answer,
                'next_question' => $nextQuestion,
                'is_completed' => is_null($nextQuestion)
            ]
        ]);
    }

    public function completeExam(Exam $exam)
    {
        if ($exam->completed_at) {
            return response()->json([
                'success' => false,
                'message' => 'Exam already completed'
            ], 400);
        }

        $correctAnswers = $exam->answers()->where('is_correct', true)->count();
        $totalQuestions = $exam->questionSet->total_questions;

        $exam->update([
            'completed_at' => now(),
            'total_score' => ($correctAnswers / $totalQuestions) * 100
        ]);

        return response()->json([
            'success' => true,
            'data' => $exam->load('answers.question')
        ]);
    }

    public function getResults(Exam $exam)
    {
        return response()->json([
            'success' => true,
            'data' => $exam->load(['answers.question', 'questionSet.level', 'questionSet.week'])
        ]);
    }
}