<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Week extends Model
{
    protected $fillable = ['number', 'name'];

    public function questionSets(): HasMany
    {
        return $this->hasMany(QuestionSet::class);
    }

    public function levels(): BelongsToMany
    {
        return $this->belongsToMany(Level::class, 'question_sets')
            ->withPivot('name', 'set_number', 'total_questions', 'time_limit', 'is_active')
            ->withTimestamps()
            ->distinct();
    }
}