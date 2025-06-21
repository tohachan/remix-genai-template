import React from 'react';
import { Link } from '@remix-run/react';
import { Button } from '~/shared/ui/button';
import { Card } from '~/shared/ui/card';

export function GettingStartedSection() {
  const quickActions = [
    {
      title: 'Create Your First Project',
      description: 'Set up a new project and start organizing your tasks',
      action: 'Start Project',
      link: '/login',
      className: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      title: 'Explore the Kanban Board',
      description: 'See how drag-and-drop task management works',
      action: 'View Kanban',
      link: '/kanban',
      className: 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    },
    {
      title: 'Read the Documentation',
      description: 'Learn about the architecture and implementation',
      action: 'View Docs',
      link: '/docs',
      className: 'bg-gray-600 hover:bg-gray-700 text-white',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Jump in and explore the features, or dive deep into the architecture
            and learn how everything works together.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {quickActions.map((action, index) => (
            <div key={index} className="text-center">
              <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {action.title}
                </h3>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  {action.description}
                </p>
                <Link to={action.link}>
                  <Button className={action.className} size="lg">
                    {action.action}
                  </Button>
                </Link>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
