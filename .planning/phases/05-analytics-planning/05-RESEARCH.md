# Research: Phase 5 - Analytics & Planning

**Created:** 2026-03-25
**Phase:** 5 - Analytics & Planning
**Features:** Study Dashboard, Weekly Study Planner

---

## Executive Summary

Phase 5 adds two complementary features: **Study Dashboard** for tracking productivity metrics and **Weekly Study Planner** for scheduling study sessions. Both leverage existing data from `focusStore` while requiring minimal new infrastructure.

---

## 1. Study Dashboard

### Purpose
Provides visual insights into study patterns, focus time distribution, and productivity trends. Helps students understand how they spend their time and identify optimization opportunities.

### Data Sources (Existing)

| Store | Data Available | Usage |
|-------|----------------|-------|
| `focusStore.sessions[]` | Focus session history with timestamps | Focus time metrics |
| `focusStore.distractionLogs[]` | Distraction entries during sessions | Distraction tracking |
| `focusStore.getTodayPomodoros()` | Today's pomodoro count | Quick stats |
| `focusStore.getWeekPomodoros()` | Week's pomodoro count | Weekly summary |
| `goalStore.goals[]` | Goal list with status | Completion rates |

### Metrics to Implement

#### Quick Stats Cards
1. **Total Focus Time** - Sum of all session durations this week
2. **Sessions Completed** - Count of completed pomodoro sessions
3. **Goals Completed** - Count of goals marked complete this week
4. **Focus Streak** - Consecutive days with at least 1 session

#### Visualizations
1. **Daily Focus Bar Chart** - 7-day focus time distribution
2. **Subject Breakdown** - Time per goal category (future enhancement)
3. **Peak Hours Analysis** - Most productive time windows

#### Computed Metrics
```typescript
// Daily focus time
const getDailyFocusTime = (date: Date): number => {
  const startOfDay = new Date(date).setHours(0, 0, 0, 0)
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000
  return sessions
    .filter(s => s.startTime >= startOfDay && s.startTime < endOfDay && s.type === 'work')
    .reduce((acc, s) => acc + s.duration, 0)
}

// Focus streak calculation
const getFocusStreak = (): number => {
  let streak = 0
  let date = new Date()
  while (getDailyFocusTime(date) > 0) {
    streak++
    date.setDate(date.getDate() - 1)
  }
  return streak
}
```

### Missing Data Considerations

| Gap | Impact | Solution |
|-----|--------|----------|
| No session task title | Can't show which task got focus | Store task title when session starts |
| No subject/course field | Can't categorize by subject | Add course field to goals |
| No quality rating | Can't measure focus quality | Optional post-session rating |

**Recommendation:** Start without these gaps. Basic metrics are valuable without categorization.

---

## 2. Weekly Study Planner

### Purpose
Allows students to pre-schedule study blocks for the week, creating structure and reducing decision fatigue about "what to study next."

### Design Philosophy
- **Tied to goals** - Blocks link to existing goals for accountability
- **Visual grid** - Weekly calendar view showing all time blocks
- **Progress integration** - Planner shows how scheduled time compares to actual focus time

### Data Model

#### Option A: Extend Goal (Simple)
```typescript
interface Goal {
  // ... existing fields
  scheduledDays?: DayOfWeek[]
  scheduledTime?: string  // "09:00"
  estimatedHours?: number
}
```

#### Option B: New Schedule Store (Recommended)
```typescript
interface ScheduleBlock {
  id: string
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6  // 0 = Sunday
  startTime: string      // "09:00"
  endTime: string        // "10:30"
  goalId?: string        // Optional link to goal
  title: string          // "Math Study"
  subject?: string       // For categorization
  recurring: boolean     // Repeats weekly
  color?: string         // Custom color
  createdAt: Date
}
```

**Decision: Option B** - Cleaner separation, easier to query by day, supports standalone blocks.

### Schedule Store Structure
```typescript
interface ScheduleState {
  blocks: ScheduleBlock[]
  
  // Actions
  addBlock: (block: Omit<ScheduleBlock, 'id' | 'createdAt'>) => void
  updateBlock: (id: string, updates: Partial<ScheduleBlock>) => void
  deleteBlock: (id: string) => void
  getBlocksByDay: (day: number) => ScheduleBlock[]
  getBlocksByWeek: (weekStart: Date) => ScheduleBlock[]
}
```

### UI Components

1. **WeeklyGrid** - 7-column grid showing Mon-Sun
2. **TimeColumn** - Hours from 6 AM to 11 PM
3. **ScheduleBlock** - Draggable/resizable block in grid
4. **BlockForm** - Modal for creating/editing blocks
5. **WeeklySummary** - Shows planned vs. actual time

### User Flow

