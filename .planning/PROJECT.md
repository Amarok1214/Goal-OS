# Goal OS

## What This Is

A structured productivity workspace where everything revolves around outcomes. Unlike Notion where you just create pages, every note, task, and journal entry in Goal OS is tied to a specific goal. For individuals who want to focus on what matters by organizing all their work around clear objectives.

## Core Value

Every piece of work in the app is connected to a goal — no floating tasks, no disconnected notes. The hierarchy (Vision → Goals → Projects → Tasks) keeps users focused on outcomes, not just activities.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Goal creation with title, description, deadline, and status tags (Active, Paused, Completed, Someday)
- [ ] Progress tracking with visual progress bar auto-updated from task completion
- [ ] Task management — add tasks under each goal, mark them done
- [ ] Daily actions panel — "Today" view pulling all tasks due or active across every goal
- [ ] Journaling — attach short journal entries to specific goals for context and reflection
- [ ] Weekly review template — prompted form with "What worked?", "What didn't?", "What's next?"

### Out of Scope

- [Multi-user collaboration] — Single-user focused for MVP
- [Cloud sync via Supabase] — Using localStorage for offline-first MVP
- [Advanced analytics] — Basic progress bars only
- [Notifications/reminders] — Manual check for now

## Context

- **Tech Stack**: React + Tailwind (frontend), localStorage for data persistence (offline-first MVP)
- **Target Users**: Individuals seeking structured productivity focused on outcomes
- **Reference Apps**: Notion (page-based), Todoist (task-based), GoalsOnTrack (goal-focused)

## Constraints

- **[Persistence]**: localStorage for MVP — offline-first, no backend required
- **[Single User]**: No authentication or multi-user for v1
- **[Simplicity]**: No complex integrations, keep it self-contained

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| localStorage over Supabase | Faster MVP build, offline-first, simpler | — Pending |
| Coarse granularity | Fewer broader phases for quick shipping | — Pending |

---
*Last updated: 2026-03-04 after initialization*
