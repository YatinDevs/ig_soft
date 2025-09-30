// Pages/ExamFlow.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useLevelStore } from "../store/levelStore";
import LevelSelection from "./LevelSelection";
import WeekSelection from "./WeekSelection";
import QuestionSetSelection from "./QuestionSetSelection";

export const ExamFlow = ({ view = "levels" }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { clearCurrentData } = useLevelStore();

  const handleSelectLevel = (level) => {
    navigate(`/levels/${level.id}/weeks`);
  };

  const handleSelectWeek = (weekId) => {
    navigate(`/levels/${params.level}/weeks/${weekId}/questions`);
  };

  const handleSelectQuestionSet = (questionSet) => {
    console.log("Selected question set:", questionSet);
    // Navigate to exam or show modal
    // navigate(`/exam/${questionSet.id}`);
  };

  const handleBackToLevels = () => {
    clearCurrentData();
    navigate("/levels");
  };

  const handleBackToWeeks = () => {
    navigate(`/levels/${params.level}/weeks`);
  };

  const renderCurrentView = () => {
    switch (view) {
      case "levels":
        return <LevelSelection onSelectLevel={handleSelectLevel} />;
      case "weeks":
        return (
          <WeekSelection
            level={params.level}
            onSelectWeek={handleSelectWeek}
            onBack={handleBackToLevels}
          />
        );
      case "question-sets":
        return (
          <QuestionSetSelection
            levelId={params.level}
            weekId={params.week}
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
