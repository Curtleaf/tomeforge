import { Schema, model, InferSchemaType } from "mongoose";
import { systemSchema } from "./system";

/**
 * Schema for character data objects.
 * Defines character attributes with primary and secondary values.
 */
const CharacterDataObjectSchema = new Schema({
      characterDataId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    primaryValue: {
      type: Schema.Types.Mixed,// not best practice
      required: true,
    },
    secondaryValues: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: Schema.Types.Mixed,
          required: true,
        },
      },
    ],
    description: {
      type: String,
    },
  });

/**
 * Schema for player characters.
 * Links characters to their game system and stores character-specific data.
 */
const characterSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  gameSystem: { type: Number },// Reference to the game system
  data: CharacterDataObjectSchema,
  systemConfiguration: systemSchema,
});

/**
 * TypeScript type inferred from the character schema.
 */
type CharacterType = InferSchemaType<typeof characterSchema>;

/**
 * Mongoose model for player characters.
 * Represents a player character with data and system configuration.
 */
const CharacterModel = model<CharacterType>('Character', characterSchema);

export { CharacterModel, CharacterType, characterSchema }
