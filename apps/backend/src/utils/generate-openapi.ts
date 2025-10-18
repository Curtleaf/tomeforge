/**
 * OpenAPI Specification Generator
 *
 * This script generates the static openapi.json file from JSDoc annotations
 * and saves it to multiple locations for different hosting strategies.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { initializeSwagger } from './swagger';

async function generateOpenApiSpec() {
  try {
    console.log('Generating OpenAPI specification...');

    // Generate the specification
    const openapiSpec = initializeSwagger();

    // Define output paths
    const backendOutputPath = path.join(__dirname, '../../openapi.json');
    const docsOutputPath = path.join(__dirname, '../../../../docs/openapi.json');

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

export { generateOpenApiSpec };
