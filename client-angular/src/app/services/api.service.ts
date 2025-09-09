import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  id: string;
  title: string;
  version: string;
  description: string | null;
  author: string;
  startDate: string | null;
  expectedCompletion: string | null;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Stakeholder { id: string; projectId: string; name: string; role: string; type: string; avatar: string | null }
export interface Milestone { id: string; projectId: string; title: string; date: string; status: string }
export interface ProjectRequirements {
  id: string; projectId: string;
  userExperienceGoals: string | null;
  scopeIncluded: string[] | null;
  scopeExcluded: string[] | null;
  assumptions: string[] | null;
  dependencies: string[] | null;
  dataIntegrationNeeds: string | null;
  externalServices: string[] | null;
  successMetrics: string[] | null;
  userTestingPlans: string | null;
  dataQualityRules: string[] | null;
  performanceRequirements: string[] | null;
  securityRequirements: string[] | null;
}
export interface DataField { id: string; projectId: string; name: string; displayLabel: string; uiControlType: string; dataType: string; placeholder: string | null; defaultValue: string | null; maxLength: number | null; required: boolean; validationRules: string[] | null; order: number }
export interface Feature { id: string; projectId: string; title: string; description: string; priority: string; type: string; specifications: string | null; order: number }
export interface ProjectVersion { id: string; projectId: string; version: string; changes: string[] | null; createdAt: string | Date; createdBy: string }
export interface ActivityLog { id: string; projectId: string; action: string; description: string; createdAt: string | Date; userId: string }

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('/api/projects');
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`/api/projects/${id}`);
  }

  // Projects (create/update)
  createProject(data: Partial<Project> & { title: string; author: string }): Observable<Project> {
    return this.http.post<Project>(`/api/projects`, data);
  }
  updateProject(id: string, data: Partial<Project>): Observable<Project> {
    return this.http.patch<Project>(`/api/projects/${id}`, data);
  }

  getStakeholders(projectId: string): Observable<Stakeholder[]> {
    return this.http.get<Stakeholder[]>(`/api/projects/${projectId}/stakeholders`);
  }
  addStakeholder(projectId: string, data: Omit<Stakeholder, 'id' | 'projectId'> & { name: string; role: string; type: string; avatar?: string | null }): Observable<Stakeholder> {
    return this.http.post<Stakeholder>(`/api/projects/${projectId}/stakeholders`, data);
  }
  deleteStakeholder(id: string): Observable<void> {
    return this.http.delete<void>(`/api/stakeholders/${id}`);
  }
  getMilestones(projectId: string): Observable<Milestone[]> {
    return this.http.get<Milestone[]>(`/api/projects/${projectId}/milestones`);
  }
  addMilestone(projectId: string, data: Omit<Milestone, 'id' | 'projectId'> & { title: string; date: string; status: string }): Observable<Milestone> {
    return this.http.post<Milestone>(`/api/projects/${projectId}/milestones`, data);
  }
  getRequirements(projectId: string): Observable<ProjectRequirements> {
    return this.http.get<ProjectRequirements>(`/api/projects/${projectId}/requirements`);
  }
  saveRequirements(projectId: string, data: Partial<ProjectRequirements>): Observable<ProjectRequirements> {
    return this.http.post<ProjectRequirements>(`/api/projects/${projectId}/requirements`, data);
  }
  getDataFields(projectId: string): Observable<DataField[]> {
    return this.http.get<DataField[]>(`/api/projects/${projectId}/data-fields`);
  }
  addDataField(projectId: string, data: Omit<DataField, 'id' | 'projectId' | 'order'> & { name: string; displayLabel: string; dataType: string; required?: boolean }): Observable<DataField> {
    return this.http.post<DataField>(`/api/projects/${projectId}/data-fields`, data);
  }
  updateDataField(id: string, data: Partial<DataField>): Observable<DataField> {
    return this.http.patch<DataField>(`/api/data-fields/${id}`, data);
  }
  deleteDataField(id: string): Observable<void> {
    return this.http.delete<void>(`/api/data-fields/${id}`);
  }
  getFeatures(projectId: string): Observable<Feature[]> {
    return this.http.get<Feature[]>(`/api/projects/${projectId}/features`);
  }
  addFeature(projectId: string, data: Omit<Feature, 'id' | 'projectId' | 'order'> & { title: string; description: string; priority: string; type: string }): Observable<Feature> {
    return this.http.post<Feature>(`/api/projects/${projectId}/features`, data);
  }
  updateFeature(id: string, data: Partial<Feature>): Observable<Feature> {
    return this.http.patch<Feature>(`/api/features/${id}`, data);
  }
  deleteFeature(id: string): Observable<void> {
    return this.http.delete<void>(`/api/features/${id}`);
  }
  getVersions(projectId: string): Observable<ProjectVersion[]> {
    return this.http.get<ProjectVersion[]>(`/api/projects/${projectId}/versions`);
  }
  addVersion(projectId: string, data: Omit<ProjectVersion, 'id' | 'projectId' | 'createdAt'> & { version: string; createdBy: string; changes?: string[] | null }): Observable<ProjectVersion> {
    return this.http.post<ProjectVersion>(`/api/projects/${projectId}/versions`, data);
  }
  getActivity(projectId: string, limit = 10): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`/api/projects/${projectId}/activity?limit=${limit}`);
  }
  generateFrs(projectId: string): Observable<{ message: string; data: any; downloadUrl: string }>{
    return this.http.post<{ message: string; data: any; downloadUrl: string }>(`/api/projects/${projectId}/generate-frs`, {});
  }
}
