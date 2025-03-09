
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Editor from './JsonEditor';
import { cn } from '@/lib/utils';

interface SchemaPreviewProps {
  schema: string;
  error: string | null;
  className?: string;
}

const SchemaPreview: React.FC<SchemaPreviewProps> = ({
  schema,
  error,
  className,
}) => {
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(schema);
      // Toast notification could be added here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {error ? (
        <Alert variant="destructive" className="mb-4 animate-fade-in">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : schema ? (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Generated Schema</h2>
            <Button onClick={handleCopyToClipboard} variant="outline" size="sm">
              Copy to Clipboard
            </Button>
          </div>
          
          <Tabs defaultValue="schema" className="flex-1 flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="schema">Zod Schema</TabsTrigger>
              <TabsTrigger value="usage">Usage Example</TabsTrigger>
            </TabsList>
            
            <TabsContent value="schema" className="flex-1 mt-0">
              <Editor
                title="Zod Schema"
                value={schema}
                onChange={() => {}}
                language="javascript"
                readOnly
                className="h-full"
              />
            </TabsContent>
            
            <TabsContent value="usage" className="flex-1 mt-0">
              <Editor
                title="Usage Example"
                value={`// Import your schema
import { schema } from './schema';

// Validate your data
try {
  const validatedData = schema.parse(myData);
  console.log('Data is valid:', validatedData);
} catch (error) {
  console.error('Validation error:', error);
}`}
                onChange={() => {}}
                language="javascript"
                readOnly
                className="h-full"
              />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full p-8 text-center text-muted-foreground border border-dashed border-border rounded-lg">
          <div>
            <p className="mb-2">Enter JSON in the editor to generate a Zod schema</p>
            <p className="text-sm">Your schema will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemaPreview;
