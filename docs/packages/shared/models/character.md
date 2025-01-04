# Character Module

This module defines the schema and model for characters in the game system.

## Schemas

### CharacterDataObjectSchema

Defines the data structure for a character's primary and secondary attributes.

- `characterDataId` (Number, Required): Unique identifier for the character data.
- `name` (String, Required): Name of the attribute or object.
- `primaryValue` (Mixed, Required): The main value for the character.
- `secondaryValues` (Array): A list of secondary attributes, each with:
  - `name` (String, Required): Name of the attribute.
  - `value` (Mixed, Required): Value of the attribute.
- `description` (String): Optional description.

### characterSchema

Defines the overall structure for characters.

- `id` (Number, Required): Unique identifier for the character.
- `name` (String, Required): Name of the character.
- `gameSystem` (Number): Reference to the associated game system.
- `data` (CharacterDataObjectSchema): Detailed data for the character.
- `systemConfiguration` (systemSchema): Configuration details for the system.

## Exports

- `CharacterModel`: The Mongoose model for characters.
- `CharacterType`: The TypeScript type for characters.
- `characterSchema`: The schema for characters.
