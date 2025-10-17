# Security Guidelines for TomeForge Contributors

This document outlines security best practices for contributing to TomeForge, with special emphasis on AI coding assistant (Claude Code) security configuration.

## Table of Contents
1. [Claude Code Security Setup](#claude-code-security-setup)
2. [Secrets Management](#secrets-management)
3. [File Access Control](#file-access-control)
4. [Incident Response](#incident-response)
5. [Security Checklist](#security-checklist)

---

## Claude Code Security Setup

### 🔴 REQUIRED: Global Security Configuration

**All contributors using Claude Code MUST configure global security settings** to prevent accidental secret exposure to the LLM.

#### Configuration File

Create or edit `~/.claude/settings.json` in your home directory:

**macOS/Linux:**
```bash
mkdir -p ~/.claude
nano ~/.claude/settings.json
```

**Windows:**
```powershell
New-Item -Path "$env:USERPROFILE\.claude" -ItemType Directory -Force
notepad "$env:USERPROFILE\.claude\settings.json"
```

#### Security Policy

Add the following content to `~/.claude/settings.json`:

```json
{
  "iamPolicy": {
    "read": [
      "**/.env*",
      "!**/.env.example",
      "!**/.env.template",
      "**/*.pem",
      "**/*.key",
      "**/*.p12",
      "**/*.pfx",
      "**/secrets/**",
      "**/credentials/**",
      "**/.aws/**",
      "**/.gcp/**",
      "**/.azure/**",
      "**/.ssh/**",
      "**/docker-compose.yml",
      "**/docker-compose.*.yml",
      "!**/docker-compose.override.yml.example",
      "**/database.yml",
      "**/config/database.yml",
      "**/.npmrc",
      "**/.yarnrc",
      "**/.pypirc"
    ]
  }
}
```

#### What This Protects

The global security policy prevents Claude Code from accessing:

**Environment Variables:**
- `.env`, `.env.local`, `.env.production`, etc.
- Excludes `.env.example` and `.env.template` (safe to reference)

**Certificates & Keys:**
- SSL/TLS certificates (`.pem`, `.p12`, `.pfx`)
- Private keys (`.key`)
- SSH keys (`~/.ssh/`)

**Credentials:**
- `credentials/` directories
- `secrets/` directories
- Cloud provider credentials (`.aws/`, `.gcp/`, `.azure/`)

**Configuration Files:**
- `docker-compose.yml` (may contain passwords)
- `database.yml` (connection strings)
- Package manager configs (`.npmrc`, `.pypirc`) with authentication tokens

### Verification

After configuring `~/.claude/settings.json`, verify it's working:

1. **Test with Claude Code:**
   ```
   User: "Can you see my @.env file?"
   Expected: "No, I cannot access .env files due to security settings."
   ```

2. **Test with `.env.example`:**
   ```
   User: "Can you see my @.env.example file?"
   Expected: "Yes, here's the content of .env.example..."
   ```

3. **Verify in your project:**
   - Try to @-mention `.env` - Should NOT appear in autocomplete
   - Try to @-mention `.env.example` - SHOULD appear in autocomplete

### Why Global Settings Matter

- **Applies to ALL projects** you work on with Claude Code
- **Defense in depth** - Catches mistakes even if `.claudeignore` is misconfigured
- **Prevents accidental exposure** of secrets across your entire development workflow
- **Cannot be overridden** by project-specific settings

---

## Secrets Management

### Never Commit Secrets

**Prohibited in git:**
- API keys and tokens
- Database passwords
- OAuth client secrets
- Private encryption keys
- Session secrets
- SMTP passwords
- Third-party service credentials

### Environment Variables

**Use `.env.example` as template:**
```bash
# .env.example (tracked in git)
MONGODB_USERNAME=your_username_here
MONGODB_PASSWORD=your_password_here
MONGODB_CLUSTER=your_cluster_here
MONGODB_DATABASE_NAME=tomeforge

# OAuth (if needed)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Session
SESSION_SECRET=generate_random_string_here
```

**Actual `.env` (gitignored, blocked from Claude):**
```bash
# .env (NEVER commit this)
MONGODB_USERNAME=prod_user_2024
MONGODB_PASSWORD=xK9#mP2$vL8@wQ3
MONGODB_CLUSTER=cluster0.abc123.mongodb.net
MONGODB_DATABASE_NAME=tomeforge_production

GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-ActualSecretHere

SESSION_SECRET=5f8a3c9d2e1b4a6f7c8d9e0b1a2c3d4e
```

### Generating Secrets

**Session secrets (random strings):**
```bash
# Generate 32-byte random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use openssl
openssl rand -hex 32
```

**JWT secrets:**
```bash
# Generate 64-byte random string for JWT
openssl rand -base64 64
```

### Secrets in CI/CD

**Use encrypted secrets in GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    steps:
      - name: Deploy to production
        env:
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
          SESSION_SECRET: ${{ secrets.SESSION_SECRET }}
```

Never hardcode secrets in workflow files.

---

## File Access Control

### Three-Layer Approach

TomeForge uses a three-layer security model:

1. **`.gitignore`** (root) - Controls version control (what goes in repo)
2. **`.claudeignore`** (root) - Controls AI assistant access (what Claude sees)
3. **`~/.claude/settings.json`** - Global security boundaries (applies to all projects)

### What's Gitignored but Claude-Visible

These files are kept out of git but Claude Code can access them for better context:

**Local Development Files:**
- `tasks/` - Personal task lists and project notes
- `NOTES.md` - Session scratch notes
- `*_TODO.md` - File-specific TODOs
- `coverage/` - Test coverage reports

**Workspace Configuration:**
- `.vscode/settings.json` - Workspace settings

**Purpose:** Allows Claude to provide better assistance by understanding your current context and seeing test coverage, without cluttering the git repository.

### What's Blocked from Both

**Secrets (blocked at all three layers):**
- `.env*` files (except `.env.example`)
- Certificate files (`.pem`, `.key`, `.p12`, `.pfx`)
- Credentials directories
- Cloud provider configs (`.aws/`, `.ssh/`)
- `docker-compose.yml` (may contain passwords)

**Build Artifacts:**
- `node_modules/`
- `dist/`, `build/`
- `.cache/`

**Logs & Temporary Files:**
- `*.log`
- `*.tmp`
- `temp/`, `uploads/`

---

## Incident Response

### If Secrets Are Accidentally Exposed

**Immediate Actions:**

1. **DO NOT PANIC** - Act methodically

2. **Identify what was exposed:**
   - Which secrets/credentials?
   - When was exposure (timestamp)?
   - How was it exposed (commit, chat, etc.)?

3. **Rotate credentials IMMEDIATELY:**
   ```bash
   # MongoDB
   - Change password in MongoDB Atlas
   - Update .env with new password
   - Restart application

   # API Keys
   - Revoke old key in provider dashboard
   - Generate new key
   - Update .env and restart

   # OAuth Secrets
   - Regenerate client secret
   - Update .env and restart

   # Session Secrets
   - Generate new secret (invalidates all sessions)
   - Update .env and restart
   ```

4. **Revoke access:**
   - Invalidate exposed tokens
   - Revoke API keys
   - Disable compromised accounts

5. **Remove from git history** (if committed):
   ```bash
   # Use BFG Repo-Cleaner or git filter-branch
   # ONLY if secret was committed to git

   # Install BFG
   brew install bfg  # macOS
   # Or download from https://rtyley.github.io/bfg-repo-cleaner/

   # Remove .env from history
   bfg --delete-files .env

   # Force push (coordinate with team first!)
   git push --force
   ```

6. **Report incident:**
   - Open GitHub issue with `security` label
   - **DO NOT include the exposed secret in the issue**
   - Document: What was exposed, when, how, what actions taken

7. **Update documentation:**
   - Add to incident log
   - Review security procedures
   - Update patterns if new exposure vector discovered

### Prevention Checklist

Before every commit:
- [ ] Run `git diff` to review changes
- [ ] Check for hardcoded credentials or API keys
- [ ] Verify `.env` is in `.gitignore`
- [ ] Confirm no secrets in code comments
- [ ] Use `.env.example` for documentation, not `.env`

---

## Security Checklist

### For All Contributors

- [ ] Configured `~/.claude/settings.json` with security policy
- [ ] Verified Claude Code cannot access `.env` files
- [ ] Created `.env` from `.env.example` template
- [ ] Never committed `.env` or credentials to git
- [ ] Using generated random strings for secrets
- [ ] Storing secrets in environment variables, not code

### For Repository Maintainers

- [ ] `.gitignore` includes all secret patterns
- [ ] `.claudeignore` blocks secrets even if not in `.gitignore`
- [ ] `.env.example` provided with safe placeholder values
- [ ] CI/CD uses encrypted secrets (GitHub Secrets)
- [ ] Security documentation up to date
- [ ] All contributors aware of security requirements

### For Code Reviews

- [ ] No hardcoded credentials in code
- [ ] No API keys or tokens in comments
- [ ] Environment variables used for configuration
- [ ] No `.env` or credential files in commits
- [ ] Secrets management follows best practices
- [ ] Third-party dependencies audited (`pnpm audit`)

---

## Additional Security Practices

### Dependency Security

**Regular audits:**
```bash
# Check for vulnerabilities
pnpm audit

# Fix automatically when possible
pnpm audit --fix

# Update dependencies
pnpm update
```

**Automated checks:**
- Dependabot enabled in GitHub
- CI/CD runs `pnpm audit` on every PR
- Security advisories monitored

### Database Security

**MongoDB Atlas:**
- Use IP whitelisting
- Enable authentication
- Use strong passwords (generated)
- Rotate credentials quarterly
- Monitor access logs

**Connection strings:**
- Never log connection strings
- Use environment variables
- Encrypt at rest and in transit

### API Security

**Authentication:**
- JWT tokens with short expiry
- Refresh token rotation
- argon2 for password hashing
- Rate limiting on all endpoints

**Authorization:**
- RBAC (Role-Based Access Control)
- Least privilege principle
- Validate permissions on every request

---

## Questions or Concerns?

**Security issues:**
- Email: security@tomeforge.dev (if repository goes public)
- GitHub: Open issue with `security` label
- Never include sensitive information in public issues

**General questions:**
- GitHub Discussions for non-sensitive security questions
- Review this document and `.claude.md` for guidance

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Claude Code Security](https://www.anthropic.com/claude-code)

---

**Last Updated:** 2025-10-17
**Version:** 1.0.0
