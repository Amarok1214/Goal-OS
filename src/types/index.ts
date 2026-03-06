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
}

export type SubTask = {
  id: string
  taskId: string
  title: string
  completed: boolean
  createdAt: Date
}

export interface Task {
  id: string
  goalId: string
  title: string
  dueDate: Date | null
  completed: boolean
  createdAt: Date
  updatedAt: Date
  subtasks: SubTask[]
}

export interface TaskStore {
  tasks: Task[]
  addTask: (goalId: string, title: string) => void
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'goalId'>>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  getTasksByGoal: (goalId: string) => Task[]
  getTodayTasks: () => Task[]
  addSubtask: (taskId: string, title: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  deleteSubtask: (taskId: string, subtaskId: string) => void
}
