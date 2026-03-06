export type GoalStatus = 'active' | 'paused' | 'completed' | 'someday'

export interface GoalLink {
  label: string
  url: string
}

export interface Goal {
  id: string
  title: string
  description: string
  deadline: Date | null
  status: GoalStatus
  links?: GoalLink[]
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

export interface Task {
  id: string
  goalId: string
  title: string
  dueDate: Date | null
  completed: boolean
  subtasks?: { id: string; title: string; completed: boolean }[]
  createdAt: Date
  updatedAt: Date
}

export interface TaskStore {
  tasks: Task[]
  addTask: (goalId: string, task: Omit<Task, 'id' | 'goalId' | 'createdAt' | 'updatedAt'>) => string
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'goalId'>>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  getTasksByGoal: (goalId: string) => Task[]
  getTodayTasks: () => Task[]
  addSubtask: (taskId: string, title: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  deleteSubtask: (taskId: string, subtaskId: string) => void
}
