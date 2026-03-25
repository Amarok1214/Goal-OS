import { useState, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus } from 'lucide-react'
import { useScheduleStore, DAY_NAMES, getWeekStart } from '../../store/scheduleStore'
import { useGoalStore } from '../../store/goalStore'
import { ScheduleBlockItem } from './ScheduleBlock'
import { BlockForm } from './BlockForm'
import { WeeklySummary } from './WeeklySummary'

// Time slots from 6 AM to 11 PM (17 hours)
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6) // 6, 7, 8, ..., 23
const ROW_HEIGHT = 60 // pixels per hour

export function WeeklyPlanner() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart())
  const [showBlockForm, setShowBlockForm] = useState(false)
  const [editingBlock, setEditingBlock] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const [selectedTime, setSelectedTime] = useState<string>('09:00')
  
  const { getBlocksForWeek } = useScheduleStore()
  const { goals } = useGoalStore()
  
  // Get blocks for current week
  const weekBlocks = useMemo(() => {
    return getBlocksForWeek(currentWeekStart)
  }, [getBlocksForWeek, currentWeekStart])
  
  // Format week range display
  const weekRangeDisplay = useMemo(() => {
    const endOfWeek = new Date(currentWeekStart)
    endOfWeek.setDate(endOfWeek.getDate() + 6)
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    const startStr = currentWeekStart.toLocaleDateString('en-US', options)
    const endStr = endOfWeek.toLocaleDateString('en-US', options)
    
    return `${startStr} - ${endStr}`
  }, [currentWeekStart])
  
  // Navigation functions
  const goToPreviousWeek = () => {
    const prev = new Date(currentWeekStart)
    prev.setDate(prev.getDate() - 7)
    setCurrentWeekStart(prev)
  }
  
  const goToNextWeek = () => {
    const next = new Date(currentWeekStart)
    next.setDate(next.getDate() + 7)
    setCurrentWeekStart(next)
  }
  
  const goToToday = () => {
    setCurrentWeekStart(getWeekStart())
  }
  
  // Check if current week is showing today
  const isCurrentWeek = useMemo(() => {
    const todayStart = getWeekStart()
    return currentWeekStart.getTime() === todayStart.getTime()
  }, [currentWeekStart])
  
  // Handle clicking on empty time slot
  const handleSlotClick = (day: number, hour: number) => {
    setSelectedDay(day)
    setSelectedTime(`${hour.toString().padStart(2, '0')}:00`)
    setEditingBlock(null)
    setShowBlockForm(true)
  }
  
  // Handle editing existing block
  const handleEditBlock = (blockId: string) => {
    setEditingBlock(blockId)
    setShowBlockForm(true)
  }
  
  // Handle closing form
  const handleCloseForm = () => {
    setShowBlockForm(false)
    setEditingBlock(null)
  }
  
  // Get current time position (for "now" indicator)
  const nowIndicatorPosition = useMemo(() => {
    if (!isCurrentWeek) return null
    
    const now = new Date()
    const currentDay = (now.getDay() + 6) % 7 // Monday = 0
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    // Only show if within our time range (6 AM - 11 PM)
    if (currentHour < 6 || currentHour > 23) return null
    
    const minutesFrom6AM = (currentHour - 6) * 60 + currentMinute
    const topPosition = (minutesFrom6AM / 60) * ROW_HEIGHT
    
    return { day: currentDay, top: topPosition }
  }, [isCurrentWeek])
  
  return (
    <div className="planner-container">
      {/* Header */}
      <div className="planner-header">
        <div className="flex items-center gap-3">
          <div className="planner-icon">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="planner-title">Weekly Study Planner</h2>
            <p className="planner-subtitle">Plan your week, reduce decision fatigue</p>
          </div>
        </div>
        
        {/* Add block button */}
        <button
          onClick={() => {
            setEditingBlock(null)
            setSelectedDay(0)
            setSelectedTime('09:00')
            setShowBlockForm(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Block
        </button>
      </div>
      
      {/* Week Navigation */}
      <div className="planner-nav">
        <div className="flex items-center gap-2">
          <button onClick={goToPreviousWeek} className="nav-btn">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="week-display">
            <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="week-range">{weekRangeDisplay}</span>
          </div>
          
          <button onClick={goToNextWeek} className="nav-btn">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        {!isCurrentWeek && (
          <button onClick={goToToday} className="today-btn">
            Today
          </button>
        )}
      </div>
      
      {/* Grid */}
      <div className="planner-grid-wrapper">
        <div className="planner-grid">
          {/* Day headers */}
          <div className="grid-header">
            <div className="time-column-header"></div>
            {DAY_NAMES.map((day, index) => (
              <div
                key={day}
                className={`day-header ${nowIndicatorPosition?.day === index ? 'today' : ''}`}
              >
                <span className="day-name">{day}</span>
                <span className="day-date">
                  {new Date(currentWeekStart.getTime() + index * 24 * 60 * 60 * 1000).getDate()}
                </span>
              </div>
            ))}
          </div>
          
          {/* Time grid */}
          <div className="grid-body">
            {/* Time column */}
            <div className="time-column">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="time-slot-label"
                  style={{ height: ROW_HEIGHT }}
                >
                  <Clock className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span className="time-label">
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Day columns */}
            {DAY_NAMES.map((_, dayIndex) => (
              <div key={dayIndex} className="day-column">
                {/* Hour slots */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="hour-slot"
                    style={{ height: ROW_HEIGHT }}
                    onClick={() => handleSlotClick(dayIndex, hour)}
                  >
                    {/* Slot border */}
                    <div className="slot-border" />
                  </div>
                ))}
                
                {/* Blocks for this day */}
                {weekBlocks
                  .filter((block) => block.dayOfWeek === dayIndex)
                  .map((block) => (
                    <ScheduleBlockItem
                      key={block.id}
                      block={block}
                      rowHeight={ROW_HEIGHT}
                      goal={block.goalId ? goals.find((g) => g.id === block.goalId) : undefined}
                      onEdit={() => handleEditBlock(block.id)}
                    />
                  ))}
                
                {/* Now indicator */}
                {nowIndicatorPosition?.day === dayIndex && (
                  <div
                    className="now-indicator"
                    style={{ top: nowIndicatorPosition.top }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Weekly Summary */}
      <WeeklySummary />
      
      {/* Block Form Modal */}
      <AnimatePresence>
        {showBlockForm && (
          <BlockForm
            blockId={editingBlock}
            defaultDay={selectedDay}
            defaultTime={selectedTime}
            weekStart={currentWeekStart}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
