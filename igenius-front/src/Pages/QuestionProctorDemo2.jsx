import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QuestionProctorDemo2 = ({ questionSet, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = questionSet.questions[currentQuestionIndex];
  const totalSteps = currentQuestion.digits.length * 2 - 1;

  useEffect(() => {
    let timer;
    if (isAutoPlaying && isPlaying && !isComplete) {
      const delay = 1000 / playbackSpeed; // Adjust speed based on playbackSpeed
      timer = setTimeout(() => {
        handleNext();
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, isPlaying, currentStep, showSummary, playbackSpeed]);

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
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentQuestionIndex < questionSet.questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentStep(0);
    } else {
      // All questions completed - show summary
      setShowSummary(true);
    }
  };

  const renderCurrentDisplay = () => {
    if (showSummary) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-2xl space-y-6"
        >
          <h2 className="text-3xl font-bold text-center mb-6">
            Question Set Summary
          </h2>
          <div className="space-y-4">
            {questionSet.questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold">Q{index + 1}:</span>
                    <div className="flex items-center">
                      {question.digits.map((digit, i) => (
                        <React.Fragment key={i}>
                          <span className="text-2xl font-bold">{digit}</span>
                          {i < question.operators.length && (
                            <span className="text-xl mx-2 text-blue-600">
                              {question.operators[i]}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    = {question.answer}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    }

    const digits = currentQuestion.digits;
    const operators = currentQuestion.operators;

    const displayElements = [];
    for (let i = 0; i < digits.length; i++) {
      // Add digit
      if (currentStep >= i * 2) {
        displayElements.push(
          <motion.span
            key={`digit-${i}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl font-bold"
          >
            {digits[i]}
          </motion.span>
        );
      }

      // Add operator if not the last digit
      if (i < operators.length && currentStep >= i * 2 + 1) {
        displayElements.push(
          <motion.span
            key={`op-${i}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl mx-2 text-blue-600"
          >
            {operators[i]}
          </motion.span>
        );
      }
    }

    return (
      <div className="flex items-center justify-center space-x-4">
        {displayElements.length > 0 ? (
          displayElements
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl text-gray-500"
          >
            Get ready for question {currentQuestionIndex + 1}...
          </motion.div>
        )}
      </div>
    );
  };

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startSet}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl font-bold shadow-lg"
        >
          Start Question Set
        </motion.button>
      </div>
    );
  }

  if (isComplete) {
    return (
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
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-12">
      <div className="text-2xl font-semibold text-gray-700">
        Question {currentQuestionIndex + 1} of {questionSet.questions.length} •{" "}
        {currentQuestion.question_type.name}
      </div>

      <div className="min-h-32 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">{renderCurrentDisplay()}</AnimatePresence>
      </div>

      <div className="flex flex-col items-center space-y-6 w-full max-w-md">
        <div className="flex space-x-4">
          {!isAutoPlaying ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-bold shadow-lg"
            >
              {showSummary ? "Finish Set" : "Next Step"}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAutoPlay}
              className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg font-bold shadow-lg"
            >
              Pause
            </motion.button>
          )}

          {!isAutoPlaying && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAutoPlay}
              className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-bold shadow-lg"
            >
              Auto Play
            </motion.button>
          )}
        </div>

        {isAutoPlaying && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Speed:</span>
            {[0.5, 1, 1.5, 2].map((speed) => (
              <motion.button
                key={speed}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-3 py-1 rounded-lg ${
                  playbackSpeed === speed
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {speed}x
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <motion.div
          className="bg-blue-600 h-4 rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${
              ((currentQuestionIndex + currentStep / totalSteps) /
                questionSet.questions.length) *
              100
            }%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default QuestionProctorDemo2;
