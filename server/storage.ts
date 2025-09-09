import { 
  type Project, 
  type InsertProject,
  type Stakeholder,
  type InsertStakeholder,
  type Milestone,
  type InsertMilestone,
  type ProjectRequirements,
  type InsertProjectRequirements,
  type DataField,
  type InsertDataField,
  type Feature,
  type InsertFeature,
  type ProjectVersion,
  type InsertProjectVersion,
  type ActivityLog,
  type InsertActivityLog
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Projects
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: string): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Stakeholders
  createStakeholder(stakeholder: InsertStakeholder): Promise<Stakeholder>;
  getStakeholdersByProject(projectId: string): Promise<Stakeholder[]>;
  updateStakeholder(id: string, stakeholder: Partial<InsertStakeholder>): Promise<Stakeholder | undefined>;
  deleteStakeholder(id: string): Promise<boolean>;

  // Milestones
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  getMilestonesByProject(projectId: string): Promise<Milestone[]>;
  updateMilestone(id: string, milestone: Partial<InsertMilestone>): Promise<Milestone | undefined>;
  deleteMilestone(id: string): Promise<boolean>;

  // Project Requirements
  createOrUpdateProjectRequirements(requirements: InsertProjectRequirements): Promise<ProjectRequirements>;
  getProjectRequirements(projectId: string): Promise<ProjectRequirements | undefined>;

  // Data Fields
  createDataField(field: InsertDataField): Promise<DataField>;
  getDataFieldsByProject(projectId: string): Promise<DataField[]>;
  updateDataField(id: string, field: Partial<InsertDataField>): Promise<DataField | undefined>;
  deleteDataField(id: string): Promise<boolean>;
  reorderDataFields(projectId: string, fieldIds: string[]): Promise<boolean>;

  // Features
  createFeature(feature: InsertFeature): Promise<Feature>;
  getFeaturesByProject(projectId: string): Promise<Feature[]>;
  updateFeature(id: string, feature: Partial<InsertFeature>): Promise<Feature | undefined>;
  deleteFeature(id: string): Promise<boolean>;
  reorderFeatures(projectId: string, featureIds: string[]): Promise<boolean>;

  // Version Control
  createProjectVersion(version: InsertProjectVersion): Promise<ProjectVersion>;
  getProjectVersions(projectId: string): Promise<ProjectVersion[]>;

  // Activity Log
  logActivity(activity: InsertActivityLog): Promise<ActivityLog>;
  getActivityByProject(projectId: string, limit?: number): Promise<ActivityLog[]>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project> = new Map();
  private stakeholders: Map<string, Stakeholder> = new Map();
  private milestones: Map<string, Milestone> = new Map();
  private projectRequirements: Map<string, ProjectRequirements> = new Map();
  private dataFields: Map<string, DataField> = new Map();
  private features: Map<string, Feature> = new Map();
  private projectVersions: Map<string, ProjectVersion> = new Map();
  private activityLogs: Map<string, ActivityLog> = new Map();

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleProject: Project = {
      id: "sample-project-1",
      title: "E-Commerce Platform",
      version: "2.1.0",
      description: "A comprehensive e-commerce platform designed to provide seamless online shopping experiences for both customers and administrators.",
      author: "John Smith",
      startDate: "2024-02-01",
      expectedCompletion: "2024-08-15",
      status: "active",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date()
    };
    
    this.projects.set(sampleProject.id, sampleProject);

    // Sample stakeholders
    const stakeholders = [
      { id: "stakeholder-1", projectId: sampleProject.id, name: "Sarah Johnson", role: "Product Owner", type: "primary", avatar: null },
      { id: "stakeholder-2", projectId: sampleProject.id, name: "Michael Chen", role: "Technical Lead", type: "secondary", avatar: null },
      { id: "stakeholder-3", projectId: sampleProject.id, name: "Emily Rodriguez", role: "Business Analyst", type: "reviewer", avatar: null }
    ];
    
    stakeholders.forEach(s => this.stakeholders.set(s.id, s));

    // Sample milestones
    const milestones = [
      { id: "milestone-1", projectId: sampleProject.id, title: "Requirements Gathering Complete", date: "2024-03-15", status: "completed" },
      { id: "milestone-2", projectId: sampleProject.id, title: "Design Phase Complete", date: "2024-04-30", status: "in-progress" },
      { id: "milestone-3", projectId: sampleProject.id, title: "Development Complete", date: "2024-07-15", status: "pending" }
    ];
    
    milestones.forEach(m => this.milestones.set(m.id, m));
  }

  // Projects
  async createProject(project: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const newProject: Project = { 
      ...project, 
      id, 
      version: project.version || "1.0.0",
      description: project.description || null,
      status: project.status || "draft",
      startDate: project.startDate || null,
      expectedCompletion: project.expectedCompletion || null,
      createdAt: now, 
      updatedAt: now 
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;
    
    const updated: Project = { ...existing, ...project, updatedAt: new Date() };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Stakeholders
  async createStakeholder(stakeholder: InsertStakeholder): Promise<Stakeholder> {
    const id = randomUUID();
    const newStakeholder: Stakeholder = { 
      ...stakeholder, 
      id,
      avatar: stakeholder.avatar || null
    };
    this.stakeholders.set(id, newStakeholder);
    return newStakeholder;
  }

  async getStakeholdersByProject(projectId: string): Promise<Stakeholder[]> {
    return Array.from(this.stakeholders.values()).filter(s => s.projectId === projectId);
  }

  async updateStakeholder(id: string, stakeholder: Partial<InsertStakeholder>): Promise<Stakeholder | undefined> {
    const existing = this.stakeholders.get(id);
    if (!existing) return undefined;
    
    const updated: Stakeholder = { ...existing, ...stakeholder };
    this.stakeholders.set(id, updated);
    return updated;
  }

  async deleteStakeholder(id: string): Promise<boolean> {
    return this.stakeholders.delete(id);
  }

  // Milestones
  async createMilestone(milestone: InsertMilestone): Promise<Milestone> {
    const id = randomUUID();
    const newMilestone: Milestone = { ...milestone, id };
    this.milestones.set(id, newMilestone);
    return newMilestone;
  }

  async getMilestonesByProject(projectId: string): Promise<Milestone[]> {
    return Array.from(this.milestones.values()).filter(m => m.projectId === projectId);
  }

  async updateMilestone(id: string, milestone: Partial<InsertMilestone>): Promise<Milestone | undefined> {
    const existing = this.milestones.get(id);
    if (!existing) return undefined;
    
    const updated: Milestone = { ...existing, ...milestone };
    this.milestones.set(id, updated);
    return updated;
  }

  async deleteMilestone(id: string): Promise<boolean> {
    return this.milestones.delete(id);
  }

  // Project Requirements
  async createOrUpdateProjectRequirements(requirements: InsertProjectRequirements): Promise<ProjectRequirements> {
    const existing = Array.from(this.projectRequirements.values()).find(r => r.projectId === requirements.projectId);
    
    if (existing) {
      const updated: ProjectRequirements = { ...existing, ...requirements };
      this.projectRequirements.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newRequirements: ProjectRequirements = { 
        ...requirements, 
        id,
        userExperienceGoals: requirements.userExperienceGoals || null,
        scopeIncluded: requirements.scopeIncluded || null,
        scopeExcluded: requirements.scopeExcluded || null,
        assumptions: requirements.assumptions || null,
        dependencies: requirements.dependencies || null,
        dataIntegrationNeeds: requirements.dataIntegrationNeeds || null,
        externalServices: requirements.externalServices || null,
        successMetrics: requirements.successMetrics || null,
        userTestingPlans: requirements.userTestingPlans || null,
        dataQualityRules: requirements.dataQualityRules || null,
        performanceRequirements: requirements.performanceRequirements || null,
        securityRequirements: requirements.securityRequirements || null
      };
      this.projectRequirements.set(id, newRequirements);
      return newRequirements;
    }
  }

  async getProjectRequirements(projectId: string): Promise<ProjectRequirements | undefined> {
    return Array.from(this.projectRequirements.values()).find(r => r.projectId === projectId);
  }

  // Data Fields
  async createDataField(field: InsertDataField): Promise<DataField> {
    const id = randomUUID();
    const existingFields = await this.getDataFieldsByProject(field.projectId);
    const order = field.order ?? existingFields.length;
    const newField: DataField = { 
      ...field, 
      id, 
      order,
      placeholder: field.placeholder || null,
      defaultValue: field.defaultValue || null,
      maxLength: field.maxLength || null,
      required: field.required || false,
      validationRules: field.validationRules || null
    };
    this.dataFields.set(id, newField);
    return newField;
  }

  async getDataFieldsByProject(projectId: string): Promise<DataField[]> {
    return Array.from(this.dataFields.values())
      .filter(f => f.projectId === projectId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async updateDataField(id: string, field: Partial<InsertDataField>): Promise<DataField | undefined> {
    const existing = this.dataFields.get(id);
    if (!existing) return undefined;
    
    const updated: DataField = { ...existing, ...field };
    this.dataFields.set(id, updated);
    return updated;
  }

  async deleteDataField(id: string): Promise<boolean> {
    return this.dataFields.delete(id);
  }

  async reorderDataFields(projectId: string, fieldIds: string[]): Promise<boolean> {
    fieldIds.forEach((fieldId, index) => {
      const field = this.dataFields.get(fieldId);
      if (field && field.projectId === projectId) {
        this.dataFields.set(fieldId, { ...field, order: index });
      }
    });
    return true;
  }

  // Features
  async createFeature(feature: InsertFeature): Promise<Feature> {
    const id = randomUUID();
    const existingFeatures = await this.getFeaturesByProject(feature.projectId);
    const order = feature.order ?? existingFeatures.length;
    const newFeature: Feature = { 
      ...feature, 
      id, 
      order,
      specifications: feature.specifications || null
    };
    this.features.set(id, newFeature);
    return newFeature;
  }

  async getFeaturesByProject(projectId: string): Promise<Feature[]> {
    return Array.from(this.features.values())
      .filter(f => f.projectId === projectId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async updateFeature(id: string, feature: Partial<InsertFeature>): Promise<Feature | undefined> {
    const existing = this.features.get(id);
    if (!existing) return undefined;
    
    const updated: Feature = { ...existing, ...feature };
    this.features.set(id, updated);
    return updated;
  }

  async deleteFeature(id: string): Promise<boolean> {
    return this.features.delete(id);
  }

  async reorderFeatures(projectId: string, featureIds: string[]): Promise<boolean> {
    featureIds.forEach((featureId, index) => {
      const feature = this.features.get(featureId);
      if (feature && feature.projectId === projectId) {
        this.features.set(featureId, { ...feature, order: index });
      }
    });
    return true;
  }

  // Version Control
  async createProjectVersion(version: InsertProjectVersion): Promise<ProjectVersion> {
    const id = randomUUID();
    const newVersion: ProjectVersion = { 
      ...version, 
      id, 
      createdAt: new Date(),
      changes: version.changes || null
    };
    this.projectVersions.set(id, newVersion);
    return newVersion;
  }

  async getProjectVersions(projectId: string): Promise<ProjectVersion[]> {
    return Array.from(this.projectVersions.values())
      .filter(v => v.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  // Activity Log
  async logActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const id = randomUUID();
    const newActivity: ActivityLog = { 
      ...activity, 
      id, 
      createdAt: new Date() 
    };
    this.activityLogs.set(id, newActivity);
    return newActivity;
  }

  async getActivityByProject(projectId: string, limit = 10): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .filter(a => a.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
