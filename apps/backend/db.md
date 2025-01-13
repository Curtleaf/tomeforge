# Database Module Documentation

This section provides detailed information about the database module responsible for connecting to MongoDB.

## Functions

### connectToDatabase

Establishes a connection to the MongoDB database.

#### Returns

- **Type**: `Promise<typeof mongoose>`

#### Example Usage

```typescript
await connectToDatabase();
console.log('Connected to MongoDB');
```
