import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestionNavigation } from "../../hooks/useQuestionNavigation";
import { useSpeech } from "../../hooks/useSpeech";
import { QuestionDisplay } from "./QuestionDisplay";
import { Controls } from "./Controls";
import { ProgressBar } from "./ProgressBar";

export const QuestionProctorDemo3 = ({ questionSets, onComplete }) => {
  // Combine all questions from all selected sets
  const allQuestions = useMemo(() => {
    return questionSets.flatMap((qs) => qs.questions);
  }, [questionSets]);

  const {
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
  } = useQuestionNavigation(allQuestions, onComplete);

  const { speak } = useSpeech(true);

  // Add set information to the header
  const getCurrentSetInfo = () => {
    const currentQuestion = allQuestions[currentQuestionIndex];
    const currentSet = questionSets.find((qs) =>
      qs.questions.some((q) => q.id === currentQuestion.id)
    );

    return {
      setName: currentSet?.name || "",
      setNumber: currentSet?.set_number || 0,
      currentSetIndex:
        questionSets.findIndex((qs) =>
          qs.questions.some((q) => q.id === currentQuestion.id)
        ) + 1,
      totalSets: questionSets.length,
    };
  };

  useEffect(() => {
    if (!isPlaying || showSummary) return;

    let textToSpeak = "";

    if (currentStep === 0) {
      textToSpeak = `Question ${currentQuestionIndex + 1}.`;
    } else {
      const currentDigitIndex = Math.floor(currentStep / 2);
      const isOperatorStep = currentStep % 2 === 1;

      if (
        isOperatorStep &&
        currentDigitIndex < currentQuestion.operators.length
      ) {
        textToSpeak = currentQuestion.operators[currentDigitIndex];
      } else if (currentDigitIndex < currentQuestion.digits.length) {
        textToSpeak = currentQuestion.digits[currentDigitIndex]
          .toString()
          .split("")
          .join(" ");
      }
    }

    if (textToSpeak) speak(textToSpeak, { rate: playbackSpeed });
  }, [currentStep, currentQuestionIndex, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep === totalSteps && !showSummary) {
      setTimeout(() => {
        speak("Next question.", { rate: playbackSpeed });
      }, 1000 / playbackSpeed);
    }

    if (showSummary) {
      const summaryText = allQuestions
        .map((q, i) => `Question ${i + 1} answer was ${q.answer}.`)
        .join(" ");

      speak(`Set completed. ${summaryText}`, {
        rate: playbackSpeed * 0.9,
      });
    }
  }, [currentStep, showSummary]);

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <StartButton onStart={startSet} />
      </div>
    );
  }

  if (isComplete) {
    return <CompletionScreen onComplete={onComplete} />;
  }

  const setInfo = getCurrentSetInfo();

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-12">
      <QuestionHeader
        currentQuestionIndex={currentQuestionIndex}
        questionSets={questionSets}
        currentQuestion={currentQuestion}
        setInfo={setInfo}
      />

      <div className="min-h-48 flex items-center justify-center w-full bg-gray-50 rounded-lg p-8">
        <AnimatePresence mode="wait">
          <QuestionDisplay
            question={currentQuestion}
            currentStep={currentStep}
            totalSteps={totalSteps}
            showSummary={showSummary}
            questions={allQuestions}
          />
        </AnimatePresence>
      </div>

      <Controls
        isAutoPlaying={isAutoPlaying}
        toggleAutoPlay={toggleAutoPlay}
        handleNext={handleNext}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
        showSummary={showSummary}
      />

      <ProgressBar
        currentQuestionIndex={currentQuestionIndex}
        currentStep={currentStep}
        totalSteps={totalSteps}
        questions={allQuestions}
      />
    </div>
  );
};

const StartButton = ({ onStart }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onStart}
    className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl font-bold shadow-lg"
  >
    Start Question Set
  </motion.button>
);

const CompletionScreen = ({ onComplete }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center h-full space-y-8"
  >
    <motion.div
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      className="text-4xl font-bold text-green-600"
    >
      Set Completed!
    </motion.div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onComplete}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-bold shadow-lg"
    >
      Return to Question Sets
    </motion.button>
  </motion.div>
);

const QuestionHeader = ({
  currentQuestionIndex,
  questionSets,
  currentQuestion,
  setInfo,
}) => {
  // Get question type name from the question object or map from question_set question_types
  const getQuestionTypeName = () => {
    // If question has question_type object with name
    if (currentQuestion.question_type?.name) {
      return currentQuestion.question_type.name;
    }

    // Find which set this question belongs to
    const parentSet = questionSets.find((qs) =>
      qs.questions.some((q) => q.id === currentQuestion.id)
    );

    // If question has question_type_id, try to find it in the parent set's question_types
    if (currentQuestion.question_type_id && parentSet?.question_types) {
      const foundType = parentSet.question_types.find(
        (qt) => qt.id === currentQuestion.question_type_id
      );
      return foundType?.name || "Mixed Operations";
    }

    return "Mixed Operations";
  };

  return (
    <div className="text-center">
      <div className="text-xl font-semibold text-gray-600 mb-2">
        Set {setInfo.currentSetIndex} of {setInfo.totalSets}: {setInfo.setName}
      </div>
      <div className="text-2xl font-semibold text-gray-700">
        Question {currentQuestionIndex + 1} of{" "}
        {questionSets.reduce((total, set) => total + set.questions.length, 0)} •{" "}
        {getQuestionTypeName()}
      </div>
    </div>
  );
};
