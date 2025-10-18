# Specification: API Documentation Setup

## Goal
Configure Swagger/OpenAPI for automatic API documentation generation from code, establishing patterns for maintaining comprehensive, up-to-date API documentation with minimal manual effort.

## User Stories
- As a developer, I want to view comprehensive API documentation so that I can understand available endpoints without reading code
- As a frontend developer, I want to see request/response schemas and examples so that I can integrate with the backend API correctly
- As a future contributor, I want to follow established JSDoc patterns so that I can document new endpoints consistently
- As a project maintainer, I want auto-generated documentation that stays synchronized with code so that documentation never becomes outdated

## Core Requirements

### Functional Requirements
- Configure swagger-jsdoc to generate OpenAPI 3.0.x specification from JSDoc annotations
- Document all existing `/api/systems` CRUD endpoints with JSDoc in route files
- Auto-generate JSON Schema definitions from TypeScript types in `@tomeforge/shared`
- Generate static `openapi.json` file during build process
- Provide dual hosting strategy: Docsify/GitHub Pages integration (preferred) OR Express `/api-docs` endpoint (fallback)
- Structure API paths as `/api/v1/systems` to prepare for upcoming versioning migration
- Include comprehensive query parameter documentation
- Add request/response examples for all endpoints
- Document schema validation rules
- Include empty security scheme placeholders for future authentication

### Non-Functional Requirements
- Documentation generation must not significantly impact build time (< 5 seconds)
- Generated OpenAPI spec must be valid according to OpenAPI 3.0.x specification
- JSDoc patterns must be reusable across all future endpoint documentation
- Documentation must accurately reflect actual API behavior
- Type safety alignment between TypeScript types and JSON Schema must be maintained

## Visual Design
No visual mockups provided. Standard Swagger UI presentation will be used if served from Express backend. For Docsify integration, OpenAPI spec will be rendered using existing Docsify theme.

## Reusable Components

### Existing Code to Leverage
- **Documentation Infrastructure**: Existing `sync-docs.js` script for documentation synchronization
- **Docsify Setup**: Current Docsify configuration at `/docs/index.html` with GitHub Pages deployment
- **Build Scripts**: Root `package.json` build scripts (e.g., `build-docs`)
- **TypeScript Types**: `SystemType` from `@tomeforge/shared/src/models/system.ts`
- **Route Layer**: Existing route structure in `apps/backend/src/routes/system.ts`
- **Error Response Pattern**: Existing `{ error: string }` error format from current routes
- **API Standards**: Documented conventions in `agent-os/standards/backend/api.md`

### New Components Required
- **swagger-jsdoc Configuration**: New configuration file defining OpenAPI spec metadata and JSDoc scanning paths
- **JSDoc Annotations**: JSDoc comments with OpenAPI tags added to existing route handlers
- **TypeScript to JSON Schema Converter**: Script using `typescript-json-schema` or `ts-json-schema-generator` to extract schemas
- **Build Script Integration**: New npm script to generate `openapi.json` during build
- **Swagger UI Route** (if fallback hosting used): Express route serving Swagger UI at `/api-docs`
- **Docsify OpenAPI Plugin** (if preferred hosting used): Integration to render OpenAPI spec in Docsify

## Technical Approach

### Architecture Overview
The API documentation system follows a build-time generation strategy with dual hosting flexibility:

1. **JSDoc Annotations**: Developers add OpenAPI-compliant JSDoc comments directly in route files
2. **Build-Time Generation**: swagger-jsdoc scans annotated files and generates static `openapi.json`
3. **Schema Extraction**: Separate build step extracts JSON Schemas from TypeScript types in `@tomeforge/shared`
4. **Schema Merging**: Generated schemas are referenced in OpenAPI components section
5. **Dual Hosting**: Static `openapi.json` can be served via Docsify plugin OR Express Swagger UI endpoint

### Database Layer
No database changes required. Documentation describes existing data models.

### API Layer
**New Endpoints** (if Express hosting used):
- `GET /api-docs` - Serves Swagger UI interface
- `GET /openapi.json` - Serves static OpenAPI specification

