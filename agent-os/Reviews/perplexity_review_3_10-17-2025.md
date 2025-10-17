# Best Practices for `.gitignore` and AI Coding Assistants (TomeForge Project)

## Key Takeaways

For your TomeForge monorepo working with Claude Code, you should maintain **three separate ignore configurations**:

1. **`.gitignore`** at repo root - Controls version control
2. **`.claudeignore`** at repo root - Controls Claude Code file access (overrides `.gitignore`)
3. **`~/.claude/settings.json`** - Global security rules across all projects

This layered approach gives you maximum flexibility: keep sensitive files out of git while allowing Claude Code to access local development notes, and enforce global security boundaries to prevent accidental secret exposure.

***

## The Problem: Git vs. AI Assistant Access

### Default Behavior

Claude Code respects `.gitignore` by default, which creates friction for local development workflows:[1][2]

- **Files in `.gitignore`** don't appear in `@`-mention autocomplete
- **Local development files** (notes, TODOs, coverage reports) become inaccessible to AI
- **You can't reference gitignored files** without typing full paths manually

### The Solution: `.claudeignore`

A separate `.claudeignore` file gives you independent control over what Claude Code can access, separate from version control decisions.[2][1]

***

## Recommended Setup for TomeForge

### 1. Root `.gitignore` (Version Control)

Place this at the **root of your monorepo** to exclude files from git:

```gitignore
# TomeForge .gitignore - Comprehensive Monorepo Template

# ============================================
# DEPENDENCIES
# ============================================
node_modules/
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# ============================================
# BUILD OUTPUTS
# ============================================
dist/
build/
*.tsbuildinfo
.cache/
.parcel-cache/

# ============================================
# ENVIRONMENT & SECRETS
# ============================================
.env
.env.*
!.env.example
!.env.template
*.pem
*.key
*.p12
*.pfx
credentials/
secrets/

# ============================================
# LOGS & DEBUGGING
# ============================================
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# ============================================
# IDE & EDITOR FILES
# ============================================
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/*.code-snippets
.idea/
*.swp
*.swo
*~
.DS_Store
Thumbs.db

# ============================================
# TESTING & COVERAGE
# ============================================
coverage/
.nyc_output/
*.lcov
test-results/
playwright-report/

# ============================================
# TEMPORARY & SYSTEM FILES
# ============================================
*.tmp
*.temp
.temp/
.tmp/

# ============================================
# DATABASE & LOCAL DATA
# ============================================
*.sqlite
*.db
data/
uploads/

# ============================================
# DOCKER
# ============================================
docker-compose.override.yml

# ============================================
# MONOREPO SPECIFIC
# ============================================
.turbo/
.pnpm-store/

# ============================================
# LOCAL DEVELOPMENT (keep out of git)
# ============================================
# Personal notes and TODOs
tasks/
NOTES.md
*_TODO.md
scratch/

# Local testing data
fixtures/local/
```

**Key Points for Monorepos**:[3][4][5]
- **Single `.gitignore` at root** is standard practice for pnpm workspaces
- Avoids confusion from hidden `.gitignore` files in subdirectories
- Works consistently across all workspace packages (`apps/*`, `packages/*`)
- IDE tools can find and respect it easily

***

### 2. Root `.claudeignore` (AI Assistant Access)

Place this at the **root of your monorepo** to control Claude Code file visibility:

```gitignore
# TomeForge .claudeignore
# Controls what Claude Code can access
# Use this to override .gitignore for local development files

# ============================================
# ALLOW LOCAL DEVELOPMENT FILES (override gitignore)
# ============================================
# Make these visible to Claude Code despite being gitignored:
!tasks/
!NOTES.md
!*_TODO.md
!.vscode/settings.json
!coverage/
!docs/local/

# ============================================
# ADDITIONAL EXCLUSIONS (even if not in .gitignore)
# ============================================
# Block from Claude Code even if tracked by git:
*.log
temp/
scratch/
fixtures/

# ============================================
# SECURITY - NEVER EXPOSE TO AI
# ============================================
# These patterns are handled by global settings (see below)
# but included here for project-specific documentation:
.env*
!.env.example
*.pem
*.key
credentials/
secrets/
.aws/
.ssh/
docker-compose.yml
**/database.yml
```

**How It Works**:[1]
- **Negation patterns** (`!tasks/`) override `.gitignore` exclusions
- **Claude Code sees** the file in autocomplete and can reference it
- **Git still ignores** the file (version control unaffected)
- **Perfect for** project notes, TODOs, local configs, coverage reports

***

### 3. Global `~/.claude/settings.json` (Security Boundaries)

