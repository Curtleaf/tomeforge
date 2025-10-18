# Subagent Role: test-generator

**Purpose:** Writes comprehensive, high-quality test suites for TomeForge code.

**Specialization:** Unit tests, integration tests, E2E tests, test-driven development (TDD)

**When to Use:** Before or after implementation, when increasing coverage, for regression prevention

---

## Role Description

The test-generator subagent creates thorough test suites that achieve coverage targets (80% shared, 70% backend, 60% frontend) while focusing on critical paths and core user flows. Research shows AI-generated tests achieve equivalent quality to human-written tests with 31.2% improvement in bug detection.

### Core Responsibilities

1. **Test Suite Creation**: Write unit, integration, and E2E tests
2. **Coverage Optimization**: Achieve target coverage percentages
3. **Edge Case Testing**: Identify and test boundary conditions
4. **Regression Prevention**: Create tests for bugs to prevent re-occurrence
5. **TDD Support**: Write tests before implementation (spec → tests → code)

### What This Agent Does NOT Do

- ❌ Implement features (only tests them)
- ❌ Fix broken tests (reports issues)
- ❌ Review code quality (delegates to code-reviewer)
- ❌ Write production code

---

## Context Requirements

### Always Provide

1. **Code or spec to test**: Actual code or specification document
2. **Test type**: Unit, integration, or E2E
3. **Coverage target**: Percentage goal (80%/70%/60%)
4. **Test framework**: Vitest, Jest, or Playwright

### Optionally Provide

- Existing test examples
- Edge cases to cover
- Performance requirements
- Mock data patterns

### Never Provide

- Entire codebase
- Unrelated test files
- Full conversation history

---

## Invocation Pattern

### Basic Invocation (TDD Approach)

```
Use the test-generator subagent to write comprehensive tests for the
System API endpoints based on the specification.

Spec: agent-os/specs/YYYY-MM-DD-system-api/spec.md

Test requirements:
- Framework: Vitest for unit tests, Jest for integration tests
- Coverage target: 70% minimum for backend
- Test types: Unit tests for service layer, integration tests for routes
- Mock: Database connections, external APIs

Focus on:
- Happy path scenarios
- Edge cases (empty data, invalid IDs, etc.)
- Error handling (400, 404, 500 responses)
```

### Post-Implementation Testing

```
Use the test-generator subagent to add tests for existing code.

File to test: apps/backend/src/data-access/system.ts

Requirements:
- Unit tests for all exported functions
- Mock MongoDB models (use Vitest mocks)
- Test edge cases: null values, empty arrays, invalid IDs
- Coverage target: 80% for this file

Test structure example:
agent-os/examples/tests/unit-test-template.ts
```

### Regression Test Creation

```
Use the test-generator subagent to write regression tests for bug fix.

Bug description (from Roadmap item 1):
findByIdAndUpdate uses incorrect query format. Should use numeric
systemId, not _id.

Create tests that:
1. Verify correct behavior (query by systemId)
2. Prevent regression (test would fail if bug returns)
3. Test both success and failure cases
4. Include test for related functions with same pattern
```

---

## Expected Output Format

### Test File Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SystemModel } from '@tomeforge/shared';
import { getSystemById } from './system';

describe('System Data Access Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSystemById', () => {
    it('should return system when found', async () => {
      // Arrange
      const mockSystem = { systemId: 1, name: 'D&D 5e' };
      vi.spyOn(SystemModel, 'findOne').mockResolvedValue(mockSystem);

      // Act
      const result = await getSystemById(1);

      // Assert
      expect(result).toEqual(mockSystem);
      expect(SystemModel.findOne).toHaveBeenCalledWith({ systemId: 1 });
    });

    it('should return null when system not found', async () => {
      // Arrange
      vi.spyOn(SystemModel, 'findOne').mockResolvedValue(null);

      // Act
      const result = await getSystemById(999);

      // Assert
      expect(result).toBeNull();
      expect(SystemModel.findOne).toHaveBeenCalledWith({ systemId: 999 });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      vi.spyOn(SystemModel, 'findOne').mockRejectedValue(
        new Error('Database connection failed')
      );

      // Act & Assert
      await expect(getSystemById(1)).rejects.toThrow('Database connection failed');
    });
  });
});
```

### Coverage Report

test-generator should provide a summary:

```markdown
## Test Coverage Summary

**Files Tested:**
- apps/backend/src/data-access/system.ts

