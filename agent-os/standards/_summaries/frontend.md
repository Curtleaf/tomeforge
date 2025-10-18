# Frontend Standards Summary

**Quick Reference** - Read this first (~100 tokens), load full standards only when implementing.

## Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite (dev server on port 5173)
- **Entry Point**: `apps/frontend/src/main.tsx`
- **App Component**: `apps/frontend/src/App.tsx`

## Component Standards (`frontend/components.md`)
- **Naming**: PascalCase for files and component names (SystemCard.tsx)
- **Principles**: Single responsibility, reusability, composability
- **Type Safety**: TypeScript interfaces for props, import types from `@tomeforge/shared`
- **State**: Keep local when possible, lift up only when needed by multiple components

## CSS Standards (`frontend/css.md`)
- **Methodology**: Stick to one approach (Tailwind/BEM/CSS Modules)
- **Design System**: Use design tokens (colors, spacing, typography)
- **Framework-First**: Work with framework patterns, avoid excessive overrides
- **Performance**: Tree-shake/purge unused styles in production

## Responsive Design (`frontend/responsive.md`)
- **Mobile-First**: Start small screen, enhance for larger
- **Breakpoints**: Consistent breakpoints (mobile/tablet/desktop)
- **Units**: Prefer rem/em over px for scalability
- **Touch Targets**: Minimum 44x44px for mobile
- **Test**: Verify across all screen sizes

## Accessibility (`frontend/accessibility.md`)
- **Semantic HTML**: Use nav, main, button (not div onClick)
- **Keyboard**: All interactive elements keyboard-accessible
- **Contrast**: 4.5:1 minimum ratio, don't rely on color alone
- **Alt Text**: Descriptive for images, labels for form inputs
- **ARIA**: Use when semantic HTML insufficient
- **Focus**: Manage focus in modals and dynamic content

## Build Process
1. Build shared package first: `cd packages/shared && pnpm build`
2. Build frontend: `cd apps/frontend && pnpm build`
3. Or from root: `pnpm build`

## Key Files
- Entry: `apps/frontend/src/main.tsx`
- Root Component: `apps/frontend/src/App.tsx`
- Vite Config: `apps/frontend/vite.config.ts`

---

**For full details, see:**
- `agent-os/standards/frontend/components.md` (~350 tokens)
- `agent-os/standards/frontend/css.md` (~150 tokens)
- `agent-os/standards/frontend/responsive.md` (~200 tokens)
- `agent-os/standards/frontend/accessibility.md` (~200 tokens)
