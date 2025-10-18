# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TomeForge is a pnpm monorepo for managing tabletop game systems. It consists of:
- **Backend** (`apps/backend`): Express API with MongoDB/Mongoose for game system data
- **Frontend** (`apps/frontend`): React + Vite application
- **Shared** (`packages/shared`): Mongoose models, TypeScript types, and utilities used by both apps

## Build and Development Commands

### Initial Setup
```bash
pnpm install                    # Install all dependencies
```

### Building
```bash
pnpm build                      # Build all packages (runs tsc in each workspace)
pnpm clean                      # Remove all dist directories
```

### Running Applications
```bash
# Run both frontend and backend concurrently
pnpm start

# Or run individually:
pnpm start-backend              # Start backend on port 3000 (with nodemon)
pnpm start-frontend             # Start frontend dev server (Vite)

# From within specific apps:
cd apps/backend && pnpm run dev
cd apps/frontend && pnpm run dev
```

### Documentation
```bash
pnpm build-docs                 # Sync docs from apps/*/docs to central docs/ folder
docsify serve docs              # Serve documentation locally
```

## Docker Development Environment

TomeForge uses Docker Compose to provide consistent local development infrastructure. All database and caching services run in containers, while the application code runs on the host for fast iteration with hot-reloading.

### Prerequisites

- **Docker Desktop** (macOS/Windows) or **Docker Engine** (Linux)
- Minimum version: Docker 20.10+ with Compose V2
- Installation: https://docs.docker.com/get-docker/

### Quick Start

#### First-Time Setup (4 commands)
```bash
pnpm install                          # Install dependencies
cp .env.docker.example .env.docker    # Create Docker environment config
docker compose up -d                  # Start infrastructure services
pnpm build                            # Build shared package
```

Then configure your backend `.env` file (see Backend Configuration section below) and start the applications:
```bash
pnpm start                            # Start frontend and backend
```

#### Daily Development (2 commands)
```bash
docker compose up -d                  # Start services if not running
pnpm start                            # Start applications
```

#### Stopping Services
```bash
docker compose down                   # Stop all services
docker compose down -v                # Stop and remove volumes (full reset)
```

### Docker Services Overview

#### MongoDB (Primary Database)
- **Image**: mongo:7.0
- **Container**: tomeforge-mongodb
- **Host Access**: localhost:27017 (127.0.0.1 only for security)
- **Docker Network**: mongodb:27017
- **Data**: Persistent via named volume `tomeforge-mongodb-data`
- **Initialization**: Automatic user creation via `/docker/mongo-init/init-user.js`

#### mongo-express (Database Admin UI)
- **Image**: mongo-express:latest
- **Container**: tomeforge-mongo-express
- **Access**: http://localhost:8081
- **Authentication**: Basic auth (credentials from `.env.docker`)
- **Features**: Database inspection, collection browsing, document editing

#### Redis (Future - Currently Commented)
- **Image**: redis:7-alpine
- **Purpose**: Caching, session storage, WebSocket scaling
- **Status**: Stubbed out in docker-compose.yml
- **Activation**: Uncomment service definition when needed

### Port Mapping Strategy (Dual Connectivity)

The Docker setup supports both current host-based apps and future containerized apps:

**Host-Based Applications (Current):**
- Backend/Frontend run on host machine (not containerized)
- Connect to MongoDB via `localhost:27017`
- Connect to Redis via `localhost:6379` (when enabled)
- MongoDB GUI tools (Compass, Studio 3T) use `localhost:27017`

**Future Containerized Applications:**
- Apps will run inside Docker containers
- Connect to MongoDB via Docker network using `mongodb:27017`
- Connect to Redis via `redis:6379`
- Port binding to localhost ensures both patterns work

### Backend Configuration

Create a `.env` file in `apps/backend/.env` with MongoDB connection details:

**Option 1: Single Connection String (Recommended)**
```
MONGODB_URI=mongodb://tomeforge_app:apppassword123@localhost:27017/tomeforge?authSource=tomeforge
```

**Option 2: Individual Variables**
```
MONGODB_USERNAME=tomeforge_app
MONGODB_PASSWORD=apppassword123
MONGODB_CLUSTER=localhost:27017
MONGODB_DATABASE_NAME=tomeforge
```

**Critical - authSource Parameter:**
- When using Option 1, **you must include `?authSource=tomeforge`** in the connection URI
- When using Option 2, the backend code automatically adds `authSource=${MONGODB_DATABASE_NAME}` to the connection string
- This parameter tells MongoDB which database contains the user credentials
- Without it, MongoDB defaults to the `admin` database and authentication will fail

