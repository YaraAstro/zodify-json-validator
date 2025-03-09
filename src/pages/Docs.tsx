
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Editor from '@/components/JsonEditor';

const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  
  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'features', title: 'Features' },
    { id: 'examples', title: 'Examples' },
    { id: 'nullable-fields', title: 'Nullable Fields' },
    { id: 'nested-objects', title: 'Nested Objects' },
    { id: 'custom-errors', title: 'Custom Error Messages' },
  ];
  
  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Documentation</h1>
          <Link to="/">
            <Button variant="outline">Back to Generator</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block">
            <div className="sticky top-8 rounded-xl border bg-card p-4">
              <p className="font-semibold mb-3">On this page</p>
              <nav className="flex flex-col gap-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleScrollTo(section.id)}
                    className={`text-left px-3 py-1.5 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                      activeSection === section.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
          
          {/* Content */}
          <div className="flex flex-col gap-10">
            <section id="introduction" className="scroll-mt-16">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                Zodify is a powerful JSON to Zod schema generator that helps you create type-safe validation schemas for your TypeScript projects.
                It automatically infers types from your JSON data and generates the corresponding Zod schema.
              </p>
              <p className="text-muted-foreground">
                With Zodify, you can quickly convert any JSON data into a Zod schema, saving time and reducing errors in your validation code.
              </p>
            </section>
            
            <Separator />
            
            <section id="getting-started" className="scroll-mt-16">
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Paste your JSON</span> - Enter or paste your JSON data into the editor on the left.
                </li>
                <li>
                  <span className="font-medium text-foreground">Customize options</span> - Select whether to include nullable fields and custom error messages.
                </li>
                <li>
                  <span className="font-medium text-foreground">Generate schema</span> - Click the "Generate Zod Schema" button to create your schema.
                </li>
                <li>
                  <span className="font-medium text-foreground">Copy the result</span> - Use the copy button to copy the generated schema to your clipboard.
                </li>
              </ol>
            </section>
            
            <Separator />
            
            <section id="features" className="scroll-mt-16">
              <h2 className="text-2xl font-bold mb-4">Features</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Type Inference</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Automatically detects and sets appropriate types (string, number, boolean, etc.) based on your JSON values.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Nested Objects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Handles nested objects and arrays with proper schema generation for complex data structures.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Nullable Fields</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Option to generate schemas with nullable fields to accommodate optional data.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Error Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Add templates for custom error messages to enhance validation feedback.</p>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            <Separator />
            
            <section id="examples" className="scroll-mt-16">
              <h2 className="text-2xl font-bold mb-4">Examples</h2>
              
              <Tabs defaultValue="basic">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic Usage</TabsTrigger>
                  <TabsTrigger value="nested">Nested Objects</TabsTrigger>
                  <TabsTrigger value="array">Arrays</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic JSON</CardTitle>
                      <CardDescription>A simple JSON object with basic types</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Editor
                        title="Input JSON"
                        value={`{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "active": true
}`}
                        onChange={() => {}}
                        language="json"
                        readOnly
                        className="h-[200px] mb-4"
                      />
                      
                      <Editor
                        title="Generated Schema"
                        value={`import { z } from "zod";

export const Schema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string(),
  active: z.boolean(),
});

export const schema = Schema;
export type Schema = z.infer<typeof Schema>;`}
                        onChange={() => {}}
                        language="javascript"
                        readOnly
                        className="h-[240px]"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="nested" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Nested Objects</CardTitle>
                      <CardDescription>JSON with nested object structures</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Editor
                        title="Input JSON"
                        value={`{
  "user": {
    "id": 1,
    "profile": {
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}`}
                        onChange={() => {}}
                        language="json"
                        readOnly
                        className="h-[200px] mb-4"
                      />
                      
                      <Editor
                        title="Generated Schema"
                        value={`import { z } from "zod";

export const SchemaUserProfileItem = z.object({
  name: z.string(),
  avatar: z.string(),
});

export const SchemaUser = z.object({
  id: z.number().int(),
  profile: SchemaUserProfileItem,
});

export const Schema = z.object({
  user: SchemaUser,
});

export const schema = Schema;
export type Schema = z.infer<typeof Schema>;`}
                        onChange={() => {}}
                        language="javascript"
                        readOnly
                        className="h-[280px]"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="array" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Arrays</CardTitle>
                      <CardDescription>JSON with array fields</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Editor
                        title="Input JSON"
                        value={`{
  "tags": ["typescript", "zod", "validation"],
  "items": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" }
  ]
}`}
                        onChange={() => {}}
                        language="json"
                        readOnly
                        className="h-[200px] mb-4"
                      />
                      
                      <Editor
                        title="Generated Schema"
                        value={`import { z } from "zod";

export const SchemaItemsItem = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const Schema = z.object({
  tags: z.array(z.string()),
  items: z.array(SchemaItemsItem),
});

export const schema = Schema;
export type Schema = z.infer<typeof Schema>;`}
                        onChange={() => {}}
                        language="javascript"
                        readOnly
                        className="h-[240px]"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>
            
            <Separator />
            
            <section id="nullable-fields" className="scroll-mt-16">
              <h2 className="text-2xl font-bold mb-4">Nullable Fields</h2>
              <p className="text-muted-foreground mb-4">
                The "Generate nullable fields" option allows you to create schema fields that can accept null values.
                When enabled, some fields in your schema will be marked as nullable using the <code className="bg-muted px-1 py-0.5 rounded">.nullable()</code> modifier.
              </p>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Example with Nullable Fields</CardTitle>
                </CardHeader>
                <CardContent>
                  <Editor
                    title="Generated Schema With Nullable Fields"
                    value={`import { z } from "zod";

export const Schema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string().nullable(), // This field can be null
  metadata: z.object({
    tags: z.array(z.string()).nullable(), // This field can be null
    category: z.string(),
  }),
});

