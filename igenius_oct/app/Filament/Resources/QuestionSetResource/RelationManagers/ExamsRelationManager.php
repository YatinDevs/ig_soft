<?php

namespace App\Filament\Resources\QuestionSetResource\RelationManagers;

use App\Models\Exam;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ExamsRelationManager extends RelationManager
{
    protected static string $relationship = 'exams';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                Forms\Components\DateTimePicker::make('started_at'),
                Forms\Components\DateTimePicker::make('completed_at'),
                Forms\Components\TextInput::make('total_score')
                    ->numeric(),
                Forms\Components\TextInput::make('time_taken')
                    ->numeric()
                    ->suffix('seconds'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('started_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('completed_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_score')
                    ->numeric()
                    ->sortable(),
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