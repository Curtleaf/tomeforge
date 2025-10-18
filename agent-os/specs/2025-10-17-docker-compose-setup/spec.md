# Specification: Docker Compose Local Development Environment

## Goal

Create a comprehensive Docker Compose configuration to provide consistent local development infrastructure for TomeForge, enabling developers to start MongoDB and future services with a single command, eliminating "works on my machine" issues and supporting the roadmap goal of less than 5 commands to run locally.

## User Stories

- As a developer, I want to start all infrastructure services with `docker compose up -d` so that I don't need to manually install and configure MongoDB locally
- As a new contributor, I want to run the project locally in under 5 minutes so that I can start contributing quickly
- As a developer, I want to use MongoDB GUI tools (Compass, Studio 3T) against the containerized database so that I can inspect and debug data
- As a developer, I want a web-based MongoDB admin UI so that I can manage the database without installing additional tools
- As a developer, I want data to persist across container restarts so that I don't lose my development data
- As a developer, I want the setup to work identically across macOS, Windows, and Linux so that team members have consistent environments

## Core Requirements

### Functional Requirements

- Docker Compose file with MongoDB 7.0 service using official MongoDB image
- Named Docker volume (tomeforge-mongodb-data) for persistent data storage
- Custom Docker network (tomeforge-network) for service communication
- MongoDB exposed to host at 127.0.0.1:27017 for both host-based apps and GUI tools
- mongo-express web UI for database management, accessible at http://localhost:8081
- Health check for MongoDB to ensure service is ready before accepting connections
- MongoDB initialization script to create default database user with appropriate permissions
- Redis service stubbed out (commented) with TODO notes for future integration
- Environment variable configuration via .env.docker file (separate from app .env)
- .env.docker.example with sensible defaults for all required configuration
- Documentation updates to CLAUDE.md explaining Docker setup and workflow

### Non-Functional Requirements

- Startup time: All services healthy within 30 seconds on typical development machines
- Security: MongoDB only accessible via localhost (127.0.0.1), not exposed to external network
- Compatibility: Works on Docker Desktop (macOS/Windows) and Docker Engine (Linux)
- Data persistence: Named volumes survive container recreation and system reboots
- Developer experience: Clear error messages if configuration is missing or incorrect
- Zero breaking changes: Existing development workflow remains functional

## Visual Design

No visual assets provided. This is an infrastructure configuration feature.

## Reusable Components

### Existing Code to Leverage

**Backend Database Connection:**
- File: `/home/curtleaf/Code/tomeforge/apps/backend/src/utils/db/db.ts`
- Connection pattern: Supports both MONGODB_URI and constructed connection strings
- Current implementation already handles connection caching
- No changes required to backend connection logic

**Environment Configuration:**
- Pattern: Root `.env` file for application configuration (already established)
- Backend loads environment variables via dotenv in db.ts
- Separation of concerns: Docker config will use separate `.env.docker` file

**Monorepo Structure:**
- pnpm workspace configuration in `pnpm-workspace.yaml`
- Build scripts already handle multi-package compilation
- Development workflow scripts in root package.json

### New Components Required

**Docker Compose Configuration:**
- No existing Docker infrastructure in the repository
- First containerization implementation for TomeForge
- Establishes patterns for future service additions (Redis, app containerization)

**MongoDB Initialization Scripts:**
- No existing database setup automation
- Required to create default user and database
- Establishes foundation for future migration scripts

**Environment Variable Management:**
- New `.env.docker` configuration file needed
- Separate from app `.env` to prevent confusion
- Clear documentation needed to explain dual .env pattern

## Technical Approach

### Docker Compose Architecture

**Service Definitions:**

1. **MongoDB Service (mongodb)**
   - Image: mongo:7.0
   - Container name: tomeforge-mongodb
   - Internal port: 27017 (Docker network)
   - External port: 127.0.0.1:27017 (host binding)
   - Volume: tomeforge-mongodb-data mounted to /data/db
   - Initialization volume: ./docker/mongo-init:/docker-entrypoint-initdb.d
   - Environment variables from .env.docker:
     - MONGO_INITDB_ROOT_USERNAME
     - MONGO_INITDB_ROOT_PASSWORD
     - MONGO_INITDB_DATABASE
   - Health check command: `mongosh --eval "db.adminCommand('ping')"`
   - Health check interval: 10s, timeout: 5s, retries: 5

2. **mongo-express Service (mongo-express)**
   - Image: mongo-express:latest
   - Container name: tomeforge-mongo-express
   - External port: 8081:8081
   - Depends on: mongodb (waits for health check)
   - Environment variables:
     - ME_CONFIG_MONGODB_SERVER=mongodb
     - ME_CONFIG_MONGODB_PORT=27017
     - ME_CONFIG_MONGODB_ADMINUSERNAME (from .env.docker)
     - ME_CONFIG_MONGODB_ADMINPASSWORD (from .env.docker)
     - ME_CONFIG_BASICAUTH_USERNAME (from .env.docker)
     - ME_CONFIG_BASICAUTH_PASSWORD (from .env.docker)

