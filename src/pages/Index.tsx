
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Editor from '@/components/JsonEditor';
import SchemaPreview from '@/components/SchemaPreview';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateZodSchema, formatJson } from '@/utils/zodGenerator';

const sampleJson = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "active": true,
  "createdAt": "2023-01-01T12:00:00Z",
  "score": 92.5,
  "tags": ["user", "premium"],
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipCode": 12345
  },
  "orders": [
    {
      "id": 101,
      "amount": 99.99,
      "date": "2023-02-15T09:30:00Z"
    }
  ]
}`;

const Index = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [schema, setSchema] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load sample JSON when component mounts
  useEffect(() => {
    setJsonInput(sampleJson);
  }, []);

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    // Clear errors when user is typing
    if (error) setError(null);
  };

  const handleFormatJson = () => {
    try {
      const formatted = formatJson(jsonInput);
      setJsonInput(formatted);
      toast.success('JSON formatted successfully');
    } catch (error) {
      setError('Invalid JSON. Please check your input.');
      toast.error('Invalid JSON format');
    }
  };

  const handleGenerateSchema = () => {
    setIsGenerating(true);
    
    try {
      // Validate JSON first
      JSON.parse(jsonInput);
      
      // Generate schema with a slight delay to show animation
      setTimeout(() => {
        const result = generateZodSchema(jsonInput);
        
        if (result.error) {
          setError(result.error);
          setSchema('');
          toast.error('Error generating schema');
        } else {
          setSchema(result.schema);
          setError(null);
          toast.success('Schema generated successfully');
        }
        
        setIsGenerating(false);
      }, 300);
    } catch (error) {
      setIsGenerating(false);
      const message = error instanceof Error ? error.message : 'Invalid JSON';
      setError(message);
      toast.error('Invalid JSON format');
    }
  };

  const handleLoadSample = () => {
    setJsonInput(sampleJson);
    setError(null);
    toast.info('Sample JSON loaded');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 container px-4 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 max-w-3xl mx-auto mb-8 text-center">
          <div className="inline-flex mx-auto mb-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            JSON to Zod Schema
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Transform your <span className="text-primary">JSON</span> into <span className="text-primary">Zod</span> schemas
          </h1>
          <p className="text-xl text-muted-foreground">
            Generate type-safe validation schemas with a single click
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Input JSON</h2>
              <div className="flex gap-2">
                <Button 
                  onClick={handleLoadSample} 
                  variant="outline" 
                  size="sm"
                >
                  Load Sample
                </Button>
                <Button 
                  onClick={handleFormatJson} 
                  variant="outline"
                  size="sm"
                >
                  Format JSON
                </Button>
              </div>
            </div>
            
            <Editor
              title="JSON Editor"
              value={jsonInput}
              onChange={handleJsonChange}
              language="json"
              error={error}
              className="h-[70vh] md:h-[65vh]"
            />
            
            <Button
              onClick={handleGenerateSchema}
              size="lg"
              disabled={isGenerating}
              className="relative overflow-hidden group"
            >
              <span className={`flex items-center gap-2 transition-all duration-300 ${isGenerating ? 'opacity-0' : 'opacity-100'}`}>
                Generate Zod Schema
              </span>
              {isGenerating && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-foreground/20 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Button>
          </div>
          
          <SchemaPreview
            schema={schema}
            error={error}
            className="h-full"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="glass-panel p-6 rounded-lg flex flex-col items-center text-center animate-fade-in">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Fast Conversion</h3>
            <p className="text-muted-foreground">Generate Zod schemas from JSON in milliseconds, with smart type inference.</p>
          </div>
          
          <div className="glass-panel p-6 rounded-lg flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Type Safety</h3>
            <p className="text-muted-foreground">Create robust validation schemas that catch errors before they happen.</p>
          </div>
          
          <div className="glass-panel p-6 rounded-lg flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Developer Friendly</h3>
            <p className="text-muted-foreground">Copy-paste ready code with TypeScript support and intelligent formatting.</p>
          </div>
        </div>
      </main>
      
      <Footer className="mt-auto" />
    </div>
  );
};

export default Index;
