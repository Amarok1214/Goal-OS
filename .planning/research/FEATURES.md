# Feature Landscape

**Domain:** Goal-focused productivity app
**Researched:** 2026-03-04

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Goal CRUD | Core value - create, read, update, delete goals | Medium | Title, description, deadline, status (Active/Paused/Completed/Someday) |
| Task management | Tasks are the unit of action under goals | Medium | Add tasks under goals, mark complete, task fields (title, done, due) |
| Goal hierarchy | Vision → Goals → Projects → Tasks structure | High | Parent-child relationships, cascading progress |
| Progress tracking | Visual feedback on goal completion | Low-Medium | Progress bar auto-updated from task completion % |
| Today view | Daily actions panel showing due/active tasks across all goals | Medium | Filter tasks by: due today, or marked active today |
| Data persistence | Offline-first, data survives refresh | Low | localStorage (PROJECT.md constraint) |

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Goal journaling | Attach reflection entries to goals | Medium | Context and reasoning attached to goals, not just tasks |
| Weekly review template | Structured "What worked / What didn't / What's next" | Low | Prompted form, guides reflection |
| Visual progress bars | Auto-updated from task completion | Low | Simple progress calculation, visual indicator |
| Goal status management | Active, Paused, Completed, Someday states | Low | Clear goal lifecycle |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Multi-user collaboration | Out of scope per PROJECT.md | Focus on single-user experience first |
| Cloud sync (Supabase) | Out of scope - localStorage MVP | Build local-first, add sync later if validated |
| Advanced analytics | Out of scope - basic progress bars only | Keep simple, no complex charts |
| Notifications/reminders | Out of scope - manual check | Focus on core flow |
| Mobile app | Different platform | Web-first, responsive design |
| Browser extensions | Premature | Core app first |

## Feature Dependencies

```
Goal CRUD → Task Management (tasks belong to goals)
Task Management → Progress Tracking (completion % from tasks)
Progress Tracking → Today View (show goals needing attention)
Goal CRUD → Journaling (journal entries attached to goals)
All features → Data Persistence (localStorage)
```

## MVP Recommendation

Prioritize:
1. **Goal CRUD** - Core value, without this nothing else matters
2. **Task management** - Tasks are how goals get accomplished
3. **Progress tracking** - Visual feedback is motivating
4. **Today view** - Daily workflow, shows value immediately
5. **Data persistence** - Required for usable product

Defer:
- **Journaling** - Valuable but not core to MVP value proposition
- **Weekly review** - Reflection feature, requires users to be engaged first

## Sources

- PROJECT.md requirements (validated)
- Productivity app patterns (Notion, Todoist, GoalsOnTrack references)
- Common productivity app feature comparisons
