# Remix + Gen AI Template

> [!WARNING]  
> **🚧 Work in Progress**  
> This template is currently under active development. Not all features described in this README are fully implemented yet. Some scripts, generators, and architectural components are still being built. Use with caution in production environments.

A comprehensive starter kit for building scalable Remix applications using **Feature-Sliced Design (FSD)** architecture, optimized for seamless **Gen AI development** workflows.

## 🚀 What This Template Provides

This template combines modern web development tools with architectural best practices to ensure **consistent, high-quality results** when working with AI-assisted development:

- ⚡ **Remix + Vite** - Modern full-stack React framework with fast build tooling
- 🎨 **Tailwind CSS + shadcn/ui** - Utility-first CSS with beautiful, accessible components
- 🏗️ **Feature-Sliced Design (FSD)** - Scalable architecture methodology
- 🤖 **Gen AI Optimized** - Structured rules and conventions for reliable AI assistance
- 📝 **Automated Documentation** - Self-maintaining documentation system
- 🧪 **Complete Testing Suite** - Jest for unit tests, Playwright for e2e testing
- 🔧 **Developer Tools** - ESLint, Prettier, TypeScript strict mode
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

## 🤖 Gen AI Integration

### Why This Structure Works with AI

The template maintains **integrity and consistency** during AI-assisted development through:

- **Clear Rules & Conventions** - Standardized patterns that AI tools can reliably follow
- **Structured File Organization** - Predictable locations for components and logic
- **Automated Validation** - Built-in checks for architectural compliance
- **Self-Documenting Code** - README files and metadata for AI context

### Key Benefits for AI Development

- **Predictable Outcomes** - Consistent results across different AI tools and sessions
- **Reduced Errors** - Clear constraints prevent architectural violations
- **Faster Development** - AI understands the structure and can work more efficiently
- **Maintainable Code** - Well-organized codebase that scales with your project

## 🚀 Getting Started

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
   npm run dev
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

All components automatically follow the design token system for consistent theming.

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

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck
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
- **.eslintrc.js** - ESLint with TypeScript and Prettier integration
- **.prettierrc** - Consistent code formatting
- **jest.config.js** - Unit testing configuration
- **playwright.config.ts** - E2E testing configuration

### Build & Development
- **Vite** - Fast development and build processes
- **Tailwind CSS** - Design system integration
- **PostCSS** - CSS processing pipeline

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server

# Testing
npm test            # Run unit tests
npm run test:watch  # Unit tests in watch mode
npm run test:coverage # Generate test coverage
npm run test:e2e    # Run e2e tests

# Code Quality
npm run lint        # Lint code
npm run format      # Format code
npm run typecheck   # TypeScript type checking

# Code Generation
npm run generate:component <name> # Generate component with full options
                                  # For features: npm run generate:component -- FeaturePage --layer features --slice feature-name
npm run generate:readme <name>   # Update slice documentation
```

## 🔍 Project Rules

The template enforces architectural consistency through comprehensive rules:

### Architecture Rules
- **Layer Boundaries** - Strict import restrictions between UI, hooks, and API layers
- **Component Size Limits** - React components limited to 200 lines with single responsibility
- **FSD Structure** - Proper layer organization and slice boundaries
- **Design Tokens** - No hard-coded values in styling (colors, spacing, typography)

### Quality Rules  
- **Testing Requirements** - Mandatory tests for utilities and page components
- **Documentation Standards** - Structured README format for slices
- **TypeScript Strict Mode** - Full type safety enforcement
- **Code Formatting** - ESLint and Prettier consistency

### Feature Development Rules
Each feature slice must include:
- `api.ts` + `api.spec.ts` - Backend integration with tests
- `hooks.ts` + `hooks.spec.ts` - React hooks with tests  
- `ui/<feature>.page.tsx` + `ui/<feature>.page.spec.ts` - Main page with integration tests
- `README.md` - Human and AI documentation

### Validation
The template automatically validates:
- Import patterns and layer boundaries
- Component size and responsibility
- Test coverage for utilities and pages
- Documentation completeness
- TypeScript compliance

## 🤝 Contributing

This template is designed to maintain consistency across teams and AI tools. Please follow the established patterns and run validation scripts before submitting changes:

1. Run tests: `npm test && npm run test:e2e`
2. Check code quality: `npm run lint && npm run typecheck`
3. Update documentation if needed: `npm run generate:readme <slice>`

For more details, see the [shadcn documentation](https://ui.shadcn.com/) and [Feature-Sliced Design methodology](https://feature-sliced.design/).