```
1. User navigates to Weekly Planner view
2. Grid shows current week with existing blocks
3. User clicks "+ Add Block" or empty slot
4. Modal appears with:
   - Goal selector (optional)
   - Day selector (default: clicked day)
   - Start time picker
   - Duration selector
   - Title input
5. Block appears in grid
6. During the scheduled time, Pomodoro timer highlights active block
```

---

## 3. Integration Points

### With Existing Features

| Feature | Integration |
|---------|-------------|
| Pomodoro Timer | Shows active block during scheduled time |
| Today View | Planner blocks influence "due soon" suggestions |
| Goal Cards | Shows planned hours vs. completed |
| Focus Store | Sessions link to schedule blocks (if goal linked) |

### Cross-Feature Data Flow
```
Weekly Planner ──(schedules)──> Goals
     │
     └──(tracks)──> Pomodoro Timer ──(logs)──> Focus Store
                                                   │
                                                   └──(displays)──> Study Dashboard
```

---

## 4. Technical Implementation Notes

### Performance Considerations
- Dashboard calculations should be memoized (useMemo)
- Session history grows over time - consider limiting to last 90 days
- Weekly grid should virtualize if >50 blocks

### State Management
- New `scheduleStore.ts` for planner blocks
- Extend `focusStore.ts` with analytics helpers
- Consider computed selectors pattern for derived data

### Persistence
- `scheduleStore` uses localStorage (like other stores)
- Session history already persisted
- No backend changes needed for v1

---

## 5. UI/UX Decisions Required

### Dashboard Decisions
| Question | Options | Recommendation |
|----------|---------|-----------------|
| Time range selector | Week/Month/All Time | Start with Week only |
| Chart library | Recharts/Visx/custom SVG | Recharts (lightweight) |
| Refresh data | Manual/auto (5min) | Manual for v1 |

### Planner Decisions
| Question | Options | Recommendation |
|----------|---------|-----------------|
| Block editing | Drag to resize/move OR form only | Form only for v1 |
| Conflict handling | Warn OR prevent | Warn if overlap |
| Past blocks | Show as grayed OR hide | Show as grayed |

---

## 6. Component Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── Dashboard.tsx          # Main dashboard view
│   │   ├── StatsCard.tsx          # Individual metric card
│   │   ├── FocusChart.tsx         # Bar chart for daily focus
│   │   ├── SubjectBreakdown.tsx   # Category time distribution
│   │   └── PeakHours.tsx          # Most productive times
│   │
│   ├── planner/
│   │   ├── WeeklyPlanner.tsx      # Main planner view
│   │   ├── WeekGrid.tsx            # 7x24 grid component
│   │   ├── TimeColumn.tsx          # Hour labels column
│   │   ├── ScheduleBlock.tsx       # Individual block in grid
│   │   └── BlockForm.tsx           # Add/edit modal
│   │
│   └── shared/
│       └── WeekSelector.tsx        # Week navigation
```

---

## 7. File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `src/store/scheduleStore.ts` | Planner block state management |
| `src/components/dashboard/*` | Dashboard components |
| `src/components/planner/*` | Planner components |

### Modified Files
| File | Changes |
|------|---------|
| `src/types/index.ts` | Add ScheduleBlock type |
| `src/store/focusStore.ts` | Add analytics helper methods |
| `src/App.tsx` | Add Dashboard and Planner views |
| `src/index.css` | Add planner grid styles |

---

## 8. Testing Strategy

### Unit Tests
- Schedule store CRUD operations
- Analytics calculations (focus time, streak)
- Date utilities

### Integration Tests
- Block creation → appears in grid
- Session logging → appears in dashboard
- Planner → Pomodoro integration

### E2E Scenarios
1. Create schedule block → verify persistence
2. Complete pomodoro → verify dashboard updates
3. Navigate week → verify blocks load correctly

---

## 9. Future Enhancements (Post-v1)

| Enhancement | Priority | Complexity |
|-------------|----------|------------|
| Drag-to-schedule blocks | High | Medium |
| Subject/course field on goals | High | Low |
| Session task title capture | Medium | Low |
| Monthly calendar view | Medium | Medium |
| Export to calendar (.ics) | Low | Medium |
| Focus quality rating | Low | Low |

---

## 10. Success Metrics

### Dashboard Success
- [ ] Stats cards show accurate data
- [ ] Chart renders daily focus distribution
- [ ] Week-over-week comparison works

### Planner Success
- [ ] Blocks can be created for any day/time
- [ ] Blocks persist across refresh
- [ ] Week navigation works
- [ ] Links to goals display correctly

### Overall
- [ ] Both views accessible from sidebar
- [ ] Dark theme consistent
- [ ] No performance issues with 100+ sessions

---

*Research complete: 2026-03-25*