**Important**: Credentials must match the application user values in `.env.docker`:
- `MONGODB_APP_USERNAME=tomeforge_app`
- `MONGODB_APP_PASSWORD=apppassword123`

### Using mongo-express

1. Ensure Docker services are running: `docker compose up -d`
2. Open browser to http://localhost:8081
3. Login with credentials from `.env.docker`:
   - Username: `admin` (default from ME_CONFIG_BASICAUTH_USERNAME)
   - Password: `express123` (default from ME_CONFIG_BASICAUTH_PASSWORD)
4. Browse databases, collections, and documents
5. Execute queries and modify data

**Security Note**: mongo-express is protected with basic authentication and only accessible via localhost.

### Volume Management

#### Data Persistence
- MongoDB data persists in the `tomeforge-mongodb-data` named volume
- Data survives container restarts: `docker compose restart`
- Data survives container deletion: `docker compose down` (without -v flag)
- Data survives system reboots (if Docker is configured to auto-start)

#### Resetting Data
```bash
# Stop containers and remove volumes (full reset)
docker compose down -v

# Start fresh (initialization script will re-run)
docker compose up -d
```

#### Volume Inspection
```bash
# List all volumes
docker volume ls

# Inspect volume details
docker volume inspect tomeforge-mongodb-data

# View disk usage
docker system df -v
```

### Troubleshooting Common Issues

#### Port 27017 already in use
**Problem**: Local MongoDB installation conflicts with Docker container

**Solution**:
```bash
# Option 1: Stop local MongoDB
sudo systemctl stop mongodb  # Linux
brew services stop mongodb   # macOS

# Option 2: Change Docker port mapping in docker-compose.yml
ports:
  - "127.0.0.1:27018:27017"  # Use port 27018 instead

# Then update backend .env to use localhost:27018
```

#### Cannot connect to Docker daemon
**Problem**: Docker Desktop is not running

**Solution**:
- Ensure Docker Desktop is started (macOS/Windows)
- Check Docker service status: `sudo systemctl status docker` (Linux)
- Start Docker: `sudo systemctl start docker` (Linux)

#### Backend connection refused
**Problem**: Backend cannot connect to MongoDB

**Solution**:
1. **Verify `.env` file location**: Ensure you have `apps/backend/.env` (NOT in repository root)
2. **Check authSource parameter**: Connection URI must include `?authSource=tomeforge`
   - If using `MONGODB_URI`: Should be `mongodb://tomeforge_app:apppassword123@localhost:27017/tomeforge?authSource=tomeforge`
   - If using individual variables: Ensure `MONGODB_DATABASE_NAME=tomeforge` is set (authSource added automatically)
3. Wait for health check to pass: `docker compose ps` (mongodb should show "healthy")
4. Verify MongoDB is running: `docker compose logs mongodb`
5. Check credentials match between `apps/backend/.env` and `.env.docker`
6. Test direct MongoDB connection: `docker compose exec mongodb mongosh -u tomeforge_app -p apppassword123 --authenticationDatabase tomeforge tomeforge`

#### mongo-express shows empty database
**Problem**: Initialization script did not execute or failed

**Solution**:
1. Check init script execution: `docker compose logs mongodb | grep "TomeForge MongoDB Initialization"`
2. Verify environment variables: `docker compose config`
3. Reset and restart: `docker compose down -v && docker compose up -d`
4. Check user was created: `docker compose exec mongodb mongosh -u admin -p devpassword123 --eval "use tomeforge; db.getUsers()"`

#### Services start slowly or time out
**Problem**: Resource constraints or network issues

**Solution**:
- Increase Docker resource limits in Docker Desktop settings
- Wait for health checks: `docker compose ps` should show "healthy"
- Check logs: `docker compose logs`
- Restart Docker Desktop

### Enabling Redis (Future)

When ready to use Redis:

1. Edit `docker-compose.yml` and uncomment the entire `redis` service definition
2. Start Redis: `docker compose up -d redis`
3. Verify Redis is running: `docker compose ps redis`
4. Test connection: `docker compose exec redis redis-cli ping` (should return "PONG")
5. Update `apps/backend/.env` with:
   ```
   REDIS_URI=redis://localhost:6379
   ```

## Architecture

### Monorepo Structure
- Uses pnpm workspaces defined in `pnpm-workspace.yaml`
- Shared package referenced as `@tomeforge/shared` via workspace protocol
- TypeScript path mappings in root `tsconfig.json` point to compiled `dist/*` outputs

