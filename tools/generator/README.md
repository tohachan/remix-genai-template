# FSD Component Generator

A component generator for projects following the Feature-Sliced Design (FSD) architecture. Automatically creates components that comply with all project rules and standards.

## Features

- ✅ Component creation in accordance with FSD architecture
- ✅ Automatic placement in correct layers (`shared`, `entities`, `features`, `widgets`, `pages`)
- ✅ Simple functional components with children and className props
- ✅ Automatic test generation with full coverage
- ✅ Optional Storybook stories generation
- ✅ Compliance with all project rules:
  - Minimal use of Tailwind classes (only basic ones)
  - TypeScript strict mode
  - Component size limit of 200 lines
  - One default export per file
  - Correct import/export patterns

## Usage

### CLI Generation (Recommended)

```bash
npm run generate:component -- [ComponentName] [options]
```

**Available CLI Arguments:**
- `--layer <layer>` - FSD layer (shared, entities, features, widgets, pages) **[REQUIRED]**
- `--slice <slice>` - Slice name (required for entities, features, widgets, pages)
- `--includeTests <bool>` - Generate test file (default: true)
- `--includeStorybook <bool>` - Generate Storybook story (default: false)
- `--help, -h` - Show help with examples

**Important:** Always specify all arguments including defaults to avoid interactive prompts.

### CLI Arguments Reference

| Argument | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `ComponentName` | string | Yes | - | Component name in PascalCase |
| `--layer` | string | Yes | - | FSD layer: shared, entities, features, widgets, pages |
| `--slice` | string | Conditional | - | Slice name (required for non-shared layers) |
| `--includeTests` | boolean | Yes | true | Generate test file (.spec.tsx) |
| `--includeStorybook` | boolean | Yes | false | Generate Storybook story (.stories.tsx) |

**Best Practice:** Always specify ALL arguments to prevent interactive prompts:

```bash
# ✅ CORRECT - Full arguments specified
npm run generate:component -- Button --layer shared --includeTests true --includeStorybook false

# ❌ WRONG - Missing arguments will trigger prompts  
npm run generate:component -- Button --layer shared
```

### Interactive Generation (Alternative)

```bash
npm run generate:component
```

The generator will ask you to select:
1. **FSD Layer** (`shared`, `entities`, `features`, `widgets`, `pages`)
2. **Slice Name** (for layers requiring slices)
3. **Component Name** (PascalCase)
4. **Generate Tests** (enabled by default)
5. **Generate Storybook Stories** (optional)

### CLI Examples

#### Creating a Component in the Shared Layer

```bash
# Full command with all arguments (recommended approach)
npm run generate:component -- CustomButton --layer shared --includeTests true --includeStorybook false

# Result:
# app/shared/ui/CustomButton.tsx
# app/shared/ui/CustomButton.spec.tsx
# app/shared/index.ts (updated)
```

#### Creating a Component in the Feature Layer

```bash
# Full command with all arguments (recommended approach)
npm run generate:component -- LoginForm --layer features --slice auth --includeTests true --includeStorybook false

# Result:
# app/features/auth/ui/LoginForm.tsx
# app/features/auth/ui/LoginForm.spec.tsx
# app/features/auth/index.ts (updated)
```

#### Creating a Component with Storybook in the Widgets Layer

```bash
# Full command with all arguments (recommended approach)
npm run generate:component -- UserCard --layer widgets --slice profile --includeStorybook true --includeTests true

# Result:
# app/widgets/profile/ui/UserCard.tsx
# app/widgets/profile/ui/UserCard.spec.tsx
# app/widgets/profile/ui/UserCard.stories.tsx
# app/widgets/profile/index.ts (updated)
```

#### Creating Components in Other Layers

```bash
# Entity layer component
npm run generate:component -- ProductCard --layer entities --slice products --includeTests true --includeStorybook false

# Page layer component  
npm run generate:component -- HomePage --layer pages --slice home --includeTests true --includeStorybook false
```

### Interactive Examples (Alternative Approach)

#### Creating a Component in the Shared Layer

```bash
npm run generate:component
# Select:
# - Layer: shared
# - Component Name: CustomButton
# - Include tests: Yes

# Result:
# app/shared/ui/CustomButton.tsx
# app/shared/ui/CustomButton.spec.tsx
# app/shared/index.ts (updated)
```

#### Creating a Component in the Feature Layer

```bash
npm run generate:component
# Select:
# - Layer: features
# - Slice: auth  
# - Component Name: LoginForm
# - Include tests: Yes

# Result:
# app/features/auth/ui/LoginForm.tsx
# app/features/auth/ui/LoginForm.spec.tsx
# app/features/auth/index.ts (updated)
```

## File Structure

The generator creates the following structure:

```
app/
└── [layer]/
    └── [slice]?/
        ├── ui/
        │   ├── ComponentName.tsx          # Main component
        │   ├── ComponentName.spec.tsx     # Tests
        │   └── ComponentName.stories.tsx  # Storybook (optional)
        ├── index.ts                       # Slice exports
        └── README.md                      # Slice documentation
```

## Component Structure

The generator creates a simple functional component with the following characteristics:

- **Props interface**: Includes `children` and `className`
- **forwardRef**: Proper ref forwarding to DOM element
- **cn function**: Using utility for class merging
- **Basic styling**: Minimal Tailwind class `p-4` for easy editing

## Rule Compliance

### Minimal Styling
All components use:
- Only basic Tailwind class `p-4` for initial styling
- cn utility for class merging
- Ready structure for adding custom styling via className prop

### TypeScript
- Strict mode compliance
- Proper typing of all props
- Generic types for forwardRef
- Interfaces for component props

### Testing
- Full coverage of all props and states
- Rendering, events, and accessibility checks
- Proper work with Jest and React Testing Library
- forwardRef and displayName verification

### FSD Architecture
- Correct placement in layers
- Compliance with import/export rules
- Automatic index.ts file updates
- Integration with README generation for feature layers

## Templates

The generator uses Handlebars templates in the `templates/` folder:

- `component.hbs` - main component template
- `component.spec.hbs` - test template
- `component.stories.hbs` - Storybook stories template

### Handlebars Helpers

Available helpers:
- `{{pascalCase str}}` - PascalCase conversion
- `{{camelCase str}}` - camelCase conversion
- `{{kebabCase str}}` - kebab-case conversion

## Rule Integration

After generating a component in the feature layer, the generator automatically suggests updating the README:

```bash
📝 Slice files modified. Consider updating documentation:
npm run generate:readme [slice-name]
```

This complies with the `auto-generate-readme` rule from the project.

## Extension

To customize the generator:

1. Update the template in `component.hbs` to change the component structure
2. Add additional tests in `component.spec.hbs`
3. Extend Storybook stories in `component.stories.hbs`
4. Update this README

## Troubleshooting

### "Template not found" Error
Make sure the `templates/` folder contains all necessary `.hbs` files.

### Name Validation Error
- Component names must start with a capital letter (PascalCase)
- Slice names must be lowercase with hyphens

### Import Conflicts
The generator automatically updates `index.ts` in the slice root, but check for duplicate exports.

### Test Issues
Make sure Jest is configured correctly and all necessary testing-library packages are installed. 