<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany; // Add this import

class QuestionType extends Model
{
    protected $fillable = ['name', 'slug'];
    
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

     public function questionSets(): BelongsToMany
    {
        return $this->belongsToMany(QuestionSet::class, 'question_set_types')
            ->withPivot('order')
            ->withTimestamps();
    }
}