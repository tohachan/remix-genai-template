export default function FeaturesGrid() {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        🚀 What This Template Provides
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl mb-3">⚡</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Remix + Vite
          </h3>
          <p className="text-gray-600 text-sm">
            Modern full-stack React framework with fast build tooling
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl mb-3">🎨</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tailwind + shadcn/ui
          </h3>
          <p className="text-gray-600 text-sm">
            Utility-first CSS with beautiful, accessible components
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl mb-3">🏗️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Feature-Sliced Design
          </h3>
          <p className="text-gray-600 text-sm">
            Scalable architecture methodology for maintainable code
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl mb-3">🔄</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            RTK Query
          </h3>
          <p className="text-gray-600 text-sm">
            Powerful data fetching and caching with automatic re-validation
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl mb-3">🤖</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Multi-Platform AI Support
          </h3>
          <p className="text-gray-600 text-sm">
            Universal rules that work with any AI coding assistant
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl mb-3">🧪</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Complete Testing Suite
          </h3>
          <p className="text-gray-600 text-sm">
            Jest for unit tests, Playwright for e2e testing
          </p>
        </div>
      </div>
    </section>
  );
}
