import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TaskStore, TaskPriority } from '../types'

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (goalId, title, priority = 'medium') => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: crypto.randomUUID(),
            goalId,
            title: title.trim(),
            dueDate: null,
            priority: priority,
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

      getTasksSortedByPriority: (goalId: string) => {
        const priorityOrder: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 }
        return get()
          .tasks.filter((t) => t.goalId === goalId)
          .sort((a, b) => {
            // Completed tasks go to the bottom
            if (a.completed !== b.completed) return a.completed ? 1 : -1
            // Sort by priority (high first)
            return priorityOrder[a.priority] - priorityOrder[b.priority]
          })
      },

      getTasksSortedByDueDate: (goalId: string) => {
        return get()
          .tasks.filter((t) => t.goalId === goalId)
          .sort((a, b) => {
            // Completed tasks go to the bottom
            if (a.completed !== b.completed) return a.completed ? 1 : -1
            // Sort by due date (earliest first, null dates go to end)
            if (!a.dueDate && !b.dueDate) return 0
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          })
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
