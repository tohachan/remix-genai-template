import React, { useState } from 'react';
import { cn } from '~/shared/lib/utils';
import { theme } from '~/shared/design-system/theme';
import CodeEditor from '~/shared/ui/CodeEditor';
import RunRulesButton from '~/shared/ui/RunRulesButton';
import RuleResultsDisplay from './RuleResultsDisplay';
import type { RuleResults } from '../types';

interface PlaygroundPageProps {
  className?: string;
}

interface LineHighlight {
  line: number;
  severity: 'error' | 'warning';
  message?: string;
}

export default function PlaygroundPage({ className }: PlaygroundPageProps) {
  const [code, setCode] = useState<string>();
  const [isRunning, setIsRunning] = useState(false);
  const [ruleResults, setRuleResults] = useState<RuleResults | undefined>();
  const [highlights, setHighlights] = useState<LineHighlight[]>([]);

  const handleRunRules = async() => {
    setIsRunning(true);
    setRuleResults(undefined); // Clear previous results
  };

  const handleRuleResults = (results: RuleResults) => {
    setRuleResults(results);
    setIsRunning(false);

    // Convert violations to line highlights
    const newHighlights: LineHighlight[] = results.violations.map(violation => ({
      line: violation.line,
      severity: violation.severity,
      message: violation.message,
    }));
    setHighlights(newHighlights);
  };

  const handleViolationClick = (violation: any) => {
    console.log('Violation clicked:', violation);
    // Highlight just this specific line
    setHighlights([{
      line: violation.line,
      severity: violation.severity,
      message: violation.message,
    }]);
  };

  const handleCodeChange = (value: string | undefined) => {
    setCode(value);
  };

  return (
    <div
      className={cn('min-h-screen', className)}
      style={{
        backgroundColor: theme.colors.gray[50],
        padding: theme.spacing[6],
      }}
    >
      <div
        className="max-w-7xl mx-auto"
        style={{ gap: theme.spacing[6] }}
      >
        {/* Header */}
        <div style={{ marginBottom: theme.spacing[8] }}>
          <h1
            className="font-bold"
            style={{
              fontSize: theme.typography.fontSize['3xl'][0],
              color: theme.colors.gray[900],
              marginBottom: theme.spacing[2],
            }}
          >
            Code Playground
          </h1>
          <p
            style={{
              fontSize: theme.typography.fontSize.lg[0],
              color: theme.colors.gray[600],
            }}
          >
            Write code and run linting rules to see violations and suggestions.
          </p>
        </div>

        {/* Main Content */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12"
          style={{ gap: theme.spacing[6] }}
        >
          {/* Code Editor Section */}
          <div className="lg:col-span-8">
            <div
              className="rounded-lg shadow-sm"
              style={{
                backgroundColor: theme.colors.white,
                border: `1px solid ${theme.colors.gray[200]}`,
                padding: theme.spacing[6],
              }}
            >
              <div style={{ marginBottom: theme.spacing[4] }}>
                <h2
                  className="font-semibold"
                  style={{
                    fontSize: theme.typography.fontSize.xl[0],
                    color: theme.colors.gray[900],
                    marginBottom: theme.spacing[2],
                  }}
                >
                  Code Editor
                </h2>
                <p
                  style={{
                    fontSize: theme.typography.fontSize.sm[0],
                    color: theme.colors.gray[500],
                  }}
                >
                  Edit your React component code below
                </p>
              </div>

              <CodeEditor
                height="500px"
                onChange={handleCodeChange}
                language="typescript"
                theme="light"
                highlights={highlights}
              />
            </div>
          </div>

          {/* Controls and Results Section */}
          <div className="lg:col-span-4">
            <div
              className="rounded-lg shadow-sm"
              style={{
                backgroundColor: theme.colors.white,
                border: `1px solid ${theme.colors.gray[200]}`,
                padding: theme.spacing[6],
              }}
            >
              <div style={{ marginBottom: theme.spacing[6] }}>
                <h2
                  className="font-semibold"
                  style={{
                    fontSize: theme.typography.fontSize.xl[0],
                    color: theme.colors.gray[900],
                    marginBottom: theme.spacing[4],
                  }}
                >
                  Controls
                </h2>

                <RunRulesButton
                  onClick={handleRunRules}
                  onRuleResults={handleRuleResults}
                  loading={isRunning}
                  className="w-full"
                />
              </div>

              {/* Rule Results */}
              <div>
                <h3
                  className="font-medium"
                  style={{
                    fontSize: theme.typography.fontSize.lg[0],
                    color: theme.colors.gray[900],
                    marginBottom: theme.spacing[3],
                  }}
                >
                  Rule Results
                </h3>

                <RuleResultsDisplay
                  results={ruleResults}
                  isLoading={isRunning}
                  onViolationClick={handleViolationClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
