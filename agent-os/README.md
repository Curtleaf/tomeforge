# Agent-OS Documentation

This directory contains TomeForge-specific configuration and documentation for AI-assisted development using agent-os patterns.

## Directory Structure

```
agent-os/
├── product/              # Product strategy and planning documents
│   ├── mission.md        # Product vision, personas, and differentiators
│   ├── roadmap.md        # Phased development plan (Phase 0-6)
│   ├── tech-stack.md     # Technology choices and architecture
│   ├── development-practices.md  # Development workflow and standards
│   └── technical-constraints.md  # Performance, security, and data limits
├── standards/            # Coding standards and conventions (agent-os default)
│   ├── _summaries/       # Quick reference summaries (read these first!)
│   ├── global/           # Cross-cutting standards
│   ├── backend/          # Backend-specific standards
│   ├── frontend/         # Frontend-specific standards
│   └── testing/          # Testing standards
├── context/              # Context management for AI assistants
│   └── project-map.md    # File locations and reference guide
├── decisions/            # Architecture Decision Records (ADRs)
│   ├── README.md         # ADR process and guidelines
│   ├── 000-template.md   # Template for new ADRs
│   ├── 001-mongodb-over-postgresql.md
│   ├── 002-pnpm-monorepo.md
│   └── 003-docker-local-development.md
├── roles/                # Claude Code subagent role definitions
│   ├── README.md         # Subagent system overview and best practices
│   ├── spec-writer.md    # Creates detailed specifications from requirements
│   ├── code-reviewer.md  # Adversarial quality assurance
│   ├── test-generator.md # Writes comprehensive test suites
│   ├── db-migrator.md    # Handles database schema migrations
│   └── doc-writer.md     # Updates project documentation
├── workflows/            # Subagent chaining patterns
│   └── subagent-chaining-patterns.md  # Proven workflows for common tasks
└── config.yml            # Agent-OS configuration

```

## Product Documentation (`product/`)

### Core Strategy Documents

#### `mission.md`
Defines TomeForge's product vision and strategy:
- **Pitch**: Unified, system-agnostic platform for tabletop gaming
- **User Personas**: Game Designers, Publishers, GMs, Players
- **Problems Solved**: Fragmented ecosystem, data lock-in, no system-agnostic tools
- **Differentiators**: Data-driven architecture, single source of truth, user ownership
- **Core Principles**: System-agnostic by design, data ownership, progressive enhancement

**Key Insight**: TomeForge combines D&D Beyond + DMs Guild + 5eTools + World Anvil into one platform that works for ANY game system.

#### `roadmap.md`
7-phase development plan with 51 prioritized features:

**Phase 0: Developer Infrastructure (CURRENT PRIORITY)**
- Documentation tooling, testing infrastructure, CI/CD, schema validation
- **Goal**: Foundation for sustainable sporadic development
- **Duration**: 2-3 weeks

**Phase 1-6**: Foundation → Gameplay Tools → Marketplace → Automation → World Building → Polish

**Status**: Phase 1 partially complete (System and Character models exist in `packages/shared`)

#### `tech-stack.md`
Comprehensive technical documentation:
- Current technologies (TypeScript, React, Express, MongoDB, pnpm)
- Planned technologies (authentication, real-time, testing, deployment)
- Architecture patterns (layered → event-driven, microservices strategy)
- Testing strategy (60% unit, 30% integration, 10% E2E)
- Migration path from current to target state

### Development Standards

#### `development-practices.md`
Complete development workflow guide:
- Getting started (5-minute setup)
- Branch strategy and commit message format
- Code standards (TypeScript strict mode, file organization, naming conventions)
- **Schema Design Principles**: Max 3 levels nesting, < 1MB documents, < 100 item arrays
- Testing requirements with coverage targets
- Code review checklist
- Release process

#### `technical-constraints.md`
Technical boundaries and performance targets:
- **Schema Complexity**: Max nesting depth 3, document size limits, array size limits
- **Performance Budgets**: API response times (< 200ms read, < 500ms write), bundle sizes
- **Security Boundaries**: Authentication, rate limiting, data access patterns
- **Scalability Thresholds**: When to introduce caching, microservices, event-driven architecture
- **Enforcement**: Pre-commit hooks, CI/CD checks, runtime monitoring

## Context Management (`context/`)

**NEW:** Efficient context loading system for AI assistants to reduce token usage by 40-70%.

### Project Map (`context/project-map.md`)
- **Purpose**: Quick reference for file locations and common tasks
- **Token Savings**: ~300 tokens (map) + specific files (~500-1000) vs reading everything (~3000-5000)
- **Contains**:
  - Project structure overview
  - Key files by category
  - Common task → file mappings
  - Architecture layer diagram
  - Cross-reference dependencies

