import { useState } from 'react'
import { Button } from '../ui/button'
import { GoalCard } from './GoalCard'
import { GoalForm } from './GoalForm'
import { useGoalStore } from '../../store/goalStore'
import { Plus, Target } from 'lucide-react'

export function GoalList() {
  const { goals } = useGoalStore()
  const [isFormOpen, setIsFormOpen] = useState(false)

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Target className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No goals yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Create your first goal to get started on your productivity journey.
        </p>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>

        <GoalForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      <GoalForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </div>
  )
}
