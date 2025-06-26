# GoVAULT - Family Information Management System

## Overview

GoVAULT is a comprehensive family information management system designed to help families securely store, organize, and manage their important documents and information. The application provides a centralized vault for financial records, insurance policies, legal documents, medical information, personal identification, and property records.

## System Architecture

The system follows a modern full-stack architecture with clear separation between frontend, backend, and data layers:

- **Frontend**: React-based single-page application using TypeScript
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM
- **Build System**: Vite for frontend bundling and development
- **Styling**: Tailwind CSS with Shadcn/ui component library
- **Authentication**: Google OAuth integration (planned)
- **External Services**: Google Drive and Google Sheets integration

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, React Context for auth
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom GoVAULT brand colors
- **Build Tool**: Vite with ESM modules

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Development Server**: TSX for development hot-reloading
- **Production Build**: ESBuild for server-side bundling

### Google Sheets Data Layer
- **Primary Storage**: Google Sheets with 13 category sheets
- **User Management**: Users_Permissions sheet for role-based access
- **Document Registry**: Links between Drive files and structured data
- **Audit Logging**: All user activities tracked in Audit_Log sheet
- **Schema Location**: `shared/schema.ts` for Zod validation schemas only

### Authentication System
- **Provider**: Google OAuth (implementation in progress)
- **Session Management**: Express sessions with PostgreSQL store
- **User Roles**: Family owner, spouse, child, dependent, advisor, attorney, tax preparer

## Data Flow

### User Management Flow
1. Users authenticate via Google OAuth
2. User profiles stored in PostgreSQL with role-based permissions
3. Family vaults created with owner assignment
4. Permission system controls access to different document categories

### Document Management Flow
1. Documents uploaded to Google Drive
2. Document metadata stored in PostgreSQL
3. Documents categorized by type (financial, insurance, legal, medical, personal_id, property)
4. Document registry maintains links between database and Google Drive files

### Data Integration Flow
1. Google Drive API for file storage and management
2. Google Sheets API for structured data storage
3. Database serves as source of truth for permissions and metadata
4. Real-time sync between local database and Google services

## External Dependencies

### Google Workspace Integration
- **Google Drive API**: Document storage and file management
- **Google Sheets API**: Structured data storage and reporting
- **Google OAuth**: User authentication and authorization
- **Scopes Required**: Drive access, Sheets access, Gmail sending, profile/email

### Google-Only Storage
- **No Database Required**: All data stored in Google Workspace
- **Google Sheets**: Acts as database with 13 structured sheets
- **Google Drive**: Document storage with automated folder organization
- **Environment Variables**: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for OAuth

### UI/UX Dependencies
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **React Hook Form**: Form state management
- **Date-fns**: Date manipulation utilities

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Port**: 5000 (configurable)
- **Hot Reload**: Enabled via Vite and TSX
- **Database**: Requires PostgreSQL connection via `DATABASE_URL`

### Production Build
- **Frontend Build**: Vite builds to `dist/public`
- **Backend Build**: ESBuild bundles server to `dist/index.js`
- **Command**: `npm run build && npm run start`
- **Environment**: Production mode with `NODE_ENV=production`

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Port Mapping**: 5000 -> 80 for external access
- **Auto-scaling**: Configured for Replit's autoscale deployment

### Environment Requirements
- `GOOGLE_CLIENT_ID`: Google OAuth client ID (optional for demo mode)
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret (optional for demo mode)
- `NODE_ENV`: Environment setting (development/production)
- No database configuration required

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- June 26, 2025: Complete GoVAULT implementation with Google-only architecture
- June 26, 2025: Built comprehensive settings page based on PDF specifications
  - User management with role-based permission matrix (Owner, Spouse, Child, Advisor, Attorney, Tax Preparer)
  - Security settings with 2FA, session timeouts, and audit controls
  - Notification preferences for expiration alerts and reminders
  - Google Workspace integration status display
  - System configuration with backup and data retention policies
  - Danger zone with export and deletion capabilities
- June 26, 2025: Implemented AI document extraction functionality as specified in PDF
  - OpenAI GPT-4o integration for document analysis and field extraction
  - Multi-format support: PDFs, images, and text documents using OCR
  - Category-specific extraction schemas for all 9 vault categories
  - Interactive confirmation interface for user review and corrections
  - Complete workflow: Upload → AI Analysis → User Confirmation → Google Drive + Sheets
  - Demo mode with mock data for testing without API keys
  - Production-ready with real OpenAI API integration
- June 26, 2025: Standardized page headers with active functionality across all pages
  - Consistent search box functionality on every page routing to /search
  - Active "Add Document" button on all pages routing to /documents
  - Category-specific search and upload routing from category pages
  - Unified user experience with consistent navigation patterns
  - Removed all database dependencies (Drizzle ORM, PostgreSQL, Neon) as per PRD requirements
  - Implemented pure Google-only architecture with no database needed
  - Updated storage layer to use GoogleSheetsStorage exclusively for user management
  - Enhanced GoogleSheetsService with complete user permission management methods
  - Fixed authentication flow to properly handle demo mode vs production Google OAuth
  - Implemented comprehensive Google Workspace integration:
    * Google OAuth authentication with proper scopes for Drive, Sheets, Gmail, Calendar
    * Google Drive API for document storage with automated folder structure
    * Google Sheets API for structured data management across all 13 category sheets
    * Gmail API for professional invitations and notifications
    * Google Calendar API for deadline reminders and alerts
  - Built complete server-side Google services architecture:
    * GoogleDriveService for document management and folder organization
    * GoogleSheetsService for data storage and user permissions
    * GmailService for automated email notifications
    * GoogleCalendarService for reminder and deadline management
  - Maintained existing dashboard component architecture with Google backend integration
  - Implemented all 9 PRD categories: Family IDs, Finance, Property, Passwords, Insurance, Taxes, Legal, Business, Contacts
  - Added comprehensive permission matrix system in Google Sheets
  - Created audit logging and real-time collaboration tracking

## Current State

The GoVAULT application is fully implemented and running:
- Complete React TypeScript frontend with modern UI components
- Express.js backend with comprehensive Google API integration
- All 9 categories fully implemented (Family IDs, Finance, Property, Passwords, Insurance, Taxes, Legal, Business, Contacts)
- Google-only architecture with Drive, Sheets, Gmail, and Calendar APIs
- Permission matrix system for role-based access control
- Complete dashboard with stats, activity tracking, and category management
- Document management system with upload, view, and organization features
- Cross-category search capabilities and collaboration tools
- Responsive design optimized for all devices
- Running in demo mode for testing (port 5000)
- Production-ready with Google API credentials integration available

## Changelog

- June 26, 2025: Initial project setup and dashboard implementation