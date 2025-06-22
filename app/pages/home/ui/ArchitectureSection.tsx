export default function ArchitectureSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🏛️ Architecture Overview
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            FSD Layer Structure
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
            <div>app/</div>
            <div>├── shared/      # Reusable utilities</div>
            <div>├── entities/    # Business entities</div>
            <div>├── features/    # Product features</div>
            <div>├── widgets/     # Complex UI components</div>
            <div>├── pages/       # Application pages</div>
            <div>└── routes/      # Remix routing</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Key Benefits for AI-Assisted Development
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ <strong>Platform Flexibility</strong> - Use any AI coding assistant</li>
            <li>✅ <strong>Consistent Results</strong> - Same standards regardless of AI platform</li>
            <li>✅ <strong>Reduced Errors</strong> - Clear constraints prevent violations</li>
            <li>✅ <strong>Faster Development</strong> - AI understands FSD structure</li>
            <li>✅ <strong>Maintainable Code</strong> - Well-organized codebase that scales</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
