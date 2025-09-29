<?php

namespace App\Filament\Resources\QuestionSetResource\RelationManagers;

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
                Forms\Components\Select::make('question_type_id')
                    ->relationship('questionType', 'name')
                    ->required(),
                Forms\Components\TextInput::make('question_number')
                    ->required()
                    ->numeric(),
                Forms\Components\Repeater::make('digits')
                    ->schema([
                        Forms\Components\TextInput::make('digit')
                            ->numeric()
                            ->required(),
                    ]),
                Forms\Components\Repeater::make('operators')
                    ->schema([
                        Forms\Components\Select::make('operator')
                            ->options([
                                '+' => 'Addition (+)',
                                '-' => 'Subtraction (-)',
                                '*' => 'Multiplication (*)',
                                '/' => 'Division (/)',
                            ]),
                    ]),
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
                Tables\Columns\TextColumn::make('question_number')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('questionType.name'),
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