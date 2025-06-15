# ESLint Plugin for Feature-Sliced Design (FSD)

ESLint plugin for automating Feature-Sliced Design architecture rules based on cursor rules.

## Installation

```bash
npm install --save-dev ./eslint-rules
```

## Configuration

### Quick Setup (Recommended)

```json
{
  "extends": ["plugin:fsd/recommended"]
}
```

### Manual Configuration

```json
{
  "plugins": ["fsd"],
  "rules": {
    "fsd/no-literal-style-values": "error",
    "fsd/enforce-fsd-layer-boundaries": "error",
    "fsd/limit-component-lines": "warn",
    "fsd/require-pure-function-tests": "warn",
    "fsd/no-direct-service-imports": "error",
    "fsd/enforce-api-contracts": "error",
    "fsd/feature-slice-baseline": "warn"
  }
}
```

## Rules

### 🎨 `fsd/no-literal-style-values`

Prohibits the use of literal values in styles and requires the use of design tokens.

**❌ Wrong:**
```tsx
<div style={{ backgroundColor: '#3b82f6', margin: '16px' }}>
```

**✅ Correct:**
```tsx
<div style={{ backgroundColor: theme.colors.primary[500], margin: theme.spacing[4] }}>
```

### 🏗️ `fsd/enforce-fsd-layer-boundaries`

Checks the correctness of imports between FSD architecture layers.

**❌ Wrong:**
```tsx
// In features/auth/ui/LoginForm.tsx
import { loginUser } from '../api'; // Direct API import in UI
```

**✅ Correct:**
```tsx
// In features/auth/ui/LoginForm.tsx
import { useAuth } from '../hooks'; // Using hooks as an intermediate layer
```

### 📏 `fsd/limit-component-lines`

Limits React component size to 200 lines and requires a single default export.

**❌ Wrong:**
- Component files larger than 200 lines
- Multiple default exports in one file

### 🧪 `fsd/require-pure-function-tests`

Requires tests for utility functions in `shared/utils/`.

**❌ Wrong:**
```
app/shared/utils/
├── mathUtils.ts          # Has exported functions
└── # No mathUtils.spec.ts
```

**✅ Correct:**
```
app/shared/utils/
├── mathUtils.ts          
└── mathUtils.spec.ts     # Has tests
```

### 💉 `fsd/no-direct-service-imports`

Prohibits direct service imports in React components, requires using DI patterns.

**❌ Wrong:**
```tsx
import authService from '~/shared/api/authService';

function LoginForm() {
  authService.login(); // Direct service usage
}
```

**✅ Correct:**
```tsx
import { useAuthService } from '~/shared/lib/di/useAuthService';

function LoginForm() {
  const authService = useAuthService(); // DI through hook
  authService.login();
}
```

### 📋 `fsd/enforce-api-contracts`

Requires explicit TypeScript interfaces or schemas in API files of features.

**❌ Wrong:**
```typescript
// features/auth/api.ts - without types
export const loginUser = async (email, password) => {
  return fetch('/api/login', { /* ... */ });
};
```

**✅ Correct:**
```typescript
// features/auth/api.ts - with types
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const loginUser = async (request: LoginRequest): Promise<LoginResponse> => {
  return fetch('/api/login', { /* ... */ });
};
```

### 📁 `fsd/feature-slice-baseline`

Checks for required files in feature slices.

Each `app/features/<feature>/` should contain:
- `api.ts` and `api.spec.ts`
- `hooks.ts` and `hooks.spec.ts` 
- `ui/<feature>.page.tsx` and `ui/<feature>.page.spec.ts`
- `README.md`

## Cursor Rules Mapping

This plugin automates the following rules from `.cursor/rules/`:

| Cursor Rule | ESLint Rule | Automation |
|-------------|-------------|------------|
| `enforce-design-tokens.mdc` | `no-literal-style-values` | ✅ Full |
| `enforce-layer-boundaries.mdc` | `enforce-fsd-layer-boundaries` | ✅ Full |
| `enforce-project-structure.mdc` | `enforce-fsd-layer-boundaries` | ✅ Partial |
| `limit-component-responsibility.mdc` | `limit-component-lines` | ✅ Full |
| `require-pure-function-tests.mdc` | `require-pure-function-tests` | ✅ Full |
| `require-di-pattern.mdc` | `no-direct-service-imports` | ✅ Full |
| `enforce-contracts.mdc` | `enforce-api-contracts` | ✅ Full |
| `feature-slice-baseline.mdc` | `feature-slice-baseline` | ⚠️ Partial |

### Rules not suitable for ESLint:

- `task-approach.mdc` - development process rules
- `critical-workflow-checks.mdc` - workflow checks
- `enforce-plop-generator.mdc` - generator usage (runtime)
- `feature-readme-format.mdc` - README file format
- `remix-integration-test.mdc` - integration tests
- `auto-generate-readme.mdc` - documentation auto-generation
- `require-ts-strict.mdc` - TypeScript settings (via tsconfig.json)

## Project Integration

The plugin is automatically integrated in this project. In other projects, you can:

1. **Install the plugin:**
   ```bash
   npm install --save-dev ./eslint-rules
   ```

2. **Add to your ESLint configuration:**
   ```json
   {
     "extends": [
       "your-existing-config",
       "plugin:fsd/recommended"
     ]
   }
   ```

3. **Run linting:**
   ```bash
   npm run lint
   ```

## Compatibility

- **Node.js**: >= 12.0.0
- **ESLint**: >= 7.0.0
- **TypeScript**: supported via @typescript-eslint/parser

## License

MIT 