This is the **most important security layer**. Create or edit `~/.claude/settings.json` in your home directory:

```json
{
  "iamPolicy": {
    "read": [
      "**/.env*",
      "!**/.env.example",
      "**/*.pem",
      "**/*.key",
      "**/secrets/**",
      "**/credentials/**",
      "**/.aws/**",
      "**/.ssh/**",
      "**/docker-compose.yml",
      "**/database.yml",
      "**/*.p12",
      "**/*.pfx"
    ]
  }
}
```

**Why This Matters**:[2]
- **Applies across all projects** you work on with Claude Code
- **Prevents accidental exposure** of secrets even if you forget project-specific rules
- **Defense in depth** - even if `.claudeignore` is misconfigured, this catches it
- **Compatible with gitignore syntax** (glob patterns)

**Security Rationale**: Your `.env` files, SSH keys, and credentials should **never** be sent to an LLM, even by accident.[6][2]

***

## Best Practices for TomeForge Specifically

### Monorepo Considerations

**Single Root-Level Files**:[7][3]
- **Recommended**: One `.gitignore` and one `.claudeignore` at repo root
- **Avoid**: Multiple ignore files scattered in `apps/` and `packages/` subdirectories
- **Reason**: Easy to discover, maintain, and ensures consistency across workspace

**pnpm Workspace Structure**:[4][5][3]
```
tomeforge/
├── .gitignore              # ✅ Single source of truth
├── .claudeignore           # ✅ AI assistant control
├── pnpm-workspace.yaml
├── package.json
├── apps/
│   ├── backend/
│   └── frontend/
└── packages/
    └── shared/
```

### Files to Keep Out of Git (but Allow Claude Code)

Based on your side project workflow:[8][1][2]

**Project Notes & Planning**:
```gitignore
# In .gitignore:
tasks/
NOTES.md
*_TODO.md
.claude/
docs/local/

# In .claudeignore:
!tasks/           # Allow Claude to see your task lists
!NOTES.md         # Allow Claude to see project notes
!*_TODO.md        # Allow Claude to see todos
!docs/local/      # Allow Claude to see local docs
```

**Testing & Coverage**:
```gitignore
# In .gitignore:
coverage/
test-results/
playwright-report/

# In .claudeignore:
!coverage/        # Let Claude analyze coverage reports
!test-results/    # Let Claude see test results
```

**Local Configuration**:
```gitignore
# In .gitignore:
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json

# In .claudeignore:
!.vscode/settings.json    # Let Claude see workspace settings
```

### Files to Block from Both Git and Claude Code

**Secrets & Credentials** (enforced at all three levels):
```gitignore
.env*
!.env.example
*.pem
*.key
credentials/
secrets/
.aws/
.ssh/
docker-compose.yml         # May contain passwords
**/database.yml            # May contain connection strings
```

**Build Artifacts**:
```gitignore
node_modules/
dist/
build/
*.tsbuildinfo
.cache/
```

**Logs & Temporary Files**:
```gitignore
*.log
*.tmp
.temp/
uploads/                   # User-uploaded files
```

***

## Working with Friends & Open Source Contributors

### Documentation in README

Add this section to your project README:[8][1]

```markdown
## Working with AI Assistants (Claude Code)

This project uses `.claudeignore` to control AI assistant file access:

- **Local development files** (tasks/, NOTES.md, etc.) are gitignored but visible to Claude Code
- **Never commit** these files - they're for your local workflow only
- **Security**: Global settings prevent Claude from accessing secrets (see `~/.claude/settings.json`)

### Setup for Contributors

1. Copy `.env.example` to `.env` and fill in your values
2. Create a `tasks/` folder for personal notes (gitignored, Claude-visible)
3. Configure global Claude security settings (see docs/SECURITY.md)
```

### Add to Your `development-practices.md`

Create a new section:

```markdown
## Working with AI Assistants

### File Access Control

- **`.gitignore`**: Controls version control (what goes in repo)
- **`.claudeignore`**: Controls AI assistant access (what Claude sees)
- **`~/.claude/settings.json`**: Global security boundaries (never send secrets)

### Local Development Files

You can keep personal notes and TODOs without cluttering git:

- `tasks/` - Personal task lists and project notes
- `NOTES.md` - Scratchpad for ideas and context
- `*_TODO.md` - File-specific TODOs
- `coverage/` - Test coverage reports for Claude to analyze

These are gitignored but visible to Claude Code for better context.

### Security Requirements

All contributors must configure global security settings to prevent accidental secret exposure. See [SECURITY.md](./SECURITY.md) for setup instructions.
```

