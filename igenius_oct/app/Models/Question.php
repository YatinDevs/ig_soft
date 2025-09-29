<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    protected $fillable = [
        'question_set_id', 'question_type_id', 'question_number',
        'digits', 'operators', 'answer', 'time_limit'
    ];
    
    protected $casts = [
        'digits' => 'array',
        'operators' => 'array',
    ];
    
    public function questionSet(): BelongsTo
    {
        return $this->belongsTo(QuestionSet::class);
    }
    
    public function questionType(): BelongsTo
    {
        return $this->belongsTo(QuestionType::class);
    }

    public function examAnswers(): HasMany
    {
        return $this->hasMany(ExamAnswer::class);
    }

    // Calculate operations types based on operators
    protected function calculatedTypes(): Attribute
    {
        return Attribute::make(
            get: function () {
                $operators = $this->operators ?? [];
                $types = [];
                
                if (in_array('+', $operators) || in_array('-', $operators)) {
                    if (in_array('+', $operators) && in_array('-', $operators)) {
                        $types[] = 'Addition & Subtraction';
                    } elseif (in_array('+', $operators)) {
                        $types[] = 'Addition';
                    } elseif (in_array('-', $operators)) {
                        $types[] = 'Subtraction';
                    }
                }
                
                if (in_array('*', $operators) || in_array('/', $operators)) {
                    if (in_array('*', $operators) && in_array('/', $operators)) {
                        $types[] = 'Multiplication & Division';
                    } elseif (in_array('*', $operators)) {
                        $types[] = 'Multiplication';
                    } elseif (in_array('/', $operators)) {
                        $types[] = 'Division';
                    }
                }
                
                return empty($types) ? ['Mixed Operations'] : $types;
            }
        );
    }

    // Format the question as a string
    public function getFormattedQuestionAttribute(): string
    {
        $question = '';
        $digits = $this->digits ?? [];
        $operators = $this->operators ?? [];
        
        foreach ($digits as $index => $digit) {
            $question .= $digit;
            if (isset($operators[$index])) {
                $question .= ' ' . $operators[$index] . ' ';
            }
        }
        
        return trim($question);
    }
}