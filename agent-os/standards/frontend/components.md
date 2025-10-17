## UI component best practices

### TomeForge Frontend Standards

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Component Location**:
  - App-specific components: `apps/frontend/src/`
  - Shared components: `packages/shared/` (to be organized)
- **File Naming**: Use PascalCase for component files (e.g., `App.tsx`, `SystemCard.tsx`)
- **Component Naming**: Use PascalCase for component names matching filename
- **Entry Point**: `apps/frontend/src/main.tsx` renders root `App` component
- **TypeScript**: All components should be `.tsx` files with proper typing

### Component Design Principles

- **Single Responsibility**: Each component should have one clear purpose and do it well
- **Reusability**: Design components to be reused across different contexts with configurable props
- **Composability**: Build complex UIs by combining smaller, simpler components rather than monolithic structures
- **Type Safety**: Use TypeScript interfaces for props; import types from `@tomeforge/shared` when applicable
- **State Management**: Keep state as local as possible; lift it up only when needed by multiple components
- **Shared Types**: Import domain types from `@tomeforge/shared` (e.g., `SystemType`, `CharacterType`)

### Development Server
- Run `pnpm run dev` from `apps/frontend/`
- Dev server runs on `http://localhost:5173` with HMR
- Vite provides instant updates during development

### Build Process
- Build shared package first: `cd packages/shared && pnpm build`
- Build frontend: `cd apps/frontend && pnpm build`
- Or build all: `pnpm build` from root
