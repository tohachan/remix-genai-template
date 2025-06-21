import type { MetaFunction } from '@remix-run/node';
import AnalyticsPage from '~/features/analytics/ui/analytics.page';
import AppLayout from '~/shared/ui/AppLayout';

export const meta: MetaFunction = () => {
  return [
    { title: 'Analytics Dashboard - Project Management' },
    {
      name: 'description',
      content: 'Comprehensive analytics and insights for project management, team performance, and task completion.',
    },
  ];
};

export default function Analytics() {
  return (
    <AppLayout>
      <AnalyticsPage />
    </AppLayout>
  );
}
