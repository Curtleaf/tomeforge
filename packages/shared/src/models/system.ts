import { Schema, model, InferSchemaType } from "mongoose";

/**
 * Schema defining the configuration structure for game systems.
 * Includes stats and skills with their data types and ordering.
 */
const configurationsSchema = new Schema({
    stats: [
        {
            statId: { type: Number, required: true },
            name: { type: String, required: true },
            dataType: { type: String, enum: ['number', 'string'], required: true },
            order: { type: Number }, // Optional field
        },
    ],
    skills: [
        {
            skillId: { type: Number, required: true },
            name: { type: String, required: true },
            dataType: { type: String, enum: ['number', 'string'], required: true },
            order: { type: Number }, // Optional field
        },
    ],
    // ... other configurations
});

/**
 * Schema defining the rules for game systems.
 * Includes dice rolling mechanics and other game-specific rules.
 */
const rulesSchema = new Schema({
    diceRolling: {
        type: {
            type: String,
            required: true,
        },
        dice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        modifier: { type: Number }, // Optional field
    },
    // ... other rules
});

/**
 * Schema for a tabletop game system.
 * Defines the structure for system metadata, configuration, and rules.
 */
const systemSchema = new Schema({
    systemId: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String }, // Optional field
    version: { type: String }, // Optional field
    author: { type: String }, // Optional field
    configuration: { type: configurationsSchema, required: true },
    rules: { type: rulesSchema, required: true },
    // ... other metadata
});

/**
 * TypeScript type inferred from the system schema.
 */
type SystemType = InferSchemaType<typeof systemSchema>;

/**
 * Mongoose model for tabletop game systems.
 * Represents a game system with configuration and rules.
 */
const SystemModel = model<SystemType>('System', systemSchema);

export { SystemModel, SystemType, systemSchema };
