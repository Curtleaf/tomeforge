# Spec Requirements: API Documentation Setup

## Initial Description
Configure Swagger/OpenAPI for automatic API documentation generation from code.

This is task #10 from Phase 0: Developer Infrastructure (CRITICAL FOUNDATION) in the product roadmap. Phase 0 focuses on establishing development practices, tooling, and automation to support sustainable sporadic development.

Task size: XS (extra small)

## Requirements Discussion

### First Round Questions

**Q1:** I assume you want to use swagger-jsdoc with JSDoc annotations directly in route files (similar to how many Express APIs document endpoints inline). Is that correct, or would you prefer a separate OpenAPI spec file that's manually maintained?

**Answer:** swagger-jsdoc with JSDoc annotations in route files

**Q2:** I'm thinking we should add a UI viewer like Swagger UI or Redoc hosted at `/api-docs`. Should we integrate this with your existing Docsify documentation setup or serve it separately from the Express backend?

**Answer:** Prefer integrating with Docsify/GitHub Pages if possible, but serving from Express backend at `/api-docs` is acceptable (keeps it in-app)

**Q3:** Should we document all existing API endpoints in this task, or start with core endpoints (like `/api/systems`) and establish patterns that can be replicated for other routes later?

**Answer:** Document current `/api/systems` endpoints only, establish patterns for future routes. NOTE: User will be switching to versioned API (`/api/v1/`) soon

**Q4:** For schema documentation, should we auto-generate JSON Schema definitions from the TypeScript types in `@tomeforge/shared`, or manually define them in the OpenAPI spec?

**Answer:** Auto-generate JSON Schema from TypeScript types in `@tomeforge/shared`

**Q5:** Do you want to generate a static `openapi.json` file during the build process, or serve it dynamically from the Express app?

**Answer:** Yes, generate static `openapi.json` during build

**Q6:** I assume we should use OpenAPI 3.0.x specification format. Should we include versioning in the API paths (e.g., `/api/v1/systems`) now, or keep it as `/api/systems` for the current state?

**Answer:** Prepare for future versioning - document as `/api/v1/systems` structure

**Q7:** Which OpenAPI features are priorities: request/response examples, schema validation rules, query parameter documentation, or all of the above?

**Answer:** Follow best standards, with emphasis on query parameter documentation

**Q8:** Should we include authentication/authorization placeholders in the spec even though auth isn't implemented yet (to establish the pattern), or skip security definitions entirely for now?

**Answer:** Include empty security scheme definitions as long as they won't cause issues if auth implementation changes

### Existing Code to Reference

**Similar Features Identified:**
No similar existing features identified for reference. This is foundational infrastructure.

**Existing Documentation Context:**
- Current documentation uses Docsify with GitHub Pages deployment
- Docs are synced from apps/packages to root using `sync-docs.js` script
- No particular JSDoc pattern currently followed, just following agent-os/product/ folder guidelines

### Follow-up Questions

No follow-up questions needed - all requirements clearly specified.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
N/A

## Requirements Summary

### Functional Requirements

**Core Functionality:**
- Configure swagger-jsdoc for automatic OpenAPI spec generation
- Add JSDoc annotations to existing `/api/systems` route handlers
- Auto-generate JSON Schema definitions from TypeScript types in `@tomeforge/shared`
- Generate static `openapi.json` file during build process
- Provide dual hosting options: integration with Docsify/GitHub Pages (preferred) OR Express backend at `/api-docs` (fallback)
- Document API using `/api/v1/systems` structure to prepare for upcoming versioning migration

**Schema Auto-Generation:**
- Extract TypeScript types from `@tomeforge/shared` package
- Convert to JSON Schema format for OpenAPI components
- Maintain type safety alignment between code and documentation

**Documentation Patterns:**
- Establish reusable JSDoc patterns for future endpoint documentation
- Follow best practices for OpenAPI 3.0.x specification
- Emphasize comprehensive query parameter documentation
- Include request/response examples
- Document schema validation rules

**Security Documentation:**
- Include empty security scheme definitions (e.g., Bearer token placeholder)
- Structure to allow easy future implementation without breaking changes
- Ensure flexible enough to accommodate future auth strategy changes

