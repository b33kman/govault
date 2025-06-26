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

### Database Layer
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Schema Location**: `shared/schema.ts` for type sharing between client/server

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

### Database Dependencies
- **PostgreSQL**: Primary database (Neon serverless recommended)
- **Connection Pooling**: Built-in with Drizzle + Neon
- **Environment Variables**: `DATABASE_URL` required for connection

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
- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `NODE_ENV`: Environment setting (development/production)

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- June 26, 2025: Complete GoVAULT implementation with Google-only architecture
  - Successfully integrated existing dashboard UX components with Google-only backend
  - Implemented comprehensive Google Workspace integration:
    * Google OAuth authentication with proper scopes for Drive, Sheets, Gmail, Calendar
    * Google Drive API for document storage with automated folder structure
    * Google Sheets API for structured data management across all categories
    * Gmail API for professional invitations and notifications
    * Google Calendar API for deadline reminders and alerts
  - Built complete server-side Google services architecture:
    * GoogleDriveService for document management and folder organization
    * GoogleSheetsService for data storage across 13 category sheets
    * GmailService for automated email notifications
    * GoogleCalendarService for reminder and deadline management
  - Updated authentication flow to use Google OAuth with required scopes
  - Maintained existing dashboard component architecture while adding Google integration
  - Implemented all 9 PRD categories: Family IDs, Finance, Property, Passwords, Insurance, Taxes, Legal, Business, Contacts
  - Added comprehensive permission matrix system in Google Sheets
  - Created audit logging and real-time collaboration tracking

## Current State

The GoVAULT application is fully implemented with Google-only architecture:
- Complete Google OAuth authentication with required scopes
- Existing dashboard UX components integrated with Google backend services
- Google Drive folder structure for document organization (9 categories)
- Google Sheets database with 13 sheets for structured data management
- Permission matrix system for role-based access control
- Professional access management with email invitations via Gmail API
- Calendar integration for automated reminders and deadline tracking
- Comprehensive audit logging and real-time collaboration features
- All PRD requirements implemented using Google Workspace exclusively
- Ready for deployment with Google API credentials

## Changelog

- June 26, 2025: Initial project setup and dashboard implementation