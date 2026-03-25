import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface ScheduleBlock {
  id: string
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0=Sunday
  startTime: string // "09:00" (24hr format)
  endTime: string // "10:30"
  goalId?: string // Optional link to goal
  title: string // "Math Study" or auto-filled from goal
  subject?: string // For future categorization
  recurring: boolean // Repeats weekly
  color?: string // Hex color override
  createdAt: Date
  weekStart: string // ISO date string of the week this block belongs to (for non-recurring)
}

interface ScheduleState {
  blocks: ScheduleBlock[]
  
  // Actions
  addBlock: (block: Omit<ScheduleBlock, 'id' | 'createdAt'>) => string
  updateBlock: (id: string, updates: Partial<Omit<ScheduleBlock, 'id'>>) => void
  deleteBlock: (id: string) => void
  
  // Queries
  getBlocksByDay: (day: number, weekStart?: Date) => ScheduleBlock[]
  getBlocksForWeek: (weekStart: Date) => ScheduleBlock[]
  getCurrentBlock: () => ScheduleBlock | null
  
  // Computed
  getTotalPlannedMinutes: (weekStart: Date) => number
}

// Helper to get week start (Monday)
export const getWeekStart = (date: Date = new Date()): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday as start
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

// Helper to get week start as ISO string
export const getWeekStartISO = (date: Date = new Date()): string => {
  return getWeekStart(date).toISOString().split('T')[0]
}

// Helper to parse time string to minutes
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Helper to get duration in minutes
export const getDurationMinutes = (startTime: string, endTime: string): number => {
  return timeToMinutes(endTime) - timeToMinutes(startTime)
}

// Helper to format duration
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

// Helper to format time
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

// Day names (Monday = 0 in our system, Sunday = 6)
export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const FULL_DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      blocks: [],
      
      addBlock: (blockData) => {
        const id = crypto.randomUUID()
        const now = new Date()
        const newBlock: ScheduleBlock = {
          ...blockData,
          id,
          createdAt: now,
        }
        set((state) => ({ blocks: [...state.blocks, newBlock] }))
        return id
      },
      
      updateBlock: (id, updates) => {
        set((state) => ({
          blocks: state.blocks.map((block) =>
            block.id === id ? { ...block, ...updates } : block
          ),
        }))
      },
      
      deleteBlock: (id) => {
        set((state) => ({
          blocks: state.blocks.filter((block) => block.id !== id),
        }))
      },
      
      getBlocksByDay: (day, weekStart?: Date) => {
        const { blocks } = get()
        const targetWeekStart = weekStart ? getWeekStartISO(weekStart) : null
        
        return blocks.filter((block) => {
          // Check day of week
          if (block.dayOfWeek !== day) return false
          
          // Check week (for non-recurring blocks)
          if (!block.recurring && targetWeekStart) {
            return block.weekStart === targetWeekStart
          }
          
          return true
        })
      },
      
      getBlocksForWeek: (weekStart: Date) => {
        const { blocks } = get()
        const targetWeekStart = getWeekStartISO(weekStart)
        
        return blocks.filter((block) => {
          // Recurring blocks always show
          if (block.recurring) return true
          
          // Non-recurring: check week match
          return block.weekStart === targetWeekStart
        })
      },
      
      getCurrentBlock: () => {
        const { blocks } = get()
        const now = new Date()
        const currentDay = (now.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
        const currentWeekStart = getWeekStartISO(now)
        
        const nowMinutes = timeToMinutes(currentTime)
        
        return blocks.find((block) => {
          // Check day
          if (block.dayOfWeek !== currentDay) return false
          
          // Check week
          if (!block.recurring && block.weekStart !== currentWeekStart) return false
          
          // Check time overlap
          const blockStart = timeToMinutes(block.startTime)
          const blockEnd = timeToMinutes(block.endTime)
          
          return nowMinutes >= blockStart && nowMinutes < blockEnd
        }) || null
      },
      
      getTotalPlannedMinutes: (weekStart: Date) => {
        const weekBlocks = get().getBlocksForWeek(weekStart)
        return weekBlocks.reduce((total, block) => {
          return total + getDurationMinutes(block.startTime, block.endTime)
        }, 0)
      },
    }),
    {
      name: 'goal-os-schedule',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
