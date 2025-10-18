# Claude Code Subagent Roles

This directory contains specialized subagent role definitions for TomeForge development. Subagents are one of Claude Code's most powerful features, enabling **parallel work** and **quality isolation** through specialized AI agents.

## Why Subagents?

Research shows that multi-agent systems achieve **40% improvement in code quality** compared to single-agent approaches, primarily due to:

1. **Specialized Expertise**: Each agent focuses on one thing and does it well
2. **Context Preservation**: Agents operate with focused context windows (no token dilution)
3. **Parallel Execution**: Independent tasks run simultaneously
4. **Quality Isolation**: Each agent maintains high output quality through dedicated focus
5. **Adversarial Review**: Reviewer agents catch issues that generator agents miss

### When to Use Subagents

✅ **Do Use Subagents When:**
- Task is well-defined and self-contained
- You need specialized expertise (testing, reviewing, documentation)
- Multiple independent tasks can run in parallel
- You want adversarial verification (code review)
- Main agent's context is getting crowded

❌ **Don't Use Subagents When:**
- Task requires back-and-forth conversation
- You're still exploring/defining requirements
- Task is trivial (< 5 minutes of work)
- Subagent would need same context as main agent

## TomeForge Subagent Roles

### Core Roles

1. **[spec-writer](./spec-writer.md)** - Creates detailed specifications from requirements
   - **When**: Starting new features, documenting requirements
   - **Input**: Feature idea, user stories, constraints
   - **Output**: Comprehensive spec with acceptance criteria

2. **[code-reviewer](./code-reviewer.md)** - Adversarial quality assurance
   - **When**: After implementing features, before commits
   - **Input**: Recent code changes (git diff)
   - **Output**: Issues found, improvement suggestions

3. **[test-generator](./test-generator.md)** - Writes comprehensive test suites
   - **When**: TDD workflows, increasing coverage
   - **Input**: Specification or code to test
   - **Output**: Unit, integration, and E2E tests

4. **[db-migrator](./db-migrator.md)** - Handles database schema changes
   - **When**: Modifying Mongoose models, data migrations
   - **Input**: Schema changes, data transformation needs
   - **Output**: Migration scripts, rollback plans

5. **[doc-writer](./doc-writer.md)** - Updates documentation
   - **When**: After feature completion, API changes
   - **Input**: Code changes, new features
   - **Output**: Updated CLAUDE.md, JSDoc, ADRs

## How to Use Subagents in Claude Code

### Basic Invocation

In Claude Code, invoke a subagent using the Task tool:

```
I need to [task description]. Please use the [role-name] subagent to [specific instructions].
```

**Example:**
```
I need to create a comprehensive test suite for the System API.
Please use the test-generator subagent to write unit tests for
all endpoints in apps/backend/src/routes/system.ts.
```

### Providing Context

Give subagents ONLY the context they need:

**Good:**
```
Use the code-reviewer subagent to review the changes in git diff.
Focus on:
- Standards compliance (agent-os/standards/)
- Schema complexity (technical-constraints.md)
- Error handling patterns
```

**Bad (Too Much Context):**
```
Use the code-reviewer subagent. Here's the entire codebase structure,
all our standards, the full product roadmap, and every file we've
ever written...
```

### Context Isolation Strategy

Each subagent should receive:
- **Role definition** (from this folder)
- **Specific task** (what to do)
- **Relevant standards** (from `agent-os/standards/_summaries/`)
- **Input data** (spec, code diff, model changes)

**NOT:**
- Full codebase
- Entire conversation history
- Unrelated project context

## Subagent Chaining Patterns

See `agent-os/workflows/` for detailed chaining patterns. Quick reference:

### Feature Development Chain
```
1. spec-writer → Creates detailed specification
2. test-generator → Writes tests from spec (TDD)
3. [main agent] → Implements feature to pass tests
4. code-reviewer → Adversarial review
5. doc-writer → Updates documentation
```

### Bug Fix Chain
```
1. [main agent] → Investigates and fixes bug
2. test-generator → Writes regression tests
3. code-reviewer → Verifies fix quality
```

### Refactoring Chain
```
1. [main agent] → Plans refactoring
2. [main agent] → Implements refactoring
3. test-generator → Ensures test coverage
4. code-reviewer → Verifies no regressions
```

