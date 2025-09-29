<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_set_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_type_id')->constrained();
            $table->integer('question_number');
            $table->json('digits');
            $table->json('operators');
            $table->decimal('answer', 10, 2);
            $table->integer('time_limit')->nullable(); // overrides set time_limit if set
            $table->timestamps();
            
            $table->unique(['question_set_id', 'question_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
