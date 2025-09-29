<?php

namespace App\Filament\Resources\QuestionResource\RelationManagers;

use App\Models\ExamAnswer;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ExamAnswersRelationManager extends RelationManager
{
    protected static string $relationship = 'examAnswers';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('exam_id')
                    ->relationship('exam', 'id')
                    ->required(),
                Forms\Components\TextInput::make('user_answer')
                    ->required()
                    ->numeric(),
                Forms\Components\Toggle::make('is_correct')
                    ->required(),
                Forms\Components\TextInput::make('time_taken')
                    ->numeric()
                    ->suffix('seconds'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('exam.id')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('user_answer')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_correct')
                    ->boolean(),
                Tables\Columns\TextColumn::make('time_taken')
                    ->numeric()
                    ->suffix(' sec')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}