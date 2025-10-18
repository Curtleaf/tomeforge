# Product Roadmap

## Phase 0: Developer Infrastructure (CRITICAL FOUNDATION)

**Goal:** Establish development practices, tooling, and automation that enable efficient solo development and future collaboration.

**Priority:** Complete before expanding feature development

**Code Review (2025-01-17):** See `agent-os/product/code-review-2025-01-17.md` for detailed findings

### Critical Bug Fixes (P0 - BLOCKING)
1. [ ] Fix Database Query Bugs — Correct `findByIdAndUpdate` to use `findOneAndUpdate` with numeric systemId in modifySystem and deleteSystem (apps/backend/src/data-access/system.ts) `XS`
2. [ ] Input Validation Middleware — Add request validation using zod/joi for all POST/PUT endpoints to prevent invalid data (apps/backend/src/routes/system.ts) `S`
3. [ ] Error Handling Standardization — Implement proper HTTP status codes (400/404/409/500) and error response structure across all endpoints `XS`
4. [ ] Secure Connection String Handling — Add URL encoding for database credentials and redact sensitive info from error logs (apps/backend/src/utils/db/db.ts) `XS`

### Documentation & Standards
5. [x] API Documentation Setup — Configure Swagger/OpenAPI for automatic API documentation generation from code `XS`
6. [ ] TypeDoc Configuration — Set up TypeDoc for auto-generating documentation from TypeScript types and JSDoc comments `XS`
7. [ ] Architecture Decision Records — Create ADR template and document initial architecture decisions `XS`

### Testing Infrastructure
8. [ ] Unit Testing Framework — Configure Vitest for shared package and backend, Jest for integration tests; achieve 70%+ coverage for backend services/data-access layers (currently 0%) `S`
9. [ ] Integration Testing Suite — Add API endpoint integration tests with actual database operations, error scenarios, and HTTP response validation `M`
10. [ ] Frontend Testing Setup — Set up React Testing Library and component test structure with 60%+ coverage target `S`
11. [ ] E2E Testing Foundation — Configure Playwright for critical user journey testing `S`
12. [ ] Test Coverage Reporting — Integrate coverage reporting with CI/CD pipeline (codecov.io or similar); enforce 70% minimum for backend, 80% for shared package `XS`

### CI/CD Pipeline
13. [ ] GitHub Actions Workflow — Expand CI/CD to run tests, type checking, and linting on all PRs `S`
14. [ ] Pre-commit Hooks — Configure husky with pre-commit hooks for type checking, linting, and running tests `XS`
15. [ ] Build Automation — Ensure consistent builds across development and production environments `S`

### Schema Validation & Quality
16. [ ] Database Indexes — Add unique index on systemId, standard indexes on name fields for all models (packages/shared/src/models/) `XS`
17. [ ] Schema Complexity Validation — Implement linting rules to enforce max nesting depth and document size limits `M`
18. [ ] Schema Versioning System — Add schemaVersion field (default: 1) to all models with validation; required per CLAUDE.md but currently missing `S`
19. [ ] Type Safety Improvements — Replace Schema.Types.Mixed with discriminated unions in Character model primaryValue/secondaryValues fields (packages/shared/src/models/character.ts) `S`
20. [ ] Type Safety Enforcement — Configure strict TypeScript settings across all packages `XS`

### Development Environment
21. [x] Docker Compose Setup — Create comprehensive docker-compose.yml for local development with MongoDB, Redis (future) `S`
22. [x] Environment Documentation — Document local setup process, ensure < 5 commands to run locally `XS`
23. [ ] VS Code Workspace Config — Create recommended extensions and settings for consistent dev experience `XS`

### Database Infrastructure
24. [ ] Migration System Setup — Configure migrate-mongo for database schema migrations with up/down scripts and version tracking `S`

**Estimated Duration:** 2-3 weeks
**Payoff:** Dramatically reduces friction for all future development, enables confident refactoring, prevents regressions

> Phase 0 is critical infrastructure that makes sporadic development viable. These practices and tools serve as your "memory" when returning to the project after breaks and enable future contributors to onboard quickly.

---

## Phase 1: Foundation & Core Infrastructure (PARTIALLY COMPLETE)

