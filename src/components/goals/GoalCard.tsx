import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { GoalForm } from './GoalForm'
import { useGoalStore } from '../../store/goalStore'
import type { Goal, GoalStatus } from '../../types'
import { Pencil, Trash2, Calendar } from 'lucide-react'

interface GoalCardProps {
  goal: Goal
}

const statusColors: Record<GoalStatus, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  someday: 'bg-gray-100 text-gray-800 border-gray-200',
}

const statusLabels: Record<GoalStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  someday: 'Someday',
}

export function GoalCard({ goal }: GoalCardProps) {
  const { deleteGoal } = useGoalStore()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const formatDeadline = (date: Date | null): string => {
    if (!date) return 'No deadline'
    const d = new Date(date)
    return `Due: ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  const handleDelete = () => {
    deleteGoal(goal.id)
    setIsDeleteConfirmOpen(false)
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold pr-4">
              {goal.title}
            </CardTitle>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[goal.status]}`}
            >
              {statusLabels[goal.status]}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          {goal.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {goal.description}
            </p>
          )}

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1.5" />
            {formatDeadline(goal.deadline)}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Modal */}
      <GoalForm
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        editGoal={goal}
      />

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsDeleteConfirmOpen(false)}
          />
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
            <h3 className="text-lg font-semibold">Delete Goal</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "{goal.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
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
