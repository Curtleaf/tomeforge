/**
 * API Documentation Tests
 *
 * Strategic tests to validate critical API documentation functionality.
 * These tests complement openapi.spec.test.ts by covering hosting,
 * file generation, and specific endpoint documentation details.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { initializeSwagger } from '../utils/swagger';

describe('API Documentation - File Generation', () => {
  test('openapi.json exists at backend location', () => {
    const backendPath = path.join(__dirname, '../../openapi.json');
    const exists = fs.existsSync(backendPath);
    expect(exists).toBe(true);
  });

  test('openapi.json exists at docs location', () => {
    const docsPath = path.join(__dirname, '../../../../docs/openapi.json');
    const exists = fs.existsSync(docsPath);
    expect(exists).toBe(true);
  });

  test('both openapi.json files have identical content', () => {
    const backendPath = path.join(__dirname, '../../openapi.json');
    const docsPath = path.join(__dirname, '../../../../docs/openapi.json');

    const backendContent = fs.readFileSync(backendPath, 'utf8');
    const docsContent = fs.readFileSync(docsPath, 'utf8');

    expect(backendContent).toBe(docsContent);
  });
});

describe('API Documentation - OpenAPI Structure', () => {
  let openapiSpec: any;

  beforeAll(() => {
    openapiSpec = initializeSwagger();
  });

  test('includes all required OpenAPI components', () => {
    // Verify all top-level required components exist
    expect(openapiSpec.openapi).toBeDefined();
    expect(openapiSpec.info).toBeDefined();
    expect(openapiSpec.paths).toBeDefined();
    expect(openapiSpec.components).toBeDefined();
    expect(openapiSpec.servers).toBeDefined();
    expect(openapiSpec.tags).toBeDefined();
  });

  test('documentation reflects /api/v1/ structure in servers', () => {
    expect(openapiSpec.servers).toBeDefined();
    expect(Array.isArray(openapiSpec.servers)).toBe(true);
    expect(openapiSpec.servers.length).toBeGreaterThan(0);

    // Check that /api/v1 server is present
    const hasV1Server = openapiSpec.servers.some(
      (server: any) => server.url === '/api/v1'
    );
    expect(hasV1Server).toBe(true);
  });

  test('Error schema has correct structure', () => {
    const errorSchema = openapiSpec.components?.schemas?.Error;

    expect(errorSchema).toBeDefined();
    expect(errorSchema.type).toBe('object');
    expect(errorSchema.required).toContain('error');
    expect(errorSchema.properties).toBeDefined();
    expect(errorSchema.properties.error).toBeDefined();
    expect(errorSchema.properties.error.type).toBe('string');
  });
});

describe('API Documentation - Endpoint Coverage', () => {
  let openapiSpec: any;

  beforeAll(() => {
    openapiSpec = initializeSwagger();
  });

  test('all CRUD methods are documented for systems endpoints', () => {
    const systemsPath = openapiSpec.paths?.['/systems'];
    const systemsByIdPath = openapiSpec.paths?.['/systems/{systemId}'];

    // Verify GET and POST on /systems
    expect(systemsPath).toBeDefined();
    expect(systemsPath.get).toBeDefined();
    expect(systemsPath.post).toBeDefined();

    // Verify PUT and DELETE on /systems/{systemId}
    expect(systemsByIdPath).toBeDefined();
    expect(systemsByIdPath.put).toBeDefined();
    expect(systemsByIdPath.delete).toBeDefined();
  });

  test('path parameters are documented for parameterized endpoints', () => {
    const putEndpoint = openapiSpec.paths?.['/systems/{systemId}']?.put;
    const deleteEndpoint = openapiSpec.paths?.['/systems/{systemId}']?.delete;

    // Check PUT endpoint has systemId parameter
    expect(putEndpoint).toBeDefined();
    expect(putEndpoint.parameters).toBeDefined();
    expect(Array.isArray(putEndpoint.parameters)).toBe(true);
    expect(putEndpoint.parameters.length).toBeGreaterThan(0);

    const putParam = putEndpoint.parameters.find((p: any) => p.name === 'systemId');
    expect(putParam).toBeDefined();
    expect(putParam.in).toBe('path');
    expect(putParam.required).toBe(true);

    // Check DELETE endpoint has systemId parameter
    expect(deleteEndpoint).toBeDefined();
    expect(deleteEndpoint.parameters).toBeDefined();

    const deleteParam = deleteEndpoint.parameters.find((p: any) => p.name === 'systemId');
    expect(deleteParam).toBeDefined();
    expect(deleteParam.in).toBe('path');
    expect(deleteParam.required).toBe(true);
  });

  test('request bodies are documented for POST and PUT endpoints', () => {
    const postEndpoint = openapiSpec.paths?.['/systems']?.post;
    const putEndpoint = openapiSpec.paths?.['/systems/{systemId}']?.put;

    // Check POST has request body
    expect(postEndpoint).toBeDefined();
    expect(postEndpoint.requestBody).toBeDefined();
    expect(postEndpoint.requestBody.required).toBe(true);
    expect(postEndpoint.requestBody.content).toBeDefined();
    expect(postEndpoint.requestBody.content['application/json']).toBeDefined();

    // Check PUT has request body
    expect(putEndpoint).toBeDefined();
    expect(putEndpoint.requestBody).toBeDefined();
    expect(putEndpoint.requestBody.required).toBe(true);
    expect(putEndpoint.requestBody.content).toBeDefined();
    expect(putEndpoint.requestBody.content['application/json']).toBeDefined();
  });

  test('appropriate HTTP status codes are documented for each endpoint', () => {
    const getEndpoint = openapiSpec.paths?.['/systems']?.get;
    const postEndpoint = openapiSpec.paths?.['/systems']?.post;
    const putEndpoint = openapiSpec.paths?.['/systems/{systemId}']?.put;
    const deleteEndpoint = openapiSpec.paths?.['/systems/{systemId}']?.delete;

    // GET should have 200 and 500
    expect(getEndpoint.responses['200']).toBeDefined();
    expect(getEndpoint.responses['500']).toBeDefined();

    // POST should have 201 and 400
    expect(postEndpoint.responses['201']).toBeDefined();
    expect(postEndpoint.responses['400']).toBeDefined();

    // PUT should have 200, 400, and 404
    expect(putEndpoint.responses['200']).toBeDefined();
    expect(putEndpoint.responses['400']).toBeDefined();
    expect(putEndpoint.responses['404']).toBeDefined();

    // DELETE should have 204, 404, and 500
    expect(deleteEndpoint.responses['204']).toBeDefined();
    expect(deleteEndpoint.responses['404']).toBeDefined();
    expect(deleteEndpoint.responses['500']).toBeDefined();
  });
});
