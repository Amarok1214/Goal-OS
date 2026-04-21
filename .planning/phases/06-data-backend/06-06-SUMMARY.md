---
phase: 06-data-backend
plan: "06-06"
subsystem: tasks
tags:
  - tasks
  - priority
  - due-date
  - sorting

dependency_graph:
  requires:
    - 06-01
    - 06-02
    - 06-05
  provides:
    - task-priority
    - task-due-date
    - task-sorting
  affects:
    - GoalCard
    - TaskItem
    - TaskItemCompact

tech_stack:
  added:
    - TaskPriority type
  patterns:
    - Priority-based sorting
    - Due date sorting

key_files:
  created: []
  modified:
    - src/types/index.ts
    - src/store/taskStore.ts
    - src/components/goals/TaskForm.tsx
    - src/components/goals/TaskItem.tsx
    - src/components/goals/TaskItemCompact.tsx
    - src/components/goals/GoalCard.tsx

decisions:
  - Priority defaults to 'medium' to avoid null checks
  - High=red, Medium=yellow, Low=green color scheme
  - Default sort is by priority (high first)
  - Tasks with no due date sort to the end

metrics:
  duration: ~30 min
  completed: 2026-04-21
  tasks: 5
  files: 6
---

# Phase 06 Plan 06: Task Due Dates & Priority Summary

Implemented due date and priority fields for tasks with visual indicators and sorting options.

## Completed Tasks

| Task | Name | Commit |
|------|------|--------|
| 1 | Update Task Type Definitions | e9fbe1b |
| 2 | Update Task Store | e9fbe1b |
| 3 | Update Task Form | e9fbe1b |
| 4 | Update Task Display Components | e9fbe1b |
| 5 | Add Priority Sorting to Goals | 550602c |

## Changes Made

### 1. Task Type Definitions (src/types/index.ts)
- Added `TaskPriority` type: `'high' | 'medium' | 'low'`
- Added `priority: TaskPriority` to Task interface (defaults to 'medium')
- Extended TaskStore with sorting methods

### 2. Task Store (src/store/taskStore.ts)
- Updated `addTask` to accept optional priority parameter
- Added `getTasksSortedByPriority(goalId)` - sorts by priority (high first), completed tasks at bottom
- Added `getTasksSortedByDueDate(goalId)` - sorts by due date (earliest first), null dates at end

### 3. Task Form (src/components/goals/TaskForm.tsx)
- Added priority segmented control with color coding:
  - High = Red (#ef4444)
  - Medium = Yellow (#fbbf24)
  - Low = Green (#4ade80)
- Priority is saved when creating or editing tasks
- Due date already existed in form

### 4. Task Display Components
- **TaskItem.tsx**: Added priority badge display
- **TaskItemCompact.tsx**: Added priority badge and due date display with overdue indicator

### 5. GoalCard Sorting (src/components/goals/GoalCard.tsx)
- Added sort toggle buttons (Priority / Due Date)
- Default sort is by priority
- Applied sorting to all task groups

## Deviation from Plan

None - plan executed exactly as written.

## Self-Check

- [x] Tasks can have due dates set
- [x] Tasks can have priority set (high/medium/low)
- [x] Priority badge displays correctly (color-coded)
- [x] Due dates display correctly
- [x] Tasks sort by priority
- [x] Tasks can sort by due date
