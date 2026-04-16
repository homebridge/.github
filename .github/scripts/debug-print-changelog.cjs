#!/usr/bin/env node
// Debug script to print the contents of CHANGELOG.md after changelog normalization
const fs = require('fs');
const path = 'CHANGELOG.md';

if (fs.existsSync(path)) {
  console.log('--- BEGIN CHANGELOG.md ---');
  console.log(fs.readFileSync(path, 'utf8'));
  console.log('--- END CHANGELOG.md ---');
} else {
  console.error('CHANGELOG.md not found');
  process.exit(1);
}
