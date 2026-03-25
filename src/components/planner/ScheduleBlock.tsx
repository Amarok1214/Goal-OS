import { motion } from 'framer-motion'
import { Clock, Link, Pencil } from 'lucide-react'
import { ScheduleBlock, timeToMinutes, formatTime } from '../../store/scheduleStore'
import type { Goal } from '../../types'

interface ScheduleBlockItemProps {
  block: ScheduleBlock
  rowHeight: number
  goal?: Goal
  onEdit: () => void
}

export function ScheduleBlockItem({ block, rowHeight, goal, onEdit }: ScheduleBlockItemProps) {
  // Calculate position and height
  const startMinutes = timeToMinutes(block.startTime)
  const endMinutes = timeToMinutes(block.endTime)
  const durationMinutes = endMinutes - startMinutes
  
  // Calculate from 6 AM
  const minutesFrom6AM = startMinutes - (6 * 60)
  const top = (minutesFrom6AM / 60) * rowHeight
  const height = (durationMinutes / 60) * rowHeight
  
  // Determine block color
  const getBlockColor = () => {
    if (block.color) return block.color
    if (block.goalId && goal?.category) {
      const categoryColors: Record<string, string> = {
        work: '#3b82f6',
        health: '#22c55e',
        learning: '#a855f7',
        finance: '#eab308',
        creative: '#ec4899',
        social: '#f97316',
        other: '#64748b',
      }
      return categoryColors[goal.category] || '#3b82f6'
    }
    return '#3b82f6'
  }
  
  const blockColor = getBlockColor()
  const displayTitle = block.goalId && goal ? goal.title : block.title
  
  return (
    <motion.div
      className="schedule-block"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        top,
        height,
        '--block-color': blockColor,
      } as React.CSSProperties}
      onClick={onEdit}
    >
      <div className="block-content">
        <div className="block-title">{displayTitle}</div>
        <div className="block-time">
          <Clock className="w-3 h-3" />
          <span>{formatTime(block.startTime)} - {formatTime(block.endTime)}</span>
        </div>
        {block.goalId && (
          <div className="block-goal-link">
            <Link className="w-3 h-3" />
            <span>{goal?.title || 'Linked goal'}</span>
          </div>
        )}
      </div>
      
      {/* Hover actions */}
      <div className="block-actions">
        <button
          className="block-action-btn"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
        >
          <Pencil className="w-3 h-3" />
        </button>
      </div>
      
      {/* Recurring indicator */}
      {block.recurring && (
        <div className="block-recurring-badge">↻</div>
      )}
    </motion.div>
  )
}
