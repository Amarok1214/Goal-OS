import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Task, TaskStore } from '../types'

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (goalId, taskData) => {
        const id = crypto.randomUUID()
        const now = new Date()
        const newTask: Task = {
          ...taskData,
          id,
          goalId,
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
        return id
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completed: !task.completed, updatedAt: new Date() }
              : task
          ),
        }))
      },

      getTasksByGoal: (goalId) => {
        return get().tasks.filter((task) => task.goalId === goalId)
      },

      getTodayTasks: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        return get().tasks.filter((task) => {
          if (!task.completed) return true // Active tasks
          
          // Tasks due today
          if (task.dueDate) {
            const dueDate = new Date(task.dueDate)
            dueDate.setHours(0, 0, 0, 0)
            return dueDate.getTime() === today.getTime()
          }
          return false
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
                    title,
                    completed: false,
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
                  s.id === subtaskId ? { ...s, completed: !s.completed } : s
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
                subtasks: (t.subtasks || []).filter((s) => s.id !== subtaskId),
              }
            : t
        ),
      })),
    }),
    {
      name: 'goal-os-tasks',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
