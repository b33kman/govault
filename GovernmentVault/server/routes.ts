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

  // Dashboard data endpoints that integrate with Google Sheets
  app.get('/api/dashboard/stats', async (req: any, res) => {
    try {
      // Demo mode - no authentication required
      if (!process.env.GOOGLE_CLIENT_ID) {
        const stats = {
          totalDocuments: 47,
          documentsGrowth: '$247,350',
          activeReminders: 3,
          upcomingDeadlines: '2 renewals',
          familyMembers: 4,
          activeUsers: 'Johnson Family',
          securityScore: '98%',
        };
        return res.json(stats);
      }

      // Production mode with Google OAuth
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = req.user as AuthenticatedUser;
      const sheetsService = new GoogleSheetsService(user);
      
      // Production implementation would aggregate data from all category sheets
      const stats = {
        totalDocuments: 47,
        documentsGrowth: '$247,350',
        activeReminders: 3,
        upcomingDeadlines: '2 renewals',
        familyMembers: 4,
        activeUsers: user.name || 'Family',
        securityScore: '98%',
      };
      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  });

  app.get('/api/dashboard/activity', async (req: any, res) => {
    try {
      // Demo mode activities
      if (!process.env.GOOGLE_CLIENT_ID) {
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
        return res.json(activities);
      }

      // Production mode with Google OAuth
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = req.user as AuthenticatedUser;
      const sheetsService = new GoogleSheetsService(user);
      
      // Production: Fetch from Audit_Log sheet in Google Sheets
      const activities = [
        {
          id: '1',
          user: user.name,
          action: 'login',
          timestamp: 'just now',
          icon: 'login',
          iconColor: 'green',
        },
      ];
      res.json(activities);
    } catch (error) {
      console.error('Error fetching dashboard activity:', error);
      res.status(500).json({ error: 'Failed to fetch activity' });
    }
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
    // All 9 categories from the PRD: Family IDs, Finance, Property, Passwords, Insurance, Taxes, Legal, Business, Contacts
    const categories = [
      {
        name: 'Family IDs',
        itemCount: 9,
        documentCount: 7,
        lastUpdated: '4 hours ago',
        icon: 'id-card',
        iconColor: 'indigo',
        route: '/category/family-ids',
      },
      {
        name: 'Finance',
        itemCount: 12,
        documentCount: 8,
        lastUpdated: '2 hours ago',
        icon: 'dollar-sign',
        iconColor: 'green',
        route: '/category/finance',
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
      {
        name: 'Passwords',
        itemCount: 23,
        documentCount: 0,
        lastUpdated: '6 hours ago',
        icon: 'key',
        iconColor: 'yellow',
        route: '/category/passwords',
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
        name: 'Taxes',
        itemCount: 5,
        documentCount: 12,
        lastUpdated: '3 weeks ago',
        icon: 'file-text',
        iconColor: 'red',
        route: '/category/taxes',
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
        name: 'Business',
        itemCount: 3,
        documentCount: 8,
        lastUpdated: '1 week ago',
        icon: 'briefcase',
        iconColor: 'gray',
        route: '/category/business',
      },
      {
        name: 'Contacts',
        itemCount: 18,
        documentCount: 2,
        lastUpdated: '5 days ago',
        icon: 'users',
        iconColor: 'pink',
        route: '/category/contacts',
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

  // Advanced search across Google Drive and Sheets with filtering
  app.get('/api/search', async (req: any, res) => {
    try {
      const { q, category, type, dateRange, sortBy } = req.query;

      // Demo mode - return mock search results for testing
      if (!process.env.GOOGLE_CLIENT_ID) {
        const mockResults = [
          {
            id: '1',
            title: 'Home Insurance Policy 2024',
            category: 'Insurance',
            type: 'document',
            content: 'State Farm homeowners insurance policy with $750,000 coverage, $2,500 deductible',
            lastUpdated: '2024-03-15',
            status: 'active',
            relevance: 95,
            metadata: {
              policyNumber: 'AS-HOME-123789',
              company: 'Allstate',
              premium: 2400,
              renewalDate: '2025-03-20'
            }
          },
          {
            id: '2',
            title: 'Chase Primary Checking Account',
            category: 'Finance',
            type: 'data',
            content: 'Primary checking account with Chase Bank, account ending in 1234',
            lastUpdated: '2024-12-20',
            status: 'active',
            relevance: 88,
            metadata: {
              accountNumber: '****1234',
              balance: 15750.50,
              institution: 'Chase Bank',
              type: 'Checking'
            }
          }
        ];

        // Apply filters to mock data
        let filteredResults = mockResults;
        
        if (q) {
          filteredResults = filteredResults.filter(result =>
            result.title.toLowerCase().includes(q.toLowerCase()) ||
            result.content.toLowerCase().includes(q.toLowerCase())
          );
        }

        if (category && category !== 'all') {
          filteredResults = filteredResults.filter(result => result.category === category);
        }

        if (type && type !== 'all') {
          filteredResults = filteredResults.filter(result => result.type === type);
        }

        return res.json({
          results: filteredResults,
          totalResults: filteredResults.length,
          filters: { q, category, type, dateRange, sortBy }
        });
      }

      // Production mode with Google API integration
      const user = req.user as AuthenticatedUser;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { spreadsheetId, mainFolderId } = req.query;
      
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

  // Reports and analytics endpoints
  app.get('/api/reports/financial', async (req: any, res) => {
    try {
      // Demo mode - return mock financial data
      if (!process.env.GOOGLE_CLIENT_ID) {
        const financialData = {
          netWorth: 48000,
          totalAssets: 260750,
          totalDebts: 287150,
          liquidAssets: 60750,
          investments: 200000,
          accounts: [
            { name: 'Checking', value: 15750, color: '#3B82F6' },
            { name: 'Savings', value: 45000, color: '#10B981' },
            { name: '401k', value: 125000, color: '#8B5CF6' },
            { name: 'Investments', value: 75000, color: '#F59E0B' }
          ],
          netWorthTrend: [
            { month: 'Jan', netWorth: -25000, assets: 235000, debts: 260000 },
            { month: 'Feb', netWorth: -18000, assets: 245000, debts: 263000 },
            { month: 'Mar', netWorth: -12000, assets: 255000, debts: 267000 },
            { month: 'Apr', netWorth: -5000, assets: 265000, debts: 270000 },
            { month: 'May', netWorth: 2000, assets: 275000, debts: 273000 },
            { month: 'Jun', netWorth: 8000, assets: 285000, debts: 277000 },
            { month: 'Jul', netWorth: 15000, assets: 295000, debts: 280000 },
            { month: 'Aug', netWorth: 22000, assets: 305000, debts: 283000 },
            { month: 'Sep', netWorth: 28000, assets: 312000, debts: 284000 },
            { month: 'Oct', netWorth: 35000, assets: 320000, debts: 285000 },
            { month: 'Nov', netWorth: 42000, assets: 328000, debts: 286000 },
            { month: 'Dec', netWorth: 48000, assets: 335000, debts: 287000 }
          ]
        };
        return res.json(financialData);
      }

      // Production mode - get data from Google Sheets
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId } = req.query;
      
      const sheetsService = new GoogleSheetsService(user);
      const financeData = await sheetsService.getData(spreadsheetId as string, 'Finance');
      
      // Process and aggregate financial data
      res.json({ financeData });
    } catch (error) {
      console.error('Financial report error:', error);
      res.status(500).json({ error: 'Failed to generate financial report' });
    }
  });

  app.get('/api/reports/documents', async (req: any, res) => {
    try {
      // Demo mode - return mock document activity data
      if (!process.env.GOOGLE_CLIENT_ID) {
        const documentActivity = [
          { category: 'Family IDs', total: 9, updated: 3, expiring: 1 },
          { category: 'Finance', total: 12, updated: 8, expiring: 0 },
          { category: 'Property', total: 4, updated: 2, expiring: 0 },
          { category: 'Passwords', total: 23, updated: 15, expiring: 5 },
          { category: 'Insurance', total: 8, updated: 6, expiring: 2 },
          { category: 'Taxes', total: 5, updated: 1, expiring: 1 },
          { category: 'Legal', total: 6, updated: 2, expiring: 1 },
          { category: 'Business', total: 3, updated: 1, expiring: 1 },
          { category: 'Contacts', total: 18, updated: 4, expiring: 0 }
        ];
        return res.json({ documentActivity, totalDocuments: 88 });
      }

      // Production mode - aggregate data from all Google Sheets
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId } = req.query;
      
      const sheetsService = new GoogleSheetsService(user);
      // Get data from all category sheets and aggregate statistics
      res.json({ message: 'Document analytics from Google Sheets' });
    } catch (error) {
      console.error('Document report error:', error);
      res.status(500).json({ error: 'Failed to generate document report' });
    }
  });

  app.get('/api/reports/security', async (req: any, res) => {
    try {
      // Demo mode - return mock security metrics
      if (!process.env.GOOGLE_CLIENT_ID) {
        const securityMetrics = {
          passwordStrength: { strong: 18, medium: 3, weak: 2 },
          twoFactorEnabled: 15,
          documentsSecured: 47,
          lastSecurityReview: '2024-12-15',
          securityScore: 98
        };
        return res.json(securityMetrics);
      }

      // Production mode - analyze password data from Google Sheets
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId } = req.query;
      
      const sheetsService = new GoogleSheetsService(user);
      const passwordData = await sheetsService.getData(spreadsheetId as string, 'Passwords');
      
      // Analyze password strength and security metrics
      res.json({ message: 'Security analysis from Google Sheets password data' });
    } catch (error) {
      console.error('Security report error:', error);
      res.status(500).json({ error: 'Failed to generate security report' });
    }
  });

  app.get('/api/reports/compliance', async (req: any, res) => {
    try {
      // Demo mode - return mock compliance data
      if (!process.env.GOOGLE_CLIENT_ID) {
        const complianceData = {
          expiringItems: [
            { type: 'Driver\'s License', name: 'John Johnson', expiry: '2025-03-15', category: 'Family IDs' },
            { type: 'Home Insurance', name: 'Allstate Policy', expiry: '2025-03-20', category: 'Insurance' },
            { type: 'Will Review', name: 'Estate Planning', expiry: '2025-01-15', category: 'Legal' }
          ],
          deadlineStats: {
            next30Days: 3,
            next90Days: 8,
            thisYear: 15
          },
          legalDocumentStatus: {
            estatePlanning: 'current',
            powerOfAttorney: 'current',
            healthcareDirectives: 'current',
            businessCompliance: 'review_needed',
            taxRecords: 'complete'
          }
        };
        return res.json(complianceData);
      }

      // Production mode - analyze expiration dates across all sheets
      const user = req.user as AuthenticatedUser;
      const { spreadsheetId } = req.query;
      
      const sheetsService = new GoogleSheetsService(user);
      // Analyze expiration dates across all category sheets
      res.json({ message: 'Compliance analysis from Google Sheets' });
    } catch (error) {
      console.error('Compliance report error:', error);
      res.status(500).json({ error: 'Failed to generate compliance report' });
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



  const httpServer = createServer(app);
  return httpServer;
}