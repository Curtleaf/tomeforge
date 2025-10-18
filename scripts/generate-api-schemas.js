/**
 * Schema Generation Script
 *
 * This script uses typescript-json-schema to extract JSON schemas
 * from TypeScript types in the @tomeforge/shared package.
 *
 * Generated schemas are used in the OpenAPI specification to document
 * request/response formats.
 */

const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function generateSchemas() {
  try {
    console.log('Starting schema generation...');

    const sharedPath = path.join(__dirname, '../packages/shared');
    const outputDir = path.join(__dirname, '../apps/backend/src/generated');
    const outputPath = path.join(outputDir, 'schemas.json');

    // Ensure output directory exists
    await fs.ensureDir(outputDir);

    // Ensure shared package is compiled
    console.log('Building shared package...');
    await execAsync('cd packages/shared && pnpm build');

    // Generate schemas from TypeScript types
    console.log('Generating JSON schemas from TypeScript types...');
    const tsConfigPath = path.join(sharedPath, 'tsconfig.json');
    const schemaPath = path.join(sharedPath, 'src/models/system.ts');

    const command = `npx typescript-json-schema ${tsConfigPath} SystemType --out ${outputPath} --required --noExtraProps --strictNullChecks --include ${schemaPath}`;

    await execAsync(command);

    console.log(`Schemas generated successfully at: ${outputPath}`);

    // Read and validate the generated schema
    const generatedSchema = await fs.readJson(outputPath);
    if (!generatedSchema.definitions && !generatedSchema.$ref) {
      console.warn('Warning: Generated schema may be incomplete');
    }

    return outputPath;
  } catch (error) {
    console.error('Schema generation failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  generateSchemas()
    .then(() => {
      console.log('Schema generation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { generateSchemas };
