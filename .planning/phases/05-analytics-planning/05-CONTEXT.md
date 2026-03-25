# Context: Phase 5 - Analytics & Planning

**Phase:** 5 - Analytics & Planning
**Features:** Study Dashboard, Weekly Study Planner
**Created:** 2026-03-25

---

## Why This Phase?

As a student, understanding how you spend your study time is crucial for optimization. The existing Pomodoro timer tracks sessions, but provides no visibility into patterns, trends, or weekly planning.

### The Problem
1. **No visibility** into study patterns - students don't know their most productive times
2. **Decision fatigue** - "What should I study now?" leads to wasted time
3. **No structure** - Reactive studying instead of proactive scheduling

### The Solution
1. **Dashboard** - Visual analytics showing focus time, streaks, and trends
2. **Weekly Planner** - Pre-scheduled study blocks linked to goals

---

## Design Philosophy

### Dashboard: Show, Don't Tell
- Display existing data (sessions are already tracked)
- Help students discover patterns, not impose rules
- Keep it simple - 4 stats + 1 chart for v1

### Planner: Structure Without Rigidity
- Optional planning - students can ignore if they prefer
- Links to goals for accountability
- Visual, not form-heavy

---

## Key Design Decisions

### Decision 1: Use Existing Data
**Rationale:** Sessions and distraction logs already exist. Dashboard uses these without new data collection.

**Trade-off:** Can't categorize by subject without adding that field.

**Resolution:** Start without categorization. Add `subject` field in future enhancement.

---

### Decision 2: New Store for Planner
**Rationale:** Schedule blocks are independent of goals/tasks. Clean separation.

**Alternative Considered:** Extend Goal with `scheduledDays` field.

**Resolution:** New `scheduleStore` for flexibility.

---

### Decision 3: Grid-Based Planner
**Rationale:** Familiar weekly calendar layout, easy to scan.

**Alternative Considered:** List view (simpler but less visual).

**Resolution:** Grid with time slots (6 AM - 11 PM).

---

### Decision 4: No External Chart Library
**Rationale:** Reduce dependencies, full styling control.

**Alternative Considered:** Recharts, Visx, Chart.js.

**Resolution:** Custom SVG bar chart for v1.

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        USER ACTIONS                          │
├─────────────────────────────────────────────────────────────┤
│  Complete Pomodoro ──> Logs session ──> Dashboard updates   │
│  Create schedule block ──> Stores in scheduleStore          │
│  Start Pomodoro ──> Timer shows active block ─> Context     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA STORES                            │
├─────────────────────────────────────────────────────────────┤
│  focusStore        │ scheduleStore                          │
│  - sessions[]      │ - blocks[]                             │
│  - distractionLogs │                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       COMPONENTS                             │
├─────────────────────────────────────────────────────────────┤
│  Study Dashboard ──> Stats Cards, Focus Chart, Streak        │
│  Weekly Planner ──> Week Grid, Schedule Blocks, Block Form   │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration Points

### With Pomodoro Timer
- Timer checks for active schedule block on start
- Shows "Currently: [Block Title]" indicator
- Block highlights when its time window is active

### With Goals
- Planner blocks can link to goals (optional)
- Dashboard shows goals completed this week
- Goal cards could show "Planned: X hours / Completed: Y hours"

### With Today View
- Overdue/due-soon goals influence planner suggestions
- Planner could auto-suggest blocks based on deadlines

---

## User Stories

### Dashboard
```
As a student,
I want to see how much I studied this week
So I can track my progress and stay motivated
```

```
As a student,
I want to know my focus streak
So I can build consistent study habits
```

```
As a student,
I want to see which days I study most
So I can identify patterns and optimize my schedule
```

### Planner
```
As a student,
I want to schedule study blocks for the week
So I know exactly what to work on each day
```

```
As a student,
I want to link blocks to my goals
So my study time connects to my bigger objectives
```

```
As a student,
I want to see my schedule while doing Pomodoro
So I stay context-aware during focus sessions
```

---

## Out of Scope for v1

| Feature | Reason |
|---------|--------|
| Drag-to-reschedule blocks | Form-based editing is simpler |
| Calendar export (.ics) | Future enhancement |
| Collaboration/sharing | Single-user focus |
| Notifications/reminders | Manual check for now |
| Goal analytics (per-subject) | Requires subject field |

---

## Dependencies

### External
- None (all data is local)

### Internal
- `focusStore` - for session data
- `goalStore` - for goals completed, goal list
- Existing UI components (glass styling, buttons)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Session history grows large | Performance | Limit display to 90 days |
| localStorage approaching limit | Data loss | Warn user, consider cleanup |
| Complex calculations cause lag | UX | UseMemo, limit recalculations |
| Grid responsive on mobile | Usability | Mobile: day-by-day list view |

---

## Success Metrics

### Dashboard
- [ ] 4 stats cards render with data
- [ ] Bar chart shows 7-day distribution
- [ ] Streak calculates correctly
- [ ] Week navigation works

### Planner
- [ ] Block creation works
- [ ] Blocks persist across refresh
- [ ] Week navigation works
- [ ] Links to goals display

### Integration
- [ ] Pomodoro shows active block
- [ ] Dashboard updates after sessions

---

*Context created: 2026-03-25*
