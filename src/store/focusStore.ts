import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Timer durations in seconds
export const POMODORO_WORK = 25 * 60 // 25 minutes
export const POMODORO_SHORT_BREAK = 5 * 60 // 5 minutes
export const POMODORO_LONG_BREAK = 15 * 60 // 15 minutes
export const POMODOROS_BEFORE_LONG_BREAK = 4

export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak' | 'idle'

export interface PomodoroSession {
  id: string
  taskId: string
  taskTitle: string
  goalId: string
  startTime: number
  endTime: number
  duration: number
  intention: string
  completedPomodoros: number
  type: 'work' | 'break'
}

export interface DistractionLog {
  id: string
  sessionId: string
  taskId: string
  taskTitle: string
  goalId: string
  text: string
  timestamp: number
}

interface FocusState {
  // Active session
  activeTaskId: string | null
  activeGoalId: string | null
  startTime: number | null
  sessionIntention: string
  
  // Pomodoro state
  pomodoroPhase: PomodoroPhase
  pomodoroTimeLeft: number
  pomodorosCompleted: number // Track completed work sessions in current cycle
  isRunning: boolean
  
  // Session history
  sessions: PomodoroSession[]
  
  // Distraction log
  distractionLogs: DistractionLog[]
  
  // Actions
  startPomodoro: (taskId: string, goalId: string, taskTitle: string, intention: string) => void
  pausePomodoro: () => void
  resumePomodoro: () => void
  skipPhase: () => void
  stopPomodoro: () => void
  tick: () => void
  
  // Streaks
  getTodayPomodoros: () => number
  getWeekPomodoros: () => number
  
  // Distraction log
  addDistraction: (text: string) => void
  
  // History
  clearHistory: () => void
  
  // Analytics helpers
  getSessionsByDay: (date: Date) => PomodoroSession[]
  getDailyFocusMinutes: (date: Date) => number
  getFocusStreak: () => number
  getGoalsCompletedThisWeek: () => number
  getWeeklyFocusHours: () => number[]
  getDistractionsThisWeek: () => number
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      activeTaskId: null,
      activeGoalId: null,
      startTime: null,
      sessionIntention: '',
      pomodoroPhase: 'idle',
      pomodoroTimeLeft: POMODORO_WORK,
      pomodorosCompleted: 0,
      isRunning: false,
      sessions: [],
      distractionLogs: [],
      
      startPomodoro: (taskId, goalId, _taskTitle, intention) => {
        // Note: taskTitle is intentionally unused here as it's stored in sessionIntention
        // The actual task title is saved when the session completes
        set({
          activeTaskId: taskId,
          activeGoalId: goalId,
          startTime: Date.now(),
          sessionIntention: intention,
          pomodoroPhase: 'work',
          pomodoroTimeLeft: POMODORO_WORK,
          isRunning: true,
        })
      },
      
      pausePomodoro: () => set({ isRunning: false }),
      
      resumePomodoro: () => set({ isRunning: true }),
      
      skipPhase: () => {
        const { pomodoroPhase, pomodorosCompleted } = get()
        let nextPhase: PomodoroPhase
        let nextTime: number
        let newCompleted = pomodorosCompleted
        
        if (pomodoroPhase === 'work') {
          // Completed a work session
          newCompleted = pomodorosCompleted + 1
          if (newCompleted >= POMODOROS_BEFORE_LONG_BREAK) {
            nextPhase = 'longBreak'
            nextTime = POMODORO_LONG_BREAK
            newCompleted = 0 // Reset after long break
          } else {
            nextPhase = 'shortBreak'
            nextTime = POMODORO_SHORT_BREAK
          }
        } else {
          // Skip break, back to work
          nextPhase = 'work'
          nextTime = POMODORO_WORK
        }
        
        set({
          pomodoroPhase: nextPhase,
          pomodoroTimeLeft: nextTime,
          pomodorosCompleted: newCompleted,
        })
      },
      
      stopPomodoro: () => {
        const state = get()
        
        // Save completed work session if it was a work session that was running
        if (state.pomodoroPhase === 'work' && state.activeTaskId && state.startTime) {
          const session: PomodoroSession = {
            id: crypto.randomUUID(),
            taskId: state.activeTaskId,
            taskTitle: '', // Will be filled by component
            goalId: state.activeGoalId || '',
            startTime: state.startTime,
            endTime: Date.now(),
            duration: POMODORO_WORK - state.pomodoroTimeLeft,
            intention: state.sessionIntention,
            completedPomodoros: 1,
            type: 'work',
          }
          
          set((s) => ({
            sessions: [...s.sessions, session],
            activeTaskId: null,
            activeGoalId: null,
            startTime: null,
            sessionIntention: '',
            pomodoroPhase: 'idle',
            pomodoroTimeLeft: POMODORO_WORK,
            isRunning: false,
          }))
        } else {
          set({
            activeTaskId: null,
            activeGoalId: null,
            startTime: null,
            sessionIntention: '',
            pomodoroPhase: 'idle',
            pomodoroTimeLeft: POMODORO_WORK,
            isRunning: false,
          })
        }
      },
      
