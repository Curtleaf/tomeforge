# ADR-002: pnpm Monorepo Structure

**Status:** Accepted

**Date:** 2025-10-18 (Retroactive documentation of early decision)

**Deciders:** Project Owner

**Tags:** project-structure, tooling, infrastructure, developer-experience

---

## Context

TomeForge consists of multiple related codebases that need to share TypeScript types, Mongoose models, and utilities:
- Backend API (Express server)
- Frontend application (React + Vite)
- Shared code (models, types, utilities)

**Key Questions:**
- How do we structure the codebase to share code between frontend and backend?
- What package manager should we use?
- Should we use a monorepo or multiple repositories?
- How do we ensure type safety across the stack?

**Constraints:**
- Solo developer - need simple, maintainable tooling
- TypeScript-first with strict type checking
- Fast development iteration cycles
- Shared Mongoose models must work in both backend and frontend (for types)

---

## Decision

**We have decided to:** Use a pnpm monorepo with workspace protocol for code sharing.

**This means:**
- Project structure:
  ```
  tomeforge/
  ├── apps/
  │   ├── backend/     # Express API
  │   └── frontend/    # React + Vite
  ├── packages/
  │   └── shared/      # Mongoose models, types, utilities
  ├── pnpm-workspace.yaml
  └── package.json     # Root scripts
  ```
- Use `pnpm workspaces` to manage dependencies
- Reference shared package via workspace protocol: `"@tomeforge/shared": "workspace:^"`
- Build order: shared package must build before apps
- Shared package exports TypeScript types generated from Mongoose schemas

---

## Alternatives Considered

### Alternative 1: npm Workspaces
**Pros:**
- Built into npm, no additional tooling
- Standard, well-supported
- Similar workspace protocol support

**Cons:**
- Slower than pnpm for installs
- More disk space usage (no content-addressable store)
- Less efficient dependency resolution

**Why rejected:** pnpm is significantly faster and more disk-efficient. Speed matters for developer experience, especially with frequent `pnpm install` during development.

### Alternative 2: yarn Workspaces
**Pros:**
- Mature, widely adopted
- Good monorepo support
- Fast installs

**Cons:**
- More complex than pnpm
- Yarn 2+ (Berry) has breaking changes and different philosophy
- Yarn 1 is maintenance mode
- Larger ecosystem shift from npm

**Why rejected:** pnpm provides better performance without the ecosystem fragmentation of Yarn 1 vs 2. Simpler mental model than Yarn Berry.

### Alternative 3: Lerna
**Pros:**
- Specialized monorepo tool
- Built-in versioning and publishing
- Independent package versions

**Cons:**
- Additional tooling layer on top of package manager
- More complex setup
- Overkill for 3 packages
- Requires learning Lerna-specific commands

**Why rejected:** Over-engineered for current needs. pnpm workspaces provide 90% of benefits with 10% of complexity.

### Alternative 4: Multiple Repositories
**Pros:**
- Independent versioning
- Clearer boundaries
- Could publish shared package to npm

**Cons:**
- Type changes require publishing and updating dependencies
- Slower development iteration
- More complex CI/CD
- Overkill for solo project
- Harder to keep backend/frontend/shared in sync

**Why rejected:** Multi-repo creates too much overhead for rapid iteration. Monorepo allows atomic commits across all three packages.

### Alternative 5: Turborepo
**Pros:**
- Optimized monorepo builds
- Smart caching
- Parallel task execution
- Works with any package manager

**Cons:**
- Additional tooling layer
- Learning curve
- Overkill for 3 packages
- More configuration

**Why rejected:** Complexity not justified for current scale. Can add later if build times become an issue.

---

## Consequences

### Positive Consequences
- **Fast iteration**: Change model in shared → rebuild → see changes in both apps immediately
- **Type safety**: Frontend and backend share exact same types, no drift
- **Atomic commits**: Can change API contract and both server/client in single commit
- **Simpler CI/CD**: One repository to build/test/deploy
- **Dependency management**: Single `pnpm-lock.yaml`, no version conflicts
- **Disk efficiency**: pnpm's content-addressable store saves space
- **Speed**: pnpm installs are extremely fast (~40% faster than npm)

### Negative Consequences / Trade-offs
- **Build order complexity**: Must remember to build shared before apps
- **Coupling**: Changes to shared package affect both apps
- **All-or-nothing versioning**: Can't independently version packages (not a problem for this use case)
- **Requires pnpm**: Contributors must install pnpm (one command: `npm install -g pnpm`)

### Mitigation Strategies
- **Build scripts**: Root `package.json` has `pnpm build` that builds in correct order
- **Documentation**: `CLAUDE.md` clearly documents build order requirements
- **Path mappings**: TypeScript config maps `@tomeforge/shared/*` to `dist/*` outputs
- **Workspace protocol**: Using `workspace:^` ensures references stay within monorepo
- **Pre-commit hooks** (future): Run builds before commit to catch issues

---

## Implementation Notes

**Files/Components Affected:**
- `pnpm-workspace.yaml` - Defines workspace packages
- `package.json` (root) - Scripts for building all packages
- `tsconfig.json` (root) - Path mappings for shared package
- `apps/backend/package.json` - References `@tomeforge/shared` via workspace protocol
- `apps/frontend/package.json` - References `@tomeforge/shared` via workspace protocol
- `packages/shared/package.json` - Exports models and types

**Dependencies:**
- `pnpm`: ^9.x (package manager)

**Key Configuration:**

`pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@tomeforge/shared/*": ["packages/shared/dist/*"]
    }
  }
}
```

**Build Order:**
1. `cd packages/shared && pnpm build` (TypeScript compilation)
2. `cd apps/backend && pnpm build` (uses compiled shared types)
3. `cd apps/frontend && pnpm build` (uses compiled shared types)

Or simply: `pnpm build` from root (runs all in sequence)

**Related ADRs:**
- (Future) ADR-XXX: If/when to split into multiple repos for scaling

---

## References

- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
- [pnpm vs npm Performance](https://pnpm.io/benchmarks)
- [Monorepo Tools Comparison](https://monorepo.tools/)
- TomeForge docs:
  - `agent-os/standards/global/conventions.md` - Build order and workspace protocol
  - `CLAUDE.md` - Monorepo structure and build commands

---

## Metadata

**Supersedes:** N/A (Initial decision)

**Superseded by:** N/A (Active)

**Related Decisions:**
- (Future) ADR-XXX: When to introduce Turborepo or Nx for build optimization
- (Future) ADR-XXX: Publishing strategy if shared package needs external consumption
