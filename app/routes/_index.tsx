import type { MetaFunction } from '@remix-run/node';
import HomePage from '../pages/home/ui';
import AppLayout from '~/shared/ui/AppLayout';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Project Management Platform | Feature-Sliced Design Architecture',
    },
    {
      name: 'description',
      content:
        'Comprehensive project management platform with Kanban boards, calendar views, ' +
        'team collaboration, and analytics. Built with Feature-Sliced Design, TypeScript, ' +
        'and modern React patterns.',
    },
    {
      name: 'keywords',
      content: 'project management, kanban board, team collaboration, Feature-Sliced Design, ' +
        'TypeScript, React, RTK Query, calendar view, analytics dashboard',
    },
    {
      property: 'og:title',
      content: 'Project Management Platform | Feature-Sliced Design Architecture',
    },
    {
      property: 'og:description',
      content:
        'Modern project management platform featuring Kanban boards, calendar views, ' +
        'team collaboration, and real-time analytics. Learn from production-ready React architecture.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: 'Project Management Platform | Feature-Sliced Design',
    },
    {
      name: 'twitter:description',
      content:
        'Comprehensive project management with modern React architecture. ' +
        'Kanban, calendar, team collaboration, and analytics.',
    },
  ];
};

export default function IndexRoute() {
  return (
    <AppLayout showBreadcrumbs={false}>
      <HomePage />
    </AppLayout>
  );
}
