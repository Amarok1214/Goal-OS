import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Clock, Link, Repeat, AlertCircle, Trash2 } from 'lucide-react'
import { useScheduleStore, DAY_NAMES, FULL_DAY_NAMES, timeToMinutes } from '../../store/scheduleStore'
import { useGoalStore } from '../../store/goalStore'

interface BlockFormProps {
  blockId: string | null
  defaultDay: number
  defaultTime: string
  weekStart: Date
  onClose: () => void
}

const DURATION_OPTIONS = [
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: '2.5 hours', value: 150 },
  { label: '3 hours', value: 180 },
]

export function BlockForm({ blockId, defaultDay, defaultTime, weekStart, onClose }: BlockFormProps) {
  const { blocks, addBlock, updateBlock, deleteBlock, getBlocksByDay } = useScheduleStore()
  const { goals } = useGoalStore()
  
  // Find existing block if editing
  const existingBlock = blockId ? blocks.find((b) => b.id === blockId) : null
  
  // Form state
  const [title, setTitle] = useState(existingBlock?.title || '')
  const [dayOfWeek, setDayOfWeek] = useState<number>(existingBlock?.dayOfWeek ?? defaultDay)
  const [startTime, setStartTime] = useState(existingBlock?.startTime || defaultTime)
  const [duration, setDuration] = useState(60) // minutes
  const [goalId, setGoalId] = useState<string | undefined>(existingBlock?.goalId)
  const [recurring, setRecurring] = useState(existingBlock?.recurring ?? true)
  const [showOverlapWarning, setShowOverlapWarning] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  
  // Calculate end time based on duration
  const calculateEndTime = (start: string, mins: number): string => {
    const startMinutes = timeToMinutes(start)
    const endMinutes = startMinutes + mins
    const hours = Math.floor(endMinutes / 60) % 24
    const minutes = endMinutes % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }
  
  const endTime = calculateEndTime(startTime, duration)
  
  // Check for overlapping blocks
  useEffect(() => {
    const existingBlocks = getBlocksByDay(dayOfWeek, weekStart)
    const newStart = timeToMinutes(startTime)
    const newEnd = newStart + duration
    
    const hasOverlap = existingBlocks.some((block) => {
      if (blockId && block.id === blockId) return false // Ignore self
      const blockStart = timeToMinutes(block.startTime)
      const blockEnd = timeToMinutes(block.endTime)
      
      // Check overlap
      return (newStart < blockEnd && newEnd > blockStart)
    })
    
    setShowOverlapWarning(hasOverlap)
  }, [dayOfWeek, startTime, duration, getBlocksByDay, weekStart, blockId])
  
  // Update title when goal is selected
  useEffect(() => {
    if (goalId && !title) {
      const selectedGoal = goals.find((g) => g.id === goalId)
      if (selectedGoal) {
        setTitle(selectedGoal.title)
      }
    }
  }, [goalId, goals, title])
  
  // Handle goal selection
  const handleGoalSelect = (selectedGoalId: string) => {
    if (selectedGoalId === '') {
      setGoalId(undefined)
    } else {
      setGoalId(selectedGoalId)
    }
  }
  
  // Handle submit
  const handleSubmit = () => {
    const newErrors: string[] = []
    
    if (!title.trim()) {
      newErrors.push('Title is required')
    }
    
    if (duration <= 0) {
      newErrors.push('Duration must be greater than 0')
    }
    
    // Check if end time is valid (before midnight)
    const endMinutes = timeToMinutes(endTime)
    if (endMinutes <= timeToMinutes(startTime)) {
      newErrors.push('End time must be after start time')
    }
    
    setErrors(newErrors)
    
    if (newErrors.length > 0) return
    
    const blockData = {
      title: title.trim(),
      dayOfWeek: dayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      startTime,
      endTime,
      goalId,
      recurring,
      weekStart: weekStart.toISOString().split('T')[0],
    }
    
    if (blockId) {
      updateBlock(blockId, blockData)
    } else {
      addBlock(blockData)
    }
    
    onClose()
  }
  
  // Handle delete
  const handleDelete = () => {
    if (blockId) {
      deleteBlock(blockId)
      onClose()
    }
  }
  
  // Time options for select
  const timeOptions = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 6
    return `${hour.toString().padStart(2, '0')}:00`
  })
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative glass rounded-2xl p-6 w-full max-w-md"
        style={{ background: 'rgba(26, 47, 69, 0.98)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {blockId ? 'Edit Study Block' : 'Add Study Block'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10"
          >
            <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
        
        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            {errors.map((error, i) => (
              <p key={i} className="text-sm text-red-400">{error}</p>
            ))}
          </div>
        )}
        
        {/* Form fields */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Math Study Session"
              className="glass-input"
              autoFocus
            />
          </div>
          
          {/* Day selector */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Day
            </label>
            <div className="day-selector">
              {FULL_DAY_NAMES.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  className={`day-option ${dayOfWeek === index ? 'selected' : ''}`}
                  onClick={() => setDayOfWeek(index)}
                >
                  {DAY_NAMES[index]}
                </button>
              ))}
            </div>
          </div>
          
          {/* Time row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start time */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                <Clock className="w-4 h-4 inline mr-1" />
                Start Time
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="glass-input"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="glass-input"
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* End time preview */}
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Ends at: {endTime}
          </div>
          
          {/* Overlap warning */}
          {showOverlapWarning && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-500">
                This block overlaps with an existing block
              </span>
            </div>
          )}
          
          {/* Goal selector */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              <Link className="w-4 h-4 inline mr-1" />
              Link to Goal (optional)
            </label>
            <select
              value={goalId || ''}
              onChange={(e) => handleGoalSelect(e.target.value)}
              className="glass-input"
            >
              <option value="">No goal linked</option>
              {goals.filter((g) => g.status === 'active').map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>
          
          {/* Recurring toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Recurring Weekly
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Repeats every {FULL_DAY_NAMES[dayOfWeek]}
                </p>
              </div>
            </div>
            <button
              type="button"
              className={`toggle ${recurring ? 'active' : ''}`}
              onClick={() => setRecurring(!recurring)}
            >
              <div className="toggle-thumb" />
            </button>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {blockId ? (
            <button
              onClick={handleDelete}
              className="btn-danger flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          ) : (
            <div />
          )}
          
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn-primary">
              {blockId ? 'Save Changes' : 'Add Block'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
