# Tech Stack

## Current Technologies (In Production)

### Language & Runtime
- **TypeScript** - Primary language for type safety and developer experience
- **Node.js v18+** - Runtime for backend services
- **ECMAScript Modules (ESM)** - Modern module system

### Frontend Stack
- **React 18** - UI framework with hooks and concurrent features
- **Vite** - Build tool and development server with HMR
- **TypeScript** - Type-safe frontend development
- **React Router** - Client-side routing (assumed/planned)
- **CSS** - Styling approach (framework TBD)

### Backend Stack
- **Express** - Web application framework for REST API
- **Mongoose** - MongoDB ODM with schema validation
- **MongoDB Atlas** - Cloud-hosted NoSQL database (or local MongoDB)
- **nodemon** - Development hot-reloading

### Monorepo Architecture
- **pnpm Workspaces** - Monorepo package management with workspace protocol
- **Workspace Structure:**
  - `apps/backend` - Express API server
  - `apps/frontend` - React + Vite application
  - `packages/shared` - Shared Mongoose models, TypeScript types, and utilities

### Development Tools
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking in strict mode
- **Docsify** - Static documentation site generation
- **Git** - Version control

### CI/CD & Documentation
- **GitHub Actions** - CI/CD pipeline (currently for docs deployment)
- **GitHub Pages** - Documentation hosting

## Planned Technologies (Under Consideration)

### Authentication & Authorization
- **Passport.js** - Authentication middleware (CHOSEN - flexible, widely adopted)
- **JWT (JSON Web Tokens)** - Stateless authentication
- **argon2** - Password hashing (CHOSEN - more secure than bcrypt)
- **OAuth 2.0** - Third-party authentication (Google, Discord, etc.)
- **RBAC (Role-Based Access Control)** - Permission management

### Real-Time Communication
- **Socket.IO** or **ws** - WebSocket library for real-time updates
- **Redis** - Pub/sub for WebSocket scaling and session management
- **Server-Sent Events (SSE)** - Alternative for one-way real-time updates

### File Storage
- **AWS S3** or **MinIO** - Object storage for files, PDFs, images
- **Multer** - File upload middleware
- **Sharp** - Image processing and optimization
- **PDF.js** - PDF rendering and manipulation

### Payment Processing
- **Stripe** - Payment processing for marketplace
- **Stripe Connect** - Multi-party payments for content creators
- **Webhooks** - Payment event handling

### Frontend Enhancement
- **TanStack Query (React Query)** - Server state management and caching (CHOSEN)
- **Zustand** - Client state management (CHOSEN)
- **Tailwind CSS** - Utility-first CSS framework (CHOSEN)
- **Framer Motion** - Animation library
- **React Hook Form** + **Zod** - Form validation with type safety
- **Monaco Editor** or **CodeMirror** - Code/rule editing for system builders

### Backend Enhancement
- **Express Validator** - Request validation middleware
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting (express-rate-limit, Redis-based)
- **Bull** or **BullMQ** - Job queue for background processing
- **Winston** or **Pino** - Structured logging

### Testing
- **Vitest** - Unit testing (Vite-native alternative to Jest)
- **Jest** - Unit and integration testing
- **React Testing Library** - Component testing
- **Supertest** - API endpoint testing
- **Playwright** or **Cypress** - End-to-end testing
- **MSW (Mock Service Worker)** - API mocking
- **Coverage Targets:**
  - Shared Package: 80% minimum
  - Backend Services: 70% minimum
  - Frontend Components: 60% minimum
  - Critical Paths: 100% (auth, data validation, character creation)

### Documentation Tooling
- **TypeDoc** - Auto-generate API docs from TypeScript
- **Swagger/OpenAPI** - REST API documentation with interactive UI
- **Storybook** - Component documentation and visual testing
- **Docsify** - Static documentation site generation (current)
- **JSDoc** - Inline code documentation with type information
- **Markdown** - All written documentation (README, guides, ADRs)
- **Mermaid** - Diagrams as code in documentation

### Infrastructure & Deployment
- **Docker** - Containerization for consistent environments
- **Docker Compose** - Local multi-service orchestration
- **Kubernetes** or **Docker Swarm** - Container orchestration (if scaling requires)
- **Nginx** - Reverse proxy and load balancing
- **PM2** - Process management for Node.js in production
- **GitHub Actions** - Expanded CI/CD for testing and deployment

### Monitoring & Observability
- **Sentry** - Error tracking and monitoring (CHOSEN - generous free tier, excellent DX)
- **Plausible** or **PostHog** - Privacy-focused analytics (CHOSEN - Plausible preferred)
- **DataDog** or **Prometheus + Grafana** - Application performance monitoring (future)
- **Winston + CloudWatch** or **Loki** - Log aggregation
- **Health Check Endpoints** - Service health monitoring