### Standards Summaries (`standards/_summaries/`)
- **Purpose**: Quick reference summaries of full standards (~100 tokens each)
- **Strategy**: Read summaries first, load full standards only when implementing
- **Files**:
  - `backend.md` - API, models, queries, architecture
  - `frontend.md` - React, Vite, components, CSS, responsive, accessibility
  - `testing.md` - Philosophy, coverage targets, frameworks
  - `global.md` - Coding style, error handling, validation, conventions

### Context Loading Strategy (For AI Assistants)

**Efficient Loading (Recommended):**
1. Read `context/project-map.md` (~300 tokens)
2. Read relevant summary from `standards/_summaries/` (~100 tokens)
3. Load only specific files needed for task (~500-1000 tokens)
4. **Total**: ~900-1400 tokens

**Old Approach (Inefficient):**
1. Read all backend standards (~2000 tokens)
2. Explore codebase to find files (~3000 tokens)
3. **Total**: ~5000 tokens

**Token Savings**: 72% reduction with new approach!

## Architecture Decision Records (`decisions/`)

**NEW:** Documented architectural and technical decisions for project "memory."

### Purpose
ADRs serve as the project's architectural memory, documenting:
- **Why** technical choices were made
- **What** alternatives were considered
- **What** trade-offs were accepted
- **How** decisions impact the codebase

This is critical for:
- Solo developers returning after breaks (you!)
- AI assistants understanding context
- Future contributors onboarding
- Avoiding "why did we do it this way?" questions

### Current ADRs
1. **[ADR-001: MongoDB over PostgreSQL](./decisions/001-mongodb-over-postgresql.md)**
   - Decision: Use MongoDB with Mongoose for flexible, system-agnostic data modeling
   - Why: Document storage better fits variable game system configurations than rigid relational schema

2. **[ADR-002: pnpm Monorepo Structure](./decisions/002-pnpm-monorepo.md)**
   - Decision: Use pnpm workspaces with apps/ and packages/ structure
   - Why: Fast iteration with shared types, atomic commits across frontend/backend/shared

3. **[ADR-003: Docker for Local Development](./decisions/003-docker-local-development.md)**
   - Decision: Containerize infrastructure (MongoDB, Redis), keep apps on host
   - Why: Reproducible environments with fast hot-reloading iteration

### When to Create an ADR
Create ADRs for:
- Technology stack choices (database, framework, libraries)
- Architectural patterns (monorepo, layered architecture, microservices)
- Infrastructure decisions (Docker, deployment, CI/CD)
- Data modeling approaches
- Security and authentication strategies

**Don't create ADRs for:**
- Minor code style preferences (use linters)
- Routine bug fixes
- Simple feature implementations
- Temporary workarounds

### Creating New ADRs
```bash
# 1. Copy template
cp agent-os/decisions/000-template.md agent-os/decisions/004-your-decision.md

# 2. Fill out sections (Context, Decision, Alternatives, Consequences)

# 3. Update decisions/README.md index
```

See `agent-os/decisions/README.md` for detailed ADR process and best practices.

## Subagent Roles (`roles/`)

**NEW:** Specialized Claude Code subagent patterns for efficient, high-quality development.

### Purpose
Subagents are specialized AI agents that focus on one task and do it exceptionally well. Research shows multi-agent systems achieve **40% improvement in code quality** compared to single-agent approaches through:

- **Specialized Expertise**: Each agent masters one domain
- **Context Preservation**: No token dilution from trying to do everything
- **Parallel Execution**: Independent tasks run simultaneously
- **Quality Isolation**: High output quality through focused context
- **Adversarial Review**: Reviewer agents catch what generator agents miss

### Available Subagent Roles

1. **[spec-writer](./roles/spec-writer.md)** - Requirements → Detailed Specifications
   - When: Before implementing features
   - Input: Feature idea, user stories
   - Output: Comprehensive spec with acceptance criteria

2. **[code-reviewer](./roles/code-reviewer.md)** - Adversarial Quality Assurance
   - When: After implementing features, before commits
   - Input: Code changes (git diff)
   - Output: Prioritized issues (P0/P1/P2) with fixes

3. **[test-generator](./roles/test-generator.md)** - Comprehensive Test Suites
   - When: TDD workflows, increasing coverage
   - Input: Spec or code to test
   - Output: Unit, integration, E2E tests

4. **[db-migrator](./roles/db-migrator.md)** - Database Schema Migrations
   - When: Modifying Mongoose models
   - Input: Schema changes
   - Output: Migration scripts with rollback plans

5. **[doc-writer](./roles/doc-writer.md)** - Documentation Updates
   - When: After features, API changes, decisions
   - Input: Code changes
   - Output: Updated CLAUDE.md, JSDoc, ADRs

### Common Workflows

**Feature Development (TDD):**
```
1. spec-writer   → Creates specification
2. test-generator → Writes tests from spec
3. [Main Agent]   → Implements to pass tests
4. code-reviewer  → Verifies quality
5. doc-writer     → Updates documentation
```

**Bug Fix with Regression Prevention:**
```
1. [Main Agent]   → Fixes bug
2. test-generator → Writes regression tests
3. code-reviewer  → Verifies fix + tests
```

