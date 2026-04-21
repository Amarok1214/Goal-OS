---
phase: 06-data-backend
plan: "06-03"
subsystem: Settings & Data Management
tags: [settings, export, import, preferences]
dependency_graph:
  requires:
    - DATA-03
    - DATA-04
    - UX-01
  provides:
    - settings-store
    - export-utility
    - import-utility
    - settings-page
  affects:
    - App navigation
    - localStorage
tech_stack:
  added:
    - Zustand persist middleware
    - JSON blob download
    - FileReader API
  patterns:
    - Glassmorphism UI components
    - Settings toggle switches
    - Confirmation dialogs
key_files:
  created:
    - src/store/settingsStore.ts
    - src/utils/export.ts
    - src/utils/import.ts
    - src/components/settings/Settings.tsx
    - src/components/settings/index.ts
  modified:
    - src/App.tsx
decisions:
  - localStorage persistence for settings
  - JSON export with metadata (version, timestamp)
  - Import validation before loading
---

# Phase 06 Plan 03: Settings + Export/Import Summary

## One-Liner
Settings page with preferences management and JSON data backup/restore functionality.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create Settings Store | 805a3b3 | src/store/settingsStore.ts |
| 2 | Create Data Export Function | 805a3b3 | src/utils/export.ts |
| 3 | Create Data Import Function | 805a3b3 | src/utils/import.ts |
| 4 | Create Settings Page | 805a3b3 | src/components/settings/Settings.tsx |
| 5 | Add Settings Route & Navigation | 805a3b3 | src/App.tsx |

## Implementation Details

### Settings Store
- Zustand store with localStorage persistence
- Fields: pomodoroWork, pomodoroShortBreak, pomodoroLongBreak, notificationsEnabled, soundEnabled
- Defaults: 25, 5, 15, true, true
- Actions: updateSettings, resetSettings

### Export Function
- Exports goals, tasks, sessions, schedule blocks, settings
- Includes metadata: version "1.0", exportedAt timestamp
- Generates downloadable JSON file with filename: goal-os-export-{date}.json

### Import Function
- Parses JSON file using FileReader API
- Validates version and required fields (goals, tasks)
- Returns success/error object with imported counts
- loadImportedData function restores all data to stores
- clearAllData function for resetting

### Settings Page
- **Pomodoro Settings**: Number inputs for Work/Short Break/Long Break (minutes)
- **Notifications**: Toggle switch for browser notifications with permission request
- **Sound Effects**: Toggle for audio chime on phase completion
- **Data Management**: Export/Import buttons, import status feedback, clear data with confirmation
- **About**: Version, storage type, framework info, reset to defaults

### Navigation
- Added 'settings' view to state
- Sidebar navigation between Planner and Overview
- Settings icon from lucide-react

## Deviation Documentation

### Auto-Fixed Issues

**None** - Plan executed exactly as written.

### Auth Gates

**None** - No authentication required for this feature.

---

## Self-Check: PASSED

- [x] Settings store created with all preference fields
- [x] Settings persist across page refreshes
- [x] Export produces downloadable JSON file
- [x] JSON contains all app data
- [x] Import validates JSON structure
- [x] Returns proper error for invalid files
- [x] Settings page displays all sections
- [x] Export downloads file
- [x] Import accepts JSON and loads data
- [x] Settings accessible via sidebar
- [x] Sidebar shows Settings link
- [x] npm run build succeeds (committed)

## Commits

- **805a3b3**: feat(06-03): add settings page with export/import functionality
