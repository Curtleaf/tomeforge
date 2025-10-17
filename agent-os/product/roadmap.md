# Product Roadmap

## Phase 0: Developer Infrastructure (CRITICAL FOUNDATION)

**Goal:** Establish development practices, tooling, and automation that enable efficient solo development and future collaboration.

**Priority:** Complete before expanding feature development

### Documentation & Standards
1. [ ] API Documentation Setup — Configure Swagger/OpenAPI for automatic API documentation generation from code `XS`
2. [ ] TypeDoc Configuration — Set up TypeDoc for auto-generating documentation from TypeScript types and JSDoc comments `XS`
3. [ ] Architecture Decision Records — Create ADR template and document initial architecture decisions `XS`

### Testing Infrastructure
4. [ ] Unit Testing Framework — Configure Vitest for shared package and backend, Jest for integration tests `S`
5. [ ] Frontend Testing Setup — Set up React Testing Library and component test structure `S`
6. [ ] E2E Testing Foundation — Configure Playwright for critical user journey testing `S`
7. [ ] Test Coverage Reporting — Integrate coverage reporting with CI/CD pipeline (codecov.io or similar) `XS`

### CI/CD Pipeline
8. [ ] GitHub Actions Workflow — Expand CI/CD to run tests, type checking, and linting on all PRs `S`
9. [ ] Pre-commit Hooks — Configure husky with pre-commit hooks for type checking, linting, and running tests `XS`
10. [ ] Build Automation — Ensure consistent builds across development and production environments `S`

### Schema Validation & Quality
11. [ ] Schema Complexity Validation — Implement linting rules to enforce max nesting depth and document size limits `M`
12. [ ] Schema Versioning System — Add schema version tracking to all models with validation `S`
13. [ ] Type Safety Enforcement — Configure strict TypeScript settings across all packages `XS`

### Development Environment
14. [ ] Docker Compose Setup — Create comprehensive docker-compose.yml for local development with MongoDB, Redis (future) `S`
15. [ ] Environment Documentation — Document local setup process, ensure < 5 commands to run locally `XS`
16. [ ] VS Code Workspace Config — Create recommended extensions and settings for consistent dev experience `XS`

### Database Infrastructure
17. [ ] Migration System Setup — Configure migrate-mongo for database schema migrations with up/down scripts and version tracking `S`

**Estimated Duration:** 2-3 weeks
**Payoff:** Dramatically reduces friction for all future development, enables confident refactoring, prevents regressions

> Phase 0 is critical infrastructure that makes sporadic development viable. These practices and tools serve as your "memory" when returning to the project after breaks and enable future contributors to onboard quickly.

---

## Phase 1: Foundation & Core Infrastructure (PARTIALLY COMPLETE)

18. [ ] User Authentication & Authorization — Implement secure login, registration, password management, and role-based access control with Passport.js + JWT + argon2 `M`
19. [ ] World/Workspace Management — Create top-level organizational containers where users can create, manage, and organize multiple worlds with basic CRUD operations `S`
20. [ ] Enhanced System Builder — Extend current system configuration to support complex rule definitions, dice mechanics, stat types (number/string/boolean), and nested configurations `L`
21. [ ] Basic Character Sheet Engine — Build dynamic character sheet generation from system configurations with default layouts and mobile-responsive design `L`
22. [ ] File Storage Foundation — Implement file upload, storage, and retrieval system for PDFs, images, and documents with user quota management `M`

> Phase 1 establishes core data models and authentication, building on the existing system/character models while creating the foundational infrastructure for user management and file handling.

## Phase 2: Gameplay Tools & Real-Time Features

23. [ ] Campaign Management — Create campaign entities with player roster management, session scheduling, and campaign-level notes and resources `M`
24. [ ] Dice Rolling Engine — Build configurable dice roller that interprets system-specific rules, supports modifiers, and logs results with real-time updates `S`
25. [ ] Combat Tracker — Implement initiative tracking, turn order management, health/resource monitoring with real-time synchronization across connected users `L`
26. [ ] Character-Bound Notes — Add note-taking system with markdown support, attachments, and organization by character or campaign `S`
27. [ ] WebSocket Infrastructure — Establish WebSocket connections for real-time updates during live play, including dice rolls, health changes, and turn progression `M`
28. [ ] Inventory Management System — Create dynamic item and equipment tracking that adapts to system-defined item schemas with encumbrance and organization `M`

> Phase 2 delivers core gameplay tools that make TomeForge useful during active sessions, with emphasis on real-time collaboration and mobile accessibility.

## Phase 3: Content Sharing & Marketplace

