# Phase 6 RESEARCH: Data & Backend

## Research Questions

1. How to integrate Supabase with Zustand stores?
2. Best practices for migrating localStorage to Supabase?
3. How to implement global search in React?

---

## Supabase + Zustand Integration

### Pattern: useEffect sync

```typescript
// Concept: Load from Supabase on mount, write to both local and cloud on changes

const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: [],
      fetchGoals: async () => {
        const { data } = await supabase.from('goals').select('*')
        set({ goals: data || [] })
      },
      addGoal: async (goal) => {
        // Optimistic update
        const newGoal = { ...goal, id: crypto.randomUUID() }
        set((state) => ({ goals: [...state.goals, newGoal] }))
        
        // Sync to Supabase
        await supabase.from('goals').insert(newGoal)
      },
      // ...
    }),
    { name: 'goal-os-goals' }
  )
)
```

### Offline Considerations

- Supabase client works offline-ish (writes queue)
- For true offline, consider using `rxdb` or `dexie` as sync layer
- For MVP: Just use network-first, data in localStorage as backup

---

## Data Export/Import

```typescript
// Export all stores to JSON
const exportData = () => {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    goals: goalStore.goals,
    tasks: taskStore.tasks,
    sessions: focusStore.sessions,
    blocks: scheduleStore.blocks,
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `goal-os-export-${new Date().toISOString().split('T')[0]}.json`
  a.click()
}

// Import
const importData = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result)
    goalStore.setGoals(data.goals)
    taskStore.setTasks(data.tasks)
    // ...
  }
  reader.readAsText(file)
}
```

---

## Global Search

### Implementation Options

| Option | Pros | Cons |
|--------|-----|------|
| Filter local state | Simple, fast | Only loaded data |
| Supabase full-text | Scalable, powerful | Extra setup |
| Simple .filter() | Easy to implement | Ok for small data |

### MVP Approach: Local filter

```typescript
const SearchModal = () => {
  const [query, setQuery] = useState('')
  
  const results = useMemo(() => {
    if (!query) return { goals: [], tasks: [] }
    
    const lower = query.toLowerCase()
    return {
      goals: goals.filter(g => g.title.toLowerCase().includes(lower)),
      tasks: tasks.filter(t => t.title.toLowerCase().includes(lower)),
    }
  }, [query, goals, tasks])
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Input value={query} onChange={e => setQuery(e.target.value)} />
      {results.goals.map(g => <GoalResult goal={g} />)}
      {results.tasks.map(t => <TaskResult task={t} />)}
    </Dialog>
  )
}
```

---

## Task Due Dates & Priority

### Schema Changes

```sql
-- In Supabase
ALTER TABLE tasks ADD COLUMN due_date DATE;
ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'medium' 
  CHECK (priority IN ('high', 'medium', 'low'));
```

### UI Components

- **Due Date**: Native date picker (`<input type="date">`)
- **Priority**: Radio group or segmented control with colors:
  - High: Red
  - Medium: Yellow  
  - Low: Green

---

## Settings Page Structure

```
Settings/
├── Pomodoro (durations)
├── Notifications (toggle)
├── Data (export/import buttons)
├── About (version info)
```

All settings stored in a new `settingsStore`:

```typescript
interface Settings {
  pomodoroWork: 25
  pomodoroShortBreak: 5
  pomodoroLongBreak: 15
  notifications: true
  soundEnabled: true
}
```

---

## Validation Architecture

### Test Coverage

| Feature | Test Type | When |
|---------|----------|------|
| Supabase connection | Smoke test | On app load |
| Data sync | Integration | CRUD operations |
| Export valid JSON | Unit test | Button click |
| Search finds items | Unit test | Query execution |
| Settings persist | Integration | Page reload |

### Verification Approach

- Export button produces downloadable JSON
- Search results update as user types
- Settings changes reflect on page reload

---

## Technical Considerations

### Performance

- Zustand + Supabase: Use `useEffect` to sync on mount
- Search: Debounce input (300ms)
- Large exports: Show loading state

### Error Handling

- Network offline: Show toast, keep localStorage
- Import invalid JSON: Show error message
- Supabase error: Log and fallback to localStorage

### Data Migration

Existing localStorage data needs to:
1. Be exported to Supabase on first connect
2. Or be imported manually via settings

For MVP: Keep using localStorage alongside Supabase, use Supabase as primary after confirmed working.

---

## Implementation Hints

1. **Install**: `npm install @supabase/supabase-js`
2. **Client**: Create `src/lib/supabase.ts` with client
3. **Stores**: Add `syncToSupabase()` method to each store
4. **Export**: Single function reading all store states
5. **Search**: Overlay modal, filter current state
6. **Settings**: New page route, settings store