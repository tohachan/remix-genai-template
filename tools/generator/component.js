#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const Handlebars = require('handlebars');

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

async function promptForComponentDetails() {
  const questions = [
    {
      type: 'list',
      name: 'layer',
      message: 'Select FSD layer:',
      choices: Object.keys(FSD_LAYERS)
    },
    {
      type: 'input',
      name: 'slice',
      message: 'Enter slice name (e.g., auth, user, product):',
      when: (answers) => FSD_LAYERS[answers.layer].requiresSlice,
      validate: (input) => {
        if (!input.trim()) {
          return 'Slice name is required for this layer';
        }
        if (!/^[a-z][a-z0-9-]*$/.test(input)) {
          return 'Slice name must start with lowercase letter and contain only lowercase letters, numbers, and hyphens';
        }
        return true;
      }
    },
    {
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
    },

    {
      type: 'confirm',
      name: 'includeTests',
      message: 'Generate test file?',
      default: true
    },
    {
      type: 'confirm',
      name: 'includeStorybook',
      message: 'Generate Storybook story?',
      default: false
    }
  ];

  return await inquirer.prompt(questions);
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

function generateComponentFiles(options) {
  const { layer, slice, componentName, includeTests, includeStorybook } = options;
  
  const componentPath = getComponentPath(layer, slice, componentName);
  const componentFileName = `${componentName}.tsx`;
  const testFileName = `${componentName}.spec.tsx`;
  const storyFileName = `${componentName}.stories.tsx`;

  // Ensure directory exists
  fs.ensureDirSync(componentPath);

  const templateData = {
    componentName,
    layer,
    slice,
    importPath: slice ? `~/app/${layer}/${slice}` : `~/app/${layer}`
  };

  // Generate component file
  const componentTemplate = loadTemplate('component');
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

  // Update index.ts in slice root (not in ui/ folder)
  let sliceRootPath;
  if (FSD_LAYERS[layer].requiresSlice) {
    sliceRootPath = path.join(FSD_LAYERS[layer].path, slice);
  } else {
    sliceRootPath = FSD_LAYERS[layer].path;
  }
  
  const indexPath = path.join(sliceRootPath, 'index.ts');
  let indexContent = '';
  
  if (fs.existsSync(indexPath)) {
    indexContent = fs.readFileSync(indexPath, 'utf8');
  }
  
  const exportLine = `export { ${componentName} } from './ui/${componentName}';`;
  if (!indexContent.includes(exportLine)) {
    indexContent += `${exportLine}\n`;
    fs.writeFileSync(indexPath, indexContent);
    console.log(`✅ Updated index: ${indexPath}`);
  }

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
    console.log('🚀 FSD Component Generator\n');
    
    const options = await promptForComponentDetails();
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