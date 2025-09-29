<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class QuestionSet extends Model
{
    protected $fillable = [
        'level_id', 'week_id', 'name', 'set_number', 
        'total_questions', 'time_limit', 'is_active'
    ];
    
     // Add this relationship
    public function questionTypes(): BelongsToMany
    {
        return $this->belongsToMany(QuestionType::class, 'question_set_types')
            ->withPivot('order')
            ->withTimestamps()
            ->orderBy('order');
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }
    
    public function week(): BelongsTo
    {
        return $this->belongsTo(Week::class);
    }
    
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }

    public function getQuestionTypesStringAttribute(): string
    {
        if ($this->questionTypes->isEmpty()) {
            return 'Mixed Operations';
        }
        
        return $this->questionTypes->pluck('name')->join(' + ');
    }
}