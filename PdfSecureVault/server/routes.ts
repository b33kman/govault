import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, requireAuth, type AuthenticatedUser } from "./google-auth";
import { GoogleDriveService, GoogleSheetsService, GmailService, GoogleCalendarService } from "./google-services";
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Google OAuth authentication
  setupAuth(app);

  // Current user endpoint  
  app.get('/api/auth/me', (req: any, res) => {
    // Demo mode - return demo user when Google OAuth is not configured
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.json({
        id: 'demo-user-123',
        googleId: 'demo-user-123',
        email: 'demo@govault.family',
        name: 'Demo User',
        picture: null,
        role: 'Family Owner',
        createdAt: new Date(),
        lastActive: new Date(),
      });
    }

    // Production mode with actual Google OAuth
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = req.user as AuthenticatedUser;
    res.json({
      id: user.googleId,
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role || 'Family Owner',
      createdAt: new Date(),
      lastActive: new Date(),
    });
  });

  // Dashboard data endpoints that integrate with existing components
  app.get('/api/dashboard/stats', async (req: any, res) => {
    // For now, return mock data that matches the existing component structure
    // This would be replaced with actual Google Sheets data
    const stats = {
      totalDocuments: 47,
      documentsGrowth: '$247,350',
      activeReminders: 3,
      upcomingDeadlines: '2 renewals',
      familyMembers: 4,
      activeUsers: 'Johnson Family',
      securityScore: '98%',
    };
    res.json(stats);
  });

  app.get('/api/dashboard/activity', async (req: any, res) => {
    const activities = [
      {
        id: '1',
        user: 'Jane Johnson',
        action: 'upload',
        document: 'Home Insurance Policy 2024',
        timestamp: '2 hours ago',
        icon: 'upload',
        iconColor: 'blue',
      },
      {
        id: '2',
        user: 'John Johnson',
        action: 'edit',
        field: 'Bank Account Details',
        timestamp: '5 hours ago',
        icon: 'edit',
        iconColor: 'green',
      },
      {
        id: '3',
        user: 'System',
        action: 'share',
        document: 'Tax Documents 2023',
        sharedWith: 'CPA Johnson',
        timestamp: '1 day ago',
        icon: 'share',
        iconColor: 'purple',
      },
    ];
    res.json(activities);
  });

  app.get('/api/dashboard/reminders', async (req: any, res) => {
    const reminders = [
      {
        id: '1',
        title: 'Car Insurance Renewal',
        date: 'Due in 5 days',
        priority: 'high',
        category: 'insurance',
      },
      {
        id: '2',
        title: 'Passport Expiration',
        date: 'Due in 2 weeks',
        priority: 'medium',
        category: 'personal_id',
      },
      {
        id: '3',
        title: 'Property Tax Due',
        date: 'Due in 3 weeks',
        priority: 'low',
        category: 'property',
      },
    ];
    res.json(reminders);
  });

  app.get('/api/dashboard/categories', async (req: any, res) => {
    const categories = [
      {
        name: 'Financial',
        itemCount: 12,
        documentCount: 8,
        lastUpdated: '2 hours ago',
        icon: 'dollar-sign',
        iconColor: 'green',
        route: '/category/financial',
      },
      {
        name: 'Insurance',
        itemCount: 8,
        documentCount: 6,
        lastUpdated: '1 day ago',
        icon: 'umbrella',
        iconColor: 'blue',
        route: '/category/insurance',
      },
      {
        name: 'Legal',
        itemCount: 6,
        documentCount: 4,
        lastUpdated: '3 days ago',
        icon: 'gavel',
        iconColor: 'purple',
        route: '/category/legal',
      },
      {
        name: 'Medical',
        itemCount: 15,
        documentCount: 10,
        lastUpdated: '1 hour ago',
        icon: 'heart',
        iconColor: 'red',
        route: '/category/medical',
      },
      {
        name: 'Personal ID',
        itemCount: 9,
        documentCount: 7,
        lastUpdated: '4 hours ago',
        icon: 'id-card',
        iconColor: 'indigo',
        route: '/category/personal-id',
      },
      {
        name: 'Property',
        itemCount: 4,
        documentCount: 3,
        lastUpdated: '2 days ago',
        icon: 'building',
        iconColor: 'orange',
        route: '/category/property',
      },
    ];
    res.json(categories);
  });

  app.get('/api/notifications/count', (req: any, res) => {
    res.json({ count: 3 });
  });

  // Initialize family vault (Google Drive + Sheets setup)
  app.post('/api/vault/initialize', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { familyName } = req.body;

      const driveService = new GoogleDriveService(user);
      const sheetsService = new GoogleSheetsService(user);

      // Create folder structure in Google Drive
      const vaultStructure = await driveService.createVaultStructure(familyName);
      
      // Create master spreadsheet in Google Sheets
      const spreadsheetId = await sheetsService.createMasterSpreadsheet(familyName);

      // Add owner to permissions sheet
      await sheetsService.addData(spreadsheetId, 'Users_Permissions', [
        user.email, 'owner', true, true, true, true, true, true, true, true, 
        true, true, true, true, true, true, true, true, true, true
      ]);

      res.json({
        success: true,
        vaultStructure,
        spreadsheetId,
        message: 'Family vault initialized successfully'
      });
    } catch (error) {
      console.error('Error initializing vault:', error);
      res.status(500).json({ error: 'Failed to initialize vault' });
    }
  });

  // Document upload to Google Drive
  app.post('/api/documents/upload', requireAuth, upload.single('file'), async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { category, categoryFolderId } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const driveService = new GoogleDriveService(user);
      const uploadedFile = await driveService.uploadDocument(file, category, categoryFolderId);

      res.json({
        success: true,
        fileId: uploadedFile.id,
        fileName: uploadedFile.name,
        message: 'Document uploaded successfully'
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload document' });
    }
  });

  // Get documents from Google Drive category folder
  app.get('/api/documents/:categoryFolderId', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { categoryFolderId } = req.params;

      const driveService = new GoogleDriveService(user);
      const files = await driveService.listCategoryFiles(categoryFolderId);

      res.json(files);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  });

  // Unified search across Google Drive and Sheets
  app.get('/api/search', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { q, spreadsheetId, mainFolderId } = req.query;

      if (!q) {
        return res.status(400).json({ error: 'Search query required' });
      }

      const driveService = new GoogleDriveService(user);
      const sheetsService = new GoogleSheetsService(user);

      // Search documents in Google Drive
      const driveResults = await driveService.searchDocuments(q as string, mainFolderId as string);
      
      // Search data in Google Sheets
      const sheetsResults = await sheetsService.searchAllSheets(spreadsheetId as string, q as string);

      res.json({
        documents: driveResults,
        data: sheetsResults,
        totalResults: driveResults.length + sheetsResults.length
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // Family IDs management (Google Sheets)
  app.get('/api/family-ids', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId } = req.query;

      const sheetsService = new GoogleSheetsService(user);
      const data = await sheetsService.getData(spreadsheetId as string, 'Family_IDs');

      res.json(data);
    } catch (error) {
      console.error('Error fetching family IDs:', error);
      res.status(500).json({ error: 'Failed to fetch family IDs' });
    }
  });

  app.post('/api/family-ids', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId, ...familyIdData } = req.body;

      const sheetsService = new GoogleSheetsService(user);
      const data = [
        familyIdData.idType,
        familyIdData.idNumber,
        familyIdData.expirationDate,
        familyIdData.issuingAuthority,
        familyIdData.familyMember,
        familyIdData.renewalRequirements,
        familyIdData.documentLink
      ];

      await sheetsService.addData(spreadsheetId, 'Family_IDs', data);

      res.json({ success: true, message: 'Family ID added successfully' });
    } catch (error) {
      console.error('Error adding family ID:', error);
      res.status(500).json({ error: 'Failed to add family ID' });
    }
  });

  // Finance accounts management
  app.get('/api/finance', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId } = req.query;

      const sheetsService = new GoogleSheetsService(user);
      const data = await sheetsService.getData(spreadsheetId as string, 'Finance_Accounts');

      res.json(data);
    } catch (error) {
      console.error('Error fetching finance data:', error);
      res.status(500).json({ error: 'Failed to fetch finance data' });
    }
  });

  app.post('/api/finance', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId, ...financeData } = req.body;

      const sheetsService = new GoogleSheetsService(user);
      const data = [
        financeData.accountType,
        financeData.institutionName,
        financeData.accountNumber,
        financeData.routingNumber,
        financeData.currentBalance,
        financeData.interestRate,
        financeData.contactInfo,
        financeData.loginCredentials,
        JSON.stringify(financeData.documentLinks)
      ];

      await sheetsService.addData(spreadsheetId, 'Finance_Accounts', data);

      res.json({ success: true, message: 'Finance account added successfully' });
    } catch (error) {
      console.error('Error adding finance account:', error);
      res.status(500).json({ error: 'Failed to add finance account' });
    }
  });

  // Insurance policies management
  app.get('/api/insurance', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId } = req.query;

      const sheetsService = new GoogleSheetsService(user);
      const data = await sheetsService.getData(spreadsheetId as string, 'Insurance_Policies');

      res.json(data);
    } catch (error) {
      console.error('Error fetching insurance data:', error);
      res.status(500).json({ error: 'Failed to fetch insurance data' });
    }
  });

  app.post('/api/insurance', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId, ...insuranceData } = req.body;

      const sheetsService = new GoogleSheetsService(user);
      const data = [
        insuranceData.policyType,
        insuranceData.insuranceCompany,
        insuranceData.policyNumber,
        insuranceData.coverageAmount,
        insuranceData.deductible,
        insuranceData.premium,
        insuranceData.renewalDate,
        insuranceData.agentContact,
        JSON.stringify(insuranceData.beneficiaries),
        JSON.stringify(insuranceData.documentLinks)
      ];

      await sheetsService.addData(spreadsheetId, 'Insurance_Policies', data);

      res.json({ success: true, message: 'Insurance policy added successfully' });
    } catch (error) {
      console.error('Error adding insurance policy:', error);
      res.status(500).json({ error: 'Failed to add insurance policy' });
    }
  });

  // Password vault management (encrypted)
  app.get('/api/passwords', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId } = req.query;

      const sheetsService = new GoogleSheetsService(user);
      const data = await sheetsService.getData(spreadsheetId as string, 'Passwords_Vault');

      res.json(data);
    } catch (error) {
      console.error('Error fetching passwords:', error);
      res.status(500).json({ error: 'Failed to fetch passwords' });
    }
  });

  app.post('/api/passwords', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId, ...passwordData } = req.body;

      const sheetsService = new GoogleSheetsService(user);
      const data = [
        passwordData.serviceName,
        passwordData.username,
        passwordData.encryptedPassword, // Should be encrypted on client side
        passwordData.url,
        JSON.stringify(passwordData.securityQuestions),
        passwordData.twoFactorSetup,
        new Date().toISOString(),
        passwordData.category,
        JSON.stringify(passwordData.sharedWith)
      ];

      await sheetsService.addData(spreadsheetId, 'Passwords_Vault', data);

      res.json({ success: true, message: 'Password added successfully' });
    } catch (error) {
      console.error('Error adding password:', error);
      res.status(500).json({ error: 'Failed to add password' });
    }
  });

  // Professional access management
  app.get('/api/professional-access', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId } = req.query;

      const sheetsService = new GoogleSheetsService(user);
      const permissions = await sheetsService.getData(spreadsheetId as string, 'Users_Permissions');

      // Filter for professional roles
      const professionals = permissions.filter((row: any[]) => 
        ['advisor', 'attorney', 'tax_preparer'].includes(row[1])
      );

      res.json(professionals);
    } catch (error) {
      console.error('Error fetching professional access:', error);
      res.status(500).json({ error: 'Failed to fetch professional access' });
    }
  });

  app.post('/api/professional-access/invite', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { email, role, permissions, expirationDate } = req.body;

      const gmailService = new GmailService(user);
      
      const invitationBody = `
        <h2>GoVault Access Invitation</h2>
        <p>You have been invited to access the GoVault family information system.</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Access expires:</strong> ${expirationDate}</p>
        <p>Please log in with your Google account to access the authorized information.</p>
      `;

      await gmailService.sendInvitation(
        email,
        'GoVault Access Invitation',
        invitationBody
      );

      res.json({ success: true, message: 'Invitation sent successfully' });
    } catch (error) {
      console.error('Error sending invitation:', error);
      res.status(500).json({ error: 'Failed to send invitation' });
    }
  });

  // Calendar integration for reminders
  app.post('/api/calendar/reminder', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { title, description, date } = req.body;

      const calendarService = new GoogleCalendarService(user);
      const event = await calendarService.createReminder(title, description, date);

      res.json({ success: true, eventId: event.id, message: 'Reminder created successfully' });
    } catch (error) {
      console.error('Error creating reminder:', error);
      res.status(500).json({ error: 'Failed to create reminder' });
    }
  });

  // Audit log
  app.get('/api/audit-log', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId } = req.query;

      const sheetsService = new GoogleSheetsService(user);
      const auditData = await sheetsService.getData(spreadsheetId as string, 'Audit_Log');

      res.json(auditData);
    } catch (error) {
      console.error('Error fetching audit log:', error);
      res.status(500).json({ error: 'Failed to fetch audit log' });
    }
  });

  // Real-time collaboration endpoints
  app.get('/api/collaboration/activity', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId } = req.query;

      const sheetsService = new GoogleSheetsService(user);
      const recentActivity = await sheetsService.getData(spreadsheetId as string, 'Audit_Log');

      // Get recent activity (last 10 entries)
      const recent = recentActivity.slice(-10).reverse();

      res.json(recent);
    } catch (error) {
      console.error('Error fetching collaboration activity:', error);
      res.status(500).json({ error: 'Failed to fetch activity' });
    }
  });

  // Dashboard statistics (computed from Google Sheets data)
  app.get('/api/dashboard/stats', requireAuth, async (req: any, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId } = req.query;

      const sheetsService = new GoogleSheetsService(user);
      
      // Get data from various sheets to compute statistics
      const familyIds = await sheetsService.getData(spreadsheetId as string, 'Family_IDs');
      const finance = await sheetsService.getData(spreadsheetId as string, 'Finance_Accounts');
      const insurance = await sheetsService.getData(spreadsheetId as string, 'Insurance_Policies');
      const reminders = await sheetsService.getData(spreadsheetId as string, 'Reminders_Alerts');

      const stats = {
        totalDocuments: familyIds.length + finance.length + insurance.length,
        activeReminders: reminders.filter((r: any[]) => !r[5]).length, // Not completed
        familyMembers: new Set(familyIds.map((r: any[]) => r[4])).size,
        securityScore: '98%' // This would be computed based on password strength, 2FA, etc.
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}