**No Changes to Existing Endpoints**: Current `/api/systems` endpoints remain unchanged functionally, only adding JSDoc comments.

### Frontend Layer
No frontend application changes required. If Docsify hosting is chosen, configuration changes to `docs/index.html` to add OpenAPI plugin.

### Build Process
**New Build Scripts** (add to root `package.json`):
```json
{
  "scripts": {
    "build-api-schemas": "Generate JSON schemas from TypeScript types",
    "build-api-spec": "Run swagger-jsdoc to generate openapi.json",
    "build-api-docs": "pnpm build-api-schemas && pnpm build-api-spec",
    "build": "pnpm build-api-docs && pnpm -r exec tsc"
  }
}
```

**Build Order**:
1. Compile `packages/shared` TypeScript to ensure types are available
2. Extract JSON Schemas from compiled TypeScript types
3. Run swagger-jsdoc to scan route files and generate OpenAPI spec
4. Copy `openapi.json` to appropriate location(s) for hosting

### JSDoc Pattern Examples

**Base Configuration** (create `apps/backend/src/swagger.config.ts`):
```typescript
export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TomeForge API',
    version: '1.0.0',
    description: 'System-agnostic tabletop game management API'
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1 (upcoming migration from /api)'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Authentication placeholder - not yet implemented'
      }
    },
    schemas: {} // Populated from generated JSON schemas
  }
};
```

**GET Endpoint Pattern**:
```typescript
/**
 * @openapi
 * /systems:
 *   get:
 *     summary: Get all game systems
 *     description: Retrieves a list of all game systems in the database
 *     tags:
 *       - Systems
 *     responses:
 *       200:
 *         description: Array of system objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/System'
 *             example:
 *               - systemId: 1
 *                 name: "Dungeons & Dragons 5e"
 *                 description: "Fifth edition D&D"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/systems', async (req, res) => { ... });
```

**POST Endpoint Pattern**:
```typescript
/**
 * @openapi
 * /systems:
 *   post:
 *     summary: Create a new game system
 *     description: Creates a new game system with configurations and rules
 *     tags:
 *       - Systems
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SystemInput'
 *           example:
 *             name: "Custom RPG System"
 *             description: "A homebrew system"
 *             configuration:
 *               stats: [...]
 *               skills: [...]
 *             rules:
 *               diceRolling: {...}
 *     responses:
 *       201:
 *         description: System created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/System'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/systems', async (req, res) => { ... });
```

**PUT/DELETE Endpoint Pattern**:
```typescript
/**
 * @openapi
 * /systems/{systemId}:
 *   put:
 *     summary: Update a game system
 *     description: Updates an existing game system by ID
 *     tags:
 *       - Systems
 *     parameters:
 *       - in: path
 *         name: systemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the system to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SystemInput'
 *     responses:
 *       200:
 *         description: System updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/System'
 *       404:
 *         description: System not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/systems/:systemId', async (req, res) => { ... });
```

### Schema Auto-Generation Strategy

**Approach**: Use `typescript-json-schema` or `ts-json-schema-generator` to extract JSON schemas from TypeScript types.

**Target Types** (from `@tomeforge/shared`):
- `SystemType` - Full system object including MongoDB `_id`
- `SystemInput` - System creation payload (without `_id`, `systemId`)
- Nested schemas: `ConfigurationsSchema`, `RulesSchema`

**Generation Script** (create `scripts/generate-schemas.js`):
```javascript
const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function generateSchemas() {
  const sharedPath = path.join(__dirname, '../packages/shared');
  const outputPath = path.join(__dirname, '../apps/backend/src/generated-schemas.json');

  // Ensure shared package is compiled
  await execAsync('cd packages/shared && pnpm build');

  // Generate schemas from TypeScript types
  const command = `npx typescript-json-schema ${sharedPath}/src/models/system.ts SystemType --out ${outputPath} --required --noExtraProps`;

  await execAsync(command);

  console.log('Schemas generated successfully');
}

generateSchemas();
```

**Integration**: Generated schemas are imported into swagger configuration and referenced in components.

