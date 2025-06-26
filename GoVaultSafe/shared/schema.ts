import { z } from "zod";

// Google-Only Architecture - No Database Required
// All data stored in Google Sheets and Google Drive as specified in PRD
// This file only contains Zod schemas for validation, no database schemas

// User data structure (stored in Users_Permissions sheet)
export const userSchema = z.object({
  googleId: z.string(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string().optional(),
  role: z.enum(["owner", "spouse", "child", "dependent", "advisor", "attorney", "tax_preparer"]),
  createdAt: z.string(),
  lastActive: z.string(),
});

// Family IDs data structure (Family_IDs sheet)
export const familyIDSchema = z.object({
  idType: z.string(),
  idNumber: z.string(),
  expirationDate: z.string(),
  issuingAuthority: z.string(),
  familyMember: z.string(),
  renewalRequirements: z.string(),
  documentLink: z.string(),
});

// Finance accounts data structure (Finance_Accounts sheet)
export const financeSchema = z.object({
  accountType: z.string(),
  institutionName: z.string(),
  accountNumber: z.string(),
  routingNumber: z.string(),
  currentBalance: z.number(),
  interestRate: z.number(),
  contactInfo: z.string(),
  loginCredentials: z.string(),
  documentLinks: z.array(z.string()),
});

// Property assets data structure (Property_Assets sheet)
export const propertySchema = z.object({
  propertyType: z.string(),
  description: z.string(),
  purchaseDate: z.string(),
  purchasePrice: z.number(),
  currentValue: z.number(),
  location: z.string(),
  insurancePolicyLinks: z.array(z.string()),
  loanInformation: z.string(),
  documentLinks: z.array(z.string()),
});

// Passwords vault data structure (Passwords_Vault sheet)
export const passwordSchema = z.object({
  serviceName: z.string(),
  username: z.string(),
  encryptedPassword: z.string(),
  url: z.string(),
  securityQuestions: z.array(z.string()),
  twoFactorSetup: z.string(),
  lastUpdated: z.string(),
  category: z.string(),
  sharedWith: z.array(z.string()),
});

// Insurance policies data structure (Insurance_Policies sheet)
export const insuranceSchema = z.object({
  policyType: z.string(),
  insuranceCompany: z.string(),
  policyNumber: z.string(),
  coverageAmount: z.number(),
  deductible: z.number(),
  premium: z.number(),
  renewalDate: z.string(),
  agentContact: z.string(),
  beneficiaries: z.array(z.string()),
  documentLinks: z.array(z.string()),
});

// Tax records data structure (Tax_Records sheet)
export const taxSchema = z.object({
  taxYear: z.number(),
  filingStatus: z.string(),
  preparerInfo: z.string(),
  keyDeductions: z.array(z.string()),
  refundAmount: z.number(),
  importantDates: z.array(z.string()),
  documentLinks: z.array(z.string()),
});

// Legal documents data structure (Legal_Documents sheet)
export const legalSchema = z.object({
  documentType: z.string(),
  partiesInvolved: z.array(z.string()),
  effectiveDate: z.string(),
  expirationDate: z.string(),
  attorneyInfo: z.string(),
  keyTerms: z.string(),
  witnessInfo: z.array(z.string()),
  documentLinks: z.array(z.string()),
});

// Business information data structure (Business_Info sheet)
export const businessSchema = z.object({
  businessName: z.string(),
  businessType: z.string(),
  formationDate: z.string(),
  taxId: z.string(),
  partnersMembers: z.array(z.string()),
  registeredAgent: z.string(),
  annualRequirements: z.array(z.string()),
  insuranceInfo: z.string(),
  documentLinks: z.array(z.string()),
});

// Contacts directory data structure (Contacts_Directory sheet)
export const contactSchema = z.object({
  contactType: z.string(),
  name: z.string(),
  company: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  specialization: z.string(),
  relationshipToFamily: z.string(),
  emergencyContact: z.boolean(),
  preferredContactMethod: z.string(),
});

// Permission matrix structure (Users_Permissions sheet)
export const permissionSchema = z.object({
  userEmail: z.string(),
  role: z.string(),
  familyIdsView: z.boolean(),
  familyIdsEdit: z.boolean(),
  financeView: z.boolean(),
  financeEdit: z.boolean(),
  propertyView: z.boolean(),
  propertyEdit: z.boolean(),
  passwordsView: z.boolean(),
  passwordsEdit: z.boolean(),
  insuranceView: z.boolean(),
  insuranceEdit: z.boolean(),
  taxesView: z.boolean(),
  taxesEdit: z.boolean(),
  legalView: z.boolean(),
  legalEdit: z.boolean(),
  businessView: z.boolean(),
  businessEdit: z.boolean(),
  contactsView: z.boolean(),
  contactsEdit: z.boolean(),
});

// Audit log structure (Audit_Log sheet)
export const auditLogSchema = z.object({
  timestamp: z.string(),
  userEmail: z.string(),
  action: z.string(),
  category: z.string(),
  resourceId: z.string(),
  details: z.string(),
});

// Types
export type User = z.infer<typeof userSchema>;
export type FamilyID = z.infer<typeof familyIDSchema>;
export type Finance = z.infer<typeof financeSchema>;
export type Property = z.infer<typeof propertySchema>;
export type Password = z.infer<typeof passwordSchema>;
export type Insurance = z.infer<typeof insuranceSchema>;
export type Tax = z.infer<typeof taxSchema>;
export type Legal = z.infer<typeof legalSchema>;
export type Business = z.infer<typeof businessSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Permission = z.infer<typeof permissionSchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;

// Dashboard interface types for frontend components
export interface DashboardStats {
  totalDocuments: number;
  documentsGrowth: string;
  activeReminders: number;
  upcomingDeadlines: string;
  familyMembers: number;
  activeUsers: string;
  securityScore: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  document?: string;
  field?: string;
  sharedWith?: string;
  timestamp: string;
  icon: string;
  iconColor: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface CategorySummary {
  name: string;
  itemCount: number;
  documentCount: number;
  lastUpdated: string;
  icon: string;
  iconColor: string;
  route: string;
}