### Backend Architecture (apps/backend)
Follows a layered architecture:
- **routes/** - Express route handlers (e.g., `system.ts` for `/api/systems`)
- **services/** - Business logic layer (e.g., `system.ts`)
- **data-access/** - Database operations using Mongoose models
- **utils/db/** - Database connection management with connection caching

The backend uses:
- MongoDB connection via environment variables (see `.env` requirements)
- Mongoose for ODM
- Express for REST API
- nodemon for hot-reloading during development

### Frontend Architecture (apps/frontend)
- React 18 with TypeScript
- Vite for bundling and dev server
- Imports shared types from `@tomeforge/shared`

### Shared Package (packages/shared)
Contains Mongoose schemas and models:
- **models/system.ts** - `SystemModel` with configurations (stats, skills) and rules (dice rolling)
- **models/character.ts** - `CharacterModel` with character data and system configuration
- Exports TypeScript types inferred from schemas using `InferSchemaType`

## Environment Configuration

### Docker Infrastructure (.env.docker)
Docker services use `.env.docker` for configuration (separate from application config):
```bash
# Copy example file
cp .env.docker.example .env.docker

# Customize credentials if desired (or use defaults for local dev)
```

**Security**: `.env.docker` is gitignored and should NEVER be committed.

### Backend Application (.env)
Backend requires `.env` file in `apps/backend/.env` with MongoDB connection details:

**Option 1: Individual Variables (authSource automatically added by backend code)**
```
MONGODB_USERNAME=tomeforge_app
MONGODB_PASSWORD=apppassword123
MONGODB_CLUSTER=localhost:27017
MONGODB_DATABASE_NAME=tomeforge
```

**Option 2: Single Connection String (must include authSource parameter)**
```
MONGODB_URI=mongodb://tomeforge_app:apppassword123@localhost:27017/tomeforge?authSource=tomeforge
```

**Important**:
- Credentials must match `.env.docker` application user settings
- The `authSource` parameter is **critical** - without it, MongoDB authentication will fail
- Option 1 is recommended as the backend code automatically adds the authSource parameter

## Development Workflow

1. **Build order**: Always build `packages/shared` before apps when making type changes
   ```bash
   cd packages/shared && pnpm build
   pnpm build  # or rebuild everything
   ```

2. **Adding dependencies**: Use pnpm's workspace protocol for internal packages
   ```json
   "@tomeforge/shared": "workspace:^"
   ```

3. **Backend changes**: nodemon watches `src/**/*.ts` files and auto-restarts
4. **Frontend changes**: Vite provides HMR automatically

## Data Models

### System
Game systems have:
- `configuration`: Defines stats and skills with dataType (number/string) and ordering
- `rules`: Dice rolling mechanics (type, dice, quantity, modifier)

### Character
Characters reference a game system and contain:
- `data`: CharacterDataObject with primary/secondary values
- `systemConfiguration`: Embedded system schema for character-specific rules

## Product Documentation

Comprehensive product and development documentation is available in `agent-os/product/`:

### Core Product Docs
- **`mission.md`** - Product vision, user personas, problems solved, differentiators, and success criteria
- **`roadmap.md`** - Phased development plan with 51 prioritized features across 7 phases (Phase 0-6)
- **`tech-stack.md`** - Technology choices, architecture patterns, testing strategy, and technical principles

### Development Standards
- **`development-practices.md`** - Development workflow, code standards, testing requirements, schema design principles, code review process, and release procedures
- **`technical-constraints.md`** - Schema complexity limits, performance budgets, security boundaries, scalability thresholds, and enforcement policies

### Key Principles from Documentation

**System-Agnostic Design:**
- Never hardcode game mechanics
- Use data-driven configurations stored in database
- Support any game from D&D to board games without code changes

**Schema Constraints:**
- Maximum nesting depth: 3 levels
- Document size soft limit: 1MB (hard limit 16MB)
- Embedded arrays: < 100 items recommended
- Always include schema versioning

**Testing Requirements:**
- Shared Package: 80% coverage minimum
- Backend Services: 70% coverage minimum
- Frontend Components: 60% coverage minimum
- Critical Paths: 100% coverage (auth, validation, character creation)

**Type Safety:**
- TypeScript strict mode everywhere
- Shared types via `@tomeforge/shared`
- Runtime validation matches compile-time types

**Development Workflow:**
- Follow conventional commits format
- Pre-commit hooks run tests and type checking
- All PRs require CI/CD pipeline to pass
- Minimum 1 approval for merge

## Current Phase: Phase 0 (Developer Infrastructure)

Before expanding features, complete Phase 0 tasks (see `agent-os/product/roadmap.md`):
- [ ] Documentation tooling (Swagger/OpenAPI, TypeDoc)
- [ ] Testing infrastructure (Vitest, Playwright, coverage reporting)
- [ ] CI/CD pipeline enhancement
- [ ] Schema validation and complexity checks
- [x] Docker Compose for local development

Phase 0 provides the foundation for sustainable sporadic development and future collaboration.
