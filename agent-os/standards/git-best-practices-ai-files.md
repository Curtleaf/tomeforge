# Git Best Practices for AI and Agent-OS Files

**Date:** January 17, 2025
**Purpose:** Define version control strategy for Claude Code, agent-os, and AI-related files

---

## Current State Analysis

### Files Currently Tracked in Git

#### ✅ **SHOULD be tracked** (Good):
```
.claude/
├── agents/agent-os/*.md          # Shared agent definitions
├── commands/agent-os/*.md         # Shared slash commands
└── settings.json                  # Shared Claude settings

agent-os/
├── product/                       # Product documentation
│   ├── mission.md
│   ├── roadmap.md
│   ├── development-practices.md
│   ├── technical-constraints.md
│   └── tech-stack.md
├── standards/                     # Development standards
├── roles/                         # Agent role definitions
├── specs/*/                       # Spec implementations (see below)
├── Reviews/                       # External reviews
├── IMPLEMENTATION_SUMMARY.md
├── README.md
└── config.yml
```

#### 🔴 **SHOULD NOT be tracked** (Issue):
```
.claude/settings.local.json        # Personal/machine-specific settings
                                    # Currently tracked but being ignored by global gitignore
                                    # SECURITY RISK: Contains file paths and permissions
```

#### ❓ **NEEDS DECISION**:
```
agent-os/specs/2025-10-17-docker-compose-setup/
├── spec.md                        # Feature specification
├── tasks.md                       # Task breakdown
├── planning/                      # Planning documents
├── implementation/                # Implementation tracking
└── verification/                  # Verification results
```

---

## Best Practices: What to Track

### ✅ Always Track (Knowledge & Shared Configuration)

#### 1. Product Documentation (`agent-os/product/`)
**Why:** Core product strategy, decisions, and requirements
- `mission.md` - Product vision and goals
- `roadmap.md` - Feature planning and priorities
- `development-practices.md` - Team processes
- `technical-constraints.md` - Architecture boundaries
- `tech-stack.md` - Technology decisions
- Code review reports (e.g., `code-review-2025-01-17.md`)

**Value:**
- Maintains project continuity across time gaps
- Serves as "memory" for sporadic development
- Essential for onboarding collaborators

#### 2. Agent Definitions (`.claude/agents/`)
**Why:** Reusable AI agent behaviors
- Agent personas and instructions
- Specialized task handlers
- Workflow automation

**Value:**
- Enables consistent AI assistance
- Shareable across team members
- Part of development infrastructure

#### 3. Slash Commands (`.claude/commands/`)
**Why:** Custom workflow automation
- Project-specific shortcuts
- Standardized operations
- Repeatable processes

**Value:**
- Reduces cognitive load
- Ensures consistency
- Documents common workflows

#### 4. Standards & Roles (`agent-os/standards/`, `agent-os/roles/`)
**Why:** Development guidelines and conventions
- Code style guides
- Architecture patterns
- Agent role assignments

**Value:**
- Maintains code quality
- Enables collaboration
- Documents decisions

#### 5. Shared Settings (`.claude/settings.json`)
**Why:** Team-wide Claude Code configuration
- Shared permissions policies
- Common tool configurations
- Project defaults

**Value:**
- Consistent AI behavior across developers
- Documented security boundaries

---

### ❌ Never Track (Personal & Sensitive)

#### 1. Local Settings (`.claude/settings.local.json`)
**Why:** Machine-specific and potentially sensitive
- Personal file paths (e.g., `/home/curtleaf/...`)
- Custom permissions for individual workflows
- May contain credentials or API keys

**Security Risk:**
```json
{
  "permissions": {
    "allow": [
      "Bash(curl -I -u admin:express123 http://localhost:8081)"
      // ^^^ Exposes credentials!
    ]
  }
}
```

**Action Required:**
1. Remove from git history (if contains credentials)
2. Add to `.gitignore`
3. Document expected structure in `.claude/settings.local.example`

