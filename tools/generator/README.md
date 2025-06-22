# FSD Component Generator

This generator helps create Feature-Sliced Design (FSD) compliant components, API files, and other slice elements.

## CLI Component Generator

The generator is designed to work with CLI arguments to avoid interactive prompts and ensure consistency.

### Basic Usage

```bash
# Generate component with full arguments (required approach)
npm run generate:component -- ComponentName --layer <layer> --slice <slice> --includeTests <true|false> --includeStorybook <true|false>

# Generate README for feature slice
npm run generate:readme <slice-name>
```

### Examples

```bash
# Shared component
npm run generate:component -- Button --layer shared --includeTests true --includeStorybook true

# Feature component
npm run generate:component -- LoginForm --layer features --slice auth --includeTests true --includeStorybook false

# Widget component
npm run generate:component -- UserCard --layer widgets --slice profile --includeTests true --includeStorybook true
```

## 🚨 Critical: API Contract Generation

### **New Feature: Auto-Generated API Contracts**

When generating features with API files, the generator now automatically creates API contracts that comply with the `enforce-contracts` ESLint rule.

### **Generated API File Structure:**

```typescript
// features/user-management/api.ts

import { baseApi } from '~/shared/lib/store/api';

// API Contract Definitions (Required by enforce-contracts rule)
export interface GetUserRequest { /* ... */ }
export interface GetUserResponse { /* ... */ }
export interface CreateUserRequest { /* ... */ }
export interface CreateUserResponse { /* ... */ }

// RTK Query endpoints using explicit API contracts
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUserResponse, GetUserRequest>({
      // Implementation with proper contracts
    }),
  }),
});
```

### **Why API Contracts Are Required:**

1. **ESLint Compliance** — Satisfies `enforce-contracts` rule requirements
2. **Documentation** — API contracts serve as living endpoint documentation  
3. **Type Safety** — Explicit request/response typing at compile time
4. **FSD Architecture** — Proper separation between entities and API layers

### **Best Practices for API Generation:**

#### ✅ **DO: Use Local API Contracts**
```typescript
// API contracts in the API file itself
export interface CreateTaskApiRequest extends CreateTaskData {}
export interface CreateTaskApiResponse extends TaskResponse {}
```

#### ❌ **DON'T: Only Entity Imports**
```typescript
// This will trigger enforce-contracts ESLint error
import type { Task, CreateTaskData } from '~/entities/task';
// Missing local API contracts!
```

#### ✅ **DO: Import + Local Contracts**
```typescript
import type { Task, CreateTaskData } from '~/entities/task';

// API contracts extending entity types
export interface CreateTaskApiRequest extends CreateTaskData {}
export interface CreateTaskApiResponse {
  task: Task;
  success: boolean;
}
```

## Component Generation Rules

### Layer Requirements

- **shared**: No slice required
- **entities, features, widgets, pages**: Slice required

### File Structure

Generated files follow this structure:

```
layer/slice/
├── ui/
│   ├── ComponentName.tsx       # Main component
│   ├── ComponentName.spec.tsx  # Tests (if includeTests: true)
│   └── ComponentName.stories.tsx # Storybook (if includeStorybook: true)
├── api.ts                      # API file (auto-generated for features)
├── hooks.ts                    # Custom hooks
└── index.ts                    # Public exports
```

### Template Variables

Available variables in templates:

- `{{componentName}}` - Original component name
- `{{pascalCase componentName}}` - PascalCase component name
- `{{camelCase componentName}}` - camelCase component name
- `{{kebabCase componentName}}` - kebab-case component name
- `{{slice}}` - Slice name
- `{{layer}}` - Layer name

## Architecture Compliance

The generator ensures compliance with:

- **FSD Architecture** - Proper layer and slice organization
- **enforce-contracts** - API files include required contracts
- **limit-component-responsibility** - Components stay under 200 lines
- **enforce-layer-boundaries** - Proper import restrictions
- **feature-slice-baseline** - Required baseline files

## Advanced Usage

### Custom Templates

Templates are located in `tools/generator/templates/`:

- `component.hbs` - React component template
- `api.hbs` - API file template (with contracts)
- `hooks.hbs` - Custom hooks template
- `readme.hbs` - Feature README template

### Generator Configuration

The generator is configured via `tools/generator/component.js` and supports:

- CLI argument parsing
- Template customization
- File path resolution
- Index file updates

## Troubleshooting

### Common ESLint Errors

#### **enforce-contracts violation:**
```
Error: API file must contain TypeScript interfaces or schema imports
```
**Solution:** Use the updated generator - it automatically includes API contracts.

#### **feature-slice-baseline violation:**
```  
Error: Feature slice missing required file: api.ts
```
**Solution:** Run the feature generator to create all baseline files.

### Generator Best Practices

1. **Always use CLI mode** with full arguments
2. **Generate complete features** rather than individual files
3. **Customize generated templates** for your specific use cases
4. **Follow FSD import rules** when editing generated files

## Integration with Project Rules

This generator works with all project ESLint rules:

- **enforce-contracts** ✅ Auto-generates API contracts
- **enforce-plop-generator** ✅ CLI-first approach
- **feature-slice-baseline** ✅ Creates all required files
- **limit-component-responsibility** ✅ Templates stay under 200 lines
- **enforce-layer-boundaries** ✅ Correct import patterns 