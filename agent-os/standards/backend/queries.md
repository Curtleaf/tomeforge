## Database query best practices

### TomeForge Mongoose Query Standards

- **Data Access Layer**: All database queries are isolated in `apps/backend/src/data-access/` directory
- **Service Layer**: Services in `apps/backend/src/services/` call data access functions
- **Model Import**: Import models from `@tomeforge/shared` (e.g., `SystemModel`, `CharacterModel`)
- **Type Safety**: Use Mongoose TypeScript types (`SystemType`, `CharacterType`) for type safety
- **Async/Await**: Always use async/await for database operations
- **Error Handling**: Let errors propagate to service layer for consistent error handling

### Query Patterns

#### Find Operations
```typescript
// Get all documents
await SystemModel.find();

// Find by business ID
await SystemModel.findOne({ systemId: id });

// Select specific fields
await SystemModel.find().select('name description');
```

#### Create Operations
```typescript
// Create from type-safe data
const newSystem = new SystemModel(systemData);
await newSystem.save();
```

#### Update Operations
```typescript
// Find and update
await SystemModel.findOneAndUpdate(
  { systemId: id },
  updates,
  { new: true } // Return updated document
);
```

#### Delete Operations
```typescript
// Find and delete
await SystemModel.findOneAndDelete({ systemId: id });
```

### Best Practices
- **Avoid N+1 Queries**: Use `.populate()` for referenced documents
- **Index Fields**: Add indexes on `systemId`, `characterId`, and other frequently queried fields
- **Connection Management**: Database connection is cached in `apps/backend/src/utils/db/db.ts`
- **Error Handling**: Catch and log errors, throw meaningful error messages
- **Validation**: Mongoose validates against schema automatically
