import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TaskStore } from '../types'

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (goalId, title) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: crypto.randomUUID(),
            goalId,
            title: title.trim(),
            dueDate: null,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            subtasks: [],
          },
        ],
      })),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
        ),
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),

      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date() } : t
        ),
      })),

      getTasksByGoal: (goalId) => {
        return get().tasks.filter((t) => t.goalId === goalId)
      },

      getTodayTasks: () => {
        return get().tasks.filter((t) => !t.completed)
      },

      addSubtask: (taskId, title) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                subtasks: [
                  ...(t.subtasks || []),
                  {
                    id: crypto.randomUUID(),
                    taskId,
                    title: title.trim(),
                    completed: false,
                    createdAt: new Date(),
                  },
                ],
              }
            : t
        ),
      })),

      toggleSubtask: (taskId, subtaskId) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                subtasks: (t.subtasks || []).map((s) =>
                  s.id === subtaskId
                    ? { ...s, completed: !s.completed }
                    : s
                ),
              }
            : t
        ),
      })),

      deleteSubtask: (taskId, subtaskId) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                subtasks: (t.subtasks || []).filter(
                  (s) => s.id !== subtaskId
                ),
              }
            : t
        ),
      })),
    }),
    { name: 'goal-os-tasks' }
  )
)
