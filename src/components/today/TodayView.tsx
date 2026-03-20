import { useMemo } from 'react'
import { useGoalStore } from '../../store/goalStore'
import { useFocusStore } from '../../store/focusStore'
import { GoalCard } from '../goals/GoalCard'
import { PomodoroTimer } from './PomodoroTimer'
import { AlertCircle, Clock, Flame, Target, Zap } from 'lucide-react'

export function TodayView() {
  const { goals } = useGoalStore()
  const { getTodayPomodoros, getWeekPomodoros } = useFocusStore()
  
  const todayPomodoros = getTodayPomodoros()
  const weekPomodoros = getWeekPomodoros()

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
      <PomodoroTimer />

      {/* Greeting */}
      <div className="glass p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl"
              style={{ color: 'var(--text-primary)' }}>
              {greeting()} 👋
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              {dateLabel}
            </p>
          </div>
          {/* Summary pills */}
          <div className="flex gap-3 flex-wrap">
            {/* Pomodoro streak counter */}
            {(todayPomodoros > 0 || weekPomodoros > 0) && (
              <div className="glass-sm px-4 py-2 flex items-center gap-2"
                style={{ border: '1px solid rgba(251,191,36,0.4)' }}>
                <Zap className="w-4 h-4" style={{ color: '#f59e0b' }} />
                <span className="text-sm font-semibold"
                  style={{ color: '#fbbf24' }}>
                  🔥 {todayPomodoros} today · {weekPomodoros} this week
                </span>
              </div>
            )}
            <div className="glass-sm px-4 py-2 flex items-center gap-2">
              <Flame className="w-4 h-4" style={{ color: '#f97316' }} />
              <span className="text-sm font-semibold"
                style={{ color: 'var(--text-primary)' }}>
                {active.length} Active
              </span>
            </div>
            {overdue.length > 0 && (
              <div className="glass-sm px-4 py-2 flex items-center gap-2"
                style={{ border: '1px solid rgba(248,113,113,0.4)' }}>
                <AlertCircle className="w-4 h-4"
                  style={{ color: '#f87171' }} />
                <span className="text-sm font-semibold"
                  style={{ color: '#f87171' }}>
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
                  style={{ color: '#fbbf24' }}>
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
              tracking-widest" style={{ color: '#fbbf24' }}>
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
            <Target className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
            <h3 className="font-display font-semibold text-sm uppercase
              tracking-widest" style={{ color: 'var(--text-secondary)' }}>
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
          <div 
            className="glass p-12 text-center"
            style={{ background: 'rgba(20, 35, 55, 0.95)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="font-display font-bold text-xl mb-2"
              style={{ color: '#f0f4f8' }}>
              All caught up!
            </h3>
            <p style={{ color: '#8da0b3', fontSize: '14px' }}>
              No urgent goals today. Add a new goal to keep moving forward.
            </p>
          </div>
        )}
    </div>
  )
}
