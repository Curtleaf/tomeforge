# ADR-001: MongoDB over PostgreSQL for Primary Database

**Status:** Accepted

**Date:** 2025-10-18 (Retroactive documentation of early decision)

**Deciders:** Project Owner

**Tags:** database, backend, architecture, data-modeling

---

## Context

TomeForge requires a database to store game systems, characters, campaigns, and user-generated content. The core product vision is **system-agnostic** - supporting any tabletop game from D&D to custom board games without code changes.

**Key Requirements:**
- Store game systems with highly variable configurations (stats, skills, dice mechanics)
- Support flexible schema for user-defined game systems
- Handle nested data structures (character data with system-specific fields)
- Enable rapid iteration during early development
- Work well with TypeScript and Node.js ecosystem

**Key Questions:**
- How do we model data that varies wildly between game systems?
- Should we use rigid relational schema or flexible document storage?
- What will be easier to evolve as product requirements emerge?

**Constraints:**
- Solo developer with sporadic development time
- Need to ship features quickly without extensive database migrations
- TypeScript-first development approach

---

## Decision

**We have decided to:** Use MongoDB with Mongoose ODM as the primary database for TomeForge.

**This means:**
- All data models will be defined as Mongoose schemas in `packages/shared/src/models/`
- Use document-based storage with embedded subdocuments for complex structures
- Leverage MongoDB's flexible schema for system-agnostic design
- Use `Schema.Types.Mixed` sparingly for truly dynamic fields (character data values)
- Generate TypeScript types from Mongoose schemas using `InferSchemaType`

---

## Alternatives Considered

### Alternative 1: PostgreSQL with TypeORM
**Pros:**
- Strong ACID guarantees
- Well-established relational model
- Better for complex joins and analytics
- TypeORM provides good TypeScript integration

**Cons:**
- Requires rigid schema upfront (difficult for system-agnostic design)
- Migrations are complex and time-consuming
- JSON columns for flexibility lose many benefits of relational DB
- Harder to model deeply nested game system configurations
- More ceremony for schema changes during rapid iteration

**Why rejected:** The relational model fights against the core requirement of system-agnostic flexibility. Modeling D&D stats alongside board game resources in the same rigid schema would require complex EAV patterns or excessive JSON columns, losing the benefits of relational databases.

### Alternative 2: PostgreSQL with Prisma
**Pros:**
- Excellent TypeScript integration
- Auto-generated types from schema
- Modern ORM with good DX
- Can use JSONB for flexibility

**Cons:**
- Still fundamentally relational, requires migrations
- JSONB flexibility means giving up on relational benefits
- Prisma migrations add complexity for solo dev
- Less natural fit for deeply nested documents

**Why rejected:** Similar to TypeORM - the relational paradigm doesn't align with the product vision of extreme schema flexibility.

### Alternative 3: DynamoDB
**Pros:**
- Fully managed, serverless
- Extremely scalable
- Flexible schema

**Cons:**
- AWS lock-in
- More expensive for small scale
- Complex query patterns
- Harder to run locally for development
- Learning curve for single-table design

**Why rejected:** Over-engineered for current needs, adds infrastructure complexity, and local development experience is worse than MongoDB.

---

## Consequences

### Positive Consequences
- **Rapid prototyping**: No migrations needed for schema changes during early development
- **System-agnostic modeling**: Can embed entire game system configurations as documents
- **TypeScript integration**: Mongoose + `InferSchemaType` provides excellent type safety
- **Flexible nested data**: Character stats, skills, and custom fields naturally modeled as subdocuments
- **Developer experience**: Mongoose API is intuitive, well-documented, and Node.js-native
- **Local development**: MongoDB runs easily in Docker (see ADR-003)
- **Atlas free tier**: Free cloud hosting for development/staging

### Negative Consequences / Trade-offs
- **Eventual consistency**: MongoDB sacrifices some ACID guarantees vs PostgreSQL
- **No foreign key enforcement**: Must handle referential integrity in application code
- **Query complexity**: Joins (lookups) are less efficient than PostgreSQL
- **Schema discipline required**: Flexibility can lead to data quality issues without validation
- **Scaling challenges**: May need to denormalize data for performance at scale

### Mitigation Strategies
- **Schema validation**: Use Mongoose schema validation strictly (required fields, enums, type checking)
- **Application-level constraints**: Implement referential integrity in service layer
- **Testing**: High test coverage for data access layer to catch validation issues
- **Schema versioning**: Add `schemaVersion` field to all models (Roadmap item 18)
- **Document size limits**: Enforce < 1MB soft limit, < 16MB hard limit (technical-constraints.md)
- **Nesting limits**: Max 3 levels deep to prevent complexity explosion (technical-constraints.md)

---

## Implementation Notes

**Files/Components Affected:**
- `packages/shared/src/models/system.ts` - System model with flexible configuration
- `packages/shared/src/models/character.ts` - Character model with embedded systemConfiguration
- `apps/backend/src/utils/db/db.ts` - MongoDB connection with caching
- `apps/backend/src/data-access/*.ts` - All data access uses Mongoose models

**Dependencies:**
- `mongoose`: ^8.x (Mongoose ODM)
- `mongodb`: ^6.x (underlying driver, installed via mongoose)

**Connection:**
- MongoDB Atlas (cloud) or local MongoDB instance
- Connection string via environment variables: `MONGODB_URI` or individual components
- Connection caching implemented to reuse across serverless/lambda invocations

**Related ADRs:**
- [ADR-003: Docker for Local Development](./003-docker-local-development.md) - MongoDB runs in Docker locally

---

## References

- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Schema Design Best Practices](https://www.mongodb.com/developer/products/mongodb/schema-design-best-practices/)
- [Mongoose TypeScript Support](https://mongoosejs.com/docs/typescript.html)
- TomeForge docs:
  - `agent-os/standards/backend/models.md` - Model standards
  - `agent-os/product/technical-constraints.md` - Schema complexity limits
  - `agent-os/product/mission.md` - System-agnostic design principle

---

## Metadata

**Supersedes:** N/A (Initial decision)

**Superseded by:** N/A (Active)

**Related Decisions:**
- ADR-003: Docker for Local Development (MongoDB runs in Docker)
- (Future) ADR-XXX: When to introduce Redis caching layer
- (Future) ADR-XXX: Migration strategy if scaling requires PostgreSQL for analytics
