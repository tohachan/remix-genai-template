export interface RuleViolation {
  id: string;
  rule: string;
  severity: 'error' | 'warning';
  message: string;
  file: string;
  line: number;
  column: number;
  code: string;
  suggestion: string;
  description: string;
}

export interface RuleResults {
  violations: RuleViolation[];
  summary: {
    totalViolations: number;
    errors: number;
    warnings: number;
    rules: string[];
    executionTime: string;
    timestamp: string;
  };
}
