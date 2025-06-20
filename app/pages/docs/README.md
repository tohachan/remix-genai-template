# For Humans

## Overview
The Documentation pages provide interactive exploration of architectural principles and design patterns used in ProjectLearn Manager.

## How to Run
1. Import the pages components:
   ```tsx
   import { DocsPage } from '~/pages/docs';
   ```

2. Use in your routes or components:
   ```tsx
   <DocsPage />
   ```

## How to Test
Run tests for this pages:
```bash
npm test -- pages/docs
```

Run all tests:
```bash
npm test
```

# For AI

<!-- AI_META -->
```json
{
  "purpose": "Documentation pages with MDX content for architectural principles",
  "publicApi": [
    "DocsPage - Main documentation landing page component"
  ],
  "dependencies": [
    "React",
    "MDX",
    "~/shared/lib/utils"
  ],
  "tests": {
    "location": "app/pages/docs/**/*.spec.{ts,tsx}",
    "command": "npm test -- pages/docs"
  }
}
```

## Structure
```
app/pages/docs/
├── ui/                    # UI components
│   └── index.tsx         # Main docs page component
├── index.ts              # Public exports
└── README.md             # This file
```

## TODO
- Add MDX-based documentation pages for architectural principles
- Implement navigation between docs
- Add interactive code examples
- Enhance styling for documentation layout 