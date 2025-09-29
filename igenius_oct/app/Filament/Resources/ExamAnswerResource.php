<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ExamAnswerResource\Pages;
use App\Filament\Resources\ExamAnswerResource\RelationManagers;
use App\Models\ExamAnswer;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ExamAnswerResource extends Resource
{
    protected static ?string $model = ExamAnswer::class;

    protected static ?string $navigationIcon = 'heroicon-o-check-circle';

    protected static ?string $modelLabel = 'Exam Answer';

    protected static ?string $navigationLabel = 'Exam Answers';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('exam_id')
                    ->relationship('exam', 'id')
                    ->required(),
                Forms\Components\Select::make('question_id')
                    ->relationship('question', 'id')
                    ->required(),
                Forms\Components\TextInput::make('user_answer')
                    ->numeric(),
                Forms\Components\Toggle::make('is_correct')
                    ->required(),
                Forms\Components\TextInput::make('time_taken')
                    ->numeric()
                    ->suffix('seconds'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('exam.id')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('question.id')
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
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListExamAnswers::route('/'),
            'create' => Pages\CreateExamAnswer::route('/create'),
            'edit' => Pages\EditExamAnswer::route('/{record}/edit'),
        ];
    }
}