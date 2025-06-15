# Remix + Gen AI Template

> [!NOTE]  
> **🤖 Cursor AI Optimized**  
> This template is specifically designed and optimized for **Cursor AI** development workflows. The Gen AI features, architectural rules, and automation work seamlessly with Cursor's AI capabilities. **Other AI tools** can also benefit from the comprehensive rule set in `.cursor/rules/` - see the [manual usage guide](#using-cursorrules-with-other-gen-ai-tools) below.

A comprehensive starter kit for building scalable Remix applications using **Feature-Sliced Design (FSD)** architecture, optimized for seamless **Gen AI development** workflows with **Cursor AI**.

## 🚀 What This Template Provides

This template combines modern web development tools with architectural best practices to ensure **consistent, high-quality results** when working with AI-assisted development:

- ⚡ **Remix + Vite** - Modern full-stack React framework with fast build tooling
- 🎨 **Tailwind CSS + shadcn/ui** - Utility-first CSS with beautiful, accessible components
- 🏗️ **Feature-Sliced Design (FSD)** - Scalable architecture methodology
- 🔄 **RTK Query** - Powerful data fetching and caching with automatic re-validation
- 🤖 **Cursor AI Optimized** - Structured rules and conventions for reliable Cursor AI assistance
- 🔧 **Other AI Tools Compatible** - Comprehensive rule set usable with ChatGPT, Claude, GitHub Copilot
- 📝 **Automated Documentation** - Self-maintaining documentation system
- 🧪 **Complete Testing Suite** - Jest for unit tests, Playwright for e2e testing
- 🔧 **Developer Tools** - ESLint, TypeScript strict mode, accessibility linting
- ♿ **Accessibility First** - Built-in a11y validation and best practices enforcement
- 📋 **Code Generation** - Automated feature and test scaffolding

## 🏛️ Architecture Overview

This template implements **Feature-Sliced Design**, providing clear separation of concerns across standardized layers:

```
app/
├── shared/      # Reusable utilities, UI components, configurations
├── entities/    # Business entities (user, product, etc.)
├── features/    # Product features with business value
├── widgets/     # Complex UI components
├── pages/       # Application pages and routes
└── routes/      # Remix routing convention
```

## 🤖 Cursor AI Integration

### Why This Structure Works with Cursor AI

The template is specifically designed for **Cursor AI** and maintains **integrity and consistency** during AI-assisted development through:

- **Cursor Rules Integration** - Comprehensive `.cursor/rules/` directory with 17+ specialized rules
- **Structured File Organization** - Predictable locations for components and logic that Cursor understands
- **Automated Validation** - Built-in checks for architectural compliance during development
- **Self-Documenting Code** - README files and metadata specifically formatted for Cursor AI context
- **FSD Architecture Enforcement** - Custom ESLint rules that work seamlessly with Cursor's linting

### Key Benefits for Cursor AI Development

- **Predictable Outcomes** - Consistent results across different Cursor AI sessions
- **Reduced Errors** - Clear constraints prevent architectural violations through real-time validation
- **Faster Development** - Cursor AI understands the FSD structure and can work more efficiently
- **Maintainable Code** - Well-organized codebase that scales with your project
- **Rule-Based Guidance** - Cursor applies project-specific rules automatically during development

### Cursor-Specific Features

- **17+ Cursor Rules** - Located in `.cursor/rules/` covering architecture, accessibility, testing, and quality
- **Automatic Rule Application** - Rules are applied contextually as you develop
- **Generator Integration** - CLI generators work perfectly with Cursor's workflow
- **Documentation Automation** - README generation optimized for Cursor AI understanding

### Using .cursor/rules with Other Gen AI Tools

While this template is optimized for Cursor AI, other AI tools can benefit from the comprehensive rule set:

#### Manual Rule Application
Other Gen AI tools (ChatGPT, Claude, GitHub Copilot, etc.) can use these rules by:

1. **Read the rules directory** - All rules are in `.cursor/rules/` as markdown files
2. **Reference specific rules** - Copy relevant rule content into your AI conversation
3. **Apply architecture patterns** - Use the FSD structure and patterns described in the rules

#### Key Rules for Other AI Tools

**Essential rules to reference:**
```bash
.cursor/rules/
├── enforce-project-structure.mdc     # FSD architecture basics
├── enforce-layer-boundaries.mdc     # Import restrictions between layers  
├── limit-component-responsibility.mdc # Component size and structure limits
├── enforce-design-tokens.mdc        # Styling standards
├── enforce-a11y-support.mdc         # Accessibility requirements
├── feature-slice-baseline.mdc       # Required files in features
└── task-approach.mdc               # Development workflow patterns
```

