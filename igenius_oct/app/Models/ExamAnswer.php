<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamAnswer extends Model
{
    protected $fillable = [
        'exam_id', 'question_id', 'user_answer', 
        'is_correct', 'time_taken'
    ];
    
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }
    
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}