import React from 'react';
import { cn } from '~/shared/lib/utils';
import { theme } from '~/shared/design-system/theme';
import type { RuleViolation, RuleResults } from '../types';

interface RuleResultsDisplayProps {
  results?: RuleResults | undefined;
  isLoading?: boolean;
  className?: string;
  onViolationClick?: (violation: RuleViolation) => void;
}

export default function RuleResultsDisplay({
  results,
  isLoading,
  className,
  onViolationClick,
}: RuleResultsDisplayProps) {
  if (isLoading) {
    return (
      <div className={cn('', className)}>
        <div className="flex items-center">
          <div
            className="animate-spin rounded-full border-2 border-current border-t-transparent mr-2"
            style={{
              width: theme.spacing[4],
              height: theme.spacing[4],
              color: theme.colors.primary[600],
            }}
          />
          <span
            style={{
              fontSize: theme.typography.fontSize.sm[0],
              color: theme.colors.gray[600],
            }}
          >
            Analyzing code...
          </span>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className={cn('', className)}>
        <p
          style={{
            fontSize: theme.typography.fontSize.sm[0],
            color: theme.colors.gray[500],
            fontStyle: 'italic',
          }}
        >
          Run rules to see results here
        </p>
      </div>
    );
  }

  const { violations, summary } = results;

  return (
    <div className={cn('', className)}>
      {/* Summary */}
      <div
        className="rounded-md"
        style={{
          backgroundColor: theme.colors.primary[50],
          border: `1px solid ${theme.colors.primary[200]}`,
          padding: theme.spacing[4],
          marginBottom: theme.spacing[4],
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <span
              className="font-medium"
              style={{
                fontSize: theme.typography.fontSize.sm[0],
                color: theme.colors.primary[900],
              }}
            >
              {summary.totalViolations} violations found
            </span>
            <div
              style={{
                fontSize: theme.typography.fontSize.xs[0],
                color: theme.colors.primary[700],
                marginTop: theme.spacing[1],
              }}
            >
              {summary.errors} errors, {summary.warnings} warnings
            </div>
          </div>
          <div
            style={{
              fontSize: theme.typography.fontSize.xs[0],
              color: theme.colors.primary[600],
            }}
          >
            {summary.executionTime}
          </div>
        </div>
      </div>

      {/* Violations List */}
      <div style={{ gap: theme.spacing[3] }} className="space-y-3">
        {violations.map((violation) => (
          <div
            key={violation.id}
            className={cn(
              'rounded-md cursor-pointer transition-colors hover:bg-opacity-80',
              violation.severity === 'error' ? 'hover:bg-red-50' : 'hover:bg-yellow-50',
            )}
            style={{
              backgroundColor: violation.severity === 'error'
                ? theme.colors.error[50]
                : theme.colors.warning[50],
              border: `1px solid ${
                violation.severity === 'error'
                  ? theme.colors.gray[300]
                  : theme.colors.gray[300]
              }`,
              padding: theme.spacing[4],
            }}
            onClick={() => onViolationClick?.(violation)}
          >
            {/* Violation Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <span
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: violation.severity === 'error'
                      ? theme.colors.error[50]
                      : theme.colors.warning[50],
                    color: violation.severity === 'error'
                      ? theme.colors.error[700]
                      : theme.colors.warning[700],
                  }}
                >
                  {violation.severity}
                </span>
                <span
                  className="ml-2 font-mono"
                  style={{
                    fontSize: theme.typography.fontSize.xs[0],
                    color: theme.colors.gray[600],
                  }}
                >
                  {violation.rule}
                </span>
              </div>
              <span
                style={{
                  fontSize: theme.typography.fontSize.xs[0],
                  color: theme.colors.gray[500],
                }}
              >
                Line {violation.line}:{violation.column}
              </span>
            </div>

            {/* Violation Message */}
            <div style={{ marginTop: theme.spacing[2] }}>
              <p
                className="font-medium"
                style={{
                  fontSize: theme.typography.fontSize.sm[0],
                  color: theme.colors.gray[900],
                }}
              >
                {violation.message}
              </p>
              <p
                style={{
                  fontSize: theme.typography.fontSize.xs[0],
                  color: theme.colors.gray[600],
                  marginTop: theme.spacing[1],
                }}
              >
                {violation.description}
              </p>
            </div>

            {/* Code and Suggestion */}
            <div style={{ marginTop: theme.spacing[3] }}>
              <div
                className="rounded font-mono"
                style={{
                  backgroundColor: theme.colors.gray[100],
                  padding: theme.spacing[2],
                  fontSize: theme.typography.fontSize.xs[0],
                  color: theme.colors.gray[800],
                }}
              >
                <div style={{ color: theme.colors.error[500] }}>
                  - {violation.code}
                </div>
                <div style={{ color: theme.colors.success[500] }}>
                  + {violation.suggestion}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
