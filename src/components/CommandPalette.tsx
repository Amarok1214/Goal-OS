import { useEffect, useState } from 'react'
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
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
    >
      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-sky-900/30 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Dialog */}
      <div className="glass rounded-xl shadow-2xl overflow-hidden z-50 border border-sky-200/30">
        <div className="flex items-center border-b border-sky-200/30 px-4">
          <Search className="w-5 h-5 text-sky-500" />
          <Command.Input
            value={searchValue}
            onValueChange={setSearchValue}
            className="flex-1 bg-transparent border-none outline-none px-3 py-4 text-sky-800 placeholder-sky-400"
            placeholder="Search goals, actions..."
          />
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-sky-100"
          >
            <X className="w-4 h-4 text-sky-500" />
          </button>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sky-500">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigation" className="mb-2">
            <Command.Item
              onSelect={() => {
                onNavigateToGoals()
                setOpen(false)
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-sky-100 data-[selected=true]:bg-sky-100 text-sky-800"
            >
              <Target className="w-4 h-4 text-sky-600" />
              <span>Go to Goals</span>
            </Command.Item>
            <Command.Item
              onSelect={() => {
                onNavigateToToday()
                setOpen(false)
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-sky-100 data-[selected=true]:bg-sky-100 text-sky-800"
            >
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>Go to Today</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Actions" className="mb-2">
            <Command.Item
              onSelect={() => {
                onOpenGoalForm()
                setOpen(false)
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-sky-100 data-[selected=true]:bg-sky-100 text-sky-800"
            >
              <Plus className="w-4 h-4 text-sky-600" />
              <span>Quick Add Goal</span>
            </Command.Item>
          </Command.Group>

          {goals.length > 0 && (
            <Command.Group heading="Goals" className="mb-2">
              {goals
                .filter(goal => 
                  goal.title.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((goal) => (
                  <Command.Item
                    key={goal.id}
                    onSelect={handleGoalSelect}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-sky-100 data-[selected=true]:bg-sky-100 text-sky-800"
                  >
                    <Target className="w-4 h-4 text-sky-600" />
                    <span>{goal.title}</span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                      goal.status === 'active' ? 'bg-green-100 text-green-700' :
                      goal.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      goal.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {goal.status}
                    </span>
                  </Command.Item>
                ))}
            </Command.Group>
          )}
        </Command.List>

        <div className="border-t border-sky-200/30 px-4 py-2 text-xs text-sky-500 flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-600 font-mono">↑↓</kbd>
          <span>Navigate</span>
          <kbd className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-600 font-mono ml-2">↵</kbd>
          <span>Select</span>
          <kbd className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-600 font-mono ml-2">esc</kbd>
          <span>Close</span>
        </div>
      </div>
    </Command.Dialog>
  )
}