3. **Redis Service (redis) - COMMENTED OUT**
   - Image: redis:7-alpine
   - Container name: tomeforge-redis
   - Volume: tomeforge-redis-data
   - TODO comment explaining future integration for caching, sessions, and WebSocket scaling

**Network Configuration:**
- Custom bridge network: tomeforge-network
- All services attached to this network
- Enables service-to-service communication via container names
- Future-proofs for app containerization

**Volume Configuration:**
- Named volume: tomeforge-mongodb-data (MongoDB data directory)
- Named volume: tomeforge-redis-data (commented, for future use)
- Managed by Docker, survives container deletion

### MongoDB Initialization

**Initialization Script (docker/mongo-init/init-user.js):**
```javascript
// Create application database user with read/write permissions
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
```

**Execution:**
- Mounted to /docker-entrypoint-initdb.d in MongoDB container
- Automatically executed on first container startup
- Creates database and user for backend application to use
- Runs only once (checks if database already exists)

### Environment Variable Strategy

**.env.docker.example contents:**
```bash
# MongoDB Root Credentials (for MongoDB container initialization)
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=devpassword123
MONGO_INITDB_DATABASE=tomeforge

# MongoDB Application User (created by init script)
MONGODB_APP_USERNAME=tomeforge_app
MONGODB_APP_PASSWORD=apppassword123

# mongo-express Configuration
ME_CONFIG_BASICAUTH_USERNAME=admin
ME_CONFIG_BASICAUTH_PASSWORD=express123
```

**Usage Pattern:**
1. Developer copies .env.docker.example to .env.docker
2. Developer customizes credentials if desired (or uses defaults for local dev)
3. docker-compose.yml references .env.docker for variable substitution
4. .env.docker added to .gitignore (never committed)

**Backend Connection Pattern:**
- Host-based apps (current): Use localhost:27017 in MONGODB_URI or MONGODB_CLUSTER
- Future containerized apps: Use mongodb:27017 via Docker network
- No changes to apps/backend/src/utils/db/db.ts required

### Health Check Implementation

**MongoDB Health Check:**
- Command: `mongosh --eval "db.adminCommand('ping')"`
- Interval: 10 seconds
- Timeout: 5 seconds per check
- Start period: 30 seconds (grace period before checks begin)
- Retries: 5 attempts before marking unhealthy

**Purpose:**
- Ensures MongoDB is accepting connections before dependent services start
- mongo-express depends_on mongodb with condition: service_healthy
- Prevents connection errors during startup race conditions

### Integration with Existing Workflow

**Updated Development Workflow:**

1. **First-time setup:**
   ```bash
   pnpm install                    # Install dependencies
   cp .env.docker.example .env.docker  # Create Docker environment config
   docker compose up -d            # Start infrastructure services
   pnpm build                      # Build shared package
   pnpm start                      # Start frontend and backend
   ```

2. **Daily development:**
   ```bash
   docker compose up -d            # Start services if not running
   pnpm start                      # Start applications
   ```

3. **Stopping services:**
   ```bash
   docker compose down             # Stop all services
   docker compose down -v          # Stop and remove volumes (full reset)
   ```

**Backend .env Configuration:**
- For host-based backend (current), update root `.env`:
  ```
  MONGODB_URI=mongodb://tomeforge_app:apppassword123@localhost:27017/tomeforge
  ```
- Or using individual variables:
  ```
  MONGODB_USERNAME=tomeforge_app
  MONGODB_PASSWORD=apppassword123
  MONGODB_CLUSTER=localhost:27017
  MONGODB_DATABASE_NAME=tomeforge
  ```

### File Structure

```
/home/curtleaf/Code/tomeforge/
├── docker-compose.yml              # New: Main Docker Compose configuration
├── .env.docker.example             # New: Example environment variables
├── .env.docker                     # New: Gitignored, created by developer
├── .gitignore                      # Updated: Add .env.docker
├── docker/                         # New: Docker-related files
│   └── mongo-init/                 # New: MongoDB initialization scripts
│       └── init-user.js            # New: Creates app database user
├── CLAUDE.md                       # Updated: Add Docker section
└── README.md                       # Updated: Add Docker setup instructions
```

## Out of Scope

### Explicitly Excluded (Deferred to Future Specifications)

- Containerizing the backend application (Dockerfile for apps/backend)
- Containerizing the frontend application (Dockerfile for apps/frontend)
- Production Docker configurations and multi-stage builds
- Docker orchestration tools (Kubernetes, Docker Swarm)
- Backup and restore scripts for MongoDB data
- Monitoring and logging infrastructure (Prometheus, Grafana, ELK)
- CI/CD Docker image building and registry management
- Multi-environment configurations (staging, production)
- Performance tuning and resource limits
- Security hardening beyond basic localhost binding
- Hot-reloading integration for containerized apps
- Database migration automation beyond initial setup