#### 2. Temporary AI Outputs
- Chat transcripts
- Intermediate code generations
- Debug sessions
- Scratch work

#### 3. Personal Notes
- Developer-specific TODOs
- Private experimentation
- Local configuration overrides

---

### 🤔 Conditional Tracking (Spec Implementations)

**Pattern:** `agent-os/specs/{date}-{feature-name}/`

#### Track These:
```
✅ spec.md                         # Feature specification (canonical reference)
✅ tasks.md                        # Task breakdown (planning artifact)
✅ planning/requirements.md        # Initial requirements gathering
✅ verification/final-verification.md  # Final acceptance criteria results
```

**Why:**
- Documents feature decisions and rationale
- Provides historical context for why features exist
- Useful for future reference and learning

#### Consider NOT Tracking:
```
❌ planning/initialization.md      # AI-generated initial analysis
❌ implementation/*.md             # Step-by-step implementation logs
❌ verification/spec-verification.md  # Interim verification steps
```

**Why:**
- Implementation logs become stale quickly
- Code itself is the source of truth
- Creates noise in git history
- Can be regenerated if needed

**Alternative Approach:**
- Track only `spec.md` and `tasks.md` per spec
- Move final verification summary into spec.md
- Archive detailed logs separately if needed

#### Recommended Structure:
```
agent-os/specs/
├── 2025-10-17-api-documentation/
│   ├── spec.md                    # ✅ Track: Feature spec
│   └── tasks.md                   # ✅ Track: Task list
├── 2025-10-17-docker-compose/
│   ├── spec.md                    # ✅ Track
│   └── tasks.md                   # ✅ Track
└── archive/                       # ❌ Don't track: Detailed logs
    └── 2025-10-17-docker-compose/
        ├── planning/
        ├── implementation/
        └── verification/
```

---

## Recommended .gitignore Additions

Add to `/home/curtleaf/Code/tomeforge/.gitignore`:

```gitignore
# ============================================
# AI & CLAUDE CODE
# ============================================
# Local Claude settings (personal/machine-specific)
.claude/settings.local.json
.claude/**/*.local.json

# Claude session data and logs
.claude/sessions/
.claude/logs/
.claude/.cache/

# AI chat transcripts and scratch work
.ai-transcripts/
.ai-scratch/
*.ai-chat.md

# Cursor/other AI IDEs (if used in future)
.cursor/settings.local.json
.cursor/sessions/

# ============================================
# AGENT-OS WORKING FILES
# ============================================
# Detailed implementation/verification logs (keep only spec.md and tasks.md)
agent-os/specs/*/implementation/
agent-os/specs/*/verification/
agent-os/specs/*/planning/initialization.md
agent-os/specs/*/planning/task-assignments.yml

# Archive directory for completed spec artifacts
agent-os/specs/archive/

# Temporary agent work files
agent-os/.tmp/
agent-os/scratch/

# Personal developer notes
agent-os/personal/
agent-os/**/*.personal.md
agent-os/**/*_PRIVATE.md
```

**Note:** Consider creating `.claude/settings.local.example` and `agent-os/specs/SPEC_TEMPLATE/` as documentation.

---

## Security Review: Current .claude/settings.local.json

**⚠️ SECURITY ISSUE FOUND:**

The currently tracked `.claude/settings.local.json` contains:

```json
{
  "permissions": {
    "allow": [
      "Read(//home/curtleaf/agent-os/**)",
      "Bash(curl -I -u admin:express123 http://localhost:8081)"
      // ^^^ Credentials exposed in version control!
    ]
  }
}
```

**Problems:**
1. **Hardcoded credentials** (`admin:express123`) - matches mongo-express credentials from `.env.docker.example`
2. **Personal file paths** expose username and directory structure
3. **Global gitignore only prevents new commits**, doesn't remove from history

**Remediation Steps:**