***

## Advanced Patterns for Sporadic Development

### Context Preservation Between Sessions

When you drop and pick up the project:[1][8]

**Create a `CONTEXT.md` (tracked in git)**:
```markdown
# Current Context

## What I'm Working On
[Update this when you stop working]

## Next Steps
1. ...
2. ...

## Important Decisions
- Date: Decision made about X
- Rationale: ...
```

**Create a `tasks/CURRENT_SESSION.md` (gitignored, Claude-visible)**:
```markdown
# Session Notes - 2025-10-17

## Today's Goals
- Implement authentication with Passport.js
- Add JWT token generation

## Blockers
- Need to decide on token expiry time
- Waiting on MongoDB Atlas cluster setup

## Questions for Claude
- Best practices for refresh tokens in Express?
- How to structure user model with roles?
```

This pattern gives you:
- **Public context** (`CONTEXT.md`) for contributors
- **Private notes** (`tasks/`) for personal workflow
- **Claude can reference both** when you resume work

### Smart `.claudeignore` for Different Phases

Adjust what Claude sees based on development phase:

**Phase 1 (Foundation - Current)**:
```gitignore
# Let Claude see everything relevant:
!coverage/
!test-results/
!tasks/
!NOTES.md
```

**Phase 2+ (Production)**:
```gitignore
# Restrict Claude from production data:
fixtures/production/
backups/
user-uploads/
```

***

## Workflow Tips for Claude Code

### Effective `@`-Mentions with `.claudeignore`

**Before** (without `.claudeignore`):
```
User: "Check my project notes"
Claude: "I don't see any NOTES.md file"
User: [types full path] "@/Users/you/project/NOTES.md"
```

**After** (with `.claudeignore` negation):
```
User: "Check my @NOTES.md"
Claude: [Autocompletes and reads file]
```

### Reference Coverage Reports

**Common workflow**:[1]
1. Run `pnpm test:coverage`
2. Coverage generated to `coverage/` (gitignored)
3. Ask Claude: "Analyze my @coverage/lcov-report/index.html and suggest untested areas"
4. Claude reads it and provides actionable feedback

Without `.claudeignore` negation, you'd have to temporarily remove `coverage/` from `.gitignore`.[1]

### Project-Specific Instructions

Create `.claude.md` (tracked in git) with AI assistant rules:[2]

```markdown
# Claude Code Instructions for TomeForge

## Security Guidelines
- NEVER read or process `.env` files
- STOP immediately if you encounter API keys or passwords
- Respect all `.claudeignore` entries without exception

## Project Conventions
- TypeScript strict mode required
- Mongoose models in `packages/shared/src/models`
- API routes follow REST standards (see `docs/api.md`)
- Test before implementing complex features

## Preferred Patterns
- Use `async/await` for all database operations
- Validate at API boundaries using Mongoose schemas
- Export TypeScript types using `InferSchemaType`
- Keep functions small and focused

## When Making Changes
1. Check existing patterns in codebase first
2. Update shared types if modifying models
3. Run `pnpm build` after changes to `packages/shared`
4. Update documentation in parallel with code
```

This gives Claude consistent instructions across sessions.[9][10]

***

## Troubleshooting Common Issues

### Issue: Claude Can't See Gitignored File

**Symptoms**: `@`-mention doesn't autocomplete for file in `.gitignore`

**Solution**:
1. Add negation pattern to `.claudeignore`: `!filename.md`
2. Restart Claude Code / reload window
3. Try `@`-mention again

### Issue: Claude Reads `.env` File

**Symptoms**: Claude Code suggests changes involving environment variables from `.env`

**Solution**:[2]
1. Configure `~/.claude/settings.json` with security rules (see above)
2. Add `.env*` to `.claudeignore`
3. Verify with: "Can you see my @.env file?" (should say no)

### Issue: Multiple Contributors Have Different Local Files

**Symptoms**: Merge conflicts on gitignored files, or confusion about what exists

**Solution**:
- Document local file structure in `CONTRIBUTING.md`
- Provide templates (`.env.example`, `tasks/TEMPLATE.md`)
- Use `!` negation for shared local files everyone should have

### Issue: Subdirectory `.gitignore` Conflicts

**Symptoms**: Files ignored in `apps/backend/.gitignore` but not root `.gitignore`

**Solution**:[7]
- **Remove subdirectory `.gitignore` files** (except `apps/frontend/.gitignore` from create-react-app)
- **Consolidate to root** `.gitignore`
- **Prefix patterns** if needed: `apps/backend/temp/` instead of `temp/`

