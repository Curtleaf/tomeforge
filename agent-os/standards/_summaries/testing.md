# Testing Standards Summary

**Quick Reference** - Read this first (~100 tokens), load full standards only when writing tests.

## Philosophy
- **Minimal During Development**: Complete feature first, add strategic tests at logical completion points
- **Core User Flows Only**: Test critical paths and primary workflows
- **Defer Edge Cases**: Don't test edge cases/error states unless business-critical
- **Behavior Over Implementation**: Test what code does, not how it does it

## Testing Strategy (From Roadmap)
- **Unit Tests**: 60% of test effort - Individual functions and components
- **Integration Tests**: 30% of test effort - API endpoints with database
- **E2E Tests**: 10% of test effort - Critical user journeys

## Coverage Targets
- **Shared Package**: 80% minimum (Mongoose models, types)
- **Backend Services**: 70% minimum (business logic, data-access)
- **Frontend Components**: 60% minimum
- **Critical Paths**: 100% (auth, validation, character creation)

## Frameworks (From Roadmap - Not Yet Implemented)
- **Vitest**: Unit tests for shared package and backend
- **Jest**: Integration tests for backend API endpoints
- **React Testing Library**: Frontend component tests
- **Playwright**: E2E tests for critical user journeys

## Best Practices
- **Clear Names**: Descriptive test names explaining what and expected outcome
- **Mock External**: Isolate units by mocking databases, APIs, file systems
- **Fast Execution**: Unit tests should run in milliseconds

## Test Locations
- **Shared**: `packages/shared/src/tests/`
- **Backend**: `apps/backend/src/tests/`
- **Frontend**: `apps/frontend/src/` (co-located with components)

## Current Status (Phase 0)
- **Coverage**: 0% (testing infrastructure not yet set up)
- **Priority Tasks**:
  - Configure Vitest (Roadmap item 8)
  - Add integration tests (Roadmap item 9)
  - Set up coverage reporting (Roadmap item 12)

---

**For full details, see:**
- `agent-os/standards/testing/test-writing.md` (~200 tokens)
- `agent-os/product/roadmap.md` (Phase 0 testing items)
- `agent-os/product/development-practices.md` (testing requirements section)
