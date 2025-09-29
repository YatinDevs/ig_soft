import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

const LevelSelection = ({ onSelectLevel }) => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await api.get("/levels");
        setLevels(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching levels:", error);
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading levels...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Select Your Abacus Level
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level, index) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => onSelectLevel(level)}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{level.name}</h2>
              <p className="text-gray-600">{level.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LevelSelection;
