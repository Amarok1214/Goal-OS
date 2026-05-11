---
created: 2026-05-11T13:21:35.656Z
title: Fix GoalCard overflow and ensure Planner visibility
area: ui
files:
  - src/components/goals/GoalCard.tsx
  - src/App.tsx
  - src/components/today/TodayView.tsx
  - src/components/planner/WeeklyPlanner.tsx
---

## Problem

Three interconnected layout issues prevent the Planner from staying visible:

1. **GoalCard task list has no height constraint** — As tasks are added, the card grows infinitely. On the Today view or sidebar, this pushes the WeeklyPlanner section below the viewport, making it impossible to see without scrolling past all goals.

2. **No layout structure for stacked sections** — The main column uses no flex/grid containment. Goal cards and Planner blocks stack naturally but the Planner gets pushed down by tall GoalCards. The goal card should either have a fixed max-height with internal scroll, or the layout should be restructured into panes.

3. **Subtask descriptions don't exist** — Subtasks are title-only with no way to add notes, steps, or details. This limits their usefulness for complex multi-step tasks. A `description: string` field on each subtask with inline expand/collapse editing would improve usability.

## Solution

### Layout Fix (Issues 1 & 2)

Option A — Quick fix:
- GoalCard: add `max-height: calc(100vh - 300px)` + `overflow-y: auto` to the task list container
- GoalCard: add `flex-shrink: 0` to prevent the card from collapsing
- Responsive: on mobile, full height; on desktop, constrained

Option B — Two-pane layout (better for planner visibility):
- Left panel: Goal metadata + scrollable/virtualized task list (CSS scroll or react-window)
- Right panel: Planner calendar blocks, always visible
- Can use react-resizable-panels for adjustable split
- This guarantees Planner is never hidden regardless of task count

### Subtask Descriptions (Issue 3)

Data model change:
```ts
interface Subtask {
  id: string
  title: string
  description?: string  // NEW
  completed: boolean
}
```

UI behavior:
- Small chevron/expand icon on hover if description exists
- Click to expand inline description row below task title
- Textarea for inline editing
- Persist to store (localStorage for now, Supabase later)
