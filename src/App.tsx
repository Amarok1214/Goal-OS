import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { GoalList, GoalForm } from './components/goals'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="app min-h-screen bg-background text-foreground p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-1">Goal OS</h1>
            <p className="text-muted-foreground">Your goal-focused productivity workspace</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            Add Goal
          </Button>
        </div>
      </header>
      
      <GoalList />

      <GoalForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </div>
  )
}

export default App