**Hosting Strategy:**
- **Primary Goal:** Integrate with existing Docsify documentation and GitHub Pages deployment
- **Fallback:** Serve Swagger UI from Express backend at `/api-docs` endpoint
- Generate static `openapi.json` that can be referenced by either hosting approach

### Reusability Opportunities

**Existing Infrastructure to Leverage:**
- Existing `sync-docs.js` script for documentation synchronization
- Current Docsify setup and GitHub Pages deployment
- TypeScript types and schemas in `@tomeforge/shared` package
- Existing build process and npm scripts in `package.json`

**Patterns to Establish:**
- JSDoc annotation templates for GET, POST, PUT, DELETE endpoints
- Schema generation process from TypeScript types
- Build-time documentation generation workflow
- Documentation deployment integration with existing docs pipeline

### Scope Boundaries

**In Scope:**
- swagger-jsdoc configuration and setup
- JSDoc annotations for `/api/systems` endpoints (all CRUD operations)
- JSON Schema auto-generation from `@tomeforge/shared` types
- Static `openapi.json` generation during build
- Documentation structured for `/api/v1/systems` (versioned paths)
- Empty security scheme definitions as placeholders
- Documentation hosting via Docsify integration OR Express `/api-docs` endpoint
- Comprehensive query parameter documentation
- Request/response examples
- Schema validation rule documentation
- Reusable patterns and templates for future endpoint documentation

**Out of Scope:**
- Documenting routes beyond `/api/systems`
- Actual implementation of authentication/authorization
- Migration of existing `/api/` paths to `/api/v1/` (just preparing documentation structure)
- Visual API documentation generation (diagrams, schema visualizations)
- Testing or validation of documented endpoints beyond existing tests
- Interactive API playground beyond standard Swagger UI features

**Future Enhancements:**
- Document remaining API endpoints using established patterns
- Implement actual authentication and update security definitions
- Add visual documentation generation (API diagrams, schema visualizations using tools like Mermaid) - **NEW ROADMAP ITEM**
- Integrate API versioning when `/api/v1/` migration occurs
- Add automated OpenAPI spec validation in CI/CD pipeline

### Technical Considerations

**Integration Points:**
- `apps/backend/src/routes/system.ts` - Primary route file to annotate
- `packages/shared/src/models/system.ts` - Source for System schema
- `packages/shared/src/models/character.ts` - Source for Character schema (if referenced)
- `sync-docs.js` - Existing documentation synchronization script
- Docsify configuration for GitHub Pages
- Root `package.json` for new build scripts

**Build Process Integration:**
- Add `build-api-docs` script to generate `openapi.json`
- Integrate with existing `pnpm build-docs` workflow
- Ensure TypeScript compilation of `@tomeforge/shared` occurs before schema extraction
- Output `openapi.json` to appropriate location for both Docsify and Express serving

**Technology Stack:**
- swagger-jsdoc for JSDoc to OpenAPI conversion
- swagger-ui-express (if serving from Express backend)
- ts-json-schema-generator or typescript-json-schema for TypeScript to JSON Schema conversion
- OpenAPI 3.0.x specification format

**Versioning Preparation:**
- Document all endpoints with `/api/v1/` prefix
- Note in OpenAPI info that actual endpoints currently use `/api/` (temporary)
- Include comment/annotation about upcoming versioning migration
- Structure allows easy path update when migration occurs

**Dual Hosting Architecture:**
- Static `openapi.json` generated in build process
- Docsify plugin or custom page can reference static file
- Express app can also serve Swagger UI pointing to same static file
- Allows transition between hosting approaches without regenerating spec

**Documentation Standards Compliance:**
- Follow agent-os/standards/backend/api.md conventions
- Align with agent-os/standards/global/coding-style.md for JSDoc formatting
- Use consistent naming conventions from agent-os/standards/global/conventions.md
- Follow error response patterns from agent-os/standards/global/error-handling.md

**System Constraints:**
- Maintain compatibility with MongoDB/Mongoose schema definitions
- Respect schema complexity limits from technical-constraints.md
- Ensure generated documentation reflects actual API behavior
- Keep documentation generation lightweight to avoid impacting build times
