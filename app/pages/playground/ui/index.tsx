import React from 'react';
import { cn } from '~/shared/lib/utils';
import { Card } from '~/shared/ui/card';
import { Button } from '~/shared/ui/button';
import { Input } from '~/shared/ui/input';
import { Label } from '~/shared/ui/label';
import { Badge } from '~/shared/ui/badge';
import CodeEditor from '~/shared/ui/CodeEditor';
import RunRulesButton from '~/shared/ui/RunRulesButton';
import RuleResultsDisplay from '~/pages/playground/ui/RuleResultsDisplay';

interface PlaygroundPageProps {
  className?: string;
}

interface FeatureGenerationOptions {
  featureName: string;
  template: 'crud-list' | 'chart-widget' | 'kanban-widget';
  layer: 'features' | 'widgets';
  includeTests: boolean;
  includeStorybook: boolean;
}

interface GenerationResult {
  success: boolean;
  message: string;
  generatedFiles?: string[];
  error?: string;
}

export default function PlaygroundPage({ className }: PlaygroundPageProps) {
  const [activeTab, setActiveTab] = React.useState<'code' | 'feature-generator'>('code');
  const [ruleResults, setRuleResults] = React.useState<any>(null);

  // Feature generator state
  const [featureOptions, setFeatureOptions] = React.useState<FeatureGenerationOptions>({
    featureName: '',
    template: 'crud-list',
    layer: 'features',
    includeTests: true,
    includeStorybook: false,
  });
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationResult, setGenerationResult] = React.useState<GenerationResult | null>(null);

  const handleFeatureGeneration = async() => {
    if (!featureOptions.featureName.trim()) {
      setGenerationResult({
        success: false,
        message: 'Feature name is required',
        error: 'Please enter a valid feature name',
      });
      return;
    }

    setIsGenerating(true);
    setGenerationResult(null);

    try {
      const response = await fetch('/api/generate-feature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(featureOptions),
      });

      const result = await response.json();
      setGenerationResult(result);

      if (result.success) {
        // Reset form on success
        setFeatureOptions(prev => ({ ...prev, featureName: '' }));
      }
    } catch (error) {
      setGenerationResult({
        success: false,
        message: 'Failed to generate feature',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRuleResults = (results: any) => {
    setRuleResults(results);
  };

  return (
    <div className={cn('min-h-screen p-6', className)}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Development Playground
          </h1>
          <p className="text-gray-600">
            Code editor with rule validation and feature generation tools
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'code' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('code')}
          >
            Code Editor
          </Button>
          <Button
            variant={activeTab === 'feature-generator' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('feature-generator')}
          >
            Feature Generator
          </Button>
        </div>

        {/* Code Editor Tab */}
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Editor */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Code Editor</h2>
                <RunRulesButton onRuleResults={handleRuleResults} />
              </div>
              <CodeEditor />
            </Card>

            {/* Rule Results */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Rule Validation Results</h2>
              <RuleResultsDisplay results={ruleResults} />
            </Card>
          </div>
        )}

        {/* Feature Generator Tab */}
        {activeTab === 'feature-generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Generator Form */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Generate New Feature</h2>

              <div className="space-y-4">
                {/* Feature Name */}
                <div>
                  <Label htmlFor="featureName">Feature Name</Label>
                  <Input
                    id="featureName"
                    placeholder="e.g., user-management, product-catalog"
                    value={featureOptions.featureName}
                    onChange={(e) =>
                      setFeatureOptions(prev => ({
                        ...prev,
                        featureName: e.target.value,
                      }))
                    }
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use kebab-case (lowercase with hyphens)
                  </p>
                </div>

                {/* Template Selection */}
                <div>
                  <Label>Template Type</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {[
                      { id: 'crud-list', name: 'CRUD List', desc: 'Full CRUD operations with list view' },
                      { id: 'chart-widget', name: 'Chart Widget', desc: 'Data visualization with charts' },
                      { id: 'kanban-widget', name: 'Kanban Widget', desc: 'Drag-and-drop kanban board' },
                    ].map((template) => (
                      <label
                        key={template.id}
                        className={cn(
                          'flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition-colors',
                          featureOptions.template === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300',
                        )}
                      >
                        <input
                          type="radio"
                          value={template.id}
                          checked={featureOptions.template === template.id}
                          onChange={(e) =>
                            setFeatureOptions(prev => ({
                              ...prev,
                              template: e.target.value as FeatureGenerationOptions['template'],
                            }))
                          }
                          className="text-blue-600"
                        />
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-500">{template.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Layer Selection */}
                <div>
                  <Label>FSD Layer</Label>
                  <div className="flex space-x-4 mt-2">
                    {[
                      { id: 'features', name: 'Features', desc: 'Business features' },
                      { id: 'widgets', name: 'Widgets', desc: 'UI widgets' },
                    ].map((layer) => (
                      <label
                        key={layer.id}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          value={layer.id}
                          checked={featureOptions.layer === layer.id}
                          onChange={(e) =>
                            setFeatureOptions(prev => ({
                              ...prev,
                              layer: e.target.value as FeatureGenerationOptions['layer'],
                            }))
                          }
                          className="text-blue-600"
                        />
                        <span>{layer.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={featureOptions.includeTests}
                        onChange={(e) =>
                          setFeatureOptions(prev => ({
                            ...prev,
                            includeTests: e.target.checked,
                          }))
                        }
                        className="text-blue-600"
                      />
                      <span>Include test files</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={featureOptions.includeStorybook}
                        onChange={(e) =>
                          setFeatureOptions(prev => ({
                            ...prev,
                            includeStorybook: e.target.checked,
                          }))
                        }
                        className="text-blue-600"
                      />
                      <span>Include Storybook stories</span>
                    </label>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleFeatureGeneration}
                  disabled={isGenerating || !featureOptions.featureName.trim()}
                  className="w-full"
                >
                  {isGenerating ? 'Generating...' : 'Generate Feature'}
                </Button>
              </div>
            </Card>

            {/* Generation Results */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Generation Results</h2>

              {!generationResult && !isGenerating && (
                <div className="text-center text-gray-500 py-8">
                  Configure and generate a feature to see results here
                </div>
              )}

              {isGenerating && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating feature files...</p>
                </div>
              )}

              {generationResult && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={generationResult.success ? 'default' : 'destructive'}
                    >
                      {generationResult.success ? 'Success' : 'Error'}
                    </Badge>
                    <span className="text-sm font-medium">
                      {generationResult.message}
                    </span>
                  </div>

                  {generationResult.success && generationResult.generatedFiles && (
                    <div>
                      <h3 className="font-medium mb-2">Generated Files:</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <ul className="text-sm space-y-1">
                          {generationResult.generatedFiles.map((file, index) => (
                            <li key={index} className="font-mono text-gray-700">
                              {file}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {generationResult.error && (
                    <div className="bg-red-50 p-3 rounded-md">
                      <p className="text-sm text-red-700">{generationResult.error}</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
