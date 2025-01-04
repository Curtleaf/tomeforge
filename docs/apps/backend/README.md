# TomeForge Backend Documentation

Welcome to the backend documentation for TomeForge! This documentation covers all aspects of the backend, including database connectivity and system CRUD operations. The backend application is a Node.js-based service designed to handle API requests and manage the server-side logic for the Tomeforge platform.

## **Key Features**

- API endpoints for managing game-related data (e.g., users, systems, characters).
- MongoDB database integration via Mongoose.
- Uses shared types from `@tomeforge/shared`.

## Links

* [System Module](apps/backend/system.md)
* [bDatabase Module](apps/backend/db.md)

## **How to Use**

1. **Navigate to the backend directory**:

   ```bash
   cd apps/backend
   ```
2. **Set up environment variables:**

   - Ensure a .env file exists with the following variables:

   ```dotenv
   MONGODB_USERNAME=''
   MONGODB_PASSWORD=''
   MONGODB_CLUSTER=''
   MONGODB_DATABASE_NAME=''
   ```
3. Run the backend in development mode:

   ```bash
   pnpm run dev
   ```
4. Build for production:

   ```bash
   pnpm run build
   ```
5. Start in production mode:

   ```bash
   node dist/index.js
   ```
