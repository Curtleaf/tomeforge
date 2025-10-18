# Spec Requirements: Docker Compose Setup

## Initial Description
Initialize a new spec for Task 14 from Phase 0 of the roadmap located at agent-os/product/roadmap.md.

The task is: "Docker Compose Setup — Create comprehensive docker-compose.yml for local development with MongoDB, Redis (future)"

This is from Phase 0: Developer Infrastructure (CRITICAL FOUNDATION), specifically the "Development Environment" section.

The task is sized as `S` (Small) and is task #14 in the roadmap.

**Context:**
This task is needed to provide local development environment setup for TomeForge. The user just encountered an issue starting the backend because MongoDB wasn't running locally. This Docker Compose setup will:
- Run MongoDB locally for development
- Prepare for future Redis integration
- Make it easy to start/stop the entire development stack
- Follow the roadmap goal of "ensure < 5 commands to run locally"

## Requirements Discussion

### First Round Questions

**Q1:** I'm assuming we should use the official MongoDB Docker image (version 7.0 or latest stable). Should we pin to a specific version for consistency?
**Answer:** Yes, use official MongoDB image pinned to version 7.0 for consistency.

**Q2:** For MongoDB authentication, I'm thinking we should set up a default development user through environment variables (MONGO_INITDB_ROOT_USERNAME/PASSWORD). Should these be in a .env file or .env.docker file, and should we create a .env.example?
**Answer:** Use .env.docker.example with sensible defaults that developers can copy to .env.docker. This keeps Docker config separate from app config.

**Q3:** Since the backend currently expects MongoDB connection via environment variables, should we expose MongoDB on the standard port 27017 to localhost, or use a different port to avoid conflicts?
**Answer:** Port 27017 needs to be both internal (Docker network) AND exposed to host (127.0.0.1:27017) because apps running on host need to connect via localhost:27017. Future containerized apps will connect via Docker network (mongodb:27017). This also allows developers to use MongoDB Compass and other GUI tools.

**Q4:** For Redis preparation, should we include it as a commented-out service in docker-compose.yml with a TODO note, or completely omit it until needed in a future task?
**Answer:** Include Redis as a commented-out service with a TODO note. This documents the future intent and makes it easy to enable when needed.

**Q5:** Should we include any MongoDB management tools in the compose file (like mongo-express or mongoku) for easier local development debugging?
**Answer:** Yes, include mongo-express for web-based MongoDB management. It's lightweight and useful for development.

**Q6:** I'm assuming we should use Docker named volumes for MongoDB data persistence (rather than bind mounts) to follow Docker best practices. Should the volume be named tomeforge-mongodb-data?
**Answer:** Yes, use named volumes (tomeforge-mongodb-data) following Docker best practices.

**Q7:** Should we include health checks for the MongoDB container to ensure it's ready before other services try to connect?
**Answer:** Yes, include a simple health check for MongoDB to ensure it's ready.

**Q8:** For the local development workflow, I'm thinking the commands should be:
   1. `pnpm install` (install dependencies)
   2. `docker compose up -d` (start MongoDB/services)
   3. `pnpm build` (build shared package)
   4. `pnpm start` (run frontend + backend)

   Is this the desired workflow, or should we integrate Docker startup into the pnpm scripts?
**Answer:** Keep the workflow as 4 separate commands. Don't integrate Docker into pnpm scripts - maintain separation of concerns.

**Q9:** Regarding scope: Should this spec containerize the frontend and backend applications as well, or should this spec focus solely on the infrastructure services (MongoDB, Redis stub) while keeping the apps running on the host as they do now?
**Answer:** OPTION B - Start with just MongoDB in Docker, containerize apps later. This spec covers Docker Compose with MongoDB, mongo-express, and Redis stub. A future spec will handle containerizing the backend and frontend applications.

**Q10:** Are there any specific environment variables or initialization scripts we should include for MongoDB (like creating default databases or users beyond the root user)?
**Answer:** Include basic initialization scripts for setting up a default database user. Keep it simple - just enough for the backend to connect.

