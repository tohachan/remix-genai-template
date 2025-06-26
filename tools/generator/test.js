#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1];

      if (value && !value.startsWith('--') && !value.startsWith('-')) {
        parsed[key] = value;
        i++; // Skip next argument as it's the value
      } else {
        parsed[key] = true;
      }
    } else if (arg === '-h') {
      parsed.help = true;
    } else if (!arg.startsWith('-')) {
      // First non-flag argument is file path
      if (!parsed.filePath) {
        parsed.filePath = arg;
      }
    }
  }

  return parsed;
}

function showHelp() {
  console.log(`
🧪 Test File Generator

Generate test files for existing utility and component files.

USAGE:
  npm run generate:test -- <filePath>

ARGUMENTS:
  filePath                Path to the file to create tests for

EXAMPLES:
  npm run generate:test -- shared/utils/mathUtils.ts
  npm run generate:test -- shared/utils/stringUtils.ts
  npm run generate:test -- features/auth/api.ts

GENERATED STRUCTURE:
  shared/utils/
  ├── mathUtils.ts         # Original file
  └── mathUtils.spec.ts    # Generated test file
`);
}

function generateTestFile(filePath) {
  if (!filePath) {
    throw new Error('File path is required');
  }

  // Resolve absolute path
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File does not exist: ${absolutePath}`);
  }

  // Generate test file path
  const parsed = path.parse(absolutePath);
  const testFilePath = path.join(parsed.dir, `${parsed.name}.spec${parsed.ext}`);

  if (fs.existsSync(testFilePath)) {
    console.log(`⚠️  Test file already exists: ${testFilePath}`);
    return testFilePath;
  }

  // Read the source file to extract exports
  const sourceContent = fs.readFileSync(absolutePath, 'utf8');

  // Extract function exports for test generation
  const functionExports = extractFunctionExports(sourceContent);

  // Generate test content
  const testContent = generateTestContent(filePath, functionExports);

  // Write test file
  fs.writeFileSync(testFilePath, testContent);

  return testFilePath;
}

function extractFunctionExports(content) {
  const exports = [];

  // Match export function declarations
  const functionDeclarations = content.match(/export\s+function\s+(\w+)/g);
  if (functionDeclarations) {
    functionDeclarations.forEach(match => {
      const name = match.match(/export\s+function\s+(\w+)/)[1];
      exports.push(name);
    });
  }

  // Match export const with arrow functions
  const arrowFunctions = content.match(/export\s+const\s+(\w+)\s*=.*=>/g);
  if (arrowFunctions) {
    arrowFunctions.forEach(match => {
      const name = match.match(/export\s+const\s+(\w+)/)[1];
      exports.push(name);
    });
  }

  return exports;
}

function generateTestContent(filePath, functionExports) {
  const relativePath = filePath.startsWith('./') ? filePath : `./${path.basename(filePath, path.extname(filePath))}`;
  const fileName = path.basename(filePath, path.extname(filePath));

  let imports = '';
  let testCases = '';

  if (functionExports.length > 0) {
    imports = `import { ${functionExports.join(', ')} } from '${relativePath}';`;

    testCases = functionExports.map(fn => `  describe('${fn}', () => {
    it('should work correctly', () => {
      // TODO: Add test implementation
      expect(${fn}).toBeDefined();
    });
  });`).join('\n\n');
  } else {
    imports = `import * as ${fileName} from '${relativePath}';`;
    testCases = `  it('should be defined', () => {
    expect(${fileName}).toBeDefined();
  });`;
  }

  return `${imports}

describe('${fileName}', () => {
${testCases}
});
`;
}

async function main() {
  const cliArgs = parseArgs();

  if (cliArgs.help) {
    showHelp();
    return;
  }

  console.log('🧪 Test File Generator\n');

  try {
    const testFilePath = generateTestFile(cliArgs.filePath);

    console.log('✅ Test file generated successfully!');
    console.log(`📁 Generated: ${testFilePath.replace(process.cwd() + '/', '')}`);
    console.log('\n📝 Next steps:');
    console.log('1. Review the generated test file');
    console.log('2. Add proper test implementations');
    console.log('3. Run tests: npm test');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateTestFile };
