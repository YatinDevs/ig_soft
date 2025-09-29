<?php

namespace App\Filament\Resources\QuestionTypeResource\RelationManagers;

use App\Models\Question;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class QuestionsRelationManager extends RelationManager
{
    protected static string $relationship = 'questions';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('question_set_id')
                    ->relationship('questionSet', 'name')
                    ->required(),
                Forms\Components\TextInput::make('question_number')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('answer')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('time_limit')
                    ->numeric()
                    ->suffix('seconds'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('questionSet.name'),
                Tables\Columns\TextColumn::make('question_number')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('answer')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('time_limit')
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