**Q11:** Should we add any documentation about this Docker setup to the existing CLAUDE.md or create separate Docker documentation?
**Answer:** Update CLAUDE.md with a new "Docker Development Environment" section that explains the setup and workflow.

**Q12:** Is there anything you explicitly want to exclude from this initial Docker Compose setup?
**Answer:** Exclude: containerizing the frontend and backend apps (save for future spec), production configurations, orchestration tools, backup/restore scripts, monitoring tools.

### Existing Code to Reference

**Similar Features Identified:**
No similar existing features identified for reference. This is the first Docker infrastructure for the project.

**Relevant Existing Files:**
- Root `.env` file structure (for MongoDB connection pattern)
- `CLAUDE.md` (to be updated with Docker setup instructions)
- `pnpm-workspace.yaml` (to understand monorepo structure)
- Backend database connection in `apps/backend/src/utils/db/` (to understand connection pattern)

### Follow-up Questions

**Follow-up 1:** For the port 27017 exposure - should it be exposed to all interfaces (0.0.0.0:27017) or just localhost (127.0.0.1:27017) for security?
**Answer:** Bind to 127.0.0.1:27017 for security. Only localhost should access MongoDB, not external interfaces.

**Follow-up 2:** Should the Docker Compose file include a network definition, or rely on the default Docker bridge network?
**Answer:** Create a custom network named "tomeforge-network" for better organization and future-proofing when apps are containerized.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
N/A - Infrastructure configuration task does not require visual assets.

## Requirements Summary

### Functional Requirements

**Core Infrastructure:**
- Docker Compose file (`docker-compose.yml`) with MongoDB 7.0 official image
- Named Docker network: `tomeforge-network` for service communication
- Named volume: `tomeforge-mongodb-data` for data persistence
- MongoDB exposed to host at 127.0.0.1:27017 for host-based apps and GUI tools
- Internal Docker network access via `mongodb:27017` for future containerized apps
- Health check for MongoDB container to verify readiness
- mongo-express for web-based MongoDB management UI

**Configuration Management:**
- `.env.docker.example` file with sensible defaults:
  - MongoDB root username/password
  - MongoDB database name
  - mongo-express credentials
  - Port configurations
- Clear instructions for copying to `.env.docker` for actual use
- Separation from app `.env` file

**MongoDB Initialization:**
- Initialization script to create default database user
- Script should set up user with read/write permissions
- Use credentials from environment variables
- Keep initialization simple and focused on backend connection needs

**Redis Preparation:**
- Commented-out Redis service in docker-compose.yml
- Include TODO note explaining future integration
- Basic configuration ready to uncomment when needed

**Documentation:**
- Update `CLAUDE.md` with new "Docker Development Environment" section
- Document the 4-command workflow:
  1. `pnpm install`
  2. `docker compose up -d`
  3. `pnpm build`
  4. `pnpm start`
- Explain port mapping rationale (dual connectivity pattern)
- Provide examples for connecting from host apps
- Document how to use mongo-express
- Explain volume management and data persistence

### Scope Boundaries

**In Scope:**
- Docker Compose configuration for infrastructure services only
- MongoDB 7.0 container with authentication
- mongo-express management UI
- Named volumes for data persistence
- Custom Docker network
- Health checks for MongoDB
- Environment variable configuration via .env.docker
- Basic MongoDB initialization scripts
- Redis stub (commented out) for future use
- Documentation updates to CLAUDE.md
- Dual connectivity: host apps via localhost:27017 + future container apps via mongodb:27017

**Out of Scope (Deferred to Future Specs):**
- Containerizing frontend application
- Containerizing backend application
- Production Docker configurations
- Docker orchestration tools (Kubernetes, Swarm)
- Backup and restore scripts
- Monitoring and logging tools (Prometheus, Grafana)
- CI/CD Docker image building
- Multi-environment configurations (staging, production)
- Performance tuning and optimization
- Security hardening beyond basic practices

### Technical Considerations

**Architecture Philosophy:**
- Containerized-first design: Default to running services in containers
- Infrastructure services (databases, cache) run in Docker by default
- Applications currently run on host, will be containerized in future spec
- External database connections available as override option

