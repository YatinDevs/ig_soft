<?php

namespace App\Filament\Resources\WeekResource\RelationManagers;

use App\Models\QuestionSet;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class QuestionSetsRelationManager extends RelationManager
{
    protected static string $relationship = 'questionSets';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('level_id')
                    ->relationship('level', 'name')
                    ->required(),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('set_number')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('total_questions')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('time_limit')
                    ->required()
                    ->numeric()
                    ->suffix('seconds'),
                Forms\Components\Toggle::make('is_active')
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('level.name'),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('set_number')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_questions')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('time_limit')
                    ->numeric()
                    ->suffix(' sec')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
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