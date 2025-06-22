export default function QuickStartSection() {
  return (
    <section className="bg-green-50 border border-green-200 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-green-900 mb-6">
        🚀 Getting Started
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            Development Commands
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border">
              <div className="font-mono text-sm text-gray-800 mb-1">npm run dev:full</div>
              <div className="text-xs text-gray-600">Start both Remix app and mock API server</div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="font-mono text-sm text-gray-800 mb-1">npm run init:rules</div>
              <div className="text-xs text-gray-600">Initialize rules for your AI platform</div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="font-mono text-sm text-gray-800 mb-1">npm run generate:component</div>
              <div className="text-xs text-gray-600">Generate new feature with FSD structure</div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            Quality Assurance
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border">
              <div className="font-mono text-sm text-gray-800 mb-1">npm run lint:fix</div>
              <div className="text-xs text-gray-600">Auto-fix FSD architecture violations</div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="font-mono text-sm text-gray-800 mb-1">npm run type-check</div>
              <div className="text-xs text-gray-600">Validate TypeScript strict mode</div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="font-mono text-sm text-gray-800 mb-1">npm test</div>
              <div className="text-xs text-gray-600">Run comprehensive test suite</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
