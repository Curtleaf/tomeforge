# Subagent Chaining Patterns

This document provides proven workflows for chaining TomeForge subagents together to accomplish complex development tasks efficiently.

---

## Overview

**Chaining** subagents means running them in sequence, where each agent's output becomes input for the next. This creates powerful workflows that deliver high-quality results through specialized expertise at each stage.

### Benefits of Chaining

- **Quality Isolation**: Each agent maintains high output quality through focused context
- **Specialization**: Right agent for each task
- **Verification**: Built-in quality gates between stages
- **Parallelization**: Independent chains can run simultaneously

---

## Pattern 1: Feature Development (TDD Approach)

**Use When:** Implementing new features with test-driven development

### Workflow

```
1. spec-writer   → Creates detailed specification
2. test-generator → Writes comprehensive tests from spec
3. [Main Agent]   → Implements feature to pass tests
4. code-reviewer  → Adversarial quality check
5. doc-writer     → Updates documentation
```

### Invocation Example

**Step 1: Create Specification**
```
Use the spec-writer subagent to create a detailed specification
for adding a Campaign model to TomeForge.

Feature description:
Users need to organize characters into campaigns for their tabletop
game sessions. Campaigns should track sessions, notes, and timeline.

Context:
- System-agnostic design (works for any game system)
- Schema constraints (agent-os/product/technical-constraints.md)
- Existing models: System, Character

Output: agent-os/specs/2025-10-19-campaign-model/spec.md
```

**Step 2: Generate Tests**
```
Use the test-generator subagent to write comprehensive tests for
the Campaign API based on the spec.

Spec: agent-os/specs/2025-10-19-campaign-model/spec.md

Requirements:
- Framework: Vitest (unit), Jest (integration)
- Coverage: 70% minimum
- Test types: Service layer + API endpoints
- Mock database connections

Output: apps/backend/src/tests/campaign.test.ts
```

**Step 3: Implement (Main Agent)**
```
Now I'll implement the Campaign feature to pass the generated tests.

Reference:
- Spec: agent-os/specs/2025-10-19-campaign-model/spec.md
- Tests: apps/backend/src/tests/campaign.test.ts
- Standards: agent-os/standards/_summaries/backend.md
```

**Step 4: Code Review**
```
Use the code-reviewer subagent to review the Campaign implementation.

Files changed:
- packages/shared/src/models/campaign.ts
- apps/backend/src/routes/campaign.ts
- apps/backend/src/services/campaign.ts
- apps/backend/src/data-access/campaign.ts

Focus:
- Standards compliance
- Schema complexity (max 3 levels nesting)
- Query patterns (use findOneAndUpdate correctly)
- Error handling

Standards: agent-os/standards/_summaries/backend.md
```

**Step 5: Update Documentation**
```
Use the doc-writer subagent to update documentation for Campaign feature.

Updates needed:
1. CLAUDE.md (add Campaign to Data Models section)
2. JSDoc comments (campaign.ts model)
3. agent-os/product/roadmap.md (mark item complete if applicable)

Keep concise - reference-oriented not exhaustive.
```

### Expected Duration
- **Total**: 45-90 minutes
- spec-writer: 15-20 min
- test-generator: 15-30 min
- Implementation: 20-40 min
- code-reviewer: 10-15 min
- doc-writer: 10-15 min

---

## Pattern 2: Bug Fix with Regression Prevention

**Use When:** Fixing bugs and ensuring they don't return

### Workflow

```
1. [Main Agent]   → Investigates and implements fix
2. test-generator → Writes regression tests
3. code-reviewer  → Verifies fix quality and tests
4. doc-writer     → Updates relevant docs (if needed)
```

### Invocation Example

**Step 1: Fix Bug (Main Agent)**
```
I'll fix the findByIdAndUpdate bug in system data-access layer.

Bug: Using findByIdAndUpdate with systemId (should use findOneAndUpdate)
File: apps/backend/src/data-access/system.ts
Roadmap: Item 1 (Critical bug fix)
```

**Step 2: Regression Tests**
```
Use the test-generator subagent to write regression tests for the
findByIdAndUpdate bug fix.

Bug description:
findByIdAndUpdate was incorrectly querying _id instead of systemId.
Fixed to use findOneAndUpdate({ systemId: id }).

Create tests that:
1. Verify correct behavior (queries by systemId)
2. Would fail if bug returns (test assertion on query params)
3. Cover both success and not-found scenarios
4. Check related functions for same pattern

Output: apps/backend/src/tests/system-data-access.test.ts
```

