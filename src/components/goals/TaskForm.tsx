import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useTaskStore } from '../../store/taskStore'
import type { Task, TaskPriority } from '../../types'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  dueDate: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: '#ef4444' },
  { value: 'medium', label: 'Medium', color: '#fbbf24' },
  { value: 'low', label: 'Low', color: '#4ade80' },
]

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goalId: string
  editTask?: Task | null
}

export function TaskForm({ open, onOpenChange, goalId, editTask }: TaskFormProps) {
  const { addTask, updateTask } = useTaskStore()
  const [priority, setPriority] = useState<TaskPriority>('medium')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      dueDate: '',
    },
  })

  // Reset form when modal opens or editTask changes
  useEffect(() => {
    if (open) {
      if (editTask) {
        setValue('title', editTask.title)
        setValue('dueDate', editTask.dueDate ? new Date(editTask.dueDate).toISOString().split('T')[0] : '')
        setPriority(editTask.priority || 'medium')
      } else {
        reset({
          title: '',
          dueDate: '',
        })
        setPriority('medium')
      }
    }
  }, [open, editTask, setValue, reset])

  const onSubmit = (data: TaskFormData) => {
    if (editTask) {
      updateTask(editTask.id, {
        title: data.title,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priority: priority,
        completed: editTask.completed,
      })
    } else {
      addTask(goalId, data.title, priority)
    }

    onOpenChange(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dialog-content" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold font-display" style={{ color: 'var(--text-primary)' }}>
            {editTask ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
          <DialogDescription style={{ color: 'var(--text-secondary)' }}>
            {editTask
              ? 'Update your task details below.'
              : 'Add a new task to this goal.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <Input
              id="title"
              placeholder="Enter task title"
              {...register('title')}
              className={`glass-input mt-1 ${errors.title ? 'border-red-400' : ''}`}
            />
            {errors.title && (
              <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="dueDate" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              {...register('dueDate')}
              className="glass-input mt-1"
            />
            {errors.dueDate && (
              <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.dueDate.message}</p>
            )}
          </div>

          {/* Priority Selector */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Priority
            </label>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    priority === option.value ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-surface)]' : ''
                  }`}
                  style={{
                    background: priority === option.value ? `${option.color}30` : 'var(--surface-glass)',
                    color: option.color,
                    boxShadow: priority === option.value ? `0 0 0 2px ${option.color}` : 'none',
                    border: `1px solid ${priority === option.value ? option.color : 'var(--border-default)'}`,
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="btn-outline"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Saving...' : editTask ? 'Save Changes' : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
