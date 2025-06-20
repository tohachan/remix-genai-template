import React from 'react';
import { cn } from '~/shared/lib/utils';
import { theme } from '~/shared/design-system/theme';
import type { RuleResults } from '~/pages/playground/types';

interface RunRulesButtonProps {
  className?: string;
  onClick?: () => void;
  onRuleResults?: (results: RuleResults) => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function RunRulesButton({
  className,
  onClick,
  onRuleResults,
  disabled = false,
  loading = false,
}: RunRulesButtonProps) {
  const handleClick = async() => {
    // Call the original onClick if provided
    onClick?.();

    // Fetch rule results if callback is provided
    if (onRuleResults) {
      try {
        const response = await fetch('/ruleResults.json');
        if (!response.ok) {
          throw new Error('Failed to fetch rule results');
        }
        const results: RuleResults = await response.json();
        onRuleResults(results);
      } catch (error) {
        console.error('Error fetching rule results:', error);
        // Could call an onError callback here if needed
      }
    }
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      style={{
        backgroundColor: disabled ? theme.colors.gray[300] : theme.colors.primary[600],
        color: theme.colors.white,
        padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
        borderRadius: theme.borderRadius.md,
        fontSize: theme.typography.fontSize.sm[0],
        fontWeight: theme.typography.fontWeight.medium,
        boxShadow: theme.shadows.sm,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = theme.colors.primary[700];
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = theme.colors.primary[600];
        }
      }}
      onClick={handleClick}
      disabled={disabled || loading}
      type="button"
    >
      {loading ? (
        <div className="flex items-center">
          <div
            className="animate-spin rounded-full border-2 border-current border-t-transparent mr-2"
            style={{
              width: theme.spacing[4],
              height: theme.spacing[4],
            }}
          />
          Running...
        </div>
      ) : (
        'Run Rules'
      )}
    </button>
  );
}
