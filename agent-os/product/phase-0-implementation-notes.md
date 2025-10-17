# Phase 0 Implementation Notes

This document provides implementation guidance, examples, and code snippets for Phase 0 tasks. Use these as starting points when implementing each task.

## Table of Contents
1. [CI/CD Pipeline](#cicd-pipeline)
2. [Migration System](#migration-system)
3. [Docker Compose Setup](#docker-compose-setup)
4. [Pre-commit Hooks](#pre-commit-hooks)
5. [Testing Infrastructure](#testing-infrastructure)

---

## CI/CD Pipeline

### GitHub Actions Workflow

**File:** `.github/workflows/ci.yml`

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    name: Test & Build
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm type-check

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build

      - name: Run tests
        run: pnpm test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: false

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Build application
        run: pnpm build

      - name: Run E2E tests
        run: pnpm test:e2e:ci
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  bundle-size:
    name: Bundle Size Check
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Analyze bundle size
        run: |
          cd apps/frontend
          pnpm exec vite-bundle-visualizer
```

### Package.json Scripts

Add these scripts to root `package.json`:

```json
{
  "scripts": {
    "type-check": "pnpm -r --parallel run type-check",
    "lint": "pnpm -r --parallel run lint",
    "test": "pnpm -r --parallel run test",
    "test:coverage": "pnpm -r --parallel run test:coverage",
    "test:e2e": "pnpm --filter frontend test:e2e",
    "test:e2e:ci": "pnpm --filter frontend test:e2e:ci"
  }
}
```

---

## Migration System

### Installation & Setup

```bash
# Install migrate-mongo
pnpm add -D migrate-mongo

# Initialize migrate-mongo
pnpm exec migrate-mongo init
```

### Configuration

**File:** `migrate-mongo-config.js` (root)

```javascript
const config = {
  mongodb: {
    url: process.env.MONGODB_URI ||
         `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE_NAME}`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
```

### Migration Template

**File:** `migrations/20251017000000-add-user-authentication.js`

```javascript
module.exports = {
  async up(db, client) {
    // Create users collection with indexes
    await db.createCollection('users');
    await db.collection('users').createIndex(
      { email: 1 },
      { unique: true, name: 'email_unique' }
    );
    await db.collection('users').createIndex(
      { username: 1 },
      { unique: true, name: 'username_unique' }
    );

    // Add ownerId field to existing systems
    await db.collection('systems').updateMany(
      { ownerId: { $exists: false } },
      {
        $set: {
          ownerId: null,
          schemaVersion: '2.0.0',
          updatedAt: new Date()
        }
      }
    );

    // Add ownerId field to existing characters
    await db.collection('characters').updateMany(
      { ownerId: { $exists: false } },
      {
        $set: {
          ownerId: null,
          schemaVersion: '2.0.0',
          updatedAt: new Date()
        }
      }
    );
  },

  async down(db, client) {
    // Drop users collection
    await db.collection('users').drop();

    // Remove ownerId from systems
    await db.collection('systems').updateMany(
      {},
      {
        $unset: { ownerId: '' },
        $set: {
          schemaVersion: '1.0.0',
          updatedAt: new Date()
        }
      }
    );

    // Remove ownerId from characters
    await db.collection('characters').updateMany(
      {},
      {
        $unset: { ownerId: '' },
        $set: {
          schemaVersion: '1.0.0',
          updatedAt: new Date()
        }
      }
    );
  }
};
```

### Package.json Scripts

```json
{
  "scripts": {
    "migrate:create": "migrate-mongo create",
    "migrate:up": "migrate-mongo up",
    "migrate:down": "migrate-mongo down",
    "migrate:status": "migrate-mongo status"
  }
}
```

### Usage

```bash
# Create new migration
pnpm migrate:create add-campaign-support

# Check migration status
pnpm migrate:status

# Run pending migrations
pnpm migrate:up

# Rollback last migration
pnpm migrate:down
```

---

## Docker Compose Setup

**File:** `docker-compose.yml` (root)

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: tomeforge-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGODB_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGODB_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGODB_DATABASE_NAME}
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - mongodb_config:/data/configdb
    networks:
      - tomeforge-network

  redis:
    image: redis:7-alpine
    container_name: tomeforge-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - tomeforge-network
    command: redis-server --appendonly yes

  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile.dev
    container_name: tomeforge-backend
    restart: unless-stopped
    environment:
      NODE_ENV: development
      PORT: 3000
      MONGODB_URI: mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@mongodb:27017/${MONGODB_DATABASE_NAME}?authSource=admin
      REDIS_URL: redis://redis:6379
    ports:
      - "3000:3000"
    volumes:
      - ./apps/backend:/app/apps/backend
      - ./packages:/app/packages
      - /app/node_modules
      - /app/apps/backend/node_modules
    depends_on:
      - mongodb
      - redis
    networks:
      - tomeforge-network
    command: pnpm --filter backend dev

  frontend:
    build:
      context: .
      dockerfile: apps/frontend/Dockerfile.dev
    container_name: tomeforge-frontend
    restart: unless-stopped
    environment:
      NODE_ENV: development
      VITE_API_URL: http://localhost:3000/api/v1
    ports:
      - "5173:5173"
    volumes:
      - ./apps/frontend:/app/apps/frontend
      - ./packages:/app/packages
      - /app/node_modules
      - /app/apps/frontend/node_modules
    depends_on:
      - backend
    networks:
      - tomeforge-network
    command: pnpm --filter frontend dev

volumes:
  mongodb_data:
  mongodb_config:
  redis_data:

networks:
  tomeforge-network:
    driver: bridge
```

### Development Dockerfiles

**File:** `apps/backend/Dockerfile.dev`

```dockerfile
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

CMD ["pnpm", "--filter", "backend", "dev"]
```

**File:** `apps/frontend/Dockerfile.dev`

```dockerfile
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

CMD ["pnpm", "--filter", "frontend", "dev"]
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild services
docker-compose up -d --build

# Run migrations in container
docker-compose exec backend pnpm migrate:up
```

---

## Pre-commit Hooks

### Installation

```bash
# Install husky
pnpm add -D husky

# Initialize husky
pnpm exec husky init
```

### Configuration

**File:** `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Type check
echo "⚡ Type checking..."
pnpm type-check || {
  echo "❌ Type check failed. Please fix type errors before committing."
  exit 1
}

# Lint
echo "🧹 Linting..."
pnpm lint || {
  echo "❌ Lint failed. Please fix linting errors before committing."
  exit 1
}

# Run tests
echo "🧪 Running tests..."
pnpm test || {
  echo "❌ Tests failed. Please fix failing tests before committing."
  exit 1
}

echo "✅ Pre-commit checks passed!"
```

### Package.json Configuration

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

---

## Testing Infrastructure

### Vitest Configuration

**File:** `packages/shared/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Playwright Configuration

**File:** `apps/frontend/playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'list',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: process.env.CI ? undefined : {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ci": "playwright test --reporter=html",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## Platform-Independent CI/CD Principles

### Why Platform-Independent?

- **Multi-cloud ready**: Not locked to AWS, GCP, or Azure
- **Portable**: Workflows can move between Git providers (GitHub, GitLab, Bitbucket)
- **Infrastructure as Code**: CI/CD configuration lives in repository
- **No console clicking**: Manage deployments through code, not UIs
- **Similar to Terraform**: Declarative infrastructure, reproducible deploys

### Adapting to Other Platforms

**GitLab CI** (`.gitlab-ci.yml`):
```yaml
stages:
  - test
  - build

test:
  image: node:18
  stage: test
  script:
    - npm install -g pnpm
    - pnpm install --frozen-lockfile
    - pnpm type-check
    - pnpm lint
    - pnpm test:coverage
```

**Bitbucket Pipelines** (`bitbucket-pipelines.yml`):
```yaml
pipelines:
  default:
    - step:
        name: Test & Build
        image: node:18
        caches:
          - node
        script:
          - npm install -g pnpm
          - pnpm install --frozen-lockfile
          - pnpm type-check
          - pnpm lint
          - pnpm test:coverage
          - pnpm build
```

---

## Implementation Checklist

### Phase 0 Tasks

**Documentation & Standards:**
- [ ] Task 1: Configure Swagger/OpenAPI
- [ ] Task 2: Set up TypeDoc
- [ ] Task 3: Create ADR template

**Testing Infrastructure:**
- [ ] Task 4: Configure Vitest (use config above)
- [ ] Task 5: Set up React Testing Library
- [ ] Task 6: Configure Playwright (use config above)
- [ ] Task 7: Integrate codecov.io

**CI/CD Pipeline:**
- [ ] Task 8: Create GitHub Actions workflow (use workflow above)
- [ ] Task 9: Configure pre-commit hooks (use husky config above)
- [ ] Task 10: Ensure consistent builds

**Schema Validation & Quality:**
- [ ] Task 11: Implement schema complexity linting
- [ ] Task 12: Add schema versioning
- [ ] Task 13: Configure strict TypeScript

**Development Environment:**
- [ ] Task 14: Create docker-compose.yml (use config above)
- [ ] Task 15: Document setup process
- [ ] Task 16: Create VS Code workspace config

**Database Infrastructure:**
- [ ] Task 17: Set up migrate-mongo (use config above)

---

**Last Updated:** 2025-10-17
**Document Version:** 1.0.0
