import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LevelSelection from "./LevelSelection";
import WeekSelection from "./WeekSelection";
import QuestionSetSelection from "./QuestionSetSelection";

export const ExamFlow = ({ view = "levels" }) => {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  // Sync with URL params
  React.useEffect(() => {
    if (params.level) setCurrentLevel(params.level);
    if (params.week) setCurrentWeek(params.week);
  }, [params.level, params.week]);

  const handleSelectLevel = (level) => {
    setCurrentLevel(level);
    navigate(`/levels/${level}/weeks`);
  };

  const handleSelectWeek = (week) => {
    setCurrentWeek(week);
    navigate(`/levels/${currentLevel}/weeks/${week}/questions`);
  };

  const handleSelectQuestionSet = (questionSet) => {
    console.log("Selected question set:", questionSet);
    // Handle question set selection - you can navigate to exam or show modal
  };

  const handleBackToLevels = () => {
    setCurrentLevel(null);
    setCurrentWeek(null);
    navigate("/levels");
  };

  const handleBackToWeeks = () => {
    setCurrentWeek(null);
    navigate(`/levels/${currentLevel}/weeks`);
  };

  const renderCurrentView = () => {
    switch (view) {
      case "levels":
        return <LevelSelection onSelectLevel={handleSelectLevel} />;
      case "weeks":
        return (
          <WeekSelection
            level={currentLevel}
            onSelectWeek={handleSelectWeek}
            onBack={handleBackToLevels}
          />
        );
      case "question-sets":
        return (
          <QuestionSetSelection
            level={currentLevel}
            week={currentWeek}
            onSelectQuestionSet={handleSelectQuestionSet}
            onBack={handleBackToWeeks}
          />
        );
      default:
        return <LevelSelection onSelectLevel={handleSelectLevel} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderCurrentView()}
      </div>
    </div>
  );
};
