# Getting Started with API Documentation

This guide explains how to maintain and extend the API documentation for TomeForge.

## Overview

TomeForge uses an automated API documentation system that:
- Generates documentation from code using JSDoc annotations
- Produces OpenAPI 3.0.3 specification files
- Serves documentation via Swagger UI
- Requires zero manual synchronization

## Documentation Architecture

### Components

1. **JSDoc Annotations** - OpenAPI documentation added directly to route files
2. **swagger-jsdoc** - Scans route files and generates OpenAPI specification
3. **JSON Schemas** - Define request/response formats
4. **Build Scripts** - Automate generation during build process
5. **Dual Hosting** - Available via Express backend and static Docsify site

### Build Process

```bash
# Generate API documentation
pnpm build-api-spec

# Full build (includes API docs)
pnpm build

# Build and serve documentation site
pnpm build-docs
docsify serve docs
```

Generated files:
- `apps/backend/openapi.json` - For Express serving
- `docs/openapi.json` - For Docsify integration

## Documenting a New Endpoint

Follow these steps to document a new API endpoint:

### Step 1: Add JSDoc Annotation

Add an `@openapi` JSDoc block above your route handler:

```typescript
/**
 * @openapi
 * /your-endpoint:
 *   get:
 *     summary: Brief description of endpoint
 *     description: Detailed description of what this endpoint does
 *     tags:
 *       - YourTag
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 *             example:
 *               field: "value"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/your-endpoint', async (req, res) => {
  // Implementation
});
```

### Step 2: Document Path Parameters

For endpoints with URL parameters:

```typescript
/**
 * @openapi
 * /systems/{systemId}:
 *   put:
 *     summary: Update a system
 *     tags:
 *       - Systems
 *     parameters:
 *       - in: path
 *         name: systemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the system
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SystemInput'
 *     responses:
 *       200:
 *         description: System updated successfully
 */
```

### Step 3: Document Request Bodies

For POST/PUT endpoints:

```typescript
/**
 * @openapi
 * /systems:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SystemInput'
 *           example:
 *             name: "Example System"
 *             configuration:
 *               stats: []
 *               skills: []
 *             rules:
 *               diceRolling:
 *                 type: "d20"
 *                 dice: 20
 *                 quantity: 1
 */
```

### Step 4: Document Query Parameters

For endpoints with query parameters:

```typescript
/**
 * @openapi
 * /systems:
 *   get:
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Maximum number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of results to skip
 */
```

## Creating New Schemas

### Option 1: Auto-Generate from TypeScript

For TypeScript types in `@tomeforge/shared`:

1. Define your type in the shared package
2. Add the type to `scripts/generate-api-schemas.js`
3. Run `pnpm build-api-schemas`

### Option 2: Manual Schema Definition

For request/response formats not in shared types:

1. Create a schema file in `apps/backend/src/schemas/`
2. Export a JSON Schema object:

```typescript
// apps/backend/src/schemas/your-schema.schema.ts
export const YourSchema = {
  type: 'object',
  required: ['field1', 'field2'],
  properties: {
    field1: {
      type: 'string',
      description: 'Description of field1'
    },
    field2: {
      type: 'number',
      description: 'Description of field2'
    }
  },
  additionalProperties: false
};
```

3. Import and add to `apps/backend/src/config/swagger.config.ts`:

```typescript
import { YourSchema } from '../schemas/your-schema.schema';

export const swaggerDefinition = {
  // ...
  components: {
    schemas: {
      YourSchema: YourSchema,
      // ... other schemas
    }
  }
};
```

## Documentation Patterns

### Established Patterns from /api/systems

The `/api/systems` endpoints serve as reference implementations:

- **GET endpoint**: See `router.get('/systems', ...)`
- **POST endpoint**: See `router.post('/systems', ...)`
- **PUT endpoint**: See `router.put('/systems/:systemId', ...)`
- **DELETE endpoint**: See `router.delete('/systems/:systemId', ...)`

All patterns are located in `apps/backend/src/routes/system.ts`.

### Standard Response Codes

Use these HTTP status codes consistently:

- `200` - Successful GET/PUT
- `201` - Successful POST (resource created)
- `204` - Successful DELETE (no content)
- `400` - Bad request (validation errors)
- `404` - Resource not found
- `500` - Server errors

### Error Response Format

All error responses should use the `Error` schema:

```typescript
{
  error: "Error message describing what went wrong"
}
```

## Future Query Parameter Patterns

When implementing pagination, filtering, and sorting, use these patterns:

```
GET /systems?limit=10&offset=0&sort=name&filter=author:John
```

Documentation template is included in `apps/backend/src/routes/system.ts` comments.

## Versioning Preparation

Current documentation uses `/api/v1/` paths in the OpenAPI spec, with a note that the current implementation uses `/api/`.

When migrating to versioned paths:

1. Update the `servers` array in `apps/backend/src/config/swagger.config.ts`
2. Remove the migration note from the description
3. No changes needed to individual endpoint documentation

## Testing Documentation

After adding documentation:

1. Regenerate the spec:
   ```bash
   pnpm build-api-spec
   ```

2. Validate the OpenAPI spec:
   - Visit [Swagger Editor](https://editor.swagger.io/)
   - Paste contents of `apps/backend/openapi.json`
   - Check for validation errors

3. Test in Swagger UI:
   ```bash
   pnpm start-backend
   # Visit http://localhost:3000/api-docs
   ```

4. Verify all endpoints are documented correctly
5. Test example requests work as expected

## Best Practices

1. **Always include examples** - Examples help developers understand expected formats
2. **Document all responses** - Include success and all possible error responses
3. **Use schema references** - Reference shared schemas with `$ref` instead of duplicating
4. **Keep descriptions clear** - Write concise but complete descriptions
5. **Update examples when code changes** - Examples should reflect actual API behavior
6. **Follow existing patterns** - Model new documentation after `/api/systems` endpoints
7. **Test generated documentation** - Always verify in Swagger UI before committing

## File Locations

Key files for API documentation:

```
apps/backend/src/
├── config/
│   └── swagger.config.ts          # OpenAPI configuration
├── routes/
│   ├── system.ts                  # Example: Documented endpoints
│   └── swagger.ts                 # Swagger UI route
├── schemas/
│   ├── system-input.schema.ts     # Manual schema definitions
│   └── error.schema.ts
└── utils/
    └── swagger.ts                 # Swagger initialization

scripts/
├── generate-api-schemas.js        # TypeScript to JSON Schema
└── generate-openapi.js            # OpenAPI spec generation

docs/
├── openapi.json                   # Generated OpenAPI spec (for Docsify)
└── api-reference.md               # This documentation
```

## Troubleshooting

### OpenAPI spec not updating

1. Ensure you saved the route file
2. Run `pnpm build-api-spec` manually
3. Check for syntax errors in JSDoc annotations

### Schemas not resolving

1. Verify schema is imported in `swagger.config.ts`
2. Check schema name matches `$ref` reference
3. Ensure schema follows JSON Schema format

### Swagger UI not loading

1. Check backend is running: `pnpm start-backend`
2. Verify `openapi.json` exists at `apps/backend/openapi.json`
3. Check browser console for errors
4. Ensure route is registered in `index.ts`

## Additional Resources

- [OpenAPI 3.0.3 Specification](https://swagger.io/specification/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [JSON Schema Documentation](https://json-schema.org/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
