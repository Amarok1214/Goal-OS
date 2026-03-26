# Goal OS

> A personal productivity workspace where every task connects to a goal. Built for students who want structured, outcome-focused productivity.

![Dark Theme Preview](docs/preview-dark.png)

## Features

### Study Dashboard
- **Focus Metrics** — Track total focus time, sessions completed, and daily trends
- **Weekly Analytics** — Visual bar chart showing focus distribution across the week
- **Focus Streak** — Consecutive days with completed Pomodoro sessions
- **Distraction Summary** — Insights into focus quality

### Weekly Study Planner
- **7-Day Grid View** — Visual weekly calendar from 6 AM to 11 PM
- **Time Blocks** — Schedule study sessions with start time and duration
- **Goal Linking** — Connect blocks to existing goals for accountability
- **Recurring Blocks** — Repeating weekly schedules
- **Week Navigation** — Jump between weeks easily

### Pomodoro Timer
- **25/5/15 Cycles** — Work, short break, long break with auto-transition
- **Session Intentions** — Set goals before each focus session
- **Distraction Logging** — Track interruptions without losing flow
- **Active Block Indicator** — Shows current schedule block during sessions
- **Browser Notifications** — Alerts when phases complete
- **Audio Chimes** — Pleasant sound when sessions end

### Goal Management
- **Status Tracking** — Active, Paused, Completed, Someday
- **Categories** — Work, Health, Learning, Finance, Creative, Social
- **Progress Rings** — Visual completion percentage
- **Task Groups** — In Progress, Remaining, Completed
- **Deadline Tracking** — Overdue and due-soon indicators
- **Pace Estimation** — "On track" vs "Behind pace"

### Dark Theme
- **Glassmorphism UI** — Modern, frosted-glass aesthetic
- **Eye-Friendly Palette** — Deep blue-gray tones for reduced strain
- **Ambient Animations** — Subtle floating gradient orbs
- **Consistent Typography** — Clear hierarchy with DM Sans + Syne fonts

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS 4 + Custom CSS |
| **Components** | shadcn/ui + Lucide Icons |
| **State** | Zustand + localStorage |
| **Animation** | Framer Motion |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Amarok1214/Goal-OS.git
cd Goal-OS

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── App.tsx                 # Main app with sidebar + view routing
├── index.css               # Global styles, CSS variables, dark theme
├── types/
│   └── index.ts            # TypeScript interfaces
├── store/
│   ├── goalStore.ts        # Goal CRUD operations
│   ├── taskStore.ts        # Task management
│   ├── focusStore.ts       # Pomodoro + analytics helpers
│   └── scheduleStore.ts     # Weekly planner blocks
└── components/
    ├── dashboard/           # Study Dashboard components
    ├── planner/            # Weekly Planner components
    ├── goals/              # Goal, Task, Form components
    ├── today/              # Today View, Pomodoro Timer
    ├── ui/                 # shadcn/ui components
    └── CommandPalette.tsx  # Command palette
```

## Development Timeline

| Date | Phase | Description |
|------|-------|-------------|
| 2026-03-05 | Phase 1 | Foundation & Goals — Project setup, Goal CRUD |
| 2026-03-06 | Phase 2 | Tasks & Progress — Task management, Today view |
| 2026-03-20 | Phase 4 | Focus & Productivity — Pomodoro timer, categories |
| 2026-03-25 | Phase 5 | Analytics & Planning — Dashboard, Weekly Planner |

## What I Learned

This project demonstrates:

- **React Architecture** — Component composition, custom hooks, context patterns
- **TypeScript Proficiency** — Full type safety with interfaces and generics
- **State Management** — Zustand with persistence middleware
- **CSS Design Systems** — Custom properties, glassmorphism, animations
- **User Experience** — Intuitive navigation, helpful feedback, dark mode
- **Systematic Development** — Phase-based planning, requirement tracking

## License

MIT — Feel free to use this for learning or as a starting point for your own projects.
