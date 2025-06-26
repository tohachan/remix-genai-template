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
      // First non-flag argument is feature name
      if (!parsed.featureName) {
        parsed.featureName = arg;
      }
    }
  }

  return parsed;
}

// Register Handlebars helpers
Handlebars.registerHelper('pascalCase', function(str) {
  return str
    .replace(/[-_\s]+(.)?/g, function(_, char) {
      return char ? char.toUpperCase() : '';
    })
    .replace(/^(.)/, function(char) {
      return char.toUpperCase();
    });
});

Handlebars.registerHelper('camelCase', function(str) {
  return str
    .replace(/[-_\s]+(.)?/g, function(_, char) {
      return char ? char.toUpperCase() : '';
    })
    .replace(/^(.)/, function(char) {
      return char.toLowerCase();
    });
});

Handlebars.registerHelper('kebabCase', function(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
});

Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('or', function(a, b) {
  return a || b;
});

const FEATURE_TEMPLATES = {
  'basic': {
    name: 'Basic Feature',
    description: 'Standard feature component with common functionality',
    componentTemplate: 'component.hbs',
    includeApi: false,
    includeHooks: false,
  },
  'with-api': {
    name: 'Feature with API',
    description: 'Feature component with API integration',
    componentTemplate: 'component.hbs',
    includeApi: true,
    includeHooks: true,
  },
  'with-hooks': {
    name: 'Feature with Hooks',
    description: 'Feature component with custom hooks',
    componentTemplate: 'component.hbs',
    includeApi: false,
    includeHooks: true,
  },
  'full': {
    name: 'Full Feature',
    description: 'Complete feature with API and hooks',
    componentTemplate: 'component.hbs',
    includeApi: true,
    includeHooks: true,
  },
};

const FSD_LAYERS = {
  features: { requiresSlice: true, path: 'app/features' },
  widgets: { requiresSlice: true, path: 'app/widgets' },
};

async function promptForFeatureDetails(cliArgs = {}) {
  // Validate all required arguments are provided
  const requiredArgs = ['featureName', 'template', 'layer'];
  const missingArgs = requiredArgs.filter(arg => !cliArgs[arg]);

  if (missingArgs.length > 0) {
    throw new Error(`Missing required arguments: ${missingArgs.join(', ')}. Use --help for usage information.`);
  }

  // Validate feature name format
  if (!/^[a-z][a-z0-9-]*$/.test(cliArgs.featureName)) {
    throw new Error('Feature name must start with lowercase letter and contain only lowercase letters, numbers, and hyphens');
  }

  // Validate template exists
  if (!FEATURE_TEMPLATES[cliArgs.template]) {
    const validTemplates = Object.keys(FEATURE_TEMPLATES).join(', ');
    throw new Error(`Invalid template "${cliArgs.template}". Valid options: ${validTemplates}`);
  }

  // Validate layer exists
  if (!FSD_LAYERS[cliArgs.layer]) {
    const validLayers = Object.keys(FSD_LAYERS).join(', ');
    throw new Error(`Invalid layer "${cliArgs.layer}". Valid options: ${validLayers}`);
  }

  // Set defaults for optional arguments if not provided
  return {
    featureName: cliArgs.featureName,
    template: cliArgs.template,
    layer: cliArgs.layer,
    includeTests: cliArgs.includeTests !== undefined ? cliArgs.includeTests : true,
    includeStorybook: cliArgs.includeStorybook !== undefined ? cliArgs.includeStorybook : false,
  };
}

function getFeaturePath(layer, featureName) {
  const basePath = FSD_LAYERS[layer].path;
  return path.join(basePath, featureName);
}

