import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpeech } from "../hooks/useSpeech";

const QuestionPlayer = ({ questionSets, onComplete }) => {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showAnswerSheet, setShowAnswerSheet] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSetIntroduction, setShowSetIntroduction] = useState(true);
  const { speak, cancel, isSpeaking } = useSpeech(true);

  const currentSet = questionSets[currentSetIndex];
  const currentQuestion = currentSet.questions[currentQuestionIndex];
  const totalSteps = currentQuestion.digits.length * 2 - 1;

  // Calculate progress percentages
  const setProgress = ((currentSetIndex + 1) / questionSets.length) * 100;
  const questionProgress =
    ((currentQuestionIndex + 1) / currentSet.questions.length) * 100;
  const stepProgress = (currentStep / totalSteps) * 100;

  // Map operator symbols to spoken words
  const getSpokenOperator = (operator) => {
    switch (operator) {
      case "+":
        return "add";
      case "-":
        return "minus";
      case "*":
        return "multiply";
      case "/":
      case "%":
        return "divide";
      default:
        return operator;
    }
  };

  // Handle navigation between sets
  const goToSet = (index) => {
    if (index >= 0 && index < questionSets.length) {
      setCurrentSetIndex(index);
      setCurrentQuestionIndex(0);
      setCurrentStep(0);
      setIsPlaying(false);
      setIsAutoPlaying(false);
      setShowSetIntroduction(true);
      if (cancel) cancel();
    }
  };

  // Handle navigation between questions
  const goToQuestion = (index) => {
    if (index >= 0 && index < currentSet.questions.length) {
      setCurrentQuestionIndex(index);
      setCurrentStep(0);
      setIsPlaying(false);
      setIsAutoPlaying(false);
      if (cancel) cancel();
    }
  };

  // Start playing the entire set
  const startPlayingSet = () => {
    setIsPlaying(true);
    setIsAutoPlaying(true);
    setShowSetIntroduction(false);

    // Announce the set if we're at the beginning
    if (currentQuestionIndex === 0 && currentStep === 0) {
      speak(`Question Set ${currentSetIndex + 1}`);
    }
  };

  // Handle next step in the question
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);

      // Speak the current digit or operator
      const digitIndex = Math.floor(currentStep / 2);
      const isOperatorStep = currentStep % 2 === 1;

      if (isOperatorStep && digitIndex < currentQuestion.operators.length) {
        const operator = getSpokenOperator(
          currentQuestion.operators[digitIndex]
        );
        speak(operator, { rate: playbackSpeed });
      } else if (digitIndex < currentQuestion.digits.length) {
        const digit = currentQuestion.digits[digitIndex];
        speak(digit.toString().split("").join(" "), { rate: playbackSpeed });
      }
    } else {
      // Move to next question without pausing
      if (currentQuestionIndex < currentSet.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentStep(0);
      } else if (currentSetIndex < questionSets.length - 1) {
        // Move to next set
        setCurrentSetIndex(currentSetIndex + 1);
        setCurrentQuestionIndex(0);
        setCurrentStep(0);
        setShowSetIntroduction(true);

        if (isAutoPlaying) {
          speak(`Question Set ${currentSetIndex + 2} begins`);
        }
      } else {
        // All sets completed
        setShowSummary(true);
        speak(
          "All question sets completed. Would you like to see the answers?",
          {
            rate: playbackSpeed,
          }
        );
        setIsAutoPlaying(false);
      }
    }
  };

  // Toggle auto-play
  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
    } else {
      setIsAutoPlaying(true);
      if (!isPlaying) {
        setIsPlaying(true);
        setShowSetIntroduction(false);
        if (currentQuestionIndex === 0 && currentStep === 0) {
          speak(`Question Set ${currentSetIndex + 1}`);
        }
      }
    }
  };

  // Effect for auto-play
  useEffect(() => {
    let timer;
    if (isAutoPlaying && isPlaying) {
      timer = setTimeout(handleNextStep, 1500 / playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, isPlaying, currentStep, playbackSpeed]);

  // Start playing the current question (for manual step-by-step)
  const startPlayingQuestion = () => {
    setIsPlaying(true);
    setShowSetIntroduction(false);
    if (currentStep === 0) {
      speak(`Question ${currentQuestionIndex + 1}`);
    }
  };

  const handleViewAnswers = () => {
    setShowAnswerSheet(true);
  };

  const handleGoHome = () => {
    onComplete();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Abacus Prompter</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAnswerSheet(!showAnswerSheet)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {showAnswerSheet ? "Hide Answers" : "Show Answers"}
            </button>
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-gray-600 text-white rounded-md"
            >
              Exit Player
            </button>
          </div>
        </div>

        {/* Set Navigation */}
        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            {questionSets.map((set, index) => (
              <button
                key={set.id}
                onClick={() => goToSet(index)}
                className={`px-4 py-2 rounded-md ${
                  index === currentSetIndex
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Set {index + 1}
              </button>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${setProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Display */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 mb-6 flex items-center justify-center">
          {showSummary ? (
            <SummaryScreen
              onViewAnswers={handleViewAnswers}
              onGoHome={handleGoHome}
            />
          ) : showSetIntroduction ? (
            <SetIntroduction
              setIndex={currentSetIndex}
              onStart={startPlayingSet}
            />
          ) : (
            <QuestionDisplay
              question={currentQuestion}
              currentStep={currentStep}
              totalSteps={totalSteps}
              isPlaying={isPlaying}
              onStart={startPlayingQuestion}
              setIndex={currentSetIndex}
              questionIndex={currentQuestionIndex}
              totalQuestions={currentSet.questions.length}
            />
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => goToQuestion(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Previous Question
            </button>
            <button
              onClick={() => goToQuestion(currentQuestionIndex + 1)}
              disabled={
                currentQuestionIndex === currentSet.questions.length - 1
              }
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next Question
            </button>
          </div>

          <div className="flex space-x-4 items-center">
            {!isPlaying ? (
              <div className="flex space-x-2">
                {!showSetIntroduction && (
                  <button
                    onClick={startPlayingQuestion}
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                  >
                    Play Question
                  </button>
                )}
                <button
                  onClick={startPlayingSet}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md"
                >
                  Play Question Set
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={toggleAutoPlay}
                  className={`px-4 py-2 rounded-md ${
                    isAutoPlaying ? "bg-red-600" : "bg-yellow-600"
                  } text-white`}
                >
                  {isAutoPlaying ? "Pause Auto" : "Enable Auto"}
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Next Step
                </button>
              </>
            )}

            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="px-4 py-2 border rounded-md"
            >
              <option value={0.5}>0.5x Speed</option>
              <option value={1}>1x Speed</option>
              <option value={1.5}>1.5x Speed</option>
              <option value={2}>2x Speed</option>
            </select>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center">
            <span>Question Progress</span>
            <span>
              {currentQuestionIndex + 1} / {currentSet.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${questionProgress}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            <span>Step Progress</span>
            <span>
              {currentStep} / {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${stepProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Answer Sheet Sidebar */}
      <AnimatePresence>
        {showAnswerSheet && (
          <AnswerSheetSidebar
            questionSets={questionSets}
            currentSetIndex={currentSetIndex}
            currentQuestionIndex={currentQuestionIndex}
            onClose={() => setShowAnswerSheet(false)}
            onSetSelect={goToSet}
            onQuestionSelect={goToQuestion}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const SetIntroduction = ({ setIndex, onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h2 className="text-3xl font-bold text-center">
        Question Set {setIndex + 1}
      </h2>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
      >
        Play Question Set
      </button>
    </div>
  );
};

const AnswerSheetSidebar = ({
  questionSets,
  currentSetIndex,
  currentQuestionIndex,
  onClose,
  onSetSelect,
  onQuestionSelect,
}) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30 }}
      className="w-96 bg-white border-l border-gray-200 h-full overflow-y-auto"
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold">Answer Sheet</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="p-4">
        {questionSets.map((set, setIndex) => (
          <div key={set.id} className="mb-6">
            <div
              className={`flex justify-between items-center cursor-pointer p-2 rounded-md ${
                setIndex === currentSetIndex
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => onSetSelect(setIndex)}
            >
              <h3 className="font-semibold">Set {setIndex + 1}</h3>
              <span>{set.questions.length} questions</span>
            </div>

            {setIndex === currentSetIndex && (
              <div className="ml-4 mt-2 space-y-2">
                {set.questions.map((question, qIndex) => (
                  <div
                    key={question.id}
                    className={`p-2 rounded-md cursor-pointer ${
                      qIndex === currentQuestionIndex
                        ? "bg-blue-200"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => onQuestionSelect(qIndex)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">Q{qIndex + 1}</span>
                      <span className="text-green-600 font-mono">
                        {question.answer}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatQuestion(question)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const QuestionDisplay = ({
  question,
  currentStep,
  totalSteps,
  isPlaying,
  onStart,
  setIndex,
  questionIndex,
  totalQuestions,
}) => {
  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h3 className="text-xl font-semibold">
          Set {setIndex + 1}, Question {questionIndex + 1} of {totalQuestions}
        </h3>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
        >
          Start This Question
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="text-2xl font-semibold mb-6">
        Set {setIndex + 1}, Question {questionIndex + 1}
      </div>
      <div className="flex flex-col items-end space-y-1 min-h-[200px]">
        {question.digits.map((digit, i) => {
          const shouldShowDigit = currentStep >= i * 2;
          const shouldShowOperator = i > 0 && currentStep >= i * 2 - 1;

          return (
            <React.Fragment key={i}>
              {shouldShowDigit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center"
                >
                  {i > 0 && shouldShowOperator && (
                    <motion.span
                      className="text-3xl mr-2 text-blue-600 w-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {question.operators[i - 1]}
                    </motion.span>
                  )}
                  <span className="text-4xl font-bold min-w-[80px] text-right">
                    {digit}
                  </span>
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const SummaryScreen = ({ onViewAnswers, onGoHome }) => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-3xl font-bold">All Sets Completed!</h2>
      <p className="text-xl">Would you like to see the answers?</p>
      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={onViewAnswers}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-bold shadow-lg hover:bg-blue-700 transition-colors"
        >
          View Answers
        </button>
        <button
          onClick={onGoHome}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg text-lg font-bold shadow-lg hover:bg-gray-700 transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

// Helper function to format question for display
const formatQuestion = (question) => {
  if (!question.digits || !question.operators) return "";

  let formatted = "";
  question.digits.forEach((digit, index) => {
    formatted += digit;
    if (question.operators[index]) {
      formatted += ` ${question.operators[index]} `;
    }
  });
  return formatted + " =";
};

export default QuestionPlayer;
