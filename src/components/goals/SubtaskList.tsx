import { useState } from 'react'
import { useGoalStore } from '../../store/goalStore'
import { Plus, Trash2, Check } from 'lucide-react'
import type { Goal } from '../../types'

interface SubtaskListProps {
  goal: Goal
}

export function SubtaskList({ goal }: SubtaskListProps) {
  const { addSubtask, toggleSubtask, deleteSubtask } = useGoalStore()
  const [input, setInput] = useState('')
  const subtasks = goal.subtasks || []
  const completed = subtasks.filter((s) => s.completed).length
  const progress = subtasks.length > 0
    ? Math.round((completed / subtasks.length) * 100)
    : 0

  const handleAdd = () => {
    if (input.trim()) {
      addSubtask(goal.id, input.trim())
      setInput('')
    }
  }

  return (
    <div className="mt-3">
      {/* Progress bar */}
      {subtasks.length > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1"
            style={{ color: '#0369a1' }}>
            <span>Progress</span>
            <span>{completed}/{subtasks.length} done</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtask list */}
      <div className="space-y-1 mb-2">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="flex items-center gap-2 group glass-sm px-3 py-1.5"
          >
            <button
              onClick={() => toggleSubtask(goal.id, subtask.id)}
              className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: subtask.completed
                  ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)'
                  : 'rgba(186,230,253,0.4)',
                border: '1.5px solid rgba(125,211,252,0.6)',
              }}
            >
              {subtask.completed && (
                <Check className="w-2.5 h-2.5" style={{ color: '#fff' }} />
              )}
            </button>
            <span
              className="text-xs flex-1"
              style={{
                color: subtask.completed ? '#7dd3fc' : '#0369a1',
                textDecoration: subtask.completed ? 'line-through' : 'none',
              }}
            >
              {subtask.title}
            </span>
            <button
              onClick={() => deleteSubtask(goal.id, subtask.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: '#f87171' }}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Add subtask input */}
      <div className="flex gap-2">
        <input
          className="glass-input text-xs py-1.5 px-3 flex-1"
          placeholder="Add a sub-task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="btn-primary px-3 py-1.5 text-xs"
          style={{ borderRadius: '10px' }}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
