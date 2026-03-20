import { GoalCard } from './GoalCard'
import { useGoalStore } from '../../store/goalStore'
import { Target } from 'lucide-react'

export function GoalList() {
  const { goals } = useGoalStore()

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div 
          className="glass w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(20, 35, 55, 0.95)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <Target className="w-10 h-10" style={{ color: '#38bdf8' }} />
        </div>
        <h3 className="text-xl font-semibold mb-2 font-display" style={{ color: '#f0f4f8' }}>No goals yet</h3>
        <p className="mb-6 max-w-sm" style={{ color: '#8da0b3' }}>
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
