# TomeForge

TomeForge is a powerful monorepo designed to streamline the creation and management of tabletop games. It encompasses a  **frontend** ,  **backend** , and a **shared library** to handle types, utilities, and UI components seamlessly.

---

## **Documentation**

Comprehensive documentation for TomeForge is hosted [here](https://curtleaf.github.io/tomeforge/#/). Visit the link for detailed guidance on using and contributing to the project.

---

## **Table of Contents**

* [About](#about)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Features](#features)
* [Contributing](#contributing)
* [License](#license)

---

## **About**

TomeForge integrates multiple applications and shared packages to provide a unified platform for managing tabletop game systems. Whether you’re a game designer or a player, TomeForge offers tools to customize, play, and manage games effectively.

---

## **Project Structure**

```plaintext

tomeforge/
├── apps/
│ ├── backend/ # Backend application (Node.js, Express)
│ ├── frontend/ # Frontend application (React, Vite)
├── docs/ # Documentation files for Docsify
├── packages/
│ ├── shared/ # Shared types, utilities, and reusable components
│ └── ui/ # Shared UI components
├── pnpm-workspace.yaml # Monorepo workspace configuration
├── tsconfig.json # TypeScript configuration
├── package.json # Shared scripts and dependencies
└── .env # Environment variables

```

---

## **Getting Started**

### Prerequisites

* Node.js v18 or higher
* `pnpm` (installed globally)
* MongoDB Atlas or local MongoDB instance

### Setup

1. Clone the repository:

```bash

git clone https://github.com/Curtleaf/tomeforge.git
cd tomeforge

```

2. Install dependencies:

```bash

pnpm install

```

3. Configure `.env` for backend:

```bash

MONGODB_USERNAME=''
MONGODB_PASSWORD=''
MONGODB_CLUSTER=''
MONGODB_DATABASE_NAME=''

```

4. Build the project:

```bash

pnpm build

```

---

## **Usage**

### Backend

1. Navigate to the backend directory:

```bash

cd apps/backend

```

2. Start the backend in development mode:

```bash

pnpm run dev

```

### Frontend

1. Navigate to the frontend directory:

```bash

cd apps/frontend

```

2. Start the development server:

```bash

pnpm run dev

```

---

## **Features**

### Frontend

* React-based UI with Vite for fast builds.
* Integrates shared components and types from `@tomeforge/shared`.

### Backend

* Node.js API with MongoDB (via Mongoose).
* Shared types and utilities for seamless integration.

### Shared Library

* Domain models (`System`, `Character`) and utility functions.
* Reusable UI components for rapid development.

---

## **Contributing**

We welcome contributions! Follow these steps:

1. Fork the repository.
2. Create a feature branch:

```bash

git checkout -b feature-name

```

3. Commit changes:

```bash

git commit -m "Add feature-name"

```

4. Push to your fork and create a pull request.

---

## **License**

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software, provided you include the original copyright and license notice.
