# Subagent Role: spec-writer

**Purpose:** Creates detailed, actionable specifications from high-level requirements or feature ideas.

**Specialization:** Requirements analysis, acceptance criteria definition, technical planning

**When to Use:** Before implementing any new feature, when requirements are unclear, when converting user stories to technical specs

---

## Role Description

The spec-writer subagent transforms vague feature ideas into comprehensive, implementable specifications. It asks clarifying questions, considers edge cases, defines acceptance criteria, and produces specs that other agents (or developers) can use to implement features correctly the first time.

### Core Responsibilities

1. **Requirements Gathering**: Extract all necessary information from feature requests
2. **Edge Case Analysis**: Identify scenarios that might not be obvious
3. **Acceptance Criteria**: Define clear success conditions
4. **Technical Planning**: Break down features into implementation steps
5. **Standards Alignment**: Ensure specs follow TomeForge patterns

### What This Agent Does NOT Do

- ❌ Implement code
- ❌ Write tests
- ❌ Make product decisions (defers to product docs)
- ❌ Choose technologies (refers to ADRs)

---

## Context Requirements

### Always Provide

1. **Feature description** or user story
2. **Product context** from `agent-os/product/mission.md` (system-agnostic principle)
3. **Technical constraints** from `agent-os/product/technical-constraints.md`
4. **Existing spec examples** from `agent-os/specs/`

### Optionally Provide

- User personas (from mission.md)
- Related features or dependencies
- Performance requirements
- Security requirements

### Never Provide

- Entire codebase
- Full conversation history
- Unrelated project documentation

---

## Invocation Pattern

### Basic Invocation

```
Use the spec-writer subagent to create a specification for [feature name].

Feature description: [1-2 paragraphs describing the feature]

Context:
- Related to: [existing features or roadmap items]
- User persona: [who will use this]
- Priority: [P0-P3 from roadmap]

Requirements from product docs:
- System-agnostic design (agent-os/product/mission.md)
- Schema constraints (agent-os/product/technical-constraints.md)
```

### Advanced Invocation (with examples)

```
Use the spec-writer subagent to create a detailed specification for
adding user authentication to TomeForge.

Follow the spec format from:
agent-os/specs/2025-10-17-api-documentation-setup/spec.md

Include:
1. Security requirements (OWASP best practices)
2. Token strategy (JWT vs sessions)
3. Password requirements
4. API endpoint changes
5. Database schema changes
6. Migration plan from current (no auth) to authenticated state

Reference:
- agent-os/product/roadmap.md item 25 (User Authentication)
- agent-os/standards/backend/api.md (API patterns)
- agent-os/decisions/001-mongodb-over-postgresql.md (database context)
```

---

## Expected Output Format

The spec-writer should produce a specification document with these sections:

### Required Sections

1. **Overview**
   - Feature name and summary
   - User problem being solved
   - Success criteria

2. **Requirements**
   - Functional requirements (what the feature must do)
   - Non-functional requirements (performance, security, usability)
   - Edge cases and error scenarios

3. **Technical Design**
   - Data models (Mongoose schemas)
   - API endpoints (routes, request/response)
   - Frontend components (if applicable)
   - Integration points

4. **Implementation Plan**
   - Step-by-step breakdown
   - Dependencies and prerequisites
   - Testing strategy

5. **Acceptance Criteria**
   - Clear, testable conditions for "done"
   - User acceptance testing scenarios

### Optional Sections

- **Alternatives Considered** (if design choices were made)
- **Migration Strategy** (for breaking changes)
- **Security Considerations**
- **Performance Considerations**

---

## Example Invocations

### Example 1: New CRUD Feature

```
Use the spec-writer subagent to create a spec for adding a Campaign model
to TomeForge, allowing users to create and manage tabletop game campaigns.

Requirements:
- Campaigns contain multiple characters
- Campaigns belong to one user (GM/owner)
- Campaigns track sessions, notes, and timeline
- Follow system-agnostic design (works for any game system)

Reference:
- Existing models: packages/shared/src/models/system.ts, character.ts
- Schema constraints: agent-os/product/technical-constraints.md
- API patterns: agent-os/standards/backend/api.md
```

