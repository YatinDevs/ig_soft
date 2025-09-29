import React, { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../services/api";
import { QuestionProctorDemo3 } from "../components/QuestionProctor/QuestionProctorDemo3";
import { AnswerSheetSidebar } from "./AnswerSheetSidebar";
import QuestionPlayer from "../components/QuestionPlayer";

const QuestionSetSelection = ({ level, week, onSelectQuestionSet, onBack }) => {
  const [questionSets, setQuestionSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSet, setExpandedSet] = useState(null);
  const [selectedQuestionSets, setSelectedQuestionSets] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showAnswerSheet, setShowAnswerSheet] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  console.log(selectedQuestionSets);
  useEffect(() => {
    const fetchQuestionSets = async () => {
      try {
        const response = await api.get(`/weeks/${week.id}/question-sets`);
        setQuestionSets(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching question sets:", error);
        setLoading(false);
      }
    };

    fetchQuestionSets();
  }, [week.id]);

  // Toggle question set selection
  const toggleQuestionSetSelection = (questionSet) => {
    setSelectedQuestionSets((prev) => {
      const isSelected = prev.some((qs) => qs.id === questionSet.id);
      if (isSelected) {
        return prev.filter((qs) => qs.id !== questionSet.id);
      } else {
        return [...prev, questionSet];
      }
    });
  };

  // Group question sets by their types
  const questionSetGroups = useMemo(() => {
    const groups = {
      all: questionSets,
      addition: [],
      subtraction: [],
      multiplication: [],
      division: [],
      mixed: [],
    };

    questionSets.forEach((qs) => {
      const types = qs.question_types.map((qt) => qt.name.toLowerCase());

      if (types.includes("addition") && types.includes("subtraction")) {
        groups.addition.push(qs);
        groups.subtraction.push(qs);
      } else if (types.includes("addition")) {
        groups.addition.push(qs);
      } else if (types.includes("subtraction")) {
        groups.subtraction.push(qs);
      } else if (types.includes("multiplication")) {
        groups.multiplication.push(qs);
      } else if (types.includes("division")) {
        groups.division.push(qs);
      } else if (types.length > 1) {
        groups.mixed.push(qs);
      }
    });

    return groups;
  }, [questionSets]);

  const tabs = [
    { id: "all", label: "All Sets", count: questionSetGroups.all.length },
    {
      id: "addition",
      label: "Addition",
      count: questionSetGroups.addition.length,
    },
    {
      id: "subtraction",
      label: "Subtraction",
      count: questionSetGroups.subtraction.length,
    },
    {
      id: "multiplication",
      label: "Multiplication",
      count: questionSetGroups.multiplication.length,
    },
    {
      id: "division",
      label: "Division",
      count: questionSetGroups.division.length,
    },
    { id: "mixed", label: "Mixed", count: questionSetGroups.mixed.length },
  ].filter((tab) => tab.count > 0);

  const filteredQuestionSets = questionSetGroups[activeTab] || [];

  const toggleExpand = (id) => {
    setExpandedSet(expandedSet === id ? null : id);
  };

  const getQuestionTypesString = (questionSet) => {
    if (
      !questionSet.question_types ||
      questionSet.question_types.length === 0
    ) {
      return "Mixed Operations";
    }

    return questionSet.question_types.map((qt) => qt.name).join(" + ");
  };

  const formatQuestion = (question) => {
    if (!question.digits || !question.operators) return "";

    let formatted = "";
    question.digits.forEach((digit, index) => {
      formatted += digit;
      if (question.operators[index]) {
        formatted += ` ${question.operators[index]} `;
      }
    });
    return formatted + " = ?";
  };

  const handlePlaySelected = () => {
    if (selectedQuestionSets.length > 0) {
      setIsPlaying(true);
    }
  };

  const handleCompletePlay = () => {
    setIsPlaying(false);
    setSelectedQuestionSets([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isPlaying && selectedQuestionSets.length > 0) {
    return (
      <div className="fixed inset-0 bg-white z-50 p-8">
        <QuestionPlayer
          questionSets={selectedQuestionSets}
          onComplete={handleCompletePlay}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Weeks
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {level.name} - Week {week.number} - Question Sets
        </h1>
      </div>

      {/* Selection Controls */}
      {selectedQuestionSets.length > 0 && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800">
                Selected {selectedQuestionSets.length} set
                {selectedQuestionSets.length !== 1 ? "s" : ""}
              </h3>
              <p className="text-blue-600 text-sm">
                {selectedQuestionSets.map((qs) => qs.name).join(", ")}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAnswerSheet(true)}
                className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                View Answer Sheet
              </button>
              <button
                onClick={handlePlaySelected}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
              >
                Play Selected
              </button>
              <button
                onClick={() => setSelectedQuestionSets([])}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200"
              } border`}
            >
              {tab.label}
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2 py-1">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestionSets.map((qs, index) => {
          const isSelected = selectedQuestionSets.some(
            (selected) => selected.id === qs.id
          );

          return (
            <motion.div
              key={qs.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-100"
              } transition-all duration-200`}
            >
              {/* Selection Checkbox */}
              <div className="flex items-center p-4 border-b border-gray-100 bg-gray-50">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleQuestionSetSelection(qs)}
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Select this set
                  </span>
                </label>
              </div>

              <div
                className="p-6 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(qs.id)}
              >
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {qs.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      Set {qs.set_number}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      {qs.total_questions} questions
                    </span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                      {qs.time_limit}s per question
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                      {getQuestionTypesString(qs)}
                    </span>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedSet === qs.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4"
                >
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.div>
              </div>

              <AnimatePresence>
                {expandedSet === qs.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 px-6 py-4">
                      <h3 className="font-medium text-gray-700 mb-3">
                        Questions Preview:
                      </h3>
                      <div className="space-y-3">
                        {qs.questions.map((question) => (
                          <div
                            key={question.id}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <span className="font-medium text-gray-700">
                                  Q{question.question_number}:{" "}
                                </span>
                                <span className="text-gray-800 font-mono">
                                  {formatQuestion(question)}
                                </span>
                              </div>
                              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium ml-2">
                                {question.question_type?.name || "Mixed"}
                              </span>
                            </div>
                            {question.calculated_types &&
                              question.calculated_types.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-xs text-gray-500">
                                    Operations:{" "}
                                    {question.calculated_types.join(", ")}
                                  </span>
                                </div>
                              )}
                          </div>
                        ))}
                        {qs.questions.length > 3 && (
                          <div className="text-center text-sm text-gray-500 py-2">
                            + {qs.questions.length - 3} more questions
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-blue-50 px-6 py-4 border-t border-blue-100">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setExpandedSet(null)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => toggleQuestionSetSelection(qs)}
                          className={`px-6 py-2 rounded-md transition-colors font-medium ${
                            isSelected
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          {isSelected ? "Deselect" : "Select"} Set
                        </button>
                        <button
                          onClick={() => {
                            setSelectedQuestionSets([qs]);
                            handlePlaySelected();
                          }}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium"
                        >
                          Play This Set
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {filteredQuestionSets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">❓</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No question sets available
          </h3>
          <p className="text-gray-500">
            {activeTab === "all"
              ? "This week doesn't have any question sets configured yet."
              : `No ${tabs
                  .find((t) => t.id === activeTab)
                  ?.label.toLowerCase()} question sets found.`}
          </p>
        </div>
      )}

      {/* Answer Sheet Sidebar */}
      <AnswerSheetSidebar
        isOpen={showAnswerSheet}
        onClose={() => setShowAnswerSheet(false)}
        questionSets={selectedQuestionSets}
      />
    </div>
  );
};

export default QuestionSetSelection;