**Code Review Priority:** Authentication and security are critical gaps (all endpoints currently open)

### Security & Authentication (P1 Priority)
25. [ ] User Authentication & Authorization — Implement secure login, registration, password management, and role-based access control with Passport.js + JWT + argon2; security scheme documented in swagger.config.ts but not implemented `M`
26. [ ] CORS Configuration — Add cors middleware with appropriate origin restrictions for production deployment `XS`
27. [ ] Rate Limiting Middleware — Implement express-rate-limit to prevent DoS attacks (recommend 100 requests per 15 min window per IP) `XS`
28. [ ] Security Headers — Add helmet.js for security headers (CSP, HSTS, X-Frame-Options, etc.) `XS`

### Core Data Infrastructure
29. [ ] World/Workspace Management — Create top-level organizational containers where users can create, manage, and organize multiple worlds with basic CRUD operations `S`
30. [ ] Enhanced System Builder — Extend current system configuration to support complex rule definitions, dice mechanics, stat types (number/string/boolean), and nested configurations `L`
31. [ ] Basic Character Sheet Engine — Build dynamic character sheet generation from system configurations with default layouts and mobile-responsive design `L`
32. [ ] File Storage Foundation — Implement file upload, storage, and retrieval system for PDFs, images, and documents with user quota management `M`

> Phase 1 establishes core data models and authentication, building on the existing system/character models while creating the foundational infrastructure for user management and file handling.

## Phase 2: Gameplay Tools & Real-Time Features

33. [ ] Campaign Management — Create campaign entities with player roster management, session scheduling, and campaign-level notes and resources `M`
34. [ ] Dice Rolling Engine — Build configurable dice roller that interprets system-specific rules, supports modifiers, and logs results with real-time updates `S`
35. [ ] Combat Tracker — Implement initiative tracking, turn order management, health/resource monitoring with real-time synchronization across connected users `L`
36. [ ] Character-Bound Notes — Add note-taking system with markdown support, attachments, and organization by character or campaign `S`
37. [ ] WebSocket Infrastructure — Establish WebSocket connections for real-time updates during live play, including dice rolls, health changes, and turn progression `M`
38. [ ] Inventory Management System — Create dynamic item and equipment tracking that adapts to system-defined item schemas with encumbrance and organization `M`

> Phase 2 delivers core gameplay tools that make TomeForge useful during active sessions, with emphasis on real-time collaboration and mobile accessibility.

## Phase 3: Content Sharing & Marketplace

39. [ ] Content Sharing System — Implement granular permissions for sharing systems, characters, and campaigns with visibility controls (public/private/shared) `M`
40. [ ] System Inheritance & Forking — Enable systems to inherit from base systems with modification tracking, allowing house rules and system variants `L`
41. [ ] Marketplace Foundation — Build content marketplace infrastructure with listing creation, search/discovery, and free content distribution `L`
42. [ ] Payment Integration — Add payment processing for paid content with seller accounts, transaction management, and revenue distribution `L`
43. [ ] Commenting & Discussion — Implement commenting system on shared content with threading, notifications, and moderation tools `M`
44. [ ] Content Versioning — Add version control for systems and content with changelog tracking and ability to roll back or upgrade `M`

> Phase 3 transforms TomeForge from a personal tool into a collaborative platform with community-driven content creation and distribution.

## Phase 4: Advanced Automation & Integration

45. [ ] Rule Automation Engine — Build system for automating gameplay mechanics based on system rules (auto-calculate modifiers, apply conditions, trigger effects) `XL`
46. [ ] Skills & Progression Tracking — Create dynamic progression system that handles leveling, skill advancement, and system-specific character development `L`
47. [ ] VTT Integration (Foundry) — Develop Foundry VTT integration for bidirectional file sync, module management, and optional live data sharing `L`
48. [ ] Webhook System — Implement webhook infrastructure allowing external tools to subscribe to events (character updates, dice rolls, combat actions) `M`
49. [ ] API Platform — Build comprehensive REST API with authentication, rate limiting, and documentation for third-party integrations `L`
50. [ ] Advanced Dice Macros — Extend dice engine with saved macros, complex formulas, and system-specific automation triggers `S`