### Database & Caching
- **MongoDB Indexes** - Query optimization
- **MongoDB Transactions** - ACID guarantees for critical operations
- **Redis** - Caching, session storage, rate limiting
- **Mongoose Plugins** - Soft delete, timestamps, pagination
- **migrate-mongo** - Database migration management (CHOSEN - versioned schema changes)

### Search & Analytics
- **Elasticsearch** or **MeiliSearch** - Full-text search for content marketplace
- **MongoDB Atlas Search** - Built-in search capabilities
- **Plausible** or **PostHog** - Privacy-focused analytics

### API & Integration
- **GraphQL (Apollo Server)** - Alternative to REST for complex queries (evaluation phase)
- **tRPC** - Type-safe API alternative leveraging TypeScript
- **Swagger/OpenAPI** - API documentation
- **Webhooks Framework** - Event subscription system
- **Zapier/Make Integration** - No-code automation platform integration

### Advanced Features
- **AI/ML Integration:**
  - **OpenAI API** - Content generation, session recap summaries
  - **Anthropic Claude API** - Advanced text processing
  - **Vector Database (Pinecone, Weaviate)** - Semantic search
- **Web3 (Exploratory):**
  - **IPFS** - Decentralized file storage
  - **Smart Contracts** - Content ownership and royalties
  - **Wallet Integration** - Web3 authentication

## Architecture Patterns

### Current Architecture
- **Monorepo** - Single repository with multiple packages
- **Layered Architecture (Backend):**
  - Routes layer (Express handlers)
  - Services layer (Business logic)
  - Data Access layer (Database operations)
  - Utils (Database connections, helpers)
- **Shared Package Pattern** - TypeScript types and Mongoose models shared between frontend/backend

### Planned Architecture Patterns

#### Event-Driven Architecture
- **Event Bus** - Central event distribution for live play updates
- **Event Sourcing** - Store state changes as events for audit trails and replay
- **CQRS (Command Query Responsibility Segregation)** - Separate read/write models for complex workflows

#### Microservices (Selective)
- **Modular Monolith First** - Start with well-separated modules, extract to microservices if needed
- **Potential Service Boundaries:**
  - Authentication Service
  - Content/Marketplace Service
  - Real-Time/WebSocket Service
  - File Storage Service
  - Rule Automation Service

#### API Design
- **REST API** - Primary API pattern with versioning
- **WebSocket API** - Real-time bidirectional communication
- **Webhook System** - Outbound event notifications
- **GraphQL** - Evaluation for complex, nested queries (optional)

#### Data Patterns
- **Type-Safe Schemas** - Mongoose schemas generate TypeScript types via `InferSchemaType`
- **Schema Versioning** - Support multiple schema versions for backward compatibility
- **Dynamic Schemas** - Runtime schema generation based on user-defined system configurations
- **Soft Deletes** - Preserve data integrity with logical deletion
- **Audit Trails** - Track changes to critical entities

#### Frontend Architecture
- **Component-Based** - Reusable React components
- **Feature-Based Structure** - Organize by feature rather than technical layer
- **Data-Driven UI** - Components generated from system configuration data
- **Responsive Design** - Mobile-first with progressive enhancement
- **Progressive Web App (PWA)** - Offline support and installability

## Infrastructure Decisions

### Hosting Strategy (Planned)
- **Backend:** Cloud platform (AWS, DigitalOcean, Railway, Render)
- **Frontend:** CDN deployment (Vercel, Netlify, Cloudflare Pages)
- **Database:** MongoDB Atlas (managed service)
- **File Storage:** S3-compatible object storage
- **Redis:** Managed Redis (Upstash, Redis Cloud, or self-hosted)

### Containerization
- **Docker** for development environment consistency
- **Docker Compose** for local multi-service development
- **Container Registry** (Docker Hub, GitHub Container Registry)
- **Orchestration** only if scale demands (Kubernetes complexity avoided initially)

### Development Environment
- **Environment Variables** - `.env` files for configuration (not committed)
- **Environment Profiles:**
  - Local development
  - Testing/Staging
  - Production
- **Hot Reloading** - nodemon (backend), Vite HMR (frontend)

## Testing Strategy

### Testing Pyramid

```
         /\
        /  \  E2E Tests (Playwright)
       /____\  10% - Critical user journeys
      /      \
     / Integr \  Integration Tests (Supertest, RTL)
    /__________\ 30% - API endpoints, component integration
   /            \
  /  Unit Tests  \  Unit Tests (Vitest/Jest)
 /________________\ 60% - Business logic, utilities, models
```

### Test Types & Responsibilities

