# For Humans

## Overview
The Team-Management features provides team-management-related functionality with empty content for demonstration purposes.

## How to Run
1. Import the features components:
   ```tsx
   import { default as TeamManagementPage } from '~/features/team-management';
   ```

2. Use in your routes or components:
   ```tsx
   <default as TeamManagementPage />
   ```

## How to Test
Run tests for this features:
```bash
npm test -- features/team-management
```

Run all tests:
```bash
npm test
```

# For AI

<!-- AI_META -->
```json
{
  "purpose": "Team-Management features with API backend interactions React hooks UI components for team-management-related functionality",
  "publicApi": [
    "default as TeamManagementPage - Main page component",
    "default as TeamList - UI component",
    "TeamForm - UI component",
    "default as MemberInvitation - UI component",
    "teamManagementApi - API functions for team-management backend interactions"
  ],
  "dependencies": [
    "React",
    "@testing-library/react",
    "~/shared/lib/utils"
  ],
  "tests": {
    "location": "app/features/team-management/**/*.spec.{ts,tsx}",
    "command": "npm test -- features/team-management"
  }
}
```

## Structure
```
app/features/team-management/
├── api.ts              # Backend interactions
├── api.spec.ts         # API tests
├── hooks.ts            # React hooks
├── hooks.spec.ts       # Hook tests
├── ui/                    # UI components
│   ├── MemberInvitation.tsx     # Main component
│   ├── TeamForm.tsx     # UI component
│   ├── TeamList.tsx     # UI component
│   ├── team-management.page.tsx     # UI component
│   └── *.spec.ts       # Component tests
├── index.ts            # Public exports
└── README.md           # This file
```

## TODO
- Add actual team-management content when requirements are defined
- Implement specific team-management functionality
- Add proper API endpoints
- Enhance UI components 