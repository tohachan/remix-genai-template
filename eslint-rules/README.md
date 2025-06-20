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

Requires explicit TypeScript interfaces for request/response contracts in feature API files. API files must contain TypeScript type definitions that document the data structures used in API operations.

**❌ Wrong - Missing explicit contracts:**
```typescript
// features/auth/api.ts - without explicit types
export const loginUser = async (email, password) => {
  return fetch('/api/login', { /* ... */ });
};

// Re-exports without contracts
export { updateTask } from '~/features/task-management/api';
```

**✅ Correct - With explicit contracts:**
```typescript
// features/auth/api.ts - with explicit TypeScript contracts
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

**✅ Correct - Re-exports with explicit contracts:**
```typescript
// features/kanban-board/api.ts - proper contracts for re-exports
import type { Task, TaskStatus } from '~/entities/task';

// Explicit contracts for kanban-specific operations
interface KanbanBoardRequest {
  projectId?: string;
  filters?: {
    assignee?: string;
    priority?: string;
  };
}

interface KanbanBoardResponse {
  columns: {
    todo: Task[];
    'in-progress': Task[];
    done: Task[];
  };
  totalTasks: number;
}

interface KanbanStatusUpdateRequest {
  taskId: string;
  newStatus: TaskStatus;
  position?: number;
}

interface KanbanStatusUpdateResponse {
  task: Task;
  success: boolean;
}

// Re-export with proper typing
export { getTasks, updateTask } from '~/features/task-management/api';

// Kanban-specific functions with contracts
export const getKanbanBoard = async (request: KanbanBoardRequest): Promise<KanbanBoardResponse> => {
  // Implementation
};

export const updateTaskStatus = async (request: KanbanStatusUpdateRequest): Promise<KanbanStatusUpdateResponse> => {
  // Implementation
};
```

**Rule Requirements:**
- All feature API files must contain explicit TypeScript interfaces
- Request/Response types must be clearly defined
- Re-exports are allowed but must include related contracts
- Type imports from entities layer are encouraged
- JSDoc comments on interfaces are recommended

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