import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select } from '../ui/select'
import { Button } from '../ui/button'
import { useGoalStore } from '../../store/goalStore'
import type { Goal, GoalStatus } from '../../types'

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  deadline: z.string().optional().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    { message: 'Invalid date format' }
  ),
  status: z.enum(['active', 'paused', 'completed', 'someday']),
})

type GoalFormData = z.infer<typeof goalSchema>

interface GoalFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editGoal?: Goal | null
}

export function GoalForm({ open, onOpenChange, editGoal }: GoalFormProps) {
  const { addGoal, updateGoal } = useGoalStore()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: '',
      description: '',
      deadline: '',
      status: 'active',
    },
  })

  // Reset form when modal opens or editGoal changes
  useEffect(() => {
    if (open) {
      if (editGoal) {
        setValue('title', editGoal.title)
        setValue('description', editGoal.description || '')
        setValue('deadline', editGoal.deadline ? new Date(editGoal.deadline).toISOString().split('T')[0] : '')
        setValue('status', editGoal.status)
      } else {
        reset({
          title: '',
          description: '',
          deadline: '',
          status: 'active',
        })
      }
    }
  }, [open, editGoal, setValue, reset])

  const onSubmit = (data: GoalFormData) => {
    const goalData = {
      title: data.title,
      description: data.description || '',
      deadline: data.deadline ? new Date(data.deadline) : null,
      status: data.status as GoalStatus,
    }

    if (editGoal) {
      updateGoal(editGoal.id, goalData)
    } else {
      addGoal(goalData)
    }

    onOpenChange(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
          <DialogDescription>
            {editGoal
              ? 'Update your goal details below.'
              : 'Add a new goal to your productivity workspace.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              placeholder="Enter goal title"
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe your goal (optional)"
              rows={3}
              {...register('description')}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="deadline" className="text-sm font-medium">
              Deadline
            </label>
            <Input
              id="deadline"
              type="date"
              {...register('deadline')}
              className={errors.deadline ? 'border-destructive' : ''}
            />
            {errors.deadline && (
              <p className="text-sm text-destructive mt-1">{errors.deadline.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select
              id="status"
              {...register('status')}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="someday">Someday</option>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editGoal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