### Schema Migration Chain
```
1. db-migrator → Creates migration scripts
2. test-generator → Writes migration tests
3. code-reviewer → Reviews migration safety
4. doc-writer → Updates schema documentation
```

## Parallel Execution

Run subagents in parallel for independent tasks:

```
Please run these tasks in parallel:
1. test-generator: Write tests for System API
2. doc-writer: Update API documentation
3. code-reviewer: Review Character model changes
```

Claude Code will execute all three simultaneously, saving time.

## Best Practices

### 1. One Task, One Subagent
Don't ask a subagent to do multiple unrelated things. Launch multiple subagents instead.

**Good:**
```
- test-generator: Write System API tests
- test-generator: Write Character API tests (separate invocation)
```

**Bad:**
```
- test-generator: Write tests for System API, Character API, and frontend components
```

### 2. Clear, Specific Instructions
Be explicit about what you want.

**Good:**
```
Use code-reviewer to review apps/backend/src/routes/system.ts for:
- Proper error handling (agent-os/standards/global/error-handling.md)
- Input validation (agent-os/standards/global/validation.md)
- HTTP status codes (agent-os/standards/backend/api.md)
```

**Bad:**
```
Use code-reviewer to check if the code is good.
```

### 3. Provide Success Criteria
Tell subagents what "done" looks like.

**Good:**
```
Use test-generator to achieve 80% code coverage for the shared package
with unit tests for System and Character models.
```

**Bad:**
```
Use test-generator to write some tests.
```

### 4. Reference Standards
Point subagents to relevant standards.

**Good:**
```
Use spec-writer to create a spec following the template in
agent-os/specs/2025-10-17-api-documentation-setup/spec.md
```

**Bad:**
```
Use spec-writer to create a spec (subagent doesn't know your format)
```

### 5. Sequential for Dependencies, Parallel for Independence

**Sequential (dependencies):**
```
1. spec-writer creates spec
2. WAIT for completion
3. test-generator writes tests from spec
```

**Parallel (independent):**
```
Simultaneously:
- test-generator writes backend tests
- test-generator writes frontend tests
- doc-writer updates documentation
```

## Expected Output Quality

Well-designed subagent usage should deliver:

### ✅ High Quality Output
- Spec-writer: Comprehensive specs with acceptance criteria
- Test-generator: 80%+ coverage with edge cases
- Code-reviewer: Catches 90%+ of standards violations
- Db-migrator: Safe migrations with rollback plans
- Doc-writer: Complete, accurate documentation

### ✅ Faster Development
- Parallel subagents save 30-50% time on independent tasks
- Focused context = faster execution per task

### ✅ Better Code Quality
- Adversarial code-reviewer catches issues main agent misses
- Test-generator ensures comprehensive coverage
- Spec-writer forces clear requirements before coding

## Common Patterns by Phase

### Phase 0: Infrastructure Development
```
Primary agents: code-reviewer, test-generator, doc-writer
Workflow: Implement → Test → Review → Document
```

### Phase 1: Core Features
```
Primary agents: spec-writer, test-generator, code-reviewer
Workflow: Spec → Test → Implement → Review
```

### Phase 2+: Complex Features
```
All agents: spec-writer → test-generator → [implement] → code-reviewer → doc-writer
```

## Troubleshooting

### Problem: Subagent doesn't have enough context
**Solution:** Provide specific file paths and standards references

### Problem: Subagent is doing too much
**Solution:** Break into multiple subagent invocations

### Problem: Subagent output conflicts with main agent
**Solution:** Main agent should review subagent output before accepting

### Problem: Taking too long
**Solution:** Run independent subagents in parallel

### Problem: Subagent missed important constraints
**Solution:** Explicitly reference standards and technical-constraints.md

## Measuring Success

Track these metrics to evaluate subagent effectiveness:

- **Code quality**: Are code-reviewer findings decreasing over time?
- **Test coverage**: Is test-generator hitting 80%+ coverage targets?
- **Time savings**: Are parallel subagents reducing implementation time?
- **Spec quality**: Are spec-writer outputs clear and actionable?
- **Documentation accuracy**: Is doc-writer keeping docs in sync?

## Resources

- [Claude Code Subagents Documentation](https://docs.claude.com/en/docs/claude-code/sub-agents)
- [Subagent Best Practices](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/)
- Research: Multi-agent systems show 40% quality improvement (from perplexity research)

---

**Last Updated:** 2025-10-18
**Total Roles Defined:** 5
