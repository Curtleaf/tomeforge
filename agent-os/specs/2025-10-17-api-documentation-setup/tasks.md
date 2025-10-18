# Task Breakdown: API Documentation Setup

## Overview
Total Task Groups: 4
Assigned roles: api-engineer, testing-engineer
Feature Size: XS (Extra Small)
Phase: Phase 0 - Developer Infrastructure

## Task List

### Configuration & Foundation

#### Task Group 1: Swagger Configuration Setup
**Assigned implementer:** api-engineer
**Dependencies:** None
**Complexity:** Low

- [x] 1.0 Complete swagger-jsdoc configuration
  - [x] 1.1 Install required npm packages
    - Install `swagger-jsdoc` in apps/backend
    - Install `swagger-ui-express` in apps/backend (for fallback hosting)
    - Install `typescript-json-schema` as dev dependency in root
    - Verify all packages install successfully
  - [x] 1.2 Create swagger configuration file
    - Create `apps/backend/src/config/swagger.config.ts`
    - Define OpenAPI 3.0.x specification metadata (title, version, description)
    - Configure servers array with `/api/v1` base path
    - Add note about current `/api` implementation and future migration
    - Include empty `bearerAuth` security scheme placeholder (type: http, scheme: bearer)
    - Mark security scheme as "not yet implemented" in description
    - Follow structure from spec.md lines 100-127
  - [x] 1.3 Configure swagger-jsdoc options
    - Set swagger definition from config file
    - Configure API file paths to scan: `['apps/backend/src/routes/**/*.ts']`
    - Set OpenAPI specification version to 3.0.0 or 3.0.3
    - Define output format as JSON
  - [x] 1.4 Create swagger initialization module
    - Create `apps/backend/src/utils/swagger.ts`
    - Initialize swagger-jsdoc with configuration
    - Export OpenAPI specification object
    - Add error handling for configuration loading

**Acceptance Criteria:**
- All required npm packages installed without conflicts
- Swagger configuration file created with valid OpenAPI 3.0.x structure
- Configuration includes versioned API paths (`/api/v1/`) with migration note
- Empty security scheme definitions present but clearly marked as placeholders
- Initialization module successfully generates empty OpenAPI spec

---

### Schema Generation

#### Task Group 2: TypeScript to JSON Schema Conversion
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 1
**Complexity:** Medium

- [x] 2.0 Complete schema auto-generation
  - [x] 2.1 Create schema generation script
    - Create `scripts/generate-api-schemas.js` in root
    - Use `typescript-json-schema` to extract schemas from `packages/shared/src/models/system.ts`
    - Target types: `SystemType` (full object with _id), nested schemas (`configurationsSchema`, `rulesSchema`)
    - Output to `apps/backend/src/generated/schemas.json`
    - Include schema generation options: `--required --noExtraProps --strictNullChecks`
    - Follow pattern from spec.md lines 259-283
  - [x] 2.2 Define SystemInput schema manually
    - Create `apps/backend/src/schemas/system-input.schema.ts`
    - Define JSON Schema for system creation payload (without `_id`, `systemId`)
    - Match `SystemType` structure but exclude auto-generated fields
    - Include validation rules matching Mongoose schema constraints
    - Export as typed object
  - [x] 2.3 Create Error response schema
    - Create `apps/backend/src/schemas/error.schema.ts`
    - Define JSON Schema for `{ error: string }` format
    - Match existing error response pattern from routes
    - Export as typed object
  - [x] 2.4 Integrate schemas into swagger config
    - Import generated schemas in `swagger.config.ts`
    - Add schemas to `components.schemas` section
    - Include: `System`, `SystemInput`, `Error`, `Configurations`, `Rules`
    - Ensure schema references use `#/components/schemas/[SchemaName]` format
  - [x] 2.5 Add schema generation to build process
    - Add `build-api-schemas` script to root `package.json`
    - Command: `node scripts/generate-api-schemas.js`
    - Ensure script runs before TypeScript compilation
    - Verify generated schemas directory exists in .gitignore