**Step 3: Review Fix and Tests**
```
Use the code-reviewer subagent to review bug fix and regression tests.

Files changed:
- apps/backend/src/data-access/system.ts (bug fix)
- apps/backend/src/tests/system-data-access.test.ts (tests)

Focus:
- Fix is correct (no other issues introduced)
- Tests would catch regression
- All similar patterns fixed (modifySystem, deleteSystem)

Standards: agent-os/standards/backend/queries.md
```

### Expected Duration
- **Total**: 20-40 minutes
- Investigation + fix: 10-15 min
- test-generator: 10-15 min
- code-reviewer: 5-10 min

---

## Pattern 3: Schema Migration

**Use When:** Changing database schemas or data structures

### Workflow

```
1. [Main Agent]    → Modifies Mongoose schema
2. db-migrator     → Creates migration scripts
3. test-generator  → Writes migration tests
4. code-reviewer   → Verifies migration safety
5. doc-writer      → Updates schema documentation
```

### Invocation Example

**Step 1: Modify Schema (Main Agent)**
```
I'll add the schemaVersion field to all models as required by
Roadmap item 18.

Files to modify:
- packages/shared/src/models/system.ts
- packages/shared/src/models/character.ts

Change: Add { schemaVersion: { type: Number, required: true, default: 1 } }
```

**Step 2: Create Migration**
```
Use the db-migrator subagent to create a migration for adding
schemaVersion to existing documents.

Current state: System and Character models exist without schemaVersion
Target state: All documents have schemaVersion: 1

Requirements:
- Update all existing systems and characters
- Provide rollback script
- Include validation step
- Migration tool: migrate-mongo

Output: migrations/20251018-add-schema-version.js
```

**Step 3: Test Migration**
```
Use the test-generator subagent to write tests for the schema
version migration.

Migration file: migrations/20251018-add-schema-version.js

Test requirements:
- Test up migration (adds schemaVersion)
- Test down migration (removes schemaVersion)
- Test idempotency (running twice is safe)
- Test with sample data

Output: migrations/__tests__/20251018-add-schema-version.test.js
```

**Step 4: Review Migration**
```
Use the code-reviewer subagent to review the migration for safety.

Files:
- migrations/20251018-add-schema-version.js
- migrations/__tests__/20251018-add-schema-version.test.js

Safety checklist:
- No data loss possible
- Rollback works correctly
- Idempotent (can run multiple times)
- Handles edge cases (empty collections, orphaned data)
- Performance acceptable (estimate time for 100k documents)
```

**Step 5: Document Changes**
```
Use the doc-writer subagent to update documentation for schemaVersion.

Updates:
1. CLAUDE.md - Mention schemaVersion in Data Models section
2. agent-os/product/roadmap.md - Mark item 18 as complete
3. agent-os/product/technical-constraints.md - Update to reflect implementation
4. Create ADR if decision made (e.g., numeric vs semver versioning)
```

### Expected Duration
- **Total**: 45-75 minutes
- Schema modification: 10-15 min
- db-migrator: 20-30 min
- test-generator: 10-15 min
- code-reviewer: 10-15 min
- doc-writer: 10-15 min

---

## Pattern 4: Refactoring with Safety

**Use When:** Restructuring code without changing behavior

### Workflow

```
1. [Main Agent]   → Plans and executes refactoring
2. test-generator → Ensures comprehensive test coverage
3. code-reviewer  → Verifies no regressions introduced
4. doc-writer     → Updates affected documentation
```

### Invocation Example

**Step 1: Refactor (Main Agent)**
```
I'll extract database connection logic into a reusable module.

Current: Connection in apps/backend/src/utils/db/db.ts
Target: Reusable module in packages/shared/src/utils/db.ts
Benefits: Shared between backend and future CLI tools

Changes:
- Move connection logic to shared package
- Add connection pooling
- Add health check function
- Update backend to import from shared
```

**Step 2: Comprehensive Testing**
```
Use the test-generator subagent to ensure refactored code is
thoroughly tested.

Files refactored:
- packages/shared/src/utils/db.ts (new)
- apps/backend/src/utils/db/db.ts (updated to use shared)

Requirements:
- Unit tests for connection module
- Test connection pooling
- Test health check function
- Mock MongoDB driver
- Coverage: 80% for shared package

Output: packages/shared/src/tests/db.test.ts
```