> Phase 4 leverages TomeForge's unique position as a unified platform to provide automation and integrations impossible in fragmented ecosystems.

## Phase 5: World Building & Documentation

51. [ ] World Building Framework — Create entities for locations, NPCs, factions, and lore with rich text editing and relationship mapping `L`
52. [ ] Wiki-Style Documentation — Build interconnected documentation system with linking, search, and hierarchical organization for campaign knowledge `M`
53. [ ] Timeline & Calendar Tools — Add customizable calendars and timelines for tracking in-game events and campaign chronology `M`
54. [ ] Map Integration — Support map uploads with pin annotations, fog of war, and integration with campaign locations and encounters `L`
55. [ ] NPC & Monster Database — Create searchable databases of NPCs and creatures with stat blocks generated from system configurations `M`
56. [ ] Session Recap Generator — Auto-generate session summaries from combat logs, notes, and events with AI-assisted formatting `S`

> Phase 5 expands TomeForge beyond gameplay tools into comprehensive campaign and world management, competing with World Anvil while maintaining tight integration with gameplay.

## Phase 6: Polish, Performance & Ecosystem

**Code Review Findings:** Several performance optimizations identified for future implementation

### API & Query Performance
57. [ ] Pagination Implementation — Add limit/offset/sort query parameters to all GET endpoints (apps/backend/src/routes/system.ts has commented pattern at lines 314-350) `S`
58. [ ] Business Logic in Service Layer — Enhance service layer with actual validation, caching, audit logging beyond current pass-through pattern `M`
59. [ ] Caching Layer with Redis — Implement Redis caching for frequently accessed data (systems, characters), session storage; Docker service already stubbed in docker-compose.yml `M`

### Performance & Scalability
60. [ ] Mobile App Development — Build native or progressive web app with offline support for character sheets and basic tools `XL`
61. [ ] Advanced UI Customization — Allow users to drag-and-drop customize layouts, create dashboard widgets, and save UI preferences per system `L`
62. [ ] Performance Optimization — Expand beyond current connection caching: lazy loading, query optimization for large datasets, connection pooling `M`
63. [ ] Data Export & Portability — Build comprehensive data export in multiple formats (JSON, PDF, CSV) with import capabilities from other platforms `M`
64. [ ] Analytics & Insights — Provide users with play statistics, character progression visualization, and campaign activity tracking `M`
65. [ ] Monitoring & Observability — Add application monitoring, error tracking (Sentry), performance metrics, and health check endpoints `S`

### Community & Ecosystem
66. [ ] Community Features — Add user profiles, following, activity feeds, and featured content curation for community building `L`
67. [ ] Audit Logging System — Implement comprehensive audit trail for user actions, data changes, and security events `M`

> Phase 6 focuses on user experience refinement, performance at scale, and building a thriving user community around the platform.

## Notes

- **Code Review (2025-01-17):** Comprehensive review identified 2 critical bugs, security gaps, and 0% test coverage; all findings integrated into roadmap; see `agent-os/product/code-review-2025-01-17.md` for details
- **Phase 0 Priority:** Complete developer infrastructure AND critical bug fixes (items 1-4) before expanding features—essential for sustainable development
- **Existing Progress:** Phase 1 items 30-31 (System Builder, Character Sheet Engine) are partially implemented with current System and Character models in `packages/shared`
- **Security Priority:** All API endpoints currently open; authentication (item 25) and security items (26-28) are HIGH PRIORITY before any production deployment
- **Testing Gap:** Current test coverage is 0% vs targets of 70-80%; testing infrastructure (items 8-12) is critical
- **Technical Dependencies:** Phases build sequentially on infrastructure from previous phases; Phase 0 unlocks all others
- **Learning Goals:** Each phase balances shipping user value with exploring technologies (event-driven architecture, WebSockets, microservices, containerization)
- **Scope Management:** Focus remains on tools for play, not becoming a full VTT—integration over replacement
- **Flexibility:** Roadmap items can shift based on user feedback, but phasing ensures foundational capabilities before advanced features
- **Data-First Approach:** Every feature maintains system-agnostic, data-driven architecture as core principle
- **Sporadic Development Support:** Phase 0 infrastructure acts as "memory" for project, enabling efficient pickup after breaks