**Acceptance Criteria:**
- Schema generation script successfully extracts TypeScript types
- Generated `schemas.json` contains valid JSON Schema definitions
- Manual schemas (`SystemInput`, `Error`) defined and match API behavior
- All schemas integrated into swagger configuration
- Build script generates schemas without errors
- Generated files properly gitignored

---

### API Documentation

#### Task Group 3: JSDoc Annotations for /api/systems Endpoints
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 2
**Complexity:** Medium

- [x] 3.0 Complete JSDoc annotations for all /api/systems endpoints
  - [x] 3.1 Write 2-8 focused tests for OpenAPI spec validation
    - Limit to 2-8 highly focused tests maximum
    - Create test file: `apps/backend/src/tests/openapi.spec.test.ts`
    - Test: Generated openapi.json is valid OpenAPI 3.0.x spec
    - Test: All /api/systems endpoints are documented
    - Test: Schema references resolve correctly
    - Test: Response examples are present
    - Skip exhaustive validation of every endpoint detail
  - [x] 3.2 Add JSDoc for GET /systems endpoint
    - Add `@openapi` JSDoc block above `router.get('/systems', ...)` in `apps/backend/src/routes/system.ts`
    - Document path as `/systems` (will be prefixed by server base path)
    - Add summary: "Get all game systems"
    - Add description explaining purpose
    - Add tag: "Systems"
    - Document 200 response with array of System schema refs
    - Document 500 error response with Error schema ref
    - Include example response with sample system data
    - Follow pattern from spec.md lines 130-160
  - [x] 3.3 Add JSDoc for POST /systems endpoint
    - Add `@openapi` JSDoc block above `router.post('/systems', ...)`
    - Document path as `/systems`
    - Add summary: "Create a new game system"
    - Add description explaining functionality
    - Add tag: "Systems"
    - Document requestBody with SystemInput schema ref and example
    - Document 201 response with System schema ref
    - Document 400 error response (validation failure) with Error schema ref
    - Include example request body with valid system data
    - Follow pattern from spec.md lines 162-201
  - [x] 3.4 Add JSDoc for PUT /systems/:systemId endpoint
    - Add `@openapi` JSDoc block above `router.put('/systems/:systemId', ...)`
    - Document path as `/systems/{systemId}`
    - Add summary: "Update a game system"
    - Add description explaining update behavior
    - Add tag: "Systems"
    - Document path parameter: `systemId` (type: integer, required: true)
    - Document requestBody with SystemInput schema ref
    - Document 200 response with updated System schema ref
    - Document 404 error response (system not found) with Error schema ref
    - Document 400 error response (validation failure) with Error schema ref
    - Include example request body
    - Follow pattern from spec.md lines 203-247
  - [x] 3.5 Add JSDoc for DELETE /systems/:systemId endpoint
    - Add `@openapi` JSDoc block above `router.delete('/systems/:systemId', ...)`
    - Document path as `/systems/{systemId}`
    - Add summary: "Delete a game system"
    - Add description explaining deletion
    - Add tag: "Systems"
    - Document path parameter: `systemId` (type: integer, required: true)
    - Document 204 response (no content)
    - Document 404 error response with Error schema ref
    - Document 500 error response with Error schema ref
    - Note: Use same pattern as PUT but with delete-appropriate responses
  - [x] 3.6 Add comprehensive query parameter documentation
    - Review if any endpoints accept query parameters (pagination, filtering, sorting)
    - If none exist currently, add comment block documenting standard patterns for future
    - Prepare query param documentation templates in comments for: `?limit=`, `?offset=`, `?sort=`
    - Document expected future query parameters as comments in route file
  - [x] 3.7 Generate static openapi.json file
    - Create `apps/backend/src/utils/generate-openapi.ts` script
    - Import swagger-jsdoc configuration and run generation
    - Output to `apps/backend/openapi.json` (for Express serving)
    - Also output to `docs/openapi.json` (for Docsify integration)
    - Add `build-api-spec` script to root package.json: `node apps/backend/src/utils/generate-openapi.ts`
    - Add `build-api-docs` script combining: `pnpm build-api-schemas && pnpm build-api-spec`
  - [x] 3.8 Ensure JSDoc annotation tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify openapi.json generates without errors
    - Validate openapi.json against OpenAPI 3.0.x specification using online validator
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- All four CRUD endpoints for /api/systems have complete JSDoc annotations
- JSDoc follows OpenAPI 3.0.x specification format
- Request/response examples present for all endpoints
- Path parameters properly documented for PUT and DELETE
- Error responses documented with appropriate status codes
- Static openapi.json generated successfully in both locations
- Generated spec passes OpenAPI validation

