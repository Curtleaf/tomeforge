/**
 * Swagger UI and OpenAPI Documentation Routes
 *
 * This module provides routes for serving the API documentation
 * via Swagger UI interface.
 */

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import * as fs from 'fs';

const router = express.Router();

// Load the OpenAPI specification
const openapiPath = path.join(__dirname, '../../openapi.json');
let openapiSpec: any;

try {
  const openapiContent = fs.readFileSync(openapiPath, 'utf8');
  openapiSpec = JSON.parse(openapiContent);
} catch (error) {
  console.error('Failed to load OpenAPI specification:', error);
  openapiSpec = {
    openapi: '3.0.3',
    info: {
      title: 'TomeForge API',
      version: '1.0.0',
      description: 'OpenAPI specification not found. Please run `pnpm build-api-spec` to generate it.'
    },
    paths: {}
  };
}

// Serve Swagger UI at /api-docs
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(openapiSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TomeForge API Documentation'
}));

// Serve raw OpenAPI JSON at /openapi.json
router.get('/openapi.json', (req, res) => {
  res.json(openapiSpec);
});

export default router;
