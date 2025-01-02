# **Tomeforge**

Tomeforge is a monorepo project designed to power a robust tabletop game management platform. It includes a **frontend**, **backend**, and a **shared library** for reusable types, utilities, and UI components.

## **Project Structure**

``` plaintext
tomeforge/
├── apps/
│   ├── backend/               # Backend application (Node.js, Express)
│   ├── frontend/              # Frontend application (React, Vite)
│   └── micro-frontends/       # Additional micro-frontends (optional)
├── packages/
│   ├── shared/                # Shared types, utilities, and reusable components
│   └── ui/                    # Shared UI components (if applicable)
├── pnpm-workspace.yaml        # Monorepo workspace configuration
├── tsconfig.json              # Root TypeScript configuration
├── package.json               # Root package.json for shared scripts
├── .env                       # Environment variables (shared across projects)
└── .gitignore                 # Ignored files and directories
```

---

## **Getting Started**

### **Prerequisites**

- Node.js v18 or higher (recommended to use `nvm` for version management)
- `pnpm` (installed globally)
- MongoDB Atlas account or local MongoDB instance for database

### **Setup**

1. Clone the repository:

``` bash
git clone <repository-url>
cd tomeforge
```

2. Install dependencies:

``` bash
pnpm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory of the backend for connection to mongoDB:

``` dotenv
MONGODB_USERNAME=''
MONGODB_PASSWORD=''
MONGODB_CLUSTER=''
MONGODB_DATABASE_NAME=''
```

4. Build all packages:

``` bash
pnpm build
```

---

## **Running the Project**

### **Backend**

1. Navigate to the `backend` directory:

``` bash
cd apps/backend
```

2. Start the backend in development mode:

``` bash
pnpm run dev
```

3. The backend will start at the specified port (default: `3000`).

### **Frontend**

1. Navigate to the `frontend` directory:

``` bash
cd apps/frontend
```

2. Start the frontend development server:

``` bash
pnpm run dev
```

3. The frontend will be available at `http://localhost:5173`.

---

## **Project Features**

### **Frontend**

- Built with React and Vite for fast development.
- Integrates shared UI components and types from the `shared` package.

### **Backend**

- Node.js with Express for handling API requests.
- MongoDB as the database, using Mongoose for schema modeling.
- Consumes shared types from the `shared` package.

### **Shared Library**

- **Reusable Types**: Shared domain models like `User`, `System`, and `Character`.
- **Utilities**: Common helper functions (e.g., date formatting).
- **UI Components**: Shared React components like `SharedButton`.

---

## **Development Workflow**

1. Add or modify features in the appropriate `apps` or `packages` directory.
2. Use `pnpm` to run tests, linting, and builds across the monorepo:

``` bash
pnpm test        # Run tests recursively
pnpm lint        # Lint all packages and apps
pnpm build       # Build all packages and apps
```

3. Add a `changeset` when modifying shared packages to track versioning:

``` bash
pnpm changeset
```

4. Commit changes and push to the repository.

---

## **Scripts**

### **Root Scripts**

- `pnpm build`: Build all apps and packages.
- `pnpm clean`: Remove all `dist` directories.
- `pnpm test`: Run tests across the monorepo.

### **Backend Scripts**

- `pnpm run dev`: Start the backend in development mode.
- `pnpm run build`: Build the backend for production.

### **Frontend Scripts**

- `pnpm run dev`: Start the frontend in development mode.
- `pnpm run build`: Build the frontend for production.

---

## **Common Issues**

### 1. MongoDB Connection Error

- Ensure `MONGO_URI` is correctly set in the `.env` file.
- Verify your IP is whitelisted in MongoDB Atlas.

### 2. Module Not Found Errors

- Run `pnpm install` to ensure all dependencies are installed.
- Rebuild the shared library:

``` bash
cd packages/shared
pnpm build
```

### 3. Frontend Fails to Load Shared Components

- Check `@tomeforge/shared` is correctly linked in `apps/frontend/node_modules`.

---

## **Contributing**

1. Fork the repository.
2. Create a new branch for your feature:

``` bash
git checkout -b feature-name
```

3. Make changes and commit:

``` bash
git commit -m "Add feature-name"
```

4. Push to your fork and create a pull request.

---

## **License**

This project is licensed under the MIT License.

---
