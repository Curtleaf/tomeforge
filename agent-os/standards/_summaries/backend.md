# Backend Standards Summary

**Quick Reference** - Read this first (~100 tokens), load full standards only when implementing.

## Architecture
- **Layered design**: routes → services → data-access → models
- **Never** access database directly from routes
- **Express** server on port 3000, base path `/api`
- **MongoDB** with Mongoose ODM

## API Standards (`backend/api.md`)
- **RESTful** with plural nouns: `/api/systems`, `/api/characters`
- **Status codes**: 200 (OK), 201 (Created), 204 (Deleted), 400 (Bad Request), 404 (Not Found), 500 (Error)
- **Errors**: Return `{ error: string }` JSON format
- **Layering**: routes delegate to services, services use data-access

## Models (`backend/models.md`)
- **Location**: `packages/shared/src/models/`
- **Naming**: PascalCase + "Model" suffix (SystemModel, CharacterModel)
- **Types**: Export via `InferSchemaType` (SystemType, CharacterType)
- **IDs**: Numeric business IDs (systemId, characterId) + MongoDB `_id`
- **Constraints**: Use `required: true`, `enum`, validation in schema

## Queries (`backend/queries.md`)
- **Data Access Layer**: `apps/backend/src/data-access/`
- **Patterns**: findOne (by business ID), findOneAndUpdate, findOneAndDelete
- **Type Safety**: Import models from `@tomeforge/shared`
- **Connection**: Cached in `apps/backend/src/utils/db/db.ts`

## Current Models
- **SystemModel**: Game system with configuration (stats, skills) and rules (dice mechanics)
- **CharacterModel**: Character with systemId FK, data, and embedded systemConfiguration

## Key Files
- Routes: `apps/backend/src/routes/system.ts`
- Services: `apps/backend/src/services/system.ts`
- Data Access: `apps/backend/src/data-access/system.ts`
- Models: `packages/shared/src/models/system.ts`, `packages/shared/src/models/character.ts`
- DB Connection: `apps/backend/src/utils/db/db.ts`

---

**For full details, see:**
- `agent-os/standards/backend/api.md` (~500 tokens)
- `agent-os/standards/backend/models.md` (~400 tokens)
- `agent-os/standards/backend/queries.md` (~300 tokens)
- `agent-os/standards/backend/migrations.md` (~200 tokens)
