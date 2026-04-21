import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Settings {
  pomodoroWork: number
  pomodoroShortBreak: number
  pomodoroLongBreak: number
  notificationsEnabled: boolean
  soundEnabled: boolean
}

export interface SettingsStore extends Settings {
  updateSettings: (updates: Partial<Settings>) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  pomodoroWork: 25,
  pomodoroShortBreak: 5,
  pomodoroLongBreak: 15,
  notificationsEnabled: true,
  soundEnabled: true,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (updates) => set((state) => ({ ...state, ...updates })),

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'goal-os-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
