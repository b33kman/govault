// Google-Only Architecture Storage
// All user data stored in Google Sheets Users_Permissions sheet
// No database required as per PRD specifications

import type { User } from "@shared/schema";
import { GoogleSheetsService } from "./google-services";
import type { AuthenticatedUser } from "./google-auth";

export class GoogleSheetsStorage {
  private sheetsService: GoogleSheetsService | null = null;
  private spreadsheetId: string | null = null;

  constructor(user?: AuthenticatedUser, spreadsheetId?: string) {
    if (user) {
      this.sheetsService = new GoogleSheetsService(user);
      this.spreadsheetId = spreadsheetId || null;
    }
  }

  async getUser(email: string): Promise<User | undefined> {
    if (!this.sheetsService || !this.spreadsheetId) return undefined;
    
    try {
      // Get user from Users_Permissions sheet in Google Sheets
      const userData = await this.sheetsService.getUserPermissions(this.spreadsheetId, email);
      return userData;
    } catch (error) {
      console.error('Error fetching user from Google Sheets:', error);
      return undefined;
    }
  }

  async createUser(user: Partial<User>): Promise<User> {
    if (!this.sheetsService || !this.spreadsheetId) {
      throw new Error('Google Sheets service not initialized');
    }

    try {
      // Add user to Users_Permissions sheet
      const newUser = await this.sheetsService.createUserPermissions(this.spreadsheetId, user);
      return newUser;
    } catch (error) {
      console.error('Error creating user in Google Sheets:', error);
      throw error;
    }
  }
}

// Factory function to create storage with authenticated user
export function createStorage(user?: AuthenticatedUser, spreadsheetId?: string): GoogleSheetsStorage {
  return new GoogleSheetsStorage(user, spreadsheetId);
}
