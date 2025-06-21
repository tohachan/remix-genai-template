# For Humans

## Overview
The Analytics features provides analytics-related functionality with empty content for demonstration purposes.

## How to Run
1. Import the features components:
   ```tsx
   import { default as AnalyticsPage } from '~/features/analytics';
   ```

2. Use in your routes or components:
   ```tsx
   <default as AnalyticsPage />
   ```

## How to Test
Run tests for this features:
```bash
npm test -- features/analytics
```

Run all tests:
```bash
npm test
```

# For AI

<!-- AI_META -->
```json
{
  "purpose": "Analytics features with API backend interactions React hooks UI components for analytics-related functionality",
  "publicApi": [
    "default as AnalyticsPage - Main page component",
    "default as BurndownChart - UI component",
    "default as TeamWorkloadChart - UI component",
    "default as TaskCompletionReport - UI component"
  ],
  "dependencies": [
    "React",
    "@testing-library/react",
    "~/shared/lib/utils"
  ],
  "tests": {
    "location": "app/features/analytics/**/*.spec.{ts,tsx}",
    "command": "npm test -- features/analytics"
  }
}
```

## Structure
```
app/features/analytics/
├── api.ts              # Backend interactions
├── api.spec.ts         # API tests
├── hooks.ts            # React hooks
├── hooks.spec.ts       # Hook tests
├── ui/                    # UI components
│   ├── BurndownChart.tsx     # Main component
│   ├── TaskCompletionReport.tsx     # UI component
│   ├── TeamWorkloadChart.tsx     # UI component
│   ├── analytics.page.tsx     # UI component
│   └── *.spec.ts       # Component tests
├── index.ts            # Public exports
└── README.md           # This file
```

## TODO
- Add actual analytics content when requirements are defined
- Implement specific analytics functionality
- Add proper API endpoints
- Enhance UI components 