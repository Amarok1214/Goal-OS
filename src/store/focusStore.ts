import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface FocusState {
  activeTaskId: string | null
  startTime: number | null
  setActiveTask: (taskId: string | null) => void
  clearFocus: () => void
  getElapsedTime: () => number
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      activeTaskId: null,
      startTime: null,

      setActiveTask: (taskId) => {
        if (taskId === null) {
          set({ activeTaskId: null, startTime: null })
        } else {
          set({ activeTaskId: taskId, startTime: Date.now() })
        }
      },

      clearFocus: () => {
        set({ activeTaskId: null, startTime: null })
      },

      getElapsedTime: () => {
        const { startTime } = get()
        if (!startTime) return 0
        return Math.floor((Date.now() - startTime) / 1000)
      },
    }),
    {
      name: 'goal-os-focus',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
