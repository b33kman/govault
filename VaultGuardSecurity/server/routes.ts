import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { DashboardStats, ActivityItem, ReminderItem, CategorySummary } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.get('/api/auth/google', (req, res) => {
    // Redirect to Google OAuth - this will be implemented with actual Google OAuth
    res.status(501).json({ message: 'Google OAuth not implemented yet' });
  });

  app.get('/api/auth/me', (req, res) => {
    // Mock user for development - replace with actual session management
    res.json({
      id: 1,
      googleId: 'mock-google-id',
      email: 'john.doe@example.com',
      name: 'John Doe',
      picture: null,
      role: 'Family Owner',
      createdAt: new Date(),
      lastActive: new Date(),
    });
  });

  app.post('/api/auth/logout', (req, res) => {
    // Clear session
    res.json({ success: true });
  });

  // Dashboard data routes
  app.get('/api/dashboard/stats', (req, res) => {
    const stats: DashboardStats = {
      totalDocuments: 183250,
      documentsGrowth: '$183,250',
      activeReminders: 3,
      upcomingDeadlines: '2 renewals',
      familyMembers: 3,
      activeUsers: 'Johnson Family',
      securityScore: '98%',
    };
    res.json(stats);
  });

  app.get('/api/dashboard/activity', (req, res) => {
    const activities: ActivityItem[] = [
      {
        id: '1',
        user: 'Jane Doe',
        action: 'upload',
        document: 'Home Insurance Policy 2024',
        timestamp: '2 hours ago',
        icon: 'upload',
        iconColor: 'blue',
      },
      {
        id: '2',
        user: 'John Doe',
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

  app.get('/api/dashboard/reminders', (req, res) => {
    const reminders: ReminderItem[] = [
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

  app.get('/api/dashboard/categories', (req, res) => {
    const categories: CategorySummary[] = [
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

  app.get('/api/notifications/count', (req, res) => {
    res.json({ count: 3 });
  });

  // Advanced Search API - Unified Google Drive and Sheets search
  app.get('/api/search', (req, res) => {
    const { q, type = 'all', category = 'all' } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    const searchResults = [
      {
        id: '1',
        title: 'Home Insurance Policy 2024',
        type: 'document',
        category: 'Insurance',
        lastModified: '2 hours ago',
        source: 'drive',
        snippet: 'State Farm homeowners insurance policy with $500,000 coverage...',
        relevance: 95
      },
      {
        id: '2',
        title: 'Bank Account Details - Chase Checking',
        type: 'data',
        category: 'Financial',
        lastModified: '1 day ago',
        source: 'sheets',
        snippet: 'Account #: ***1234, Routing: 021000021, Balance: $15,750',
        relevance: 88
      },
      {
        id: '3',
        title: 'Dr. Sarah Johnson Contact Info',
        type: 'person',
        category: 'Medical',
        lastModified: '3 days ago',
        source: 'sheets',
        snippet: 'Family physician, (555) 123-4567, emergency contact',
        relevance: 82
      }
    ].filter(result => {
      const queryStr = typeof q === 'string' ? q : '';
      const typeStr = typeof type === 'string' ? type : 'all';
      const categoryStr = typeof category === 'string' ? category : 'all';
      
      const queryMatch = result.title.toLowerCase().includes(queryStr.toLowerCase()) ||
                         result.snippet.toLowerCase().includes(queryStr.toLowerCase());
      const typeMatch = typeStr === 'all' || result.type === typeStr;
      const categoryMatch = categoryStr === 'all' || result.category.toLowerCase() === categoryStr.toLowerCase();
      
      return queryMatch && typeMatch && categoryMatch;
    });

    res.json(searchResults);
  });

  // Document Upload API - Google Drive integration
  app.post('/api/documents/upload', (req, res) => {
    // In production, this would integrate with Google Drive API
    const mockGoogleFileId = 'drive_' + Math.random().toString(36).substr(2, 9);
    
    // Simulate processing time
    setTimeout(() => {
      res.json({
        success: true,
        googleFileId: mockGoogleFileId,
        message: 'Document uploaded to Google Drive successfully'
      });
    }, 1000);
  });

  // Google Calendar Integration - Reminders and Events
  app.get('/api/calendar/events', (req, res) => {
    const events = [
      {
        id: '1',
        title: 'Car Insurance Renewal',
        date: '2025-01-30',
        type: 'reminder',
        category: 'Insurance',
        priority: 'high'
      },
      {
        id: '2', 
        title: 'Tax Document Deadline',
        date: '2025-04-15',
        type: 'deadline',
        category: 'Legal',
        priority: 'high'
      },
      {
        id: '3',
        title: 'Annual Physical Checkup',
        date: '2025-03-10',
        type: 'appointment',
        category: 'Medical',
        priority: 'medium'
      }
    ];
    
    res.json(events);
  });

  // Professional Access Management
  app.get('/api/professional-access', (req, res) => {
    const professionals = [
      {
        id: '1',
        name: 'Sarah Johnson CPA',
        email: 'sarah@johnsoncpa.com',
        role: 'Tax Preparer',
        accessLevel: 'financial-readonly',
        expiresAt: '2025-04-30',
        isActive: true,
        lastAccess: '2025-01-15'
      },
      {
        id: '2',
        name: 'Michael Brown Attorney',
        email: 'mbrown@brownlaw.com', 
        role: 'Attorney',
        accessLevel: 'legal-full',
        expiresAt: '2025-12-31',
        isActive: true,
        lastAccess: '2025-01-10'
      }
    ];
    
    res.json(professionals);
  });

  // Real-time Collaboration API
  app.get('/api/collaboration/activity', (req, res) => {
    const activities = [
      {
        id: '1',
        user: { name: 'Jane Doe', email: 'jane@family.com', role: 'Spouse' },
        action: 'editing',
        resource: 'Insurance Policies Sheet',
        resourceType: 'sheet',
        timestamp: new Date(Date.now() - 30000),
        isActive: true
      },
      {
        id: '2',
        user: { name: 'John Doe', email: 'john@family.com', role: 'Owner' },
        action: 'viewing',
        resource: 'Tax Documents 2024',
        resourceType: 'document',
        timestamp: new Date(Date.now() - 120000),
        isActive: true
      }
    ];
    
    res.json(activities);
  });

  app.get('/api/collaboration/online-users', (req, res) => {
    const onlineUsers = [
      {
        email: 'jane@family.com',
        name: 'Jane Doe',
        role: 'Spouse',
        currentResource: 'Insurance Policies Sheet',
        lastSeen: new Date()
      },
      {
        email: 'john@family.com',
        name: 'John Doe', 
        role: 'Owner',
        currentResource: 'Tax Documents 2024',
        lastSeen: new Date(Date.now() - 60000)
      }
    ];
    
    res.json(onlineUsers);
  });

  const httpServer = createServer(app);
  return httpServer;
}
