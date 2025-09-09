import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  version: text("version").notNull().default("1.0.0"),
  description: text("description"),
  author: text("author").notNull(),
  startDate: text("start_date"),
  expectedCompletion: text("expected_completion"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  status: text("status").notNull().default("draft"), // draft, active, review, completed
});

export const stakeholders = pgTable("stakeholders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  type: text("type").notNull(), // primary, secondary, reviewer
  avatar: text("avatar"),
});

export const milestones = pgTable("milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull(), // completed, in-progress, pending
});

export const projectRequirements = pgTable("project_requirements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  // What We Need tab
  userExperienceGoals: text("user_experience_goals"),
  scopeIncluded: text("scope_included").array(),
  scopeExcluded: text("scope_excluded").array(),
  assumptions: text("assumptions").array(),
  dependencies: text("dependencies").array(),
  dataIntegrationNeeds: text("data_integration_needs"),
  externalServices: text("external_services").array(),
  // Success Criteria
  successMetrics: text("success_metrics").array(),
  userTestingPlans: text("user_testing_plans"),
  dataQualityRules: text("data_quality_rules").array(),
  performanceRequirements: text("performance_requirements").array(),
  securityRequirements: text("security_requirements").array(),
});

export const dataFields = pgTable("data_fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  name: text("name").notNull(),
  displayLabel: text("display_label").notNull(),
  uiControlType: text("ui_control_type").notNull(), // input, textarea, select, checkbox, etc.
  dataType: text("data_type").notNull(), // string, number, boolean, date, etc.
  placeholder: text("placeholder"),
  defaultValue: text("default_value"),
  maxLength: integer("max_length"),
  required: boolean("required").default(false),
  validationRules: text("validation_rules").array(),
  order: integer("order").default(0),
});

export const features = pgTable("features", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull(), // high, medium, low
  type: text("type").notNull(), // functional, non-functional
  specifications: text("specifications"),
  order: integer("order").default(0),
});

export const projectVersions = pgTable("project_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  version: text("version").notNull(),
  changes: text("changes").array(),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: text("created_by").notNull(),
});

export const activityLog = pgTable("activity_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  action: text("action").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  userId: text("user_id").notNull(),
});

// Insert schemas
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStakeholderSchema = createInsertSchema(stakeholders).omit({
  id: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
});

export const insertProjectRequirementsSchema = createInsertSchema(projectRequirements).omit({
  id: true,
});

export const insertDataFieldSchema = createInsertSchema(dataFields).omit({
  id: true,
});

export const insertFeatureSchema = createInsertSchema(features).omit({
  id: true,
});

export const insertProjectVersionSchema = createInsertSchema(projectVersions).omit({
  id: true,
  createdAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLog).omit({
  id: true,
  createdAt: true,
});

// Types
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Stakeholder = typeof stakeholders.$inferSelect;
export type InsertStakeholder = z.infer<typeof insertStakeholderSchema>;
export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type ProjectRequirements = typeof projectRequirements.$inferSelect;
export type InsertProjectRequirements = z.infer<typeof insertProjectRequirementsSchema>;
export type DataField = typeof dataFields.$inferSelect;
export type InsertDataField = z.infer<typeof insertDataFieldSchema>;
export type Feature = typeof features.$inferSelect;
export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type ProjectVersion = typeof projectVersions.$inferSelect;
export type InsertProjectVersion = z.infer<typeof insertProjectVersionSchema>;
export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