### Option 1: Clean History (Recommended if no public repo yet)
```bash
# Remove file from git tracking but keep local
git rm --cached .claude/settings.local.json

# Add to .gitignore
echo ".claude/settings.local.json" >> .gitignore

# Commit the change
git add .gitignore
git commit -m "Remove .claude/settings.local.json from tracking (contains personal config)"

# If already pushed to remote, rewrite history (DESTRUCTIVE)
# git filter-branch --force --index-filter \
#   'git rm --cached --ignore-unmatch .claude/settings.local.json' \
#   --prune-empty --tag-name-filter cat -- --all
```

### Option 2: If Repository is Public
```bash
# Immediately rotate credentials
# Change mongo-express password in .env.docker

# Remove from tracking
git rm --cached .claude/settings.local.json
echo ".claude/settings.local.json" >> .gitignore
git commit -m "security: Remove local settings from tracking"

# Consider using git-filter-repo or BFG Repo-Cleaner
# https://github.com/newren/git-filter-repo
```

### Create Example Template
```bash
# Create example file for documentation
cat > .claude/settings.local.example.json << 'EOF'
{
  "permissions": {
    "allow": [
      "Bash(cat:*)",
      "Read(//path/to/your/agent-os/**)",
      "Bash(pnpm build:*)",
      "Bash(docker compose:*)"
    ],
    "deny": [],
    "ask": []
  }
}
EOF

git add .claude/settings.local.example.json
git commit -m "Add example local settings template"
```

---

## Recommended Workflow

### For Solo Development
1. **Track:** Product docs, agents, commands, standards
2. **Don't Track:** Personal settings, detailed implementation logs
3. **Decide per-feature:** Spec files (lean toward minimal tracking)

### For Team Collaboration
1. **Track:** All shared configuration and documentation
2. **Document:** Expected local settings in `.example` files
3. **Archive:** Implementation logs outside git after completion
4. **Review:** Regularly audit what's tracked vs ignored

### For Open Source
1. **Never commit:** Any credentials, personal paths, or sensitive data
2. **Provide examples:** Template files for all local configuration
3. **Document:** Setup process assuming fresh clone
4. **Review:** Every commit for accidental credential inclusion

---

## Implementation Checklist

### Immediate Actions
- [ ] Remove `.claude/settings.local.json` from git tracking
- [ ] Add AI/agent-os patterns to `.gitignore`
- [ ] Create `.claude/settings.local.example.json` template
- [ ] Review git history for any exposed credentials
- [ ] Rotate mongo-express credentials if already pushed publicly

### Documentation
- [ ] Create `agent-os/specs/SPEC_TEMPLATE/` with recommended structure
- [ ] Document spec tracking policy in `agent-os/README.md`
- [ ] Add setup instructions for `.claude/settings.local.json`

### Process Changes
- [ ] Decide on spec tracking strategy (minimal vs complete)
- [ ] Update pre-commit hooks to check for sensitive patterns
- [ ] Add credential scanning to CI/CD pipeline

### Repository Cleanup
- [ ] Archive completed spec implementation logs
- [ ] Review `agent-os/specs/*/` directories for sensitive content
- [ ] Clean up any tracked temporary files

---

## Additional Resources

- **Claude Code Documentation:** Settings and permissions guide
- **Git Filter-Repo:** https://github.com/newren/git-filter-repo
- **BFG Repo-Cleaner:** https://rtyley.github.io/bfg-repo-cleaner/
- **GitHub Secret Scanning:** https://docs.github.com/en/code-security/secret-scanning

---

## Summary

**Golden Rules:**
1. ✅ **Track knowledge** - Product docs, specs, standards, shared config
2. ❌ **Don't track personal** - Local settings, credentials, personal paths
3. 🤔 **Be selective with logs** - Spec summaries yes, detailed steps no
4. 🔒 **Security first** - Never commit credentials, review before push
5. 📝 **Document expectations** - Provide examples for all local config

**Current Priority:**
1. Fix `.claude/settings.local.json` tracking issue
2. Add comprehensive `.gitignore` patterns
3. Decide on spec tracking strategy
4. Create example/template files
