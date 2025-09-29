import { motion } from "framer-motion";

export const Controls = ({
  isAutoPlaying,
  toggleAutoPlay,
  handleNext,
  playbackSpeed,
  setPlaybackSpeed,
  showSummary,
}) => (
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
);
