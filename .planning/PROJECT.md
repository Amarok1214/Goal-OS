# Goal OS - Project Overview

## What This Is

A **personal productivity workspace** for students that connects every task to a goal. Built with React + TypeScript + Tailwind, using localStorage for offline-first persistence.

**Core Philosophy:** No floating tasks. Every action connects to an outcome.

## Project Type

**Portfolio Project** - Demonstrates full-stack React skills, state management, and thoughtful UI/UX design.

## Target Users

**Primary:** Students managing coursework, exams, and personal projects
**Secondary:** Anyone wanting structured goal-oriented productivity

## Features (Current)

### Implemented
- ✅ Goal CRUD with status tracking (Active, Paused, Completed, Someday)
- ✅ Task management with subtasks
- ✅ Progress tracking with visual progress bars
- ✅ Today view with overdue/due-soon sections
- ✅ Pomodoro timer with work/break cycles
- ✅ Distraction logging during focus sessions
- ✅ Goal categories (Work, Health, Learning, etc.)
- ✅ Dark theme with glassmorphism UI

### Planned (Phase 5)
- 📊 Study Dashboard with analytics
- 📅 Weekly Study Planner with time blocks

### Deferred
- 📝 Journaling (Phase 3)
- 🔄 Weekly Review template (Phase 3)
- 🔔 Notifications
- 📱 Mobile app

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 + custom CSS |
| Components | shadcn/ui + Lucide icons |
| State | Zustand with localStorage persistence |
| Animations | Framer Motion |
| Charts | Custom SVG (no external library) |

## Data Architecture

```
┌─────────────────────────────────────────┐
│                  Stores                   │
├───────────────┬─────────────────────────┤
│  goalStore    │ Goals + metadata        │
│  taskStore    │ Tasks + subtasks        │
│  focusStore   │ Sessions + distractions │
│  scheduleStore│ (Phase 5) Planner blocks│
└───────────────┴─────────────────────────┘
```

All data persists in localStorage.

## Key Files

```
src/
├── App.tsx                    # Main app with sidebar + views
├── index.css                  # Global styles + CSS variables
├── types/index.ts             # TypeScript interfaces
├── store/
│   ├── goalStore.ts          # Goal state management
│   ├── taskStore.ts          # Task state management
│   ├── focusStore.ts          # Pomodoro + sessions
│   └── scheduleStore.ts       # (Phase 5) Planner blocks
└── components/
    ├── goals/                 # GoalCard, GoalForm, GoalList
    ├── today/                 # TodayView, PomodoroTimer
    ├── dashboard/             # (Phase 5) Dashboard components
    ├── planner/               # (Phase 5) Planner components
    └── ui/                    # shadcn/ui components
```

## Development History

| Date | Milestone |
|------|-----------|
| 2026-03-04 | Project initialized |
| 2026-03-05 | Phase 1 complete - Foundation & Goals |
| 2026-03-06 | Phase 2 complete - Tasks & Progress |
| 2026-03-20 | Phase 4 complete - Focus & Productivity |
| 2026-03-25 | Phase 5 planned - Analytics & Planning |

## Portfolio Highlights

This project demonstrates:

1. **React Architecture** - Component composition, hooks, state management
2. **TypeScript** - Full type safety, interfaces, generics
3. **CSS Styling** - Custom design system, CSS variables, glassmorphism
4. **User Experience** - Intuitive navigation, helpful feedback, dark theme
5. **State Management** - Zustand patterns, localStorage persistence
6. **Performance** - Memoization, efficient re-renders

## Running the Project

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

## Constraints

| Constraint | Implementation |
|------------|----------------|
| Offline-first | localStorage only, no backend |
| Single-user | No auth, no multi-user |
| Simple deployment | Static hosting (Vercel/Netlify) |
| Performance | <500KB bundle (code-splitting future) |

---

*Project documentation - Last updated: 2026-03-25*