#### Usage Examples

**For ChatGPT/Claude:**
```
Please follow the component responsibility rules from .cursor/rules/limit-component-responsibility.mdc:
- Components must be under 200 lines
- Single default export per file
- Extract large components using container/presentation pattern
```

**For GitHub Copilot:**
- Add rule content as comments in your files for context
- Reference architectural patterns when writing new features
- Use the FSD structure described in the rules

#### Limitations for Other AI Tools

⚠️ **What works differently:**
- **No automatic rule application** - Rules must be manually referenced
- **No real-time validation** - ESLint integration works, but no AI context
- **No generator integration** - CLI generators work, but no AI assistance
- **Manual documentation** - README generation works, but requires manual execution

#### Getting Maximum Value

To get the most from these rules with other AI tools:

1. **Start each session** by referencing relevant rules from `.cursor/rules/`
2. **Copy rule content** into your conversation for context
3. **Use ESLint validation** - Run `npm run lint` to check compliance
4. **Follow FSD structure** - Maintain the layer boundaries described in rules
5. **Generate components** - Use `npm run generate:component` for consistency

## 🚀 Getting Started

**Using with other AI tools?** → Jump to [.cursor/rules usage guide](#using-cursorrules-with-other-gen-ai-tools)

1. **Install dependencies** (requires Node.js 18+):
   ```bash
   npm install
   ```

2. **Install Playwright browsers** (for e2e testing):
   ```bash
   npx playwright install
   ```

3. **Start the development server**:
   ```bash
   # For full development with mock API:
   npm run dev:full
   
   # Or start separately:
   npm run dev:api    # JSON server on port 3001
   npm run dev        # Remix app on port 3000
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Start the production server**:
   ```bash
   npm start
   ```

## 🧪 Testing

The template includes a comprehensive testing setup:

### Unit Testing (Jest)
- **Framework**: Jest with TypeScript support
- **Environment**: jsdom for DOM testing
- **Testing Library**: React Testing Library included
- **Location**: `*.spec.ts` files next to source files

```bash
# Run all unit tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### End-to-End Testing (Playwright)
- **Framework**: Playwright for cross-browser testing
- **Location**: `*.page.spec.ts` files for integration tests
- **Browsers**: Chromium, Firefox, WebKit

```bash
# Run e2e tests
npm run test:e2e

# Run in UI mode
npm run test:e2e -- --ui
```

### Testing Requirements
- **Unit tests** - Required for all utility functions in `shared/utils/`
- **Integration tests** - Required for all feature page components (`*.page.tsx`)
- **Type safety** - Strict TypeScript configuration enforced

## 🎨 UI Components

The project includes shadcn/ui components with design system integration. To add more components:

```bash
npx shadcn-ui@latest add <component>
```

All components automatically follow the design token system for consistent theming and include accessibility features by default.

## 🔄 RTK Query Integration

The template includes **RTK Query** for efficient data fetching and state management:

### Key Features
- **Automatic Caching** - Intelligent request deduplication and background synchronization
- **Real-time Updates** - Automatic cache invalidation and refetching
- **Optimistic Updates** - Immediate UI updates with rollback on errors
- **TypeScript Integration** - Fully typed API requests and responses
- **FSD Architecture** - Clean separation between API, hooks, and UI layers

### Architecture Pattern

RTK Query follows the FSD layer separation pattern:

```typescript
// 1. API Layer (api.ts) - RTK Query endpoints
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, QueryParams>({
      query: (params) => ({ url: '/users', params }),
      providesTags: ['User'],
    }),
  }),
});

// 2. Hooks Layer (hooks.ts) - Business logic orchestration
export function useUsersList(params: QueryParams = {}) {
  const { data, isLoading, error } = useGetUsersQuery(params);
  return { users: data?.data || [], isLoading, error };
}

// 3. UI Layer (ui/) - Components use hooks, not RTK Query directly
export default function UserList() {
  const { users, isLoading } = useUsersList(); // Use hook abstraction
  return <div>{/* UI rendering */}</div>;
}
```

### Creating New APIs

1. **Extend the base API** in your feature's `api.ts`:
   ```typescript
   import { baseApi } from '~/shared/lib/store/api';
   
   export const featureApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
       getData: builder.query({
         query: () => '/data',
         providesTags: ['Data'],
       }),
     }),
   });
   ```

2. **Create business logic hooks** in `hooks.ts`:
   ```typescript
   export function useFeatureData() {
     const { data, isLoading, error } = useGetDataQuery();
     return { items: data?.data || [], isLoading, error };
   }
   ```

3. **Use hooks in UI components** - never import RTK Query directly in UI:
   ```typescript
   export default function FeatureComponent() {
     const { items, isLoading } = useFeatureData();
     // Component logic...
   }
   ```

### Mock API Server

The template includes a JSON server for RTK Query demo:

```bash
# Start mock API server (port 3001)
npm run dev:api

# Available endpoints:
# GET    /users?_page=1&_limit=10&q=search
# GET    /users/:id
# POST   /users
# PATCH  /users/:id  
# DELETE /users/:id
```

### Example Implementation

See `app/features/example-api/` for a complete RTK Query implementation with:
- **Full CRUD operations** with JSON server backend
- **Real HTTP requests** with automatic caching
- **Pagination and search** with URL parameters
- **Form handling** for creating/editing users
- **Error handling** and loading states
- **Cache invalidation** patterns
- **TypeScript integration** throughout

## 📚 Development Workflows

### Creating New Features

1. **Generate feature structure**:
   ```bash
   npm run generate:component -- FeaturePage --layer features --slice feature-name --includeTests true --includeStorybook false
   ```
   This creates the complete baseline structure: `api.ts`, `hooks.ts`, `ui/` directory, tests, and README.

2. **Follow layer separation**:
   - Place backend logic in `api.ts`
   - Create React hooks in `hooks.ts` that use API functions
   - Build UI components in `ui/` that consume hooks (not API directly)
   - Keep components under 200 lines

3. **Write tests manually** for utilities and components following the project testing patterns.

4. **Update documentation**:
   ```bash
   npm run generate:readme <slice-name>
   ```

### Code Quality

The project includes automated FSD architecture validation through ESLint rules:

```bash
# Lint code (includes FSD architecture checks)
npm run lint

# Check accessibility compliance
npm run lint:a11y

# Format code
npm run format

# Type check
npm run typecheck
```

#### FSD ESLint Rules

The project automatically enforces Feature-Sliced Design architecture through custom ESLint rules:

- **Design Tokens** - No hard-coded colors, spacing, or typography values
- **Layer Boundaries** - Proper import restrictions between FSD layers
- **Component Responsibility** - 200-line limit and single default export
- **Accessibility Standards** - ARIA labels, keyboard navigation, semantic HTML enforcement
- **Testing Requirements** - Tests required for utility functions
- **API Contracts** - TypeScript interfaces required in API files
- **Dependency Injection** - No direct service imports in React components

These rules are automatically integrated and work out-of-the-box. **Example violations:**
```tsx
// ❌ Wrong - Hard-coded styling
<div style={{ backgroundColor: '#3b82f6', margin: '16px' }}>

// ✅ Correct - Design tokens
<div style={{ backgroundColor: theme.colors.primary[500], margin: theme.spacing[4] }}>

// ❌ Wrong - Direct API import in UI
import { loginUser } from '../api';

// ✅ Correct - Using hooks layer
import { useAuth } from '../hooks';

// ❌ Wrong - Inaccessible button
<div onClick={handleClick}>Click me</div>

// ✅ Correct - Accessible button
<button onClick={handleClick} aria-label="Close modal">×</button>
```

## 🏗️ Feature-Sliced Design Benefits

- **Scalability** - Architecture grows with your application
- **Team Collaboration** - Clear boundaries and responsibilities
- **Code Reusability** - Shared components across features
- **Maintainability** - Easy to locate and modify functionality
- **Testing** - Isolated features are easier to test

### Architectural Patterns

The template enforces **clean architecture patterns** within feature slices:

#### Layer Separation
Each feature follows a **three-layer architecture**:
- **UI Layer** (`ui/`) - Presentation components and user interaction
- **Hooks Layer** (`hooks.ts`) - State management and business logic orchestration
- **API Layer** (`api.ts`) - Backend communication and data fetching

**Import Rules:**
- ✅ UI components use public hook APIs: `import { useAuth } from '../hooks'`
- ✅ Hooks orchestrate API calls: `import { loginUser } from './api'`
- ❌ UI components should NOT directly import API: `import { loginUser } from '../api'`
- ❌ API/hooks should NOT import UI components

#### Component Responsibility
React components in `ui/` directories follow **single responsibility principle**:
- **Maximum 200 lines** per component file
- **One default export** per file
- **Extract large components** into smaller, focused pieces:
  - Container/Presentational pattern
  - Custom hooks for complex logic
  - Sub-components for UI composition

**Refactoring strategies:**
```tsx
// ❌ Large component (200+ lines)
export default function UserDashboard() {
  // Too much logic and UI in one place
}

// ✅ Split components
export default function UserDashboard() {
  const { user, loading, actions } = useUserDashboard(); // Logic in hook
  return <UserDashboardView user={user} loading={loading} {...actions} />; // Pure UI
}
```

## 📖 Documentation

Each feature maintains its own documentation with:
- Human-readable instructions
- AI-readable metadata
- API specifications
- Testing guidelines

The template automatically enforces documentation standards through:
- Required README.md files in feature slices
- Standardized format for human and AI consumption
- Auto-generation commands for keeping docs up-to-date

## 🔧 Configuration Files

The template includes optimized configurations:

### TypeScript
- **tsconfig.json** - Strict mode enabled for better type safety
- **Path mapping** - Clean imports with `~` alias

### Code Quality
- **.eslintrc.js** - ESLint with TypeScript integration and formatting rules
- **.eslintrc.a11y.js** - Specialized accessibility linting configuration
- **jest.config.js** - Unit testing configuration
- **playwright.config.ts** - E2E testing configuration

### Build & Development
- **Vite** - Fast development and build processes
- **Tailwind CSS** - Design system integration
- **PostCSS** - CSS processing pipeline

## 📋 Available Scripts

```bash
# Development
npm run dev:full     # Start both Remix app and mock API server
npm run dev          # Start Remix development server only
npm run dev:api      # Start mock API server only (port 3001)
npm run build        # Build for production
npm start           # Start production server

# Testing
npm test            # Run unit tests
npm run test:watch  # Unit tests in watch mode
npm run test:coverage # Generate test coverage
npm run test:e2e    # Run e2e tests

# Code Quality
npm run lint        # Lint code
npm run lint:a11y   # Check accessibility compliance
npm run format      # Format code
npm run typecheck   # TypeScript type checking

# Code Generation
npm run generate:component <name> # Generate component with full options
                                  # For features: npm run generate:component -- FeaturePage --layer features --slice feature-name
npm run generate:readme <name>   # Update slice documentation
```

## 🔍 Project Rules

The template enforces architectural consistency through comprehensive rules, automatically validated by ESLint:

### Architecture Rules (ESLint Enforced)
- **Layer Boundaries** - Strict import restrictions between UI, hooks, and API layers
- **Component Size Limits** - React components limited to 200 lines with single responsibility
- **FSD Structure** - Proper layer organization and slice boundaries
- **Design Tokens** - No hard-coded values in styling (colors, spacing, typography)
- **API Contracts** - TypeScript interfaces required in all API files
- **Dependency Injection** - No direct service imports in React components

### Quality Rules  
- **Testing Requirements** - Mandatory tests for utilities and page components
- **Documentation Standards** - Structured README format for slices
- **TypeScript Strict Mode** - Full type safety enforcement
- **Code Formatting** - ESLint with auto-formatting

### Feature Development Rules
Each feature slice must include:
- `api.ts` + `api.spec.ts` - RTK Query endpoints with tests
- `hooks.ts` + `hooks.spec.ts` - Business logic hooks using RTK Query with tests  
- `ui/<feature>.page.tsx` + `ui/<feature>.page.spec.ts` - Main page with integration tests
- `README.md` - Human and AI documentation

### RTK Query Rules
- **API Layer** - Use RTK Query endpoints in `api.ts`, extend `baseApi`
- **Hooks Layer** - Create business logic hooks that wrap RTK Query hooks
- **UI Layer** - Components use business logic hooks, never RTK Query directly
- **Cache Management** - Proper tag configuration for automatic invalidation

### Validation
The template automatically validates through ESLint:
- Import patterns and layer boundaries (real-time in IDE)
- Component size and responsibility limits
- Design token usage vs hard-coded values
- API contract requirements
- Dependency injection patterns
- Test coverage for utilities and pages
- Documentation completeness
- TypeScript compliance

**All FSD architecture rules are now enforced automatically during development and in CI/CD.**

## 🤝 Contributing

This template is designed to maintain consistency across teams and **specifically optimized for Cursor AI development**. Please follow the established patterns and run validation scripts before submitting changes:

1. Run tests: `npm test && npm run test:e2e`
2. Check code quality: `npm run lint && npm run lint:a11y && npm run typecheck`
3. Update documentation if needed: `npm run generate:readme <slice>`

For more details, see the [Cursor AI documentation](https://cursor.sh/), [shadcn documentation](https://ui.shadcn.com/) and [Feature-Sliced Design methodology](https://feature-sliced.design/).
