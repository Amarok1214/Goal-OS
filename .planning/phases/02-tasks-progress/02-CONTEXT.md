# Phase 2 Context: Tasks & Progress

## Phase Overview
**Goal:** Users can manage tasks under goals with visual progress tracking and daily actions view

## Dependencies
- Phase 1: Foundation & Goals (complete)

## Requirements
- TASK-01: Add tasks under goals
- TASK-02: Toggle task completion (done/undone)
- TASK-03: Edit task title and due date
- TASK-04: Delete tasks from a goal
- PROG-01: Visual progress bar per goal
- TODAY-01: Today view showing tasks due today or active
- TODAY-02: Filter Today view by "due today" or "active today"

## UI Decisions from Requirements
- Tasks nested under goals in the UI
- Progress bar: percentage of completed tasks
- Today view: separate section showing today's tasks
- Task states: pending, completed

## Data Structure
```typescript
interface Task {
  id: string
  goalId: string  // Links to parent goal
  title: string
  dueDate: Date | null
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

type TaskStore = {
  tasks: Task[]
  addTask: (goalId: string, data: Omit<Task, 'id' | 'goalId' | 'createdAt' | 'updatedAt'>) => string
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'goalId'>>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  getTasksByGoal: (goalId: string) => Task[]
  getTodayTasks: () => Task[]
}
```

## Component Structure
- TaskForm.tsx - Modal form for creating/editing tasks
- TaskItem.tsx - Single task row with checkbox, title, due date, actions
- GoalCard with progress bar - Shows task count and completion percentage

## Key Decisions
- Progress bar: Simple percentage (completed/total tasks)
- Today view: Shows tasks where dueDate === today OR completed === false (active)
- Filter tabs: "All", "Due Today", "Active"
