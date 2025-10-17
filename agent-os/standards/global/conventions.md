## General development conventions

### TomeForge Project Conventions

- **Monorepo Structure**: pnpm workspace with `apps/` and `packages/` directories
- **Build Order**: Always build `packages/shared` before apps when making type changes
- **Workspace Protocol**: Use `"@tomeforge/shared": "workspace:^"` for internal dependencies
- **TypeScript**: Strict mode enabled; all source in TypeScript
- **Module System**: CommonJS (`module: "CommonJS"`) with ES2020 target
- **Path Mappings**: Root `tsconfig.json` maps `@tomeforge/shared/*` to `packages/shared/dist/*`

### Documentation

- **Source Docs**: Write docs in `apps/*/docs/` and `packages/*/docs/` directories
- **Central Docs**: Run `pnpm build-docs` to sync to `docs/` folder
- **Documentation Tool**: Docsify for rendering markdown
- **Live Docs**: https://curtleaf.github.io/tomeforge/
- **Auto-Deploy**: GitHub Actions deploys on push to main branch
- **Local Preview**: Run `docsify serve docs` to preview locally

### Environment Configuration

- **Backend Environment**: Create `.env` in root with:
  ```
  MONGODB_USERNAME=
  MONGODB_PASSWORD=
  MONGODB_CLUSTER=
  MONGODB_DATABASE_NAME=
  ```
- **Port Configuration**: Backend uses `process.env.PORT` (default: 3000)
- **Never Commit Secrets**: `.env` is gitignored

### Version Control Best Practices

- **Main Branch**: `main` (not `master`)
- **Feature Branches**: Use descriptive branch names
- **Commit Messages**: Clear, descriptive commit messages
- **Pull Requests**: Create PRs for review before merging

### Development Workflow

1. Install: `pnpm install`
2. Build shared first: `cd packages/shared && pnpm build`
3. Build all: `pnpm build` from root
4. Run both apps: `pnpm start` (uses concurrently)
5. Run individually: `pnpm start-backend` or `pnpm start-frontend`

### Hot Reloading

- **Backend**: nodemon watches `src/**/*.ts` and auto-restarts
- **Frontend**: Vite provides HMR automatically
