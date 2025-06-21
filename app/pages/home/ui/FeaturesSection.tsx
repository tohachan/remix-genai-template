import React from 'react';
import { Link } from '@remix-run/react';
import { Card } from '~/shared/ui/card';
import { Badge } from '~/shared/ui/badge';
import { cn } from '~/shared/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  badge?: string;
  gradient: string;
}

function FeatureCard({
  title,
  description,
  icon,
  link,
  badge,
  gradient,
}: FeatureCardProps) {
  return (
    <Link to={link} className="group block">
      <Card className={cn(
        'h-full p-6 transition-all duration-300 group-hover:shadow-xl',
        'group-hover:-translate-y-1 border-2 border-transparent',
        'group-hover:border-blue-200',
        gradient,
      )}>
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl mb-3">{icon}</div>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
        <div className="mt-4 flex items-center text-blue-600 font-medium text-sm">
          Explore Feature
          <svg
            className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Card>
    </Link>
  );
}

export function FeaturesSection() {
  const features = [
    {
      title: 'Kanban Board',
      description:
        'Drag-and-drop task management with customizable columns, ' +
        'real-time updates, and team collaboration features.',
      icon: '📋',
      link: '/kanban',
      badge: 'Interactive',
      gradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
    },
    {
      title: 'Calendar View',
      description:
        'Timeline-based project planning with deadline tracking, ' +
        'milestone management, and integrated scheduling.',
      icon: '📅',
      link: '/calendar',
      badge: 'Planning',
      gradient: 'bg-gradient-to-br from-green-50 to-green-100',
    },
    {
      title: 'Team Management',
      description:
        'Complete team collaboration tools with role-based permissions, ' +
        'member invitations, and workload distribution.',
      icon: '👥',
      link: '/teams',
      badge: 'Collaboration',
      gradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
    },
    {
      title: 'Analytics Dashboard',
      description:
        'Real-time insights with burndown charts, performance metrics, ' +
        'and comprehensive reporting capabilities.',
      icon: '📊',
      link: '/analytics',
      badge: 'Insights',
      gradient: 'bg-gradient-to-br from-orange-50 to-orange-100',
    },
    {
      title: 'Playground',
      description:
        'Interactive code playground with Monaco editor, rule validation, ' +
        'and live component generation features.',
      icon: '⚡',
      link: '/playground',
      badge: 'Developer',
      gradient: 'bg-gradient-to-br from-pink-50 to-pink-100',
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage projects efficiently, from task tracking
            to team collaboration and performance analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
