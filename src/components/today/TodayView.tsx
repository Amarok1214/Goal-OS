import { useMemo } from 'react'
import { useGoalStore } from '../../store/goalStore'
import { GoalCard } from '../goals/GoalCard'
import { AlertCircle, Clock, Flame, Target } from 'lucide-react'

export function TodayView() {
  const { goals } = useGoalStore()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const threeDaysFromNow = new Date(today)
  threeDaysFromNow.setDate(today.getDate() + 3)

  const overdue = useMemo(() =>
    goals.filter((g) => {
      if (!g.deadline || g.status === 'completed') return false
      return new Date(g.deadline) < today
    }), [goals])

  const dueSoon = useMemo(() =>
    goals.filter((g) => {
      if (!g.deadline || g.status === 'completed') return false
      const d = new Date(g.deadline)
      return d >= today && d <= threeDaysFromNow
    }), [goals])

  const active = useMemo(() =>
    goals.filter((g) => g.status === 'active'), [goals])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const dateLabel = today.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  return (
    <div>
      {/* Greeting */}
      <div className="glass p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl"
              style={{ color: '#0c4a6e' }}>
              {greeting()} 👋
            </h2>
            <p style={{ color: '#0369a1', fontSize: '14px', marginTop: '4px' }}>
              {dateLabel}
            </p>
          </div>
          {/* Summary pills */}
          <div className="flex gap-3">
            <div className="glass-sm px-4 py-2 flex items-center gap-2">
              <Flame className="w-4 h-4" style={{ color: '#f97316' }} />
              <span className="text-sm font-semibold"
                style={{ color: '#0c4a6e' }}>
                {active.length} Active
              </span>
            </div>
            {overdue.length > 0 && (
              <div className="glass-sm px-4 py-2 flex items-center gap-2"
                style={{ border: '1px solid rgba(248,113,113,0.4)' }}>
                <AlertCircle className="w-4 h-4"
                  style={{ color: '#f87171' }} />
                <span className="text-sm font-semibold"
                  style={{ color: '#dc2626' }}>
                  {overdue.length} Overdue
                </span>
              </div>
            )}
            {dueSoon.length > 0 && (
              <div className="glass-sm px-4 py-2 flex items-center gap-2"
                style={{ border: '1px solid rgba(251,191,36,0.4)' }}>
                <Clock className="w-4 h-4"
                  style={{ color: '#fbbf24' }} />
                <span className="text-sm font-semibold"
                  style={{ color: '#92400e' }}>
                  {dueSoon.length} Due Soon
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overdue section */}
      {overdue.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4" style={{ color: '#f87171' }} />
            <h3 className="font-display font-semibold text-sm uppercase
              tracking-widest" style={{ color: '#f87171' }}>
              Overdue
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3
            items-start">
            {overdue.map((goal) => (
              <GoalCard key={goal.id} goal={goal} highlight="overdue" />
            ))}
          </div>
        </div>
      )}

      {/* Due soon section */}
      {dueSoon.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" style={{ color: '#fbbf24' }} />
            <h3 className="font-display font-semibold text-sm uppercase
              tracking-widest" style={{ color: '#f59e0b' }}>
              Due in 3 days
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3
            items-start">
            {dueSoon.map((goal) => (
              <GoalCard key={goal.id} goal={goal} highlight="soon" />
            ))}
          </div>
        </div>
      )}

      {/* Active goals */}
      {active.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4" style={{ color: '#0ea5e9' }} />
            <h3 className="font-display font-semibold text-sm uppercase
              tracking-widest" style={{ color: '#0369a1' }}>
              Active Goals
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3
            items-start">
            {active.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {/* All clear state */}
      {overdue.length === 0 && dueSoon.length === 0 &&
        active.length === 0 && (
          <div className="glass p-12 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="font-display font-bold text-xl mb-2"
              style={{ color: '#0c4a6e' }}>
              All caught up!
            </h3>
            <p style={{ color: '#0284c7', fontSize: '14px' }}>
              No urgent goals today. Add a new goal to keep moving forward.
            </p>
          </div>
        )}
    </div>
  )
}
