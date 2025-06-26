import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ExtractedData {
  category: string;
  subcategory?: string;
  fields: Record<string, any>;
  confidence: number;
  summary: string;
  suggestedFileName?: string;
}

export interface DocumentAnalysis {
  documentType: string;
  category: string;
  extractedData: ExtractedData;
  requiresConfirmation: boolean;
}

// Category-specific extraction schemas based on PDF specifications
const extractionSchemas = {
  'Family IDs': {
    fields: ['documentType', 'fullName', 'documentNumber', 'issuedDate', 'expirationDate', 'issuingAuthority', 'address', 'dateOfBirth'],
    subcategories: ['Drivers License', 'Passport', 'Birth Certificate', 'Social Security Card', 'Marriage Certificate', 'Death Certificate']
  },
  'Finance': {
    fields: ['institutionName', 'accountType', 'accountNumber', 'balance', 'interestRate', 'maturityDate', 'contactInfo', 'statementDate'],
    subcategories: ['Bank Accounts', 'Investment Accounts', 'Retirement Accounts', 'Loans', 'Credit Cards']
  },
  'Property': {
    fields: ['propertyType', 'address', 'purchasePrice', 'currentValue', 'purchaseDate', 'mortgageInfo', 'insuranceInfo', 'taxInfo'],
    subcategories: ['Real Estate', 'Vehicles', 'Valuable Items', 'Collectibles']
  },
  'Insurance': {
    fields: ['policyType', 'policyNumber', 'company', 'premium', 'deductible', 'coverageAmount', 'effectiveDate', 'renewalDate', 'beneficiaries'],
    subcategories: ['Life Insurance', 'Health Insurance', 'Auto Insurance', 'Home Insurance', 'Disability Insurance']
  },
  'Taxes': {
    fields: ['taxYear', 'filingStatus', 'grossIncome', 'taxesOwed', 'refundAmount', 'preparerInfo', 'filingDate', 'dueDate'],
    subcategories: ['Tax Returns', 'W-2 Forms', '1099 Forms', 'Tax Documents', 'Receipts']
  },
  'Legal': {
    fields: ['documentType', 'parties', 'effectiveDate', 'expirationDate', 'terms', 'attorney', 'witnessInfo', 'notaryInfo'],
    subcategories: ['Wills', 'Trusts', 'Power of Attorney', 'Contracts', 'Estate Planning']
  },
  'Business': {
    fields: ['businessName', 'entityType', 'registrationNumber', 'registrationDate', 'address', 'owners', 'licenseInfo', 'taxID'],
    subcategories: ['Formation Documents', 'Licenses', 'Agreements', 'Financial Records']
  },
  'Contacts': {
    fields: ['name', 'title', 'company', 'phone', 'email', 'address', 'specialty', 'relationship', 'notes'],
    subcategories: ['Emergency Contacts', 'Professional Services', 'Healthcare Providers', 'Financial Advisors']
  }
};

export async function analyzeDocument(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<DocumentAnalysis> {
  try {
    let extractedText = '';
    let base64Content = '';

    // Handle different file types
    if (mimeType.startsWith('image/')) {
      base64Content = fileBuffer.toString('base64');
      extractedText = await extractTextFromImage(base64Content, mimeType);
    } else if (mimeType === 'application/pdf') {
      // For PDF files, we'll use OCR via OpenAI Vision
      base64Content = fileBuffer.toString('base64');
      extractedText = await extractTextFromPDF(base64Content);
    } else {
      // For text-based documents
      extractedText = fileBuffer.toString('utf-8');
    }

    // Determine document category and type
    const categoryAnalysis = await categorizeDocument(extractedText, fileName);
    
    // Extract structured data based on category
    const extractedData = await extractStructuredData(extractedText, categoryAnalysis.category, fileName);

    return {
      documentType: categoryAnalysis.documentType,
      category: categoryAnalysis.category,
      extractedData,
      requiresConfirmation: true
    };

  } catch (error) {
    console.error('Error analyzing document:', error);
    throw new Error('Failed to analyze document: ' + (error instanceof Error ? error.message : String(error)));
  }
}

async function extractTextFromImage(base64Image: string, mimeType: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract all text content from this document image. Preserve the structure and formatting as much as possible."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`
            }
          }
        ],
      },
    ],
    max_tokens: 2000,
  });

  return response.choices[0].message.content || '';
}

async function extractTextFromPDF(base64PDF: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract all text content from this PDF document. Preserve the structure and important details."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:application/pdf;base64,${base64PDF}`
            }
          }
        ],
      },
    ],
    max_tokens: 2000,
  });

  return response.choices[0].message.content || '';
}

async function categorizeDocument(text: string, fileName: string): Promise<{ category: string; documentType: string }> {
  const prompt = `
    Analyze this document and determine:
    1. Which category it belongs to from: Family IDs, Finance, Property, Insurance, Taxes, Legal, Business, Contacts
    2. The specific document type (e.g., "Driver's License", "Bank Statement", "Insurance Policy")
    
    Document filename: ${fileName}
    Document content: ${text.substring(0, 1000)}
    
    Respond with JSON in this format:
    {
      "category": "category_name",
      "documentType": "specific_document_type",
      "confidence": 0.95
    }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a document classification expert. Analyze documents and categorize them accurately for a family information management system."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  return {
    category: result.category || 'Finance',
    documentType: result.documentType || 'Document'
  };
}

async function extractStructuredData(text: string, category: string, fileName: string): Promise<ExtractedData> {
  const schema = extractionSchemas[category as keyof typeof extractionSchemas];
  if (!schema) {
    throw new Error(`Unknown category: ${category}`);
  }

  const prompt = `
    Extract structured data from this ${category} document.
    
    Document filename: ${fileName}
    Document content: ${text}
    
    Extract the following fields if present: ${schema.fields.join(', ')}
    Possible subcategories: ${schema.subcategories.join(', ')}
    
    Rules:
    - Only extract data that is clearly present in the document
    - Use null for missing fields
    - Format dates as YYYY-MM-DD
    - For amounts, include currency symbol if present
    - Be precise and accurate
    
    Respond with JSON in this format:
    {
      "subcategory": "most_specific_subcategory",
      "fields": {
        "field_name": "extracted_value"
      },
      "confidence": 0.95,
      "summary": "Brief summary of what this document contains",
      "suggestedFileName": "suggested_descriptive_filename.ext"
    }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a data extraction expert specializing in ${category} documents. Extract information accurately and provide confidence scores.`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  
  return {
    category,
    subcategory: result.subcategory,
    fields: result.fields || {},
    confidence: result.confidence || 0.8,
    summary: result.summary || 'Document processed',
    suggestedFileName: result.suggestedFileName
  };
}

export async function validateExtractedData(extractedData: ExtractedData, userCorrections: Record<string, any>): Promise<ExtractedData> {
  // Apply user corrections to extracted data
  const correctedFields = { ...extractedData.fields, ...userCorrections };
  
  return {
    ...extractedData,
    fields: correctedFields,
    confidence: 1.0 // User confirmed, so confidence is now 100%
  };
}