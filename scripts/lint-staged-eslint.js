#!/usr/bin/env node

// Set environment variable for ESLint
process.env.ESLINT_USE_FLAT_CONFIG = 'false';

// Import required modules
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawn } = require('child_process');

// Get the files passed by lint-staged
const files = process.argv.slice(2);

if (files.length === 0) {
  console.log('No files to process');
  process.exit(0);
}

// Run ESLint with --fix on the provided files
const eslint = spawn('npx', ['eslint', '--fix', ...files], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

eslint.on('close', code => {
  process.exit(code);
});
