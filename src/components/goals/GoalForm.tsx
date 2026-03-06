import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select } from '../ui/select'
import { Button } from '../ui/button'
import { useGoalStore } from '../../store/goalStore'
import type { Goal, GoalStatus, GoalLink } from '../../types'
import { Plus, X, Link2 } from 'lucide-react'

const linkSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  url: z.string().url('Must be a valid URL'),
})

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  deadline: z.string().optional().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    { message: 'Invalid date format' }
  ),
  status: z.enum(['active', 'paused', 'completed', 'someday']),
  links: z.array(linkSchema).optional(),
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
    control,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: '',
      description: '',
      deadline: '',
      status: 'active',
      links: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links',
  })

  // Reset form when modal opens or editGoal changes
  useEffect(() => {
    if (open) {
      if (editGoal) {
        setValue('title', editGoal.title)
        setValue('description', editGoal.description || '')
        setValue('deadline', editGoal.deadline ? new Date(editGoal.deadline).toISOString().split('T')[0] : '')
        setValue('status', editGoal.status)
        setValue('links', editGoal.links || [])
      } else {
        reset({
          title: '',
          description: '',
          deadline: '',
          status: 'active',
          links: [],
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
      links: data.links as GoalLink[] | undefined,
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
      <DialogContent className="dialog-content max-h-[80vh] overflow-y-auto" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold font-display" style={{ color: '#0c4a6e' }}>
            {editGoal ? 'Edit Goal' : 'Create New Goal'}
          </DialogTitle>
          <DialogDescription style={{ color: '#0369a1' }}>
            {editGoal
              ? 'Update your goal details below.'
              : 'Add a new goal to your productivity workspace.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium" style={{ color: '#0c4a6e' }}>
              Title <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <Input
              id="title"
              placeholder="Enter goal title"
              {...register('title')}
              className={`glass-input mt-1 ${errors.title ? 'border-red-400' : ''}`}
            />
            {errors.title && (
              <p className="text-sm mt-1" style={{ color: '#dc2626' }}>{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium" style={{ color: '#0c4a6e' }}>
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe your goal (optional)"
              rows={3}
              {...register('description')}
              className={`glass-input mt-1 ${errors.description ? 'border-red-400' : ''}`}
            />
            {errors.description && (
              <p className="text-sm mt-1" style={{ color: '#dc2626' }}>{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="deadline" className="text-sm font-medium" style={{ color: '#0c4a6e' }}>
              Deadline
            </label>
            <Input
              id="deadline"
              type="date"
              {...register('deadline')}
              className={`glass-input mt-1 ${errors.deadline ? 'border-red-400' : ''}`}
            />
            {errors.deadline && (
              <p className="text-sm mt-1" style={{ color: '#dc2626' }}>{errors.deadline.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="text-sm font-medium" style={{ color: '#0c4a6e' }}>
              Status
            </label>
            <Select
              id="status"
              {...register('status')}
              className="glass-input mt-1"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="someday">Someday</option>
            </Select>
          </div>

          {/* Links Section */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2" style={{ color: '#0c4a6e' }}>
              <Link2 className="w-4 h-4" />
              Links
            </label>
            
            <div className="space-y-2 mt-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <Input
                    placeholder="Label (e.g., GitHub)"
                    {...register(`links.${index}.label` as const)}
                    className="glass-input flex-1"
                  />
                  <Input
                    placeholder="URL (e.g., https://github.com/...)"
                    {...register(`links.${index}.url` as const)}
                    className="glass-input flex-[2]"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 rounded hover:bg-red-100 text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {errors.links && (
                <p className="text-sm" style={{ color: '#dc2626' }}>
                  {errors.links.message || 'Invalid link format'}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => append({ label: '', url: '' })}
              className="mt-2 flex items-center gap-1 text-sm text-sky-600 hover:text-sky-800"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>
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
              {isSubmitting ? 'Saving...' : editGoal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