### Future Enhancements

**Phase 2 - Full Containerization (Future Spec):**
- Backend Dockerfile with multi-stage builds
- Frontend Dockerfile optimized for production
- Development docker-compose.override.yml with volume mounts for hot-reloading
- Production docker-compose.prod.yml with optimized settings
- Docker secrets management for sensitive credentials
- Nginx reverse proxy container for routing

## Success Criteria

### Functional Success

- Developer can run `docker compose up -d` and all services start successfully
- MongoDB container passes health check within 30 seconds
- Backend application (running on host) connects to containerized MongoDB via localhost:27017
- mongo-express accessible at http://localhost:8081 with basic authentication
- Data persists across container restarts (docker compose restart)
- Data survives system reboots with containers auto-restarted (if Docker Desktop configured)
- Developer can use MongoDB Compass or other GUI tools to connect to localhost:27017
- MongoDB initialization script creates application user on first startup
- Redis service can be uncommented and starts successfully (verification test)

### Documentation Success

- CLAUDE.md includes new "Docker Development Environment" section with:
  - Quick start commands (4-step setup)
  - Port mapping explanation (dual connectivity pattern)
  - mongo-express usage instructions
  - Volume management and data reset procedures
  - Troubleshooting common issues
- .env.docker.example contains all required variables with clear comments
- docker-compose.yml includes inline comments explaining each service configuration
- README.md updated with Docker prerequisite (Docker Desktop or Docker Engine)

### Developer Experience Success

- New developer setup takes less than 5 minutes from clone to running application
- Workflow remains simple: 4 commands for first-time setup, 2 for daily development
- No breaking changes to existing developers' workflows (can still use external MongoDB)
- Clear error messages if .env.docker is missing (with helpful instructions)
- `docker compose ps` shows all services as healthy
- `docker compose logs` provides useful debugging information

### Foundation Success

- Establishes Docker Compose patterns for future service additions
- Redis stub uncommented and functional as proof-of-concept
- Network and volume naming conventions set precedent for future containers
- Aligns with Phase 0 "Developer Infrastructure" roadmap goals
- Reduces "works on my machine" issues related to MongoDB installation
- Creates foundation for full app containerization in follow-up specification

## Implementation Notes

### Alignment with Standards

**Tech Stack Compliance:**
- Uses official MongoDB 7.0 image (aligns with agent-os/standards/global/tech-stack.md)
- Maintains pnpm monorepo structure (no changes to package management)
- Preserves TypeScript build process (Docker is infrastructure only)
- Supports both MongoDB Atlas (production) and local MongoDB (development)

**Development Practices Compliance:**
- No breaking changes to existing development workflow
- Follows separation of concerns (.env.docker separate from app .env)
- Documentation-first approach (CLAUDE.md and README updates included)
- Security by default (localhost-only binding, basic authentication on mongo-express)

**Connection Pattern Philosophy:**
- Infrastructure-first: Default to containerized services for consistency
- Dual connectivity: Support both host apps (current) and container apps (future)
- Override flexibility: Developers can still use external databases if preferred
- Migration path: Easy transition when apps are containerized

### Security Considerations

- MongoDB bound to 127.0.0.1, not 0.0.0.0 (localhost only, not externally accessible)
- Default credentials in .env.docker.example clearly marked as "FOR DEVELOPMENT ONLY"
- mongo-express protected with basic authentication (prevents accidental exposure)
- .env.docker added to .gitignore (prevents credential leakage)
- Documentation warning about production security requirements
- Initialization script uses environment variables (no hardcoded credentials)

### Platform Compatibility

- Named volumes work identically across macOS, Windows, Linux
- Port binding syntax compatible with all Docker versions
- Health check command uses mongosh (available in mongo:7.0 image)
- File paths use forward slashes (compatible with Windows Docker Desktop)
- No host-specific configurations or bind mounts required

### Troubleshooting Guidance

Common issues to document in CLAUDE.md:

1. **Port 27017 already in use:**
   - Solution: Stop local MongoDB installation or change port mapping

2. **"Cannot connect to Docker daemon":**
   - Solution: Ensure Docker Desktop is running

3. **"Volume not found" errors:**
   - Solution: `docker volume create tomeforge-mongodb-data`

4. **Backend connection refused:**
   - Solution: Wait for health check to pass, check .env MongoDB credentials

5. **mongo-express shows empty database:**
   - Solution: Check init script executed, verify MONGO_INITDB_DATABASE matches

### Performance Expectations

- Cold start (first `docker compose up`): 20-40 seconds (includes image pull)
- Warm start (subsequent startups): 5-15 seconds
- Health check passes: Within 10-15 seconds of container start
- Data volume size: Starts at ~50MB, grows with usage
- Resource usage: MongoDB ~200MB RAM, mongo-express ~50MB RAM
