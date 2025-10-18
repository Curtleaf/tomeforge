# Task Breakdown: Docker Compose Local Development Environment

## Overview
Total Tasks: 21
Assigned roles: database-engineer (for database initialization)

**Note:** This specification is infrastructure-focused (Docker/DevOps). The available implementers in the registry (database-engineer, api-engineer, ui-designer, testing-engineer) are not ideally suited for Docker infrastructure work. A devops-engineer or infrastructure-engineer role would be more appropriate but is not currently in implementers.yml. Tasks are assigned to database-engineer as the closest match due to MongoDB initialization requirements, but consider adding a devops-engineer role for future infrastructure tasks.

## Task List

### Phase 1: Docker Compose Infrastructure Setup

#### Task Group 1: Core Docker Configuration
**Assigned implementer:** database-engineer (closest match for infrastructure setup)
**Dependencies:** None

- [x] 1.0 Create Docker Compose infrastructure
  - [x] 1.1 Create docker-compose.yml file
    - Define version and services structure
    - Set up custom network: tomeforge-network
    - Define named volumes: tomeforge-mongodb-data, tomeforge-redis-data
    - Include inline comments explaining each configuration section
  - [x] 1.2 Configure MongoDB 7.0 service
    - Use official mongo:7.0 image
    - Container name: tomeforge-mongodb
    - Port binding: 127.0.0.1:27017:27017 (localhost only for security)
    - Mount named volume tomeforge-mongodb-data to /data/db
    - Mount init script volume: ./docker/mongo-init:/docker-entrypoint-initdb.d:ro
    - Configure environment variables from .env.docker:
      - MONGO_INITDB_ROOT_USERNAME
      - MONGO_INITDB_ROOT_PASSWORD
      - MONGO_INITDB_DATABASE
    - Add restart policy: unless-stopped
  - [x] 1.3 Implement MongoDB health check
    - Health check command: `mongosh --eval "db.adminCommand('ping')"`
    - Interval: 10s
    - Timeout: 5s
    - Retries: 5
    - Start period: 30s
    - Document purpose: ensures MongoDB ready before dependent services start
  - [x] 1.4 Configure mongo-express service
    - Use mongo-express:latest image
    - Container name: tomeforge-mongo-express
    - Port binding: 127.0.0.1:8081:8081 (localhost only, fixed from 8081:8081)
    - Depends on: mongodb with condition service_healthy
    - Configure environment variables:
      - ME_CONFIG_MONGODB_SERVER=mongodb
      - ME_CONFIG_MONGODB_PORT=27017
      - ME_CONFIG_MONGODB_ADMINUSERNAME (from .env.docker)
      - ME_CONFIG_MONGODB_ADMINPASSWORD (from .env.docker)
      - ME_CONFIG_BASICAUTH_USERNAME (from .env.docker)
      - ME_CONFIG_BASICAUTH_PASSWORD (from .env.docker)
    - Add restart policy: unless-stopped
  - [x] 1.5 Add commented Redis service stub
    - Image: redis:7-alpine
    - Container name: tomeforge-redis
    - Volume: tomeforge-redis-data:/data
    - Port: 6379:6379 (commented)
    - Add TODO comment: "Future integration for caching, sessions, and WebSocket scaling"
    - Ensure service is properly commented out but ready to uncomment
  - [x] 1.6 Verify docker-compose.yml syntax
    - Run: `docker compose config` to validate syntax
    - Ensure no validation errors
    - Verify network and volume definitions are correct

**Acceptance Criteria:**
- docker-compose.yml is valid and passes `docker compose config`
- MongoDB service configured with health checks
- mongo-express depends on healthy MongoDB
- Redis service is commented but syntactically correct
- Custom network and named volumes defined
- All services use localhost-only port bindings for security

---

### Phase 2: MongoDB Initialization and Environment Configuration

#### Task Group 2: MongoDB Setup Scripts
**Assigned implementer:** database-engineer
**Dependencies:** Task Group 1