**Schema Migration:**
```
1. [Main Agent]  → Modifies schema
2. db-migrator   → Creates migration scripts
3. test-generator → Tests migration
4. code-reviewer → Verifies safety
5. doc-writer    → Updates docs
```

See `agent-os/workflows/subagent-chaining-patterns.md` for detailed workflow examples.

### Quick Start

**Basic Invocation:**
```
Use the [role-name] subagent to [specific task].

Context:
- [Relevant files or specs]
- [Standards to follow]
- [Success criteria]
```

**Example:**
```
Use the code-reviewer subagent to review git diff.

Focus on:
- Standards compliance (agent-os/standards/_summaries/backend.md)
- Schema complexity (agent-os/product/technical-constraints.md)
- Error handling patterns

Report P0 (critical), P1 (major), P2 (minor) issues.
```

### Best Practices

✅ **Do:**
- Provide ONLY the context needed for the task
- Give clear success criteria
- Reference specific standards/files
- Chain subagents for complex workflows
- Run independent subagents in parallel

❌ **Don't:**
- Give entire codebase as context
- Ask one subagent to do multiple unrelated tasks
- Skip verification steps (code-reviewer)
- Provide vague instructions

See `agent-os/roles/README.md` for comprehensive subagent documentation.

## How to Use This Documentation

### For Development Work
1. **Starting new feature**: Review `roadmap.md` for priority and dependencies
2. **Writing code**: Follow standards in `development-practices.md`
3. **Schema changes**: Check constraints in `technical-constraints.md`
4. **Technology choices**: Consult `tech-stack.md` for approved stack
5. **Product decisions**: Reference `mission.md` for alignment with vision

### For AI Assistants (Claude Code)

**Step 1: Always Read First**
1. `context/project-map.md` - File locations and task mappings
2. `CLAUDE.md` - Project overview from repository root
3. Relevant ADRs from `decisions/` - Understand why decisions were made

**Step 2: Read Summaries (Only What's Needed)**
4. Relevant summary from `standards/_summaries/`:
   - Working on backend? Read `_summaries/backend.md`
   - Working on frontend? Read `_summaries/frontend.md`
   - Writing tests? Read `_summaries/testing.md`
   - Need general context? Read `_summaries/global.md`

**Step 3: Load Specific Files**
5. Use project-map to locate exact files needed
6. Read only those files

**Best Practices:**
- Load files **lazily**, not eagerly
- Reference-based loading vs reading everything upfront
- Use summaries to decide what full standards to load
- Follow schema constraints and testing requirements strictly
- Prioritize Phase 0 tasks before expanding features

### For Contributors
1. Read `mission.md` to understand product vision
2. Review `development-practices.md` for workflow and standards
3. Check `roadmap.md` to find good first issues
4. Ensure changes align with technical constraints

## Key Principles Summary

### System-Agnostic Design
- **Never** hardcode game mechanics
- Use data-driven configurations stored in database
- Support D&D, Pathfinder, indie RPGs, board games without code changes
- Goal: 95%+ of mechanics expressible through configuration

### Type Safety Across Stack
- TypeScript strict mode everywhere
- Shared types via `@tomeforge/shared` package
- Runtime validation matches compile-time types
- Mongoose schemas generate TypeScript types

### Data-Driven Everything
- UI generated from system configurations
- Rules stored in database, not code
- Dynamic schema support for user-defined game systems
- Flexible field types (number, string, boolean, custom)

### Progressive Enhancement
- Features work independently
- Integration enhances but doesn't require
- Mobile-first responsive design
- Core functionality without JavaScript

## Current Focus: Phase 0

Before expanding features, complete Phase 0 developer infrastructure:

**Priority Tasks:**
1. Set up API documentation (Swagger/OpenAPI)
2. Configure testing frameworks (Vitest, Playwright)
3. Enhance CI/CD pipeline
4. Implement schema complexity validation
5. Create Docker Compose for local dev
6. Document setup process (< 5 commands)

**Why Phase 0 Matters:**
- Enables confident refactoring
- Prevents regressions when returning after breaks
- Supports future collaboration
- Acts as project "memory" for sporadic development

## Updating This Documentation

- **Product Strategy Changes**: Update `product/mission.md` and `roadmap.md`
- **Technical Decisions**: Document in `product/tech-stack.md` or `technical-constraints.md`
- **Process Changes**: Update `product/development-practices.md`
- **Keep CLAUDE.md in sync**: When updating product docs, reflect key changes in root `CLAUDE.md`

## Questions or Issues?

- Product vision questions: See `product/mission.md` or open a discussion
- Technical constraints: Check `product/technical-constraints.md`
- Development workflow: Consult `product/development-practices.md`
- Technology choices: Reference `product/tech-stack.md`

---

**Last Updated**: 2025-10-18
**Documentation Version**: 1.3.0 (Added context management + ADR system + Subagent roles)
