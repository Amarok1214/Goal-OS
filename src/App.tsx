import { useState } from 'react'
import { Button } from './components/ui/button'
import { GoalList, GoalForm, TodayView } from './components/goals'
import { CommandPalette } from './components/CommandPalette'

type View = 'goals' | 'today'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentView, setCurrentView] = useState<View>('goals')
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
          
          {/* Navigation */}
          <div className="flex items-center gap-4">
            <nav className="flex gap-2">
              <Button
                variant={currentView === 'goals' ? 'default' : 'outline'}
                onClick={() => setCurrentView('goals')}
                className={currentView === 'goals' ? 'btn-primary' : 'btn-outline'}
              >
                Goals
              </Button>
              <Button
                variant={currentView === 'today' ? 'default' : 'outline'}
                onClick={() => setCurrentView('today')}
                className={currentView === 'today' ? 'btn-primary' : 'btn-outline'}
              >
                Today
              </Button>
            </nav>
            
            {/* Cmd+K hint */}
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="text-xs px-2 py-1 rounded bg-white/30 text-sky-600 hover:bg-white/50 transition-colors"
            >
              ⌘K
            </button>
            
            {currentView === 'goals' && (
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="btn-primary"
              >
                Add Goal
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {currentView === 'goals' ? <GoalList /> : <TodayView />}

      {currentView === 'goals' && isFormOpen && (
        <GoalForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
        />
      )}

      {/* Command Palette */}
      <CommandPalette
        open={isPaletteOpen}
        setOpen={setIsPaletteOpen}
        onNavigateToGoals={() => setCurrentView('goals')}
        onNavigateToToday={() => setCurrentView('today')}
        onOpenGoalForm={() => {
          setCurrentView('goals')
          setIsFormOpen(true)
        }}
      />
    </div>
  )
}

export default App