---

### Integration & Hosting

#### Task Group 4: Documentation Hosting Setup
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 3
**Complexity:** Low

- [x] 4.0 Complete documentation hosting integration
  - [x] 4.1 Set up Express backend /api-docs endpoint (fallback option)
    - Create route in `apps/backend/src/routes/swagger.ts`
    - Import `swagger-ui-express`
    - Serve Swagger UI at `/api-docs` using generated openapi.json
    - Add static file serving for `/openapi.json` endpoint
    - Register swagger routes in `apps/backend/src/index.ts`
    - Ensure routes load after all API routes are registered
  - [x] 4.2 Integrate with Docsify documentation (preferred option)
    - Research Docsify OpenAPI plugin options (e.g., `docsify-swagger`, `docsify-openapi`)
    - Update `docs/index.html` with chosen plugin configuration
    - Create `docs/api-reference.md` that embeds/links to openapi.json
    - Test plugin renders OpenAPI spec correctly in Docsify
    - If plugin unavailable, create fallback link to `/api-docs` in docs
  - [x] 4.3 Update documentation build process
    - Modify `scripts/sync-docs.js` to copy openapi.json to docs/ folder
    - Ensure `pnpm build-docs` generates openapi.json before syncing
    - Update root package.json `build-docs` script: `pnpm build-api-docs && node scripts/sync-docs.js`
    - Test full documentation build process
  - [x] 4.4 Add API documentation to main navigation
    - Update `docs/README.md` or `docs/_sidebar.md` to include link to API Reference
    - Add descriptive text about API documentation purpose
    - Include links to both Docsify-rendered docs and Express /api-docs endpoint
    - Note the dual hosting options available
  - [x] 4.5 Create API documentation usage guide
    - Create `docs/api-getting-started.md`
    - Document how to access API documentation (both hosting methods)
    - Explain JSDoc annotation patterns for future endpoint documentation
    - Include examples of adding documentation to new endpoints
    - Document schema generation process
    - Reference established patterns from /api/systems endpoints
    - Add note about upcoming /api/v1/ versioning migration

**Acceptance Criteria:**
- Swagger UI loads successfully at `/api-docs` endpoint
- Docsify integration displays OpenAPI spec or links to Express endpoint
- Documentation build process generates and copies openapi.json correctly
- API reference accessible from main documentation navigation
- Usage guide provides clear instructions for maintaining documentation
- Both hosting options functional and accessible
- Build time impact is < 5 seconds for documentation generation

---

### Testing & Verification

#### Task Group 5: Test Review & Final Validation
**Assigned implementer:** testing-engineer
**Dependencies:** Task Groups 1-4
**Complexity:** Low

