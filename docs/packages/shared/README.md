# TomeForge Shared Documentation

Welcome to the shared documentation for TomeForge! This documentation covers all aspects of the shared codebase, including data models, utilities, and database interactions.

## [**Getting Started**](http://localhost:3000/#/?id=getting-started)

The `@tomeforge/shared` package provides reusable types, utilities, and components designed to streamline development across the TomeForge monorepo. Follow these steps to integrate and utilize the shared package in your applications.

### **Installation**

To use the `@tomeforge/shared` package in your application:

1. Add the package as a dependency:

```bash
pnpm add @tomeforge/shared
```

2. Ensure TypeScript is configured with the correct path mappings:
   Update `tsconfig.json`:

```json
"paths": {
    "@tomeforge/shared/*": ["packages/shared/dist/*"]
}
```

### **Building the Package**

If you are working on the `@tomeforge/shared` package or need to rebuild it after making changes:

1. Navigate to the shared package directory:

```bash
cd packages/shared
```

2. Run the build script:

```bash
pnpm run build
```

This generates the `dist` directory containing compiled JavaScript and type definitions.

### **Using Shared Types and Utilities**

1. Import models, types, or utilities into your code:

```typescript
import { CharacterType, SystemType } from "@tomeforge/shared";
```

2. Use these types to ensure consistent data handling across your frontend and backend:

```typescript
const character: CharacterType = {
    id: 1,
    name: "Hero",
    gameSystem: 1001,
    data: {
    characterDataId: 101,
    name: "Strength",
    primaryValue: 10,
    secondaryValues: [
        { name: "Agility", value: 8 },
        { name: "Endurance", value: 7 }
    ]
    },
    systemConfiguration: {}
};
```

### **Development Tips**

* **Testing Changes Locally** :
  If you’re modifying the shared package and want to test it in another app (e.g., backend or frontend), link the package locally:

```bash
pnpm link
pnpm link @tomeforge/shared
```

* **Lint and Check Types** :
  Run linting and type-checking to ensure consistent quality:

```bash
pnpm run lint
pnpm run build
```

---

## Models

The `models` provides reusable schemas and models for defining and managing core entities in the TomeForge system. These models ensure consistent data structure and integration across the application.

### [System Model](packages/shared/models/system.md "This module defines the schema and model for game systems, including configurations and rules.")

The `System` model defines the structure of a tabletop game system. It includes:

* Configuration schemas for stats and skills
* Rules for gameplay, such as dice-rolling mechanics
* Metadata like system IDs, names, descriptions, and versioning

### [Character Model](packages/shared/models/character.md "This module defines the schema and model for characters in the game system.")

The `Character` model represents individual characters in a game system. It includes attributes such as:

* Unique identifiers
* Names and descriptive data
* Primary and secondary values for stats
* Associated system configurations for seamless game system integration
