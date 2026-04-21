---
phase: 06-data-backend
plan: "06-04"
subsystem: Settings & Pomodoro Integration
tags: [settings, pomodoro, timer, integration]
dependency_graph:
  requires:
    - UX-02
    - DATA-03
  provides:
    - settings-connected-timer
  affects:
    - Pomodoro timer
    - Settings changes
tech_stack:
  added: []
  patterns:
    - Dynamic getter functions for settings values
key_files:
  created: []
  modified:
    - src/store/focusStore.ts
    - src/components/today/PomodoroTimer.tsx
decisions:
  - Getter functions instead of constants for dynamic settings
  - Direct store.getState() calls to read current settings values
---

# Phase 06 Plan 04: Connect Settings to Pomodoro Summary

## One-Liner
Pomodoro timer now uses custom durations from settings store.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Modify FocusStore to Use Settings | 63770c8 | src/store/focusStore.ts |
| 2 | Update PomodoroTimer Display | 77515c4 | src/components/today/PomodoroTimer.tsx |

## Implementation Details

### FocusStore Changes
- Imported settingsStore to access duration preferences
- Created getter functions that dynamically read from settings:
  - `getPomodoroWork()` - returns settings.pomodoroWork * 60 (seconds)
  - `getPomodoroShortBreak()` - returns settings.pomodoroShortBreak * 60
  - `getPomodoroLongBreak()` - returns settings.pomodoroLongBreak * 60
- All timer state transitions (start, skip, stop, tick) now use these getter functions
- Timer duration is now reactive to settings changes

### PomodoroTimer Changes
- Updated imports to use getter functions instead of constants
- Removed hardcoded "25-minute" text from standalone modal
- Timer now correctly uses settings-based durations

### Behavior
- When user changes Pomodoro duration in Settings page, the new values are immediately used
- Initial timer state uses current settings values
- Phase transitions (work -> break, break -> work) respect current settings

## Deviation Documentation

### Auto-Fixed Issues

**None** - Plan executed exactly as written.

### Auth Gates

**None** - No authentication required for this feature.

---

## Self-Check: PASSED

- [x] focusStore imports settingsStore
- [x] Getter functions created and exported
- [x] All timer state transitions use getters
- [x] PomodoroTimer imports getter functions
- [x] Build succeeds (committed)

## Commits

- **63770c8**: feat(06-04): connect focusStore to settingsStore
- **77515c4**: feat(06-04): update PomodoroTimer to use settings getters
