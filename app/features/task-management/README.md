# For Humans

## Overview
The Task Management feature provides complete CRUD operations for task management using RTK Query and MSW. It enables users to create, read, update, and delete tasks with fields like deadline, priority, assignee, and dependencies.

## How to Run
1. Import the feature components and hooks:
   ```tsx
   import { TaskList, TaskForm, TaskCard, useTaskManagement } from '~/features/task-management';
   ```

2. Use the task list component:
   ```tsx
   <TaskList 
     onTaskSelect={(task) => console.log('Selected:', task)}
     onTaskEdit={(task) => setEditingTask(task)}
   />
   ```

3. Use the task form for creation and editing:
   ```tsx
   <TaskForm 
     task={editingTask}
     onSuccess={(task) => console.log('Saved:', task)}
     onCancel={() => setEditingTask(null)}
   />
   ```

4. Use the combined hook for all operations:
   ```tsx
   const {
     tasks,
     isLoadingTasks,
     createTask,
     updateTask,
     deleteTask,
     updateTaskStatus
   } = useTaskManagement();
   ```

## How to Test
Run tests for this features:
```bash
npm test -- features/task-management
```

Run all tests:
```bash
npm test
```

# For AI

<!-- AI_META -->
```json
{
  "purpose": "Complete task management CRUD operations with RTK Query integration, providing task creation, listing, updating, and deletion functionality with advanced features like status management, dependencies, and priority handling",
  "publicApi": [
    "TaskList - UI component for displaying tasks with edit/delete actions",
    "TaskForm - UI component for creating and editing tasks",
    "TaskCard - UI component for displaying individual task information",
    "useTaskManagement - Combined hook for all task operations",
    "useTasks - Hook for fetching tasks list with filtering",
    "useTask - Hook for fetching single task",
    "useCreateTask - Hook for task creation",
    "useUpdateTask - Hook for task updates",
    "useDeleteTask - Hook for task deletion",
    "useTaskStatus - Hook for task status management",
    "useTaskDependencies - Hook for managing task dependencies",
    "taskApi - RTK Query API slice with all task endpoints",
    "Task - Task entity type definition",
    "CreateTaskRequest - Type for task creation payload",
    "UpdateTaskRequest - Type for task update payload"
  ],
  "dependencies": [
    "React",
    "@reduxjs/toolkit",
    "react-redux",
    "~/shared/lib/store/api",
    "~/entities/task",
    "~/shared/lib/utils"
  ],
  "tests": {
    "location": "app/features/task-management/**/*.spec.{ts,tsx}",
    "command": "npm test -- features/task-management"
  }
}
```

## Structure
```
app/features/task-management/
├── api.ts              # Backend interactions
├── api.spec.ts         # API tests
├── hooks.ts            # React hooks
├── hooks.spec.ts       # Hook tests
├── ui/                    # UI components
│   ├── TaskCard.tsx     # Main component
│   ├── TaskForm.tsx     # UI component
│   ├── TaskList.tsx     # UI component
│   ├── task-management.page.tsx     # UI component
│   └── *.spec.ts       # Component tests
├── index.ts            # Public exports
└── README.md           # This file
```

## Architecture Pattern

This feature demonstrates proper RTK Query integration with FSD:

### Layer Separation
- **API Layer** (`api.ts`) - RTK Query endpoints and task data fetching with filtering support
- **Hooks Layer** (`hooks.ts`) - Business logic orchestration using RTK Query hooks  
- **UI Layer** (`ui/`) - React components consuming business logic hooks

### Key Benefits
- **Automatic caching** - RTK Query handles request deduplication and caching
- **Optimistic updates** - UI updates immediately, syncs with server
- **Error handling** - Standardized error states and retry logic
- **TypeScript integration** - Fully typed API responses and requests
- **Advanced features** - Task dependencies, status management, and priority handling

## Cache Management
- **Tags**: Task
- **Invalidation**: Automatic cache invalidation on mutations
- **Optimistic updates**: UI updates immediately, rollback on error
- **Refetching**: Automatic refetch on focus/reconnect
- **Filtering**: Support for project, status, priority, and assignee filters 