**Step 3: Verify No Regressions**
```
Use the code-reviewer subagent to verify refactoring didn't
introduce issues.

Focus:
- Behavior unchanged (same functionality)
- No new bugs introduced
- Error handling preserved
- Performance same or better
- All backend references updated

Run existing test suite to confirm no regressions.
```

**Step 4: Update Documentation**
```
Use the doc-writer subagent to update docs for refactored code.

Updates:
1. CLAUDE.md - Update database connection section
2. JSDoc - Add comprehensive comments to db.ts
3. ADR - Create ADR for extraction decision (if significant)
4. README - Update packages/shared/README.md

Emphasis: Connection logic now in shared package, available to all apps.
```

### Expected Duration
- **Total**: 40-70 minutes
- Refactoring: 20-30 min
- test-generator: 15-20 min
- code-reviewer: 10-15 min
- doc-writer: 10-15 min

---

## Pattern 5: Parallel Subagent Execution

**Use When:** Multiple independent tasks can run simultaneously

### Workflow

```
Run in parallel:
- test-generator   → Backend API tests
- test-generator   → Frontend component tests
- doc-writer       → Update documentation
- code-reviewer    → Review separate feature
```

### Invocation Example

```
Please run these subagents in PARALLEL:

1. test-generator: Write comprehensive tests for System API
   - File: apps/backend/src/routes/system.ts
   - Coverage target: 70%
   - Framework: Jest + supertest

2. test-generator: Write tests for Character model
   - File: packages/shared/src/models/character.ts
   - Coverage target: 80%
   - Framework: Vitest

3. doc-writer: Add JSDoc comments to System model
   - File: packages/shared/src/models/system.ts
   - Follow TypeDoc standards

4. code-reviewer: Review Campaign implementation
   - Files: apps/backend/src/routes/campaign.ts (and related)
   - Focus: Standards compliance

Run all simultaneously to save time.
```

### Expected Duration
- **Total**: ~30 minutes (vs 60+ if sequential)
- Time savings: 40-50% through parallelization

---

## Anti-Patterns (What NOT to Do)

### ❌ Anti-Pattern 1: Too Much Context

**Bad:**
```
Use spec-writer to create a spec. Here's the entire CLAUDE.md,
all standards files, the full product roadmap, every ADR, and
the complete conversation history...
```

**Good:**
```
Use spec-writer to create a spec for Campaign model.

Context:
- System-agnostic design (agent-os/product/mission.md)
- Schema constraints (agent-os/product/technical-constraints.md)
- Example spec format (agent-os/specs/2025-10-17-api-documentation-setup/spec.md)
```

### ❌ Anti-Pattern 2: Asking One Agent to Do Everything

**Bad:**
```
Use test-generator to write tests, implement the feature, review the code,
and update documentation.
```

**Good:**
```
Chain appropriately:
1. test-generator writes tests
2. Main agent implements
3. code-reviewer reviews
4. doc-writer documents
```

### ❌ Anti-Pattern 3: Skipping Verification

**Bad:**
```
1. spec-writer creates spec
2. Main agent implements
3. DONE ← No review or testing!
```

**Good:**
```
1. spec-writer creates spec
2. test-generator writes tests
3. Main agent implements
4. code-reviewer verifies ← Critical step
5. doc-writer updates docs
```

### ❌ Anti-Pattern 4: Not Providing Clear Success Criteria

**Bad:**
```
Use test-generator to write some tests.
```

**Good:**
```
Use test-generator to write tests achieving 70% coverage for
apps/backend/src/services/system.ts with focus on edge cases
and error scenarios.
```

---

## Workflow Selection Guide

| Scenario | Recommended Pattern | Duration |
|----------|---------------------|----------|
| New feature with clear requirements | Feature Development (TDD) | 45-90 min |
| Bug fix | Bug Fix with Regression | 20-40 min |
| Database schema change | Schema Migration | 45-75 min |
| Code restructuring | Refactoring with Safety | 40-70 min |
| Multiple independent tasks | Parallel Execution | 30-60 min |

---

## Success Metrics

Track workflow effectiveness:
- **Completion rate**: Do workflows finish successfully?
- **Quality**: Are code-reviewer findings decreasing?
- **Coverage**: Is test coverage meeting targets?
- **Time**: Are parallel workflows saving time?

---

## References

- Subagent roles: `agent-os/roles/*.md`
- Standards: `agent-os/standards/_summaries/`
- Roadmap: `agent-os/product/roadmap.md`

---

**Last Updated:** 2025-10-18
**Workflows Documented:** 5 core patterns