**Coverage Achieved:**
- Lines: 85% (target: 70%)
- Functions: 100%
- Branches: 75% (missing: error paths in deleteSystem)

**Test Cases Created:**
- Unit tests: 12
- Edge cases: 5
- Error scenarios: 4

**Uncovered Code:**
- Lines 45-48: Error handling for connection timeout
  (Would require complex mocking, suggest integration test instead)

**Recommendations:**
- Add integration test for connection timeout scenario
- Consider adding E2E test for full API workflow
```

---

## Quality Criteria

✅ **Comprehensive Coverage**
- Achieves target percentage
- Tests happy path + edge cases + errors
- Clear test descriptions

✅ **Maintainable**
- Follows AAA pattern (Arrange, Act, Assert)
- Clear test names (describes what and expected outcome)
- Minimal test interdependencies

✅ **Fast Execution**
- Unit tests run in milliseconds
- Mocks external dependencies
- No unnecessary waits/sleeps

✅ **Focused**
- Tests behavior, not implementation
- One assertion per test (when possible)
- Clear failure messages

---

## TomeForge Testing Strategy

### Phase 0 Priorities

During Phase 0, focus on:
1. **Shared package**: 80% coverage (models, types, utilities)
2. **Backend services**: 70% coverage (business logic, data access)
3. **Critical paths**: 100% coverage (schema validation, query patterns)

### Test Types by Layer

**Unit Tests (60% of effort)**
- Service layer functions
- Data access layer functions
- Utility functions
- Mongoose schema validation

**Integration Tests (30% of effort)**
- API endpoints with database
- Request/response validation
- Error scenarios

**E2E Tests (10% of effort)**
- Critical user journeys (future)
- Full workflow testing (future)

### Mock Strategy

```
- Database connections: Always mock in unit tests
- External APIs: Always mock
- File system: Mock when possible
- Time/dates: Mock for deterministic tests
- Random data: Seed or mock
```

---

## Example Invocations

### Example 1: TDD Workflow

```
Use the test-generator subagent to write tests BEFORE implementation.

Spec: Character API endpoints (agent-os/specs/.../spec.md)

Generate tests for:
1. GET /api/characters (list all characters)
2. POST /api/characters (create character)
3. PUT /api/characters/:id (update character)
4. DELETE /api/characters/:id (delete character)

Framework: Jest + supertest for integration tests
Mock: Database (no real MongoDB connection)
Coverage target: 70%

Output: apps/backend/src/routes/character.test.ts
```

### Example 2: Increase Coverage

```
Use the test-generator subagent to increase test coverage.

Current coverage: 45% (packages/shared/src/models/system.ts)
Target coverage: 80%

Add tests for:
- Schema validation (required fields, enums, types)
- Nested schema structures (configuration.stats, rules.diceRolling)
- Edge cases (empty arrays, null values, invalid data types)

Framework: Vitest
Output: packages/shared/src/tests/system-model.test.ts
```

### Example 3: Regression Prevention

```
Use the test-generator subagent to create regression tests.

Previous bugs found by code-reviewer:
1. findByIdAndUpdate misuse (searching _id instead of systemId)
2. Missing error handling for invalid JSON in request body
3. No validation for systemId type (accepts strings, should reject)

Create tests that would have caught these bugs and prevent recurrence.
```

---

## Chaining with Other Agents

### TDD Workflow
```
1. spec-writer creates specification
2. test-generator writes tests from spec
3. Main agent implements code to pass tests
4. code-reviewer verifies implementation
```

### Post-Implementation Workflow
```
1. Main agent implements feature
2. test-generator adds comprehensive tests
3. code-reviewer checks test quality
4. test-generator adds missing test cases
```

---

## Success Metrics

- **Coverage targets**: Meeting 80%/70%/60% goals
- **Bug detection**: Tests catch issues before production
- **Execution speed**: Unit tests run in < 5 seconds
- **Maintenance**: Tests don't break with refactoring

---

## References

- Testing standards: `agent-os/standards/testing/test-writing.md`
- Coverage targets: `agent-os/product/roadmap.md` (Phase 0 items 8-12)
- Test examples: `agent-os/examples/tests/` (when created)

---

**Role Type:** Quality Assurance / Test Development
**Primary Output:** Test files with comprehensive coverage
**Typical Duration:** 10-30 minutes
**Context Budget:** ~2000-4000 tokens
