# ROADMAP: Goal OS

**Created:** 2026-03-04
**Granularity:** Coarse
**Total Phases:** 6
**Last Updated:** 2026-04-21

## Phases

- [x] **Phase 1: Foundation & Goals** - Project setup, state management, localStorage, Goal CRUD
- [x] **Phase 2: Tasks & Progress** - Task management, progress tracking, Today view
- [ ] **Phase 3: Reflection** - Journaling, weekly review
- [x] **Phase 4: Focus & Productivity** - Focus timer, Pomodoro, categories, enhanced progress
- [x] **Phase 5: Analytics & Planning** - Study Dashboard, Weekly Study Planner
- [x] **Phase 6: Data & Backend** - Settings & Export/Import, Data features in progress

---

## Phase Details

### Phase 1: Foundation & Goals

**Goal:** Project scaffolded with working state management, localStorage persistence, and complete Goal CRUD functionality

**Depends on:** Nothing (first phase)

**Requirements:** SETUP-01, SETUP-02, GOAL-01, GOAL-02, GOAL-03, GOAL-04, GOAL-05, DATA-01

**Success Criteria** (what must be TRUE):
1. User can create a new goal with title, description, and deadline
2. User can set and change goal status (Active, Paused, Completed, Someday)
3. User can view all goals in a list showing their status
4. User can edit any goal's title, description, deadline, or status
5. User can delete a goal from the system
6. All data persists across browser refreshes in localStorage

**Plans:** 
- [x] 01-01-PLAN.md — Project Foundation (Vite + React + TypeScript + Tailwind + shadcn/ui)
- [x] 01-02-PLAN.md — State Management (Zustand + localStorage persistence)
- [x] 01-03-PLAN.md — Goal CRUD UI (Forms, Cards, List)
- [x] 02-01-PLAN.md — Task Types & Store
- [x] 02-02-PLAN.md — Task UI Components
- [x] 02-03-PLAN.md — Progress Tracking & Today View

---

### Phase 2: Tasks & Progress

**Goal:** Users can manage tasks under goals with visual progress tracking and daily actions view

**Depends on:** Phase 1

**Requirements:** TASK-01, TASK-02, TASK-03, TASK-04, PROG-01, TODAY-01, TODAY-02

**Success Criteria** (what must be TRUE):
1. User can add new tasks under any specific goal
2. User can mark a task as done or undone (toggle completion)
3. User can edit task title and due date
4. User can delete a task from a goal
5. Each goal shows a visual progress bar that auto-updates as tasks are completed
6. User can see all tasks due today or marked active in a "Today" view
7. User can filter the Today view by "due today" or "active today"

**Plans:** TBD

---

### Phase 3: Reflection

**Goal:** Users can journal about goals and complete structured weekly reviews

**Depends on:** Phase 2

**Requirements:** JOURN-01, JOURN-02, REV-01, REV-02

**Success Criteria** (what must be TRUE):
1. User can create and attach a journal entry to any specific goal
2. User can view all journal entries for a goal in chronological order
3. User can complete a weekly review with prompted questions ("What worked?", "What didn't?", "What's next?")
4. Each weekly review is associated with a specific week/date range

**Plans:** TBD

---

### Phase 4: Focus & Productivity

**Goal:** Enhanced focus features including Pomodoro timer, focus session history, goal categories, and improved progress tracking

**Depends on:** Phase 2

**Requirements:** FOCUS-01, FOCUS-02, CAT-01

**Success Criteria** (what must be TRUE):
1. Focus timer displays elapsed time when focused on a task
2. Pomodoro mode provides 25-min work / 5-min break cycles
3. Goals can be assigned categories (Work, Health, Learning, etc.)
4. Progress bar reflects both task and subtask completion

**Plans:** 
- [x] 04-01-PLAN.md — Focus & Productivity Features

---

### Phase 5: Analytics & Planning

**Goal:** Students can visualize their study patterns through a dashboard and plan their week with a visual study planner

**Depends on:** Phase 4

**Requirements:** DASH-01, DASH-02, DASH-03, PLAN-01, PLAN-02, PLAN-03

