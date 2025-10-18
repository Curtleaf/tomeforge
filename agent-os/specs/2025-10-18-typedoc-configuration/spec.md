# Specification: TypeDoc Configuration

## Goal
Configure TypeDoc to auto-generate API reference documentation from TypeScript source code and JSDoc comments in the shared package, integrate with existing build-docs workflow, and deploy via CI/CD for full visibility of types, interfaces, and exported members.

## User Stories
- As a developer, I want automatically generated type documentation so I can quickly understand available types and interfaces without reading source code
- As a contributor, I want JSDoc comments on exported members so I can learn the purpose and usage of each type
- As a maintainer, I want documentation to stay current with code changes through automated builds in CI/CD
- As an open source learner, I want full visibility of all exported types and functions to understand how the system works

## Core Requirements

### Functional Requirements
- Generate HTML documentation from TypeScript source files in packages/shared
- Output documentation to packages/shared/docs/ folder (sync-docs.js compatible)
- Document all exported types, interfaces, functions, and classes (public API only)
- Exclude test files, node_modules, and dist folders from documentation
- Use API reference style documentation (signatures, parameters, return types)
- Integrate into existing build-docs npm script workflow
- Support CI/CD pipeline integration as separate documentation generation step

### Non-Functional Requirements
- Documentation generation completes in under 30 seconds for shared package
- HTML output is static with no runtime dependencies
- Compatible with Docsify file serving mechanism
- Follows KISS principle with separate TypeDoc config per package
- Maintains consistent styling with existing Docsify documentation

## Visual Design
No mockups provided - TypeDoc will use default theme with standard HTML output compatible with Docsify serving.

## Reusable Components

### Existing Code to Leverage
- **sync-docs.js script** - Already copies from apps/*/docs/ and packages/*/docs/ to central docs/ folder; TypeDoc output will automatically be included
- **build-docs npm script pattern** - Currently runs build-api-spec then sync-docs.js; will be extended to include build-typedoc step
- **generate-openapi.js script** - Similar pattern for static documentation generation; demonstrates output to multiple locations and error handling
- **Docsify integration** - Existing documentation viewer that will serve TypeDoc HTML output
- **GitHub Actions deploy-docs.yml** - CI/CD workflow that runs build-docs on push to main; TypeDoc will be automatically included
- **TypeScript compilation process** - Already configured with tsconfig.json in each package; provides type information for TypeDoc
- **fs-extra library** - Already installed as devDependency; available for any custom TypeDoc build scripts if needed

### New Components Required
- **TypeDoc npm package** - Primary documentation generator tool (not currently installed)
- **typedoc.json config file** - Separate configuration file in packages/shared/ following KISS principle
- **build-typedoc npm script** - New script in root package.json to run TypeDoc generation
- **JSDoc comments** - Need to add documentation comments to exported members in packages/shared/src/
- **Updated build-docs script** - Modify to include TypeDoc generation step between build-api-spec and sync-docs.js

Why new code is needed:
- TypeDoc requires installation and configuration (no existing type documentation solution)
- Separate config per package follows established micro methodology principle
- build-typedoc script provides single-purpose execution of TypeDoc across packages
- JSDoc comments are required input for TypeDoc to generate meaningful documentation

## Technical Approach

### Database
No database changes required - this is a documentation-only feature.

### API
No API changes required - TypeDoc generates static documentation from source code.

### Frontend
No frontend application changes required. TypeDoc HTML output will be served by existing Docsify static site.

### Build Process Integration

**Current build-docs flow:**
```
build-docs → build-api-spec → sync-docs.js
```

**New build-docs flow:**
```
build-docs → build-api-spec → build-typedoc → sync-docs.js
```

**Implementation steps:**
1. Install TypeDoc as devDependency in root package.json
2. Create packages/shared/typedoc.json configuration file
3. Add build-typedoc script to root package.json that runs typedoc in packages/shared
4. Update build-docs script to include build-typedoc step
5. Add basic JSDoc comments to key exported members in packages/shared

**TypeDoc configuration (packages/shared/typedoc.json):**
```json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs",
  "exclude": [
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/node_modules/**",
    "**/dist/**"
  ],
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeInternal": true,
  "includeVersion": true,
  "readme": "none",
  "plugin": []
}
```

**Build script structure (root package.json):**
```json
{
  "scripts": {
    "build-typedoc": "cd packages/shared && pnpm exec typedoc",
    "build-docs": "pnpm build-api-spec && pnpm build-typedoc && node sync-docs.js"
  }
}
```

### CI/CD Integration

**Modify .github/workflows/deploy-docs.yml:**
- No changes needed to workflow file
- Existing "Sync Documentation" step runs `npm run build-docs`
- Since build-docs now includes build-typedoc, TypeDoc generation automatically happens in CI/CD
- Separation of concerns maintained: documentation generation is one logical step in the workflow

**Benefits of this approach:**
- Single workflow step for all documentation (API spec + TypeDoc)
- Documentation always built together before deployment
- Prevents partial documentation updates
- Follows existing pattern established with Swagger integration

### JSDoc Standards

Follow minimal commenting approach per agent-os/standards/global/commenting.md:

**Required JSDoc elements:**
- Brief description of the type/interface/function purpose
- @param tags for function parameters with type and description
- @returns tag for function return values
- @example tags only for complex usage patterns (optional)

**Example:**
```typescript
/**
 * Represents a tabletop game system with configuration and rules.
 */
export interface SystemType {
  // ...
}

/**
 * Mongoose model for game system persistence.
 */
export const SystemModel = model<SystemType>('System', systemSchema);
```

### Documentation Output Structure

**After sync-docs.js runs:**
```
docs/
├── packages/
│   └── shared/
│       ├── index.html (TypeDoc entry point)
│       ├── modules.html
│       ├── classes/
│       ├── interfaces/
│       └── ...
├── apps/
│   └── backend/
│       ├── db.md
│       ├── system.md
│       └── README.md
└── openapi.json
```

### Testing
- Verify TypeDoc generates HTML without errors
- Confirm output appears in packages/shared/docs/
- Validate sync-docs.js copies TypeDoc output to central docs/packages/shared/
- Test CI/CD workflow completes successfully with TypeDoc step
- Manual review of generated documentation for completeness

## Out of Scope
- TypeDoc configuration for apps/backend and apps/frontend (future enhancement)
- Comprehensive JSDoc comments on all code (incremental improvement over time)
- Custom TypeDoc theme or branding (use default theme)
- TypeDoc plugins for advanced features (diagrams, custom tags)
- Documentation versioning or changelog generation
- Tutorial-style documentation or extensive usage examples
- Dependency documentation (listing npm packages with descriptions)
- Visual documentation (type relationship diagrams)
- Interactive documentation features beyond TypeDoc defaults
- Documentation of private/internal members (public API only)
- Documentation linting or enforcement via pre-commit hooks (future Phase 0 task)

## Success Criteria
- TypeDoc successfully generates HTML documentation from packages/shared source code
- Documentation includes all exported types, interfaces, functions, and classes
- Test files and dist folders are excluded from output
- Generated documentation appears in docs/packages/shared/ after build-docs runs
- CI/CD pipeline successfully builds and deploys TypeDoc documentation to GitHub Pages
- Documentation is viewable and navigable via Docsify
- Key exported members (SystemModel, CharacterModel, exported types) have basic JSDoc comments
- Documentation generation completes in under 30 seconds
- No breaking changes to existing build-docs or CI/CD workflows
