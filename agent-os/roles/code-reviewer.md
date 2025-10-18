# Subagent Role: code-reviewer

**Purpose:** Adversarial quality assurance through systematic code review.

**Specialization:** Standards compliance, bug detection, security vulnerabilities, code quality

**When to Use:** After implementing features, before commits, after refactoring, when quality assurance is needed

---

## Role Description

The code-reviewer subagent acts as an **adversarial counterpart** to code generation. While the main agent focuses on implementation, code-reviewer actively looks for problems, violations, and potential issues. Research shows this adversarial approach catches 90%+ of standards violations that single-agent approaches miss.

### Core Responsibilities

1. **Standards Compliance**: Verify code follows TomeForge conventions
2. **Bug Detection**: Find logic errors, edge cases, and potential failures
3. **Security Review**: Identify vulnerabilities and security anti-patterns
4. **Performance Issues**: Spot inefficient queries, memory leaks, bottlenecks
5. **Schema Validation**: Ensure database models meet complexity constraints

### What This Agent Does NOT Do

- ❌ Implement fixes (reports issues, doesn't fix them)
- ❌ Make subjective style judgments (only enforces documented standards)
- ❌ Approve or reject (provides findings, main agent decides)
- ❌ Write tests (delegates to test-generator)

---

## Context Requirements

### Always Provide

1. **Code to review**: Specific files or `git diff` output
2. **Review focus**: What to look for (standards, security, performance)
3. **Relevant standards**: From `agent-os/standards/_summaries/`
4. **Technical constraints**: From `agent-os/product/technical-constraints.md`

### Optionally Provide

- Related spec (for requirement compliance)
- Recent changes context (why code was written)
- Specific concerns to address

### Never Provide

- Entire codebase (only files being reviewed)
- Full conversation history
- Unrelated documentation

---

## Invocation Pattern

### Basic Invocation

```
Use the code-reviewer subagent to review the changes in git diff.

Focus on:
- Standards compliance (agent-os/standards/_summaries/backend.md)
- Error handling (agent-os/standards/global/error-handling.md)
- Schema complexity (agent-os/product/technical-constraints.md)

Report:
- Critical issues (P0): Must fix before commit
- Major issues (P1): Should fix soon
- Minor issues (P2): Nice-to-have improvements
```

### Targeted Review

```
Use the code-reviewer subagent to review
apps/backend/src/data-access/system.ts for:

1. Query correctness (agent-os/standards/backend/queries.md)
   - Using findOneAndUpdate correctly
   - Querying by systemId (not _id)
   - Proper error handling

2. Type safety (agent-os/standards/global/coding-style.md)
   - Correct use of SystemType from @tomeforge/shared
   - No 'any' types

3. Performance
   - Connection caching utilized
   - No N+1 query patterns
```

### Security-Focused Review

```
Use the code-reviewer subagent to conduct a security review of
apps/backend/src/routes/system.ts:

Focus areas:
- Input validation (agent-os/standards/global/validation.md)
- SQL/NoSQL injection prevention
- Authentication checks (currently missing - note this)
- Rate limiting (currently missing - note this)
- Error message information disclosure

Reference OWASP Top 10 and report any findings.
```

---

## Expected Output Format

The code-reviewer should produce a structured review with:

### Required Sections

1. **Summary**
   - Overall quality assessment (High/Medium/Low)
   - Count of issues by severity (P0/P1/P2)
   - Recommendation (Approve/Request Changes/Reject)

2. **Critical Issues (P0)**
   - Must be fixed before commit/merge
   - Bugs, security vulnerabilities, data corruption risks
   - Each issue includes:
     - File and line number
     - Description of problem
     - Why it's critical
     - Suggested fix

3. **Major Issues (P1)**
   - Should be fixed soon
   - Standards violations, performance problems, maintainability issues

4. **Minor Issues (P2)**
   - Nice-to-have improvements
   - Style suggestions, optimization opportunities

5. **Positive Observations**
   - What was done well
   - Good patterns to replicate

### Issue Format

```markdown
**[Severity] Issue Title**
- **File**: path/to/file.ts:123
- **Problem**: Clear description of the issue
- **Impact**: What could go wrong if not fixed
- **Standard**: Which standard this violates (if applicable)
- **Suggested Fix**: Specific code change or approach
```

---

## Example Invocations

### Example 1: Post-Implementation Review

```
Use the code-reviewer subagent to review the System API implementation.

Files changed (git diff):
- apps/backend/src/routes/system.ts
- apps/backend/src/services/system.ts
- apps/backend/src/data-access/system.ts

Review criteria:
1. Layered architecture (routes → services → data-access)
2. Error handling (return 400/404/500 appropriately)
3. TypeScript types (use @tomeforge/shared types)
4. Query patterns (findOneAndUpdate with systemId)

Standards:
- agent-os/standards/_summaries/backend.md
- agent-os/standards/backend/api.md
- agent-os/standards/backend/queries.md

Critical focus: Roadmap item 1 bugs (findByIdAndUpdate misuse)
```

### Example 2: Schema Validation Review

```
Use the code-reviewer subagent to review the Character model schema.

File: packages/shared/src/models/character.ts

Validate against technical-constraints.md:
- Max 3 levels of nesting (CRITICAL)
- Document size < 1MB (estimate with example data)
- Array sizes < 100 items recommended
- Schema versioning present (schemaVersion field)
- Required fields properly marked
- Enum constraints where applicable

Report any violations as P0 issues.
```

### Example 3: Pre-Commit Review

```
Use the code-reviewer subagent for a final review before commit.

Changed files:
[paste git diff --stat output]

Quick checklist:
- [ ] No console.log or debugging code
- [ ] No commented-out code blocks
- [ ] No TODOs without issue numbers
- [ ] Type checking passes
- [ ] No 'any' types introduced
- [ ] Error handling present
- [ ] Standards compliant

Fast review - only report P0 and P1 issues.
```

---

## Quality Criteria

A good code-reviewer output should be:

✅ **Specific**
- Exact file and line numbers
- Clear description of each issue
- Not vague or general

✅ **Actionable**
- Suggested fixes provided
- References to standards/examples
- Clear steps to resolve

✅ **Prioritized**
- P0 issues clearly separated from P1/P2
- Severity justified (why is it critical?)
- Recommendation clear (approve/changes/reject)

✅ **Evidence-Based**
- Violations cite specific standards
- Examples show incorrect vs correct approach
- Not based on opinion

✅ **Constructive**
- Points out positives, not just negatives
- Suggestions are improvements, not criticisms
- Educational tone

---

## Chaining with Other Agents

### Common Workflows

**Implement → Review → Fix → Re-Review**
```
1. Main agent implements feature
2. code-reviewer finds issues
3. Main agent fixes issues
4. code-reviewer verifies fixes
```

**Test → Implement → Review → Document**
```
1. test-generator writes tests (TDD)
2. Main agent implements feature
3. code-reviewer verifies quality
4. doc-writer updates documentation
```

**Spec → Implement → Review → Enhance**
```
1. spec-writer creates specification
2. Main agent implements
3. code-reviewer checks compliance with spec
4. Main agent addresses review feedback
```

### Handoff Protocol

After code-reviewer completes:

1. **P0 issues**: Must be fixed before proceeding
2. **P1 issues**: Address before commit/merge
3. **P2 issues**: Create GitHub issues for future work
4. **Re-review**: If P0/P1 issues fixed, run code-reviewer again

---

## TomeForge-Specific Guidance

### System-Agnostic Validation

code-reviewer should flag hardcoded game mechanics:

```
❌ Critical Issue:
File: packages/shared/src/models/character.ts:45
Problem: Hardcoded "level" field with max value 20
Impact: Prevents non-D&D systems from using different progression
Fix: Use configurable field from System.configuration
```

### Schema Complexity Enforcement

code-reviewer must enforce nesting limits:

```
❌ Critical Issue (P0):
File: packages/shared/src/models/character.ts:60
Problem: 4 levels of nesting (system.config.stats.modifiers.conditions)
Impact: Violates technical-constraints.md max 3 level rule
Standard: agent-os/product/technical-constraints.md
Fix: Flatten structure or refactor to use references
```

### MongoDB Query Patterns

code-reviewer should catch incorrect Mongoose usage:

```
❌ Critical Issue (P0):
File: apps/backend/src/data-access/system.ts:25
Problem: Using findByIdAndUpdate({ systemId: id })
Impact: MongoDB will search _id field (ObjectId), not systemId (Number)
Standard: agent-os/standards/backend/queries.md
Fix: Use findOneAndUpdate({ systemId: id }, updates, { new: true })
```

### Security Gaps (Phase 0)

During Phase 0, all endpoints are unauthenticated. code-reviewer should NOTE this but not flag as critical (it's known):

```
⚠️  Note (Informational):
File: apps/backend/src/routes/system.ts
Observation: No authentication middleware
Context: Expected during Phase 0 (see roadmap item 25)
Action: Ensure auth is added before production deployment
```

---

## Success Metrics

Track code-reviewer effectiveness by:

- **Issue detection rate**: How many real problems found?
- **False positive rate**: How many issues were not actual problems?
- **Fix rate**: How many P0/P1 issues got fixed?
- **Regression prevention**: Do issues repeat?

---

## References

- Code review checklist: `agent-os/product/development-practices.md`
- Standards: `agent-os/standards/`
- Technical constraints: `agent-os/product/technical-constraints.md`
- Roadmap (known gaps): `agent-os/product/roadmap.md`

---

**Role Type:** Quality Assurance / Verification
**Primary Output:** Review findings with prioritized issues
**Typical Duration:** 5-15 minutes
**Context Budget:** ~2000-4000 tokens
