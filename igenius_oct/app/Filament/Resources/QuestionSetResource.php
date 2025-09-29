<?php

namespace App\Filament\Resources;

use App\Filament\Resources\QuestionSetResource\Pages;
use App\Filament\Resources\QuestionSetResource\RelationManagers;
use App\Models\QuestionSet;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class QuestionSetResource extends Resource
{
    protected static ?string $model = QuestionSet::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('level_id')
                    ->relationship('level', 'name')
                    ->required(),
                Forms\Components\Select::make('week_id')
                    ->relationship('week', 'number')
                    ->required()
                    ->label('Week Number'),
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
                    ->default(60)
                    ->suffix('seconds'),
                      // Add question types selection
                Forms\Components\Select::make('question_types')
                    ->relationship('questionTypes', 'name')
                    ->multiple()
                    ->preload()
                    ->required()
                    ->label('Question Types Included')
                    ->helperText('Select the types of questions this set will contain'),
                
                Forms\Components\Toggle::make('is_active')
                    ->required()
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('level.name')
                    ->numeric()
                    ->sortable()
                    ->label('Level'),
                Tables\Columns\TextColumn::make('week.number')
                    ->numeric()
                    ->sortable() 
                    ->label('Week'),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('set_number')
                    ->numeric()
                    ->sortable() 
                    ->label('Set #'),
                Tables\Columns\TextColumn::make('total_questions')
                    ->numeric()
                    ->sortable() 
                    ->label('Total Qs'),
                Tables\Columns\TextColumn::make('time_limit')
                    ->numeric()
                    ->suffix(' sec')
                    ->sortable()
                    ->label('Time Limit'),
                Tables\Columns\TextColumn::make('questionTypes.name')
                    ->label('Question Types')
                    ->badge()
                    ->colors(['primary'])
                    ->formatStateUsing(function ($record) {
                        return $record->question_types_string;
                    }),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),
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
                 // Add filters for question types
                Tables\Filters\SelectFilter::make('questionTypes')
                    ->relationship('questionTypes', 'name')
                    ->multiple()
                    ->label('Question Types'),
                
                Tables\Filters\SelectFilter::make('level')
                    ->relationship('level', 'name')
                    ->label('Level'),
                
                Tables\Filters\SelectFilter::make('week')
                    ->relationship('week', 'number')
                    ->label('Week Number'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                            
                Tables\Actions\Action::make('bulkAddQuestions')
                    ->label('Bulk Add Questions')
                    ->icon('heroicon-o-document-plus')
                    ->url(fn (QuestionSet $record): string => \App\Filament\Resources\BulkQuestionAddResource::getUrl('create', ['question_set_id' => $record->id]))
                    ->openUrlInNewTab(),
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
            RelationManagers\QuestionsRelationManager::class,
            RelationManagers\ExamsRelationManager::class,
            RelationManagers\QuestionTypesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListQuestionSets::route('/'),
            'create' => Pages\CreateQuestionSet::route('/create'),
            'edit' => Pages\EditQuestionSet::route('/{record}/edit'),
        ];
    }
}