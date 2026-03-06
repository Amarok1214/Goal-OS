import { useState } from 'react'
import { Button } from './components/ui/button'
import { GoalList, GoalForm } from './components/goals'
import { TodayView } from './components/today/TodayView'
import { CommandPalette } from './components/CommandPalette'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [view, setView] = useState<'today' | 'all'>('today')
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  return (
    <div className="app min-h-screen p-8">
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      
      <header className="mb-8 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold mb-2 font-display" style={{ color: '#0c4a6e' }}>Goal OS</h1>
            <p style={{ color: '#0284c7' }}>Your goal-focused productivity workspace</p>
          </div>
          
          {/* View toggle and Add Goal */}
          <div className="flex items-center gap-3">
            <div className="glass-sm flex p-1 gap-1">
              <button
                onClick={() => setView('today')}
                className={view === 'today' ? 'btn-primary' : 'btn-ghost'}
                style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '10px' }}
              >
                Today
              </button>
              <button
                onClick={() => setView('all')}
                className={view === 'all' ? 'btn-primary' : 'btn-ghost'}
                style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '10px' }}
              >
                All Goals
              </button>
            </div>
            
            {/* Cmd+K hint */}
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="text-xs px-2 py-1 rounded bg-white/30 text-sky-600 hover:bg-white/50 transition-colors"
            >
              ⌘K
            </button>
            
            <Button onClick={() => setIsFormOpen(true)} className="btn-primary">
              Add Goal
            </Button>
          </div>
        </div>
      </header>
      
      {view === 'today' ? <TodayView /> : <GoalList />}

      {isFormOpen && (
        <GoalForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
        />
      )}

      {/* Command Palette */}
      <CommandPalette
        open={isPaletteOpen}
        setOpen={setIsPaletteOpen}
        onNavigateToGoals={() => setView('all')}
        onNavigateToToday={() => setView('today')}
        onOpenGoalForm={() => {
          setIsFormOpen(true)
        }}
      />
    </div>
  )
}

export default App
