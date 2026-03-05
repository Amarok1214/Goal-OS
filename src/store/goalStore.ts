import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Goal, GoalStore } from '../types'

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: [],

      addGoal: (goalData) => {
        const id = crypto.randomUUID()
        const now = new Date()
        const newGoal: Goal = {
          ...goalData,
          id,
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ goals: [...state.goals, newGoal] }))
        return id
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? { ...goal, ...updates, updatedAt: new Date() }
              : goal
          ),
        }))
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }))
      },

      getGoalById: (id) => {
        return get().goals.find((goal) => goal.id === id)
      },
    }),
    {
      name: 'goal-os-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
