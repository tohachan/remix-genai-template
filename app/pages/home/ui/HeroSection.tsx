import React from 'react';
import { Link } from '@remix-run/react';
import { Button } from '~/shared/ui/button';
import { Badge } from '~/shared/ui/badge';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            🚀 Feature-Sliced Design Architecture
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Project Management
            <span className="text-blue-600 block">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            A comprehensive project management platform built with modern React architecture.
            Featuring Kanban boards, calendar views, team collaboration, and real-time analytics
            - all powered by Feature-Sliced Design principles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/login">
            <Button size="lg" className="px-8 py-3 text-lg font-semibold">
              Get Started
            </Button>
          </Link>
          <Link to="/docs">
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold">
              View Documentation
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">5</div>
            <div className="text-sm text-gray-600">Core Features</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">100%</div>
            <div className="text-sm text-gray-600">TypeScript</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">FSD</div>
            <div className="text-sm text-gray-600">Architecture</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">RTK</div>
            <div className="text-sm text-gray-600">Query Ready</div>
          </div>
        </div>
      </div>
    </section>
  );
}
