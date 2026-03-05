# Requirements: Goal OS

**Defined:** 2026-03-04
**Core Value:** Every piece of work in the app is connected to a goal — no floating tasks, no disconnected notes. The hierarchy keeps users focused on outcomes, not just activities.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Goals

- [x] **GOAL-01**: User can create a goal with title, description, and deadline
- [x] **GOAL-02**: User can set goal status (Active, Paused, Completed, Someday)
- [x] **GOAL-03**: User can view a list of all goals with their status
- [x] **GOAL-04**: User can edit goal title, description, deadline, and status
- [x] **GOAL-05**: User can delete a goal

### Tasks

- [ ] **TASK-01**: User can add tasks under a specific goal
- [ ] **TASK-02**: User can mark a task as done/undone
- [ ] **TASK-03**: User can edit task title and due date
- [ ] **TASK-04**: User can delete a task from a goal

### Progress Tracking

- [ ] **PROG-01**: Visual progress bar per goal auto-updated as tasks are completed

### Today View

- [ ] **TODAY-01**: Daily actions panel showing all tasks due today or marked active across all goals
- [ ] **TODAY-02**: User can filter tasks by "due today" or "active today"

### Journaling

- [ ] **JOURN-01**: User can attach short journal entries to a specific goal
- [ ] **JOURN-02**: User can view journal entries for a goal in chronological order

### Weekly Review

- [ ] **REV-01**: User can complete weekly review with prompted questions (What worked? What didn't? What's next?)
- [ ] **REV-02**: Weekly review is associated with a specific week/date range

### Data Persistence

- [x] **DATA-01**: All data persists in localStorage across browser refreshes

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Collaboration

- **COLLAB-01**: User can share goals/tasks with another user (if multi-user added)

### Cloud Sync

- **SYNC-01**: Data syncs across devices via cloud backend

### Notifications

- **NOTIF-01**: User receives browser notifications for due tasks

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Multi-user collaboration | Single-user focused for MVP |
| Cloud sync (Supabase) | localStorage offline-first for MVP simplicity |
| Advanced analytics/charts | Basic progress bars only |
| Notifications/reminders | Manual check for now |
| Mobile app | Web-first MVP |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| GOAL-01 | Phase 1 | Complete |
| GOAL-02 | Phase 1 | Complete |
| GOAL-03 | Phase 1 | Complete |
| GOAL-04 | Phase 1 | Complete |
| GOAL-05 | Phase 1 | Complete |
| TASK-01 | Phase 2 | Pending |
| TASK-02 | Phase 2 | Pending |
| TASK-03 | Phase 2 | Pending |
| TASK-04 | Phase 2 | Pending |
| PROG-01 | Phase 2 | Pending |
| TODAY-01 | Phase 2 | Pending |
| TODAY-02 | Phase 2 | Pending |
| JOURN-01 | Phase 3 | Pending |
| JOURN-02 | Phase 3 | Pending |
| REV-01 | Phase 3 | Pending |
| REV-02 | Phase 3 | Pending |
| DATA-01 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-04*
*Last updated: 2026-03-04 - Roadmap created*
