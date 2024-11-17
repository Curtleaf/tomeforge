import { Schema, model, InferSchemaType } from "mongoose";

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

type SystemType = InferSchemaType<typeof systemSchema>;

const SystemModel = model<SystemType>('System', systemSchema);

export { SystemModel, SystemType, systemSchema };