export const schema = Schema;
export type Schema = z.infer<typeof Schema>;`}
                    onChange={() => {}}
                    language="javascript"
                    readOnly
                    className="h-[250px]"
                  />
                </CardContent>
              </Card>
              
              <p className="text-muted-foreground">
                In your application code, you can use these schemas to safely handle data that might include null values,
                while still maintaining type safety.
              </p>
            </section>
            
            <Separator />
            
            <section id="nested-objects" className="scroll-mt-16">
              <h2 className="text-2xl font-bold mb-4">Nested Objects</h2>
              <p className="text-muted-foreground mb-4">
                Zodify automatically handles nested objects in your JSON data by creating separate schema definitions for each level.
                This approach maintains code readability while preserving the structure of complex data.
              </p>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>How Nested Objects Are Handled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium mb-2">JSON Input:</p>
                      <Editor
                        title="Input JSON"
                        value={`{
  "user": {
    "id": 1,
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "country": {
        "code": "US",
        "name": "United States"
      }
    }
  }
}`}
                        onChange={() => {}}
                        language="json"
                        readOnly
                        className="h-[250px]"
                      />
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">Generated Schema:</p>
                      <Editor
                        title="Generated Schema"
                        value={`import { z } from "zod";

export const SchemaUserAddressCountry = z.object({
  code: z.string(),
  name: z.string(),
});

export const SchemaUserAddress = z.object({
  street: z.string(),
  city: z.string(),
  country: SchemaUserAddressCountry,
});

export const SchemaUser = z.object({
  id: z.number().int(),
  address: SchemaUserAddress,
});

export const Schema = z.object({
  user: SchemaUser,
});

export const schema = Schema;
export type Schema = z.infer<typeof Schema>;`}
                        onChange={() => {}}
                        language="javascript"
                        readOnly
                        className="h-[350px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <p className="text-muted-foreground">
                This nested structure approach makes it easier to maintain and update your validation schemas
                as your data model evolves.
              </p>
            </section>
            
            <Separator />
            
            <section id="custom-errors" className="scroll-mt-16">
              <h2 className="text-2xl font-bold mb-4">Custom Error Messages</h2>
              <p className="text-muted-foreground mb-4">
                The "Add custom error messages" option inserts templates for customizing validation error messages
                using Zod's <code className="bg-muted px-1 py-0.5 rounded">superRefine</code> method.
              </p>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Schema with Custom Error Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <Editor
                    title="Generated Schema With Custom Errors"
                    value={`import { z } from "zod";

export const Schema = z.object({
  name: z.string().superRefine((val, ctx) => {
    // Add custom validation logic for name
    // Example: if (typeof val === 'string' && val.length < 5) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.too_small,
    //     minimum: 5,
    //     type: "string",
    //     inclusive: true,
    //     message: "Custom error: name must be at least 5 characters"
    //   });
    // }
  }),
  email: z.string().superRefine((val, ctx) => {
    // Add custom validation logic for email
    // Example: if (!val.includes('@')) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Custom error: email must contain an @ symbol"
    //   });
    // }
  }),
});

export const schema = Schema;
export type Schema = z.infer<typeof Schema>;`}
                    onChange={() => {}}
                    language="javascript"
                    readOnly
                    className="h-[350px]"
                  />
                </CardContent>
              </Card>
              
              <p className="text-muted-foreground mb-4">
                You can uncomment and customize these templates to provide more user-friendly error messages
                for specific validation failures.
              </p>
              
              <div className="bg-accent/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Pro Tip</h3>
                <p className="text-muted-foreground">
                  Custom error messages are especially useful for user-facing forms where you want to provide
                  clear guidance when validation fails.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer className="mt-auto" />
    </div>
  );
};

export default Docs;
