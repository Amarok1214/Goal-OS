import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { GoalForm } from './GoalForm'
import { TaskForm } from './TaskForm'
import { TaskItem } from './TaskItem'
import { useGoalStore } from '../../store/goalStore'
import { useTaskStore } from '../../store/taskStore'
import type { Goal, GoalStatus, Task } from '../../types'
import { Pencil, Trash2, Calendar, Plus, CheckSquare } from 'lucide-react'

interface GoalCardProps {
  goal: Goal
}

const statusLabels: Record<GoalStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  someday: 'Someday',
}

export function GoalCard({ goal }: GoalCardProps) {
  const { deleteGoal } = useGoalStore()
  const { getTasksByGoal } = useTaskStore()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const tasks = getTasksByGoal(goal.id)
  const completedCount = tasks.filter(t => t.completed).length
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  const formatDeadline = (date: Date | null): string => {
    if (!date) return 'No deadline'
    const d = new Date(date)
    return `Due: ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  const handleDelete = () => {
    deleteGoal(goal.id)
    setIsDeleteConfirmOpen(false)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskFormOpen(true)
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setIsTaskFormOpen(true)
  }

  return (
    <>
      <Card className="glass flex flex-col min-h-[200px]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold pr-4" style={{ color: '#0c4a6e' }}>
              {goal.title}
            </CardTitle>
            <span className={`badge badge-${goal.status}`}>
              {statusLabels[goal.status]}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pb-3 flex-1">
          <p className="text-sm line-clamp-2 mb-3 min-h-[40px]" style={{ color: goal.description ? '#0369a1' : '#93c5fd' }}>
            {goal.description || 'No description added.'}
          </p>

          <div className="flex items-center text-sm mb-3" style={{ color: '#0284c7' }}>
            <Calendar className="w-4 h-4 mr-1.5" />
            {formatDeadline(goal.deadline)}
          </div>

          {/* Progress Bar */}
          {tasks.length > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1" style={{ color: '#0369a1' }}>
                <span className="flex items-center gap-1">
                  <CheckSquare className="w-3 h-3" />
                  {completedCount} of {tasks.length} tasks
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-sky-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Tasks List */}
          {tasks.length > 0 && (
            <div className="space-y-1 mt-3 pt-3 border-t border-sky-200/50">
              {tasks.slice(0, 3).map((task) => (
                <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
              ))}
              {tasks.length > 3 && (
                <p className="text-xs text-sky-500 pl-3">+{tasks.length - 3} more tasks</p>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between gap-2 pt-0 mt-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddTask}
            className="btn-ghost"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="btn-ghost"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="btn-danger"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit Goal Modal */}
      <GoalForm
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        editGoal={goal}
      />

      {/* Task Form Modal */}
      <TaskForm
        open={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        goalId={goal.id}
        editTask={editingTask}
      />

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && (
        <>
          <div
            className="dialog-overlay"
            onClick={() => setIsDeleteConfirmOpen(false)}
          />
          <div className="dialog-content">
            <h3 className="text-xl font-semibold mb-2 font-display" style={{ color: '#0c4a6e' }}>Delete Goal</h3>
            <p className="mb-6" style={{ color: '#0369a1' }}>
              Are you sure you want to delete "{goal.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="btn-outline"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="btn-danger"
              >
                Delete
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
