# Global Standards Summary

**Quick Reference** - Read this first (~150 tokens), load full standards only when needed.

## Tech Stack (`global/tech-stack.md`)
- **Monorepo**: pnpm workspaces (apps/backend, apps/frontend, packages/shared)
- **Language**: TypeScript strict mode, Node.js v18+
- **Backend**: Express API on port 3000
- **Frontend**: React 18 + Vite (port 5173)
- **Database**: MongoDB + Mongoose ODM
- **Testing**: Vitest/Jest (Phase 0 - not yet configured)
- **Docs**: Docsify static site (deployed to GitHub Pages)

## Project Conventions (`global/conventions.md`)
- **Build Order**: Always build `packages/shared` first before apps
- **Workspace Protocol**: Use `"@tomeforge/shared": "workspace:^"` for internal deps
- **Module System**: CommonJS with ES2020 target
- **Environment**: `.env` in root (NEVER commit secrets)
- **Main Branch**: `main` (not master)
- **Hot Reload**: nodemon (backend), Vite HMR (frontend)

## Coding Style (`global/coding-style.md`)
- **Naming**: Consistent conventions across codebase
- **Meaningful Names**: Descriptive, avoid abbreviations
- **Small Functions**: Single responsibility, focused
- **DRY Principle**: Extract common logic, avoid duplication
- **No Dead Code**: Delete unused code and commented blocks
- **No Backward Compatibility**: Unless explicitly required
- **Automated Formatting**: Consistent indentation, line breaks

## Commenting (`global/commenting.md`)
- **Self-Documenting Code**: Clear structure and naming
- **Minimal Comments**: Concise, explain large sections of logic
- **Evergreen Only**: No temporary change/fix comments
- **JSDoc for APIs**: Document exported functions, types, interfaces

## Error Handling (`global/error-handling.md`)
- **User-Friendly Messages**: Clear, actionable, no tech details exposed
- **Fail Fast**: Validate early, reject invalid data immediately
- **Specific Exceptions**: Use specific error types, not generic
- **Centralized Handling**: Handle at boundaries (controllers, API layers)
- **Graceful Degradation**: Non-critical failures don't break system
- **Clean Up Resources**: Always in finally blocks

## Validation (`global/validation.md`)
- **Server-Side Always**: Never trust client-side alone
- **Client-Side for UX**: Immediate feedback, duplicate server-side
- **Fail Early**: Validate at entry points before processing
- **Specific Messages**: Field-specific, help users correct input
- **Allowlists Over Blocklists**: Define what's allowed
- **Sanitize Input**: Prevent SQL injection, XSS, command injection
- **Consistent**: Apply across all entry points (web, API, jobs)

## System-Agnostic Design (Core Principle)
- **Never Hardcode Mechanics**: All game rules in database configurations
- **Data-Driven Everything**: UI generated from system configs
- **Flexible Schema**: Support D&D, Pathfinder, board games, indie RPGs
- **95%+ Target**: Express mechanics through configuration, not code

## Type Safety (Core Principle)
- **TypeScript Strict**: Enabled everywhere
- **Shared Types**: Via `@tomeforge/shared` package
- **Runtime Validation**: Matches compile-time types
- **Schema-Generated Types**: Mongoose schemas → TypeScript types

## Key Constraints (From `product/technical-constraints.md`)
- **Schema Nesting**: Max 3 levels deep
- **Document Size**: < 1MB soft limit (16MB hard limit)
- **Array Size**: < 100 items recommended
- **Schema Versioning**: Required (currently missing - Roadmap item 18)

## Development Workflow
1. `pnpm install` - Install dependencies
2. `cd packages/shared && pnpm build` - Build shared first
3. `pnpm build` - Build all packages
4. `pnpm start` - Run backend + frontend concurrently

## Documentation
- **Build Docs**: `pnpm build-docs` (OpenAPI + TypeDoc → docs/)
- **API Docs**: `pnpm build-api-spec` (OpenAPI from routes)
- **Type Docs**: `pnpm build-typedoc` (API reference from TSDoc)
- **Serve Locally**: `docsify serve docs`
- **Live Site**: https://curtleaf.github.io/tomeforge/

---

**For full details, see:**
- `agent-os/standards/global/coding-style.md` (~200 tokens)
- `agent-os/standards/global/error-handling.md` (~200 tokens)
- `agent-os/standards/global/validation.md` (~250 tokens)
- `agent-os/standards/global/conventions.md` (~400 tokens)
- `agent-os/standards/global/commenting.md` (~100 tokens)
- `agent-os/standards/global/tech-stack.md` (~300 tokens)
- `agent-os/product/technical-constraints.md` (~800 tokens)
