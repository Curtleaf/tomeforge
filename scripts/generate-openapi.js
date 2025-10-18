/**
 * OpenAPI Specification Generator
 *
 * This script generates the static openapi.json file from JSDoc annotations
 * and saves it to multiple locations for different hosting strategies.
 */

const fs = require('fs-extra');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

// Import the swagger configuration (we'll need to compile the backend first)
const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'TomeForge API',
      version: '1.0.0',
      description: 'System-agnostic tabletop game management API. Note: Current implementation uses `/api/` paths. Migration to `/api/v1/` is planned for future versioning.',
      contact: {
        name: 'TomeForge',
        url: 'https://github.com/curtleaf/tomeforge'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1 (upcoming migration from /api)'
      },
      {
        url: '/api',
        description: 'Current API base path'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Authentication placeholder - not yet implemented. JWT-based authentication will be added in future releases.'
        }
      },
      schemas: {
        SystemInput: {
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
                      statId: { type: 'number', description: 'Unique identifier for the stat' },
                      name: { type: 'string', description: 'Name of the stat', minLength: 1 },
                      dataType: { type: 'string', enum: ['number', 'string'], description: 'Data type of the stat value' },
                      order: { type: 'number', description: 'Display order (optional)' }
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
                      skillId: { type: 'number', description: 'Unique identifier for the skill' },
                      name: { type: 'string', description: 'Name of the skill', minLength: 1 },
                      dataType: { type: 'string', enum: ['number', 'string'], description: 'Data type of the skill value' },
                      order: { type: 'number', description: 'Display order (optional)' }
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
                    type: { type: 'string', description: 'Type of dice rolling system' },
                    dice: { type: 'number', description: 'Number of sides on the dice (e.g., 6 for d6, 20 for d20)' },
                    quantity: { type: 'number', description: 'Number of dice to roll' },
                    modifier: { type: 'number', description: 'Modifier to add to the roll (optional)' }
                  },
                  description: 'Dice rolling mechanics'
                }
              },
              description: 'System rules and mechanics'
            }
          },
          additionalProperties: false
        },
        Error: {
          type: 'object',
          required: ['error'],
          properties: {
            error: {
              type: 'string',
              description: 'Error message describing what went wrong'
            }
          },
          additionalProperties: false
        },
        System: {
          allOf: [
            { $ref: '#/components/schemas/SystemInput' },
            {
              type: 'object',
              required: ['systemId', '_id'],
              properties: {
                systemId: {
                  type: 'number',
                  description: 'Unique numeric identifier for the system'
                },
                _id: {
                  type: 'string',
                  description: 'MongoDB document ID'
                }
              }
            }
          ],
          description: 'Complete system object including auto-generated fields'
        }
      }
    },
    tags: [
      {
        name: 'Systems',
        description: 'Game system management endpoints'
      }
    ]
  },
  apis: [
    path.join(__dirname, '../apps/backend/dist/routes/**/*.js'),
    path.join(__dirname, '../apps/backend/src/routes/**/*.ts')
  ]
};

async function generateOpenApiSpec() {
  try {
    console.log('Generating OpenAPI specification...');

    // Generate the specification
    const openapiSpec = swaggerJsdoc(swaggerOptions);

    if (!openapiSpec) {
      throw new Error('Failed to generate OpenAPI specification');
    }

    // Define output paths
    const backendOutputPath = path.join(__dirname, '../apps/backend/openapi.json');
    const docsOutputPath = path.join(__dirname, '../docs/openapi.json');

    // Ensure output directories exist
    await fs.ensureDir(path.dirname(backendOutputPath));
    await fs.ensureDir(path.dirname(docsOutputPath));

    // Write specification to both locations
    await fs.writeJson(backendOutputPath, openapiSpec, { spaces: 2 });
    console.log(`✓ OpenAPI spec written to: ${backendOutputPath}`);

    await fs.writeJson(docsOutputPath, openapiSpec, { spaces: 2 });
    console.log(`✓ OpenAPI spec written to: ${docsOutputPath}`);

    console.log('OpenAPI specification generation completed successfully');
    return openapiSpec;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to generate OpenAPI specification:', errorMessage);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  generateOpenApiSpec()
    .then(() => {
      console.log('Done');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { generateOpenApiSpec };
