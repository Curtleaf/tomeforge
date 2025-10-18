/**
 * TypeDoc Build Integration Tests
 *
 * Focused tests to validate build script integration and workflow.
 * These tests ensure TypeDoc integrates correctly with the build system.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

describe('TypeDoc Build Integration', () => {
  const rootDir = path.join(__dirname, '../../../..');
  const sharedDocsPath = path.join(__dirname, '../../docs');
  const centralDocsPath = path.join(rootDir, 'docs/packages/shared');

  test('build-typedoc script executes successfully', () => {
    // Clean docs directory first
    if (fs.existsSync(sharedDocsPath)) {
      fs.removeSync(sharedDocsPath);
    }

    // Run build-typedoc from root
    let success = false;
    let error: any = null;
    try {
      execSync('pnpm build-typedoc', {
        cwd: rootDir,
        stdio: 'pipe',
      });
      success = true;
    } catch (err) {
      error = err;
      success = false;
    }

    // Verify build succeeded
    expect(success).toBe(true);
    if (!success && error) {
      console.error('build-typedoc failed:', error.message);
    }

    // Verify output was created
    const docsExists = fs.existsSync(sharedDocsPath);
    expect(docsExists).toBe(true);

    // Verify README.md exists (Markdown output)
    if (docsExists) {
      const readmePath = path.join(sharedDocsPath, 'README.md');
      const readmeExists = fs.existsSync(readmePath);
      expect(readmeExists).toBe(true);
    }
  });

  test('sync-docs.js copies TypeDoc output to central docs/', () => {
    // Ensure TypeDoc output exists
    if (!fs.existsSync(sharedDocsPath)) {
      execSync('cd packages/shared && pnpm exec typedoc', {
        cwd: rootDir,
        stdio: 'pipe',
      });
    }

    // Run sync-docs.js
    execSync('node sync-docs.js', {
      cwd: rootDir,
      stdio: 'pipe',
    });

    // Verify central docs directory was created
    const centralDocsExists = fs.existsSync(centralDocsPath);
    expect(centralDocsExists).toBe(true);

    if (centralDocsExists) {
      // Verify README.md was copied (Markdown output)
      const centralReadmePath = path.join(centralDocsPath, 'README.md');
      const centralReadmeExists = fs.existsSync(centralReadmePath);
      expect(centralReadmeExists).toBe(true);

      // Verify type-aliases or variables directories were copied
      const typeAliasesPath = path.join(centralDocsPath, 'type-aliases');
      const variablesPath = path.join(centralDocsPath, 'variables');
      const hasDirs = fs.existsSync(typeAliasesPath) || fs.existsSync(variablesPath);
      expect(hasDirs).toBe(true);
    }
  });

  test('build-docs includes TypeDoc generation step', () => {
    // Clean both docs directories
    if (fs.existsSync(sharedDocsPath)) {
      fs.removeSync(sharedDocsPath);
    }
    if (fs.existsSync(centralDocsPath)) {
      fs.removeSync(centralDocsPath);
    }

    // Run full build-docs workflow
    let success = false;
    try {
      execSync('pnpm build-docs', {
        cwd: rootDir,
        stdio: 'pipe',
        timeout: 60000, // 60 second timeout
      });
      success = true;
    } catch (error) {
      success = false;
    }

    // Verify build-docs succeeded
    expect(success).toBe(true);

    // Verify TypeDoc output exists in source location
    const sourceDocsExists = fs.existsSync(sharedDocsPath);
    expect(sourceDocsExists).toBe(true);

    // Verify TypeDoc output was synced to central docs
    const centralDocsExists = fs.existsSync(centralDocsPath);
    expect(centralDocsExists).toBe(true);

    // Verify key files exist in central docs
    if (centralDocsExists) {
      const readmePath = path.join(centralDocsPath, 'README.md');
      expect(fs.existsSync(readmePath)).toBe(true);
    }
  });

  test('build process completes in under 30 seconds', () => {
    // This test verifies TypeDoc generation performance
    const startTime = Date.now();

    try {
      execSync('cd packages/shared && pnpm exec typedoc', {
        cwd: rootDir,
        stdio: 'pipe',
      });
    } catch (error) {
      // Even if it fails, we measure the time
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // Convert to seconds

    // Verify TypeDoc completes within performance budget
    expect(duration).toBeLessThan(30);
  });
});
