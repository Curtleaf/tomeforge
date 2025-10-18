# Spec Requirements: TypeDoc Configuration

## Initial Description
Set up TypeDoc for auto-generating documentation from TypeScript types and JSDoc comments.

This is task #6 from Phase 0: Developer Infrastructure in the product roadmap. Phase 0 focuses on establishing development practices, tooling, and automation to support sustainable sporadic development.

Task size: XS (extra small)

**Project Context:**
- This is a pnpm monorepo with packages: apps/backend, apps/frontend, and packages/shared
- The project uses TypeScript throughout
- There's already a Swagger/OpenAPI setup for API documentation (completed task #5)
- Documentation is currently managed via Docsify with a build-docs command that runs build-api-spec then sync-docs.js

## Requirements Discussion

### First Round Questions

**Q1:** I assume you want TypeDoc to document the shared package (`packages/shared`) primarily, since that's where your reusable types and Mongoose models live. Should we also generate docs for backend and frontend, or focus on shared package first?

**Answer:** Focus on shared package first, establish patterns. User can expand later if needed.

**Q2:** I'm thinking TypeDoc should output to a `docs/` folder within each package (e.g., `packages/shared/docs/`), then the existing `sync-docs.js` script can copy them to the central docs folder. Is that correct, or would you prefer a different output strategy?

**Answer:** Yes, that follows the existing pattern. Output to individual package `docs/` folders and let sync-docs.js handle centralization.

**Q3:** For TypeDoc configuration, should we use a single `typedoc.json` at the monorepo root that handles all packages, or separate configs per package for more granular control?

**Answer:** Will address in follow-up.

**Q4:** Should TypeDoc generate HTML output (for viewing in Docsify), JSON output (for programmatic access), or both?

**Answer:** HTML for viewing in Docsify, align with existing documentation structure.

**Q5:** I assume we want JSDoc comments on all exported types, interfaces, and functions in the shared package. Should we also document private/internal members, or only public API?

**Answer:** Focus on public API (exported members). Private/internal can be documented later if needed.

**Q6:** For the build process integration, should TypeDoc generation be part of the existing `build-docs` npm script, or a separate command that developers run manually?

**Answer:** Will address in follow-up.

**Q7:** Should we include TypeDoc generation in the CI/CD pipeline to ensure docs stay up-to-date, or keep it as a local development task for now?

**Answer:** Will address in follow-up.

**Q8:** What level of documentation completeness are you aiming for: comprehensive docs with examples, or lighter "module docs" that list types and their properties?

**Answer:** Will address in follow-up.

**Q9:** Is there anything you specifically want to exclude from the TypeDoc output (test files, internal utilities, generated types)?

**Answer:** Exclude test files, node_modules, and dist folders. Focus on source TypeScript files.

### Existing Code to Reference

**Similar Features Identified:**
- Feature: Swagger/OpenAPI Documentation Setup
  - Path: `/home/curtleaf/Code/tomeforge/agent-os/specs/2025-10-17-api-documentation-setup`
  - Pattern to follow: Output generated docs to package-level `docs/` folders, use sync-docs.js to centralize
  - Build script pattern: `build-docs` runs `build-api-spec` then `sync-docs.js`

- Feature: Documentation Synchronization Script
  - Path: `/home/curtleaf/Code/tomeforge/sync-docs.js`
  - Mechanism: Copies from `apps/*/docs/` and `packages/*/docs/` to central `docs/` folder
  - TypeDoc output should follow this convention for automatic centralization

**Existing Documentation Context:**
- Current documentation uses Docsify with GitHub Pages deployment
- Docs are synced from apps/packages to root using `sync-docs.js` script
- OpenAPI spec is generated via `build-api-spec` script and included in build-docs process
- TypeDoc should integrate into this existing workflow

### Follow-up Questions

**Follow-up 1:** Looking at the Swagger setup, it generates static files as part of the build-docs process. Should TypeDoc follow the same pattern (integrate into build-docs), or should it be a separate workflow step in CI/CD, or both?

**Answer:** Follow the build-docs pattern, maybe centralize these processes as well. Look at previous specs to see why build-docs was done this way. Swagger can be separate as it's API-specific stuff and they're putting a version of it in the docs as well.

