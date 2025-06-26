import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User management
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  googleId: text("google_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  picture: text("picture"),
  role: text("role").notNull().default("member"), // owner, spouse, child, dependent, advisor, attorney, tax_preparer
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActive: timestamp("last_active").notNull().defaultNow(),
});

// Family/Vault management
export const vaults = pgTable("vaults", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: integer("owner_id").notNull().references(() => users.id),
  googleDriveFolderId: text("google_drive_folder_id").notNull(),
  googleSheetsId: text("google_sheets_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User permissions for vault access
export const userPermissions = pgTable("user_permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  vaultId: integer("vault_id").notNull().references(() => vaults.id),
  permissions: jsonb("permissions").notNull(), // JSON object with category-level permissions
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Document registry (links to Google Drive files)
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  vaultId: integer("vault_id").notNull().references(() => vaults.id),
  googleFileId: text("google_file_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(), // financial, insurance, legal, medical, personal_id, property
  mimeType: text("mime_type").notNull(),
  uploadedBy: integer("uploaded_by").notNull().references(() => users.id),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  metadata: jsonb("metadata"), // Additional document metadata
});

// Activity log
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  vaultId: integer("vault_id").notNull().references(() => vaults.id),
  userId: integer("user_id").notNull().references(() => users.id),
  action: text("action").notNull(), // upload, edit, view, share, delete
  resourceType: text("resource_type").notNull(), // document, data, permission
  resourceId: text("resource_id"),
  details: jsonb("details"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Reminders and alerts
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  vaultId: integer("vault_id").notNull().references(() => vaults.id),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  dueDate: timestamp("due_date").notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastActive: true,
});

export const insertVaultSchema = createInsertSchema(vaults).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Vault = typeof vaults.$inferSelect;
export type InsertVault = z.infer<typeof insertVaultSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type UserPermission = typeof userPermissions.$inferSelect;
export type ActivityLogEntry = typeof activityLog.$inferSelect;
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;

// Dashboard data types
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
