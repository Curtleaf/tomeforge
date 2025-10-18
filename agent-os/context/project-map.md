# TomeForge Project Map

**Purpose:** Quick reference guide for locating key files and concepts. Use this to load specific files instead of reading entire directories.

**Token Savings:** Reading this map (~300 tokens) + specific files (~500-1000 tokens) vs reading all standards and exploring (~3000-5000 tokens)

---

## 📁 Project Structure Overview

```
tomeforge/
├── apps/
│   ├── backend/          # Express API server
│   └── frontend/         # React + Vite application
├── packages/
│   └── shared/           # Mongoose models, TypeScript types, utilities
├── agent-os/             # AI development framework configuration
├── docs/                 # Generated documentation (OpenAPI, TypeDoc)
└── docker/               # Docker infrastructure scripts
```

---

## 🎯 Quick Navigation by Task

### Working on Database Models
- **Location:** `packages/shared/src/models/`
- **System Model:** `packages/shared/src/models/system.ts`
- **Character Model:** `packages/shared/src/models/character.ts`
- **Type Exports:** `packages/shared/src/index.ts`
- **Standards:** `agent-os/standards/backend/models.md`

### Working on API Endpoints
- **Location:** `apps/backend/src/routes/`
- **System Routes:** `apps/backend/src/routes/system.ts`
- **Service Layer:** `apps/backend/src/services/system.ts`
- **Data Access:** `apps/backend/src/data-access/system.ts`
- **Standards:** `agent-os/standards/backend/api.md`

### Working on Database Queries
- **Service Layer:** `apps/backend/src/services/system.ts` (business logic)
- **Data Access:** `apps/backend/src/data-access/system.ts` (MongoDB operations)
- **Connection:** `apps/backend/src/utils/db/db.ts:1-80` (connection management with caching)
- **Standards:** `agent-os/standards/backend/queries.md`

### Working on Frontend Components
- **Location:** `apps/frontend/src/`
- **Entry Point:** `apps/frontend/src/main.tsx`
- **App Component:** `apps/frontend/src/App.tsx`
- **Standards:** `agent-os/standards/frontend/components.md`

