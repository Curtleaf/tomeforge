# TomeForge Development Practices

This document outlines the development practices, contribution guidelines, and quality standards for the TomeForge project. These practices support our sporadic development cycle and enable effective collaboration.

## Table of Contents
1. [Core Principles](#core-principles)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Code Standards](#code-standards)
5. [Schema Design Principles](#schema-design-principles)
6. [Testing Requirements](#testing-requirements)
7. [Documentation Standards](#documentation-standards)
8. [Code Review Process](#code-review-process)
9. [Release Process](#release-process)

---

## Core Principles

### 1. **Documentation First**
- Document decisions before implementing them
- Keep documentation in sync with code changes
- Use inline comments for complex logic, external docs for architecture

### 2. **Type Safety Everywhere**
- Leverage TypeScript strict mode
- Share types between frontend and backend via `@tomeforge/shared`
- Validate data at API boundaries

### 3. **Progressive Enhancement**
- Features should work independently
- Integration between features should enhance, not require
- Graceful degradation for missing dependencies

### 4. **Test Before Merge**
- All new features require tests
- Bug fixes require regression tests
- CI must pass before merge

### 5. **System-Agnostic Design**
- Never hardcode game mechanics
- Use data-driven configurations
- Keep game rules in database, not code

---

## Getting Started

### Initial Setup (5 Minutes)

```bash
# Clone repository
git clone https://github.com/yourusername/tomeforge.git
cd tomeforge

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB credentials

# Build all packages
pnpm build

# Start development servers
pnpm start
```

**Expected Result:**
- Frontend running at `http://localhost:5173`
- Backend running at `http://localhost:3000`
- No TypeScript errors

### Development Environment

**Required:**
- Node.js 18+ (LTS recommended)
- pnpm 8+
- MongoDB Atlas account or local MongoDB instance
- Git

**Recommended:**
- VS Code with extensions:
  - ESLint
  - Prettier
  - TypeScript Vue Plugin (Volar)
  - MongoDB for VS Code
  - GitLens

---

## Development Workflow

### Branch Strategy

```
main (protected)
  ├─ feature/user-authentication
  ├─ feature/dice-roller
  ├─ fix/character-sheet-validation
  └─ docs/api-documentation
```

**Branch Naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/improvements

### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat(character): add inventory management system

Implemented basic inventory system with item CRUD operations,
weight tracking, and capacity limits.

Closes #123
```

```
fix(dice): correct modifier calculation in complex rolls

Fixed bug where negative modifiers were not applied correctly
in rolls with multiple dice types.

Fixes #456
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Develop & Test Locally**
   - Write code
   - Add tests
   - Run test suite: `pnpm test`
   - Run type check: `pnpm type-check`
   - Run linter: `pnpm lint`

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

4. **Push & Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Create PR on GitHub
   - Fill out PR template
   - Link related issues

5. **Code Review**
   - Address review comments
   - Update PR with fixes
   - Maintain conversation in PR

6. **Merge**
   - Squash commits if needed
   - Delete feature branch after merge

---

## Code Standards

### TypeScript

**Strict Mode Enabled:**
```typescript
// tsconfig.json enforces:
"strict": true,
"noImplicitAny": true,
"strictNullChecks": true,
"strictFunctionTypes": true
```

**Type Definitions:**
```typescript
// ✅ Good: Explicit types for function parameters and returns
export function calculateModifier(stat: number): number {
  return Math.floor((stat - 10) / 2);
}

// ❌ Bad: Implicit any
export function calculateModifier(stat) {
  return Math.floor((stat - 10) / 2);
}
```

**Shared Types:**
```typescript
// Import from shared package
import { SystemConfiguration, CharacterData } from '@tomeforge/shared';

// Define new types in appropriate package
// Backend-only: apps/backend/src/types/
// Frontend-only: apps/frontend/src/types/
// Shared: packages/shared/src/types/
```

### File Organization

```
apps/backend/src/
├── routes/           # Express route handlers
├── services/         # Business logic layer
├── data-access/      # Database operations
├── middleware/       # Express middleware
├── utils/            # Utility functions
└── types/            # Backend-specific types

apps/frontend/src/
├── components/       # React components
├── hooks/            # Custom React hooks
├── services/         # API client services
├── utils/            # Utility functions
├── types/            # Frontend-specific types
└── pages/            # Route pages

packages/shared/
├── models/           # Mongoose models
├── types/            # Shared TypeScript types
├── utils/            # Shared utilities
└── validators/       # Shared validation logic
```

### Naming Conventions

- **Files:** kebab-case (`character-sheet.tsx`, `dice-roller.ts`)
- **Components:** PascalCase (`CharacterSheet`, `DiceRoller`)
- **Functions:** camelCase (`calculateModifier`, `rollDice`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_STAT_VALUE`, `DEFAULT_DICE_TYPE`)
- **Interfaces/Types:** PascalCase (`SystemConfiguration`, `CharacterData`)

---

## API Design Standards

### API Versioning

**Use `/v1/` prefix from the beginning:**
```
/api/v1/systems
/api/v1/characters
/api/v1/campaigns
```

**Versioning Strategy:**
- **URL versioning** (not headers) for simplicity and caching
- Start with v1, increment on breaking changes
- Support current version + 1 previous version minimum
- Provide 6-month deprecation notice before sunset

**Version Lifecycle:**
```
v1 → v2 released → v1 deprecated (6 months) → v1 sunset
```

### JSON:API Specification

**Follow JSON:API v1.1 specification** for consistent, standardized API responses.

**Success Response Format:**
```typescript
// Single Resource
{
  "data": {
    "type": "systems",
    "id": "507f1f77bcf86cd799439011",
    "attributes": {
      "name": "Dungeons & Dragons 5e",
      "description": "Fifth edition D&D system",
      "createdAt": "2025-10-17T14:30:00.000Z",
      "updatedAt": "2025-10-17T14:30:00.000Z"
    },
    "relationships": {
      "owner": {
        "data": { "type": "users", "id": "507f1f77bcf86cd799439012" }
      },
      "characters": {
        "data": [
          { "type": "characters", "id": "507f1f77bcf86cd799439013" },
          { "type": "characters", "id": "507f1f77bcf86cd799439014" }
        ]
      }
    }
  },
  "included": [
    {
      "type": "users",
      "id": "507f1f77bcf86cd799439012",
      "attributes": {
        "username": "gamemaster42",
        "email": "gm@example.com"
      }
    }
  ]
}
```

```typescript
// Collection Response
{
  "data": [
    {
      "type": "systems",
      "id": "507f1f77bcf86cd799439011",
      "attributes": { /* ... */ }
    },
    {
      "type": "systems",
      "id": "507f1f77bcf86cd799439015",
      "attributes": { /* ... */ }
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "perPage": 20
  },
  "links": {
    "self": "/api/v1/systems?page=1",
    "next": "/api/v1/systems?page=2",
    "last": "/api/v1/systems?page=3"
  }
}
```

**Error Response Format:**
```typescript
{
  "errors": [
    {
      "status": "400",
      "code": "VALIDATION_ERROR",
      "title": "Validation Failed",
      "detail": "Name must be between 1 and 100 characters",
      "source": {
        "pointer": "/data/attributes/name"
      }
    }
  ]
}
```

### JSON:API Resource Structure

**Resource Object:**
- `type`: Resource type (plural, kebab-case: "game-systems", "characters")
- `id`: Unique identifier (MongoDB ObjectId as string)
- `attributes`: Resource data (no `id`, `type`, or foreign keys)
- `relationships`: Related resources with `data` containing type/id pairs
- `links`: URLs for the resource (`self`)
- `meta`: Non-standard metadata

**Example Model Transformation:**
```typescript
// MongoDB Document
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "D&D 5e",
  ownerId: ObjectId("507f1f77bcf86cd799439012"),
  configuration: { /* ... */ }
}

// JSON:API Response
{
  "type": "systems",
  "id": "507f1f77bcf86cd799439011",
  "attributes": {
    "name": "D&D 5e",
    "configuration": { /* ... */ }
  },
  "relationships": {
    "owner": {
      "data": { "type": "users", "id": "507f1f77bcf86cd799439012" }
    }
  }
}
```

### HTTP Methods & Status Codes

**RESTful Conventions:**
```
GET    /api/v1/systems           → 200 OK (list)
GET    /api/v1/systems/:id       → 200 OK (single)
POST   /api/v1/systems           → 201 Created
PATCH  /api/v1/systems/:id       → 200 OK
DELETE /api/v1/systems/:id       → 204 No Content
```

**Status Codes:**
- `200 OK` - Successful GET, PATCH requests
- `201 Created` - Successful POST request (include `Location` header)
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Validation error, malformed request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource conflict (duplicate, version mismatch)
- `422 Unprocessable Entity` - Semantic validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error (log and monitor)

### Pagination

**Query Parameters:**
```
GET /api/v1/systems?page[number]=2&page[size]=20
```

**Response:**
```json
{
  "data": [ /* resources */ ],
  "meta": {
    "total": 100,
    "page": 2,
    "perPage": 20,
    "totalPages": 5
  },
  "links": {
    "first": "/api/v1/systems?page[number]=1&page[size]=20",
    "prev": "/api/v1/systems?page[number]=1&page[size]=20",
    "self": "/api/v1/systems?page[number]=2&page[size]=20",
    "next": "/api/v1/systems?page[number]=3&page[size]=20",
    "last": "/api/v1/systems?page[number]=5&page[size]=20"
  }
}
```

### Filtering & Sorting

**Filtering:**
```
GET /api/v1/systems?filter[owner]=507f1f77bcf86cd799439012
GET /api/v1/characters?filter[system]=dnd5e&filter[level][gte]=5
```

**Sorting:**
```
GET /api/v1/systems?sort=-createdAt,name
```
(Prefix with `-` for descending order)

**Sparse Fieldsets:**
```
GET /api/v1/systems?fields[systems]=name,description
```

### Including Related Resources

**Query Parameter:**
```
GET /api/v1/systems/507f1f77bcf86cd799439011?include=owner,characters
```

**Response includes related resources in `included` array (see Success Response Format above)**

### Backward Compatibility

**Default Policy:**
- Maintain 1-version backward compatibility for public APIs
- Use deprecation warnings before removal
- Document breaking changes in CHANGELOG and migration guides

**Deprecation Process:**
1. Add deprecation warning to response headers:
   ```
   Deprecation: true
   Sunset: Sat, 01 Apr 2026 00:00:00 GMT
   Link: </api/v2/systems>; rel="successor-version"
   ```
2. Update API documentation with migration guide
3. Announce deprecation 6 months before sunset
4. Remove deprecated endpoint after sunset date

**Non-Breaking Changes (safe to deploy):**
- Adding new endpoints
- Adding new optional request parameters
- Adding new fields to responses
- Adding new resource types
- Making required fields optional
- Relaxing validation rules

**Breaking Changes (require new version):**
- Removing endpoints
- Removing request parameters or response fields
- Changing field types or semantics
- Adding required request parameters
- Tightening validation rules
- Changing error response formats

### API Implementation Checklist

When creating a new API endpoint:
- [ ] Use `/api/v1/` prefix
- [ ] Follow JSON:API resource structure
- [ ] Implement proper HTTP status codes
- [ ] Add pagination for list endpoints (default: 20 items)
- [ ] Support filtering and sorting
- [ ] Include relationship data when appropriate
- [ ] Validate input at API boundary
- [ ] Add OpenAPI/Swagger documentation
- [ ] Write integration tests
- [ ] Document in API reference

---

## Schema Design Principles

### Complexity Limits

**Maximum Nesting Depth: 3 Levels**
```typescript
// ✅ Good: 3 levels deep
interface System {
  configuration: {
    stats: {
      strength: StatDefinition;  // Level 3
    }
  }
}

// ❌ Bad: 4+ levels deep
interface System {
  configuration: {
    categories: {
      stats: {
        physical: {
          strength: StatDefinition;  // Level 5
        }
      }
    }
  }
}
```

**Document Size Limits:**
- Single document: 16MB (MongoDB limit)
- Recommended maximum: 1MB
- Use references for large related data

**Array Size Limits:**
- Embedded arrays: < 100 items recommended
- For larger collections: Use separate collections with references

### Schema Validation

**Always Define Validation:**
```typescript
const StatDefinitionSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  dataType: {
    type: String,
    enum: ['number', 'string', 'boolean'],
    required: true
  },
  defaultValue: {
    type: Schema.Types.Mixed,
    validate: {
      validator: function(value: any) {
        // Validate based on dataType
        return validateDataType(value, this.dataType);
      }
    }
  }
});
```

### Schema Versioning

**Include Schema Version:**
```typescript
const SystemSchema = new Schema({
  schemaVersion: {
    type: String,
    default: '1.0.0',
    required: true
  },
  // ... other fields
});
```

**Migration Strategy:**
- Document schema changes in migrations/
- Provide upgrade functions for breaking changes
- Support N-1 version compatibility when possible

### Data-Driven Design Rules

1. **No Hardcoded Game Mechanics**
   - Store rules in database, not code
   - Use configuration-driven features

2. **Flexible Field Types**
   - Support multiple data types (number, string, boolean, etc.)
   - Allow custom field definitions by users

3. **System-Agnostic Structures**
   - Never assume D&D/Pathfinder/etc. specific fields
   - Use generic terms (stats, skills, resources) not specific ones (strength, dexterity)

---

## Testing Requirements

### Test Coverage Targets

- **Shared Package:** 80% coverage minimum
- **Backend Services:** 70% coverage minimum
- **Frontend Components:** 60% coverage minimum
- **Critical Paths:** 100% coverage (auth, data validation, character creation)

### Test Types

**Unit Tests (Vitest/Jest):**
```typescript
// packages/shared/tests/models/system.test.ts
import { describe, it, expect } from 'vitest';
import { SystemModel } from '@tomeforge/shared';

describe('SystemModel', () => {
  it('should create a valid system configuration', () => {
    const system = new SystemModel({
      name: 'Test System',
      configuration: {
        stats: {
          strength: { dataType: 'number', order: 1 }
        }
      }
    });

    expect(system.name).toBe('Test System');
    expect(system.configuration.stats.strength.dataType).toBe('number');
  });

  it('should validate schema constraints', () => {
    expect(() => {
      new SystemModel({ name: '' }); // Empty name should fail
    }).toThrow();
  });
});
```

**Integration Tests:**
```typescript
// apps/backend/tests/routes/system.test.ts
import request from 'supertest';
import { app } from '../../src/app';

describe('POST /api/systems', () => {
  it('should create a new system', async () => {
    const response = await request(app)
      .post('/api/systems')
      .send({
        name: 'Test System',
        configuration: { stats: {} }
      })
      .expect(201);

    expect(response.body.name).toBe('Test System');
  });
});
```

**E2E Tests (Playwright):**
```typescript
// apps/frontend/tests/e2e/character-creation.spec.ts
import { test, expect } from '@playwright/test';

test('user can create a character', async ({ page }) => {
  await page.goto('/characters/new');
  await page.fill('[name="characterName"]', 'Test Hero');
  await page.selectOption('[name="system"]', 'D&D 5e');
  await page.click('button[type="submit"]');

  await expect(page.locator('.character-sheet')).toBeVisible();
  await expect(page.locator('.character-name')).toHaveText('Test Hero');
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test packages/shared/tests/models/system.test.ts

# Run E2E tests
pnpm test:e2e
```

---

## Documentation Standards

### Code Documentation

**JSDoc for Public APIs:**
```typescript
/**
 * Calculates the ability modifier for a given stat value.
 *
 * @param statValue - The raw stat value (typically 1-30)
 * @returns The calculated modifier
 *
 * @example
 * ```typescript
 * calculateModifier(16); // Returns 3
 * calculateModifier(8);  // Returns -1
 * ```
 */
export function calculateModifier(statValue: number): number {
  return Math.floor((statValue - 10) / 2);
}
```

**Inline Comments for Complex Logic:**
```typescript
// Calculate weighted random selection based on item rarity
// Rare items have 10x lower probability than common items
const weights = items.map(item =>
  1 / (RARITY_MULTIPLIERS[item.rarity] || 1)
);
```

### API Documentation

**Use OpenAPI/Swagger Comments:**
```typescript
/**
 * @swagger
 * /api/systems:
 *   post:
 *     summary: Create a new game system
 *     tags: [Systems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SystemInput'
 *     responses:
 *       201:
 *         description: System created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/System'
 */
router.post('/systems', createSystem);
```

### README Files

Each package should have a README:
- Purpose and scope
- Installation instructions
- Usage examples
- API reference (or link to generated docs)
- Contributing guidelines

---

## Code Review Process

### Review Checklist

**Functionality:**
- [ ] Feature works as described
- [ ] No breaking changes to existing features
- [ ] Edge cases handled appropriately
- [ ] Error handling implemented

**Code Quality:**
- [ ] Follows TypeScript strict mode
- [ ] No console.log statements (use proper logging)
- [ ] No commented-out code
- [ ] Proper error messages

**Testing:**
- [ ] Unit tests added for new code
- [ ] Integration tests for API changes
- [ ] All tests passing
- [ ] Coverage meets minimum requirements

**Documentation:**
- [ ] JSDoc comments for public APIs
- [ ] README updated if needed
- [ ] CHANGELOG updated
- [ ] Migration guide for breaking changes

**Schema Changes:**
- [ ] Schema version updated
- [ ] Migration script provided
- [ ] Validation rules defined
- [ ] Complexity limits respected

**Security:**
- [ ] No sensitive data in commits
- [ ] Input validation implemented
- [ ] Authorization checks in place
- [ ] SQL/NoSQL injection prevented

### Review Response Time

- **Critical Bugs:** < 24 hours
- **Features:** < 3 days
- **Documentation:** < 1 week

### Approval Requirements

- Minimum 1 approval for merge
- All CI checks must pass
- No unresolved conversations

---

## Release Process

### Versioning

Follow Semantic Versioning (SemVer):
- **MAJOR:** Breaking changes
- **MINOR:** New features (backwards compatible)
- **PATCH:** Bug fixes

### Release Checklist

1. **Pre-Release**
   - [ ] All tests passing
   - [ ] Update CHANGELOG.md
   - [ ] Update version in package.json files
   - [ ] Review breaking changes
   - [ ] Update migration guides

2. **Release**
   - [ ] Create release branch: `release/v1.2.3`
   - [ ] Build all packages: `pnpm build`
   - [ ] Tag release: `git tag v1.2.3`
   - [ ] Push tag: `git push origin v1.2.3`
   - [ ] Create GitHub release with notes

3. **Post-Release**
   - [ ] Merge release branch to main
   - [ ] Deploy to production
   - [ ] Monitor for issues
   - [ ] Update documentation site

### Changelog Format

```markdown
## [1.2.3] - 2025-10-17

### Added
- Character inventory management system
- Dice roller with custom formulas

### Changed
- Improved character sheet loading performance
- Updated system configuration validation

### Fixed
- Fixed modifier calculation bug in complex rolls
- Resolved character save race condition

### Breaking Changes
- SystemConfiguration schema version bumped to 2.0.0
- Migration required for existing systems
```

---

## Working with AI Assistants (Claude Code)

### File Access Control

TomeForge uses a three-layer approach for controlling file access:

1. **`.gitignore`** (root) - Controls version control (what goes in repo)
2. **`.claudeignore`** (root) - Controls AI assistant access (what Claude sees)
3. **`~/.claude/settings.json`** - Global security boundaries (applies to ALL projects)

### Local Development Files

You can keep personal notes and context without cluttering git:

**Gitignored but Claude-visible:**
- `tasks/` - Personal task lists and project notes
- `NOTES.md` - Scratchpad for ideas and session context
- `*_TODO.md` - File-specific TODOs
- `coverage/` - Test coverage reports for Claude to analyze

These files help Claude provide better context-aware assistance during sporadic development sessions.

### Security Requirements

**🔴 CRITICAL: All contributors MUST configure global security settings**

See `docs/SECURITY.md` for complete setup instructions.

**Quick setup:**
1. Create `~/.claude/settings.json`
2. Add security policy blocking `.env`, keys, credentials
3. Verify: Ask Claude "Can you see my @.env file?" (should say no)

### Project Instructions

See `.claude.md` at repository root for:
- Security guidelines (NEVER read .env files)
- Project conventions (JSON:API, TypeScript strict mode)
- Preferred patterns (async/await, validation)
- Common workflows (API endpoints, React components, schema changes)

---

## Questions or Issues?

- **Documentation Issues:** Create issue with `docs` label
- **Process Questions:** Open discussion in GitHub Discussions
- **Bug Reports:** Use bug report template
- **Feature Requests:** Use feature request template
- **Security Concerns:** See `docs/SECURITY.md`

---

**Last Updated:** 2025-10-17
**Document Version:** 1.1.0
