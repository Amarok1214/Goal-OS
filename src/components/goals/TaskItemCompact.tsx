import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, ChevronRight, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { useTaskStore } from '../../store/taskStore'
import { useFocusStore } from '../../store/focusStore'
import type { Task } from '../../types'

interface TaskItemCompactProps {
  task: Task
  onEdit: (task: Task) => void
  goalId?: string
  isDimmed?: boolean
}

export function TaskItemCompact({ task, onEdit, goalId, isDimmed = false }: TaskItemCompactProps) {
  const { toggleTask, deleteTask, addSubtask, toggleSubtask, deleteSubtask } = useTaskStore()
  const { startPomodoro } = useFocusStore()
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAddSubtask, setShowAddSubtask] = useState(false)
  const [subtaskInput, setSubtaskInput] = useState('')
  const [showIntentionModal, setShowIntentionModal] = useState(false)
  const [intention, setIntention] = useState('')

  const subtasks = task.subtasks || []
  const completedSubtasks = subtasks.filter(s => s.completed).length
  const hasSubtasks = subtasks.length > 0

  const handleToggle = () => {
    toggleTask(task.id)
  }

  const handleDelete = () => {
    deleteTask(task.id)
  }

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      addSubtask(task.id, subtaskInput.trim())
      setSubtaskInput('')
      setShowAddSubtask(false)
    }
  }

  const handleSubtaskToggle = (subtaskId: string) => {
    toggleSubtask(task.id, subtaskId)
  }

  const handleSubtaskDelete = (subtaskId: string) => {
    deleteSubtask(task.id, subtaskId)
  }

  const handleStartFocus = () => {
    setShowIntentionModal(true)
  }

  const handleStartWithIntention = () => {
    startPomodoro(task.id, goalId || '', task.title, intention)
    setShowIntentionModal(false)
    setIntention('')
  }

  return (
    <>
      <motion.div 
        className={`group flex items-center gap-2 py-1.5 px-2 rounded-lg transition-all ${
          isDimmed ? 'opacity-40' : 'hover:bg-white/10'
        } ${task.completed ? 'opacity-50' : ''}`}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: isDimmed ? 0.4 : 1, y: 0 }}
        layout
      >
        {/* Expand/Collapse toggle for subtasks */}
        {hasSubtasks && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-4 h-4 flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        )}
        {!hasSubtasks && <div className="w-4" />}

        {/* Checkbox */}
        <button
          type="button"
          onClick={handleToggle}
          className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-slate-500 hover:border-emerald-400'
          }`}
        >
          {task.completed && <Check className="w-2.5 h-2.5 text-white" />}
        </button>

        {/* Title */}
        <span
          className={`flex-1 text-sm truncate ${
            task.completed ? 'line-through' : ''
          }`}
          style={{ 
            color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)'
          }}
        >
          {task.title}
        </span>

        {/* Subtask count badge */}
        {hasSubtasks && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${
              completedSubtasks === subtasks.length
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-500/20 text-slate-400'
            }`}
          >
            {completedSubtasks}/{subtasks.length}
          </button>
        )}

        {/* + Subtask button (show on hover) */}
        {!hasSubtasks && !task.completed && (
          <button
            type="button"
            onClick={() => setShowAddSubtask(true)}
            className="opacity-0 group-hover:opacity-100 text-xs transition-all shrink-0"
            style={{ color: 'var(--text-muted)' }}
            title="Add subtask"
          >
            + Sub
          </button>
        )}

        {/* Action buttons (show on hover) */}
        {!task.completed && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={handleStartFocus}
              className="p-1 rounded transition-colors"
              style={{ 
                background: 'rgba(251, 191, 36, 0.15)', 
                color: '#fbbf24' 
              }}
              title="Start focus"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="p-1 rounded transition-colors"
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                color: 'var(--text-muted)' 
              }}
              title="Edit task"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="p-1 rounded transition-colors"
              style={{ 
                background: 'rgba(239, 68, 68, 0.15)', 
                color: '#ef4444' 
              }}
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Subtasks */}
      <AnimatePresence>
        {(isExpanded || showAddSubtask) && hasSubtasks && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div 
              className="ml-6 mt-1 space-y-1 border-l-2 pl-3"
              style={{ borderColor: 'rgba(255,255,255,0.15)' }}
            >
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="group flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-white/5"
                >
                  <button
                    type="button"
                    onClick={() => handleSubtaskToggle(subtask.id)}
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all shrink-0 ${
                      subtask.completed
                        ? 'bg-cyan-500 border-cyan-500'
                        : 'border-slate-500 hover:border-cyan-400'
                    }`}
                  >
                    {subtask.completed && <Check className="w-2 h-2 text-white" />}
                  </button>
                  <span
                    className={`flex-1 text-xs ${subtask.completed ? 'line-through' : ''}`}
                    style={{ 
                      color: subtask.completed ? 'var(--text-muted)' : 'var(--text-secondary)'
                    }}
                  >
                    {subtask.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSubtaskDelete(subtask.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity"
                    style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)' }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {/* Add subtask inline */}
              {showAddSubtask ? (
                <div className="flex items-center gap-2 py-1">
                  <div className="w-3.5" />
                  <input
                    type="text"
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    placeholder="Add subtask..."
                    className="flex-1 text-xs px-2 py-1 rounded border"
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      borderColor: 'rgba(255,255,255,0.15)',
                      color: 'var(--text-primary)'
                    }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSubtask()
                      if (e.key === 'Escape') { setShowAddSubtask(false); setSubtaskInput('') }
                    }}
                    onBlur={() => {
                      if (!subtaskInput.trim()) setShowAddSubtask(false)
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="p-1 rounded"
                    style={{ background: '#3b82f6', color: '#fff' }}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddSubtask(true)}
                  className="flex items-center gap-1 text-xs py-1 ml-4"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Plus className="w-3 h-3" />
                  Add subtask
                </button>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Add subtask form for tasks with NO subtasks yet */}
        {showAddSubtask && !hasSubtasks && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-6 mt-1"
          >
            <div className="flex items-center gap-2 py-1">
              <div className="w-3.5" />
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                placeholder="Add subtask..."
                className="flex-1 text-xs px-2 py-1 rounded border"
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: 'var(--text-primary)'
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSubtask()
                  if (e.key === 'Escape') { setShowAddSubtask(false); setSubtaskInput('') }
                }}
                onBlur={() => {
                  if (!subtaskInput.trim()) setShowAddSubtask(false)
                }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="p-1 rounded"
                style={{ background: '#3b82f6', color: '#fff' }}
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intention Modal */}
      {showIntentionModal && (
        <>
          <div className="dialog-overlay" onClick={() => setShowIntentionModal(false)} />
          <div className="dialog-content">
            <h3 className="text-lg font-semibold mb-2 font-display" style={{ color: 'var(--text-primary)' }}>
              🍅 What will you focus on?
            </h3>
            <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Set an intention for this 25-minute Pomodoro session
            </p>
            <input
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="e.g., Complete the research section..."
              className="glass-input w-full px-3 py-2 mb-4 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && intention.trim()) handleStartWithIntention()
                if (e.key === 'Escape') { setShowIntentionModal(false); setIntention('') }
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowIntentionModal(false); setIntention('') }}
                className="btn-outline text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleStartWithIntention}
                disabled={!intention.trim()}
                className="btn-primary text-sm"
                style={{ opacity: intention.trim() ? 1 : 0.5 }}
              >
                Start Focus
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
