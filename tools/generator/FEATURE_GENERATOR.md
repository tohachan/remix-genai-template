# Feature Generator Documentation

## Overview

The Feature Generator creates complete FSD-compliant features with three specialized templates:

### Templates Available

1. **CRUD List** - Full data management with create, read, update, delete operations
2. **Chart Widget** - Data visualization with multiple chart types
3. **Kanban Widget** - Drag-and-drop workflow management

### Usage

**CLI (Recommended):**
```bash
npm run generate:feature -- feature-name --template crud-list --layer features --includeTests true --includeStorybook false
```

**Web UI:**
Navigate to `/playground` → "Feature Generator" tab

### Generated Structure

Each template creates:
- Main component with full functionality
- Test files with comprehensive coverage
- API integration (where applicable)
- Auto-generated documentation
- FSD-compliant file organization

### Integration

1. **CLI Generator**: Uses existing handlebars templates
2. **Auto-README**: Integrates with `generate:readme` command
3. **FSD Compliance**: Follows all project architectural rules
4. **Quality Standards**: Includes TypeScript, ESLint, and testing compliance

Generated features are production-ready and follow all project conventions. 