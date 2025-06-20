import * as React from 'react';
import { cn } from '~/shared/lib/utils';

interface ComponentDemoProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  code?: string;
  showCode?: boolean;
}

const ComponentDemo = React.forwardRef<
  HTMLDivElement,
  ComponentDemoProps
>(({ children, className, title, description, code, showCode = false, ...props }, ref) => {
  const [isCodeVisible, setIsCodeVisible] = React.useState(showCode);

  return (
    <div
      ref={ref}
      className={cn(
        'border border-gray-200 rounded-lg overflow-hidden my-6',
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          )}
          {description && (
            <p className="text-gray-600 text-sm">{description}</p>
          )}
        </div>
      )}

      <div className="p-6 bg-white">
        <div className="flex items-center justify-center min-h-[120px] bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
          {children}
        </div>
      </div>

      {code && (
        <div className="border-t border-gray-200">
          <div className="flex items-center justify-between p-3 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Code</span>
            <button
              onClick={() => setIsCodeVisible(!isCodeVisible)}
              className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              {isCodeVisible ? 'Hide' : 'Show'} Code
            </button>
          </div>
          {isCodeVisible && (
            <div className="p-4 bg-gray-900 text-gray-100 overflow-x-auto">
              <pre className="text-sm">
                <code>{code}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ComponentDemo.displayName = 'ComponentDemo';

export { ComponentDemo };
