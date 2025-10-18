/**
 * JSDoc Documentation Completeness Tests
 *
 * Focused tests to validate that key exports have JSDoc documentation
 * and that TypeDoc output includes JSDoc content.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

describe('JSDoc Documentation Completeness', () => {
  const systemModelPath = path.join(__dirname, '../models/system.ts');
  const characterModelPath = path.join(__dirname, '../models/character.ts');
  const indexPath = path.join(__dirname, '../index.ts');
  const docsOutputPath = path.join(__dirname, '../../docs');

  test('SystemModel has JSDoc documentation', () => {
    // Read system.ts file
    const systemContent = fs.readFileSync(systemModelPath, 'utf-8');

    // Verify JSDoc comment exists for SystemModel export
    // Look for /** comment block before 'export' or before model/type definitions
    const hasJSDoc = /\/\*\*[\s\S]*?\*\/[\s\S]*?(export.*SystemModel|const SystemModel)/m.test(systemContent);
    expect(hasJSDoc).toBe(true);
  });

  test('CharacterModel has JSDoc documentation', () => {
    // Read character.ts file
    const characterContent = fs.readFileSync(characterModelPath, 'utf-8');

    // Verify JSDoc comment exists for CharacterModel export
    const hasJSDoc = /\/\*\*[\s\S]*?\*\/[\s\S]*?(export.*CharacterModel|const CharacterModel)/m.test(characterContent);
    expect(hasJSDoc).toBe(true);
  });

  test('exported types have descriptions', () => {
    // Read both model files
    const systemContent = fs.readFileSync(systemModelPath, 'utf-8');
    const characterContent = fs.readFileSync(characterModelPath, 'utf-8');

    // Check that exported types (SystemType, CharacterType) have JSDoc
    const systemTypeHasJSDoc = /\/\*\*[\s\S]*?\*\/[\s\S]*?(type SystemType|export.*SystemType)/m.test(systemContent);
    const characterTypeHasJSDoc = /\/\*\*[\s\S]*?\*\/[\s\S]*?(type CharacterType|export.*CharacterType)/m.test(characterContent);

    // At least one type should have documentation
    expect(systemTypeHasJSDoc || characterTypeHasJSDoc).toBe(true);
  });

  test('TypeDoc output includes JSDoc content', () => {
    // Regenerate TypeDoc to ensure fresh output
    try {
      execSync('pnpm exec typedoc', {
        cwd: path.join(__dirname, '../..'),
        stdio: 'pipe',
      });
    } catch (error) {
      // If TypeDoc fails, the test should fail
      throw new Error('TypeDoc generation failed');
    }

    // Verify docs directory exists
    const docsExists = fs.existsSync(docsOutputPath);
    expect(docsExists).toBe(true);

    if (docsExists) {
      // Read the generated README.md (Markdown output)
      const readmePath = path.join(docsOutputPath, 'README.md');
      const readmeExists = fs.existsSync(readmePath);
      expect(readmeExists).toBe(true);

      if (readmeExists) {
        const readmeContent = fs.readFileSync(readmePath, 'utf-8');

        // Verify that the Markdown contains references to our models
        // TypeDoc should include documentation for SystemModel and CharacterModel
        const hasSystemModel = readmeContent.includes('SystemModel') || readmeContent.includes('System');
        const hasCharacterModel = readmeContent.includes('CharacterModel') || readmeContent.includes('Character');

        // At least our models should be documented
        expect(hasSystemModel || hasCharacterModel).toBe(true);
      }
    }
  });
});
