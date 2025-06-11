#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
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

Handlebars.registerHelper('includes', function(str, substr) {
  return str && str.includes(substr);
});

const FSD_LAYERS = {
  shared: { requiresSlice: false, path: 'app/shared' },
  entities: { requiresSlice: true, path: 'app/entities' },
  features: { requiresSlice: true, path: 'app/features' },
  widgets: { requiresSlice: true, path: 'app/widgets' },
  pages: { requiresSlice: true, path: 'app/pages' }
};

function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
  }
  
  return {
    sliceName: args[0]
  };
}

function showHelp() {
  console.log(`
📝 FSD README Generator

Usage:
  npm run generate:readme <slice-name>

Examples:
  npm run generate:readme auth           # Updates app/features/auth/README.md
  npm run generate:readme user-profile   # Updates app/features/user-profile/README.md
  npm run generate:readme home           # Updates app/pages/home/README.md

Description:
  Analyzes the slice structure and updates README.md with current API information,
  file structure, and testing details. Follows the standardized format with
  "For Humans" and "For AI" sections.

Supported Layers:
  - features/   Feature slices
  - pages/      Page slices
  - widgets/    Widget slices
  - entities/   Entity slices
  `);
}

function findSliceDirectory(sliceName) {
  // Check all FSD layers for the slice
  for (const [layer, config] of Object.entries(FSD_LAYERS)) {
    if (!config.requiresSlice) continue;
    
    const slicePath = path.join(config.path, sliceName);
    if (fs.existsSync(slicePath)) {
      return {
        layer,
        path: slicePath,
        exists: true
      };
    }
  }
  
  return { exists: false };
}

function analyzeSliceStructure(slicePath) {
  const structure = {
    hasApi: false,
    hasApiTests: false,
    hasHooks: false,
    hasHooksTests: false,
    hasUi: false,
    uiComponents: [],
    hasPageComponent: false,
    pageComponentName: null,
    hasTests: false,
    dependencies: ['React'], // Default dependency
    files: []
  };

  // Check for main files
  if (fs.existsSync(path.join(slicePath, 'api.ts'))) {
    structure.hasApi = true;
    structure.files.push('api.ts');
  }
  
  if (fs.existsSync(path.join(slicePath, 'api.spec.ts'))) {
    structure.hasApiTests = true;
    structure.files.push('api.spec.ts');
  }
  
  if (fs.existsSync(path.join(slicePath, 'hooks.ts'))) {
    structure.hasHooks = true;
    structure.files.push('hooks.ts');
  }
  
  if (fs.existsSync(path.join(slicePath, 'hooks.spec.ts'))) {
    structure.hasHooksTests = true;
    structure.files.push('hooks.spec.ts');
  }

  // Check UI directory
  const uiPath = path.join(slicePath, 'ui');
  if (fs.existsSync(uiPath)) {
    structure.hasUi = true;
    const uiFiles = fs.readdirSync(uiPath);
    
    uiFiles.forEach(file => {
      if (file.endsWith('.tsx') && !file.endsWith('.spec.tsx') && !file.endsWith('.stories.tsx')) {
        const componentName = file.replace('.tsx', '');
        structure.uiComponents.push(componentName);
        
        // Check if it's a page component (matches slice name pattern)
        if (file.includes('.page.tsx')) {
          structure.hasPageComponent = true;
          structure.pageComponentName = componentName;
        }
      }
      
      if (file.endsWith('.spec.ts') || file.endsWith('.spec.tsx')) {
        structure.hasTests = true;
      }
    });
  }

  // Analyze dependencies
  if (structure.hasHooks || structure.hasTests) {
    structure.dependencies.push('@testing-library/react');
  }
  
  if (structure.hasUi) {
    structure.dependencies.push('~/shared/lib/utils');
  }

  return structure;
}

function extractPublicApi(slicePath, sliceName, structure) {
  const publicApi = [];
  
  // Extract from index.ts if exists
  const indexPath = path.join(slicePath, 'index.ts');
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Parse exports to understand what's being exposed
    const exportLines = indexContent.split('\n').filter(line => line.trim().startsWith('export'));
    
    exportLines.forEach(line => {
      if (line.includes('export {') && line.includes('} from')) {
        // Extract component name from export
        const match = line.match(/export\s*{\s*([^}]+)\s*}/);
        if (match) {
          const exportName = match[1].trim();
          publicApi.push(exportName);
        }
      }
    });
  } else {
    // Fallback: generate API based on structure analysis
    if (structure.hasPageComponent) {
      const pageName = structure.pageComponentName.split('.')[0];
      const pascalPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1) + 'Page';
      publicApi.push(pascalPageName);
    }
    
    structure.uiComponents.forEach(component => {
      if (!component.includes('.page')) {
        const componentName = component.charAt(0).toUpperCase() + component.slice(1);
        publicApi.push(componentName);
      }
    });
    
    if (structure.hasHooks) {
      const pascalSlice = sliceName.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toUpperCase() : word.toUpperCase();
      }).replace(/\s+/g, '');
      publicApi.push(`use${pascalSlice}`);
    }
    
    if (structure.hasApi) {
      const camelSlice = sliceName.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, '');
      publicApi.push(`${camelSlice}Api`);
    }
  }

  return publicApi.length > 0 ? publicApi : [`${sliceName} - Empty placeholder slice`];
}

