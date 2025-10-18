# API Reference

## TomeForge API Documentation

The TomeForge API provides endpoints for managing tabletop game systems. The API follows RESTful principles and returns JSON responses.

## Accessing the Documentation

### Interactive Swagger UI (Recommended)

The most comprehensive way to explore the API is through the Swagger UI interface:

**Local Development:**
- Start the backend server: `pnpm start-backend`
- Visit: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

The Swagger UI provides:
- Interactive API testing (try out endpoints directly in your browser)
- Complete request/response schemas
- Example payloads for all endpoints
- Authentication details (when implemented)

### OpenAPI Specification

The raw OpenAPI 3.0.3 specification is available at:
- **Local Development:** [http://localhost:3000/api-docs/openapi.json](http://localhost:3000/api-docs/openapi.json)
- **Static File:** `/docs/openapi.json` (generated during build)

You can import this specification into:
- Postman (File → Import → OpenAPI)
- Insomnia (Design → Import)
- Any OpenAPI-compatible tool

## API Overview

### Base URLs

**Current Implementation:**
```
http://localhost:3000/api
```

**Planned (Future Versioning):**
```
http://localhost:3000/api/v1
```

### Available Endpoints

#### Systems Management

- `GET /api/systems` - Retrieve all game systems
- `POST /api/systems` - Create a new game system
- `PUT /api/systems/:systemId` - Update an existing system
- `DELETE /api/systems/:systemId` - Delete a system

### Authentication

Authentication is not yet implemented. Security placeholders are included in the OpenAPI specification for future JWT-based authentication.

## Quick Start Example

### Retrieve All Systems

```bash
curl http://localhost:3000/api/systems
```

### Create a New System

```bash
curl -X POST http://localhost:3000/api/systems \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Custom RPG",
    "description": "A homebrew system",
    "configuration": {
      "stats": [
        {
          "statId": 1,
          "name": "Strength",
          "dataType": "number",
          "order": 1
        }
      ],
      "skills": [
        {
          "skillId": 1,
          "name": "Combat",
          "dataType": "number",
          "order": 1
        }
      ]
    },
    "rules": {
      "diceRolling": {
        "type": "d20",
        "dice": 20,
        "quantity": 1,
        "modifier": 0
      }
    }
  }'
```

## Response Format

All endpoints return JSON responses.

**Success Response:**
```json
{
  "systemId": 1,
  "_id": "507f1f77bcf86cd799439011",
  "name": "My Custom RPG",
  ...
}
```

**Error Response:**
```json
{
  "error": "Error message describing what went wrong"
}
```

## Next Steps

- Read the [Getting Started with API Docs](/api-getting-started.md) guide to learn how to document new endpoints
- Explore the full API in [Swagger UI](http://localhost:3000/api-docs) (requires running backend)
- Review the OpenAPI specification for complete schema details
