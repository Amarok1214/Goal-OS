import { useMemo } from 'react'
import { Clock, Calendar, Target, CheckCircle } from 'lucide-react'
import { useScheduleStore, getWeekStart } from '../../store/scheduleStore'
import { useGoalStore } from '../../store/goalStore'

export function WeeklySummary() {
  const { getBlocksForWeek, getTotalPlannedMinutes } = useScheduleStore()
  const { goals } = useGoalStore()
  const currentWeekStart = getWeekStart()
  
  const stats = useMemo(() => {
    const weekBlocks = getBlocksForWeek(currentWeekStart)
    const totalMinutes = getTotalPlannedMinutes(currentWeekStart)
    
    // Hours as decimal
    const totalHours = (totalMinutes / 60).toFixed(1)
    
    // Unique goals linked
    const linkedGoalIds = [...new Set(weekBlocks.filter((b) => b.goalId).map((b) => b.goalId))]
    const linkedGoals = linkedGoalIds
      .map((id) => goals.find((g) => g.id === id))
      .filter(Boolean)
    
    // Block count
    const blockCount = weekBlocks.length
    
    // Days with blocks
    const daysWithBlocks = new Set(weekBlocks.map((b) => b.dayOfWeek)).size
    
    return {
      totalHours,
      totalMinutes,
      linkedGoals: linkedGoals.length,
      blockCount,
      daysWithBlocks,
    }
  }, [getBlocksForWeek, getTotalPlannedMinutes, currentWeekStart, goals])
  
  return (
    <div className="planner-summary">
      <div className="glass summary-card">
        <div 
          className="summary-icon"
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 10, 
            background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}
        >
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div className="summary-value">{stats.totalHours}h</div>
        <div className="summary-label">Planned This Week</div>
      </div>
      
      <div className="glass summary-card">
        <div 
          className="summary-icon"
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 10, 
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}
        >
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div className="summary-value">{stats.blockCount}</div>
        <div className="summary-label">Study Blocks</div>
      </div>
      
      <div className="glass summary-card">
        <div 
          className="summary-icon"
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 10, 
            background: 'linear-gradient(135deg, #a855f7, #9333ea)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}
        >
          <Target className="w-5 h-5 text-white" />
        </div>
        <div className="summary-value">{stats.linkedGoals}</div>
        <div className="summary-label">Goals Linked</div>
      </div>
      
      <div className="glass summary-card">
        <div 
          className="summary-icon"
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 10, 
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}
        >
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div className="summary-value">{stats.daysWithBlocks}/7</div>
        <div className="summary-label">Days Planned</div>
      </div>
    </div>
  )
}
