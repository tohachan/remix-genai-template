import type { MetaFunction } from '@remix-run/node';
import { ComponentDemo } from '~/shared/ui/ComponentDemo';
import { DemoButton } from '~/shared/ui/DemoButton';

export const meta: MetaFunction = () => {
  return [
    { title: 'Design Tokens - ProjectLearn Manager' },
    { name: 'description', content: 'Learn how to implement and maintain consistent design systems using design tokens in React applications.' },
  ];
};

export default function DesignTokensPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 prose prose-lg">
      <h1>Design Tokens</h1>

      <p>Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes such as color, spacing, typography, and more.</p>

      <h2>What are Design Tokens?</h2>

      <p>Design tokens represent design decisions as data. Instead of hard-coding values like <code>#3b82f6</code> or <code>16px</code> throughout your application, you reference semantic tokens like <code>colors.primary.500</code> or <code>spacing.4</code>.</p>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// ❌ BAD: Hard-coded values
<button style={{
  backgroundColor: '#3b82f6',
  padding: '12px 24px',
  borderRadius: '8px',
  color: '#ffffff'
}}>
  Click me
</button>

// ✅ GOOD: Using design tokens
<button style={{
  backgroundColor: theme.colors.primary[500],
  padding: \`\${theme.spacing[3]} \${theme.spacing[6]}\`,
  borderRadius: theme.borderRadius.md,
  color: theme.colors.white
}}>
  Click me
</button>`}</code>
      </pre>

      <h2>Benefits of Design Tokens</h2>

      <h3>1. <strong>Consistency</strong></h3>
      <ul>
        <li>Ensures visual consistency across the application</li>
        <li>Prevents drift in design values</li>
        <li>Makes it easy to maintain brand guidelines</li>
      </ul>

      <h3>2. <strong>Maintainability</strong></h3>
      <ul>
        <li>Changes to design values are centralized</li>
        <li>Easy to update themes or rebrand</li>
        <li>Reduces duplication of style values</li>
      </ul>

      <h3>3. <strong>Developer Experience</strong></h3>
      <ul>
        <li>Autocomplete and type safety with TypeScript</li>
        <li>Clear semantic meaning for values</li>
        <li>Easy to understand design intentions</li>
      </ul>

      <h2>Live Design Token Examples</h2>

      <p>Here are examples showing the difference between hard-coded values and design tokens:</p>

      <ComponentDemo
        title="Design Token Usage"
        description="These buttons demonstrate consistent styling achieved through design tokens rather than hard-coded values"
        code={`// Using consistent design tokens
<DemoButton variant="primary" size="sm">Primary</DemoButton>
<DemoButton variant="secondary" size="md">Secondary</DemoButton>
<DemoButton variant="outline" size="lg">Outline</DemoButton>`}
      >
        <div className="flex gap-4 items-center">
          <DemoButton variant="primary" size="sm">Primary</DemoButton>
          <DemoButton variant="secondary" size="md">Secondary</DemoButton>
          <DemoButton variant="outline" size="lg">Outline</DemoButton>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Consistent Spacing"
        description="Design tokens ensure consistent spacing throughout the application"
        code={`// Consistent spacing with design tokens
<div className="space-y-4">
  <div className="p-2 bg-gray-100">Small padding</div>
  <div className="p-4 bg-gray-100">Medium padding</div>
  <div className="p-6 bg-gray-100">Large padding</div>
</div>`}
      >
        <div className="space-y-4">
          <div className="p-2 bg-gray-100 rounded">Small padding</div>
          <div className="p-4 bg-gray-100 rounded">Medium padding</div>
          <div className="p-6 bg-gray-100 rounded">Large padding</div>
        </div>
      </ComponentDemo>

      <p>Design tokens create a scalable foundation for consistent user interfaces while improving collaboration between design and development teams.</p>
    </div>
  );
}
