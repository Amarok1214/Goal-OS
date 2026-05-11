---
created: 2026-05-11T12:37:37.247Z
title: Make project mobile-friendly with responsive components
area: ui
files:
  - src/components/goals/GoalCard.tsx
  - src/components/goals/TaskItemCompact.tsx
  - src/components/goals/TaskItem.tsx
  - src/components/goals/TaskForm.tsx
  - src/components/today/TodayView.tsx
  - src/components/today/PomodoroTimer.tsx
  - src/components/settings/Settings.tsx
  - src/components/dashboard/Dashboard.tsx
  - src/components/planner/WeeklyPlanner.tsx
  - src/components/search/SearchModal.tsx
  - src/App.tsx
---

## Problem

The app is currently designed for desktop screens. Components use fixed widths, horizontal layouts like 3-column grids, and positioning that doesn't adapt to mobile screens (under 768px). Key issues:

- GoalCard grid uses `sm:grid-cols-2 lg:grid-cols-3` but items don't stack well on mobile
- TodayView and settings assume wide layout
- PomodoroTimer with its circular timer and controls needs mobile-friendly sizing
- Sidebar navigation likely takes too much space on small screens
- Dashboard charts and stats cards need responsive arrangement
- WeeklyPlanner's 7-day grid with hour slots is challenging on mobile
- Search modal might not overlay properly on small screens
- General: horizontal padding/margins may overflow, touch targets may be too small

## Solution

Implement responsive design across the entire app:

1. **Nav/Sidebar**: Collapse to bottom nav bar or hamburger menu on mobile
2. **Goal Cards**: Stack vertically (1 column) on mobile, 2 on tablet, 3 on desktop
3. **Pomodoro Timer**: Scale down timer circle and controls for small screens
4. **Dashboard**: Reorder stats cards to stack vertically
5. **Weekly Planner**: Use scrollable horizontal grid or condensed mobile layout
6. **Settings**: Full-width form elements on mobile
7. **Search Modal**: Full-screen on mobile, centered overlay on desktop
8. **Touch targets**: Ensure minimum 44x44px tap targets
9. **Margins/Padding**: Consistent responsive spacing using Tailwind breakpoints
