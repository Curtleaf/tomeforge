/**
 * TypeDoc Configuration and Build Tests
 *
 * Focused tests to validate TypeDoc configuration and documentation generation.
 * These tests ensure the documentation system is working correctly for the shared package.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

describe('TypeDoc Configuration', () => {
  const typedocConfigPath = path.join(__dirname, '../../typedoc.json');
  const docsOutputPath = path.join(__dirname, '../../docs');

  test('typedoc.json exists with required fields', () => {
    const exists = fs.existsSync(typedocConfigPath);
    expect(exists).toBe(true);

    if (exists) {
      const config = fs.readJSONSync(typedocConfigPath);

      // Verify required configuration fields
      expect(config.entryPoints).toBeDefined();
      expect(Array.isArray(config.entryPoints)).toBe(true);
      expect(config.entryPoints).toContain('src/index.ts');

      expect(config.out).toBe('docs');

      expect(config.exclude).toBeDefined();
      expect(Array.isArray(config.exclude)).toBe(true);

      expect(config.excludePrivate).toBe(true);
      expect(config.excludeProtected).toBe(true);
      expect(config.excludeInternal).toBe(true);
      expect(config.includeVersion).toBe(true);
      expect(config.readme).toBe('none');
    }
  });

  test('TypeDoc generates Markdown output to correct location', () => {
    // Run TypeDoc to generate documentation
    try {
      execSync('pnpm exec typedoc', {
        cwd: path.join(__dirname, '../..'),
        stdio: 'pipe',
      });
    } catch (error) {
      // TypeDoc may fail if not installed yet, but we'll verify in later tests
    }

    // Verify that docs directory exists
    const docsExists = fs.existsSync(docsOutputPath);
    expect(docsExists).toBe(true);

    if (docsExists) {
      // Verify that README.md is generated (Markdown output)
      const readmePath = path.join(docsOutputPath, 'README.md');
      const readmeExists = fs.existsSync(readmePath);
      expect(readmeExists).toBe(true);
    }
  });

  test('test files are excluded from documentation', () => {
    // This test verifies the exclude patterns in typedoc.json
    const config = fs.readJSONSync(typedocConfigPath);
    const excludePatterns = config.exclude || [];

    // Verify test exclusion patterns exist
    const hasTestExclusion = excludePatterns.some((pattern: string) =>
      pattern.includes('*.test.ts') || pattern.includes('*.spec.ts')
    );
    expect(hasTestExclusion).toBe(true);

    // Verify node_modules exclusion
    const hasNodeModulesExclusion = excludePatterns.some((pattern: string) =>
      pattern.includes('node_modules')
    );
    expect(hasNodeModulesExclusion).toBe(true);

    // Verify dist exclusion
    const hasDistExclusion = excludePatterns.some((pattern: string) =>
      pattern.includes('dist')
    );
    expect(hasDistExclusion).toBe(true);
  });

  test('documentation generation completes successfully', () => {
    // Run TypeDoc and verify it completes without errors
    let success = false;
    try {
      execSync('pnpm exec typedoc', {
        cwd: path.join(__dirname, '../..'),
        stdio: 'pipe',
      });
      success = true;
    } catch (error) {
      success = false;
    }

    expect(success).toBe(true);
  });
});
