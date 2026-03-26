---
status: testing
phase: 05-analytics-planning
source: 05-01-SUMMARY.md, 05-02-SUMMARY.md
started: 2026-03-26T00:00:00Z
updated: 2026-03-26T00:00:00Z
---

## Current Test

number: 1
name: Navigate to Dashboard
expected: |
  Click "Dashboard" in the sidebar navigation.
  The view changes from Today to a new Dashboard view showing:
  - A header "Study Dashboard"
  - Four stats cards: "Total Focus Time", "Sessions Completed", "Goals Worked On", "Focus Streak"
  - A bar chart labeled "Weekly Focus Time"
  - A "Distraction Summary" card on the right
awaiting: user response

## Tests

### 1. Navigate to Dashboard
expected: Click "Dashboard" in the sidebar navigation. The view changes from Today to a new Dashboard view showing: A header "Study Dashboard", Four stats cards: "Total Focus Time", "Sessions Completed", "Goals Worked On", "Focus Streak", A bar chart labeled "Weekly Focus Time", A "Distraction Summary" card on the right
result: pending

### 2. Dashboard Stats Display
expected: Dashboard shows four stat cards with values. Cards should display: "Total Focus Time" (hours), "Sessions Completed" (count), "Goals Worked On" (count), "Focus Streak" (days). Values should be numeric.
result: pending

### 3. Weekly Focus Chart
expected: A bar chart showing 7 vertical bars labeled with day names (Sun, Mon, Tue, Wed, Thu, Fri, Sat). Today's bar should be highlighted differently. Bars should have labels showing hours when data exists.
result: pending

### 4. Distraction Summary Card
expected: A card showing "Distraction Summary" with a count of distractions this week. Should display a status message: "No distractions logged" (if 0), "Good focus discipline!" (if 1-4), "Room for improvement" (if 5-9), or "Consider improving your environment" (if 10+).
result: pending

### 5. Navigate to Planner
expected: Click "Planner" in the sidebar navigation. The view changes to a Weekly Study Planner showing a 7-day calendar grid with hour slots from 6 AM to 11 PM.
result: pending

### 6. Add Study Block
expected: Click the "Add Block" button or click on an empty time slot in the grid. A modal appears with fields for: Title, Day selector (Mon-Sun), Start Time, Duration dropdown, Goal link dropdown (optional), Recurring toggle. Fill in title "Test Study Block", select a day, and click "Add Block". The block appears in the grid.
result: pending

### 7. Edit Study Block
expected: Click on an existing study block in the planner grid. The edit modal opens with the block's current values. Change the title to something else and click "Save Changes". The block updates in the grid.
result: pending

### 8. Delete Study Block
expected: Click on an existing study block, then click "Delete" in the edit modal. The block is removed from the grid.
result: pending

### 9. Week Navigation
expected: The planner shows current week's date range at the top. Click "Previous Week" - the dates go back 7 days. Click "Next Week" - advances 7 days. Click "Today" - jumps back to the current week.
result: pending

### 10. Link Block to Goal
expected: While creating/editing a block, select a goal from the "Link to Goal" dropdown. The block should display the linked goal's title instead of its own title. The block color should match the goal's category color.
result: pending

### 11. Recurring Block Toggle
expected: When creating a block, toggle "Recurring Weekly" on. The block appears in the same day for subsequent weeks when navigating to future weeks.
result: pending

### 12. Pomodoro Shows Active Block
expected: Start a Pomodoro session on a task. While the timer is running and you're within a scheduled block's time window, the Pomodoro timer should show a "Currently:" indicator with the schedule block's title or linked goal name.
result: pending

### 13. Planner Data Persists
expected: Add several study blocks to the planner. Refresh the browser page. Navigate away and back to the Planner view. All added blocks should still be visible in their correct positions.
result: pending

### 14. Sidebar Navigation Active State
expected: The sidebar shows which view is currently active with a highlighted background. Clicking each nav item (Today, All Goals, Dashboard, Planner) changes the active state to the clicked item.
result: pending

## Summary

total: 14
passed: 0
issues: 0
pending: 14
skipped: 0

## Gaps

[none yet]