### Hosting Strategy

**Option 1: Docsify/GitHub Pages Integration (Preferred)**
- Install `docsify-plugin-openapi` or similar
- Add plugin to `docs/index.html`
- Create `docs/api.md` that references `openapi.json`
- Copy generated `openapi.json` to `docs/` during `build-docs` script
- Benefits: Centralized documentation, matches existing documentation workflow

**Option 2: Express Backend Serving (Fallback)**
- Install `swagger-ui-express`
- Create route in `apps/backend/src/index.ts`:
```typescript
import swaggerUi from 'swagger-ui-express';
import openapiSpec from './openapi.json';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
```
- Benefits: Self-contained within application, no external hosting dependency

**Implementation Recommendation**: Start with Option 2 (Express hosting) for simplicity, migrate to Option 1 (Docsify integration) once stable.

### Versioning Preparation
- Document all endpoints with `/api/v1/` prefix
- Add note in OpenAPI `info.description`: "Note: Current implementation uses `/api/` paths. Migration to `/api/v1/` is planned."
- Add `servers` array with both current and future base paths
- When migration occurs, only update server configuration, not individual endpoint documentation

### Testing Strategy
- Validate generated `openapi.json` using OpenAPI validator
- Manually test Swagger UI interface loads correctly
- Verify all documented endpoints match actual route definitions
- Test example requests/responses against actual API
- Ensure schema validation rules match Mongoose schema constraints

## Out of Scope
- Documenting endpoints beyond `/api/systems` (patterns established for future use)
- Actual implementation of authentication/authorization (only placeholder definitions)
- Migrating existing API paths from `/api/` to `/api/v1/` (documentation prepares for future migration)
- Visual API documentation generation (diagrams, schema visualizations using tools like Mermaid)
- Testing or validation of documented endpoints beyond existing tests
- Interactive API playground features beyond standard Swagger UI functionality
- API versioning implementation (only documentation structure prepared)
- Automated OpenAPI spec validation in CI/CD pipeline (future enhancement)

## Success Criteria
- `openapi.json` file is generated successfully during build process
- Generated OpenAPI spec passes validation (e.g., using Swagger Editor)
- All four `/api/systems` endpoints (GET, POST, PUT, DELETE) are fully documented with JSDoc
- JSON Schemas for `SystemType` are auto-generated from TypeScript types
- Documentation is accessible via chosen hosting method (Swagger UI or Docsify)
- Request/response examples are present for all endpoints
- Query parameters (if any) are comprehensively documented
- Error responses follow documented `{ error: string }` format
- Security scheme placeholders are present but marked as not implemented
- JSDoc patterns are documented for future endpoint documentation
- Build time impact is < 5 seconds for documentation generation
- Documentation reflects `/api/v1/systems` structure while noting current `/api/systems` implementation
- Zero manual synchronization required - documentation updates automatically with code changes

## Future Considerations

### Upcoming Versioning Migration
When migrating from `/api/` to `/api/v1/`:
1. Update `servers` array in swagger configuration
2. Remove note about path discrepancy
3. No changes required to individual endpoint documentation
4. Consider adding `/api/v2/` documentation alongside v1

### Authentication Implementation
When implementing authentication:
1. Update `bearerAuth` security scheme with actual details
2. Add `security` property to protected endpoints
3. Document authentication flow in OpenAPI spec
4. Add examples with authentication headers

### Additional Endpoints
For each new endpoint:
1. Follow established JSDoc patterns from `/api/systems`
2. Reuse common response schemas (Error, pagination, etc.)
3. Add new schemas to auto-generation script as needed
4. Maintain consistent tag structure

### CI/CD Integration
- Add OpenAPI spec validation step to GitHub Actions workflow
- Fail builds if OpenAPI spec is invalid
- Consider automated schema drift detection between code and documentation
- Add documentation preview in pull requests

### Enhanced Documentation
- Add Mermaid diagrams for API flows and relationships
- Generate schema visualization diagrams
- Add interactive examples with try-it-out functionality
- Document rate limiting and throttling policies when implemented
