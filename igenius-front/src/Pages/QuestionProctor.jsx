import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QuestionProctor = ({ questionSet, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questionSet.questions[currentQuestionIndex];
  const totalSteps = currentQuestion.digits.length * 2 - 1;

  const startSet = () => {
    setIsPlaying(true);
    setCurrentQuestionIndex(0);
    setCurrentStep(0);
    setShowAnswer(false);
    setIsComplete(false);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (!showAnswer) {
      setShowAnswer(true);
    } else if (currentQuestionIndex < questionSet.questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentStep(0);
      setShowAnswer(false);
    } else {
      // All questions completed
      setIsComplete(true);
    }
  };

  const renderCurrentDisplay = () => {
    const digits = currentQuestion.digits;
    const operators = currentQuestion.operators;

    if (showAnswer) {
      return (
        <motion.div
          key="answer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-green-600"
        >
          Answer: {currentQuestion.answer}
        </motion.div>
      );
    }

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

      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextStep}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-bold shadow-lg"
        >
          {showAnswer
            ? currentQuestionIndex < questionSet.questions.length - 1
              ? "Next Question"
              : "Finish Set"
            : currentStep === totalSteps
            ? "Show Answer"
            : "Next Step"}
        </motion.button>
      </div>

     <div className="w-full bg-gray-200 rounded-full h-4">
  <motion.div
    className="bg-blue-600 h-4 rounded-full"
    initial={{ width: 0 }}
    animate={{
      width: `${(
        (currentQuestionIndex + (currentStep / totalSteps) * 0.9) / 
        questionSet.questions.length
      ) * 100}%`
    }}
    transition={{ duration: 0.3 }}
  />
</div>
    </div>
  );
};

export default QuestionProctor;