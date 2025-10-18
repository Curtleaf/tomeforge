# ADR-003: Docker Compose for Local Development Infrastructure

**Status:** Accepted

**Date:** 2025-10-18

**Deciders:** Project Owner

**Tags:** infrastructure, developer-experience, docker, database

---

## Context

TomeForge backend requires MongoDB for data storage. Developers need a consistent, reproducible way to run dependencies locally without polluting their host system or dealing with version conflicts.

**Key Questions:**
- How should developers run MongoDB locally?
- Should we require local MongoDB installation or containerize it?
- What about future services (Redis, elasticsearch)?
- How do we ensure consistency across development environments?
- How do we support both host-based apps (current) and containerized apps (future)?

**Constraints:**
- Solo developer with sporadic dev time - setup must be simple
- Need to support macOS, Linux, and Windows
- Fast iteration cycles - can't wait minutes for container builds
- Applications (backend/frontend) should run on host with hot-reloading
- Must work offline for development

---

## Decision

**We have decided to:** Use Docker Compose for local infrastructure services, while keeping applications running on the host.

**This means:**
- **Containerized infrastructure**: MongoDB, mongo-express (admin UI), Redis (future)
- **Host-based applications**: Backend and frontend run directly on host for fast iteration
- **Dual connectivity pattern**: Services exposed on `localhost` for host apps, and via Docker network for future containerized apps
- **Volume persistence**: Database data persists across container restarts
- **Environment configuration**: Separate `.env.docker` for infrastructure, `apps/backend/.env` for application

**Architecture:**
```
Host Machine:
  ├── Backend (Express) → connects to localhost:27017
  ├── Frontend (Vite)   → connects to backend on localhost:3000
  └── Docker Compose
      ├── MongoDB (port 27017)
      ├── mongo-express (port 8081)
      └── Redis (stubbed, port 6379)
```

---

## Alternatives Considered

### Alternative 1: Local MongoDB Installation
**Pros:**
- No Docker required
- Slightly faster startup
- Native system service

**Cons:**
- Version inconsistency across developer machines
- Pollutes host system
- Difficult to reset/clean state
- No admin UI included
- Hard to document exact setup steps
- Different instructions for macOS/Linux/Windows

**Why rejected:** Inconsistent environments lead to "works on my machine" problems. Docker provides reproducibility.

### Alternative 2: MongoDB Atlas Only (Cloud)
**Pros:**
- No local setup required
- Fully managed
- Free tier available

**Cons:**
- Requires internet connection
- Slower for development iteration
- Can't test offline
- Sharing dev database is messy
- Risk of accidentally modifying shared data

**Why rejected:** Development should work offline. Cloud can be used for staging/demo, not local dev.

### Alternative 3: Fully Dockerized Stack (Apps + Services)
**Pros:**
- Complete environment isolation
- Reproducible builds
- Production-like environment

**Cons:**
- Slower iteration (rebuild containers for code changes)
- More complex setup
- Hot-reloading is tricky in containers
- Volumes needed for source code mounting
- Overkill for current stage

**Why rejected:** Premature optimization. Host-based apps with Docker services provides 90% of benefits with 10% of complexity. Can move to full containerization later if needed.

### Alternative 4: Dev Containers (VS Code)
**Pros:**
- Fully isolated environment
- Great VS Code integration
- Reproducible setup

**Cons:**
- Requires VS Code (locks into editor)
- Steeper learning curve
- More complex configuration
- Slower than native development

**Why rejected:** Too opinionated on tooling. Docker Compose is editor-agnostic.

---

## Consequences

### Positive Consequences
- **Reproducible environments**: Every developer gets identical MongoDB setup
- **Fast setup**: `docker compose up -d` is all that's needed
- **Clean state**: `docker compose down -v` nukes everything for fresh start
- **GUI included**: mongo-express provides web UI for database inspection
- **Port conflicts avoided**: Only bind to `127.0.0.1`, not `0.0.0.0`
- **Future-ready**: Easy to add Redis, elasticsearch, etc.
- **Offline development**: Everything runs locally
- **No system pollution**: MongoDB contained, easy to remove
- **Fast iteration**: Apps on host mean instant hot-reloading

### Negative Consequences / Trade-offs
- **Requires Docker**: Developers must install Docker Desktop (one-time)
- **Resource usage**: Docker Desktop uses memory even when idle (can quit when not developing)
- **Port binding conflicts**: If local MongoDB already running, need to stop it or change ports
- **Two config files**: `.env.docker` for infrastructure, `apps/backend/.env` for app

### Mitigation Strategies
- **Clear documentation**: `CLAUDE.md` has comprehensive Docker section with troubleshooting
- **Quick start guide**: 4-command setup documented
- **Health checks**: Containers have health checks to ensure proper startup
- **Troubleshooting section**: Common issues (port conflicts, connection refused) documented
- **Future migration path**: Can containerize apps later without changing infrastructure

---

## Implementation Notes

**Files/Components Affected:**
- `docker-compose.yml` - Service definitions
- `.env.docker` - Infrastructure environment variables
- `.env.docker.example` - Template for developers
- `docker/mongo-init/init-user.js` - MongoDB user creation script
- `apps/backend/.env` - Backend connection to localhost:27017
- `CLAUDE.md` - Docker section (lines 99-191)

**Dependencies:**
- Docker Desktop (macOS/Windows) or Docker Engine (Linux)
- Docker Compose V2 (included in Docker Desktop)
- Minimum version: Docker 20.10+

**Services:**

1. **MongoDB** (`tomeforge-mongodb`)
   - Image: `mongo:7.0`
   - Port: `127.0.0.1:27017:27017`
   - Volume: `tomeforge-mongodb-data` (persistent)
   - Init script: Creates `tomeforge_app` user automatically

2. **mongo-express** (`tomeforge-mongo-express`)
   - Image: `mongo-express:latest`
   - Port: `127.0.0.1:8081:8081`
   - Basic auth: admin/express123 (configurable)
   - Connects to MongoDB via Docker network

3. **Redis** (stubbed, commented out)
   - Image: `redis:7-alpine`
   - Port: `127.0.0.1:6379:6379`
   - Uncomment when needed for caching/sessions

**Setup Flow:**
```bash
# First time setup
cp .env.docker.example .env.docker
docker compose up -d
# Configure apps/backend/.env with connection string
pnpm start

# Daily workflow
docker compose up -d
pnpm start

# Reset data
docker compose down -v
```

**Related ADRs:**
- [ADR-001: MongoDB over PostgreSQL](./001-mongodb-over-postgresql.md) - Why MongoDB
- (Future) ADR-XXX: When to containerize applications
- (Future) ADR-XXX: Redis integration for caching

---

## References

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [mongo-express Docker Image](https://hub.docker.com/_/mongo-express)
- TomeForge docs:
  - `CLAUDE.md` - Complete Docker setup guide (lines 99-191)
  - `.env.docker.example` - Configuration template

**Implemented in:**
- Spec: `agent-os/specs/2025-10-17-docker-compose-setup/`
- Implementation date: 2025-10-17

---

## Metadata

**Supersedes:** N/A (Initial infrastructure decision)

**Superseded by:** N/A (Active)

**Related Decisions:**
- ADR-001: MongoDB over PostgreSQL
- (Future) ADR-XXX: Full containerization with Docker Compose profiles
- (Future) ADR-XXX: Kubernetes deployment for production