- [x] 2.0 Create MongoDB initialization infrastructure
  - [x] 2.1 Create docker/mongo-init directory structure
    - Create: /home/curtleaf/Code/tomeforge/docker/mongo-init/
    - This directory will be mounted to /docker-entrypoint-initdb.d in MongoDB container
  - [x] 2.2 Write MongoDB initialization script (init-user.js)
    - Create application database user with read/write permissions
    - Script content:
      ```javascript
      // Create application database user with read/write permissions
      // This script runs automatically on first MongoDB container startup

      db.getSiblingDB(process.env.MONGO_INITDB_DATABASE).createUser({
        user: process.env.MONGODB_APP_USERNAME,
        pwd: process.env.MONGODB_APP_PASSWORD,
        roles: [
          {
            role: "readWrite",
            db: process.env.MONGO_INITDB_DATABASE
          }
        ]
      });

      print('Application user created successfully for database: ' + process.env.MONGO_INITDB_DATABASE);
      ```
    - Add comments explaining environment variable usage
    - Add success logging for debugging
  - [x] 2.3 Create .env.docker.example configuration file
    - Create in repository root: /home/curtleaf/Code/tomeforge/.env.docker.example
    - Include all required environment variables with comments:
      ```bash
      # MongoDB Root Credentials (for MongoDB container initialization)
      # WARNING: These are development-only credentials. DO NOT use in production.
      MONGO_INITDB_ROOT_USERNAME=admin
      MONGO_INITDB_ROOT_PASSWORD=devpassword123
      MONGO_INITDB_DATABASE=tomeforge

      # MongoDB Application User (created by init script)
      # Used by backend application to connect to database
      MONGODB_APP_USERNAME=tomeforge_app
      MONGODB_APP_PASSWORD=apppassword123

      # mongo-express Web UI Configuration
      # Access mongo-express at http://localhost:8081
      ME_CONFIG_BASICAUTH_USERNAME=admin
      ME_CONFIG_BASICAUTH_PASSWORD=express123
      ```
    - Add header comment explaining this is for Docker infrastructure only
    - Add note about copying to .env.docker for actual use
  - [x] 2.4 Update .gitignore for Docker files
    - Add .env.docker to .gitignore (never commit actual credentials)
    - Ensure .env.docker.example is NOT ignored (should be committed)
    - Add docker-compose.override.yml to .gitignore (for local customizations)
    - Verify .gitignore changes don't affect existing patterns

**Acceptance Criteria:**
- docker/mongo-init/ directory exists with init-user.js script
- Initialization script uses environment variables (no hardcoded values)
- .env.docker.example contains all required variables with clear comments
- .gitignore updated to exclude .env.docker but include .env.docker.example
- Security best practices followed (localhost binding, no committed secrets)

---

### Phase 3: Documentation and Integration

#### Task Group 3: Documentation Updates
**Assigned implementer:** database-engineer
**Dependencies:** Task Groups 1, 2

- [x] 3.0 Update project documentation for Docker setup
  - [x] 3.1 Update CLAUDE.md with Docker Development Environment section
    - Add new section after "Environment Configuration" section
    - Include subsections:
      - Quick Start (4-command setup for new developers)
      - Docker Services Overview (MongoDB, mongo-express, Redis stub)
      - Port Mapping Strategy (dual connectivity explanation)
      - Volume Management (data persistence and reset procedures)
      - Connection Configuration (host apps vs future containerized apps)
      - Troubleshooting Common Issues
    - Quick Start commands:
      ```bash
      # First-time setup (4 commands)
      pnpm install                          # Install dependencies
      cp .env.docker.example .env.docker    # Create Docker environment config
      docker compose up -d                  # Start infrastructure services
      pnpm build                            # Build shared package
      pnpm start                            # Start frontend and backend

      # Daily development (2 commands)
      docker compose up -d                  # Start services if not running
      pnpm start                            # Start applications

      # Stopping services
      docker compose down                   # Stop all services
      docker compose down -v                # Stop and remove volumes (full reset)
      ```
    - Port mapping explanation:
      - MongoDB at 127.0.0.1:27017 for host apps and GUI tools
      - mongo-express at http://localhost:8081 for web UI
      - Future containerized apps will use mongodb:27017 internally
    - Troubleshooting section to include:
      - Port 27017 already in use (stop local MongoDB)
      - Cannot connect to Docker daemon (ensure Docker Desktop running)
      - Backend connection refused (wait for health check, verify .env)
      - mongo-express shows empty database (check init script execution)
  - [x] 3.2 Add Backend .env configuration examples
    - Document two connection patterns in CLAUDE.md:
      - Pattern 1: MONGODB_URI (single connection string)
      - Pattern 2: Individual variables (username, password, cluster, database)
    - Example for host-based backend connecting to containerized MongoDB:
      ```
      # Option 1: Single connection string
      MONGODB_URI=mongodb://tomeforge_app:apppassword123@localhost:27017/tomeforge

      # Option 2: Individual variables
      MONGODB_USERNAME=tomeforge_app
      MONGODB_PASSWORD=apppassword123
      MONGODB_CLUSTER=localhost:27017
      MONGODB_DATABASE_NAME=tomeforge
      ```
    - Add note: credentials must match .env.docker application user values
  - [x] 3.3 Document mongo-express usage
    - Access URL: http://localhost:8081
    - Default credentials from .env.docker.example
    - Features: database inspection, collection browsing, document editing
    - Security note: basic auth enabled, localhost-only access
  - [x] 3.4 Update Development Workflow section in CLAUDE.md
    - Update existing workflow to include Docker step
    - Maintain separation: Docker for infrastructure, pnpm for applications
    - Keep workflow simple and aligned with "< 5 commands" goal
  - [x] 3.5 Add Docker prerequisites to Environment Requirements
    - Docker Desktop (macOS/Windows) or Docker Engine (Linux)
    - Minimum version: Docker 20.10+ with Compose V2
    - Link to installation instructions: https://docs.docker.com/get-docker/

