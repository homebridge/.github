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
- Validate YAML workflow files: `yamllint .github/workflows/*.yml` -- takes 0.7 seconds. NEVER CANCEL.
- Validate JavaScript syntax: `node -c .github/npm-version-script.js && node -c .github/npm-version-script-esm.js` -- takes 0.04 seconds.
- Validate Markdown files: `markdownlint *.md profile/*.md` -- takes 0.25 seconds.

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
Time expectation: 0.5-0.65 seconds each. NEVER CANCEL.

## Validation Requirements

**CRITICAL VALIDATION**: Before making any changes to workflow files or scripts:

1. **YAML Syntax Check**: `yamllint .github/workflows/*.yml` 
   - Expected warnings: missing document start, line length violations
   - Expected errors: indentation issues, trailing spaces
   - Time: 0.7 seconds. NEVER CANCEL.

2. **JavaScript Syntax Check**: `node -c .github/npm-version-script.js && node -c .github/npm-version-script-esm.js`
   - Should exit with code 0 (success)
   - Time: 0.04 seconds. NEVER CANCEL.

3. **Markdown Validation**: `markdownlint *.md profile/*.md`
   - Expected warnings: line length violations, HTML elements
   - Time: 0.25 seconds. NEVER CANCEL.

### Manual Testing Scenarios
After making changes to npm version scripts:
1. Create a temporary test directory with dummy package.json
2. Run the script with test branch name format: `refs/heads/beta-1.2.3`
3. Verify the script processes the branch name correctly
4. Check that version updates are applied to package.json
5. Expected 404 errors from npm registry are NORMAL for test packages

### Manual Testing Example
```bash
# Test CommonJS version
cd /tmp && mkdir test-npm-script && cd test-npm-script
echo '{"name": "@homebridge/test", "version": "1.0.0"}' > package.json
echo '{"version": "1.0.0"}' > package-lock.json
node /path/to/.github/npm-version-script.js refs/heads/beta-1.2.3 beta
# Expected: "Failed to query npm registry" then "Changing version to 1.2.3"

# Test ESM version  
cd /tmp && mkdir test-npm-script-esm && cd test-npm-script-esm
echo '{"name": "@homebridge/test-esm", "version": "2.0.0", "type": "module"}' > package.json
echo '{"version": "2.0.0"}' > package-lock.json  
node /path/to/.github/npm-version-script-esm.js refs/heads/alpha-2.1.0 alpha
# Expected: "Failed to query npm registry" then "Changing version to 2.1.0"
```

**CRITICAL**: 404 errors and "Failed to query npm registry" messages are EXPECTED and indicate the scripts are working correctly.

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
- Total files: 34 (excluding .git directory)
- Workflow files: 15
- .github directory files: 29 (includes workflows, templates, scripts)
- Do NOT expect significantly more files than this

**TIMING EXPECTATIONS**:
- YAML validation: 0.7 seconds. NEVER CANCEL.
- JavaScript validation: 0.04 seconds. NEVER CANCEL.  
- Markdown validation: 0.25 seconds. NEVER CANCEL.
- NPM script testing: 0.5-0.65 seconds each. NEVER CANCEL.

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
# Full validation (takes 1 second total)
yamllint .github/workflows/*.yml
node -c .github/npm-version-script.js && node -c .github/npm-version-script-esm.js  
markdownlint *.md profile/*.md
```

**NEVER CANCEL** any of these validation commands - they complete in seconds.

## Validation Scenarios Reference

### Expected YAML Lint Output
Expect approximately 100+ style violations when running `yamllint .github/workflows/*.yml`, including:
- Missing document start warnings (`---`)
- Line length violations (>80 characters)
- Indentation issues
- Trailing spaces
- Missing newlines at end of file

These are cosmetic issues and do NOT break workflow functionality.

### Expected JavaScript Validation
Both npm version scripts should validate without errors:
```bash
node -c .github/npm-version-script.js      # CommonJS version
node -c .github/npm-version-script-esm.js  # ESM version
```
Exit code 0 indicates successful syntax validation.

### Expected Markdown Validation
Expect line length violations and HTML element warnings when running `markdownlint *.md profile/*.md`:
- README.md: Inline HTML elements (logo image)
- CONTRIBUTING.md: Line length violations
- profile/README.md: Missing H1 heading
- SECURITY.md: Line length violations

These are style warnings and do NOT break functionality.

## Common Tasks Reference

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repository Root Contents
```
.github/          # GitHub configuration and workflows
CONTRIBUTING.md   # Contribution guidelines  
README.md         # Organization overview
SECURITY.md       # Security reporting
profile/          # Organization profile
.gitignore        # Git ignore rules
```

### ls -la (Repository Root)
```
total 36
drwxr-xr-x 5 runner docker 4096 Sep  4 22:12 .
drwxr-xr-x 3 runner docker 4096 Sep  4 22:11 ..
drwxr-xr-x 7 runner docker 4096 Sep  4 22:12 .git
drwxr-xr-x 4 runner docker 4096 Sep  4 22:12 .github
-rw-r--r-- 1 runner docker 2476 Sep  4 22:12 .gitignore
-rw-r--r-- 1 runner docker 2505 Sep  4 22:12 CONTRIBUTING.md
-rw-r--r-- 1 runner docker 1062 Sep  4 22:12 README.md
-rw-r--r-- 1 runner docker  944 Sep  4 22:12 SECURITY.md
drwxr-xr-x 2 runner docker 4096 Sep  4 22:12 profile
```

### .github Directory Structure
```
ISSUE_TEMPLATE/           # Issue templates (6 files)
workflows/               # Reusable workflows (15 files)
copilot-instructions.md  # This file
labeler.yml             # GitHub labeler config
npm-version-script.js   # CommonJS version script
npm-version-script-esm.js # ESM version script
pr-labeler.yml          # PR labeler config
pull_request_template.md # PR template
release-drafter.yml     # Release drafter config
release.yml             # Release config
```

### Workflow Files List
```
change-release.yml       # Change release workflow
codeql-analysis.yml      # CodeQL security analysis
discord-webhooks.yml     # Discord notification webhooks
eslint.yml              # ESLint linting workflow
homebridge-beta-bot.yml  # Homebridge beta bot (largest file - 10KB)
labeler.yml             # Auto-labeler workflow  
lint-docs.yml           # Documentation linting
nodejs-build-and-test.yml # Node.js CI workflow
npm-publish-esm.yml      # NPM ESM publishing
npm-publish.yml         # NPM CommonJS publishing  
pr-labeler.yml          # PR labeling workflow
pre-release.yml         # Pre-release workflow
release-drafter.yml     # Release drafting
stale.yml               # Stale issue management
update-beta-version.yml  # Beta version updates
```

### Issue Templates Available
```
bug_report.yml           # Bug report template
config.yml              # Issue template config
experimental_change.yml  # Experimental change template
feature_request.yml     # Feature request template
support_request.yml     # Support request template
wiki-change-request.yml # Wiki change request template
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
