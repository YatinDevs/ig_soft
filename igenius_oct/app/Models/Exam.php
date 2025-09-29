<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    protected $fillable = [
        'user_id', 'question_set_id', 'started_at', 
        'completed_at', 'total_score', 'time_taken', 'metadata'
    ];
    
    protected $casts = [
        'metadata' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    public function questionSet(): BelongsTo
    {
        return $this->belongsTo(QuestionSet::class);
    }
    
    public function answers(): HasMany
    {
        return $this->hasMany(ExamAnswer::class);
    }
}