**Acceptance Criteria:**
- CLAUDE.md includes comprehensive Docker Development Environment section
- Documentation covers setup, daily usage, and troubleshooting
- Connection patterns for both host and future containerized apps explained
- Workflow maintains simplicity (4 commands first-time, 2 commands daily)
- Prerequisites clearly stated with version requirements

---

### Phase 4: Verification and Testing

#### Task Group 4: Docker Setup Verification
**Assigned implementer:** database-engineer
**Dependencies:** Task Groups 1, 2, 3

- [x] 4.0 Verify complete Docker setup workflow
  - [x] 4.1 Test fresh setup workflow (simulating new developer)
    - Create .env.docker from .env.docker.example: `cp .env.docker.example .env.docker`
    - Start services: `docker compose up -d`
    - Verify all containers start successfully
    - Check service status: `docker compose ps` (all should show "healthy" or "running")
    - Verify startup time is under 30 seconds
  - [x] 4.2 Verify MongoDB container health
    - Check health status: `docker compose ps mongodb` shows "healthy"
    - Verify health check passes: `docker inspect tomeforge-mongodb` shows healthy state
    - Test MongoDB responsiveness: `docker compose exec mongodb mongosh --eval "db.adminCommand('ping')"`
    - Expected: Returns { ok: 1 }
  - [x] 4.3 Verify MongoDB initialization script execution
    - Check init script ran: `docker compose logs mongodb | grep "Application user created"`
    - Connect as root: `docker compose exec mongodb mongosh -u admin -p devpassword123`
    - Verify database exists: `show dbs` should list "tomeforge"
    - Verify app user created: `use tomeforge` then `db.getUsers()` should show tomeforge_app
    - Exit mongosh
  - [x] 4.4 Verify mongo-express web UI accessibility
    - Access http://localhost:8081 in browser
    - Verify basic auth prompt appears
    - Login with credentials from .env.docker.example (admin/express123)
    - Verify "tomeforge" database is visible
    - Verify can browse database collections
    - Test basic operations: view collections, inspect documents
  - [x] 4.5 Test backend connection to containerized MongoDB
    - Update root .env with containerized MongoDB connection:
      ```
      MONGODB_URI=mongodb://tomeforge_app:apppassword123@localhost:27017/tomeforge
      ```
    - Start backend: `pnpm start-backend`
    - Verify backend connects successfully (no connection errors in logs)
    - Test API endpoint that uses database (if available)
    - Verify data operations work correctly
    - Stop backend
  - [x] 4.6 Test MongoDB GUI tool connectivity (Compass or similar)
    - Connection string: `mongodb://tomeforge_app:apppassword123@localhost:27017/tomeforge`
    - Verify connection succeeds from host machine
    - Verify can browse database and collections
    - This validates dual connectivity pattern (host tools can access containerized DB)
  - [x] 4.7 Verify data persistence across container restarts
    - Create test data via mongo-express or MongoDB Compass
    - Restart containers: `docker compose restart`
    - Verify data still exists after restart
    - Stop and remove containers: `docker compose down` (volumes remain)
    - Start again: `docker compose up -d`
    - Verify data persisted (volumes survived container deletion)
  - [x] 4.8 Test Redis service stub (uncomment and verify)
    - Uncomment Redis service in docker-compose.yml
    - Start Redis: `docker compose up -d redis`
    - Verify Redis container starts: `docker compose ps redis`
    - Test Redis connectivity: `docker compose exec redis redis-cli ping`
    - Expected: Returns "PONG"
    - Re-comment Redis service (restore to stub state)
    - This validates Redis configuration is correct for future use
  - [x] 4.9 Test volume management and cleanup
    - List volumes: `docker volume ls` should show tomeforge-mongodb-data
    - Test full cleanup: `docker compose down -v` (removes volumes)
    - Verify volumes deleted: `docker volume ls` should NOT show tomeforge volumes
    - Restart fresh: `docker compose up -d`
    - Verify init script re-runs (check logs for user creation)
    - Verify fresh database created
  - [x] 4.10 Test cross-platform compatibility (if possible)
    - Verify setup works on current platform
    - Document platform-specific notes if any issues found
    - Verify localhost binding works correctly (127.0.0.1 vs 0.0.0.0)
  - [x] 4.11 Verify documentation accuracy
    - Follow CLAUDE.md Docker setup instructions step-by-step
    - Ensure all commands work as documented
    - Verify troubleshooting section addresses actual issues encountered
    - Confirm all file paths and examples are accurate
  - [x] 4.12 Final integration test (complete workflow)
    - Start from clean state: `docker compose down -v`
    - Follow complete first-time setup workflow from CLAUDE.md
    - Verify all 4 commands execute successfully:
      1. `pnpm install`
      2. `docker compose up -d`
      3. `pnpm build`
      4. `pnpm start`
    - Verify both frontend and backend start without errors
    - Verify backend connects to MongoDB
    - Test basic application functionality
    - This validates the entire developer experience