29. [ ] Content Sharing System — Implement granular permissions for sharing systems, characters, and campaigns with visibility controls (public/private/shared) `M`
30. [ ] System Inheritance & Forking — Enable systems to inherit from base systems with modification tracking, allowing house rules and system variants `L`
31. [ ] Marketplace Foundation — Build content marketplace infrastructure with listing creation, search/discovery, and free content distribution `L`
32. [ ] Payment Integration — Add payment processing for paid content with seller accounts, transaction management, and revenue distribution `L`
33. [ ] Commenting & Discussion — Implement commenting system on shared content with threading, notifications, and moderation tools `M`
34. [ ] Content Versioning — Add version control for systems and content with changelog tracking and ability to roll back or upgrade `M`

> Phase 3 transforms TomeForge from a personal tool into a collaborative platform with community-driven content creation and distribution.

## Phase 4: Advanced Automation & Integration

35. [ ] Rule Automation Engine — Build system for automating gameplay mechanics based on system rules (auto-calculate modifiers, apply conditions, trigger effects) `XL`
36. [ ] Skills & Progression Tracking — Create dynamic progression system that handles leveling, skill advancement, and system-specific character development `L`
37. [ ] VTT Integration (Foundry) — Develop Foundry VTT integration for bidirectional file sync, module management, and optional live data sharing `L`
38. [ ] Webhook System — Implement webhook infrastructure allowing external tools to subscribe to events (character updates, dice rolls, combat actions) `M`
39. [ ] API Platform — Build comprehensive REST API with authentication, rate limiting, and documentation for third-party integrations `L`
40. [ ] Advanced Dice Macros — Extend dice engine with saved macros, complex formulas, and system-specific automation triggers `S`

> Phase 4 leverages TomeForge's unique position as a unified platform to provide automation and integrations impossible in fragmented ecosystems.

## Phase 5: World Building & Documentation

41. [ ] World Building Framework — Create entities for locations, NPCs, factions, and lore with rich text editing and relationship mapping `L`
42. [ ] Wiki-Style Documentation — Build interconnected documentation system with linking, search, and hierarchical organization for campaign knowledge `M`
43. [ ] Timeline & Calendar Tools — Add customizable calendars and timelines for tracking in-game events and campaign chronology `M`
44. [ ] Map Integration — Support map uploads with pin annotations, fog of war, and integration with campaign locations and encounters `L`
45. [ ] NPC & Monster Database — Create searchable databases of NPCs and creatures with stat blocks generated from system configurations `M`
46. [ ] Session Recap Generator — Auto-generate session summaries from combat logs, notes, and events with AI-assisted formatting `S`

> Phase 5 expands TomeForge beyond gameplay tools into comprehensive campaign and world management, competing with World Anvil while maintaining tight integration with gameplay.

## Phase 6: Polish, Performance & Ecosystem

47. [ ] Mobile App Development — Build native or progressive web app with offline support for character sheets and basic tools `XL`
48. [ ] Advanced UI Customization — Allow users to drag-and-drop customize layouts, create dashboard widgets, and save UI preferences per system `L`
49. [ ] Performance Optimization — Implement caching strategies, database indexing, lazy loading, and query optimization for large datasets `M`
50. [ ] Data Export & Portability — Build comprehensive data export in multiple formats (JSON, PDF, CSV) with import capabilities from other platforms `M`
51. [ ] Analytics & Insights — Provide users with play statistics, character progression visualization, and campaign activity tracking `M`
52. [ ] Community Features — Add user profiles, following, activity feeds, and featured content curation for community building `L`

> Phase 6 focuses on user experience refinement, performance at scale, and building a thriving user community around the platform.

## Notes

- **Phase 0 Priority:** Complete developer infrastructure before expanding features—essential for sustainable development
- **Existing Progress:** Phase 1 items 20-21 (System Builder, Character Sheet Engine) are partially implemented with current System and Character models in `packages/shared`
- **Technical Dependencies:** Phases build sequentially on infrastructure from previous phases; Phase 0 unlocks all others
- **Learning Goals:** Each phase balances shipping user value with exploring technologies (event-driven architecture, WebSockets, microservices, containerization)
- **Scope Management:** Focus remains on tools for play, not becoming a full VTT—integration over replacement
- **Flexibility:** Roadmap items can shift based on user feedback, but phasing ensures foundational capabilities before advanced features
- **Data-First Approach:** Every feature maintains system-agnostic, data-driven architecture as core principle
- **Sporadic Development Support:** Phase 0 infrastructure acts as "memory" for project, enabling efficient pickup after breaks
