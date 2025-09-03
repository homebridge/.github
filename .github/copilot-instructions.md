# Homebridge GitHub Organization Configuration Repository

This repository contains GitHub organization configuration files, reusable workflows, community health files, and npm version management scripts for the Homebridge organization. It is NOT a traditional application or library - it contains no source code to build or run.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

**CRITICAL**: This repository has NO traditional build process. There is no package.json, no source code compilation, and no application to run. Instead, focus on validating configuration files and scripts.

### Prerequisites and Dependencies
- Node.js 20.19.4+ (verify with `node --version`)
- npm 10.8.2+ (verify with `npm --version`) 
- yamllint (for YAML validation)
- markdownlint-cli (install with `npm install -g markdownlint-cli`)

### Repository Structure Validation
- Validate YAML workflow files: `yamllint .github/workflows/*.yml` -- takes 1-2 seconds. NEVER CANCEL.
- Validate JavaScript syntax: `node -c .github/npm-version-script.js && node -c .github/npm-version-script-esm.js` -- takes 1-2 seconds.
- Validate Markdown files: `markdownlint *.md profile/*.md` -- takes 1-2 seconds.

### Testing NPM Version Scripts
```bash
# Test CommonJS version
cd /tmp && mkdir test-npm-script && cd test-npm-script
echo '{"name": "@homebridge/test", "version": "1.0.0"}' > package.json
echo '{"version": "1.0.0"}' > package-lock.json
node /path/to/.github/npm-version-script.js refs/heads/beta-1.2.3 beta

# Test ESM version
cd /tmp && mkdir test-npm-script-esm && cd test-npm-script-esm
echo '{"name": "@homebridge/test-esm", "version": "2.0.0", "type": "module"}' > package.json
echo '{"version": "2.0.0"}' > package-lock.json
node /path/to/.github/npm-version-script-esm.js refs/heads/alpha-2.1.0 alpha
```
Time expectation: 1-2 seconds each. NEVER CANCEL.

## Validation Requirements

**CRITICAL VALIDATION**: Before making any changes to workflow files or scripts:

1. **YAML Syntax Check**: `yamllint .github/workflows/*.yml` 
   - Expected warnings: missing document start, line length violations
   - Expected errors: indentation issues, trailing spaces
   - Time: 1-2 seconds. NEVER CANCEL.

2. **JavaScript Syntax Check**: `node -c .github/npm-version-script.js && node -c .github/npm-version-script-esm.js`
   - Should exit with code 0 (success)
   - Time: 1-2 seconds. NEVER CANCEL.

3. **Markdown Validation**: `markdownlint *.md profile/*.md`
   - Expected warnings: line length violations, HTML elements
   - Time: 1-2 seconds. NEVER CANCEL.

### Manual Testing Scenarios
After making changes to npm version scripts:
1. Create a temporary test directory with dummy package.json
2. Run the script with test branch name format: `refs/heads/beta-1.2.3`
3. Verify the script processes the branch name correctly
4. Check that version updates are applied to package.json

## Repository Contents

### Reusable GitHub Workflows (`.github/workflows/`)
- `nodejs-build-and-test.yml` - Node.js build and test workflow
- `eslint.yml` - ESLint linting workflow  
- `npm-publish.yml` - NPM package publishing workflow
- `npm-publish-esm.yml` - NPM ESM package publishing workflow
- `lint-docs.yml` - TypeDoc documentation linting
- And 9 additional specialized workflows

### Community Health Files
- `README.md` - Organization overview and workflow usage examples
- `CONTRIBUTING.md` - Contribution guidelines (Node 20 LTS requirement)
- `SECURITY.md` - Security reporting instructions
- `profile/README.md` - GitHub organization profile

### NPM Version Management Scripts
- `.github/npm-version-script.js` - CommonJS version script
- `.github/npm-version-script-esm.js` - ESM version script

### Issue Templates (`.github/ISSUE_TEMPLATE/`)
- Bug report, feature request, support request, and experimental change templates

## Key Validation Points

**CRITICAL FILE COUNTS**:
- Total files: 32 (excluding .git directory)
- Workflow files: 14
- .github directory files: 27 (includes workflows, templates, scripts)
- Do NOT expect significantly more files than this

**TIMING EXPECTATIONS**:
- YAML validation: 1-2 seconds. NEVER CANCEL.
- JavaScript validation: 1-2 seconds. NEVER CANCEL.  
- Markdown validation: 1-2 seconds. NEVER CANCEL.
- NPM script testing: 1-2 seconds. NEVER CANCEL.

**KNOWN VALIDATION ISSUES** (these are expected and do not indicate problems):
- YAML files have line length violations and missing document starts
- Markdown files have line length violations and HTML elements  
- NPM version scripts will show 404 errors when testing with non-existent packages (this is normal)
- Expected stderr messages: "Failed to query the npm registry" and "404 Not Found" when testing scripts
- YAML lint will report ~100+ style violations - these are expected and don't break functionality

## Making Changes

### When Modifying Workflows
1. Always validate YAML syntax first: `yamllint .github/workflows/[modified-file].yml`
2. Check that workflow references are valid
3. Ensure input/output specifications are correct
4. Verify job dependencies and matrix configurations

### When Modifying NPM Scripts  
1. Validate JavaScript syntax: `node -c .github/npm-version-script.js`
2. Test with dummy parameters as shown above
3. Ensure both CommonJS and ESM versions are kept in sync
4. Verify error handling for missing packages

### Before Committing
Always run the complete validation suite:
```bash
# Full validation (takes 3-5 seconds total)
yamllint .github/workflows/*.yml
node -c .github/npm-version-script.js && node -c .github/npm-version-script-esm.js  
markdownlint *.md profile/*.md
```

**NEVER CANCEL** any of these validation commands - they complete in seconds.

## Common Tasks Reference

### Repository Root Contents
```
.github/          # GitHub configuration and workflows
CONTRIBUTING.md   # Contribution guidelines  
README.md         # Organization overview
SECURITY.md       # Security reporting
profile/          # Organization profile
.gitignore        # Git ignore rules
```

### Workflow File Dependencies
All workflows expect:
- Node.js (configurable version, default 20-22)
- npm ci installation
- Standard npm scripts (build, test, lint)

### NPM Script Branch Patterns
The version scripts expect branch names matching: `[TAG]-[VERSION]`
- Example: `beta-1.2.3`, `alpha-0.5.0`
- Pattern: `/^([A-Z]+)-(\d+\.\d+\.\d+)$/i`