***

## Recommended File Structure

```
tomeforge/
├── .gitignore                    # ✅ Root-level git control
├── .claudeignore                 # ✅ Root-level Claude control
├── .claude.md                    # ✅ Instructions for Claude Code
├── .env.example                  # ✅ Tracked template
├── .env                          # ❌ Gitignored, blocked from Claude
├── pnpm-workspace.yaml
├── package.json
├── README.md
├── CONTRIBUTING.md
├── docs/
│   ├── SECURITY.md               # Setup instructions for contributors
│   └── ...
├── tasks/                        # ❌ Gitignored, ✅ Claude-visible
│   ├── CURRENT_SESSION.md
│   └── TODO.md
├── CONTEXT.md                    # ✅ Tracked, Claude-visible
├── apps/
│   ├── backend/
│   │   ├── .env                  # ❌ Gitignored, blocked from Claude
│   │   └── src/
│   └── frontend/
│       └── src/
└── packages/
    └── shared/
        └── src/
```

***

## Summary & Action Items

### Immediate Setup (Do This Now)

1. **Create root `.gitignore`** with comprehensive patterns for monorepo
2. **Create root `.claudeignore`** with negation patterns for local dev files
3. **Configure `~/.claude/settings.json`** with security rules (most important!)
4. **Add `.claude.md`** with project-specific instructions for AI assistants
5. **Document in README** that project uses `.claudeignore` and how contributors should set up

### Add to Your Documentation Files

**Update `conventions.md`**:
- Add section on "File Access Control"
- Document `.gitignore` vs `.claudeignore` distinction
- Link to security setup guide

**Update `development-practices.md`**:
- Add "Working with AI Assistants" section
- Document local development file patterns
- Add security requirements for all contributors

**Create `docs/SECURITY.md`**:
- Global Claude settings configuration
- Security patterns for secrets management
- What to do if secrets are accidentally exposed

### Long-Term Maintenance

- **Review `.claudeignore` quarterly** as project evolves
- **Update security patterns** when adding new secret types
- **Document new local file patterns** in README
- **Remind contributors** to configure global settings on onboarding

***

## Why This Matters for TomeForge

Your project's success depends on:

1. **Sporadic development** - Local notes visible to Claude help you resume context quickly
2. **Collaboration** - Clear security boundaries prevent friends from accidentally exposing secrets
3. **Open source readiness** - Documented patterns make onboarding smooth
4. **TypeScript/MongoDB workflow** - Coverage reports, build outputs accessible to AI for debugging

The three-layer approach (`.gitignore` + `.claudeignore` + global settings) gives you maximum flexibility while maintaining security, which is perfect for a side project that will be "dropped and picked up randomly".[8][2][1]

[1](https://github.com/anthropics/claude-code/issues/2305)
[2](https://www.reddit.com/r/ClaudeAI/comments/1lgudw2/security_claude_code_reads_env_files_by_default/)
[3](https://www.wisp.blog/blog/how-to-bootstrap-a-monorepo-with-pnpm-a-complete-guide)
[4](https://dev.to/vinomanick/create-a-monorepo-using-pnpm-workspace-1ebn)
[5](https://nx.dev/blog/setup-a-monorepo-with-pnpm-workspaces-and-speed-it-up-with-nx)
[6](https://dev.to/stacklok/stop-ai-coding-assistants-from-leaking-your-secrets-2mm9)
[7](https://www.reddit.com/r/git/comments/s90j81/best_practice_for_handling_gitignore_filess_in_a/)
[8](https://www.reddit.com/r/ClaudeCode/comments/1lu1sho/share_your_best_claude_code_practices/)
[9](https://skywork.ai/blog/claude-code-plugin-best-practices-large-codebases-2025/)
[10](https://github.com/coleam00/context-engineering-intro)
[11](https://cloud.google.com/gemini/docs/codeassist/create-aiexclude-file)
[12](https://www.youtube.com/watch?v=EqLyFT78Sig)
[13](https://www.anthropic.com/engineering/claude-code-best-practices)
[14](https://www.gitloop.com)
[15](https://github.com/anthropics/claude-code/issues/8481)
[16](https://github.com/pnpm/pnpm/issues/3114)
[17](https://youtrack.jetbrains.com/projects/LLM/issues/LLM-18786/Allow-.aiignore-to-Override-.gitignore-for-AI-Assistant-Context)
[18](https://pnpm.io/settings)
[19](https://github.com/aws-samples/sample-ai-coding-standards-template)
[20](https://answers.netlify.com/t/using-pnpm-and-pnpm-workspaces/2759)