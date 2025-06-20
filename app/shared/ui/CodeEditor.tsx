import React, { useState, useEffect } from 'react';
import { cn } from '~/shared/lib/utils';
import { theme } from '~/shared/design-system/theme';

interface CodeEditorProps {
  className?: string;
  value?: string;
  onChange?: (value: string | undefined, event: any) => void;
  language?: string;
  height?: string;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
}

const defaultCode = `import React from 'react';
import { Button } from '~/shared/ui/button';

interface ExampleComponentProps {
  title: string;
  onClick: () => void;
}

export default function ExampleComponent({ title, onClick }: ExampleComponentProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Button onClick={onClick} variant="primary">
        Click me!
      </Button>
    </div>
  );
}`;

export default function CodeEditor({
  className,
  value = defaultCode,
  onChange,
  language = 'typescript',
  height = '400px',
  theme: editorTheme = 'light',
  readOnly = false,
}: CodeEditorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [MonacoEditor, setMonacoEditor] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);

    // Dynamically import Monaco Editor only on client side
    import('@monaco-editor/react').then((module) => {
      setMonacoEditor(() => module.default);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  const handleEditorDidMount = () => {
    setIsLoading(false);
  };

  // Don't render anything until we're on the client
  if (!isMounted) {
    return (
      <div
        className={cn(
          'relative border rounded-lg overflow-hidden',
          className,
        )}
        style={{
          borderColor: theme.colors.gray[200],
          backgroundColor: theme.colors.white,
          height,
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundColor: theme.colors.gray[50],
            zIndex: theme.zIndex[10],
          }}
        >
          <div
            className="text-sm"
            style={{ color: theme.colors.gray[500] }}
          >
            Loading editor...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative border rounded-lg overflow-hidden',
        className,
      )}
      style={{
        borderColor: theme.colors.gray[200],
        backgroundColor: theme.colors.white,
        height,
      }}
    >
      {(isLoading || !MonacoEditor) && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundColor: theme.colors.gray[50],
            zIndex: theme.zIndex[10],
          }}
        >
          <div
            className="text-sm"
            style={{ color: theme.colors.gray[500] }}
          >
            Loading editor...
          </div>
        </div>
      )}

      {MonacoEditor && (
        <MonacoEditor
          height={height}
          language={language}
          value={value}
          {...(onChange && { onChange })}
          theme={editorTheme === 'dark' ? 'vs-dark' : 'vs'}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: theme.typography.fontFamily.mono.join(', '),
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            selectionHighlight: false,
            renderWhitespace: 'selection',
          }}
        />
      )}
    </div>
  );
}
