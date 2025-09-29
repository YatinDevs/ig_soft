import { useState, useEffect } from "react";

export const useQuestionNavigation = (questions, onComplete) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalSteps = currentQuestion.digits.length * 2 - 1;

  const startSet = () => {
    setIsPlaying(true);
    setCurrentQuestionIndex(0);
    setCurrentStep(0);
    setIsComplete(false);
    setShowSummary(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleNext = () => {
    if (showSummary) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentStep(0);
    } else {
      setShowSummary(true);
    }
  };

  useEffect(() => {
    let timer;
    if (isAutoPlaying && isPlaying && !isComplete) {
      const delay = 1000 / playbackSpeed;
      timer = setTimeout(() => {
        handleNext();
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, isPlaying, currentStep, showSummary, playbackSpeed]);

  return {
    currentQuestionIndex,
    currentStep,
    isPlaying,
    isAutoPlaying,
    playbackSpeed,
    isComplete,
    showSummary,
    currentQuestion,
    totalSteps,
    startSet,
    toggleAutoPlay,
    handleNext,
    setPlaybackSpeed,
    setIsPlaying,
  };
};
