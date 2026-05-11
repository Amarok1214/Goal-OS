---
status: testing
phase: standalone-pomodoro
source: focusStore.ts, PomodoroTimer.tsx
started: 2026-03-26T00:00:00Z
updated: 2026-03-26T00:00:00Z
---

## Current Test

number: 7
name: Break Phase Works
expected: |
  After completing a work session, click "Start Break".
  A short break timer (5 minutes) starts with green theme.
  When it ends, another celebration prompt appears with "Back to Work" option.
awaiting: user response

## Tests

### 1. View Standalone Pomodoro UI
expected: In the Today view, scroll to the Pomodoro Timer section. When no Pomodoro is running and no task is selected, you should see: A "Ready to Focus?" heading, A description: "Start a 25-minute Pomodoro session without linking to a task", A blue "Start Standalone Pomodoro" button, A hint: "Or click the focus button on any task to link it"
result: pass

### 2. Open Standalone Modal
expected: Click the "Start Standalone Pomodoro" button. A modal appears with: A heading "Start Focus Session", A description about optional intention, An input field with placeholder "What will you focus on? (optional)", Cancel and "Start Session" buttons.
result: pass

### 3. Start Without Intention
expected: In the standalone modal, click "Start Session" without typing anything in the intention field. The modal closes. The Pomodoro timer appears showing: 25:00 countdown, blue theme indicating "Focus Time", Running state (not paused).
result: pass

### 4. Start With Intention
expected: In the standalone modal, type an intention (e.g., "Read a chapter"). Click "Start Session". The timer appears with the intention displayed below the timer in a blue card labeled "Session Intention".
result: pass

### 5. Timer Controls Work
expected: While running a standalone Pomodoro: Click pause - timer pauses. Click play - timer resumes. Click stop - timer stops and returns to idle state. Also test: Navigate to a different page while timer is running, then come back. The timer should still be running.
result: pass

### 6. Timer Completes Phase
expected: Start a standalone Pomodoro. Let it run (or wait for completion). When the 25 minutes end: A chime plays, A "Great work!" celebration prompt appears, Options to "Start Break" or "End Session" are shown.
result: skipped
reason: 25-minute wait too long for testing

### 7. Break Phase Works
expected: After completing a work session, click "Start Break". A short break timer (5 minutes) starts with green theme. When it ends, another celebration prompt appears with "Back to Work" option.
result: pending

### 8. Distraction Log During Standalone
expected: Start a standalone Pomodoro. While running, click "Log Distraction". A modal appears. Type a distraction and submit. The distraction is logged (even though no task is linked).
result: pending

### 9. No Task Link Visible
expected: Start a standalone Pomodoro. Look at the timer header area. The title should show "Standalone Session" or the intention if one was set (since no task is linked).
result: pending

### 10. Return to Idle State
expected: After stopping a standalone Pomodoro (by clicking End Session or Stop), the timer returns to the "Ready to Focus?" idle state with the standalone start button.
result: pending

## Summary

total: 10
passed: 5
issues: 0
pending: 4
skipped: 1

## Gaps

[none yet]
