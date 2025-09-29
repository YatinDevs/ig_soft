// components/AnswerSheetSidebar.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const AnswerSheetSidebar = ({ isOpen, onClose, questionSets }) => {
  const formatQuestion = (question) => {
    if (!question.digits || !question.operators) return "";

    let formatted = "";
    question.digits.forEach((digit, index) => {
      formatted += digit;
      if (question.operators[index]) {
        formatted += ` ${question.operators[index]} `;
      }
    });
    return formatted;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Answer Sheet
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {questionSets.map((questionSet, setIndex) => (
                  <div key={questionSet.id} className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {questionSet.name} (Set {questionSet.set_number})
                    </h3>

                    <div className="space-y-2">
                      {questionSet.questions.map((question, qIndex) => (
                        <div
                          key={question.id}
                          className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-gray-700">
                                Q{question.question_number}:{" "}
                                {formatQuestion(question)} = {question.answer}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Type: {question.question_type?.name || "Mixed"}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {question.time_limit}s
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
