import { useState } from 'react'
import { GoalList, GoalForm } from './components/goals'
import { TodayView } from './components/today/TodayView'
import { CommandPalette } from './components/CommandPalette'
import { Sun, Target, Plus, Search } from 'lucide-react'
import { useGoalStore } from './store/goalStore'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [view, setView] = useState<'today' | 'all'>('today')
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const { goals } = useGoalStore()

  return (
    <div className="app min-h-screen flex">
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* SIDEBAR */}
      <aside className="sidebar">
        
        {/* Logo / Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" 
              fill="none" stroke="#fff" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div>
            <h1 className="sidebar-title">Goal OS</h1>
            <p className="sidebar-subtitle">Productivity workspace</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="sidebar-section-label">Views</p>
          
          <button
            onClick={() => setView('today')}
            className={`sidebar-nav-item ${view === 'today' ? 'active' : ''}`}
          >
            <Sun className="w-4 h-4" />
            Today
          </button>

          <button
            onClick={() => setView('all')}
            className={`sidebar-nav-item ${view === 'all' ? 'active' : ''}`}
          >
            <Target className="w-4 h-4" />
            All Goals
          </button>
        </nav>

        {/* Actions */}
        <div className="sidebar-actions">
          <p className="sidebar-section-label">Actions</p>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className="sidebar-nav-item accent"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>

          <button
            onClick={() => setIsPaletteOpen(true)}
            className="sidebar-nav-item"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
            <kbd className="sidebar-kbd">⌘K</kbd>
          </button>
        </div>

        {/* Bottom: Goal status summary */}
        <div className="sidebar-footer">
          <p className="sidebar-section-label">Overview</p>
          <div className="sidebar-stat">
            <span className="sidebar-stat-dot active" />
            <span>{goals.filter(g => g.status === 'active').length} Active</span>
          </div>
          <div className="sidebar-stat">
            <span className="sidebar-stat-dot completed" />
            <span>{goals.filter(g => g.status === 'completed').length} Completed</span>
          </div>
          <div className="sidebar-stat">
            <span className="sidebar-stat-dot paused" />
            <span>{goals.filter(g => g.status === 'paused').length} Paused</span>
          </div>
          <div className="sidebar-stat">
            <span className="sidebar-stat-dot someday" />
            <span>{goals.filter(g => g.status === 'someday').length} Someday</span>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {view === 'today' ? <TodayView /> : <GoalList />}
      </main>

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
