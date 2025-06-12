#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const Handlebars = require('handlebars');
const { generateReadme } = require('./readme');

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
        // Convert string boolean values to actual booleans
        if (value === 'true') {
          parsed[key] = true;
        } else if (value === 'false') {
          parsed[key] = false;
        } else {
          parsed[key] = value;
        }
        i++; // Skip next argument as it's the value
      } else {
        parsed[key] = true;
      }
    } else if (arg === '-h') {
      parsed.help = true;
    } else if (!arg.startsWith('-')) {
      // First non-flag argument is component name
      if (!parsed.componentName) {
        parsed.componentName = arg;
      }
    }
  }
  
  return parsed;
}

// Register Handlebars helpers
Handlebars.registerHelper('pascalCase', function(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toUpperCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
});

Handlebars.registerHelper('camelCase', function(str) {
  const pascal = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
});

Handlebars.registerHelper('kebabCase', function(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
});

const FSD_LAYERS = {
  shared: { requiresSlice: false, path: 'app/shared' },
  entities: { requiresSlice: true, path: 'app/entities' },
  features: { requiresSlice: true, path: 'app/features' },
  widgets: { requiresSlice: true, path: 'app/widgets' },
  pages: { requiresSlice: true, path: 'app/pages' }
};

async function promptForComponentDetails(cliArgs = {}) {
  const questions = [];
  
  // Only prompt for missing values
  if (!cliArgs.layer) {
    questions.push({
      type: 'list',
      name: 'layer',
      message: 'Select FSD layer:',
      choices: Object.keys(FSD_LAYERS)
    });
  }
  
  if (!cliArgs.slice) {
    questions.push({
      type: 'input',
      name: 'slice',
      message: 'Enter slice name (e.g., auth, user, product):',
      when: (answers) => {
        const layer = cliArgs.layer || answers.layer;
        return FSD_LAYERS[layer].requiresSlice;
      },
      validate: (input) => {
        if (!input.trim()) {
          return 'Slice name is required for this layer';
        }
        if (!/^[a-z][a-z0-9-]*$/.test(input)) {
          return 'Slice name must start with lowercase letter and contain only lowercase letters, numbers, and hyphens';
        }
        return true;
      }
    });
  }
  
  if (!cliArgs.componentName) {
    questions.push({
      type: 'input',
      name: 'componentName',
      message: 'Enter component name (e.g., LoginForm, UserCard):',
      validate: (input) => {
        if (!input.trim()) {
          return 'Component name is required';
        }
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
          return 'Component name must start with uppercase letter and contain only letters and numbers';
        }
        return true;
      }
    });
  }

  if (cliArgs.includeTests === undefined) {
    questions.push({
      type: 'confirm',
      name: 'includeTests',
      message: 'Generate test file?',
      default: true
    });
  }
  
  if (cliArgs.includeStorybook === undefined) {
    questions.push({
      type: 'confirm',
      name: 'includeStorybook',
      message: 'Generate Storybook story?',
      default: false
    });
  }

  const answers = await inquirer.prompt(questions);
  
  // Merge CLI args with prompted answers
  return {
    layer: cliArgs.layer || answers.layer,
    slice: cliArgs.slice || answers.slice,
    componentName: cliArgs.componentName || answers.componentName,
    includeTests: cliArgs.includeTests !== undefined ? cliArgs.includeTests : answers.includeTests,
    includeStorybook: cliArgs.includeStorybook !== undefined ? cliArgs.includeStorybook : answers.includeStorybook
  };
}

function getComponentPath(layer, slice, componentName) {
  const basePath = FSD_LAYERS[layer].path;
  
  if (FSD_LAYERS[layer].requiresSlice) {
    return path.join(basePath, slice, 'ui');
  } else {
    return path.join(basePath, 'ui');
  }
}

