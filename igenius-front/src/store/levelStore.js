// store/levelStore.js
import { create } from "zustand";
import { levelAPI } from "../services/api";

export const useLevelStore = create((set, get) => ({
  // State
  levels: [],
  currentLevel: null,
  weeks: [],
  currentWeek: null,
  questionSets: [],
  isLoading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Fetch all levels
  fetchLevels: async () => {
    const { levels, isLoading } = get();

    // Return cached data if already loading or has data
    if (isLoading || levels.length > 0) {
      return levels;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await levelAPI.getLevels();
      set({
        levels: response.data.data,
        isLoading: false,
      });
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch levels";
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Fetch level by ID
  fetchLevel: async (levelId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await levelAPI.getLevel(levelId);
      const level = response.data.data;

      set({
        currentLevel: level,
        isLoading: false,
      });

      return level;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch level";
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Fetch weeks for a level
  fetchWeeks: async (levelId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await levelAPI.getWeeks(levelId);
      const weeks = response.data.data;

      set({
        weeks: weeks,
        isLoading: false,
      });

      return weeks;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch weeks";
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Fetch question sets for a week
  fetchQuestionSets: async (levelId, weekId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await levelAPI.getQuestionSets(levelId, weekId);
      const questionSets = response.data.data;

      set({
        questionSets: questionSets,
        isLoading: false,
      });

      return questionSets;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch question sets";
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Set current level
  setCurrentLevel: (level) => set({ currentLevel: level }),

  // Set current week
  setCurrentWeek: (week) => set({ currentWeek: week }),

  // Clear current data
  clearCurrentData: () =>
    set({
      currentLevel: null,
      currentWeek: null,
      weeks: [],
      questionSets: [],
    }),
}));
