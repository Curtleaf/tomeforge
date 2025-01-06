# TomeForge Backend Documentation

Welcome to the backend documentation for TomeForge! This documentation covers all aspects of the backend, including database connectivity and system CRUD operations. The backend application is a Node.js-based service designed to handle API requests and manage the server-side logic for the Tomeforge platform.

## **Key Features**

- API endpoints for managing game-related data (e.g., users, systems, characters).
- MongoDB database integration via Mongoose.
- Uses shared types from `@tomeforge/shared`.

## [**Getting Started**](http://localhost:3000/#/?id=getting-started)

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

## Modules

The **Modules** section documents the core functionality provided by the backend of TomeForge. It includes detailed information about specific modules responsible for system management and database connectivity.

### [System Module](apps/backend/system.md)

The System Module handles all CRUD operations related to game systems. It allows developers to manage systems with features such as listing, creating, updating, and deleting system data. This module ensures that game systems are consistently structured and seamlessly integrated into the backend.

 **Key Functions** :

* **getAllSystems** : Retrieve all available systems.
* **createSystem** : Add a new system with specified attributes.
* **updateSystem** : Modify an existing system based on its ID.
* **removeSystem** : Delete a system by ID.

### [Database Module](apps/backend/db.md)

The Database Module is responsible for establishing and managing the connection to the MongoDB database using Mongoose. It provides a central mechanism for initializing and maintaining database connectivity across the backend.

 **Key Function** :

* **connectToDatabase** : Connects the backend to MongoDB and ensures the database is ready for operations.