function loadTemplate(templateName) {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template ${templateName}.hbs not found`);
  }
  return fs.readFileSync(templatePath, 'utf8');
}

function generateFeatureBaseline(sliceRootPath, templateData, layer) {
  const { slice } = templateData;
  
  // Generate api.ts
  const apiPath = path.join(sliceRootPath, 'api.ts');
  if (!fs.existsSync(apiPath)) {
    const apiTemplate = loadTemplate('api');
    const compiledApi = Handlebars.compile(apiTemplate);
    const apiContent = compiledApi(templateData);
    fs.writeFileSync(apiPath, apiContent);
    console.log(`✅ Created API: ${apiPath}`);
  }

  // Generate api.spec.ts
  const apiSpecPath = path.join(sliceRootPath, 'api.spec.ts');
  if (!fs.existsSync(apiSpecPath)) {
    const apiSpecTemplate = loadTemplate('api.spec');
    const compiledApiSpec = Handlebars.compile(apiSpecTemplate);
    const apiSpecContent = compiledApiSpec(templateData);
    fs.writeFileSync(apiSpecPath, apiSpecContent);
    console.log(`✅ Created API test: ${apiSpecPath}`);
  }

  // Generate hooks.ts
  const hooksPath = path.join(sliceRootPath, 'hooks.ts');
  if (!fs.existsSync(hooksPath)) {
    const hooksTemplate = loadTemplate('hooks');
    const compiledHooks = Handlebars.compile(hooksTemplate);
    const hooksContent = compiledHooks(templateData);
    fs.writeFileSync(hooksPath, hooksContent);
    console.log(`✅ Created hooks: ${hooksPath}`);
  }

  // Generate hooks.spec.ts
  const hooksSpecPath = path.join(sliceRootPath, 'hooks.spec.ts');
  if (!fs.existsSync(hooksSpecPath)) {
    const hooksSpecTemplate = loadTemplate('hooks.spec');
    const compiledHooksSpec = Handlebars.compile(hooksSpecTemplate);
    const hooksSpecContent = compiledHooksSpec(templateData);
    fs.writeFileSync(hooksSpecPath, hooksSpecContent);
    console.log(`✅ Created hooks test: ${hooksSpecPath}`);
  }

  // Generate README.md using dedicated readme generator
  const readmePath = path.join(sliceRootPath, 'README.md');
  if (!fs.existsSync(readmePath)) {
    // Use the dedicated README generator for consistency
    generateReadme(sliceRootPath, slice, layer, true);
    console.log(`✅ Created README: ${readmePath}`);
  }
}

function updateIndexFile(indexPath, componentName, actualComponentName, isFeature, isPage) {
  let indexContent = '';
  
  if (fs.existsSync(indexPath)) {
    indexContent = fs.readFileSync(indexPath, 'utf8');
  }
  
  if (isPage) {
    // For pages, don't create index.ts - pages are imported directly from ui/index.tsx
    // This matches the existing pattern where routes import from '../pages/[page]/ui'
    return;
  } else if (isFeature) {
    // For features, create comprehensive exports
    const newIndexContent = `// UI Components
export { ${componentName} } from './ui/${actualComponentName}';

// Hooks
export { use${componentName.replace(/Page$/, '')} } from './hooks';

// API
export { ${componentName.replace(/Page$/, '').toLowerCase()}Api } from './api';
export type { ${componentName.replace(/Page$/, '')}ApiResponse } from './api';
`;
    
    // Only write if content is different
    if (indexContent !== newIndexContent) {
      fs.writeFileSync(indexPath, newIndexContent);
      console.log(`✅ Updated index: ${indexPath}`);
    }
  } else {
    // For other layers, use simple export
    const exportLine = `export { ${componentName} } from './ui/${actualComponentName}';`;
    if (!indexContent.includes(exportLine)) {
      indexContent += `${exportLine}\n`;
      fs.writeFileSync(indexPath, indexContent);
      console.log(`✅ Updated index: ${indexPath}`);
    }
  }
}

function generateComponentFiles(options) {
  const { layer, slice, componentName, includeTests, includeStorybook } = options;
  
  const componentPath = getComponentPath(layer, slice, componentName);
  
  // For features layer, use slice-based naming
  // For pages layer, use index.tsx pattern to match existing project structure
  const isFeature = layer === 'features';
  const isPage = layer === 'pages';
  
  let actualComponentName, componentFileName;
  
  if (isPage) {
    // Pages use index.tsx pattern (like home page)
    actualComponentName = 'index';
    componentFileName = 'index.tsx';
  } else if (isFeature) {
    // Features use slice-based naming
    actualComponentName = `${slice}.page`;
    componentFileName = `${actualComponentName}.tsx`;
  } else {
    // Other layers use component name
    actualComponentName = componentName;
    componentFileName = `${actualComponentName}.tsx`;
  }
  
  const testFileName = isPage ? 'index.spec.ts' : `${actualComponentName}.spec.ts`;
  const storyFileName = `${componentName}.stories.tsx`;

  // Ensure directory exists
  fs.ensureDirSync(componentPath);

  const templateData = {
    componentName,
    layer,
    slice,
    importPath: slice ? `~/app/${layer}/${slice}` : `~/app/${layer}`
  };

  // Generate component file - use page template for pages layer
  const templateName = isPage ? 'page' : 'component';
  const componentTemplate = loadTemplate(templateName);
  const compiledComponent = Handlebars.compile(componentTemplate);
  const componentContent = compiledComponent(templateData);
  
  const componentFilePath = path.join(componentPath, componentFileName);
  fs.writeFileSync(componentFilePath, componentContent);
  console.log(`✅ Created component: ${componentFilePath}`);

  // Generate test file
  if (includeTests) {
    const testTemplate = loadTemplate('component.spec');
    const compiledTest = Handlebars.compile(testTemplate);
    const testContent = compiledTest(templateData);
    
    const testFilePath = path.join(componentPath, testFileName);
    fs.writeFileSync(testFilePath, testContent);
    console.log(`✅ Created test: ${testFilePath}`);
  }

  // Generate Storybook story
  if (includeStorybook) {
    const storyTemplate = loadTemplate('component.stories');
    const compiledStory = Handlebars.compile(storyTemplate);
    const storyContent = compiledStory(templateData);
    
    const storyFilePath = path.join(componentPath, storyFileName);
    fs.writeFileSync(storyFilePath, storyContent);
    console.log(`✅ Created story: ${storyFilePath}`);
  }

  // Get slice root path
  let sliceRootPath;
  if (FSD_LAYERS[layer].requiresSlice) {
    sliceRootPath = path.join(FSD_LAYERS[layer].path, slice);
  } else {
    sliceRootPath = FSD_LAYERS[layer].path;
  }

  // For features layer, generate baseline structure
  if (isFeature && slice) {
    generateFeatureBaseline(sliceRootPath, templateData, layer);
  }

  // Update index.ts in slice root (not in ui/ folder)
  const indexPath = path.join(sliceRootPath, 'index.ts');
  updateIndexFile(indexPath, componentName, actualComponentName, isFeature, isPage);

  return {
    componentPath: componentFilePath,
    testPath: includeTests ? path.join(componentPath, testFileName) : null,
    storyPath: includeStorybook ? path.join(componentPath, storyFileName) : null,
    indexPath: indexPath,
    sliceRootPath: sliceRootPath
  };
}

async function main() {
  try {
    const cliArgs = parseArgs();
    
    // Show help if requested
    if (cliArgs.help || cliArgs.h) {
      console.log(`
🚀 FSD Component Generator

Usage:
  npm run generate:component -- [ComponentName] [options]

Options:
  --layer <layer>         FSD layer (shared, entities, features, widgets, pages)
  --slice <slice>         Slice name (required for entities, features, widgets, pages)
  --includeTests <bool>   Generate test file (default: true)
  --includeStorybook <bool> Generate Storybook story (default: false)
  --help, -h              Show this help

Examples:
  # Interactive mode
  npm run generate:component

  # Non-interactive mode
  npm run generate:component -- Button --layer shared --includeTests true
  npm run generate:component -- LoginForm --layer features --slice auth
  npm run generate:component -- UserCard --layer widgets --slice profile --includeStorybook true
      `);
      return;
    }
    
    console.log('🚀 FSD Component Generator\n');
    
    const options = await promptForComponentDetails(cliArgs);
    const generatedFiles = generateComponentFiles(options);
    
    console.log('\n✨ Component generation completed!');
    console.log('\nGenerated files:');
    console.log(`- Component: ${generatedFiles.componentPath}`);
    
    if (generatedFiles.testPath) {
      console.log(`- Test: ${generatedFiles.testPath}`);
    }
    
    if (generatedFiles.storyPath) {
      console.log(`- Story: ${generatedFiles.storyPath}`);
    }
    
    console.log(`- Index: ${generatedFiles.indexPath}`);
    
    console.log('\n📝 Next steps:');
    console.log('1. Review the generated component and customize as needed');
    console.log('2. Add any required props and implement component logic');
    console.log('3. Update imports in your pages/features');
    if (generatedFiles.testPath) {
      console.log('4. Run tests: npm test');
    }
    
    // Suggest README update for feature slices
    if (options.layer === 'features' && options.slice) {
      console.log(`\n📝 Slice files modified. Consider updating documentation:`);
      console.log(`npm run generate:readme ${options.slice}`);
      console.log(`This will update the README.md with current slice structure and API information.`);
    }
    
  } catch (error) {
    console.error('❌ Error generating component:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateComponentFiles, promptForComponentDetails }; 