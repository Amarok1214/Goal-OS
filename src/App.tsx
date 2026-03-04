import './App.css'
import { Button } from './components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card'

function App() {
  return (
    <div className="app min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-4">Goal OS</h1>
      <p className="text-muted-foreground mb-8">Your goal-focused productivity workspace</p>
      
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Ready to start achieving your goals?</p>
          <Button>Create Your First Goal</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
