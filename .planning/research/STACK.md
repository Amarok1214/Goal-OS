# Technology Stack

**Project:** Goal OS
**Researched:** 2026-03-04
**Mode:** Greenfield productivity app

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | 19.x | UI Framework | Latest stable, officially recommended. React 19 is current (supports Server Components if needed later). |
| Vite | 6.x | Build tool | CRA deprecated in early 2025. Vite is now the standard - fast HMR, optimized builds, minimal config. |
| TypeScript | 5.x | Type safety | Non-negotiable for maintainability. Full inference with all recommended libraries. |

### State Management

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Zustand | 5.x | Global client state | **Recommended choice for 2026.** ~1KB bundle, no providers, simple hook-based API. Perfect for offline-first apps with localStorage sync. Alternative to Context API (not a real state manager) and Redux (overkill for MVP). |
| useState/useReducer | Built-in | Local UI state | For component-level state (modals, form inputs, toggle states). |

**Why Zustand over alternatives:**
- **vs Context API:** Context is dependency injection, not state management. Causes unnecessary re-renders. Zustand subscribes to specific slices.
- **vs Redux Toolkit:** Redux is enterprise-ready but boilerplate-heavy. Zustand achieves same with 90% less code. Redux has 9M weekly downloads but declining in new projects.
- **vs Jotai:** Atomic model adds complexity. Zustand's single store is simpler for this use case.
- **NPM downloads:** Zustand leads at 18M weekly downloads (Feb 2026).

**For localStorage persistence with Zustand:**
```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GoalStore {
  goals: Goal[]
  addGoal: (goal: Goal) => void
}

export const useGoalStore = create<GoalStore>()(
  persist(
    (set) => ({
      goals: [],
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
    }),
    {
      name: 'goal-os-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

### Routing

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React Router | 7.x | Client-side routing | **Standard choice.** Version 7 unified client/server routing. Large ecosystem, well-documented, nested routes support. |
| *Alternative: TanStack Router* | 1.x | Type-safe routing | Better TypeScript inference, but larger bundle (~45KB vs ~20KB). Use if strict type safety is priority. |

**Recommendation for Goal OS:** Use React Router v7. Simpler, smaller bundle, adequate typing for MVP.

### Forms & Validation

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React Hook Form | 7.x | Form state management | **Standard for 2026.** Uncontrolled components = minimal re-renders. ~9KB gzipped. |
| Zod | 3.x | Schema validation | TypeScript-first. Define schema once, infer types everywhere. Runtime validation matches TypeScript types. |
| @hookform/resolvers | 3.x | RHF + Zod bridge | Connects RHF to Zod for type-safe validation. |

**Why this combo:**
- **vs Formik:** RHF is significantly faster (uncontrolled vs controlled). Formik essentially deprecated.
- **vs built-in validation:** Zod provides declarative schemas, reusable, better error messages.
- RHF + Zod is the 2026 standard. TanStack Form exists but RHF has larger ecosystem.

### UI Components

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| shadcn/ui | Latest | Component library | **Top choice for 2026.** Built on Radix UI primitives + Tailwind. Copy/paste components you own - not npm dependency. Accessible (WCAG) by default. |
| Radix UI | 1.x | Headless primitives | shadcn/ui uses these under the hood. Only install directly if building custom components. |
| Tailwind CSS | 4.x | Styling | Already in PROJECT.md. Version 4 has improved performance and simplified config. |

**Why shadcn/ui:**
- **vs MUI/Ant Design:** Heavy bundle, hard to customize, fight the defaults.
- **vs Headless UI:** shadcn provides styled components on top of Radix (headless), not just primitives.
- **vs pure Radix:** Radix is unstyled - you still need to build components. shadcn gives you ready-to-use components.
- Accessibility built-in, dark mode support, easy theming.

### Data Persistence (MVP)

| Technology | Purpose | Why |
|------------|---------|-----|
| localStorage | Offline-first storage | Per PROJECT.md requirements. Use Zustand's persist middleware (shown above). |
| IndexedDB (defer) | Larger offline storage | Only if localStorage insufficient (~5MB limit). Use `idb` or `localforage` wrapper. Not needed for MVP. |

### Developer Experience

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| ESLint + Prettier | Latest | Code quality | Standard linting/formatting. |
| TypeScript ESLint | Latest | Type-aware linting | Catches type errors in linting. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Build tool | Vite 6 | Parcel, Webpack | Vite is standard, fastest DX. |
| State (global) | Zustand 5 | Redux Toolkit | Redux is overkill for MVP, more boilerplate. |
| State (local) | useState | Recoil, MobX | Recoil unmaintained. MobX adds complexity. |
| Routing | React Router 7 | TanStack Router | React Router has larger ecosystem, smaller bundle. |
| Forms | RHF + Zod | Formik + Yup | RHF faster, Zod more TypeScript-friendly than Yup. |
| UI Library | shadcn/ui | MUI, Chakra | shadcn is lighter, more customizable, better accessibility. |
| Persistence | localStorage | IndexedDB | localStorage simpler for MVP data size. |

## Installation

```bash
# Create Vite + React + TypeScript project
npm create vite@latest goal-os -- --template react-ts
cd goal-os

# Core dependencies
npm install react react-dom react-router-dom

# State management
npm install zustand

# Forms
npm install react-hook-form zod @hookform/resolvers

# UI components (shadcn/ui setup)
npm install -D tailwindcss @tailwindcss/vite
npm install class-variance-authority clsx tailwind-merge lucide-react
# Then add shadcn/ui components as needed via CLI
npx shadcn@latest init

# TypeScript types
npm install -D @types/react @types/react-dom
```

## Project Structure Recommendation

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── goals/        # Goal-specific components
│   └── tasks/        # Task-specific components
├── hooks/
│   └── useLocalStorage.ts  # If custom hook needed
├── lib/
│   └── utils.ts      # cn() utility for class merging
├── store/
│   └── goalStore.ts # Zustand store with persistence
├── types/
│   └── index.ts      # TypeScript interfaces
├── App.tsx
└── main.tsx
```

## Sources

- **State Management:** CodeSearch results showing Zustand 18M weekly npm downloads, dominant in 2026
- **Routing:** React Router v7 vs TanStack Router comparison (Jan 2026)
- **Forms:** React Hook Form + Zod standard (multiple 2026 articles)
- **UI:** shadcn/ui as top React UI library for 2026 (multiple sources)
- **Build:** CRA deprecated early 2025, Vite standard
- **Version verification:** NPM package data (Feb 2026)
