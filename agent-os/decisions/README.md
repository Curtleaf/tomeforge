# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for TomeForge. ADRs document significant architectural and technical decisions made throughout the project's lifecycle.

## Purpose

ADRs serve as the project's "architectural memory," helping developers (both human and AI) understand:

- **Why** certain technical choices were made
- **What** alternatives were considered
- **What** trade-offs were accepted
- **How** decisions impact the codebase

This is especially valuable for:
- Solo developers returning after breaks
- New contributors onboarding
- AI assistants (like Claude Code) understanding context
- Future refactoring decisions

## What Warrants an ADR?

Create an ADR for decisions that:

✅ **Do Record:**
- Technology stack choices (database, framework, libraries)
- Architectural patterns (monorepo, layered architecture, microservices)
- Infrastructure decisions (Docker, deployment, CI/CD)
- Data modeling approaches (schema design, validation strategy)
- Security and authentication approaches
- Performance optimization strategies
- API design patterns
- Testing strategies

❌ **Don't Record:**
- Minor code style preferences (covered by linters)
- Routine bug fixes
- Simple feature implementations
- Temporary workarounds (unless they become permanent)

**Rule of Thumb:** If the decision will affect multiple developers or persist for >6 months, write an ADR.

## ADR Numbering Convention

ADRs are numbered sequentially starting from 001:

```
000-template.md          # Template for creating new ADRs
001-mongodb-over-postgresql.md
002-pnpm-monorepo.md
003-docker-local-development.md
004-[your-next-decision].md
```

**Naming Format:** `NNN-short-title-kebab-case.md`

## How to Create an ADR

### Step 1: Copy the Template
```bash
cp agent-os/decisions/000-template.md agent-os/decisions/00X-your-decision.md
```

### Step 2: Fill Out Sections

**Required Sections:**
1. **Context** - What problem are we solving? Why now?
2. **Decision** - What did we decide? Be specific.
3. **Alternatives Considered** - What else did we evaluate?
4. **Consequences** - Positive/negative outcomes and trade-offs

**Optional Sections:**
- **Implementation Notes** - Files affected, dependencies
- **References** - Links to docs, research, discussions

### Step 3: Update Metadata
- Set **Status** (Proposed → Accepted)
- Add **Date** (YYYY-MM-DD)
- List **Deciders**
- Add relevant **Tags**

### Step 4: Link Related ADRs
If this decision supersedes or relates to other ADRs, update the metadata section.

## ADR Lifecycle

### Status Values

- **Proposed**: Decision is under consideration
- **Accepted**: Decision has been approved and is active
- **Deprecated**: Decision is no longer recommended but may still be in use
- **Superseded**: Decision has been replaced by a newer ADR (link to replacement)

### Updating ADRs

**Never delete or edit historical ADRs.** Instead:

1. **If decision changes:**
   - Create new ADR with updated decision
   - Mark old ADR as "Superseded by: ADR-XXX"
   - Mark new ADR as "Supersedes: ADR-XXX"

2. **If decision is reversed:**
   - Create new ADR explaining reversal
   - Update old ADR status to "Deprecated"

3. **If adding context:**
   - Add note at bottom: "**Update YYYY-MM-DD:** [Additional context]"

## Using ADRs Effectively

### For Development Work
Before making a significant technical decision:
1. Check if an ADR already exists for similar decisions
2. Review related ADRs to understand constraints
3. Draft new ADR if decision is significant
4. Discuss with team/stakeholders if applicable

### For AI Assistants (Claude Code)
When working on TomeForge:
1. **Read relevant ADRs** before suggesting architectural changes
2. **Reference ADRs** when explaining why certain patterns exist
3. **Suggest new ADRs** when encountering undocumented significant decisions
4. **Update cross-references** when creating related features

### For Code Reviews
Reviewers should:
- Check if significant decisions align with existing ADRs
- Request ADR creation if new architectural patterns introduced
- Verify ADR references are updated when decisions change

## Quick Reference Index

### By Category

**Database & Data**
- [ADR-001: MongoDB over PostgreSQL](./001-mongodb-over-postgresql.md)

**Project Structure**
- [ADR-002: pnpm Monorepo Structure](./002-pnpm-monorepo.md)

**Infrastructure**
- [ADR-003: Docker for Local Development](./003-docker-local-development.md)

**Frontend**
- (No ADRs yet - React/Vite was default choice)

**Backend**
- (No ADRs yet - Express was default choice)

**Testing**
- (No ADRs yet - Covered in roadmap Phase 0)

### By Date
- 2025-10-18: [ADR-003: Docker for Local Development](./003-docker-local-development.md)
- 2025-10-18: [ADR-002: pnpm Monorepo Structure](./002-pnpm-monorepo.md)
- 2025-10-18: [ADR-001: MongoDB over PostgreSQL](./001-mongodb-over-postgresql.md)

### By Status
**Accepted:** ADR-001, ADR-002, ADR-003

**Proposed:** (None)

**Deprecated:** (None)

**Superseded:** (None)

## Tips for Writing Good ADRs

### Keep It Concise
- Aim for 1-2 pages max
- Be specific, avoid vague statements
- Focus on the "why" not the "how"

### Make It Searchable
- Use clear, descriptive titles
- Add relevant tags
- Include keywords in context section

### Think Long-Term
- Write for someone reading 2 years from now
- Assume reader doesn't remember the context
- Explain acronyms and project-specific terms

### Show Your Work
- List concrete alternatives with pros/cons
- Explain rejection reasons specifically
- Include trade-offs honestly

### Link Everything
- Reference related ADRs
- Link to external documentation
- Include GitHub issues/PRs if applicable

## Examples from Other Projects

For inspiration, see:
- [Arachne Framework ADRs](https://github.com/arachne-framework/architecture)
- [GOV.UK ADRs](https://github.com/alphagov/govuk-aws/tree/master/doc/architecture/decisions)
- [Spotify Web API ADRs](https://github.com/spotify/web-api/tree/master/adr)

## FAQs

### Q: Do I need an ADR for every technical choice?
**A:** No. Only for significant decisions that affect architecture, team workflow, or long-term maintenance.

### Q: Can I update an old ADR?
**A:** Only to add clarifying notes. Never change the original decision. Create a new ADR to supersede if decision changes.

### Q: Who approves ADRs?
**A:** For TomeForge (solo project), the project owner approves. For team projects, define an approval process.

### Q: Should ADRs include code?
**A:** Minimal code snippets are fine to illustrate points, but keep it brief. Link to actual implementation files instead.

### Q: What if I disagree with an ADR?
**A:** Propose a new ADR to supersede it, explaining why the decision should change based on new information.

## Resources

- [ADR GitHub Organization](https://adr.github.io/)
- [Documenting Architecture Decisions by Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR Tools](https://github.com/npryce/adr-tools) - Command-line tools for managing ADRs

---

**Last Updated:** 2025-10-18
**Total ADRs:** 3 (+ template)
