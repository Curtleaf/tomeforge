## Tech stack

Define your technical stack below. This serves as a reference for all team members and helps maintain consistency across the project.

### Framework & Runtime
- **Application Framework:** Express (backend), Vite (frontend build)
- **Language/Runtime:** Node.js v18+, TypeScript
- **Package Manager:** pnpm (monorepo workspace)

### Frontend
- **JavaScript Framework:** React 18
- **Build Tool:** Vite
- **CSS Framework:** Custom (to be defined)
- **UI Components:** @tomeforge/shared (custom shared components)

### Database & Storage
- **Database:** MongoDB Atlas (cloud) or local MongoDB instance
- **ORM/Query Builder:** Mongoose
- **Caching:** Not configured

### Testing & Quality
- **Test Framework:** Jest (not fully configured)
- **Linting/Formatting:** ESLint, TypeScript compiler
- **Type Checking:** TypeScript strict mode

### Deployment & Infrastructure
- **Hosting:** Not configured (backend), GitHub Pages (docs only)
- **CI/CD:** GitHub Actions (documentation deployment)
- **Documentation:** Docsify (static site)

### Third-Party Services
- **Authentication:** Not configured
- **Email:** Not configured
- **Monitoring:** Not configured

### Monorepo Architecture
- **Workspace Manager:** pnpm workspaces
- **Packages:**
  - `apps/backend` - Express API server
  - `apps/frontend` - React + Vite application
  - `packages/shared` - Shared Mongoose models, types, and utilities
