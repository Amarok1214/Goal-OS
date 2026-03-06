import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Pencil, Trash2, Calendar, Play, Pause } from 'lucide-react'
import { Button } from '../ui/button'
import { useTaskStore } from '../../store/taskStore'
import { useFocusStore } from '../../store/focusStore'
import type { Task } from '../../types'

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
  dimmed?: boolean
}

export function TaskItem({ task, onEdit, dimmed = false }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTaskStore()
  const { activeTaskId, setActiveTask, clearFocus } = useFocusStore()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const isActive = activeTaskId === task.id

  const formatDueDate = (date: Date | null): string => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const isOverdue = (): boolean => {
    if (!task.dueDate || task.completed) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(task.dueDate)
    due.setHours(0, 0, 0, 0)
    return due < today
  }

  const handleToggle = () => {
    toggleTask(task.id)
  }

  const handleDelete = () => {
    deleteTask(task.id)
    setIsDeleteOpen(false)
  }

  const handleFocus = () => {
    if (isActive) {
      clearFocus()
    } else {
      setActiveTask(task.id)
    }
  }

  return (
    <>
      <motion.div 
        className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors group ${dimmed ? 'opacity-40' : 'hover:bg-white/30'}`}
        animate={{ opacity: dimmed ? 0.4 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Focus Button */}
        <button
          onClick={handleFocus}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            isActive
              ? 'bg-amber-500 text-white'
              : 'bg-white/50 text-sky-600 hover:bg-amber-100'
          }`}
          title={isActive ? 'Stop Focus' : 'Start Focus'}
        >
          {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
        </button>

        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-sky-400 hover:border-sky-600'
          }`}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>

        {/* Title */}
        <span
          className={`flex-1 text-sm ${
            task.completed ? 'line-through text-sky-400/60' : 'text-sky-800'
          }`}
        >
          {task.title}
        </span>

        {/* Due Date */}
        {task.dueDate && (
          <span
            className={`text-xs flex items-center gap-1 ${
              isOverdue() ? 'text-red-500' : 'text-sky-500'
            }`}
          >
            <Calendar className="w-3 h-3" />
            {formatDueDate(task.dueDate)}
          </span>
        )}

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="h-7 w-7 p-0"
          >
            <Pencil className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </motion.div>

      {/* Delete Confirmation */}
      {isDeleteOpen && (
        <>
          <div
            className="dialog-overlay"
            onClick={() => setIsDeleteOpen(false)}
          />
          <div className="dialog-content">
            <h3 className="text-xl font-semibold mb-2 font-display" style={{ color: '#0c4a6e' }}>
              Delete Task
            </h3>
            <p className="mb-6" style={{ color: '#0369a1' }}>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
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
