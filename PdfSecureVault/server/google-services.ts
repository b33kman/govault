import { google } from 'googleapis';
import type { AuthenticatedUser } from './google-auth';
import { createGoogleClient } from './google-auth';

// Google Drive service for document management
export class GoogleDriveService {
  private drive: any;
  private user: AuthenticatedUser;

  constructor(user: AuthenticatedUser) {
    this.user = user;
    const auth = createGoogleClient(user);
    this.drive = google.drive({ version: 'v3', auth });
  }

  // Create the main GoVault folder structure
  async createVaultStructure(familyName: string) {
    try {
      // Create main folder
      const mainFolder = await this.drive.files.create({
        requestBody: {
          name: `GoVAULT_${familyName}_Data`,
          mimeType: 'application/vnd.google-apps.folder'
        }
      });

      const mainFolderId = mainFolder.data.id;

      // Create category folders as specified in PRD
      const categories = [
        'Family_IDs',
        'Finance', 
        'Property',
        'Passwords',
        'Insurance',
        'Taxes',
        'Legal',
        'Business',
        'Contacts'
      ];

      const folderStructure: { [key: string]: string } = {};

      for (const category of categories) {
        const folder = await this.drive.files.create({
          requestBody: {
            name: category,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [mainFolderId]
          }
        });
        folderStructure[category] = folder.data.id;
      }

      return {
        mainFolderId,
        categories: folderStructure
      };
    } catch (error) {
      console.error('Error creating vault structure:', error);
      throw error;
    }
  }

  // Upload document to specific category folder
  async uploadDocument(file: any, category: string, categoryFolderId: string) {
    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: file.originalname,
          parents: [categoryFolderId]
        },
        media: {
          mimeType: file.mimetype,
          body: file.buffer
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  // List files in a category folder
  async listCategoryFiles(categoryFolderId: string) {
    try {
      const response = await this.drive.files.list({
        q: `'${categoryFolderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink)'
      });

      return response.data.files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  // Search across all documents
  async searchDocuments(query: string, mainFolderId: string) {
    try {
      const response = await this.drive.files.list({
        q: `'${mainFolderId}' in parents and name contains '${query}' and trashed=false`,
        fields: 'files(id, name, mimeType, modifiedTime, parents, webViewLink)'
      });

      return response.data.files;
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  }
}

// Google Sheets service for structured data management
export class GoogleSheetsService {
  private sheets: any;
  private user: AuthenticatedUser;

  constructor(user: AuthenticatedUser) {
    this.user = user;
    const auth = createGoogleClient(user);
    this.sheets = google.sheets({ version: 'v4', auth });
  }

  // Create the master GoVault spreadsheet with all category sheets
  async createMasterSpreadsheet(familyName: string) {
    try {
      const spreadsheet = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: `GoVAULT_${familyName}_Database`
          },
          sheets: [
            { properties: { title: 'Family_IDs' } },
            { properties: { title: 'Finance_Accounts' } },
            { properties: { title: 'Property_Assets' } },
            { properties: { title: 'Passwords_Vault' } },
            { properties: { title: 'Insurance_Policies' } },
            { properties: { title: 'Tax_Records' } },
            { properties: { title: 'Legal_Documents' } },
            { properties: { title: 'Business_Info' } },
            { properties: { title: 'Contacts_Directory' } },
            { properties: { title: 'Users_Permissions' } },
            { properties: { title: 'Audit_Log' } },
            { properties: { title: 'Document_Registry' } },
            { properties: { title: 'Reminders_Alerts' } }
          ]
        }
      });

      const spreadsheetId = spreadsheet.data.spreadsheetId;
      
      // Initialize headers for each sheet
      await this.initializeSheetHeaders(spreadsheetId);
      
      return spreadsheetId;
    } catch (error) {
      console.error('Error creating master spreadsheet:', error);
      throw error;
    }
  }

  // Initialize headers for all sheets based on PRD schemas
  private async initializeSheetHeaders(spreadsheetId: string) {
    const sheetHeaders = {
      'Family_IDs': ['ID Type', 'ID Number', 'Expiration Date', 'Issuing Authority', 'Family Member', 'Renewal Requirements', 'Document Link'],
      'Finance_Accounts': ['Account Type', 'Institution Name', 'Account Number', 'Routing Number', 'Current Balance', 'Interest Rate', 'Contact Info', 'Login Credentials', 'Document Links'],
      'Property_Assets': ['Property Type', 'Description', 'Purchase Date', 'Purchase Price', 'Current Value', 'Location', 'Insurance Policy Links', 'Loan Information', 'Document Links'],
      'Passwords_Vault': ['Service Name', 'Username', 'Encrypted Password', 'URL', 'Security Questions', 'Two Factor Setup', 'Last Updated', 'Category', 'Shared With'],
      'Insurance_Policies': ['Policy Type', 'Insurance Company', 'Policy Number', 'Coverage Amount', 'Deductible', 'Premium', 'Renewal Date', 'Agent Contact', 'Beneficiaries', 'Document Links'],
      'Tax_Records': ['Tax Year', 'Filing Status', 'Preparer Info', 'Key Deductions', 'Refund Amount', 'Important Dates', 'Document Links'],
      'Legal_Documents': ['Document Type', 'Parties Involved', 'Effective Date', 'Expiration Date', 'Attorney Info', 'Key Terms', 'Witness Info', 'Document Links'],
      'Business_Info': ['Business Name', 'Business Type', 'Formation Date', 'Tax ID', 'Partners/Members', 'Registered Agent', 'Annual Requirements', 'Insurance Info', 'Document Links'],
      'Contacts_Directory': ['Contact Type', 'Name', 'Company', 'Phone', 'Email', 'Address', 'Specialization', 'Relationship to Family', 'Emergency Contact', 'Preferred Contact Method'],
      'Users_Permissions': ['User Email', 'Role', 'Family IDs View', 'Family IDs Edit', 'Finance View', 'Finance Edit', 'Property View', 'Property Edit', 'Passwords View', 'Passwords Edit', 'Insurance View', 'Insurance Edit', 'Taxes View', 'Taxes Edit', 'Legal View', 'Legal Edit', 'Business View', 'Business Edit', 'Contacts View', 'Contacts Edit'],
      'Audit_Log': ['Timestamp', 'User Email', 'Action', 'Category', 'Resource ID', 'Details'],
      'Document_Registry': ['Document ID', 'Name', 'Category', 'Google File ID', 'Mime Type', 'Uploaded By', 'Upload Date', 'Metadata'],
      'Reminders_Alerts': ['ID', 'Title', 'Description', 'Category', 'Due Date', 'Is Completed', 'Created By', 'Created Date']
    };

    for (const [sheetName, headers] of Object.entries(sheetHeaders)) {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers]
        }
      });
    }
  }

  // Add data to a specific sheet
  async addData(spreadsheetId: string, sheetName: string, data: any[]) {
    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [data]
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error adding data to ${sheetName}:`, error);
      throw error;
    }
  }

  // Get data from a specific sheet
  async getData(spreadsheetId: string, sheetName: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:Z`
      });

      return response.data.values || [];
    } catch (error) {
      console.error(`Error getting data from ${sheetName}:`, error);
      throw error;
    }
  }

  // Update specific row in sheet
  async updateData(spreadsheetId: string, sheetName: string, row: number, data: any[]) {
    try {
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A${row}:Z${row}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [data]
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating data in ${sheetName}:`, error);
      throw error;
    }
  }

