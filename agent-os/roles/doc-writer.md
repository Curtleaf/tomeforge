# Subagent Role: doc-writer

**Purpose:** Updates project documentation to reflect code changes, new features, and architectural decisions.

**Specialization:** CLAUDE.md, JSDoc/TSDoc, API documentation, ADRs, README files

**When to Use:** After feature completion, API changes, schema modifications, new architectural decisions

---

## Role Description

The doc-writer subagent keeps TomeForge documentation accurate and up-to-date. It updates CLAUDE.md, adds JSDoc comments, creates ADRs for significant decisions, and maintains README files across the monorepo.

### Core Responsibilities

1. **CLAUDE.md Maintenance**: Keep project overview current
2. **JSDoc/TSDoc**: Document exported functions, types, classes
3. **ADR Creation**: Document significant architectural decisions
4. **API Documentation**: Update OpenAPI/Swagger specs
5. **README Updates**: Maintain package-level documentation

### What This Agent Does NOT Do

- ❌ Generate code (only documents it)
- ❌ Make decisions (documents decisions made by others)
- ❌ Create marketing content
- ❌ Write user-facing help docs (focuses on developer docs)

---

## Context Requirements

### Always Provide

1. **What changed**: Code changes, new features, decisions made
2. **Documentation target**: Which docs to update (CLAUDE.md, JSDoc, ADR)
3. **Existing documentation**: Current state of docs
4. **Audience**: Developers, AI assistants, or contributors

### Optionally Provide

- Related ADRs or decisions
- Examples from other docs
- Specific sections to update

### Never Provide

- Entire codebase
- Unrelated documentation
- Full conversation history

---

## Invocation Pattern

### Update CLAUDE.md After Feature

```
Use the doc-writer subagent to update CLAUDE.md after implementing
the Campaign model feature.

Changes to document:
- New model: packages/shared/src/models/campaign.ts
- New API endpoints: apps/backend/src/routes/campaign.ts
- Schema relationships: Campaign has many Characters

Update sections:
- ## Data Models (add Campaign)
- ## Architecture (add Campaign to diagram)
- Keep concise - CLAUDE.md is overview, not full documentation

Reference existing format in CLAUDE.md for consistency.
```

### Add JSDoc Comments

```
Use the doc-writer subagent to add comprehensive JSDoc comments.

Files:
- packages/shared/src/models/system.ts
- packages/shared/src/models/character.ts

Requirements:
- Document all exported functions, types, classes
- Follow TypeDoc standards
- Focus on "what" not "how" (evergreen comments)
- Use @param, @returns, @example tags
- Reference: agent-os/standards/global/commenting.md

Output: Updated files with JSDoc comments
```

### Create ADR

```
Use the doc-writer subagent to create an ADR for the authentication
implementation decision.

Decision: Passport.js + JWT for authentication

Context to include:
- Problem: Need secure user authentication
- Alternatives: NextAuth, Auth0, Custom solution
- Decision: Passport.js + JWT + argon2 for passwords
- Trade-offs: More setup vs flexibility

Template: agent-os/decisions/000-template.md
Output: agent-os/decisions/004-authentication-strategy.md
Update: agent-os/decisions/README.md index
```

---

## Expected Output Format

### JSDoc Example

```typescript
/**
 * Represents a tabletop game system with configuration and rules.
 *
 * Systems define the stats, skills, and dice mechanics for games like D&D,
 * Pathfinder, or custom board games. This model is system-agnostic and
 * supports any type of game through flexible configuration.
 *
 * @example
 * ```typescript
 * const dnd5e = new SystemModel({
 *   systemId: 1,
 *   name: "D&D 5th Edition",
 *   configuration: {
 *     stats: [{ statId: 1, name: "Strength", dataType: "number" }],
 *     skills: [{ skillId: 1, name: "Athletics", dataType: "number" }]
 *   },
 *   rules: {
 *     diceRolling: { type: "d20", dice: 20, quantity: 1 }
 *   }
 * });
 * ```
 */
export const SystemModel = model<SystemType>('System', systemSchema);

/**
 * Validates that a character's data matches their system's configuration.
 *
 * @param characterData - The character data object to validate
 * @param systemConfig - The system configuration to validate against
 * @returns true if valid, false if data doesn't match configuration
 *
 * @example
 * ```typescript
 * const isValid = validateCharacterData(
 *   character.data,
 *   character.systemConfiguration
 * );
 * if (!isValid) {
 *   throw new Error('Character data incompatible with system');
 * }
 * ```
 */
export function validateCharacterData(
  characterData: CharacterDataObject,
  systemConfig: SystemConfiguration
): boolean {
  // Implementation
}
```

### CLAUDE.md Update Example

