# For Humans

## Overview
The Project Management feature provides complete CRUD operations for project management using RTK Query and MSW. It enables users to create, read, update, and delete projects with a modern, responsive interface.

## How to Run
1. Import the feature components and hooks:
   ```tsx
   import { ProjectList, ProjectForm, useProjectManagement } from '~/features/project-management';
   ```

2. Use the project list component:
   ```tsx
   <ProjectList 
     onProjectSelect={(project) => console.log('Selected:', project)}
     onProjectEdit={(project) => setEditingProject(project)}
   />
   ```

3. Use the project form for creation and editing:
   ```tsx
   <ProjectForm 
     project={editingProject}
     onSuccess={(project) => console.log('Saved:', project)}
     onCancel={() => setEditingProject(null)}
   />
   ```

4. Use the combined hook for all operations:
   ```tsx
   const {
     projects,
     isLoading,
     createProject,
     updateProject,
     deleteProject
   } = useProjectManagement();
   ```

## How to Test
Run tests for this feature:
```bash
npm test -- features/project-management
```

Run all tests:
```bash
npm test
```

# For AI

<!-- AI_META -->
```json
{
  "purpose": "Complete project management CRUD operations with RTK Query integration, providing project creation, listing, updating, and deletion functionality",
  "publicApi": [
    "ProjectList - UI component for displaying projects with edit/delete actions",
    "ProjectForm - UI component for creating and editing projects",
    "useProjects - Hook for fetching projects list",
    "useProject - Hook for fetching single project",
    "useCreateProject - Hook for project creation",
    "useUpdateProject - Hook for project updates",
    "useDeleteProject - Hook for project deletion",
    "useProjectManagement - Combined hook for all project operations",
    "projectApi - RTK Query API slice with all project endpoints",
    "Project - Project entity type definition",
    "CreateProjectRequest - Type for project creation payload",
    "UpdateProjectRequest - Type for project update payload"
  ],
  "dependencies": [
    "React",
    "@reduxjs/toolkit",
    "react-redux",
    "~/shared/lib/store/api",
    "~/shared/ui/button",
    "~/shared/ui/card",
    "~/shared/ui/input",
    "~/shared/ui/label",
    "~/shared/ui/textarea",
    "~/shared/ui/select",
    "~/shared/lib/utils"
  ],
  "tests": {
    "location": "app/features/project-management/**/*.spec.{ts,tsx}",
    "command": "npm test -- features/project-management"
  }
}
```

## Structure
```
app/features/project-management/
├── api.ts              # Backend interactions
├── api.spec.ts         # API tests
├── hooks.ts            # React hooks
├── hooks.spec.ts       # Hook tests
├── ui/                    # UI components
│   ├── ProjectForm.tsx     # Main component
│   ├── ProjectList.tsx     # UI component
│   ├── project-management.page.tsx     # UI component
│   └── *.spec.ts       # Component tests
├── index.ts            # Public exports
└── README.md           # This file
```

## Architecture Pattern

This feature demonstrates proper RTK Query integration with FSD:

### Layer Separation
- **API Layer** (`api.ts`) - RTK Query endpoints and project data fetching
- **Hooks Layer** (`hooks.ts`) - Business logic orchestration using RTK Query hooks  
- **UI Layer** (`ui/`) - React components consuming business logic hooks

### Key Benefits
- **Automatic caching** - RTK Query handles request deduplication and caching
- **Optimistic updates** - UI updates immediately, syncs with server
- **Error handling** - Standardized error states and retry logic
- **TypeScript integration** - Fully typed API responses and requests

## Cache Management
- **Tags**: Project
- **Invalidation**: Automatic cache invalidation on mutations
- **Optimistic updates**: UI updates immediately, rollback on error
- **Refetching**: Automatic refetch on focus/reconnect 