**Follow-up 2:** For the monorepo configuration decision (single root typedoc.json vs separate configs per package): which approach would you prefer? A single config is simpler but less flexible; separate configs allow per-package customization.

**Answer:** Start with separate configs if one file would be doing too much. Follow KISS method (Keep It Simple Stupid) and micro methodology of single purpose class, functions, apps. For docs: full visibility since this is for learning and making it open source.

**Follow-up 3:** Should TypeDoc generation run as part of the existing build-docs command (alongside build-api-spec), be integrated into CI/CD as a separate step, or both?

**Answer:** Both build-docs and as part of existing flow. Maybe separate it into a pre-action or step so the one workflow isn't too complex or unreliable. Adding build-docs to it would make everything automated.

**Follow-up 4:** You mentioned "lighter module docs" - can you clarify what level of detail you want? For example: just a list of exports with basic descriptions, or include parameter details, return types, and usage examples?

**Answer:** A simple list of npm dependencies with brief descriptions and maybe uses or reasons for usage.

**Clarification Note:** The user's answer about "npm dependencies" seems to reference a different concern (dependency documentation). For TypeDoc's TypeScript documentation, the requirement appears to be: keep it straightforward - document exported types, interfaces, functions with their signatures, parameters, and return types. No need for extensive examples or tutorials. Think API reference rather than user guide.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
N/A

## Requirements Summary

### Functional Requirements

**Core Functionality:**
- Configure TypeDoc for `packages/shared` package (primary focus)
- Generate HTML documentation from TypeScript source files
- Output documentation to `packages/shared/docs/` to work with existing sync-docs.js script
- Document all exported types, interfaces, functions, and classes (public API only)
- Exclude test files, node_modules, and dist folders from documentation generation
- Use separate TypeDoc configuration per package for flexibility and KISS principle

**Build Process Integration:**
- Add TypeDoc generation to existing `build-docs` npm script
- Structure: `build-docs` should run `build-api-spec`, `build-typedoc`, then `sync-docs.js`
- Create `build-typedoc` script that generates TypeDoc documentation
- Ensure TypeScript compilation occurs before TypeDoc generation (types must be available)

**CI/CD Integration:**
- Include TypeDoc generation in CI/CD pipeline as a separate pre-action or step
- Separate step approach prevents workflow complexity and improves reliability
- Both local (build-docs) and automated (CI/CD) generation ensure docs stay current
- CI/CD should validate that documentation builds successfully

**Documentation Style:**
- "Light docs" approach: API reference style, not tutorial style
- Document type signatures, parameters, return types, and basic descriptions
- No need for extensive usage examples or tutorials
- Full visibility of all exported members (for learning and open source transparency)
- Clear, concise JSDoc comments on exported members

**TypeDoc Configuration Per Package:**
- `packages/shared/typedoc.json` - Primary configuration
- Future: `apps/backend/typedoc.json` and `apps/frontend/typedoc.json` as needed
- Each config tailored to package-specific needs
- Follows KISS and micro methodology principles

### Reusability Opportunities

**Existing Infrastructure to Leverage:**
- Existing `sync-docs.js` script for documentation centralization
- Current `build-docs` npm script pattern (add TypeDoc step)
- Docsify setup and GitHub Pages deployment
- TypeScript compilation process in each package
- Existing JSDoc comment patterns in codebase

**Patterns to Establish:**
- TypeDoc configuration template that can be replicated for other packages
- JSDoc comment standards for TypeScript code (exported members)
- Documentation build workflow that integrates with existing processes
- CI/CD documentation validation step that can be reused

**Code Referenced from Swagger Spec:**
- Build script pattern: sequential commands in npm scripts
- Documentation output location: `docs/` folder within each package
- Centralization via sync-docs.js after generation
- Integration with Docsify for unified documentation viewing

### Scope Boundaries

**In Scope:**
- TypeDoc configuration for `packages/shared`
- Separate `typedoc.json` config file in `packages/shared/`
- HTML output generation to `packages/shared/docs/`
- Documentation of exported types, interfaces, functions, and classes
- Exclusion rules for test files, node_modules, dist folders
- Integration with existing `build-docs` npm script
- New `build-typedoc` script for TypeDoc generation
- CI/CD pipeline step for documentation generation
- Basic JSDoc comments on key exported members in `packages/shared`
- Integration with Docsify for viewing generated HTML docs
- Documentation validation in CI/CD (build succeeds)

