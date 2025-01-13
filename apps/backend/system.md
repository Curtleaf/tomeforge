# System Module Documentation

This section provides detailed information about the system module, which handles all CRUD operations related to systems.

## Functions

### getAllSystems

Retrieves a list of all systems.

#### Returns

- **Type**: `Promise<SystemType[]>`

#### Example Usage

```typescript
const systems = await getAllSystems();
console.log(systems);
```

### createSystem

Creates a new system with the provided data.

#### Parameters

- **systemData** (`SystemType`): The data for the new system.

#### Returns

- **Type**: `Promise<SystemType>`

#### Example Usage

```typescript
const newSystem = await createSystem({ name: 'New System', description: 'A new system' });
console.log(newSystem);
```

### updateSystem

Updates an existing system with the specified ID using the provided updates.

#### Parameters

- **systemId** (`number`): The ID of the system to be updated.
- **updates** (`Partial<SystemType>`): The partial data to update.

#### Returns

- **Type**: `Promise<SystemType | null>`

#### Example Usage

```typescript
const updatedSystem = await updateSystem(1, { description: 'Updated Description' });
console.log(updatedSystem);
```

### removeSystem

Removes a system with the specified ID.

#### Parameters

- **systemId** (`number`): The ID of the system to be removed.

#### Returns

- **Type**: `Promise<boolean>`

#### Example Usage

```typescript
const isRemoved = await removeSystem(1);
console.log(isRemoved ? 'System Removed' : 'System Not Found');
```
