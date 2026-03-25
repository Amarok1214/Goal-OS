import { useMemo } from 'react'
import { Clock, Target, Zap, Flame, AlertCircle } from 'lucide-react'
import { StatsCard } from './StatsCard'
import { FocusChart } from './FocusChart'
import { useFocusStore } from '../../store/focusStore'

export function Dashboard() {
  const { getWeeklyFocusHours, getFocusStreak, getGoalsCompletedThisWeek, getWeekPomodoros, getDistractionsThisWeek } = useFocusStore()
  
  // Memoized calculations
  const weeklyHours = useMemo(() => getWeeklyFocusHours(), [getWeeklyFocusHours])
  const focusStreak = useMemo(() => getFocusStreak(), [getFocusStreak])
  const goalsCompleted = useMemo(() => getGoalsCompletedThisWeek(), [getGoalsCompletedThisWeek])
  const sessionsCompleted = useMemo(() => getWeekPomodoros(), [getWeekPomodoros])
  const distractions = useMemo(() => getDistractionsThisWeek(), [getDistractionsThisWeek])
  
  // Calculate total hours this week
  const totalHoursThisWeek = useMemo(() => {
    const totalMinutes = weeklyHours.reduce((acc, h) => acc + h * 60, 0)
    return (totalMinutes / 60).toFixed(1)
  }, [weeklyHours])
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Study Dashboard</h1>
        <p className="dashboard-subtitle">Track your focus progress and productivity trends</p>
      </header>
      
      {/* Stats Cards Grid */}
      <div className="dashboard-stats-grid">
        <StatsCard
          title="Total Focus Time"
          value={`${totalHoursThisWeek} hrs`}
          subtitle="This week"
          icon={Clock}
          iconColor="#38bdf8"
        />
        <StatsCard
          title="Sessions Completed"
          value={sessionsCompleted}
          subtitle="Work sessions"
          icon={Target}
          iconColor="#22c55e"
        />
        <StatsCard
          title="Goals Worked On"
          value={goalsCompleted}
          subtitle="This week"
          icon={Zap}
          iconColor="#a855f7"
        />
        <StatsCard
          title="Focus Streak"
          value={`${focusStreak} ${focusStreak === 1 ? 'day' : 'days'}`}
          subtitle="Consecutive days"
          icon={Flame}
          iconColor="#f59e0b"
        />
      </div>
      
      {/* Chart and Distraction Summary */}
      <div className="dashboard-content-grid">
        <FocusChart weeklyHours={weeklyHours} />
        
        {/* Distraction Summary */}
        <div className="distraction-summary glass-sm">
          <h3 className="distraction-summary-title">
            <AlertCircle className="w-4 h-4" />
            Distraction Summary
          </h3>
          <div className="distraction-summary-content">
            <div className="distraction-stat">
              <span className="distraction-stat-value">{distractions}</span>
              <span className="distraction-stat-label">Distractions this week</span>
            </div>
            {distractions === 0 ? (
              <p className="distraction-empty">No distractions logged - great focus!</p>
            ) : distractions < 5 ? (
              <p className="distraction-good">Good focus discipline!</p>
            ) : distractions < 10 ? (
              <p className="distraction-warning">Room for improvement</p>
            ) : (
              <p className="distraction-high">Consider improving your environment</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
