import { useGoalStore } from '../store/goalStore'
import { useTaskStore } from '../store/taskStore'
import { useFocusStore } from '../store/focusStore'
import { useScheduleStore } from '../store/scheduleStore'
import { useSettingsStore } from '../store/settingsStore'
import type { ExportData } from './export'

export interface ImportResult {
  success: boolean
  data?: ExportData
  error?: string
  imported?: {
    goals: number
    tasks: number
    sessions: number
    blocks: number
    settings: boolean
  }
}

const REQUIRED_FIELDS = ['version', 'exportedAt', 'goals', 'tasks']

export const importAllData = async (file: File): Promise<ImportResult> => {
  try {
    const text = await file.text()
    const data = JSON.parse(text) as ExportData

    // Validate version
    if (!data.version) {
      return { success: false, error: 'Invalid file: missing version' }
    }

    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!(field in data)) {
        return { success: false, error: `Invalid file: missing required field "${field}"` }
      }
    }

    // Validate goals and tasks are arrays
    if (!Array.isArray(data.goals)) {
      return { success: false, error: 'Invalid file: goals must be an array' }
    }
    if (!Array.isArray(data.tasks)) {
      return { success: false, error: 'Invalid file: tasks must be an array' }
    }

    return { success: true, data }
  } catch (e) {
    return { 
      success: false, 
      error: e instanceof Error ? e.message : 'Failed to parse file' 
    }
  }
}

export const loadImportedData = (data: ExportData): ImportResult => {
  try {
    // Load goals
    const goalsState = useGoalStore.getState()
    goalsState.goals = data.goals || []
    
    // Load tasks
    const tasksState = useTaskStore.getState()
    tasksState.tasks = data.tasks || []
    
    // Load sessions
    if (data.sessions) {
      const focusState = useFocusStore.getState()
      focusState.sessions = data.sessions
    }
    
    // Load schedule blocks
    if (data.scheduleBlocks) {
      const scheduleState = useScheduleStore.getState()
      scheduleState.blocks = data.scheduleBlocks
    }
    
    // Load settings
    if (data.settings) {
      const settingsState = useSettingsStore.getState()
      settingsState.updateSettings(data.settings)
    }

    return {
      success: true,
      data,
      imported: {
        goals: data.goals?.length || 0,
        tasks: data.tasks?.length || 0,
        sessions: data.sessions?.length || 0,
        blocks: data.scheduleBlocks?.length || 0,
        settings: !!data.settings,
      },
    }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to load data',
    }
  }
}

export const clearAllData = (): void => {
  // Clear all stores
  useGoalStore.setState({ goals: [] })
  useTaskStore.setState({ tasks: [] })
  useFocusStore.setState({ sessions: [], distractionLogs: [] })
  useScheduleStore.setState({ blocks: [] })
  useSettingsStore.getState().resetSettings()
}