**Unit Tests (60% of test suite):**
- Pure functions and utilities
- Mongoose model validation
- Service layer business logic
- React hooks (isolated)
- Type guards and validators

**Integration Tests (30% of test suite):**
- API endpoint behavior (request → response)
- Database operations (Mongoose queries)
- React component with hooks and context
- File upload and processing
- Authentication flows

**E2E Tests (10% of test suite):**
- Critical user paths:
  - User registration and login
  - Create system and character
  - Join campaign and play session
  - Purchase content from marketplace
- Cross-browser compatibility
- Mobile responsive behavior

### Test Organization

```
apps/backend/
├── src/
│   ├── services/
│   │   └── system.ts
│   └── routes/
│       └── system.ts
└── tests/
    ├── unit/
    │   └── services/
    │       └── system.test.ts
    └── integration/
        └── routes/
            └── system.test.ts

apps/frontend/
├── src/
│   ├── components/
│   │   └── CharacterSheet.tsx
│   └── hooks/
│       └── useCharacter.ts
└── tests/
    ├── unit/
    │   └── hooks/
    │       └── useCharacter.test.ts
    ├── integration/
    │   └── components/
    │       └── CharacterSheet.test.tsx
    └── e2e/
        └── character-creation.spec.ts

packages/shared/
├── src/
│   └── models/
│       └── system.ts
└── tests/
    └── models/
        └── system.test.ts
```

### Test Execution

**Development Workflow:**
```bash
# Watch mode during development
pnpm test:watch

# Run tests before commit (pre-commit hook)
pnpm test

# Check coverage
pnpm test:coverage
```

**CI/CD Pipeline:**
```bash
# Run all tests in CI
pnpm test:ci

# Run E2E tests (headless)
pnpm test:e2e:ci

# Coverage report uploaded to codecov.io
```

### Mocking Strategy

**External Services:**
- API calls mocked with MSW (Mock Service Worker)
- Database mocked with in-memory MongoDB
- File storage mocked with temp directories
- WebSocket connections mocked

**Time-Based Logic:**
- Use `vi.useFakeTimers()` (Vitest) or `jest.useFakeTimers()`
- Mock `Date.now()` for consistent test results

**Environment Variables:**
- Test-specific `.env.test` file
- Override in individual test files as needed

### Performance Testing

**Load Testing (Future):**
- **k6** or **Artillery** for API load testing
- Target: 100 concurrent users, < 200ms P95 latency
- Run before major releases

**Frontend Performance:**
- Lighthouse CI in GitHub Actions
- Bundle size monitoring
- Performance budgets enforced

## Technical Principles

### Data-Driven Everything
All UI, validation, and automation driven by user-defined system configurations stored in database. Avoid hardcoding game-specific logic.

### Type Safety Across Stack
TypeScript everywhere with strict mode. Shared types between frontend/backend via `packages/shared`. Runtime validation matches compile-time types.

### System-Agnostic Design
No assumptions about specific game mechanics. Architecture must support any game from D&D to Mouse Trap without code changes.

### API-First Development
All features accessible via API for integration and automation. Public API documentation for third-party developers.

### Progressive Enhancement
Core functionality works without JavaScript. Enhanced experiences layered on top. Mobile-first responsive design.

### Security by Default
- Input validation on all boundaries
- Parameterized queries (Mongoose handles this)
- Authentication required for sensitive operations
- Rate limiting on all public endpoints
- Security headers (Helmet)
- Regular dependency audits

### Performance Considerations
- Database indexing for frequent queries
- Caching strategies (Redis for hot data)
- Lazy loading and code splitting (frontend)
- Optimistic UI updates
- WebSocket connection pooling
- CDN for static assets

### Developer Experience
- Fast feedback loops (HMR, hot reload)
- Comprehensive error messages
- Type checking catches bugs early
- Shared types prevent API contract mismatches
- Documentation alongside code

## Migration Path

### From Current to Target State

1. **Phase 1 (Immediate):**
   - Add authentication (JWT + bcrypt)
   - Implement file storage (S3 or MinIO)
   - Add input validation
   - Set up proper error handling

2. **Phase 2 (Short-term):**
   - Introduce WebSocket infrastructure
   - Add Redis for caching and sessions
   - Implement testing framework
   - Set up CI/CD pipeline

3. **Phase 3 (Medium-term):**
   - Build event-driven architecture
   - Add comprehensive API documentation
   - Implement monitoring and logging
   - Performance optimization

4. **Phase 4 (Long-term):**
   - Evaluate microservices extraction
   - Add AI/ML capabilities
   - Explore Web3 integration
   - Scale infrastructure based on usage

## Rationale for Key Decisions

