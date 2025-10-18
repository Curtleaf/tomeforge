/**
 * Error Response JSON Schema
 *
 * Defines the standard error response format used across all API endpoints.
 * Matches the existing { error: string } pattern from route implementations.
 */

export const ErrorSchema = {
  type: 'object',
  required: ['error'],
  properties: {
    error: {
      type: 'string',
      description: 'Error message describing what went wrong'
    }
  },
  additionalProperties: false
};
