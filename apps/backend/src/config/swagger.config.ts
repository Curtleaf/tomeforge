/**
 * Swagger/OpenAPI Configuration for TomeForge API
 *
 * This configuration defines the OpenAPI 3.0.x specification metadata
 * for the TomeForge API documentation.
 */

import { SystemInputSchema } from '../schemas/system-input.schema';
import { ErrorSchema } from '../schemas/error.schema';

export const swaggerDefinition = {
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
      SystemInput: SystemInputSchema,
      Error: ErrorSchema,
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
};

/**
 * swagger-jsdoc configuration options
 */
export const swaggerOptions = {
  definition: swaggerDefinition,
  // API file paths to scan for JSDoc annotations
  apis: [
    './src/routes/**/*.ts',
    './dist/routes/**/*.js'
  ]
};