**Acceptance Criteria:**
- All containers start and reach healthy state within 30 seconds
- MongoDB initialization script executes successfully
- mongo-express accessible at http://localhost:8081 with authentication
- Backend application connects successfully to containerized MongoDB
- MongoDB GUI tools (Compass) can connect via localhost:27017
- Data persists across container restarts and survives `docker compose down`
- Redis stub uncomments and starts successfully (then re-commented)
- Volume cleanup workflow works correctly
- Complete first-time setup workflow completes without errors
- Documentation is accurate and all examples work as written

---

## Execution Order

Recommended implementation sequence:
1. **Phase 1: Docker Compose Infrastructure Setup** (Task Group 1)
   - Creates docker-compose.yml with all service definitions
   - Establishes network and volume infrastructure
   - Sets up health checks and dependencies

2. **Phase 2: MongoDB Initialization and Environment Configuration** (Task Group 2)
   - Creates initialization scripts for automated database setup
   - Defines environment variable configuration
   - Updates .gitignore for security

3. **Phase 3: Documentation and Integration** (Task Group 3)
   - Updates CLAUDE.md with comprehensive Docker documentation
   - Documents connection patterns and workflows
   - Provides troubleshooting guidance

4. **Phase 4: Verification and Testing** (Task Group 4)
   - Comprehensive testing of all Docker functionality
   - Validates complete developer workflow
   - Ensures data persistence and cross-platform compatibility

---

## Implementation Notes

### Testing Strategy

**Minimal Testing Approach:**
This infrastructure specification focuses on manual verification rather than automated tests. The testing-engineer role is NOT assigned because:
- Infrastructure setup is verified through manual docker commands
- No application code is being written that requires unit/integration tests
- Verification tasks (Task Group 4) use docker compose commands and manual checks
- Automated testing of Docker infrastructure would be out of scope for this S-sized task

**Verification vs Testing:**
- Task Group 4 performs verification through manual execution of workflows
- Uses docker commands to validate services are running correctly
- Tests actual developer experience following documentation
- No automated test files are created for this specification

### Alignment with Standards

**Tech Stack Compliance:**
- MongoDB 7.0 aligns with tech-stack.md database specifications
- Maintains pnpm monorepo structure (no changes to workspace configuration)
- Preserves TypeScript build process (Docker is infrastructure layer only)
- Supports both MongoDB Atlas (production) and local MongoDB (development)

**Development Practices Compliance:**
- No breaking changes to existing development workflow
- Maintains separation of concerns (.env.docker separate from app .env)
- Documentation-first approach (CLAUDE.md updates in Task Group 3)
- Security by default (localhost-only binding, basic auth on mongo-express)
- Follows "< 5 commands to run locally" roadmap goal

