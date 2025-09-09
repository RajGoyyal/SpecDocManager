import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema,
  insertStakeholderSchema,
  insertMilestoneSchema,
  insertProjectRequirementsSchema,
  insertDataFieldSchema,
  insertFeatureSchema,
  insertProjectVersionSchema,
  insertActivityLogSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      
      // Log activity
      await storage.logActivity({
        projectId: project.id,
        action: "project_created",
        description: `Project "${project.title}" was created`,
        userId: validatedData.author
      });
      
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data", error });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const partialData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, partialData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Log activity
      await storage.logActivity({
        projectId: project.id,
        action: "project_updated",
        description: "Project information was updated",
        userId: project.author
      });
      
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data", error });
    }
  });

  // Stakeholders
  app.get("/api/projects/:projectId/stakeholders", async (req, res) => {
    try {
      const stakeholders = await storage.getStakeholdersByProject(req.params.projectId);
      res.json(stakeholders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stakeholders" });
    }
  });

  app.post("/api/projects/:projectId/stakeholders", async (req, res) => {
    try {
      const validatedData = insertStakeholderSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const stakeholder = await storage.createStakeholder(validatedData);
      
      // Log activity
      await storage.logActivity({
        projectId: req.params.projectId,
        action: "stakeholder_added",
        description: `Stakeholder "${stakeholder.name}" was added`,
        userId: "current-user"
      });
      
      res.status(201).json(stakeholder);
    } catch (error) {
      res.status(400).json({ message: "Invalid stakeholder data", error });
    }
  });

  app.delete("/api/stakeholders/:id", async (req, res) => {
    try {
      const success = await storage.deleteStakeholder(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Stakeholder not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete stakeholder" });
    }
  });

  // Milestones
  app.get("/api/projects/:projectId/milestones", async (req, res) => {
    try {
      const milestones = await storage.getMilestonesByProject(req.params.projectId);
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch milestones" });
    }
  });

  app.post("/api/projects/:projectId/milestones", async (req, res) => {
    try {
      const validatedData = insertMilestoneSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const milestone = await storage.createMilestone(validatedData);
      res.status(201).json(milestone);
    } catch (error) {
      res.status(400).json({ message: "Invalid milestone data", error });
    }
  });

  // Project Requirements
  app.get("/api/projects/:projectId/requirements", async (req, res) => {
    try {
      const requirements = await storage.getProjectRequirements(req.params.projectId);
      res.json(requirements || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requirements" });
    }
  });

  app.post("/api/projects/:projectId/requirements", async (req, res) => {
    try {
      const validatedData = insertProjectRequirementsSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const requirements = await storage.createOrUpdateProjectRequirements(validatedData);
      
      // Log activity
      await storage.logActivity({
        projectId: req.params.projectId,
        action: "requirements_updated",
        description: "Project requirements were updated",
        userId: "current-user"
      });
      
      res.json(requirements);
    } catch (error) {
      res.status(400).json({ message: "Invalid requirements data", error });
    }
  });

  // Data Fields
  app.get("/api/projects/:projectId/data-fields", async (req, res) => {
    try {
      const fields = await storage.getDataFieldsByProject(req.params.projectId);
      res.json(fields);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch data fields" });
    }
  });

  app.post("/api/projects/:projectId/data-fields", async (req, res) => {
    try {
      const validatedData = insertDataFieldSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const field = await storage.createDataField(validatedData);
      
      // Log activity
      await storage.logActivity({
        projectId: req.params.projectId,
        action: "data_field_added",
        description: `Data field "${field.name}" was added`,
        userId: "current-user"
      });
      
      res.status(201).json(field);
    } catch (error) {
      res.status(400).json({ message: "Invalid data field data", error });
    }
  });

  app.patch("/api/data-fields/:id", async (req, res) => {
    try {
      const partialData = insertDataFieldSchema.partial().parse(req.body);
      const field = await storage.updateDataField(req.params.id, partialData);
      
      if (!field) {
        return res.status(404).json({ message: "Data field not found" });
      }
      
      res.json(field);
    } catch (error) {
      res.status(400).json({ message: "Invalid data field data", error });
    }
  });

  app.delete("/api/data-fields/:id", async (req, res) => {
    try {
      const success = await storage.deleteDataField(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Data field not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete data field" });
    }
  });

  // Features
  app.get("/api/projects/:projectId/features", async (req, res) => {
    try {
      const features = await storage.getFeaturesByProject(req.params.projectId);
      res.json(features);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch features" });
    }
  });

  app.post("/api/projects/:projectId/features", async (req, res) => {
    try {
      const validatedData = insertFeatureSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const feature = await storage.createFeature(validatedData);
      
      // Log activity
      await storage.logActivity({
        projectId: req.params.projectId,
        action: "feature_added",
        description: `Feature "${feature.title}" was added`,
        userId: "current-user"
      });
      
      res.status(201).json(feature);
    } catch (error) {
      res.status(400).json({ message: "Invalid feature data", error });
    }
  });

  app.patch("/api/features/:id", async (req, res) => {
    try {
      const partialData = insertFeatureSchema.partial().parse(req.body);
      const feature = await storage.updateFeature(req.params.id, partialData);
      
      if (!feature) {
        return res.status(404).json({ message: "Feature not found" });
      }
      
      res.json(feature);
    } catch (error) {
      res.status(400).json({ message: "Invalid feature data", error });
    }
  });

  app.delete("/api/features/:id", async (req, res) => {
    try {
      const success = await storage.deleteFeature(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Feature not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete feature" });
    }
  });

  // Activity Log
  app.get("/api/projects/:projectId/activity", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getActivityByProject(req.params.projectId, limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity log" });
    }
  });

  // Version Control
  app.get("/api/projects/:projectId/versions", async (req, res) => {
    try {
      const versions = await storage.getProjectVersions(req.params.projectId);
      res.json(versions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch versions" });
    }
  });

  app.post("/api/projects/:projectId/versions", async (req, res) => {
    try {
      const validatedData = insertProjectVersionSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const version = await storage.createProjectVersion(validatedData);
      res.status(201).json(version);
    } catch (error) {
      res.status(400).json({ message: "Invalid version data", error });
    }
  });

  // Document Generation
  app.post("/api/projects/:projectId/generate-frs", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const requirements = await storage.getProjectRequirements(req.params.projectId);
      const stakeholders = await storage.getStakeholdersByProject(req.params.projectId);
      const milestones = await storage.getMilestonesByProject(req.params.projectId);
      const dataFields = await storage.getDataFieldsByProject(req.params.projectId);
      const features = await storage.getFeaturesByProject(req.params.projectId);

      const frsData = {
        project,
        requirements,
        stakeholders,
        milestones,
        dataFields,
        features
      };

      // Log activity
      await storage.logActivity({
        projectId: req.params.projectId,
        action: "frs_generated",
        description: "FRS document was generated",
        userId: "current-user"
      });

      res.json({ 
        message: "FRS generated successfully", 
        data: frsData,
        downloadUrl: `/api/projects/${req.params.projectId}/download-frs`
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate FRS" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