**Out of Scope:**
- TypeDoc configuration for `apps/backend` and `apps/frontend` (future enhancement)
- Comprehensive JSDoc comments on all code (incremental improvement)
- Advanced TypeDoc plugins or custom themes
- Documentation versioning or changelog generation
- Tutorial-style documentation or usage examples
- Dependency documentation (separate concern, possibly future feature)
- Visual documentation generation (diagrams, type relationship graphs)
- Interactive documentation features beyond TypeDoc's defaults
- Documentation of private/internal members
- Code coverage reports or quality metrics integration

**Future Enhancements:**
- Expand TypeDoc to backend and frontend packages using established patterns
- Add comprehensive JSDoc comments throughout codebase
- Custom TypeDoc theme to match TomeForge branding
- Documentation versioning aligned with releases
- Add dependency documentation feature (list npm deps with descriptions and usage notes)
- Type relationship visualization (diagrams showing how types connect)
- Integration with code quality tools (coverage, complexity metrics)
- Automated JSDoc comment linting/enforcement

### Technical Considerations

**Integration Points:**
- `packages/shared/src/` - Source TypeScript files to document
- `packages/shared/docs/` - TypeDoc HTML output location
- `sync-docs.js` - Existing script that will copy TypeDoc output to central docs
- Root `package.json` - Add `build-typedoc` script, update `build-docs` script
- CI/CD workflow configuration - Add TypeDoc generation step
- Docsify configuration - Ensure TypeDoc HTML integrates with existing docs structure

**Build Process Flow:**
```
1. build-api-spec (existing - generates OpenAPI docs)
2. build-typedoc (new - generates TypeDoc HTML)
3. sync-docs.js (existing - centralizes all docs to root docs/ folder)
```

**Technology Stack:**
- TypeDoc - Primary documentation generator
- TypeScript compiler - Must run before TypeDoc (provides type information)
- Node.js/npm - For build scripts
- fs-extra - Already used by sync-docs.js for file operations
- Docsify - Existing documentation viewer

**Configuration Strategy:**
- Separate `typedoc.json` per package (starting with packages/shared)
- Configuration includes:
  - Entry points (src/index.ts or main exported files)
  - Output directory (docs/)
  - Exclusion patterns (test files, node_modules, dist)
  - Output format (HTML)
  - Documentation visibility settings (exported members only)
  - Plugin configuration if needed

**CI/CD Architecture:**
- Separate pre-action or step for documentation generation
- Prevents main workflow complexity and improves reliability
- Can fail independently without blocking other CI/CD tasks
- Ensures documentation builds successfully before deployment
- Automatically publishes updated docs to GitHub Pages

**Docsify Integration:**
- TypeDoc HTML output must be compatible with Docsify serving
- Central docs folder structure: `docs/packages/shared/` (via sync-docs.js)
- Update Docsify sidebar/navigation to link to TypeDoc output
- Maintain consistent styling between Docsify and TypeDoc HTML

**Documentation Standards Compliance:**
- Follow agent-os/standards/global/commenting.md for JSDoc formatting
- Align with agent-os/standards/global/coding-style.md conventions
- Use consistent naming from agent-os/standards/global/conventions.md
- Document validation patterns per agent-os/standards/global/validation.md

**System Constraints:**
- TypeDoc output must not exceed GitHub Pages size limits
- Documentation generation should be fast (< 30 seconds for shared package)
- HTML output must be static (no runtime dependencies)
- Compatible with Docsify's file serving mechanism
- CI/CD documentation step should not significantly increase build time

**KISS and Micro Methodology Principles:**
- Each package has its own TypeDoc config (single purpose)
- build-typedoc script focuses only on running TypeDoc (single purpose)
- Documentation generation separated from API spec generation (separation of concerns)
- Incremental approach: start with shared package, expand later (simplicity)
- Light docs approach: API reference only, no tutorials (simplicity)