function loadTemplate(templateName) {
  const templatePath = path.join(__dirname, 'templates', templateName);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template ${templateName} not found`);
  }
  return fs.readFileSync(templatePath, 'utf8');
}

function updateIndexFile(indexPath, componentName, featureName) {
  const exportLine = `export { ${componentName} } from './ui/${componentName}';`;

  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    if (!content.includes(exportLine)) {
      const newContent = content.trim() + '\n' + exportLine + '\n';
      fs.writeFileSync(indexPath, newContent);
    }
  } else {
    const content = `// ${featureName} feature exports\n\n${exportLine}\n`;
    fs.writeFileSync(indexPath, content);
  }
}

function generateFeatureFiles(options) {
  const {
    featureName,
    template,
    layer,
    includeTests,
    includeStorybook,
  } = options;

  const templateConfig = FEATURE_TEMPLATES[template];
  const componentName = Handlebars.helpers.pascalCase(featureName);
  const featurePath = getFeaturePath(layer, featureName);
  const uiPath = path.join(featurePath, 'ui');

  // Ensure directories exist
  fs.ensureDirSync(uiPath);

  const templateData = {
    componentName,
    slice: featureName,
    layer,
    template,
  };

  const files = [];

  try {
    // Generate main component using feature template
    const componentTemplate = loadTemplate(templateConfig.componentTemplate);
    const componentContent = Handlebars.compile(componentTemplate)(templateData);
    const componentFile = path.join(uiPath, `${componentName}.tsx`);
    fs.writeFileSync(componentFile, componentContent);
    files.push(componentFile);

    // Generate tests if requested
    if (includeTests) {
      const testTemplate = loadTemplate('component.spec.hbs');
      const testContent = Handlebars.compile(testTemplate)(templateData);
      const testFile = path.join(uiPath, `${componentName}.spec.tsx`);
      fs.writeFileSync(testFile, testContent);
      files.push(testFile);
    }

    // Generate Storybook stories if requested
    if (includeStorybook) {
      const storyTemplate = loadTemplate('component.stories.hbs');
      const storyContent = Handlebars.compile(storyTemplate)(templateData);
      const storyFile = path.join(uiPath, `${componentName}.stories.tsx`);
      fs.writeFileSync(storyFile, storyContent);
      files.push(storyFile);
    }

    // Generate API file if needed
    if (templateConfig.includeApi) {
      const apiTemplate = loadTemplate('api.hbs');
      const apiContent = Handlebars.compile(apiTemplate)(templateData);
      const apiFile = path.join(featurePath, 'api.ts');
      fs.writeFileSync(apiFile, apiContent);
      files.push(apiFile);

      const apiTestTemplate = loadTemplate('api.spec.hbs');
      const apiTestContent = Handlebars.compile(apiTestTemplate)(templateData);
      const apiTestFile = path.join(featurePath, 'api.spec.ts');
      fs.writeFileSync(apiTestFile, apiTestContent);
      files.push(apiTestFile);
    }

    // Generate hooks file if needed
    if (templateConfig.includeHooks) {
      const hooksTemplate = loadTemplate('hooks.hbs');
      const hooksContent = Handlebars.compile(hooksTemplate)(templateData);
      const hooksFile = path.join(featurePath, 'hooks.ts');
      fs.writeFileSync(hooksFile, hooksContent);
      files.push(hooksFile);

      const hooksTestTemplate = loadTemplate('hooks.spec.hbs');
      const hooksTestContent = Handlebars.compile(hooksTestTemplate)(templateData);
      const hooksTestFile = path.join(featurePath, 'hooks.spec.ts');
      fs.writeFileSync(hooksTestFile, hooksTestContent);
      files.push(hooksTestFile);
    }

    // Update index file
    const indexPath = path.join(featurePath, 'index.ts');
    updateIndexFile(indexPath, componentName, featureName);

    // Generate README
    console.log('\n📝 Generating README...');
    generateReadme(featurePath, featureName, layer, true);
    console.log('✅ README generated successfully!');

    return files;
  } catch (error) {
    console.error(`❌ Error generating files for ${featureName}:`, error.message);
    // Clean up partially generated files
    files.forEach(file => {
      fs.removeSync(file);
    });
    throw error;
  }
}

