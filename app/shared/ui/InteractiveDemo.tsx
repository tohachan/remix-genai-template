import * as React from 'react';
import { cn } from '~/shared/lib/utils';

interface Control {
  name: string;
  type: 'text' | 'select' | 'boolean' | 'number';
  options?: string[];
  defaultValue?: any;
}

interface InteractiveDemoProps {
  children: (props: Record<string, any>) => React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  controls: Control[];
}

const InteractiveDemo = React.forwardRef<
  HTMLDivElement,
  InteractiveDemoProps
>(({ children, className, title, description, controls, ...props }, ref) => {
  const [componentProps, setComponentProps] = React.useState<Record<string, any>>(() => {
    return controls.reduce((acc, control) => {
      acc[control.name] = control.defaultValue ?? '';
      return acc;
    }, {} as Record<string, any>);
  });

  const updateProp = (name: string, value: any) => {
    setComponentProps(prev => ({ ...prev, [name]: value }));
  };

  const generateCode = () => {
    const propsString = Object.entries(componentProps)
      .filter(([, value]) => value !== '' && value !== false)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        }
        if (typeof value === 'boolean') {
          return value ? key : '';
        }
        return `${key}={${JSON.stringify(value)}}`;
      })
      .filter(Boolean)
      .join('\n  ');

    return `<Component${propsString ? `\n  ${propsString}` : ''}\n>`;
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Controls Panel */}
        <div className="border-b lg:border-b-0 lg:border-r border-gray-200 p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Controls</h4>
          <div className="space-y-3">
            {controls.map(control => (
              <div key={control.name}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {control.name}
                </label>
                {control.type === 'text' && (
                  <input
                    type="text"
                    value={componentProps[control.name] || ''}
                    onChange={(e) => updateProp(control.name, e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                {control.type === 'select' && (
                  <select
                    value={componentProps[control.name] || ''}
                    onChange={(e) => updateProp(control.name, e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    {control.options?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                )}
                {control.type === 'boolean' && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={componentProps[control.name] || false}
                      onChange={(e) => updateProp(control.name, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Enabled</span>
                  </label>
                )}
                {control.type === 'number' && (
                  <input
                    type="number"
                    value={componentProps[control.name] || ''}
                    onChange={(e) => updateProp(control.name, Number(e.target.value))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-300">
            <h5 className="text-xs font-medium text-gray-600 mb-2">Generated Code</h5>
            <pre className="text-xs bg-gray-800 text-gray-100 p-2 rounded overflow-x-auto">
              {generateCode()}
            </pre>
          </div>
        </div>

        {/* Component Preview */}
        <div className="p-6 bg-white">
          <div className="flex items-center justify-center min-h-[200px] bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
            {children(componentProps)}
          </div>
        </div>
      </div>
    </div>
  );
});

InteractiveDemo.displayName = 'InteractiveDemo';

export { InteractiveDemo };
