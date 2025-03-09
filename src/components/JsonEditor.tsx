
import React, { useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EditorProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  language: 'json' | 'javascript';
  className?: string;
  readOnly?: boolean;
  error?: string | null;
  actions?: React.ReactNode;
}

const Editor: React.FC<EditorProps> = ({
  title,
  value,
  onChange,
  language,
  className,
  readOnly = false,
  error = null,
  actions,
}) => {
  const extensions = language === 'json' ? [json()] : [javascript({ jsx: true })];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={cn("flex flex-col flex-1 rounded-lg overflow-hidden glass-panel", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <h2 className="text-sm font-medium">{title}</h2>
        <div className="flex items-center gap-2">
          {actions}
          {!readOnly && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onChange('')}
              className="h-7 px-2 text-xs"
            >
              Clear
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyToClipboard}
            className="h-7 px-2 text-xs"
          >
            Copy
          </Button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 text-sm bg-destructive/10 text-destructive border-b border-destructive/20">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={value}
          height="100%"
          theme={vscodeDark}
          extensions={extensions}
          onChange={onChange}
          readOnly={readOnly}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            autocompletion: true,
            foldGutter: true,
          }}
          className="h-full text-sm"
        />
      </div>
    </div>
  );
};

export default Editor;
