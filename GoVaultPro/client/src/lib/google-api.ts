import { GoogleAuthService } from './google-auth';

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  thumbnailLink?: string;
  modifiedTime: string;
}

export interface GoogleSheetsData {
  range: string;
  values: any[][];
}

export class GoogleAPIService {
  private static instance: GoogleAPIService;
  private authService: GoogleAuthService;

  constructor() {
    this.authService = GoogleAuthService.getInstance();
  }

  static getInstance(): GoogleAPIService {
    if (!GoogleAPIService.instance) {
      GoogleAPIService.instance = new GoogleAPIService();
    }
    return GoogleAPIService.instance;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = this.authService.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Google Drive API methods
  async createFolder(name: string, parentId?: string): Promise<GoogleDriveFile> {
    const headers = await this.getHeaders();
    
    const metadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId && { parents: [parentId] }),
    };

    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers,
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error(`Failed to create folder: ${response.statusText}`);
    }

    return response.json();
  }

  async uploadFile(file: File, parentId?: string): Promise<GoogleDriveFile> {
    const headers = await this.getHeaders();
    delete (headers as any)['Content-Type']; // Let browser set boundary for multipart

    const metadata = {
      name: file.name,
      ...(parentId && { parents: [parentId] }),
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': headers.Authorization as string,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    return response.json();
  }

  async listFiles(folderId?: string): Promise<GoogleDriveFile[]> {
    const headers = await this.getHeaders();
    
    let query = "trashed=false";
    if (folderId) {
      query += ` and '${folderId}' in parents`;
    }

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,webViewLink,thumbnailLink,modifiedTime)`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to list files: ${response.statusText}`);
    }

    const data = await response.json();
    return data.files || [];
  }

  // Google Sheets API methods
  async createSpreadsheet(title: string): Promise<{ spreadsheetId: string }> {
    const headers = await this.getHeaders();

    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        properties: { title },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create spreadsheet: ${response.statusText}`);
    }

    return response.json();
  }

  async readSheet(spreadsheetId: string, range: string): Promise<GoogleSheetsData> {
    const headers = await this.getHeaders();

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to read sheet: ${response.statusText}`);
    }

    return response.json();
  }

  async writeSheet(spreadsheetId: string, range: string, values: any[][]): Promise<void> {
    const headers = await this.getHeaders();

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({ values }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to write sheet: ${response.statusText}`);
    }
  }

  async appendSheet(spreadsheetId: string, range: string, values: any[][]): Promise<void> {
    const headers = await this.getHeaders();

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ values }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to append to sheet: ${response.statusText}`);
    }
  }
}
