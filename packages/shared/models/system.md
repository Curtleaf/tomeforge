# System Module

This module defines the schema and model for game systems, including configurations and rules.

## Schemas

### configurationsSchema

Defines the configuration settings for a game system.

- `stats` (Array): A list of stats with:
  - `statId` (Number, Required): Identifier for the stat.
  - `name` (String, Required): Name of the stat.
  - `dataType` (String, Required): Type of data (`number` or `string`).
  - `order` (Number): Optional display order.
- `skills` (Array): A list of skills with:
  - `skillId` (Number, Required): Identifier for the skill.
  - `name` (String, Required): Name of the skill.
  - `dataType` (String, Required): Type of data (`number` or `string`).
  - `order` (Number): Optional display order.

### rulesSchema

Defines the rules for gameplay, such as dice-rolling.

- `diceRolling` (Object): Dice rolling rules with:
  - `type` (String, Required): Type of dice rolling.
  - `dice` (Number, Required): Number of dice.
  - `quantity` (Number, Required): Quantity of dice to roll.
  - `modifier` (Number): Optional modifier.

### systemSchema

The main schema for game systems.

- `systemId` (Number, Required): Unique identifier for the system.
- `name` (String, Required): Name of the system.
- `description` (String): Optional description.
- `version` (String): Optional version number.
- `author` (String): Optional author name.
- `configuration` (configurationsSchema, Required): Configuration details.
- `rules` (rulesSchema, Required): Rules for the system.

## Exports

- `SystemModel`: The Mongoose model for systems.
- `SystemType`: The TypeScript type for systems.
- `systemSchema`: The schema for systems.
