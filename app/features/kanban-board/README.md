# For Humans

## Overview
The Kanban-Board features provides kanban-board-related functionality with empty content for demonstration purposes.

## How to Run
1. Import the features components:
   ```tsx
   import { default } from '~/features/kanban-board';
   ```

2. Use in your routes or components:
   ```tsx
   <default />
   ```

## How to Test
Run tests for this features:
```bash
npm test -- features/kanban-board
```

Run all tests:
```bash
npm test
```

# For AI

<!-- AI_META -->
```json
{
  "purpose": "Kanban-Board features with API backend interactions React hooks UI components for kanban-board-related functionality",
  "publicApi": [
    "default - UI component",
    "default as KanbanBoardPage - Main page component",
    "default as KanbanColumn - UI component",
    "KanbanTaskCard - UI component",
    "KanbanFilters - UI component",
    "KanbanBulkActions - UI component"
  ],
  "dependencies": [
    "React",
    "@testing-library/react",
    "~/shared/lib/utils"
  ],
  "tests": {
    "location": "app/features/kanban-board/**/*.spec.{ts,tsx}",
    "command": "npm test -- features/kanban-board"
  }
}
```

## Structure
```
app/features/kanban-board/
├── api.ts              # Backend interactions
├── api.spec.ts         # API tests
├── hooks.ts            # React hooks
├── hooks.spec.ts       # Hook tests
├── ui/                    # UI components
│   ├── KanbanBulkActions.tsx     # Main component
│   ├── KanbanColumn.tsx     # UI component
│   ├── KanbanFilters.tsx     # UI component
│   ├── KanbanTaskCard.tsx     # UI component
│   ├── kanban-board.page.tsx     # UI component
│   └── *.spec.ts       # Component tests
├── index.ts            # Public exports
└── README.md           # This file
```

## TODO
- Add actual kanban-board content when requirements are defined
- Implement specific kanban-board functionality
- Add proper API endpoints
- Enhance UI components 