import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

const Exam = ({ questionSet, onComplete, onExit }) => {
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [examResults, setExamResults] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const startExam = async () => {
      try {
        const response = await api.post("/exams/start", {
          question_set_id: questionSet.id,
        });
        setExam(response.data.data.exam);
        setCurrentQuestion(response.data.data.first_question);
      } catch (error) {
        console.error("Error starting exam:", error);
      }
    };

    startExam();
  }, [questionSet.id]);

  const speakQuestion = () => {
    if (!currentQuestion || isSpeaking) return;

    setIsSpeaking(true);
    const { digits, operators } = currentQuestion;

    let speechText = "";
    for (let i = 0; i < digits.length; i++) {
      speechText += digits[i] + " ";
      if (operators[i]) {
        const operatorText =
          operators[i] === "+"
            ? "plus"
            : operators[i] === "-"
            ? "minus"
            : operators[i] === "*"
            ? "times"
            : operators[i] === "/"
            ? "divided by"
            : "";
        speechText += operatorText + " ";
      }
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer || !currentQuestion || !exam) return;

    const timeTaken = (Date.now() - startTime) / 1000; // in seconds

    try {
      const response = await api.post(`/exams/${exam.id}/submit-answer`, {
        question_id: currentQuestion.id,
        user_answer: parseFloat(userAnswer),
        time_taken: timeTaken,
      });

      if (response.data.data.is_completed) {
        const completeResponse = await api.post(`/exams/${exam.id}/complete`);
        setExamResults(completeResponse.data.data);
        setShowResults(true);
      } else {
        setCurrentQuestion(response.data.data.next_question);
        setUserAnswer("");
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmitAnswer();
    }
  };

  useEffect(() => {
    if (currentQuestion) {
      setStartTime(Date.now());
      speakQuestion();
    }
  }, [currentQuestion]);

  if (!exam || !currentQuestion) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading exam...
      </div>
    );
  }

  if (showResults && examResults) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Exam Results</h2>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p>
              Score:{" "}
              <span className="font-bold">
                {examResults.total_score.toFixed(1)}%
              </span>
            </p>
            <p>
              Correct Answers:{" "}
              {examResults.answers.filter((a) => a.is_correct).length} /{" "}
              {examResults.answers.length}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Detailed Results</h3>
            <div className="space-y-4">
              {examResults.answers.map((answer, index) => (
                <div
                  key={answer.id}
                  className={`p-3 rounded ${
                    answer.is_correct ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p className="font-medium">
                    Q{index + 1}: {answer.question.digits.join(" ")}{" "}
                    {answer.question.operators.join(" ")}
                  </p>
                  <p>Your Answer: {answer.user_answer}</p>
                  <p>Correct Answer: {answer.question.answer}</p>
                  <p>Time Taken: {answer.time_taken.toFixed(1)}s</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onExit}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Back to Levels
            </button>
            <button
              onClick={() => onComplete(questionSet)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onExit}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            className="w-5 h-5 mr-1"
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
          Exit Exam
        </button>
        <div className="text-lg font-semibold">
          Question {currentQuestion.question_number} of{" "}
          {questionSet.total_questions}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {questionSet.level.name} - {questionSet.week.name}
            </h2>
            <button
              onClick={speakQuestion}
              disabled={isSpeaking}
              className={`p-2 rounded-full ${
                isSpeaking ? "bg-gray-200" : "bg-blue-100 hover:bg-blue-200"
              }`}
            >
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="text-4xl font-bold mb-2">
              {currentQuestion.digits.map((digit, index) => (
                <React.Fragment key={index}>
                  {digit}
                  {currentQuestion.operators[index] && (
                    <span className="mx-2">
                      {currentQuestion.operators[index]}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="answer"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Answer
            </label>
            <input
              type="number"
              id="answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <button
            onClick={handleSubmitAnswer}
            disabled={!userAnswer}
            className={`w-full py-3 rounded-md text-white font-medium ${
              !userAnswer ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Submit Answer
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Exam;
