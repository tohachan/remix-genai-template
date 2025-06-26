const path = require('path');
const fs = require('fs');

// Utility functions
const isInDirectory = (filePath, dirPattern) => {
  return new RegExp(dirPattern).test(filePath);
};

const getFSDLayer = filePath => {
  const match = filePath.match(
    /app\/(shared|entities|features|widgets|pages)\/([^\/]+)?/,
  );
  return match ? { layer: match[1], slice: match[2] } : null;
};

const rules = {
  // Rule 1: Enforce Design Tokens - Ban literal values in styles
  'no-literal-style-values': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Enforce design tokens instead of literal color, spacing, and other design values',
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        literalColor:
          'Replace literal color "{{value}}" with theme.colors.* token',
        literalSpacing:
          'Replace literal spacing "{{value}}" with theme.spacing[*] token',
        literalTypography:
          'Replace literal font-size "{{value}}" with theme.typography.fontSize.* token',
        literalBorderRadius:
          'Replace literal border-radius "{{value}}" with theme.borderRadius.* token',
        literalZIndex:
          'Replace literal z-index "{{value}}" with theme.zIndex[*] token',
      },
      schema: [],
    },
    create(context) {
      const colorPattern =
        /(#[0-9a-fA-F]{3,8}|rgb\(.*?\)|rgba\(.*?\)|hsl\(.*?\)|hsla\(.*?\))/;
      const spacingPattern = /^(\d+(\.\d+)?(px|rem|em)|[1-9]\d*%)$/;
      const fontSizePattern = /^(\d+(\.\d+)?(px|rem|em))$/;
      const borderRadiusPattern = /^(\d+(\.\d+)?(px|rem|em))$/;
      const zIndexPattern = /^\d+$/;

      const checkPropertyValue = (node, property, value) => {
        const propName = property.key ? property.key.name : property;
        const val = value.value || value;

        if (!val || typeof val !== 'string') return;

        // Skip exceptions
        if (
          ['transparent', '0', 'auto', '100%', '100vh', '100vw'].includes(val)
        )
          return;
        if (val.startsWith('var(--') || val.startsWith('calc(')) return;

        if (
          colorPattern.test(val) &&
          (propName.includes('color') ||
            propName.includes('Color') ||
            propName === 'backgroundColor' ||
            propName === 'borderColor')
        ) {
          context.report({
            node,
            messageId: 'literalColor',
            data: { value: val },
          });
        }

        if (
          spacingPattern.test(val) &&
          (propName.includes('margin') ||
            propName.includes('padding') ||
            propName.includes('gap') ||
            propName.includes('Margin') ||
            propName.includes('Padding'))
        ) {
          context.report({
            node,
            messageId: 'literalSpacing',
            data: { value: val },
          });
        }

        if (
          fontSizePattern.test(val) &&
          (propName.includes('fontSize') || propName.includes('font-size'))
        ) {
          context.report({
            node,
            messageId: 'literalTypography',
            data: { value: val },
          });
        }

        if (
          borderRadiusPattern.test(val) &&
          (propName.includes('borderRadius') ||
            propName.includes('border-radius'))
        ) {
          context.report({
            node,
            messageId: 'literalBorderRadius',
            data: { value: val },
          });
        }

        if (
          zIndexPattern.test(val) &&
          (propName.includes('zIndex') || propName.includes('z-index'))
        ) {
          context.report({
            node,
            messageId: 'literalZIndex',
            data: { value: val },
          });
        }
      };

      return {
        JSXAttribute(node) {
          if (
            node.name.name === 'style' &&
            node.value &&
            node.value.expression &&
            node.value.expression.type === 'ObjectExpression'
          ) {
            node.value.expression.properties.forEach(prop => {
              if (prop.value && prop.value.type === 'Literal') {
                checkPropertyValue(node, prop, prop.value);
              }
            });
          }
        },
        ObjectExpression(node) {
          // Check CSS-in-JS objects
          const parent = node.parent;
          if (
            parent &&
            (parent.type === 'TaggedTemplateExpression' ||
              parent.type === 'CallExpression')
          ) {
            node.properties.forEach(prop => {
              if (prop.value && prop.value.type === 'Literal') {
                checkPropertyValue(node, prop, prop.value);
              }
            });
          }
        },
      };
    },
  },

  // Rule 2: Enforce FSD Layer Boundaries
  'enforce-fsd-layer-boundaries': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce proper import boundaries between FSD layers',
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        invalidLayerImport:
          'Layer "{{fromLayer}}" cannot import from "{{toLayer}}". Allowed imports: {{allowedLayers}}',
        crossSliceImport:
          'Slice "{{fromSlice}}" cannot import from slice "{{toSlice}}" on the same layer "{{layer}}"',
        directApiImportInUI:
          'UI component should not directly import from API layer. Use hooks instead.',
        uiImportInApi: 'API layer should not import UI components',
        widgetImportingFromFeature:
          'Widget layer cannot import hooks/services from feature layer. Create abstracted hooks in shared layer instead.',
      },
      schema: [],
    },
    create(context) {
      const layerHierarchy = {
        pages: ['widgets', 'features', 'entities', 'shared'],
        widgets: ['features', 'entities', 'shared'],
        features: ['entities', 'shared'],
        entities: ['shared'],
        shared: ['shared'],
      };

      return {
        ImportDeclaration(node) {
          const currentFile = context.getFilename();
          const importPath = node.source.value;

          // Skip external imports
          if (!importPath.startsWith('~/')) return;

          const currentFSD = getFSDLayer(currentFile);
          const importFSD = getFSDLayer(importPath);

          if (!currentFSD || !importFSD) return;

          // Special case: Check for widgets importing hooks from features
          if (currentFSD.layer === 'widgets' && importFSD.layer === 'features') {
            // Check if importing hooks/services (common DI violation)
            const importedNames = node.specifiers.map(spec => spec.local.name);
            const hasHookImports = importedNames.some(name => name.startsWith('use'));

            if (hasHookImports) {
              context.report({
                node,
                messageId: 'widgetImportingFromFeature',
                data: {
                  fromLayer: currentFSD.layer,
                  toLayer: importFSD.layer,
                },
              });
              return; // Don't continue with general layer check
            }
          }

          // Check layer boundaries
          if (!layerHierarchy[currentFSD.layer]?.includes(importFSD.layer)) {
            context.report({
              node,
              messageId: 'invalidLayerImport',
              data: {
                fromLayer: currentFSD.layer,
                toLayer: importFSD.layer,
                allowedLayers:
                  layerHierarchy[currentFSD.layer]?.join(', ') || 'none',
              },
            });
          }

          // Check cross-slice imports on same layer
          if (
            currentFSD.layer === importFSD.layer &&
            currentFSD.slice !== importFSD.slice &&
            currentFSD.layer !== 'shared'
          ) {
            context.report({
              node,
              messageId: 'crossSliceImport',
              data: {
                fromSlice: currentFSD.slice,
                toSlice: importFSD.slice,
                layer: currentFSD.layer,
              },
            });
          }

          // Check UI -> API direct imports
          if (currentFile.includes('/ui/') && importPath.includes('/api')) {
            context.report({
              node,
              messageId: 'directApiImportInUI',
            });
          }

          // Check API -> UI imports
          if (currentFile.includes('/api') && importPath.includes('/ui/')) {
            context.report({
              node,
              messageId: 'uiImportInApi',
            });
          }
        },
      };
    },
  },

  // Rule 3: Limit Component Responsibility
  'limit-component-lines': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Limit component files to 200 lines and single default export',
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        tooManyLines:
          'Component file exceeds 200 lines ({{lines}}). Split into smaller components.',
        multipleDefaultExports:
          'Component file has multiple default exports. Each file should export exactly one component.',
      },
      schema: [],
    },
    create(context) {
      let defaultExportsCount = 0;

      return {
        Program(node) {
          const filename = context.getFilename();

          // Only check UI component files
          if (!filename.includes('/ui/') || !filename.match(/\.(tsx|jsx)$/))
            return;

          const sourceCode = context.getSourceCode();
          const lines = sourceCode.lines.length;

          if (lines > 200) {
            context.report({
              node,
              messageId: 'tooManyLines',
              data: { lines },
            });
          }
        },
        ExportDefaultDeclaration(node) {
          defaultExportsCount++;
          if (defaultExportsCount > 1) {
            context.report({
              node,
              messageId: 'multipleDefaultExports',
            });
          }
        },
        'Program:exit'() {
          defaultExportsCount = 0;
        },
      };
    },
  },

  // Rule 4: Require Pure Function Tests
  'require-pure-function-tests': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Require test files for utility functions in shared/utils/',
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        missingTestFile:
          'Missing test file for utility functions. Create {{testFile}}',
        noTestsFound: 'Test file exists but contains no test cases',
      },
      schema: [],
    },
    create(context) {
      return {
        Program(node) {
          const filename = context.getFilename();

          // Only check shared/utils files
          if (
            !filename.includes('/shared/utils/') ||
            !filename.match(/\.(ts|js)$/)
          )
            return;
          if (filename.includes('.spec.') || filename.includes('.test.'))
            return;

          const sourceCode = context.getSourceCode();
          const hasExportedFunctions = sourceCode.text.match(
            /export\s+(function|const\s+\w+\s*=|{[^}]*function)/,
          );

          if (!hasExportedFunctions) return;

          // Check for corresponding test file
          const testFile = filename.replace(/\.(ts|js)$/, '.spec.$1');
          const alternativeTestFile = filename.replace(
            /\.(ts|js)$/,
            '.test.$1',
          );

          if (!fs.existsSync(testFile) && !fs.existsSync(alternativeTestFile)) {
            context.report({
              node,
              messageId: 'missingTestFile',
              data: { testFile: path.basename(testFile) },
            });
          }
        },
      };
    },
  },

  // Rule 5: Require DI Pattern
  'no-direct-service-imports': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Prevent direct service imports in React components, suggest DI pattern',
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        directServiceImport:
          'Avoid direct service import "{{service}}". Use DI hook like use{{ServiceName}}() instead.',
        directClientImport:
          'Avoid direct client import "{{client}}". Use DI pattern instead.',
        directFeatureHookImport:
          'Avoid importing hooks directly from feature layers. Use dependency injection or create abstracted hooks in shared layer.',
      },
      schema: [],
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const filename = context.getFilename();

          // Only check React component files
          if (!filename.match(/\.(tsx|jsx)$/)) return;

          const importPath = node.source.value;
          const importName = node.specifiers[0]?.local?.name || '';

          // Skip react-dom imports (they're allowed)
          if (importPath.includes('react')) return;

          // NEW: Check for direct feature hook imports in widgets
          if (filename.includes('/widgets/') && importPath.includes('/features/')) {
            const importedNames = node.specifiers.map(spec => spec.local.name);
            const hasHookImports = importedNames.some(name => name.startsWith('use'));

            if (hasHookImports) {
              context.report({
                node,
                messageId: 'directFeatureHookImport',
                data: { hooks: importedNames.filter(name => name.startsWith('use')).join(', ') },
              });
            }
          }

          // Check for service imports
          if (
            importName.toLowerCase().includes('service') ||
            importPath.includes('service')
          ) {
            context.report({
              node,
              messageId: 'directServiceImport',
              data: {
                service: importName,
                ServiceName: importName
                  .replace(/service$/i, 'Service')
                  .replace(/^\w/, c => c.toUpperCase()),
              },
            });
          }

          // Check for client imports
          if (
            importName.toLowerCase().includes('client') ||
            importPath.includes('client')
          ) {
            context.report({
              node,
              messageId: 'directClientImport',
              data: { client: importName },
            });
          }
        },
      };
    },
  },

  // Rule 6: Enforce API Contracts
  'enforce-api-contracts': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Require explicit TypeScript interfaces or schemas in API files',
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        missingContracts:
          'API file must contain TypeScript interfaces, type definitions, or schema imports for request/response contracts',
      },
      schema: [],
    },
    create(context) {
      return {
        Program(node) {
          const filename = context.getFilename();

          // Only check features/*/api.ts files
          if (!filename.match(/features\/[^\/]+\/api\.(ts|js)$/)) return;

          const sourceCode = context.getSourceCode();
          const text = sourceCode.text;

          // Check for contracts
          const hasInterface = /interface\s+\w+/g.test(text);
          const hasType = /type\s+\w+\s*=/g.test(text);
          const hasSchemaImport = /import.*\.(z|zod|yup|schema|Schema)/g.test(
            text,
          );
          const hasTypeImport = /import\s+type.*from/g.test(text);

          if (!hasInterface && !hasType && !hasSchemaImport && !hasTypeImport) {
            context.report({
              node,
              messageId: 'missingContracts',
            });
          }
        },
      };
    },
  },

  // Rule 7: Feature Slice Baseline Structure
  'feature-slice-baseline': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce required baseline files in feature slices',
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        missingBaseline: 'Feature slice missing required file: {{filename}}',
      },
      schema: [],
    },
    create(context) {
      return {
        Program(node) {
          const filename = context.getFilename();

          // Only check files in features directory
          if (!filename.includes('/features/')) return;

          const match = filename.match(/features\/([^\/]+)/);
          if (!match) return;

          const featureName = match[1];
          const featureDir = path.dirname(filename).replace(/\/[^\/]+$/, '');

          const requiredFiles = [
            'api.ts',
            'api.spec.ts',
            'hooks.ts',
            'hooks.spec.ts',
            'README.md',
            `ui/${featureName}.page.tsx`,
            `ui/${featureName}.page.spec.ts`,
          ];

          requiredFiles.forEach(file => {
            const fullPath = path.join(featureDir, file);
            if (!fs.existsSync(fullPath)) {
              context.report({
                node,
                messageId: 'missingBaseline',
                data: { filename: file },
              });
            }
          });
        },
      };
    },
  },
};

module.exports = {
  rules,
  configs: {
    recommended: {
      plugins: ['fsd'],
      rules: {
        'fsd/no-literal-style-values': 'error',
        'fsd/enforce-fsd-layer-boundaries': 'error',
        'fsd/limit-component-lines': 'warn',
        'fsd/require-pure-function-tests': 'warn',
        'fsd/no-direct-service-imports': 'error',
        'fsd/enforce-api-contracts': 'error',
        'fsd/feature-slice-baseline': 'warn',
      },
    },
  },
};