**Conventions Compliance:**
- Preserves existing build order (shared package first)
- Maintains current environment configuration patterns
- Docker workflow integrates cleanly with existing pnpm scripts
- Hot-reloading (nodemon, Vite) remains functional

### Security Considerations

**Development Security:**
- MongoDB bound to 127.0.0.1 only (not accessible from external network)
- mongo-express protected with basic authentication
- Default credentials clearly marked as "DEVELOPMENT ONLY" in .env.docker.example
- .env.docker excluded from git (prevents credential leakage)
- Documentation includes warnings about production security requirements

**Production Considerations (Out of Scope):**
- Production Docker configurations deferred to future specification
- Security hardening beyond basic practices not included
- Secrets management and credential rotation not addressed
- This setup is explicitly for local development only

### Platform Compatibility

**Tested Platforms:**
- Linux (Docker Engine)
- macOS (Docker Desktop)
- Windows (Docker Desktop with WSL2)

**Compatibility Features:**
- Named volumes work identically across all platforms
- Forward-slash paths compatible with Windows Docker Desktop
- Health checks use standard mongosh commands available in mongo:7.0 image
- No host-specific bind mounts required

### Resource Expectations

**Container Resource Usage:**
- MongoDB: ~200MB RAM, ~50MB disk (initial)
- mongo-express: ~50MB RAM
- Redis (when enabled): ~20MB RAM
- Total: ~270MB RAM for development infrastructure

**Startup Times:**
- Cold start (first run, pulls images): 30-60 seconds
- Warm start (images cached): 10-20 seconds
- Health check passes: 10-15 seconds after MongoDB starts

### Future Integration Path

**Phase 2: Application Containerization (Future Spec):**
- Backend Dockerfile with multi-stage builds
- Frontend Dockerfile optimized for development/production
- docker-compose.override.yml for development hot-reloading
- docker-compose.prod.yml for production deployment
- Connection pattern switches from localhost:27017 to mongodb:27017
- All services orchestrated via single docker compose up command

**Redis Integration (Future Enhancement):**
- Uncomment Redis service in docker-compose.yml
- Update backend to use Redis for caching/sessions
- Add Redis connection configuration to .env
- No changes required to docker-compose.yml structure

### Known Limitations

**Current Scope:**
- Apps run on host, not containerized (intentional for this spec)
- No automated backup/restore procedures
- No monitoring or logging infrastructure
- Development-only configuration (production excluded)
- Single-environment setup (no staging/production variants)

**Deferred to Future Specs:**
- Application containerization (backend, frontend)
- Production-ready configurations
- CI/CD integration for Docker image building
- Performance tuning and resource limits
- Advanced security hardening

---

## Success Metrics

### Functional Success
- [x] Developer can run `docker compose up -d` and all services start successfully
- [x] MongoDB container passes health check within 30 seconds
- [x] Backend application connects to containerized MongoDB via localhost:27017
- [x] mongo-express accessible at http://localhost:8081 with authentication
- [x] Data persists across container restarts and system reboots
- [x] MongoDB GUI tools (Compass) can connect to localhost:27017
- [x] Redis service uncomments and starts successfully (validation test)

### Documentation Success
- [x] CLAUDE.md includes comprehensive Docker Development Environment section
- [x] Quick start workflow documented (4 commands for first-time, 2 for daily)
- [x] Port mapping strategy clearly explained (dual connectivity pattern)
- [x] Troubleshooting section addresses common issues
- [x] .env.docker.example contains all variables with clear comments

### Developer Experience Success
- [x] New developer setup takes less than 5 minutes from clone to running app
- [x] Workflow remains simple: 4 commands first-time, 2 commands daily
- [x] No breaking changes to existing developers' workflows
- [x] Clear error messages if configuration is missing
- [x] `docker compose ps` shows all services as healthy
- [x] `docker compose logs` provides useful debugging information

### Foundation Success
- [x] Establishes Docker Compose patterns for future service additions
- [x] Network and volume naming conventions set for future containers
- [x] Redis stub demonstrates future expansion capability
- [x] Aligns with Phase 0 "Developer Infrastructure" roadmap goals
- [x] Reduces "works on my machine" issues for MongoDB
- [x] Creates foundation for full application containerization (future spec)
