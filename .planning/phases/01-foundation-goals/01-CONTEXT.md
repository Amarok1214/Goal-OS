# Phase 1: Foundation & Goals - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Project scaffolded with React + Vite + TypeScript, working state management with Zustand and localStorage persistence, and complete Goal CRUD functionality. This phase delivers the foundation: project setup + Goal creation/read/update/delete.

</domain>

<decisions>
## Implementation Decisions

### Tech Stack (from Research)
- React 19 + Vite 6 + TypeScript 5
- Zustand 5 for state management with persist middleware
- shadcn/ui components + Tailwind 4
- React Router 7 for navigation
- React Hook Form 7 + Zod 3 for forms

### Goal Form
- Modal dialog for creating new goals
- Same modal used for editing (pre-filled)
- Fields: title (required), description (optional textarea), deadline (date picker), status (dropdown: Active/Paused/Completed/Someday)

### Goal List Layout
- Card-based layout with visual status indicators
- Each card shows: title, status badge, deadline, progress bar placeholder (for future Phase 2)
- Click card to view/edit details

### Goal Interactions
- "Add Goal" button prominent in header
- Edit via button on card → opens modal
- Delete via button with confirmation dialog
- Status change via dropdown on card or in edit modal

### Empty State
- Friendly message: "No goals yet. Create your first goal to get started!"
- Call-to-action button to create goal

### Data Persistence
- Zustand persist middleware with localStorage
- Storage key: 'goal-os-storage'
- All CRUD operations sync to localStorage immediately

</decisions>

<specifics>
## Specific Ideas

- User can set goal status: Active, Paused, Completed, Someday
- Deadline is optional date field
- Progress tracking comes in Phase 2 — placeholder in UI now

</specifics>

 @code_context
## Existing Code Insights

### Reusable Assets
- None yet — this is greenfield. First phase creates all assets.

### Established Patterns
- Zustand + localStorage persist pattern from research STACK.md
- shadcn/ui for components (Button, Card, Dialog, Input, Select, Textarea)
- React Hook Form + Zod for form validation

### Integration Points
- New code: src/App.tsx, src/store/goalStore.ts, src/components/goals/*
- Routes: /goals (list), /goals/new (create), /goals/:id (edit)

</code_context>

<deferred>
## Deferred Ideas

- Task management under goals — Phase 2
- Progress tracking visualization — Phase 2
- Today view (daily actions) — Phase 2
- Journaling — Phase 3
- Weekly review — Phase 3

</deferred>

---

*Phase: 01-foundation-goals*
*Context gathered: 2026-03-04*