function loadTemplate(templateName) {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template ${templateName}.hbs not found`);
  }
  return fs.readFileSync(templatePath, 'utf8');
}

function generateReadme(slicePath, sliceName, layer, silent = false) {
  if (!silent) {
    console.log(`📝 Analyzing slice structure: ${sliceName}`);
  }
  
  const structure = analyzeSliceStructure(slicePath);
  const publicApi = extractPublicApi(slicePath, sliceName, structure);
  
  if (!silent) {
    console.log(`📊 Found ${structure.uiComponents.length} UI components, API: ${structure.hasApi}, Hooks: ${structure.hasHooks}`);
  }
  
  // Format public API with descriptions
  const publicApiWithDescriptions = publicApi.map(item => {
    if (item.includes('Page')) {
      return `${item} - Main page component`;
    } else if (item.toLowerCase().includes('api')) {
      return `${item} - API functions for ${sliceName} backend interactions`;
    } else if (item.includes('use')) {
      return `${item} - React hook for ${sliceName} functionality`;
    } else {
      return `${item} - UI component`;
    }
  });

  const templateData = {
    slice: sliceName,
    layer,
    componentName: structure.pageComponentName ? 
      structure.pageComponentName.replace('.page', 'Page') : 
      sliceName.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toUpperCase() : word.toUpperCase();
      }).replace(/\s+/g, '') + 'Page',
    publicApi,
    publicApiWithDescriptions,
    dependencies: structure.dependencies,
    structure,
    hasApi: structure.hasApi,
    hasHooks: structure.hasHooks,
    hasUi: structure.hasUi,
    hasTests: structure.hasTests || structure.hasApiTests || structure.hasHooksTests
  };

  // Generate README content
  const readmeTemplate = loadTemplate('readme');
  const compiledReadme = Handlebars.compile(readmeTemplate);
  const readmeContent = compiledReadme(templateData);
  
  // Write README file
  const readmePath = path.join(slicePath, 'README.md');
  fs.writeFileSync(readmePath, readmeContent);
  
  if (!silent) {
    console.log(`✅ Updated README: ${readmePath}`);
  }
  
  return {
    readmePath,
    structure,
    publicApi
  };
}

async function main() {
  try {
    const { sliceName } = parseArgs();
    
    console.log('📝 FSD README Generator\n');
    
    // Find the slice directory
    const sliceInfo = findSliceDirectory(sliceName);
    
    if (!sliceInfo.exists) {
      console.error(`❌ Slice "${sliceName}" not found in any FSD layer.`);
      console.log('\nAvailable slices:');
      
      // List available slices
      for (const [layer, config] of Object.entries(FSD_LAYERS)) {
        if (!config.requiresSlice) continue;
        
        if (fs.existsSync(config.path)) {
          const slices = fs.readdirSync(config.path).filter(item => 
            fs.statSync(path.join(config.path, item)).isDirectory()
          );
          
          if (slices.length > 0) {
            console.log(`  ${layer}/: ${slices.join(', ')}`);
          }
        }
      }
      
      process.exit(1);
    }
    
    // Generate README
    const result = generateReadme(sliceInfo.path, sliceName, sliceInfo.layer);
    
    console.log('\n✨ README generation completed!');
    console.log('\n📋 Summary:');
    console.log(`- Slice: ${sliceInfo.layer}/${sliceName}`);
    console.log(`- Public API items: ${result.publicApi.length}`);
    console.log(`- Has API layer: ${result.structure.hasApi ? '✅' : '❌'}`);
    console.log(`- Has hooks: ${result.structure.hasHooks ? '✅' : '❌'}`);
    console.log(`- Has UI components: ${result.structure.hasUi ? '✅' : '❌'}`);
    console.log(`- Has tests: ${result.structure.hasTests ? '✅' : '❌'}`);
    
    console.log('\n📝 Next steps:');
    console.log('1. Review the generated README and customize as needed');
    console.log('2. Add any missing documentation sections');
    console.log('3. Update API descriptions and usage examples');
    
  } catch (error) {
    console.error('❌ Error generating README:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateReadme, analyzeSliceStructure, extractPublicApi }; 