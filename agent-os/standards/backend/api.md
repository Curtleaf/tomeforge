## API endpoint standards and conventions

### TomeForge API Standards

- **RESTful Design**: Follow REST principles with clear resource-based URLs and appropriate HTTP methods (GET, POST, PUT, PATCH, DELETE)
- **Base Path**: All API routes are mounted on `/api` (e.g., `/api/systems`)
- **Consistent Naming**: Use plural nouns for resource endpoints (e.g., `/api/systems`, `/api/characters`)
- **URL Parameters**: Use numeric IDs in URL paths (e.g., `/api/systems/:systemId`)
- **HTTP Status Codes**: Return appropriate status codes:
  - `200` - Successful GET/PUT/PATCH
  - `201` - Successful POST (resource created)
  - `204` - Successful DELETE (no content)
  - `400` - Bad request (validation errors)
  - `404` - Resource not found
  - `500` - Server errors
- **Error Handling**: Return errors as JSON with `{ error: string }` format
- **Route Organization**: Keep routes in `apps/backend/src/routes/` directory
- **Service Layer**: Route handlers delegate to service layer (`apps/backend/src/services/`)
- **Data Access Layer**: Services use data-access layer (`apps/backend/src/data-access/`) for database operations
- **Type Safety**: Use types from `@tomeforge/shared` for request/response validation

### Current API Endpoints

#### Systems API (`/api/systems`)
- `GET /api/systems` - Get all systems
- `POST /api/systems` - Create new system (expects `SystemType` in body)
- `PUT /api/systems/:systemId` - Update system by ID
- `DELETE /api/systems/:systemId` - Delete system by ID

### Versioning
- No versioning currently implemented
- Consider URL versioning (`/api/v1/systems`) for future breaking changes