function showHelp() {
  console.log(`
🚀 FSD Feature Generator

Generate reusable business features following Feature-Sliced Design principles.

USAGE:
  npm run generate:feature -- <featureName> --template <template> --layer <layer> [options]

ARGUMENTS:
  featureName              Feature name (kebab-case, e.g., user-authentication, task-management)

OPTIONS:
  --template <template>    Feature template (basic | with-api | with-hooks | full)
  --layer <layer>          FSD layer (features | widgets) [default: features]
  --includeTests <bool>    Generate test files [default: true]
  --includeStorybook <bool> Generate Storybook stories [default: false]
  -h, --help              Show this help message

TEMPLATES:
  basic                   Standard feature component
  with-api                Feature component with API integration
  with-hooks              Feature component with custom hooks  
  full                    Complete feature with API and hooks

LAYERS:
  features                Reusable business components (LoginForm, TaskCard, UserProfile)
  widgets                 Large UI compositions that combine multiple features

EXAMPLES:
  npm run generate:feature -- user-authentication --template with-api --layer features --includeTests true
  npm run generate:feature -- analytics-dashboard --template full --layer widgets --includeTests true
  npm run generate:feature -- task-board --template basic --layer widgets --includeStorybook true

GENERATED STRUCTURE (Features Layer):
  app/features/[featureName]/
  ├── ui/
  │   ├── [FeatureName].tsx     # Main business component (e.g., LoginForm, TaskCard)
  │   └── [FeatureName].spec.tsx # Component tests (if --includeTests)
  ├── api.ts                     # API interactions (if template requires)
  ├── api.spec.ts                # API tests
  ├── hooks.ts                   # Custom hooks (if template requires)
  ├── hooks.spec.ts              # Hooks tests
  ├── index.ts                   # Public exports
  └── README.md                  # Auto-generated documentation

GENERATED STRUCTURE (Widgets Layer):
  app/widgets/[featureName]/
  ├── ui/
  │   ├── [FeatureName].tsx     # Widget composition component
  │   └── [FeatureName].spec.tsx # Widget tests (if --includeTests)
  ├── index.ts                   # Public exports
  └── README.md                  # Auto-generated documentation

FSD ARCHITECTURE NOTES:
  - Features contain REUSABLE business components, NOT pages
  - Pages are created separately in app/pages/ layer
  - Features are imported by pages and widgets for composition
  - Each feature should solve ONE specific business problem
`);
}

async function main() {
  const cliArgs = parseArgs();

  if (cliArgs.help) {
    showHelp();
    return;
  }

  console.log('🚀 FSD Feature Generator\n');

  try {
    const options = await promptForFeatureDetails(cliArgs);
    const templateConfig = FEATURE_TEMPLATES[options.template];

    console.log('\n📋 Generating feature with these options:');
    console.log(`   Feature Name: ${options.featureName}`);
    console.log(`   Template: ${templateConfig.name}`);
    console.log(`   Layer: ${options.layer}`);
    console.log(`   Include Tests: ${options.includeTests}`);
    console.log(`   Include Storybook: ${options.includeStorybook}`);
    console.log('');

    const generatedFiles = generateFeatureFiles(options);

    console.log('\n✅ Feature generated successfully!');
    console.log('\n📁 Generated files:');
    generatedFiles.forEach(file => {
      console.log(`   ${file.replace(process.cwd() + '/', '')}`);
    });

    console.log('\n🎉 Feature generation complete!');
    console.log(`\nNext steps:
1. Review generated files in ${FSD_LAYERS[options.layer].path}/${options.featureName}/
2. Customize the generated components for your use case
3. Add the feature to your routes if needed
4. Run tests: npm test -- ${FSD_LAYERS[options.layer].path}/${options.featureName}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Export for programmatic usage
module.exports = {
  generateFeatureFiles,
  FEATURE_TEMPLATES,
  FSD_LAYERS,
};

// Run if called directly
if (require.main === module) {
  main();
}
