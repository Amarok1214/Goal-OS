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

      addSubtask: (goalId, title) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                subtasks: [
                  ...(g.subtasks || []),
                  {
                    id: crypto.randomUUID(),
                    goalId,
                    title,
                    completed: false,
                    createdAt: new Date(),
                  },
                ],
              }
            : g
        ),
      })),

      toggleSubtask: (goalId, subtaskId) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                subtasks: (g.subtasks || []).map((s) =>
                  s.id === subtaskId ? { ...s, completed: !s.completed } : s
                ),
              }
            : g
        ),
      })),

      deleteSubtask: (goalId, subtaskId) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                subtasks: (g.subtasks || []).filter((s) => s.id !== subtaskId),
              }
            : g
        ),
      })),
    }),
    {
      name: 'goal-os-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