- [x] 5.0 Review existing tests and fill critical gaps only
  - [x] 5.1 Review tests from Task Group 3
    - Review the 2-8 tests written by api-engineer (Task 3.1)
    - Verify tests cover: spec validation, endpoint documentation presence, schema resolution
    - Total existing tests: approximately 2-8 tests
  - [x] 5.2 Analyze test coverage gaps for THIS feature only
    - Identify missing test cases for API documentation functionality
    - Focus ONLY on gaps related to swagger/OpenAPI spec generation
    - Prioritize: endpoint accuracy, schema correctness, hosting functionality
    - Do NOT test entire API functionality, only documentation generation
  - [x] 5.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests in `apps/backend/src/tests/api-documentation.test.ts`
    - Test: Swagger UI endpoint returns 200 status
    - Test: openapi.json file exists at expected locations
    - Test: Schema generation script completes successfully
    - Test: Generated schemas match TypeScript type structure
    - Test: All required components (schemas, paths, servers) present in spec
    - Test: Example requests/responses are valid JSON
    - Test: Security schemes are present but marked as not implemented
    - Test: Documentation reflects /api/v1/ structure
    - Skip: Testing actual API endpoint functionality (already covered by existing tests)
    - Skip: Performance testing of documentation generation
  - [x] 5.4 Run feature-specific tests only
    - Run ONLY tests related to API documentation (tests from 3.1 and 5.3)
    - Expected total: approximately 12-18 tests maximum
    - Do NOT run the entire application test suite
    - Verify all documentation-related tests pass
  - [x] 5.5 Manual validation checklist
    - Manually verify: openapi.json passes online OpenAPI validator
    - Manually verify: Swagger UI loads without console errors
    - Manually verify: All /api/systems endpoints appear in documentation
    - Manually verify: Request/response examples are accurate
    - Manually verify: Schema references resolve correctly
    - Manually verify: Documentation build time is under 5 seconds
    - Manually verify: Docsify integration displays correctly
    - Document any manual validation findings

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 12-18 tests total)
- No more than 10 additional tests added by testing-engineer
- OpenAPI spec validates successfully with external validator
- Both hosting options (Express and Docsify) functional
- Documentation generation completes in < 5 seconds
- Manual validation checklist completed with no critical issues
- Zero manual synchronization required for documentation updates

---

## Execution Order

Recommended implementation sequence:
1. Configuration & Foundation (Task Group 1)
2. Schema Generation (Task Group 2)
3. API Documentation (Task Group 3)
4. Integration & Hosting (Task Group 4)
5. Testing & Verification (Task Group 5)

## Notes

### Build Process Integration
The complete build process will be:
```bash
pnpm build-api-schemas    # Generate JSON schemas from TypeScript
pnpm build-api-spec       # Generate openapi.json from JSDoc
pnpm build-docs           # Sync docs including openapi.json
pnpm build                # Compile TypeScript for all packages
```

### Key Files Created
- `apps/backend/src/config/swagger.config.ts` - OpenAPI configuration
- `apps/backend/src/utils/swagger.ts` - Swagger initialization
- `apps/backend/src/utils/generate-openapi.ts` - Static file generation
- `apps/backend/src/schemas/system-input.schema.ts` - Manual schema definitions
- `apps/backend/src/schemas/error.schema.ts` - Error response schema
- `apps/backend/src/routes/swagger.ts` - Swagger UI route
- `scripts/generate-api-schemas.js` - TypeScript to JSON Schema conversion
- `apps/backend/openapi.json` - Generated OpenAPI specification (Express)
- `docs/openapi.json` - Generated OpenAPI specification (Docsify)
- `docs/api-reference.md` - API documentation page
- `docs/api-getting-started.md` - Documentation usage guide

### Key Files Modified
- `apps/backend/src/routes/system.ts` - Add JSDoc annotations
- `apps/backend/src/index.ts` - Register swagger routes
- `docs/index.html` - Add OpenAPI plugin configuration
- `docs/README.md` or `docs/_sidebar.md` - Add API reference link
- `scripts/sync-docs.js` - Copy openapi.json to docs
- Root `package.json` - Add build scripts

### Standards Compliance
- Follows `agent-os/standards/backend/api.md` for API endpoint conventions
- Follows `agent-os/standards/global/conventions.md` for project structure
- Follows `agent-os/standards/testing/test-writing.md` for minimal, focused testing
- Aligns with `agent-os/standards/global/tech-stack.md` (Express, TypeScript, pnpm)

### Versioning Preparation
- All documentation uses `/api/v1/` path structure
- Configuration includes note about current `/api/` implementation
- Easy migration path: update servers array when versioning is implemented
- No endpoint-specific changes required for versioning migration

### Future Enhancements
- Document additional endpoints using established patterns
- Implement authentication and update security schemes
- Add automated OpenAPI validation to CI/CD pipeline
- Consider visual documentation generation (Mermaid diagrams)
- Add interactive API testing features
