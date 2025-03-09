
type JSONValue = 
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

// Function to determine the type of a JSON value
const getValueType = (value: JSONValue): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

// Function to infer if a string might be a date
const isLikelyDate = (value: string): boolean => {
  // ISO date format check (simplified)
  if (/^\d{4}-\d{2}-\d{2}(T|\s)/.test(value)) return true;
  
  // Try parsing as date and check if valid
  const date = new Date(value);
  return !isNaN(date.getTime());
};

// Generate a Zod schema string from a JSON object
export const generateZodSchema = (
  jsonInput: string, 
  options: {
    addNullable?: boolean;
    customErrorMessages?: boolean;
  } = {}
): { schema: string; error: string | null } => {
  try {
    const { addNullable = false, customErrorMessages = false } = options;
    
    // Parse the JSON input
    const parsedJson = JSON.parse(jsonInput);
    
    // Generate the schema
    const schemaLines = ['import { z } from "zod";', ''];
    
    // Start the schema definition
    generateSchemaType(parsedJson, 'Schema', schemaLines, 0, { addNullable, customErrorMessages });
    
    // Add export statement
    schemaLines.push('');
    schemaLines.push('export const schema = Schema;');
    schemaLines.push('export type Schema = z.infer<typeof Schema>;');
    
    return { schema: schemaLines.join('\n'), error: null };
  } catch (error) {
    return { 
      schema: '', 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
};

// Add custom error messages to a Zod type
const addCustomErrorsToType = (baseType: string, propertyName: string): string => {
  return `${baseType}.superRefine((val, ctx) => {
    // Add custom validation logic for ${propertyName}
    // Example: if (typeof val === 'string' && val.length < 5) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.too_small,
    //     minimum: 5,
    //     type: "string",
    //     inclusive: true,
    //     message: "Custom error: ${propertyName} must be at least 5 characters"
    //   });
    // }
  })`;
};

// Generate a schema for a specific value and add to schema lines
const generateSchemaType = (
  value: JSONValue, 
  name: string, 
  lines: string[],
  depth: number = 0,
  options: {
    addNullable?: boolean;
    customErrorMessages?: boolean;
  } = {}
): void => {
  const { addNullable = false, customErrorMessages = false } = options;
  const indent = '  '.repeat(depth);
  const valueType = getValueType(value);
  
  if (valueType === 'object') {
    // Handle object type
    lines.push(`${indent}export const ${name} = z.object({`);
    
    const entries = Object.entries(value as Record<string, JSONValue>);
    for (const [key, propValue] of entries) {
      const propertyName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
      
      if (getValueType(propValue) === 'object' && propValue !== null) {
        // Handle nested object
        const nestedName = `${name}${key.charAt(0).toUpperCase() + key.slice(1)}`;
        let schemaRef = nestedName;
        
        if (addNullable && Math.random() > 0.7) { // Randomly make some fields nullable for demo
          lines.push(`${indent}  ${propertyName}: ${nestedName}.nullable(),`);
        } else {
          lines.push(`${indent}  ${propertyName}: ${nestedName},`);
        }
        
        generateSchemaType(propValue, nestedName, lines, depth + 1, options);
      } else if (getValueType(propValue) === 'array' && propValue !== null) {
        // Handle array
        handleArrayProperty(propValue as JSONValue[], key, name, lines, indent, depth, options);
      } else {
        // Handle primitive types
        let zodType = getZodTypeForValue(propValue);
        
        if (addNullable && Math.random() > 0.7) { // Randomly make some fields nullable for demo
          zodType = `${zodType}.nullable()`;
        }
        
        if (customErrorMessages) {
          zodType = addCustomErrorsToType(zodType, key);
        }
        
        lines.push(`${indent}  ${propertyName}: ${zodType},`);
      }
    }
    
    lines.push(`${indent}});`);
  } else if (valueType === 'array') {
    // Handle root-level array
    const arrayValue = value as JSONValue[];
    
    if (arrayValue.length === 0) {
      lines.push(`${indent}export const ${name} = z.array(z.unknown());`);
    } else {
      const firstItem = arrayValue[0];
      const firstItemType = getValueType(firstItem);
      
      if (firstItemType === 'object' && firstItem !== null) {
        // Array of objects
        const itemName = `${name}Item`;
        lines.push(`${indent}export const ${name} = z.array(${itemName});`);
        generateSchemaType(firstItem, itemName, lines, depth + 1, options);
      } else {
        // Array of primitives
        let zodType = getZodTypeForValue(firstItem);
        
        if (customErrorMessages) {
          zodType = addCustomErrorsToType(zodType, name);
        }
        
        lines.push(`${indent}export const ${name} = z.array(${zodType});`);
      }
    }
  } else {
    // Handle primitive types at root level
    let zodType = getZodTypeForValue(value);
    
    if (customErrorMessages) {
      zodType = addCustomErrorsToType(zodType, name);
    }
    
    lines.push(`${indent}export const ${name} = ${zodType};`);
  }
};

// Handle array properties
const handleArrayProperty = (
  array: JSONValue[],
  key: string,
  parentName: string,
  lines: string[],
  indent: string,
  depth: number,
  options: {
    addNullable?: boolean;
    customErrorMessages?: boolean;
  } = {}
): void => {
  const { addNullable = false, customErrorMessages = false } = options;
  const propertyName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
  
  if (array.length === 0) {
    let zodType = 'z.array(z.unknown())';
    
    if (addNullable && Math.random() > 0.7) {
      zodType = `${zodType}.nullable()`;
    }
    
    lines.push(`${indent}  ${propertyName}: ${zodType},`);
    return;
  }
  
  const firstItem = array[0];
  const firstItemType = getValueType(firstItem);
  
  if (firstItemType === 'object' && firstItem !== null) {
    // Array of objects
    const itemName = `${parentName}${key.charAt(0).toUpperCase() + key.slice(1)}Item`;
    let zodType = `z.array(${itemName})`;
    
    if (addNullable && Math.random() > 0.7) {
      zodType = `${zodType}.nullable()`;
    }
    
    if (customErrorMessages) {
      zodType = addCustomErrorsToType(zodType, key);
    }
    
    lines.push(`${indent}  ${propertyName}: ${zodType},`);
    generateSchemaType(firstItem, itemName, lines, depth + 1, options);
  } else {
    // Array of primitives
    let zodType = getZodTypeForValue(firstItem);
    
    if (customErrorMessages) {
      zodType = addCustomErrorsToType(zodType, key);
    }
    
    let arrayType = `z.array(${zodType})`;
    
    if (addNullable && Math.random() > 0.7) {
      arrayType = `${arrayType}.nullable()`;
    }
    
    lines.push(`${indent}  ${propertyName}: ${arrayType},`);
  }
};

// Get the Zod type for a JSON value
const getZodTypeForValue = (value: JSONValue): string => {
  if (value === null) return 'z.null()';
  
  switch (typeof value) {
    case 'string':
      if (isLikelyDate(value)) {
        return 'z.string().datetime()';
      }
      return 'z.string()';
    case 'number':
      // Check if integer
      return Number.isInteger(value) ? 'z.number().int()' : 'z.number()';
    case 'boolean':
      return 'z.boolean()';
    default:
      return 'z.unknown()';
  }
};

// Function to format/pretty-print the JSON
export const formatJson = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    return jsonString; // Return original if parsing fails
  }
};