### Why MongoDB?
- **Flexible schema** supports dynamic, user-defined game systems
- **Document model** maps naturally to game entities (characters, systems, campaigns)
- **Embedding** allows efficient storage of nested configurations
- **Atlas** provides managed hosting with good developer experience
- **Mongoose** provides schema validation and TypeScript integration

### Why TypeScript?
- **Type safety** prevents entire classes of bugs
- **Shared types** ensure frontend/backend contract consistency
- **Developer experience** with autocomplete and refactoring
- **Documentation** through types
- **Scales** to large codebase

### Why Monorepo?
- **Shared code** easily reused between frontend/backend
- **Atomic commits** across multiple packages
- **Simplified dependency management** with pnpm workspaces
- **Single source of truth** for types and models
- **Better for solo/small team** development

### Why React?
- **Component model** fits data-driven UI generation
- **Large ecosystem** of libraries and tools
- **Good TypeScript support**
- **Concurrent features** for performance
- **Familiar** for hiring/onboarding

### Why Event-Driven Architecture?
- **Real-time requirements** for live play
- **Webhook system** needs event infrastructure
- **Automation** triggered by game state changes
- **Audit trails** from event sourcing
- **Integration** with external tools via events

### Why Start as Monolith?
- **Faster development** for solo/small team
- **Simpler deployment** initially
- **Easy refactoring** within single codebase
- **Extract to microservices** only when boundaries are clear
- **Avoid premature optimization**

### Why Docker?
- **Consistent environments** across development machines
- **Easy onboarding** for new developers
- **Simplified deployment** with containers
- **Matches production** environment locally
- **Exploration goal** of learning containerization

### Why Not a Full VTT?
- **Scope management** - focus on tools for play, not replacing Foundry
- **Integration over replacement** - work alongside existing tools
- **Unique value** in system-agnostic platform, not 3D maps and tokens
- **Resource constraints** - VTT is massive undertaking
- **Market positioning** - complement VTTs, don't compete directly

### Why Tailwind CSS?
- **Utility-first approach** matches component-based React mental model
- **Minimal custom CSS** to maintain - reduces technical debt
- **Mobile-first responsive** design built-in (`md:`, `lg:` prefixes)
- **TypeScript config** for type-safe theme customization
- **Tree-shaking** eliminates unused styles automatically
- **Self-documenting** - utility classes make styling intentions clear
- **Dark mode support** via `dark:` prefix (future-proof)
- **Large ecosystem** - Tailwind UI, Headless UI for accessible components
- **Vertical slice friendly** - style components as you build them

### Why TanStack Query + Zustand?
**TanStack Query (React Query):**
- **Server state specialist** - handles API calls, caching, automatic refetching
- **Optimistic updates** built-in for responsive UI
- **TypeScript-first** with excellent type inference
- **Automatic loading/error states** reduces boilerplate
- **Perfect for API-first** architecture

**Zustand:**
- **Simpler than Redux** - no boilerplate, minimal concepts
- **TypeScript support** excellent with type inference
- **Tiny bundle size** (~1KB) - performance friendly
- **Persistent state** via middleware for offline support
- **Client state specialist** - UI state, form state, local preferences

**Why Not Redux:** Overkill for side project unless requiring time-travel debugging or very complex state machines. Zustand provides same capabilities with 10x less code.

### Why Passport.js + argon2?
**Passport.js:**
- **Battle-tested** - industry standard for Node.js authentication
- **Strategy pattern** - easily add OAuth providers (Google, Discord)
- **Flexible** - works with JWT, sessions, or both
- **Express integration** - first-class middleware support
- **Large ecosystem** - 500+ authentication strategies available

**argon2:**
- **More secure than bcrypt** - won the Password Hashing Competition (2015)
- **Resistant to GPU attacks** - ASIC-resistant algorithm
- **Configurable** - tune memory, iterations, parallelism
- **Recommended by OWASP** for password hashing
- **Node.js native** - good performance

### Why migrate-mongo?
- **Purpose-built** for MongoDB schema migrations
- **Version control** - track migration history in database
- **Up/down migrations** - rollback capability for safety
- **TypeScript support** - write migrations in TypeScript
- **Simple CLI** - `migrate-mongo up/down/status`
- **Critical for schema evolution** - authentication, file storage require schema changes
- **90% confidence** - proven tool, best practice for MongoDB projects

### Why Platform-Independent CI/CD?
- **Infrastructure as Code** - CI/CD defined in repository (`.github/workflows/`)
- **Multi-cloud support** - not locked to AWS, GCP, or Azure
- **GitHub Actions** - free for public repos, runs on push/PR
- **Portable** - workflows can move between Git providers (GitHub, GitLab, Bitbucket)
- **Declarative** - YAML configuration version-controlled with code
- **No external console** - manage deployments through code, not clicking UIs
- **Similar to Terraform** - declarative infrastructure, reproducible deploys
