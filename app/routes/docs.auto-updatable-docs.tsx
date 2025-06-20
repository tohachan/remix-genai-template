import type { MetaFunction } from '@remix-run/node';
import { ComponentDemo } from '~/shared/ui/ComponentDemo';
import { DemoButton } from '~/shared/ui/DemoButton';
import { useState } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Auto-Updatable Docs - ProjectLearn Manager' },
    { name: 'description', content: 'Learn how to implement documentation that automatically stays in sync with your codebase changes.' },
  ];
};

export default function AutoUpdatableDocsPage() {
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const handleGenerateDemo = () => {
    setLastGenerated(new Date().toLocaleTimeString());
  };

  return (
    <div className="max-w-4xl mx-auto p-6 prose prose-lg">
      <h1>Auto-Updatable Docs</h1>

      <p>Auto-updatable documentation automatically stays in sync with your codebase, reducing maintenance overhead and ensuring accuracy.</p>

      <h2>The Problem</h2>

      <p>Manual documentation often becomes:</p>
      <ul>
        <li>Outdated and inaccurate</li>
        <li>Time-consuming to maintain</li>
        <li>Forgotten during development</li>
        <li>Inconsistent across the team</li>
      </ul>

      <h2>Our Documentation Strategy</h2>

      <p>ProjectLearn Manager implements auto-updatable docs through several mechanisms:</p>

      <h3>1. <strong>Generated Component Documentation</strong></h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`# CLI command to generate README for feature slices
npm run generate:readme feature-name

# Example: Update task management docs
npm run generate:readme task-management`}</code>
      </pre>

      <h3>2. <strong>Auto-Generated API Documentation</strong></h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// app/features/task-management/api.ts
/**
 * @api {get} /tasks Get Tasks
 * @apiName GetTasks
 * @apiGroup Tasks
 * @apiSuccess {Task[]} tasks List of tasks
 */
export const taskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => '/tasks',
    }),
  }),
});`}</code>
      </pre>

      <h3>3. <strong>README Templates</strong></h3>
      <p>Each feature automatically gets a README with:</p>
      <ul>
        <li>Purpose and overview</li>
        <li>Public API documentation</li>
        <li>Dependencies</li>
        <li>Testing instructions</li>
        <li>Usage examples</li>
      </ul>

      <h3>4. <strong>Documentation Rules</strong></h3>
      <p>Our cursor rules automatically suggest documentation updates:</p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              📝 Slice files modified. Consider updating documentation:
            </p>
            <code className="block mt-2 text-sm text-blue-600">
              npm run generate:readme task-management
            </code>
            <p className="text-sm text-blue-700 mt-2">
              This will update the README.md with current slice structure and API information.
            </p>
          </div>
        </div>
      </div>

      <h2>Interactive Documentation Demo</h2>

      <ComponentDemo
        title="README Generation Demo"
        description="Simulate the auto-documentation generation process"
        code={`// Generate documentation for any feature slice
const generateDocs = (featureName) => {
  console.log(\`Generating docs for \${featureName}...\`);
  // Updates README.md with current structure
  return \`Documentation updated at \${new Date().toLocaleTimeString()}\`;
};`}
      >
        <div className="space-y-4">
          <DemoButton
            variant="primary"
            onClick={handleGenerateDemo}
          >
            Generate README
          </DemoButton>
          {lastGenerated && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-700">
                ✅ Documentation generated at: <strong>{lastGenerated}</strong>
              </div>
              <div className="text-xs text-green-600 mt-1">
                README.md updated with current API structure and examples
              </div>
            </div>
          )}
        </div>
      </ComponentDemo>

      <h2>Benefits</h2>

      <ol>
        <li><strong>Always Accurate</strong>: Docs stay in sync with code changes</li>
        <li><strong>Low Maintenance</strong>: Automated generation reduces manual work</li>
        <li><strong>Consistent Format</strong>: All documentation follows the same structure</li>
        <li><strong>Team Adoption</strong>: Easy for all team members to maintain</li>
      </ol>

      <h2>Implementation Example</h2>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`# When you modify files in app/features/auth/
# The system suggests:
npm run generate:readme auth

# This updates app/features/auth/README.md with:
# - Current file structure
# - Exported functions and components
# - Dependencies and usage`}</code>
      </pre>

      <p>Auto-updatable documentation ensures your project documentation remains a valuable, accurate resource throughout development.</p>
    </div>
  );
}
