<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('question_set_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_set_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_type_id')->constrained();
            $table->integer('order')->default(0);
            $table->timestamps();
            
            $table->unique(['question_set_id', 'question_type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('question_set_types');
    }
};