<?php

namespace App\Filament\Resources\QuestionSetResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class QuestionTypesRelationManager extends RelationManager
{
    protected static string $relationship = 'questionTypes';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('question_type_id')
                    ->relationship('questionType', 'name')
                    ->required()
                    ->label('Question Type'),
                
                Forms\Components\TextInput::make('order')
                    ->numeric()
                    ->default(0)
                    ->required()
                    ->label('Display Order'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('questionType.name')
                    ->label('Question Type')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('order')
                    ->numeric()
                    ->sortable()
                    ->label('Order'),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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