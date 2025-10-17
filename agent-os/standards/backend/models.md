## Database model best practices

### TomeForge Mongoose Model Standards

- **Location**: All models are defined in `packages/shared/src/models/` to be shared between backend and frontend
- **Model Naming**: Use PascalCase with "Model" suffix (e.g., `SystemModel`, `CharacterModel`)
- **Schema Naming**: Use camelCase with "Schema" suffix (e.g., `systemSchema`, `characterSchema`)
- **Type Export**: Export TypeScript types using `InferSchemaType<typeof schema>` (e.g., `SystemType`, `CharacterType`)
- **Required Fields**: Use `{ type: Type, required: true }` for mandatory fields
- **Optional Fields**: Omit `required` flag for optional fields (add comments noting they're optional)
- **Enums**: Use `enum: ['value1', 'value2']` for restricted string values
- **Nested Schemas**: Define complex objects as separate schemas before embedding (e.g., `configurationsSchema`, `rulesSchema`)
- **Mixed Types**: Use `Schema.Types.Mixed` sparingly; document when used (e.g., for flexible stat values)
- **ID Fields**: Use numeric `systemId`, `characterId`, etc. for business IDs (MongoDB provides `_id` automatically)

### Current Models

#### SystemModel (`packages/shared/src/models/system.ts`)
- **configuration**: Contains `stats[]` and `skills[]` arrays with:
  - `statId`/`skillId` (Number, required)
  - `name` (String, required)
  - `dataType` (enum: 'number' | 'string', required)
  - `order` (Number, optional)
- **rules**: Contains dice rolling mechanics:
  - `diceRolling.type` (String, required)
  - `diceRolling.dice` (Number, required)
  - `diceRolling.quantity` (Number, required)
  - `diceRolling.modifier` (Number, optional)

#### CharacterModel (`packages/shared/src/models/character.ts`)
- References `SystemModel` via `systemConfiguration` (embedded schema)
- Contains flexible `CharacterDataObject` with primary/secondary values
- Uses `Schema.Types.Mixed` for flexible value types (documented in code)

### Best Practices
- **Data Integrity**: Use `required: true` and `enum` constraints
- **Validation**: Implement validation in Mongoose schemas
- **Timestamps**: Consider adding `{ timestamps: true }` to schemas for `createdAt`/`updatedAt`
- **Indexes**: Add indexes on frequently queried fields (systemId, characterId)
