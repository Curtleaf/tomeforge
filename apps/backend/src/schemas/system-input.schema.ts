/**
 * SystemInput JSON Schema
 *
 * Defines the JSON Schema for system creation payload.
 * This excludes auto-generated fields like _id and systemId.
 */

export const SystemInputSchema = {
  type: 'object',
  required: ['name', 'configuration', 'rules'],
  properties: {
    name: {
      type: 'string',
      description: 'Name of the game system',
      minLength: 1
    },
    description: {
      type: 'string',
      description: 'Description of the game system'
    },
    version: {
      type: 'string',
      description: 'Version of the game system'
    },
    author: {
      type: 'string',
      description: 'Author of the game system'
    },
    configuration: {
      type: 'object',
      required: ['stats', 'skills'],
      properties: {
        stats: {
          type: 'array',
          items: {
            type: 'object',
            required: ['statId', 'name', 'dataType'],
            properties: {
              statId: {
                type: 'number',
                description: 'Unique identifier for the stat'
              },
              name: {
                type: 'string',
                description: 'Name of the stat',
                minLength: 1
              },
              dataType: {
                type: 'string',
                enum: ['number', 'string'],
                description: 'Data type of the stat value'
              },
              order: {
                type: 'number',
                description: 'Display order (optional)'
              }
            }
          },
          description: 'Array of stat configurations'
        },
        skills: {
          type: 'array',
          items: {
            type: 'object',
            required: ['skillId', 'name', 'dataType'],
            properties: {
              skillId: {
                type: 'number',
                description: 'Unique identifier for the skill'
              },
              name: {
                type: 'string',
                description: 'Name of the skill',
                minLength: 1
              },
              dataType: {
                type: 'string',
                enum: ['number', 'string'],
                description: 'Data type of the skill value'
              },
              order: {
                type: 'number',
                description: 'Display order (optional)'
              }
            }
          },
          description: 'Array of skill configurations'
        }
      },
      description: 'System configuration including stats and skills'
    },
    rules: {
      type: 'object',
      required: ['diceRolling'],
      properties: {
        diceRolling: {
          type: 'object',
          required: ['type', 'dice', 'quantity'],
          properties: {
            type: {
              type: 'string',
              description: 'Type of dice rolling system'
            },
            dice: {
              type: 'number',
              description: 'Number of sides on the dice (e.g., 6 for d6, 20 for d20)'
            },
            quantity: {
              type: 'number',
              description: 'Number of dice to roll'
            },
            modifier: {
              type: 'number',
              description: 'Modifier to add to the roll (optional)'
            }
          },
          description: 'Dice rolling mechanics'
        }
      },
      description: 'System rules and mechanics'
    }
  },
  additionalProperties: false
};
