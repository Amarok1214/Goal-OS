# Domain Pitfalls

**Domain:** Goal-focused productivity web app
**Researched:** 2026-03-04

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Using Context API for Global State
**What goes wrong:** App becomes slow as more components subscribe to context. Every context update causes all consumers to re-render.
**Why it happens:** Context is dependency injection, NOT state management. It's designed for low-frequency updates (theme, auth), not high-frequency app state.
**Consequences:** Performance degrades as app grows. State logic spreads across components.
**Prevention:** Use Zustand (or Redux Toolkit if enterprise). Zustand subscribes to specific slices, not entire store.
**Detection:** Add React DevTools profiler - if many components re-render on single state change, this is the problem.

### Pitfall 2: Using Create React App (CRA)
**What goes wrong:** Using deprecated tooling with no updates, missing security patches.
**Why it happens:** CRA was standard for years, but deprecated early 2025. Many tutorials still reference it.
**Consequences:** Security vulnerabilities, slower builds, missing modern features.
**Prevention:** Use Vite. `npm create vite@latest -- --template react-ts`

### Pitfall 3: Over-Engineering State with Redux
**What goes wrong:** Writing excessive boilerplate for simple state needs. Slows down MVP development.
**Why it happens:** "Redux is standard" thinking from pre-2022. Redux Toolkit helped but still overkill for single-user offline app.
**Consequences:** 3x more code than necessary, slower development velocity.
**Prevention:** Use Zustand. 90% less boilerplate. Only use Redux if team needs strict patterns or enterprise requirements.

### Pitfall 4: Building Without TypeScript
**What goes wrong:** Runtime errors from typos, refactoring breaks silently, no IDE support.
**Why it happens:** "TypeScript slows me down" mindset. Actually speeds up development long-term.
**Consequences:** Debugging takes longer, refactoring is risky, onboarding new devs harder.
**Prevention:** Use TypeScript from start. All recommended libraries support it natively.

## Moderate Pitfalls

### Pitfall 5: Premature Optimization
**What goes wrong:** Adding features (analytics, cloud sync, notifications) before core value validated.
**Why it happens:** "What if users need X?" thinking. Building features nobody asked for.
**Consequences:** Wasted development time, longer time to validation.
**Prevention:** Ship MVP, get user feedback, then add features.

### Pitfall 6: Using Controlled Components for Forms
**What goes wrong:** Every keystroke triggers re-render, poor performance on large forms.
**Why it happens:** Using useState for each form field (the "easy" way).
**Consequences:** Laggy input, poor UX on slower devices.
**Prevention:** Use React Hook Form with uncontrolled components. Much better performance.

### Pitfall 7: Not Handling localStorage Quotas
**What goes wrong:** App breaks when storage exceeds ~5MB limit.
**Why it happens:** Storing large datasets, images, or unlimited data in localStorage.
**Consequences:** App crashes or loses data silently in some browsers.
**Prevention:** For MVP likely fine, but plan for IndexedDB if data grows. Add try/catch around localStorage writes.

## Minor Pitfalls

### Pitfall 8: Skipping Accessibility
**What goes wrong:** App unusable for keyboard-only users, screen reader users.
**Why it happens:** "Users don't need accessibility" assumption. Legally risky too.
**Consequences:** Excludes users, potential legal issues.
**Prevention:** Use shadcn/ui - built on Radix which has WCAG accessibility built-in.

### Pitfall 9: No Error Boundaries
**What goes wrong:** Single component error crashes entire app.
**Why it happens:** Not wrapping app in error boundary.
**Consequences:** White screen of death, poor UX.
**Prevention:** Add React error boundary at app root.

### Pitfall 10: CSS Complexity
**What goes wrong:** Styles scattered across components, conflicts, hard to maintain.
**Why it happens:** Not using utility-first approach, or not establishing design tokens.
**Consequences:** Inconsistent UI, slow development.
**Prevention:** Use Tailwind CSS (already selected). Establish consistent spacing, colors in config.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Foundation | Wrong state tool (Context), CRA | Use Zustand + Vite |
| Core features | Premature optimization | Stick to MVP scope |
| Data model | Over-complicating hierarchy | Start simple, add depth only if needed |
| Forms | Controlled components | Use React Hook Form |
| Persistence | localStorage errors | Add error handling, try/catch |

## Sources

- CodeSearch results on React state management 2025/2026
- Web articles on React mistakes (multiple 2025/2026 publications)
- React documentation on Context API use cases
- NPM trends and community patterns
