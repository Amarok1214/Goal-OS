import { GoalCard } from './GoalCard'
import { useGoalStore } from '../../store/goalStore'
import { Target } from 'lucide-react'

export function GoalList() {
  const { goals } = useGoalStore()

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="glass w-20 h-20 rounded-full flex items-center justify-center mb-6">
          <Target className="w-10 h-10" style={{ color: '#0ea5e9' }} />
        </div>
        <h3 className="text-xl font-semibold mb-2 font-display" style={{ color: '#0c4a6e' }}>No goals yet</h3>
        <p className="mb-6 max-w-sm" style={{ color: '#0284c7' }}>
          Click "Add Goal" in the header to create your first goal.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-start">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  )
}
