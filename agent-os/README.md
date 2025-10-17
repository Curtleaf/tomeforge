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
│   ├── global/           # Cross-cutting standards
│   ├── backend/          # Backend-specific standards
│   ├── frontend/         # Frontend-specific standards
│   └── testing/          # Testing standards
├── roles/                # Agent role definitions
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

## How to Use This Documentation

### For Development Work
1. **Starting new feature**: Review `roadmap.md` for priority and dependencies
2. **Writing code**: Follow standards in `development-practices.md`
3. **Schema changes**: Check constraints in `technical-constraints.md`
4. **Technology choices**: Consult `tech-stack.md` for approved stack
5. **Product decisions**: Reference `mission.md` for alignment with vision

### For AI Assistants (Claude Code)
The `CLAUDE.md` file in the repository root provides a summary of key information from these documents. AI assistants should:
1. Reference `CLAUDE.md` for quick context
2. Dive into specific `agent-os/product/` files for detailed guidance
3. Follow schema constraints and testing requirements strictly
4. Prioritize Phase 0 tasks before expanding features

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

**Last Updated**: 2025-10-17
**Documentation Version**: 1.0.0
