# For Humans

## Overview
The Products features provides products-related functionality with empty content for demonstration purposes.

## How to Run
1. Import the features components:
   ```tsx
   import { Products } from '~/features/products';
   ```

2. Use in your routes or components:
   ```tsx
   <Products />
   ```

## How to Test
Run tests for this features:
```bash
npm test -- features/products
```

Run all tests:
```bash
npm test
```

# For AI

<!-- AI_META -->
```json
{
  "purpose": "Products features with API backend interactions React hooks UI components for products-related functionality",
  "publicApi": [
    "Products - UI component"
  ],
  "dependencies": [
    "React",
    "@testing-library/react",
    "~/shared/lib/utils"
  ],
  "tests": {
    "location": "app/features/products/**/*.spec.{ts,tsx}",
    "command": "npm test -- features/products"
  }
}
```

## Structure
```
app/features/products/
├── api.ts              # Backend interactions
├── api.spec.ts         # API tests
├── hooks.ts            # React hooks
├── hooks.spec.ts       # Hook tests
├── ui/                    # UI components
│   ├── Products.tsx     # Main component
│   └── *.spec.ts       # Component tests
├── index.ts            # Public exports
└── README.md           # This file
```

## TODO
- Add actual products content when requirements are defined
- Implement specific products functionality
- Add proper API endpoints
- Enhance UI components 