import { motion } from "framer-motion";

export const ProgressBar = ({
  currentQuestionIndex,
  currentStep,
  totalSteps,
  questions,
}) => (
  <div className="w-full bg-gray-200 rounded-full h-4">
    <motion.div
      className="bg-blue-600 h-4 rounded-full"
      initial={{ width: 0 }}
      animate={{
        width: `${
          ((currentQuestionIndex + currentStep / totalSteps) /
            questions.length) *
          100
        }%`,
      }}
      transition={{ duration: 0.3 }}
    />
  </div>
);
