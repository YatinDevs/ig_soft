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
       Schema::create('question_sets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level_id')->constrained();
            $table->foreignId('week_id')->constrained();
            $table->string('name');
            $table->integer('set_number');
            $table->integer('total_questions');
            $table->integer('time_limit')->default(60); // in seconds
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->unique(['level_id', 'week_id', 'set_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_sets');
    }
};