      tick: () => {
        const { pomodoroTimeLeft, pomodoroPhase, pomodorosCompleted, activeTaskId, startTime, sessionIntention } = get()
        
        if (pomodoroTimeLeft <= 1) {
          // Phase complete - transition to next
          let nextPhase: PomodoroPhase
          let nextTime: number
          let newCompleted = pomodorosCompleted
          
          if (pomodoroPhase === 'work') {
            // Work session complete
            newCompleted = pomodorosCompleted + 1
            
            // Save work session
            if (activeTaskId && startTime) {
              const session: PomodoroSession = {
                id: crypto.randomUUID(),
                taskId: activeTaskId,
                taskTitle: '',
                goalId: get().activeGoalId || '',
                startTime,
                endTime: Date.now(),
                duration: POMODORO_WORK,
                intention: sessionIntention,
                completedPomodoros: 1,
                type: 'work',
              }
              set((s) => ({ sessions: [...s.sessions, session] }))
            }
            
            if (newCompleted >= POMODOROS_BEFORE_LONG_BREAK) {
              nextPhase = 'longBreak'
              nextTime = POMODORO_LONG_BREAK
              newCompleted = 0
            } else {
              nextPhase = 'shortBreak'
              nextTime = POMODORO_SHORT_BREAK
            }
          } else {
            // Break complete - back to work
            nextPhase = 'work'
            nextTime = POMODORO_WORK
          }
          
          set({
            pomodoroPhase: nextPhase,
            pomodoroTimeLeft: nextTime,
            pomodorosCompleted: newCompleted,
            isRunning: false, // Pause after phase complete
            startTime: Date.now(), // Reset start time for new phase
          })
        } else {
          set({ pomodoroTimeLeft: pomodoroTimeLeft - 1 })
        }
      },
      
      getTodayPomodoros: () => {
        const { sessions } = get()
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        return sessions.filter(
          s => s.startTime >= today.getTime() && s.type === 'work'
        ).length
      },
      
      getWeekPomodoros: () => {
        const { sessions } = get()
        const today = new Date()
        const dayOfWeek = today.getDay()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - dayOfWeek)
        startOfWeek.setHours(0, 0, 0, 0)
        
        return sessions.filter(
          s => s.startTime >= startOfWeek.getTime() && s.type === 'work'
        ).length
      },
      
      addDistraction: (text) => {
        const { activeTaskId, sessions } = get()
        if (!activeTaskId) return
        
        const distraction: DistractionLog = {
          id: crypto.randomUUID(),
          sessionId: sessions[sessions.length - 1]?.id || '',
          taskId: activeTaskId,
          taskTitle: '', // Will be filled by component
          goalId: get().activeGoalId || '',
          text,
          timestamp: Date.now(),
        }
        
        set((s) => ({ distractionLogs: [...s.distractionLogs, distraction] }))
      },
      
      clearHistory: () => set({ sessions: [], distractionLogs: [] }),
      
      getSessionsByDay: (date: Date) => {
        const { sessions } = get()
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = startOfDay.getTime() + 24 * 60 * 60 * 1000
        
        return sessions.filter(
          s => s.startTime >= startOfDay.getTime() && s.startTime < endOfDay && s.type === 'work'
        )
      },
      
      getDailyFocusMinutes: (date: Date) => {
        const sessions = get().getSessionsByDay(date)
        return sessions.reduce((acc, s) => acc + s.duration, 0)
      },
      
      getFocusStreak: () => {
        let streak = 0
        let date = new Date()
        
        // Check if today has sessions
        const todayMinutes = get().getDailyFocusMinutes(date)
        if (todayMinutes === 0) {
          // Check yesterday - if no sessions today, we might be at day 0 of streak
          date.setDate(date.getDate() - 1)
        }
        
        while (get().getDailyFocusMinutes(date) > 0) {
          streak++
          date.setDate(date.getDate() - 1)
        }
        
        return streak
      },
      
      getGoalsCompletedThisWeek: () => {
        const { sessions } = get()
        const today = new Date()
        const dayOfWeek = today.getDay()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - dayOfWeek)
        startOfWeek.setHours(0, 0, 0, 0)
        
        // Get unique goalIds from sessions this week
        const goalIds = new Set<string>()
        sessions.forEach(s => {
          if (s.startTime >= startOfWeek.getTime() && s.type === 'work' && s.goalId) {
            goalIds.add(s.goalId)
          }
        })
        
        return goalIds.size
      },
      
      getWeeklyFocusHours: () => {
        const hours: number[] = []
        const today = new Date()
        const dayOfWeek = today.getDay()
        
        // Start from Sunday of current week
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - dayOfWeek)
        startOfWeek.setHours(0, 0, 0, 0)
        
        for (let i = 0; i < 7; i++) {
          const day = new Date(startOfWeek)
          day.setDate(startOfWeek.getDate() + i)
          const minutes = get().getDailyFocusMinutes(day)
          hours.push(minutes / 60) // Convert to hours
        }
        
        return hours
      },
      
      getDistractionsThisWeek: () => {
        const { distractionLogs, sessions } = get()
        const today = new Date()
        const dayOfWeek = today.getDay()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - dayOfWeek)
        startOfWeek.setHours(0, 0, 0, 0)
        
        // Get sessions this week
        const weekSessions = sessions.filter(
          s => s.startTime >= startOfWeek.getTime() && s.type === 'work'
        )
        const weekSessionIds = new Set(weekSessions.map(s => s.id))
        
        return distractionLogs.filter(d => weekSessionIds.has(d.sessionId)).length
      },
    }),
    {
      name: 'goal-os-focus',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Audio chime generator using Web Audio API
export const playChime = () => {
  try {
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    
    // Create a pleasant chime sound
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime) // A5
    oscillator.frequency.setValueAtTime(1108.73, audioContext.currentTime + 0.1) // C#6
    oscillator.frequency.setValueAtTime(1318.51, audioContext.currentTime + 0.2) // E6
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (e) {
    console.warn('Audio chime failed:', e)
  }
}
