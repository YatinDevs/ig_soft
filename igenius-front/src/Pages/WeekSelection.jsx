import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

const WeekSelection = ({ level, onSelectWeek, onBack }) => {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        const response = await api.get(`/levels/${level.id}/weeks`);
        // Make sure we have unique weeks (in case backend still returns duplicates)
        const uniqueWeeks = response.data.data.reduce((acc, week) => {
          if (!acc.find((w) => w.id === week.id)) {
            acc.push(week);
          }
          return acc;
        }, []);

        setWeeks(uniqueWeeks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weeks:", error);
        setLoading(false);
      }
    };

    fetchWeeks();
  }, [level.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getWeekLabel = (weekNumber) => {
    const suffixes = ["st", "nd", "rd", "th"];
    const relevantSuffix = weekNumber <= 3 ? suffixes[weekNumber - 1] : "th";
    return `${weekNumber}${relevantSuffix}`;
  };

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
          Back to Levels
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {level.name} - Select Week
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {weeks.map((week, index) => (
          <motion.div
            key={week.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border border-gray-100 hover:shadow-lg transition-shadow"
            onClick={() => onSelectWeek(week)}
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {week.number}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Week {getWeekLabel(week.number)}
              </h2>
              {week.name && (
                <p className="text-gray-600 text-sm">{week.name}</p>
              )}
              <div className="mt-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {week.question_sets_count || 0} question sets
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {weeks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No weeks available
          </h3>
          <p className="text-gray-500">
            This level doesn't have any weeks configured yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default WeekSelection;
