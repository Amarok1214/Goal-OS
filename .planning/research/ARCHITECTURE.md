# Architecture Patterns

**Domain:** Goal-focused productivity web app
**Researched:** 2026-03-04

## Recommended Architecture

### Overview
Single-page application (SPA) with client-side routing. Offline-first with localStorage persistence. Component-based architecture with Zustand for state management.

```
┌─────────────────────────────────────────────────────────┐
│                      App Shell                           │
│  ┌─────────────┐  ┌──────────────────────────────────┐  │
│  │  Sidebar    │  │         Main Content              │  │
│  │  - Goals    │  │  ┌────────────────────────────┐  │  │
│  │  - Today    │  │  │    Route Content            │  │  │
│  │  - Reviews  │  │  │    (Goal Detail, Today,    │  │  │
│  │             │  │  │     Review Form, etc.)      │  │  │
│  └─────────────┘  │  └────────────────────────────┘  │  │
│                   └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `App.tsx` | Root layout, routing, error boundary | All major components |
| `GoalStore` | Global state: goals, tasks, journal entries | Via Zustand hooks |
| `Sidebar` | Navigation, goal list quick access | Uses store for goal list |
| `GoalList` | Display all goals with status filters | GoalStore |
| `GoalDetail` | Single goal view with tasks, progress, journal | GoalStore |
| `TaskItem` | Single task with checkbox, inline edit | GoalStore |
| `ProgressBar` | Visual progress calculation | GoalStore, derived |
| `TodayView` | Filtered tasks (due today / active) | GoalStore |
| `JournalEntry` | Goal reflection entries | GoalStore |
| `WeeklyReview` | Review form with prompts | GoalStore |

### Data Flow

```
User Action → Component → Zustand Action → State Update → Component Re-render
                     ↓
              localStorage (via persist middleware)
```

## Patterns to Follow

### Pattern 1: Zustand Store with Persistence

**What:** Use Zustand with persist middleware for automatic localStorage sync.

**When:** All global state that needs to survive refresh.

**Example:**
```typescript
// store/goalStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Goal {
  id: string
  title: string
  description: string
  status: 'active' | 'paused' | 'completed' | 'someday'
  deadline?: string
  createdAt: string
}

interface Task {
  id: string
  goalId: string
  title: string
  completed: boolean
  dueDate?: string
}

interface GoalStore {
  goals: Goal[]
  tasks: Task[]
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void
  toggleTask: (taskId: string) => void
  // ... more actions
}

export const useGoalStore = create<GoalStore>()(
  persist(
    (set) => ({
      goals: [],
      tasks: [],
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, {
          ...goal,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        }]
      })),
      toggleTask: (taskId) => set((state) => ({
        tasks: state.tasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      })),
    }),
    {
      name: 'goal-os-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

### Pattern 2: Computed/Derived State

**What:** Derive UI state from store state using selectors and useMemo.

**When:** Progress bars, filtered lists, counts.

**Example:**
```typescript
// In GoalDetail component
const goals = useGoalStore(state => state.goals)
const tasks = useGoalStore(state => state.tasks)
const goalId = useParams().goalId

const goalTasks = useMemo(
  () => tasks.filter(t => t.goalId === goalId),
  [tasks, goalId]
)

const progress = useMemo(() => {
  if (goalTasks.length === 0) return 0
  const completed = goalTasks.filter(t => t.completed).length
  return Math.round((completed / goalTasks.length) * 100)
}, [goalTasks])
```

### Pattern 3: Form with React Hook Form + Zod

**What:** Uncontrolled form components with schema validation.

**When:** Any form (create goal, add task, journal entry).

**Example:**
```typescript
// components/GoalForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const goalSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  deadline: z.string().optional(),
  status: z.enum(['active', 'paused', 'completed', 'someday'])
})

type GoalFormData = z.infer<typeof goalSchema>

export function GoalForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema)
  })
  const addGoal = useGoalStore(state => state.addGoal)

  const onSubmit = (data: GoalFormData) => {
    addGoal(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      {/* ... */}
    </form>
  )
}
```

### Pattern 4: shadcn/ui Component Usage

**What:** Copy/paste components you own, customize via props/Tailwind.

**When:** Any UI component (Button, Dialog, Input, Card, etc.).

**Example:**
```typescript
// Using shadcn components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function GoalCard({ goal }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Add task..." />
        <Button>Save</Button>
      </CardContent>
    </Card>
  )
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Prop Drilling
**What:** Passing props through 3+ component layers.
**Why bad:** Fragile, hard to refactor, couples components.
**Instead:** Use Zustand store or Context for shared state.

### Anti-Pattern 2: Duplicate State
**What:** Storing derived data in state that could be computed.
**Why bad:** Sync issues, bugs from inconsistent data.
**Instead:** Use useMemo for derived state.

### Anti-Pattern 3: Giant Components
**What:** Single component handling display, logic, and state.
**Why bad:** Hard to test, maintain, or reuse.
**Instead:** Break into smaller components with single responsibility.

## Scalability Considerations

| Concern | At 100 users (MVP) | At 10K users | At 1M users |
|---------|-------------------|--------------|-------------|
| Data size | localStorage (~5MB) | Needs IndexedDB | Cloud sync required |
| State complexity | Single Zustand store | May split stores | Feature-based stores |
| Rendering | Fine as-is | May need virtualization | Lazy loading routes |
| Performance | Fine as-is | Memoization | Code splitting |

## Sources

- Zustand documentation and patterns
- React Hook Form best practices
- shadcn/ui documentation
- React 2026 state management patterns (CodeSearch results)
