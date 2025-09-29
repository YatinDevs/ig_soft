<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Level extends Model
{
    protected $fillable = ['name', 'slug', 'order', 'description'];

    public function questionSets(): HasMany
    {
        return $this->hasMany(QuestionSet::class);
    }

    public function weeks(): BelongsToMany
    {
        return $this->belongsToMany(Week::class, 'question_sets')
            ->withPivot('name', 'set_number', 'total_questions', 'time_limit', 'is_active')
            ->withTimestamps()
            ->distinct();
    }
}