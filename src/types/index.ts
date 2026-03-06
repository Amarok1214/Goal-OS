export type GoalStatus = 'active' | 'paused' | 'completed' | 'someday'

export interface GoalLink {
  label: string
  url: string
}

export type SubTask = {
  id: string
  goalId: string
  title: string
  completed: boolean
  createdAt: Date
}

export interface Goal {
  id: string
  title: string
  description: string
  deadline: Date | null
  status: GoalStatus
  links?: GoalLink[]
  subtasks?: SubTask[]
  createdAt: Date
  updatedAt: Date
}

export interface GoalStore {
  goals: Goal[]
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateGoal: (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => void
  deleteGoal: (id: string) => void
  getGoalById: (id: string) => Goal | undefined
  addSubtask: (goalId: string, title: string) => void
  toggleSubtask: (goalId: string, subtaskId: string) => void
  deleteSubtask: (goalId: string, subtaskId: string) => void
}

export interface Task {
  id: string
  goalId: string
  title: string
  dueDate: Date | null
  completed: boolean
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
}
