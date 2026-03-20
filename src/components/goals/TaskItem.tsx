import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Pencil, Trash2, Calendar, Play, Pause, Plus, Trash2 as TrashSub } from 'lucide-react'
import { Button } from '../ui/button'
import { useTaskStore } from '../../store/taskStore'
import { useFocusStore } from '../../store/focusStore'
import type { Task } from '../../types'

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
  dimmed?: boolean
  goalId?: string
}

export function TaskItem({ task, onEdit, dimmed = false, goalId }: TaskItemProps) {
  const { toggleTask, deleteTask, addSubtask, toggleSubtask, deleteSubtask } = useTaskStore()
  const { activeTaskId, stopPomodoro } = useFocusStore()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [subtaskInput, setSubtaskInput] = useState('')
  const [showIntentionModal, setShowIntentionModal] = useState(false)
  const [intention, setIntention] = useState('')

  const isActive = activeTaskId === task.id
  const subtasks = task.subtasks || []
  const completedSubtasks = subtasks.filter(s => s.completed).length

  const formatDueDate = (date: Date | null): string => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const isOverdue = (): boolean => {
    if (!task.dueDate || task.completed) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(task.dueDate)
    due.setHours(0, 0, 0, 0)
    return due < today
  }

  const handleToggle = () => {
    toggleTask(task.id)
  }

  const handleDelete = () => {
    deleteTask(task.id)
    setIsDeleteOpen(false)
  }

  const { startPomodoro } = useFocusStore()
  
  const handleFocus = () => {
    if (isActive) {
      stopPomodoro()
    } else {
      // Show intention modal before starting
      setShowIntentionModal(true)
    }
  }

  const handleStartWithIntention = () => {
    startPomodoro(task.id, goalId || '', task.title, intention)
    setShowIntentionModal(false)
    setIntention('')
  }

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      addSubtask(task.id, subtaskInput.trim())
      setSubtaskInput('')
    }
  }

  return (
    <>
      <motion.div 
        className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors group ${dimmed ? 'opacity-40' : ''}`}
        animate={{ opacity: dimmed ? 0.4 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ '--tw-bg-opacity': '0.3' } as React.CSSProperties}
      >
        {/* Focus Button */}
        <button
          type="button"
          onClick={handleFocus}
          className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
          style={{
            background: isActive ? '#fbbf24' : 'var(--surface-glass)',
            color: isActive ? '#fff' : 'var(--text-secondary)'
          }}
          title={isActive ? 'Stop Focus' : 'Start Focus'}
        >
          {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
        </button>

        {/* Checkbox */}
        <button
          type="button"
          onClick={handleToggle}
          className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
          style={{
            background: task.completed ? '#4ade80' : 'transparent',
            borderColor: task.completed ? '#4ade80' : 'var(--border-default)'
          }}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>

        {/* Title */}
        <span
          className="flex-1 text-sm"
          style={{
            color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: task.completed ? 'line-through' : 'none'
          }}
        >
          {task.title}
        </span>

        {/* Subtask count badge - expand/collapse toggle */}
        {subtasks.length > 0 ? (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: completedSubtasks === subtasks.length ? 'var(--status-active-bg)' : 'var(--surface-glass)',
              color: completedSubtasks === subtasks.length ? 'var(--status-active)' : 'var(--text-secondary)'
            }}
          >
            {completedSubtasks}/{subtasks.length}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ 
              background: 'var(--surface-glass)',
              color: 'var(--text-muted)'
            }}
            title="Add subtask"
          >
            + Subtask
          </button>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <span
            className="text-xs flex items-center gap-1"
            style={{ color: isOverdue() ? '#f87171' : 'var(--text-muted)' }}
          >
            <Calendar className="w-3 h-3" />
            {formatDueDate(task.dueDate)}
          </span>
        )}

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="h-7 w-7 p-0"
          >
            <Pencil className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            className="h-7 w-7 p-0"
          >
            <Trash2 className="w-3 h-3" style={{ color: '#ef4444' }} />
          </Button>
        </div>
      </motion.div>

      {/* Subtasks - nested under task */}
      {isExpanded && (
        <div className="ml-11 mt-1 space-y-1">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-2 group glass-sm px-3 py-1.5"
            >
              <button
                type="button"
                onClick={() => toggleSubtask(task.id, subtask.id)}
                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: subtask.completed
                    ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)'
                    : 'var(--surface-glass)',
                  border: '1.5px solid var(--border-default)',
                }}
              >
                {subtask.completed && (
                  <Check className="w-2.5 h-2.5" style={{ color: '#fff' }} />
                )}
              </button>
              <span
                className="text-xs flex-1"
                style={{
                  color: subtask.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: subtask.completed ? 'line-through' : 'none',
                }}
              >
                {subtask.title}
              </span>
              <button
                type="button"
                onClick={() => deleteSubtask(task.id, subtask.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: '#f87171' }}
              >
                <TrashSub className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {/* Add subtask input */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="glass-input text-xs py-1.5 px-3 flex-1"
              placeholder="Add a sub-task..."
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSubtask()
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="btn-primary px-3 py-1.5 text-xs"
              style={{ borderRadius: '10px' }}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteOpen && (
        <>
          <div
            className="dialog-overlay"
            onClick={() => setIsDeleteOpen(false)}
          />
          <div className="dialog-content">
            <h3 className="text-xl font-semibold mb-2 font-display" style={{ color: 'var(--text-primary)' }}>
              Delete Task
            </h3>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                className="btn-outline"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="btn-danger"
              >
                Delete
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Intention Modal for Pomodoro */}
      {showIntentionModal && (
        <>
          <div
            className="dialog-overlay"
            onClick={() => setShowIntentionModal(false)}
          />
          <div className="dialog-content">
            <h3 className="text-xl font-semibold mb-2 font-display" style={{ color: 'var(--text-primary)' }}>
              🍅 What will you accomplish?
            </h3>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              Set an intention for this 25-minute Pomodoro session
            </p>
            <input
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="e.g., Write the introduction..."
              className="glass-input w-full px-4 py-3 mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && intention.trim()) {
                  handleStartWithIntention()
                }
              }}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => { setShowIntentionModal(false); setIntention('') }}
                className="btn-outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartWithIntention}
                disabled={!intention.trim()}
                className="btn-primary"
                style={{ 
                  background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                  opacity: intention.trim() ? 1 : 0.5
                }}
              >
                Start Session
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
