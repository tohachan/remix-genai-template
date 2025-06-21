import React from 'react';
import { Link } from '@remix-run/react';
import { Card } from '~/shared/ui/card';

export function ArchitectureSection() {
  const principles = [
    {
      title: 'Feature-Sliced Design',
      description: 'Modular architecture with clear layer separation and dependency rules',
      icon: '🏗️',
      link: '/docs/fsd',
    },
    {
      title: 'Single Responsibility',
      description: 'Each component has a single, well-defined purpose and responsibility',
      icon: '🎯',
      link: '/docs/srp',
    },
    {
      title: 'Design Tokens',
      description: 'Consistent design system with centralized theme management',
      icon: '🎨',
      link: '/docs/design-tokens',
    },
    {
      title: 'Test-First Patterns',
      description: 'Comprehensive testing strategy with high code coverage',
      icon: '🧪',
      link: '/docs/test-first-patterns',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Built on Solid Principles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from a production-ready codebase that demonstrates modern React
            architecture patterns and best practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((principle, index) => (
            <Link key={index} to={principle.link} className="group block">
              <Card className="h-full p-6 text-center transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 bg-white">
                <div className="text-4xl mb-4">{principle.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {principle.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {principle.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
