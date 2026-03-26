---
status: testing
phase: subtask-verification
source: TaskItemCompact.tsx, GoalCard.tsx
started: 2026-03-26T00:00:00Z
updated: 2026-03-26T00:00:00Z
---

## Current Test

number: 1
name: Add Subtask - Task With No Subtasks
expected: |
  Create a task (or find an existing task with no subtasks).
  Hover over the task to reveal the "+ Sub" button.
  Click the "+ Sub" button.
  An inline input field appears below the task.
  Type a subtask title and press Enter or click the checkmark.
  The subtask is added and appears below the task.
awaiting: user response

## Tests

### 1. Add Subtask - Task With No Subtasks
expected: Create a task (or find an existing task with no subtasks). Hover over the task to reveal the "+ Sub" button. Click the "+ Sub" button. An inline input field appears below the task. Type a subtask title and press Enter or click the checkmark. The subtask is added and appears below the task.
result: pending

### 2. Add Subtask - Task With Existing Subtasks
expected: Find or create a task that already has subtasks. Expand the subtask list if collapsed. Click the "+ Add subtask" button inside the expanded list. An inline input field appears. Type a subtask and submit. The new subtask appears in the list with the others.
result: pending

### 3. Expand/Collapse Subtasks
expected: Find a task with subtasks. Click on the expand/collapse toggle (chevron icon or subtask count badge). The subtask list expands or collapses smoothly with animation. The chevron icon rotates to indicate state.
result: pending

### 4. Toggle Subtask Completion
expected: Expand a task's subtask list. Click the checkbox next to an incomplete subtask. The subtask is marked as completed (checkbox filled, text struck through). Click again to uncomplete it.
result: pending

### 5. Delete Subtask
expected: Expand a task's subtask list. Hover over a subtask to reveal the delete (trash) icon. Click the trash icon. The subtask is immediately removed from the list.
result: pending

### 6. Subtask Count Badge
expected: Find a task with subtasks. Look at the right side of the task row. A badge shows "X/Y" where X is completed count and Y is total count. The badge color indicates progress (all complete vs partial).
result: pending

### 7. Subtask Works in All Task Groups
expected: In GoalCard, expand the "In Progress" task group. Add a subtask to a task there. Collapse and expand "Remaining" task group. Add a subtask there too. Both subtasks persist and display correctly in their respective groups.
result: pending

### 8. Subtask Input Cancel (Escape)
expected: Click "+ Sub" to open the inline input. Press Escape without typing anything. The input closes without adding a subtask. Press Escape after typing something. The input closes without adding.
result: pending

### 9. Subtask Input Cancel (Blur)
expected: Click "+ Sub" to open the inline input. Click outside the input (on the page background). If the input is empty, it closes without adding. If the input has text, the text is kept (doesn't close on blur with content).
result: pending

## Summary

total: 9
passed: 0
issues: 0
pending: 9
skipped: 0

## Gaps

[none yet]