**Success Criteria** (what must be TRUE):
1. User can view a dashboard showing focus time stats (hours, sessions, streak)
2. User can see a bar chart of daily focus time for the current week
3. User can schedule study blocks for any day/time in a weekly grid
4. User can link schedule blocks to existing goals
5. User can navigate between weeks in the planner
6. Active schedule block displays in Pomodoro timer when running

**Plans:** 
- [x] 05-01-PLAN.md — Study Dashboard (COMPLETE)
- [x] 05-02-PLAN.md — Weekly Study Planner (COMPLETE)

---

### Phase 6: Data & Backend

**Goal:** Implement data persistence with Supabase, add must-have features (export, settings, search, task due dates, task priority), and create a solid foundation for future features.

**Depends on:** Phase 5

**Requirements:** DATA-01, DATA-02, DATA-03, DATA-04, UX-01, UX-02, UX-03, TASK-01, TASK-02, TASK-03

**Success Criteria** (what must be TRUE):
1. App connects to Supabase and persists all data
2. Existing localStorage data migrates successfully to Supabase
3. JSON export produces downloadable file with all app data
4. JSON import successfully loads exported data
5. Settings page accessible via navigation with saved preferences
6. Customizable Pomodoro durations work and persist
7. Global search finds goals and tasks across the app
8. Tasks can have due dates set and displayed
9. Tasks can have priority (high/medium/low) set and displayed
10. Tasks can be sorted by priority

**Plans:** 
- [ ] 06-01-PLAN.md — Supabase Setup & Client
- [ ] 06-02-PLAN.md — Migrate Stores to Supabase
- [x] 06-03-PLAN.md — Export/Import & Settings (COMPLETE)
- [x] 06-05-PLAN.md — Global Search (COMPLETE)
- [ ] 06-06-PLAN.md — Task Due Dates & Priority

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Goals | 3/3 | Complete | 2026-03-05 |
| 2. Tasks & Progress | 3/3 | Complete | 2026-03-06 |
| 3. Reflection | 0/1 | Not started | - |
| 4. Focus & Productivity | 1/1 | Complete | 2026-03-20 |
| 5. Analytics & Planning | 2/2 | Complete | 2026-03-25 |
| 6. Data & Backend | 2/5 | In progress | 2026-04-21 |

---

## Coverage

| Requirement | Phase | Status |
|-------------|-------|--------|
| GOAL-01 | Phase 1 | Complete |
| GOAL-02 | Phase 1 | Complete |
| GOAL-03 | Phase 1 | Complete |
| GOAL-04 | Phase 1 | Complete |
| GOAL-05 | Phase 1 | Complete |
| TASK-01 | Phase 2 | Complete |
| TASK-02 | Phase 2 | Complete |
| TASK-03 | Phase 2 | Complete |
| TASK-04 | Phase 2 | Complete |
| PROG-01 | Phase 2 | Complete |
| TODAY-01 | Phase 2 | Complete |
| TODAY-02 | Phase 2 | Complete |
| JOURN-01 | Phase 3 | Pending |
| JOURN-02 | Phase 3 | Pending |
| REV-01 | Phase 3 | Pending |
| REV-02 | Phase 3 | Pending |
| DATA-01 | Phase 1 | Complete |
| FOCUS-01 | Phase 4 | Complete |
| FOCUS-02 | Phase 4 | Complete |
| CAT-01 | Phase 4 | Complete |
| DASH-01 | Phase 5 | Complete |
| DASH-02 | Phase 5 | Complete |
| DASH-03 | Phase 5 | Complete |
| PLAN-01 | Phase 5 | Complete |
| PLAN-02 | Phase 5 | Complete |
| PLAN-03 | Phase 5 | Complete |
| DATA-01 | Phase 6 | Pending |
| DATA-02 | Phase 6 | Pending |
| DATA-03 | Phase 6 | Complete |
| DATA-04 | Phase 6 | Complete |
| UX-01 | Phase 6 | Complete |
| UX-02 | Phase 6 | Pending |
| UX-03 | Phase 6 | Complete |
| TASK-01 | Phase 6 | Pending |
| TASK-02 | Phase 6 | Pending |
| TASK-03 | Phase 6 | Pending |

**Coverage:** 32/32 requirements mapped ✓

---
*Generated by GSD Roadmapper*
*Last updated: 2026-04-21 - Added Phase 6 (Data & Backend)*
