/**
 * Swagger/OpenAPI Initialization Module
 *
 * This module initializes swagger-jsdoc with the configuration
 * and provides the OpenAPI specification object for use in the application.
 */

import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from '../config/swagger.config';

/**
 * Initialize and generate OpenAPI specification
 *
 * @returns OpenAPI specification object
 * @throws Error if specification generation fails
 */
export function initializeSwagger(): object {
  try {
    const openapiSpecification = swaggerJsdoc(swaggerOptions);

    if (!openapiSpecification) {
      throw new Error('Failed to generate OpenAPI specification');
    }

    return openapiSpecification;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Swagger initialization failed: ${errorMessage}`);
  }
}

/**
 * Get the generated OpenAPI specification
 * This is the main export for use in the application
 */
export const openapiSpec = initializeSwagger();