  // Search across all sheets
  async searchAllSheets(spreadsheetId: string, query: string) {
    const sheetNames = ['Family_IDs', 'Finance_Accounts', 'Property_Assets', 'Insurance_Policies', 'Tax_Records', 'Legal_Documents', 'Business_Info', 'Contacts_Directory'];
    const results: any[] = [];

    for (const sheetName of sheetNames) {
      try {
        const data = await this.getData(spreadsheetId, sheetName);
        const filteredRows = data.filter((row: any[]) => 
          row.some(cell => 
            cell && cell.toString().toLowerCase().includes(query.toLowerCase())
          )
        );

        if (filteredRows.length > 0) {
          results.push({
            sheet: sheetName,
            rows: filteredRows
          });
        }
      } catch (error) {
        console.error(`Error searching ${sheetName}:`, error);
      }
    }

    return results;
  }
}

// Gmail service for notifications and invitations
export class GmailService {
  private gmail: any;
  private user: AuthenticatedUser;

  constructor(user: AuthenticatedUser) {
    this.user = user;
    const auth = createGoogleClient(user);
    this.gmail = google.gmail({ version: 'v1', auth });
  }

  // Send invitation email to family members or professionals
  async sendInvitation(to: string, subject: string, body: string) {
    try {
      const message = [
        'Content-Type: text/html; charset="UTF-8"',
        'MIME-Version: 1.0',
        `To: ${to}`,
        `Subject: ${subject}`,
        '',
        body
      ].join('\n');

      const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

// Calendar service for reminders and deadline tracking
export class GoogleCalendarService {
  private calendar: any;
  private user: AuthenticatedUser;

  constructor(user: AuthenticatedUser) {
    this.user = user;
    const auth = createGoogleClient(user);
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  // Create reminder events for important dates
  async createReminder(title: string, description: string, date: string) {
    try {
      const event = {
        summary: title,
        description: description,
        start: {
          date: date,
          timeZone: 'America/New_York'
        },
        end: {
          date: date,
          timeZone: 'America/New_York'
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 10 }
          ]
        }
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event
      });

      return response.data;
    } catch (error) {
      console.error('Error creating calendar reminder:', error);
      throw error;
    }
  }
}