### Working on Documentation
- **API Docs Config:** `apps/backend/src/config/swagger.config.ts`
- **OpenAPI Generator:** `apps/backend/src/utils/generate-openapi.ts`
- **TypeDoc Config:** `packages/shared/typedoc.json`
- **Doc Output:** `docs/` (auto-generated, don't edit directly)

### Working on Docker Infrastructure
- **Docker Compose:** `docker-compose.yml`
- **MongoDB Init:** `docker/mongo-init/init-user.js`
- **Environment Config:** `.env.docker` (gitignored)
- **Documentation:** `CLAUDE.md:99-191` (Docker Development Environment section)

---

## 🔍 Key Files by Category

### Configuration Files
| File | Purpose | When to Read |
|------|---------|--------------|
| `pnpm-workspace.yaml` | Monorepo package configuration | Adding new packages |
| `tsconfig.json` | Root TypeScript config | TypeScript setup issues |
| `docker-compose.yml` | Local dev infrastructure | Database/service setup |
| `.env.docker` | Docker environment variables | Docker configuration |
| `apps/backend/.env` | Backend application config | Database connection issues |

### Core Application Files
| File | Purpose | Lines of Interest |
|------|---------|-------------------|
| `packages/shared/src/models/system.ts` | System model schema and types | Full file |
| `packages/shared/src/models/character.ts` | Character model schema and types | Full file |
| `apps/backend/src/index.ts` | Backend server entry point | 1-50 |
| `apps/backend/src/utils/db/db.ts` | Database connection with caching | 15-45 (connection logic) |
| `apps/backend/src/routes/system.ts` | System API endpoints | Full file |
| `apps/backend/src/services/system.ts` | System business logic | Full file |
| `apps/backend/src/data-access/system.ts` | System database operations | Full file |

### Standards & Guidelines
| File | Purpose | Token Count |
|------|---------|-------------|
| `agent-os/standards/_summaries/backend.md` | Backend quick reference | ~100 |
| `agent-os/standards/_summaries/frontend.md` | Frontend quick reference | ~100 |
| `agent-os/standards/_summaries/testing.md` | Testing quick reference | ~100 |
| `agent-os/standards/_summaries/global.md` | Global standards quick reference | ~100 |
| `agent-os/standards/backend/api.md` | Full API standards | ~500 |
| `agent-os/standards/backend/models.md` | Full model standards | ~400 |
| `agent-os/standards/global/coding-style.md` | Full coding style guide | ~600 |

### Product & Architecture Documentation
| File | Purpose | When to Read |
|------|---------|--------------|
| `agent-os/product/mission.md` | Product vision and strategy | Understanding product direction |
| `agent-os/product/roadmap.md` | Phased development plan | Planning new features |
| `agent-os/product/tech-stack.md` | Technology decisions | Evaluating tech choices |
| `agent-os/product/development-practices.md` | Development workflow | Setting up dev environment |
| `agent-os/product/technical-constraints.md` | Performance/schema limits | Designing data models |
| `CLAUDE.md` | Project overview for AI | Starting any task |

---

## 🏗️ Architecture Layers (Backend)

```
Request Flow:
1. routes/        → Express route handlers (HTTP layer)
2. services/      → Business logic (validation, orchestration)
3. data-access/   → Database operations (Mongoose queries)
4. models/        → Mongoose schemas (in shared package)
```

**Key Principle:** Never access database directly from routes. Always go through service → data-access layers.

**Example:**
- Route: `apps/backend/src/routes/system.ts:50-75` (getSystemById handler)
- Service: `apps/backend/src/services/system.ts:20-35` (getSystemById logic)
- Data Access: `apps/backend/src/data-access/system.ts:10-25` (MongoDB query)

---

## 📊 Data Models

### System Model
- **Schema:** `packages/shared/src/models/system.ts:10-85`
- **Type Export:** `packages/shared/src/index.ts`
- **Key Fields:** systemId (number), name, configuration, rules
- **Used By:** Character model (foreign key), System API endpoints

### Character Model
- **Schema:** `packages/shared/src/models/character.ts:10-90`
- **Type Export:** `packages/shared/src/index.ts`
- **Key Fields:** characterId (number), systemId (FK), name, data
- **Dependencies:** System model for systemConfiguration

---

## 🧪 Testing Structure

### Test Locations
- **Shared Package Tests:** `packages/shared/src/tests/`
- **Backend Tests:** `apps/backend/src/tests/`
- **Frontend Tests:** `apps/frontend/src/` (co-located with components)

### Test Types
- **Unit Tests:** Service and data-access layer functions
- **Integration Tests:** API endpoints with database
- **E2E Tests:** Full user workflows (future)

---

## 🔧 Common Tasks & File Locations

### Task: Add a new API endpoint
1. Read: `agent-os/standards/backend/api.md`
2. Create route: `apps/backend/src/routes/[resource].ts`
3. Create service: `apps/backend/src/services/[resource].ts`
4. Create data access: `apps/backend/src/data-access/[resource].ts`
5. Update OpenAPI: `apps/backend/src/config/swagger.config.ts`

### Task: Modify database schema
1. Read: `agent-os/standards/backend/models.md`
2. Read: `agent-os/product/technical-constraints.md` (schema limits)
3. Update model: `packages/shared/src/models/[model].ts`
4. Rebuild: `cd packages/shared && pnpm build`
5. Update dependent code in apps/backend

### Task: Add frontend component
1. Read: `agent-os/standards/frontend/components.md`
2. Create component: `apps/frontend/src/components/[Component].tsx`
3. Add styles: Follow `agent-os/standards/frontend/css.md`
4. Update App.tsx if needed

### Task: Set up Docker environment
1. Read: `CLAUDE.md:99-191` (Docker section)
2. Copy: `cp .env.docker.example .env.docker`
3. Configure: `apps/backend/.env` with connection string
4. Start: `docker compose up -d`

---

## 🎨 Standards Quick Index

### Backend Standards
- **API Design:** `agent-os/standards/backend/api.md`
- **Data Models:** `agent-os/standards/backend/models.md`
- **Database Queries:** `agent-os/standards/backend/queries.md`
- **Migrations:** `agent-os/standards/backend/migrations.md`

### Frontend Standards
- **Components:** `agent-os/standards/frontend/components.md`
- **CSS/Styling:** `agent-os/standards/frontend/css.md`
- **Responsive Design:** `agent-os/standards/frontend/responsive.md`
- **Accessibility:** `agent-os/standards/frontend/accessibility.md`

### Global Standards
- **Coding Style:** `agent-os/standards/global/coding-style.md`
- **Commenting:** `agent-os/standards/global/commenting.md`
- **Error Handling:** `agent-os/standards/global/error-handling.md`
- **Tech Stack:** `agent-os/standards/global/tech-stack.md`
- **Validation:** `agent-os/standards/global/validation.md`
- **Conventions:** `agent-os/standards/global/conventions.md`

### Testing Standards
- **Test Writing:** `agent-os/standards/testing/test-writing.md`

---

## 💡 Context Loading Strategy (For AI Assistants)

### Step 1: Always Read First
1. This file (`agent-os/context/project-map.md`) - ~300 tokens
2. `CLAUDE.md` - ~500 tokens (project overview)

### Step 2: Read Summaries (Only What's Needed)
3. Relevant summary from `agent-os/standards/_summaries/` - ~100 tokens each

### Step 3: Load Specific Files
4. Only the specific files needed for the task

### Example: Adding a New API Endpoint
- **Old approach:** Read all backend standards (~2000 tokens) + explore codebase (~3000 tokens) = **5000 tokens**
- **New approach:** Project map (300) + backend summary (100) + api.md (500) + example file (500) = **1400 tokens**
- **Savings:** 72% reduction in context usage

---

## 🔗 Cross-References & Dependencies

### Character Model depends on System Model
- **Why:** Character uses systemId as foreign key
- **Impact:** Changes to System schema may require Character model updates
- **Files:** `packages/shared/src/models/character.ts:45` references System

### Backend depends on Shared Package
- **Why:** Types and models are exported from shared
- **Impact:** Must rebuild shared package before backend changes take effect
- **Command:** `cd packages/shared && pnpm build`

### Frontend depends on Shared Package
- **Why:** Imports TypeScript types from shared
- **Impact:** Type changes require shared rebuild
- **Import:** `import type { SystemType } from '@tomeforge/shared'`

---

## 📝 Notes

- **Last Updated:** 2025-10-18
- **Maintained By:** Should be updated when major files are added/moved
- **Token Budget:** This file is designed to be ~300-400 tokens when read by AI
- **Philosophy:** Reference-based context loading vs. reading everything upfront

---

## 🚀 Getting Started Checklist

When starting a new task:
- [ ] Read this project map
- [ ] Read `CLAUDE.md` for project overview
- [ ] Read relevant summary from `_summaries/`
- [ ] Load specific files needed for task
- [ ] Check `agent-os/product/roadmap.md` for task priority

**Remember:** Load files lazily, not eagerly. Only read what you need, when you need it.
