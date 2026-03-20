import { useEffect, useState, useRef } from 'react'
import { Command } from 'cmdk'
import { useGoalStore } from '../store/goalStore'
import { Target, Plus, Calendar, Search, X } from 'lucide-react'

interface CommandPaletteProps {
  open: boolean
  setOpen: (open: boolean) => void
  onNavigateToGoals: () => void
  onNavigateToToday: () => void
  onOpenGoalForm: () => void
}

export function CommandPalette({ 
  open, 
  setOpen, 
  onNavigateToGoals, 
  onNavigateToToday,
  onOpenGoalForm 
}: CommandPaletteProps) {
  const { goals } = useGoalStore()
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, setOpen])

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const handleGoalSelect = () => {
    onNavigateToGoals()
    setOpen(false)
    setSearchValue('')
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Menu"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
        style={{ 
          zIndex: -1,
          isolation: 'isolate'
        }}
        onClick={() => setOpen(false)}
      />
      
      {/* Dialog */}
      <div 
        className="glass rounded-xl shadow-2xl overflow-hidden border w-full max-w-lg mx-4"
        style={{
          background: 'rgba(26, 47, 69, 0.95)',
          borderColor: 'var(--border-default)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center border-b px-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <Search className="w-5 h-5 shrink-0" style={{ color: 'var(--text-secondary)' }} />
          <Command.Input
            ref={inputRef}
            value={searchValue}
            onValueChange={setSearchValue}
            className="flex-1 bg-transparent border-none outline-none px-3 py-4"
            style={{ color: 'var(--text-primary)' }}
            placeholder="Search goals, actions..."
            autoFocus
          />
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-white/10 shrink-0"
          >
            <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center" style={{ color: 'var(--text-muted)' }}>
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigation" className="mb-2 [&>[cmdk-group-heading]]:text-xs [&>[cmdk-group-heading]]:font-semibold [&>[cmdk-group-heading]]:uppercase [&>[cmdk-group-heading]]:tracking-wider [&>[cmdk-group-heading]]:mb-2 [&>[cmdk-group-heading]]:px-2 [&>[cmdk-group-heading]]:text-[var(--text-muted)]">
            <Command.Item
              onSelect={() => {
                onNavigateToGoals()
                setOpen(false)
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer data-[selected=true]:bg-[var(--surface-glass-hover)]"
              style={{ color: 'var(--text-primary)' }}
            >
              <Target className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span>Go to Goals</span>
            </Command.Item>
            <Command.Item
              onSelect={() => {
                onNavigateToToday()
                setOpen(false)
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer data-[selected=true]:bg-[var(--surface-glass-hover)]"
              style={{ color: 'var(--text-primary)' }}
            >
              <Calendar className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span>Go to Today</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Actions" className="mb-2 [&>[cmdk-group-heading]]:text-xs [&>[cmdk-group-heading]]:font-semibold [&>[cmdk-group-heading]]:uppercase [&>[cmdk-group-heading]]:tracking-wider [&>[cmdk-group-heading]]:mb-2 [&>[cmdk-group-heading]]:px-2 [&>[cmdk-group-heading]]:text-[var(--text-muted)]">
            <Command.Item
              onSelect={() => {
                onOpenGoalForm()
                setOpen(false)
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer data-[selected=true]:bg-[var(--surface-glass-hover)]"
              style={{ color: 'var(--text-primary)' }}
            >
              <Plus className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span>Quick Add Goal</span>
            </Command.Item>
          </Command.Group>

          {goals.length > 0 && (
            <Command.Group heading="Goals" className="mb-2 [&>[cmdk-group-heading]]:text-xs [&>[cmdk-group-heading]]:font-semibold [&>[cmdk-group-heading]]:uppercase [&>[cmdk-group-heading]]:tracking-wider [&>[cmdk-group-heading]]:mb-2 [&>[cmdk-group-heading]]:px-2 [&>[cmdk-group-heading]]:text-[var(--text-muted)]">
              {goals
                .filter(goal => 
                  goal.title.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((goal) => (
                  <Command.Item
                    key={goal.id}
                    onSelect={handleGoalSelect}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer data-[selected=true]:bg-[var(--surface-glass-hover)]"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Target className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
                    <span>{goal.title}</span>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{
                      background: goal.status === 'active' ? 'var(--status-active-bg)' :
                                 goal.status === 'completed' ? 'var(--status-completed-bg)' :
                                 goal.status === 'paused' ? 'var(--status-paused-bg)' :
                                 'var(--status-someday-bg)',
                      color: goal.status === 'active' ? 'var(--status-active)' :
                             goal.status === 'completed' ? 'var(--status-completed)' :
                             goal.status === 'paused' ? 'var(--status-paused)' :
                             'var(--status-someday)'
                    }}>
                      {goal.status}
                    </span>
                  </Command.Item>
                ))}
            </Command.Group>
          )}
        </Command.List>

        <div className="border-t px-4 py-2 text-xs flex items-center gap-2" style={{ 
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)'
        }}>
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
    </Command.Dialog>
  )
}
