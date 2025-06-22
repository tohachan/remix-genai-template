export default function AIPlatformSection() {
  return (
    <section className="mb-12 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🤖 AI Platform Support
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Universal Rule System
          </h3>
          <p className="text-gray-600 mb-4">
            This template includes <strong>18+ comprehensive development rules</strong> stored as
            platform-agnostic YAML files. These rules can be automatically converted to the
            specific format required by your AI coding assistant.
          </p>
          <div className="space-y-1 text-sm text-gray-600">
            <div>✅ <strong>Cursor</strong> - Generates individual .mdc files</div>
            <div>✅ <strong>Windsurf</strong> - Creates wrapped markdown</div>
            <div>✅ <strong>Claude Code</strong> - Produces combined markdown</div>
            <div>✅ <strong>GitHub Copilot</strong> - Generates instructions with frontmatter</div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Quick Setup
          </h3>
          <div className="bg-white rounded-lg p-4 border">
            <code className="text-sm text-gray-800">
              # Install dependencies<br/>
              npm install<br/><br/>
              # Generate rules for your AI platform<br/>
              npm run init:rules
            </code>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Choose your preferred AI platform from the interactive menu and get optimized rules automatically.
          </p>
        </div>
      </div>
    </section>
  );
}
