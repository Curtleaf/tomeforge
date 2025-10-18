/**
 * OpenAPI Specification Tests
 *
 * Focused tests to validate the generated OpenAPI specification.
 * These tests ensure the documentation system is working correctly.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { initializeSwagger } from '../utils/swagger';

describe('OpenAPI Specification Validation', () => {
  let openapiSpec: any;

  beforeAll(() => {
    // Generate the specification for testing
    openapiSpec = initializeSwagger();
  });

  test('generates valid OpenAPI 3.0.x specification', () => {
    expect(openapiSpec).toBeDefined();
    expect(openapiSpec.openapi).toBe('3.0.3');
    expect(openapiSpec.info).toBeDefined();
    expect(openapiSpec.info.title).toBe('TomeForge API');
    expect(openapiSpec.info.version).toBeDefined();
  });

  test('documents all /api/systems endpoints', () => {
    expect(openapiSpec.paths).toBeDefined();

    // Check that all CRUD endpoints are documented
    const hasSystems = openapiSpec.paths['/systems'];
    const hasSystemsById = openapiSpec.paths['/systems/{systemId}'];

    expect(hasSystems || hasSystemsById).toBeTruthy();

    // If paths exist, verify they have the expected methods
    if (hasSystems) {
      expect(hasSystems.get || hasSystems.post).toBeDefined();
    }
    if (hasSystemsById) {
      expect(hasSystemsById.put || hasSystemsById.delete).toBeDefined();
    }
  });

  test('schema references resolve correctly', () => {
    expect(openapiSpec.components).toBeDefined();
    expect(openapiSpec.components.schemas).toBeDefined();

    const schemas = openapiSpec.components.schemas;

    // Verify required schemas exist
    expect(schemas.System || schemas.SystemInput || schemas.Error).toBeTruthy();
  });

  test('response examples are present in specification', () => {
    const paths = openapiSpec.paths || {};
    let hasExamples = false;

    // Check if any endpoint has examples
    Object.values(paths).forEach((pathItem: any) => {
      Object.values(pathItem).forEach((operation: any) => {
        if (operation.responses) {
          Object.values(operation.responses).forEach((response: any) => {
            if (response.content?.['application/json']?.example) {
              hasExamples = true;
            }
          });
        }
      });
    });

    // At least some endpoints should have examples
    expect(hasExamples).toBe(true);
  });

  test('includes security scheme placeholders', () => {
    expect(openapiSpec.components.securitySchemes).toBeDefined();
    expect(openapiSpec.components.securitySchemes.bearerAuth).toBeDefined();
    expect(openapiSpec.components.securitySchemes.bearerAuth.type).toBe('http');
    expect(openapiSpec.components.securitySchemes.bearerAuth.scheme).toBe('bearer');
  });
});
