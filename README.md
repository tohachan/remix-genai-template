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
- 🧪 **Testing Standards** - Built-in testing patterns and requirements

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

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Start the production server**:
   ```bash
   npm start
   ```

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
   npm run generate:feature <feature-name>
   ```

2. **Update documentation**:
   ```bash
   npm run generate:readme <feature-name>
   ```

### Testing

- **Unit tests** - Required for all utility functions
- **Integration tests** - Required for all page components
- **Type safety** - Strict TypeScript configuration enforced

## 🏗️ Feature-Sliced Design Benefits

- **Scalability** - Architecture grows with your application
- **Team Collaboration** - Clear boundaries and responsibilities
- **Code Reusability** - Shared components across features
- **Maintainability** - Easy to locate and modify functionality
- **Testing** - Isolated features are easier to test

## 📖 Documentation

Each feature maintains its own documentation with:
- Human-readable instructions
- AI-readable metadata
- API specifications
- Testing guidelines

## 🔧 Configuration

The template includes optimized configurations for:
- **TypeScript** - Strict mode for better type safety
- **Tailwind CSS** - Design system integration
- **Vite** - Fast development and build processes
- **ESLint/Prettier** - Code quality and formatting

## 🤝 Contributing

This template is designed to maintain consistency across teams and AI tools. Please follow the established patterns and run validation scripts before submitting changes.

For more details, see the [shadcn documentation](https://ui.shadcn.com/) and [Feature-Sliced Design methodology](https://feature-sliced.design/).
