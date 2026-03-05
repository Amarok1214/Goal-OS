export type GoalStatus = 'active' | 'paused' | 'completed' | 'someday'

export interface Goal {
  id: string
  title: string
  description: string
  deadline: Date | null
  status: GoalStatus
  createdAt: Date
  updatedAt: Date
}

export interface GoalStore {
  goals: Goal[]
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateGoal: (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => void
  deleteGoal: (id: string) => void
  getGoalById: (id: string) => Goal | undefined
}
