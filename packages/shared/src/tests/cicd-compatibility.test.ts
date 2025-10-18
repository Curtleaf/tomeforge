/**
 * CI/CD Compatibility Tests
 *
 * Focused tests to validate CI/CD workflow compatibility and documentation deployment.
 * These tests ensure TypeDoc integrates correctly with the CI/CD pipeline.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';
import * as yaml from 'js-yaml';

describe('CI/CD Compatibility', () => {
  const rootDir = path.join(__dirname, '../../../..');
  const sharedDocsPath = path.join(__dirname, '../../docs');
  const centralDocsPath = path.join(rootDir, 'docs/packages/shared');
  const workflowPath = path.join(rootDir, '.github/workflows/deploy-docs.yml');

  test('build-docs runs successfully in clean environment', () => {
    // Clean all documentation directories to simulate CI/CD clean environment
    if (fs.existsSync(sharedDocsPath)) {
      fs.removeSync(sharedDocsPath);
    }
    if (fs.existsSync(centralDocsPath)) {
      fs.removeSync(centralDocsPath);
    }

    // Run build-docs as CI/CD would
    let success = false;
    let error: any = null;
    try {
      execSync('pnpm build-docs', {
        cwd: rootDir,
        stdio: 'pipe',
        timeout: 60000, // 60 second timeout
      });
      success = true;
    } catch (err) {
      error = err;
      success = false;
    }

    // Verify build succeeded
    expect(success).toBe(true);
    if (!success && error) {
      console.error('build-docs failed in clean environment:', error.message);
    }

    // Verify all expected outputs exist
    expect(fs.existsSync(sharedDocsPath)).toBe(true);
    expect(fs.existsSync(centralDocsPath)).toBe(true);
    expect(fs.existsSync(path.join(centralDocsPath, 'README.md'))).toBe(true);
  });

  test('TypeDoc output is deployable (valid Markdown)', () => {
    // Ensure TypeDoc output exists
    if (!fs.existsSync(centralDocsPath)) {
      execSync('pnpm build-docs', {
        cwd: rootDir,
        stdio: 'pipe',
      });
    }

    // Verify README.md exists and is valid Markdown
    const readmePath = path.join(centralDocsPath, 'README.md');
    expect(fs.existsSync(readmePath)).toBe(true);

    if (fs.existsSync(readmePath)) {
      const readmeContent = fs.readFileSync(readmePath, 'utf-8');

      // Verify basic Markdown structure
      expect(readmeContent).toContain('#');  // Contains headers
      expect(readmeContent).toContain('@tomeforge/shared');  // Package name

      // Verify it contains TypeDoc-generated content
      expect(readmeContent).toMatch(/Type Aliases|Variables/);  // TypeDoc sections

      // Verify no build errors in content
      expect(readmeContent.toLowerCase()).not.toContain('error:');
      expect(readmeContent.toLowerCase()).not.toContain('failed to');

      // Verify Markdown links exist
      expect(readmeContent).toContain('.md');  // Markdown file links
    }
  });

  test('documentation structure compatible with Docsify', () => {
    // Verify TypeDoc output is in correct location for Docsify
    const centralDocsExists = fs.existsSync(centralDocsPath);
    expect(centralDocsExists).toBe(true);

    if (centralDocsExists) {
      // Verify README.md is present (Docsify entry point)
      const readmePath = path.join(centralDocsPath, 'README.md');
      expect(fs.existsSync(readmePath)).toBe(true);

      // Verify type-aliases and variables directories exist
      const typeAliasesPath = path.join(centralDocsPath, 'type-aliases');
      const variablesPath = path.join(centralDocsPath, 'variables');
      expect(fs.existsSync(typeAliasesPath) || fs.existsSync(variablesPath)).toBe(true);

      // Verify documentation is in docs/packages/shared/ structure
      // This matches the expected Docsify directory structure
      const relativePath = path.relative(rootDir, centralDocsPath);
      expect(relativePath).toBe('docs/packages/shared');
    }
  });

  test('CI/CD workflow file syntax is valid', () => {
    // Verify workflow file exists
    const workflowExists = fs.existsSync(workflowPath);
    expect(workflowExists).toBe(true);

    if (workflowExists) {
      // Read and parse YAML to verify syntax
      const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
      let parsedYaml: any;
      let parseSuccess = false;

      try {
        parsedYaml = yaml.load(workflowContent);
        parseSuccess = true;
      } catch (error) {
        parseSuccess = false;
      }

      expect(parseSuccess).toBe(true);

      // Verify the workflow includes build-docs step
      if (parseSuccess && parsedYaml) {
        const deployJob = parsedYaml.jobs?.deploy;
        expect(deployJob).toBeDefined();

        const steps = deployJob?.steps || [];
        const syncDocStep = steps.find((step: any) =>
          step.name === 'Sync Documentation' ||
          (step.run && step.run.includes('build-docs'))
        );

        expect(syncDocStep).toBeDefined();
        expect(syncDocStep.run).toContain('npm run build-docs');
      }
    }
  });
});
