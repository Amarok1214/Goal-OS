import { useGoalStore } from '../store/goalStore'
import { useTaskStore } from '../store/taskStore'
import { useFocusStore } from '../store/focusStore'
import { useScheduleStore } from '../store/scheduleStore'
import { useSettingsStore } from '../store/settingsStore'

export interface ExportData {
  version: string
  exportedAt: string
  goals: ReturnType<typeof useGoalStore.getState>['goals']
  tasks: ReturnType<typeof useTaskStore.getState>['tasks']
  sessions: ReturnType<typeof useFocusStore.getState>['sessions']
  scheduleBlocks: ReturnType<typeof useScheduleStore.getState>['blocks']
  settings: Omit<ReturnType<typeof useSettingsStore.getState>, 'updateSettings' | 'resetSettings'>
}

export const exportAllData = (): void => {
  const data: ExportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    goals: useGoalStore.getState().goals,
    tasks: useTaskStore.getState().tasks,
    sessions: useFocusStore.getState().sessions,
    scheduleBlocks: useScheduleStore.getState().blocks,
    settings: {
      pomodoroWork: useSettingsStore.getState().pomodoroWork,
      pomodoroShortBreak: useSettingsStore.getState().pomodoroShortBreak,
      pomodoroLongBreak: useSettingsStore.getState().pomodoroLongBreak,
      notificationsEnabled: useSettingsStore.getState().notificationsEnabled,
      soundEnabled: useSettingsStore.getState().soundEnabled,
    },
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const date = new Date().toISOString().split('T')[0]
  const filename = `goal-os-export-${date}.json`
  
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}