### Example 2: Refactoring Task

```
Use the spec-writer subagent to create a refactoring spec for extracting
the database connection logic into a reusable module.

Current state:
- Connection logic in apps/backend/src/utils/db/db.ts
- Connection caching implemented but could be improved
- No connection pooling

Goal state:
- Reusable connection module in packages/shared
- Connection pooling with configurable pool size
- Health check endpoint
- Graceful shutdown handling

Reference:
- ADR-001 (MongoDB decision)
- ADR-002 (monorepo structure)
```

### Example 3: Bug Fix Specification

```
Use the spec-writer subagent to create a detailed bug fix specification.

Bug description:
findByIdAndUpdate in apps/backend/src/data-access/system.ts uses
incorrect query format. Should use numeric systemId, not _id.

Expected from spec:
1. Root cause analysis
2. Correct implementation approach
3. Test cases to prevent regression
4. Related code that might have same issue
5. Migration plan if data is affected

Reference:
- Roadmap item 1 (Critical bug fix)
- agent-os/standards/backend/queries.md
```

---

## Quality Criteria

A good spec-writer output should be:

✅ **Complete**
- Answers all "what", "why", "how" questions
- Includes edge cases and error scenarios
- Defines clear acceptance criteria

✅ **Actionable**
- Developer can implement without asking clarifying questions
- Specific file paths and function names
- Clear step-by-step instructions

✅ **Testable**
- Acceptance criteria can be verified
- Includes test scenarios
- Defines success/failure conditions

✅ **Aligned with Standards**
- Follows TomeForge conventions
- References relevant ADRs
- Respects technical constraints

✅ **Concise**
- No unnecessary information
- Clear, direct language
- Well-organized sections

---

## Chaining with Other Agents

### Common Workflows

**Spec → Test → Implement → Review**
```
1. spec-writer creates detailed specification
2. test-generator writes tests from spec (TDD approach)
3. Main agent implements feature to pass tests
4. code-reviewer verifies implementation
```

**Spec → Implement → Test → Review → Document**
```
1. spec-writer creates specification
2. Main agent implements feature
3. test-generator adds comprehensive tests
4. code-reviewer checks quality
5. doc-writer updates documentation
```

### Handoff Protocol

When handing off from spec-writer to next agent:

1. **Save spec** to `agent-os/specs/YYYY-MM-DD-feature-name/spec.md`
2. **Review spec** with main agent before proceeding
3. **Reference spec** when invoking next agent (test-generator, etc.)

---

## TomeForge-Specific Guidance

### System-Agnostic Principle

spec-writer should ALWAYS ensure designs are system-agnostic:

```
❌ Bad Spec:
"Add a field for D&D character level (1-20)"

✅ Good Spec:
"Add a configurable progression field to System model.
D&D example: level (1-20), number type
Board game example: victory points (0-100), number type
RPG Maker example: experience (0-999999), number type"
```

### Schema Complexity Constraints

spec-writer must enforce constraints from `technical-constraints.md`:

- Max 3 levels of nesting
- Document size < 1MB soft limit
- Array size < 100 items recommended
- All models include `schemaVersion` field

### MongoDB Query Patterns

spec-writer should specify correct Mongoose queries:

```
✅ Good:
"Use findOneAndUpdate with { systemId: id } filter"

❌ Bad:
"Use findByIdAndUpdate with systemId"
```

---

## Success Metrics

Track spec-writer effectiveness by:

- **Implementation time**: Specs should reduce back-and-forth questions
- **Spec completeness**: Devs/agents shouldn't need to ask "what about X?"
- **Standards compliance**: Implementations should align with specs
- **Test coverage**: Test-generator should easily create tests from spec

---

## References

- Example specs: `agent-os/specs/*/spec.md`
- Product vision: `agent-os/product/mission.md`
- Technical constraints: `agent-os/product/technical-constraints.md`
- Roadmap: `agent-os/product/roadmap.md`

---

**Role Type:** Planning / Analysis
**Primary Output:** Specification documents
**Typical Duration:** 10-30 minutes
**Context Budget:** ~3000-5000 tokens
