import { Schema, model, InferSchemaType } from "mongoose";
import { systemSchema } from "./system";

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
  
const characterSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  gameSystem: { type: Number },// Reference to the game system
  data: CharacterDataObjectSchema,
  systemConfiguration: systemSchema,
});

type CharacterType = InferSchemaType<typeof characterSchema>;

const CharacterModel = model<CharacterType>('Character', characterSchema);

export { CharacterModel, CharacterType, characterSchema }