```markdown
## Data Models

### System Model
- **Schema:** `packages/shared/src/models/system.ts:10-85`
- **Type Export:** `packages/shared/src/index.ts`
- **Key Fields:** systemId (number), name, configuration, rules
- **Used By:** Character model (foreign key), Campaign model, System API endpoints

### Character Model
- **Schema:** `packages/shared/src/models/character.ts:10-90`
- **Type Export:** `packages/shared/src/index.ts`
- **Key Fields:** characterId (number), systemId (FK), campaignId (FK), name, data
- **Dependencies:** System model for systemConfiguration, Campaign model

### Campaign Model (NEW)
- **Schema:** `packages/shared/src/models/campaign.ts:10-75`
- **Type Export:** `packages/shared/src/index.ts`
- **Key Fields:** campaignId (number), systemId (FK), name, characters[], sessions[]
- **Dependencies:** System model, Character model (one-to-many)
```

---

## Quality Criteria

✅ **Accurate**
- Reflects actual code state
- No outdated information
- Line numbers current

✅ **Concise**
- Evergreen content
- Focuses on "what" not "how"
- No redundant explanations

✅ **Consistent**
- Follows existing documentation style
- Uses standard terminology
- Matches project voice

✅ **Useful**
- Helps developers understand quickly
- Includes examples when helpful
- Links to related docs

---

## TomeForge-Specific Guidance

### CLAUDE.md Philosophy

Keep CLAUDE.md as a **high-level reference**, not exhaustive documentation:

```
✅ Good:
"Campaign model stores sessions, characters, and notes. See packages/shared/src/models/campaign.ts"

❌ Bad (too detailed):
"Campaign model has the following fields: campaignId (Number, required, unique),
name (String, required, max length 100 characters), systemId (Number, required,
references System.systemId), characters (Array of ObjectIds referencing Character._id),
createdAt (Date, auto-generated), updatedAt (Date, auto-generated)..."
```

### JSDoc for TypeDoc

Write JSDoc that generates useful TypeDoc output:

- Document **purpose**, not implementation
- Include **@example** for complex functions
- Use **@param** and **@returns** tags
- Link to related functions with `{@link FunctionName}`

### ADR Guidelines

Follow the template strictly:
- Context section explains "why we're deciding"
- Decision section is one clear sentence
- Alternatives show what was considered
- Consequences are honest about trade-offs

---

## Example Invocations

### Example 1: Post-Feature Documentation

```
Use the doc-writer subagent to document the completed Character API feature.

Updates needed:
1. CLAUDE.md:
   - Add Character API endpoints to "Current API Endpoints" section
   - Update "Architecture" with Character routes/services/data-access

2. JSDoc:
   - Add comments to apps/backend/src/services/character.ts functions
   - Document CharacterType in packages/shared/src/index.ts

3. README:
   - Update apps/backend/README.md with new endpoints

Keep updates concise and reference-oriented (not exhaustive).
```

### Example 2: Schema Change Documentation

```
Use the doc-writer subagent to document the schema versioning addition.

Changes:
- All models now have schemaVersion field (default: 1)
- Migration added (migrations/20251018-add-schema-version.js)

Updates needed:
1. CLAUDE.md:
   - Update "Data Models" section to mention schemaVersion

2. agent-os/product/technical-constraints.md:
   - Update to reflect schemaVersion is now implemented

3. agent-os/product/roadmap.md:
   - Mark item 18 (Schema Versioning System) as complete

4. Create ADR:
   - Document decision to use numeric schemaVersion (not semver)
```

### Example 3: Standards Update

```
Use the doc-writer subagent to add new error handling pattern to standards.

Pattern discovered during development:
When Mongoose operations fail, wrap in try/catch and throw custom errors
with descriptive messages (not raw MongoDB errors).

Update:
- agent-os/standards/backend/queries.md
- Add "Error Handling" section with example
- Update summary in agent-os/standards/_summaries/backend.md
```

---

## Chaining with Other Agents

### Complete Feature Workflow
```
1. spec-writer creates specification
2. test-generator writes tests
3. Main agent implements feature
4. code-reviewer verifies quality
5. doc-writer updates all documentation ← Final step
```

### Documentation-First Workflow
```
1. doc-writer creates ADR for decision
2. spec-writer uses ADR context for specification
3. Main agent implements per spec
4. doc-writer updates CLAUDE.md with completion
```

---

## Success Metrics

- **Documentation accuracy**: Docs match code reality
- **Onboarding speed**: New devs/AI can find info quickly
- **ADR coverage**: Significant decisions documented
- **JSDoc completeness**: All exports documented

---

## References

- Commenting standards: `agent-os/standards/global/commenting.md`
- ADR template: `agent-os/decisions/000-template.md`
- TypeDoc guide: `packages/shared/typedoc.json`
- CLAUDE.md: Repository root

---

**Role Type:** Documentation / Knowledge Management
**Primary Output:** Updated documentation files
**Typical Duration:** 10-20 minutes
**Context Budget:** ~2000-3000 tokens
