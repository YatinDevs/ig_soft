<?php

namespace App\Filament\Resources;

use App\Filament\Resources\QuestionResource\Pages;
use App\Filament\Resources\QuestionResource\RelationManagers;
use App\Models\Question;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class QuestionResource extends Resource
{
    protected static ?string $model = Question::class;

    protected static ?string $navigationIcon = 'heroicon-o-question-mark-circle';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('question_set_id')
                    ->relationship('questionSet', 'name')
                    ->required() ->live()
                    ->afterStateUpdated(fn ($state, Forms\Set $set) => $set('question_type_id', null)),

                Forms\Components\Select::make('question_type_id')
                    ->relationship(
                        name: 'questionType',
                        titleAttribute: 'name',
                        modifyQueryUsing: function ($query, Forms\Get $get) {
                            $questionSetId = $get('question_set_id');
                            if (!$questionSetId) {
                                return $query;
                            }
                            return $query->whereHas('questionSets', function ($q) use ($questionSetId) {
                                $q->where('question_sets.id', $questionSetId);
                            });
                        }
                    )
                    ->required()
                    ->label('Question Type')
                    ->helperText('Only types allowed for the selected question set are shown'),
                
                Forms\Components\TextInput::make('question_number')
                    ->required()
                    ->numeric(),
                Forms\Components\Repeater::make('digits')
                    ->schema([
                        Forms\Components\TextInput::make('digit')
                            ->numeric()
                            ->required(),
                    ])
                    ->minItems(2)
                    ->columnSpanFull(),
                Forms\Components\Repeater::make('operators')
                      ->schema([
                        Forms\Components\Select::make('operator')
                            ->options([
                                '+' => 'Addition (+)',
                                '-' => 'Subtraction (-)',
                                '*' => 'Multiplication (*)',
                                '/' => 'Division (/)',
                            ])
                            ->required(),
                    ])
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('answer')
                    ->required()
                    ->numeric()
                    ->step(0.01),
                Forms\Components\TextInput::make('time_limit')
                    ->numeric()
                    ->suffix('seconds')
                    ->helperText('Overrides set time limit if set'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('questionSet.name')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('questionType.name')
                    ->numeric()
                    ->sortable()
                    ->label('Type'),
                Tables\Columns\TextColumn::make('question_number')
                    ->numeric()
                    ->sortable()
                    ->label('Q#'),
                Tables\Columns\TextColumn::make('formatted_question')
                    ->label('Question')
                    ->html()
                    ->formatStateUsing(fn ($record) => $record->formatted_question . ' = ?'),
                Tables\Columns\TextColumn::make('answer')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('time_limit')
                    ->numeric()
                    ->suffix(' sec')
                    ->sortable() 
                    ->label('Time Limit'),
                Tables\Columns\TextColumn::make('calculated_types')
                    ->badge()
                    ->label('Operations')
                    ->formatStateUsing(fn ($record) => implode(', ', $record->calculated_types)),
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
                 Tables\Filters\SelectFilter::make('questionSet')
                    ->relationship('questionSet', 'name'),
                Tables\Filters\SelectFilter::make('questionType')
                    ->relationship('questionType', 'name'),
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
            RelationManagers\ExamAnswersRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListQuestions::route('/'),
            'create' => Pages\CreateQuestion::route('/create'),
            'edit' => Pages\EditQuestion::route('/{record}/edit'),
        ];
    }
}