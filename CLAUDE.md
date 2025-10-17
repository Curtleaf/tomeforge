# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TomeForge is a pnpm monorepo for managing tabletop game systems. It consists of:
- **Backend** (`apps/backend`): Express API with MongoDB/Mongoose for game system data
- **Frontend** (`apps/frontend`): React + Vite application
- **Shared** (`packages/shared`): Mongoose models, TypeScript types, and utilities used by both apps

## Build and Development Commands

### Initial Setup
```bash
pnpm install                    # Install all dependencies
```

### Building
```bash
pnpm build                      # Build all packages (runs tsc in each workspace)
pnpm clean                      # Remove all dist directories
```

### Running Applications
```bash
# Run both frontend and backend concurrently
pnpm start

# Or run individually:
pnpm start-backend              # Start backend on port 3000 (with nodemon)
pnpm start-frontend             # Start frontend dev server (Vite)

# From within specific apps:
cd apps/backend && pnpm run dev
cd apps/frontend && pnpm run dev
```

### Documentation
```bash
pnpm build-docs                 # Sync docs from apps/*/docs to central docs/ folder
docsify serve docs              # Serve documentation locally
```

## Architecture

### Monorepo Structure
- Uses pnpm workspaces defined in `pnpm-workspace.yaml`
- Shared package referenced as `@tomeforge/shared` via workspace protocol
- TypeScript path mappings in root `tsconfig.json` point to compiled `dist/*` outputs

### Backend Architecture (apps/backend)
Follows a layered architecture:
- **routes/** - Express route handlers (e.g., `system.ts` for `/api/systems`)
- **services/** - Business logic layer (e.g., `system.ts`)
- **data-access/** - Database operations using Mongoose models
- **utils/db/** - Database connection management with connection caching

The backend uses:
- MongoDB connection via environment variables (see `.env` requirements)
- Mongoose for ODM
- Express for REST API
- nodemon for hot-reloading during development

### Frontend Architecture (apps/frontend)
- React 18 with TypeScript
- Vite for bundling and dev server
- Imports shared types from `@tomeforge/shared`

### Shared Package (packages/shared)
Contains Mongoose schemas and models:
- **models/system.ts** - `SystemModel` with configurations (stats, skills) and rules (dice rolling)
- **models/character.ts** - `CharacterModel` with character data and system configuration
- Exports TypeScript types inferred from schemas using `InferSchemaType`

## Environment Configuration

Backend requires `.env` file in root with:
```
MONGODB_USERNAME=
MONGODB_PASSWORD=
MONGODB_CLUSTER=
MONGODB_DATABASE_NAME=
```

Alternatively, set `MONGODB_URI` directly.

## Development Workflow

1. **Build order**: Always build `packages/shared` before apps when making type changes
   ```bash
   cd packages/shared && pnpm build
   pnpm build  # or rebuild everything
   ```

2. **Adding dependencies**: Use pnpm's workspace protocol for internal packages
   ```json
   "@tomeforge/shared": "workspace:^"
   ```

3. **Backend changes**: nodemon watches `src/**/*.ts` files and auto-restarts
4. **Frontend changes**: Vite provides HMR automatically

## Data Models

### System
Game systems have:
- `configuration`: Defines stats and skills with dataType (number/string) and ordering
- `rules`: Dice rolling mechanics (type, dice, quantity, modifier)

### Character
Characters reference a game system and contain:
- `data`: CharacterDataObject with primary/secondary values
- `systemConfiguration`: Embedded system schema for character-specific rules

## Product Documentation

Comprehensive product and development documentation is available in `agent-os/product/`:

### Core Product Docs
- **`mission.md`** - Product vision, user personas, problems solved, differentiators, and success criteria
- **`roadmap.md`** - Phased development plan with 51 prioritized features across 7 phases (Phase 0-6)
- **`tech-stack.md`** - Technology choices, architecture patterns, testing strategy, and technical principles

### Development Standards
- **`development-practices.md`** - Development workflow, code standards, testing requirements, schema design principles, code review process, and release procedures
- **`technical-constraints.md`** - Schema complexity limits, performance budgets, security boundaries, scalability thresholds, and enforcement policies

### Key Principles from Documentation

**System-Agnostic Design:**
- Never hardcode game mechanics
- Use data-driven configurations stored in database
- Support any game from D&D to board games without code changes

**Schema Constraints:**
- Maximum nesting depth: 3 levels
- Document size soft limit: 1MB (hard limit 16MB)
- Embedded arrays: < 100 items recommended
- Always include schema versioning

**Testing Requirements:**
- Shared Package: 80% coverage minimum
- Backend Services: 70% coverage minimum
- Frontend Components: 60% coverage minimum
- Critical Paths: 100% coverage (auth, validation, character creation)

**Type Safety:**
- TypeScript strict mode everywhere
- Shared types via `@tomeforge/shared`
- Runtime validation matches compile-time types

**Development Workflow:**
- Follow conventional commits format
- Pre-commit hooks run tests and type checking
- All PRs require CI/CD pipeline to pass
- Minimum 1 approval for merge

## Current Phase: Phase 0 (Developer Infrastructure)

Before expanding features, complete Phase 0 tasks (see `agent-os/product/roadmap.md`):
- [ ] Documentation tooling (Swagger/OpenAPI, TypeDoc)
- [ ] Testing infrastructure (Vitest, Playwright, coverage reporting)
- [ ] CI/CD pipeline enhancement
- [ ] Schema validation and complexity checks
- [ ] Docker Compose for local development

Phase 0 provides the foundation for sustainable sporadic development and future collaboration.
