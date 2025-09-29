import { motion, AnimatePresence } from "framer-motion";
import React from "react";
export const QuestionDisplay = ({
  question,
  currentStep,
  totalSteps,
  showSummary,
  questions,
}) => {
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
          {questions.map((q, index) => (
            <QuestionSummaryItem key={q.id} question={q} index={index} />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-end space-y-1 min-h-[200px]">
      <VerticalEquation
        question={question}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
    </div>
  );
};

const QuestionSummaryItem = ({ question, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white p-4 rounded-lg shadow"
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <span className="text-xl font-bold">Q{index + 1}:</span>
        <div className="flex flex-col items-end">
          {question.digits.map((digit, i) => (
            <React.Fragment key={i}>
              <div className="flex justify-end items-center min-w-[100px]">
                {i > 0 && (
                  <span className="text-xl mr-2 text-blue-600 w-6">
                    {question.operators[i - 1]}
                  </span>
                )}
                <span className="text-2xl font-bold">{digit}</span>
              </div>
            </React.Fragment>
          ))}
          <div className="border-t border-gray-400 w-full my-1" />
          <span className="text-2xl font-bold">{question.answer}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const VerticalEquation = ({ question, currentStep, totalSteps }) => {
  const digits = question.digits;
  const operators = question.operators;

  return (
    <>
      {digits.map((digit, i) => {
        const shouldShowDigit = currentStep >= i * 2;
        const shouldShowOperator =
          i > 0 && i <= operators.length && currentStep >= i * 2 - 1;

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
                    {operators[i - 1]}
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
      {currentStep >= totalSteps && (
        <>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="border-t-2 border-gray-700 w-24 my-1"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-bold min-w-[80px] text-right text-green-600"
          >
            {question.answer}
          </motion.div>
        </>
      )}
    </>
  );
};
