import type { MetaFunction } from '@remix-run/node';
import KanbanBoard from '~/features/kanban-board/ui/kanban-board.page';
import AppLayout from '~/shared/ui/AppLayout';

export const meta: MetaFunction = () => {
  return [
    { title: 'Kanban Board - Task Management' },
    { name: 'description', content: 'Drag and drop kanban board for task management' },
  ];
};

export default function KanbanPage() {
  return (
    <AppLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kanban Board
          </h1>
          <p className="text-gray-600">
            Organize your tasks with drag and drop functionality
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <KanbanBoard />
        </div>
      </div>
    </AppLayout>
  );
}
