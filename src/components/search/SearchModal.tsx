import { useEffect, useState, useRef, useCallback } from 'react'
import { useGoalStore } from '../../store/goalStore'
import { useTaskStore } from '../../store/taskStore'
import { Search, X, Target, CheckSquare, ArrowRight } from 'lucide-react'

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigateToGoal: (goalId: string) => void
  onNavigateToTask: (goalId: string, taskId: string) => void
}

interface SearchResult {
  id: string
  type: 'goal' | 'task'
  title: string
  goalId?: string
  status?: string
}

export function SearchModal({ 
  open, 
  onOpenChange,
  onNavigateToGoal,
  onNavigateToTask 
}: SearchModalProps) {
  const { goals } = useGoalStore()
  const { tasks } = useTaskStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ goals: SearchResult[]; tasks: SearchResult[] }>({
    goals: [],
    tasks: []
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
    if (!open) {
      setQuery('')
      setResults({ goals: [], tasks: [] })
      setSelectedIndex(0)
    }
  }, [open])

  // Handle Ctrl+K to open modal (global handler)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (!open) {
          onOpenChange(true)
        }
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  // Handle Escape to close
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        e.preventDefault()
        onOpenChange(false)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  // Debounced search
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ goals: [], tasks: [] })
      return
    }

    const lowerQuery = searchQuery.toLowerCase()

    // Filter goals
    const matchedGoals = goals
      .filter(goal => goal.title.toLowerCase().includes(lowerQuery))
      .slice(0, 5)
      .map(goal => ({
        id: goal.id,
        type: 'goal' as const,
        title: goal.title,
        goalId: goal.id,
        status: goal.status
      }))

    // Filter tasks
    const matchedTasks = tasks
      .filter(task => task.title.toLowerCase().includes(lowerQuery))
      .slice(0, 10)
      .map(task => ({
        id: task.id,
        type: 'task' as const,
        title: task.title,
        goalId: task.goalId
      }))

    setResults({ goals: matchedGoals, tasks: matchedTasks })
    setSelectedIndex(0)
  }, [goals, tasks])

  // Debounce the search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, performSearch])

  // Calculate total results count for navigation
  const totalResults = results.goals.length + results.tasks.length

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, totalResults - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && totalResults > 0) {
      e.preventDefault()
      selectCurrentResult()
    }
  }

  const selectCurrentResult = () => {
    let currentIndex = 0
    for (const goal of results.goals) {
      if (currentIndex === selectedIndex) {
        onNavigateToGoal(goal.id)
        onOpenChange(false)
        return
      }
      currentIndex++
    }
    for (const task of results.tasks) {
      if (currentIndex === selectedIndex && task.goalId) {
        onNavigateToTask(task.goalId, task.id)
        onOpenChange(false)
        return
      }
      currentIndex++
    }
  }

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'goal') {
      onNavigateToGoal(result.id)
    } else if (result.type === 'task' && result.goalId) {
      onNavigateToTask(result.goalId, result.id)
    }
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search goals and tasks"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal */}
      <div 
        className="relative rounded-xl shadow-2xl overflow-hidden border w-full max-w-lg mx-4"
        style={{
          background: 'rgba(26, 47, 69, 0.95)',
          borderColor: 'var(--border-default)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Search Input */}
        <div className="flex items-center border-b px-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <Search className="w-5 h-5 shrink-0" style={{ color: 'var(--text-secondary)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none px-3 py-4"
            style={{ color: 'var(--text-primary)' }}
            placeholder="Search goals and tasks..."
            autoFocus
          />
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 rounded hover:bg-white/10 shrink-0"
          >
            <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {query && results.goals.length === 0 && results.tasks.length === 0 && (
            <div className="py-8 text-center" style={{ color: 'var(--text-muted)' }}>
              No results found for "{query}"
            </div>
          )}

          {!query && (
            <div className="py-8 text-center" style={{ color: 'var(--text-muted)' }}>
              Start typing to search...
            </div>
          )}

          {/* Goals Section */}
          {results.goals.length > 0 && (
            <div className="px-2 pb-2">
              <div 
                className="text-xs font-semibold uppercase tracking-wider px-2 py-2"
                style={{ color: 'var(--text-muted)' }}
              >
                Goals
              </div>
              {results.goals.map((goal, idx) => {
                const isSelected = selectedIndex === idx
                return (
                  <button
                    key={goal.id}
                    onClick={() => handleResultClick(goal)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-left transition-colors"
                    style={{ 
                      background: isSelected ? 'var(--surface-glass-hover)' : 'transparent',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <Target className="w-4 h-4 shrink-0" style={{ color: 'var(--text-accent)' }} />
                    <span className="flex-1 truncate">{goal.title}</span>
                    {goal.status && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          background: goal.status === 'active' ? 'var(--status-active-bg)' :
                                     goal.status === 'completed' ? 'var(--status-completed-bg)' :
                                     goal.status === 'paused' ? 'var(--status-paused-bg)' :
                                     'var(--status-someday-bg)',
                          color: goal.status === 'active' ? 'var(--status-active)' :
                                 goal.status === 'completed' ? 'var(--status-completed)' :
                                 goal.status === 'paused' ? 'var(--status-paused)' :
                                 'var(--status-someday)'
                        }}
                      >
                        {goal.status}
                      </span>
                    )}
                    <ArrowRight className="w-3 h-3 shrink-0" style={{ color: 'var(--text-muted)' }} />
                  </button>
                )
              })}
            </div>
          )}

          {/* Tasks Section */}
          {results.tasks.length > 0 && (
            <div className="px-2 pt-2 pb-2" style={{ borderTop: results.goals.length > 0 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div 
                className="text-xs font-semibold uppercase tracking-wider px-2 py-2"
                style={{ color: 'var(--text-muted)' }}
              >
                Tasks
              </div>
              {results.tasks.map((task, idx) => {
                const isSelected = selectedIndex === results.goals.length + idx
                const goal = goals.find(g => g.id === task.goalId)
                return (
                  <button
                    key={task.id}
                    onClick={() => handleResultClick(task)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-left transition-colors"
                    style={{ 
                      background: isSelected ? 'var(--surface-glass-hover)' : 'transparent',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <CheckSquare className="w-4 h-4 shrink-0" style={{ color: 'var(--text-accent)' }} />
                    <span className="flex-1 truncate">{task.title}</span>
                    {goal && (
                      <span className="text-xs truncate shrink-0" style={{ color: 'var(--text-muted)' }}>
                        {goal.title}
                      </span>
                    )}
                    <ArrowRight className="w-3 h-3 shrink-0" style={{ color: 'var(--text-muted)' }} />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="border-t px-4 py-2 text-xs flex items-center gap-2" 
          style={{ 
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)'
          }}
        >
          <kbd className="px-1.5 py-0.5 rounded font-mono" style={{ 
            background: 'var(--surface-glass)', 
            color: 'var(--text-secondary)'
          }}>↑↓</kbd>
          <span>Navigate</span>
          <kbd className="px-1.5 py-0.5 rounded font-mono ml-2" style={{ 
            background: 'var(--surface-glass)', 
            color: 'var(--text-secondary)'
          }}>↵</kbd>
          <span>Select</span>
          <kbd className="px-1.5 py-0.5 rounded font-mono ml-2" style={{ 
            background: 'var(--surface-glass)', 
            color: 'var(--text-secondary)'
          }}>esc</kbd>
          <span>Close</span>
        </div>
      </div>
    </div>
  )
}