**Port Mapping Strategy:**
- MongoDB port 27017 exposed to host (127.0.0.1:27017) for:
  - Host-based backend/frontend apps during current development
  - Developer GUI tools (MongoDB Compass, Studio 3T, etc.)
  - Easy migration path when apps are containerized
- Future containerized apps will use internal Docker network (mongodb:27017)
- This dual approach provides flexibility during transition period

**Network Design:**
- Custom bridge network (`tomeforge-network`) for:
  - Better service isolation
  - Predictable DNS resolution
  - Future-proofing for app containerization
  - Easier debugging and inspection

**Data Persistence:**
- Named volumes preferred over bind mounts for:
  - Cross-platform compatibility (Windows, macOS, Linux)
  - Better performance on macOS and Windows
  - Docker-managed lifecycle
  - Cleaner backup/restore workflow

**Environment Variable Separation:**
- `.env.docker` for Docker Compose specific configuration
- Root `.env` remains for application configuration
- Prevents confusion between app config and infrastructure config
- Allows different values for containerized vs host-based services

**Connection Pattern:**
- Backend connects to MongoDB using existing environment variables
- Current: MONGODB_URI or constructed from MONGODB_USERNAME, MONGODB_PASSWORD, etc.
- For host-based apps: Use localhost:27017 in connection string
- For future containerized apps: Use mongodb:27017 in connection string
- No changes required to backend connection logic

**Phased Implementation:**
- **Phase 1 (This Spec):** Infrastructure services in Docker
  - MongoDB + mongo-express
  - Redis stub for future
  - Apps run on host
  - Developers use: `docker compose up -d && pnpm start`
- **Phase 2 (Future Spec):** Containerize applications
  - Backend Dockerfile and service definition
  - Frontend Dockerfile and service definition
  - Development vs production configurations
  - Hot-reloading support for development
  - Developers use: `docker compose up -d` (all services)

**Development Workflow:**
- Maintains current developer experience
- 4 simple commands to get started
- Docker runs in background (`-d` flag)
- Standard pnpm commands remain unchanged
- Aligns with roadmap goal: "< 5 commands to run locally"

**Security Considerations:**
- MongoDB only accessible via localhost (127.0.0.1), not all interfaces
- Default credentials in .env.docker.example are for development only
- Clear documentation warning about production security requirements
- mongo-express protected with basic authentication

**Alignment with Existing Standards:**
- Follows monorepo structure (pnpm workspaces)
- Maintains TypeScript build process
- No changes to existing backend/frontend code
- Preserves nodemon and Vite hot-reloading
- Consistent with "Developer Infrastructure" phase goals

### Reusability Opportunities

**No Existing Docker Infrastructure:**
- This is the first Docker implementation for TomeForge
- Establishes patterns for future containerization
- Creates foundation for Phase 0 completion

**Patterns to Establish:**
- Docker Compose structure for multi-service setup
- Environment variable management pattern
- Volume and network naming conventions
- Health check implementation patterns
- Documentation structure for Docker features

**Future Reusability:**
- Network and volume patterns will be reused when containerizing apps
- Environment variable pattern serves as template for app containers
- Initialization script pattern applicable to future database migrations
- mongo-express pattern applicable to other admin/debug tools

### Success Criteria

**Functional Success:**
- Developer can run `docker compose up -d` to start MongoDB
- Backend connects successfully to containerized MongoDB via localhost:27017
- mongo-express accessible and functional for database inspection
- Data persists across container restarts
- MongoDB health check passes before accepting connections
- All 4 workflow commands execute without errors

**Documentation Success:**
- CLAUDE.md clearly explains Docker setup and workflow
- .env.docker.example provides all necessary configuration examples
- Port mapping strategy is clearly documented
- Future containerization path is explained

**Developer Experience Success:**
- Setup takes < 5 minutes for new developers
- Workflow remains simple (4 commands)
- No breaking changes to existing development process
- Clear error messages if configuration is incorrect
- Easy to start/stop/reset development environment

**Foundation Success:**
- Provides base for future Redis integration
- Establishes patterns for full app containerization
- Aligns with Phase 0 "Developer Infrastructure" goals
- Reduces "works on my machine" issues related to MongoDB
