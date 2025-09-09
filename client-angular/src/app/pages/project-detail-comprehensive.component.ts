import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface Project {
  id: string;
  title: string;
  version: string;
  startDate: string;
  author: string;
  description: string;
  status: 'draft' | 'active' | 'review' | 'completed';
}

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  type: 'primary' | 'secondary' | 'reviewer';
  email: string;
}

interface WhatWeNeed {
  userExperienceGoals: string;
  scopeIncluded: string[];
  scopeExcluded: string[];
  keyAssumptions: string[];
  dependencies: string[];
  dataIntegrationNeeds: string;
  externalServices: string[];
}

interface DataField {
  id: string;
  fieldName: string;
  displayLabel: string;
  uiControl: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'file';
  placeholder: string;
  defaultValue: string;
  maxLength: number;
  required: boolean;
  validationRules: string[];
  specifications: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  type: 'functional' | 'non-functional' | 'technical';
  details: string;
}

interface SuccessCriteria {
  successMetrics: string[];
  userTestingPlan: string;
  dataQualityRules: string[];
  performanceRequirements: string[];
  securityRequirements: string[];
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="project-container">
      <!-- Left Sidebar Navigation -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3>Project Sections</h3>
        </div>
        <nav class="sidebar-nav">
          <button 
            class="nav-item" 
            [class.active]="activeTab() === 'basic-info'"
            (click)="setActiveTab('basic-info')">
            <span class="icon">📋</span>
            Basic Info
          </button>
          <button 
            class="nav-item" 
            [class.active]="activeTab() === 'what-we-need'"
            (click)="setActiveTab('what-we-need')">
            <span class="icon">🎯</span>
            What We Need
          </button>
          <button 
            class="nav-item" 
            [class.active]="activeTab() === 'data-fields'"
            (click)="setActiveTab('data-fields')">
            <span class="icon">📊</span>
            Data Fields
          </button>
          <button 
            class="nav-item" 
            [class.active]="activeTab() === 'features'"
            (click)="setActiveTab('features')">
            <span class="icon">⚡</span>
            Features
          </button>
          <button 
            class="nav-item" 
            [class.active]="activeTab() === 'success-criteria'"
            (click)="setActiveTab('success-criteria')">
            <span class="icon">✅</span>
            Success Criteria
          </button>
          <button 
            class="nav-item" 
            [class.active]="activeTab() === 'download'"
            (click)="setActiveTab('download')">
            <span class="icon">⬇️</span>
            Download
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Project Header -->
        <header class="project-header">
          <div class="header-info">
            <h1>{{project()?.title || 'New Project'}}</h1>
            <div class="project-meta">
              <span class="meta-item">Version: {{project()?.version || '1.0.0'}}</span>
              <span class="meta-item">Status: 
                <span class="status-badge" [class]="'status-' + (project()?.status || 'draft')">
                  {{project()?.status || 'draft'}}
                </span>
              </span>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="saveProject()">Save Project</button>
            <button class="btn btn-secondary" (click)="goBack()">← Back</button>
          </div>
        </header>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- 1. Basic Info Tab -->
          <div *ngIf="activeTab() === 'basic-info'" class="tab-panel">
            <div class="section-header">
              <h2>Basic Information</h2>
              <p>What are you building, version, date, author, stakeholder, project description</p>
            </div>

            <div class="content-grid">
              <!-- Project Details -->
              <div class="card">
                <h3>Project Details</h3>
                <div class="form-group">
                  <label>Project Title *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [ngModel]="project()?.title" 
                    (ngModelChange)="updateProject('title', $event)"
                    placeholder="Enter project title">
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Version</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      [ngModel]="project()?.version" 
                      (ngModelChange)="updateProject('version', $event)"
                      placeholder="1.0.0">
                  </div>
                  <div class="form-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      class="form-control" 
                      [ngModel]="project()?.startDate" 
                      (ngModelChange)="updateProject('startDate', $event)">
                  </div>
                </div>

                <div class="form-group">
                  <label>Author *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [ngModel]="project()?.author" 
                    (ngModelChange)="updateProject('author', $event)"
                    placeholder="Project author name">
                </div>

                <div class="form-group">
                  <label>Project Description</label>
                  <textarea 
                    class="form-control" 
                    rows="4"
                    [ngModel]="project()?.description" 
                    (ngModelChange)="updateProject('description', $event)"
                    placeholder="Describe your project..."></textarea>
                </div>

                <div class="form-group">
                  <label>Status</label>
                  <select 
                    class="form-control" 
                    [ngModel]="project()?.status" 
                    (ngModelChange)="updateProject('status', $event)">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <!-- Stakeholders -->
              <div class="card">
                <div class="card-header">
                  <h3>Stakeholders</h3>
                  <button class="btn btn-sm btn-primary" (click)="addStakeholder()">+ Add Stakeholder</button>
                </div>

                <div class="stakeholder-list">
                  <div *ngFor="let stakeholder of stakeholders(); let i = index" class="stakeholder-item">
                    <div class="stakeholder-info">
                      <div class="form-row">
                        <div class="form-group">
                          <input 
                            type="text" 
                            class="form-control" 
                            [ngModel]="stakeholder.name"
                            (ngModelChange)="updateStakeholder(i, 'name', $event)"
                            placeholder="Name">
                        </div>
                        <div class="form-group">
                          <input 
                            type="text" 
                            class="form-control" 
                            [ngModel]="stakeholder.role"
                            (ngModelChange)="updateStakeholder(i, 'role', $event)"
                            placeholder="Role">
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <select 
                            class="form-control" 
                            [ngModel]="stakeholder.type"
                            (ngModelChange)="updateStakeholder(i, 'type', $event)">
                            <option value="primary">Primary</option>
                            <option value="secondary">Secondary</option>
                            <option value="reviewer">Reviewer</option>
                          </select>
                        </div>
                        <div class="form-group">
                          <input 
                            type="email" 
                            class="form-control" 
                            [ngModel]="stakeholder.email"
                            (ngModelChange)="updateStakeholder(i, 'email', $event)"
                            placeholder="Email">
                        </div>
                      </div>
                    </div>
                    <button class="btn btn-sm btn-danger" (click)="removeStakeholder(i)">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. What We Need Tab -->
          <div *ngIf="activeTab() === 'what-we-need'" class="tab-panel">
            <div class="section-header">
              <h2>What We Need</h2>
              <p>What do you want to achieve - user experience goals, what's included, what's not included, key assumptions and dependencies</p>
            </div>

            <div class="content-grid">
              <!-- User Experience Goals -->
              <div class="card">
                <h3>User Experience Goals</h3>
                <div class="form-group">
                  <label>What do you want to achieve?</label>
                  <textarea 
                    class="form-control" 
                    rows="4"
                    [ngModel]="whatWeNeed()?.userExperienceGoals" 
                    (ngModelChange)="updateWhatWeNeed('userExperienceGoals', $event)"
                    placeholder="Describe the user experience goals..."></textarea>
                </div>
              </div>

              <!-- Scope -->
              <div class="card">
                <h3>Project Scope</h3>
                
                <div class="form-group">
                  <label>What's Included</label>
                  <div class="list-input">
                    <div *ngFor="let item of whatWeNeed()?.scopeIncluded || []; let i = index" class="list-item">
                      <input 
                        type="text" 
                        class="form-control" 
                        [ngModel]="item"
                        (ngModelChange)="updateScopeIncluded(i, $event)"
                        placeholder="What's included in scope">
                      <button class="btn btn-sm btn-danger" (click)="removeScopeIncluded(i)">×</button>
                    </div>
                    <button class="btn btn-sm btn-secondary" (click)="addScopeIncluded()">+ Add Item</button>
                  </div>
                </div>

                <div class="form-group">
                  <label>What's NOT Included</label>
                  <div class="list-input">
                    <div *ngFor="let item of whatWeNeed()?.scopeExcluded || []; let i = index" class="list-item">
                      <input 
                        type="text" 
                        class="form-control" 
                        [ngModel]="item"
                        (ngModelChange)="updateScopeExcluded(i, $event)"
                        placeholder="What's excluded from scope">
                      <button class="btn btn-sm btn-danger" (click)="removeScopeExcluded(i)">×</button>
                    </div>
                    <button class="btn btn-sm btn-secondary" (click)="addScopeExcluded()">+ Add Item</button>
                  </div>
                </div>
              </div>

              <!-- Assumptions & Dependencies -->
              <div class="card">
                <h3>Key Assumptions & Dependencies</h3>
                
                <div class="form-group">
                  <label>Key Assumptions</label>
                  <div class="list-input">
                    <div *ngFor="let item of whatWeNeed()?.keyAssumptions || []; let i = index" class="list-item">
                      <input 
                        type="text" 
                        class="form-control" 
                        [ngModel]="item"
                        (ngModelChange)="updateKeyAssumptions(i, $event)"
                        placeholder="Key assumption">
                      <button class="btn btn-sm btn-danger" (click)="removeKeyAssumption(i)">×</button>
                    </div>
                    <button class="btn btn-sm btn-secondary" (click)="addKeyAssumption()">+ Add Assumption</button>
                  </div>
                </div>

                <div class="form-group">
                  <label>Dependencies</label>
                  <div class="list-input">
                    <div *ngFor="let item of whatWeNeed()?.dependencies || []; let i = index" class="list-item">
                      <input 
                        type="text" 
                        class="form-control" 
                        [ngModel]="item"
                        (ngModelChange)="updateDependencies(i, $event)"
                        placeholder="Project dependency">
                      <button class="btn btn-sm btn-danger" (click)="removeDependency(i)">×</button>
                    </div>
                    <button class="btn btn-sm btn-secondary" (click)="addDependency()">+ Add Dependency</button>
                  </div>
                </div>
              </div>

              <!-- Data Integration -->
              <div class="card">
                <h3>Data Integration Needs</h3>
                
                <div class="form-group">
                  <label>What information do you need to store?</label>
                  <textarea 
                    class="form-control" 
                    rows="4"
                    [ngModel]="whatWeNeed()?.dataIntegrationNeeds" 
                    (ngModelChange)="updateWhatWeNeed('dataIntegrationNeeds', $event)"
                    placeholder="Describe data storage and integration needs..."></textarea>
                </div>

                <div class="form-group">
                  <label>External Services and Integrations</label>
                  <div class="list-input">
                    <div *ngFor="let service of whatWeNeed()?.externalServices || []; let i = index" class="list-item">
                      <input 
                        type="text" 
                        class="form-control" 
                        [ngModel]="service"
                        (ngModelChange)="updateExternalServices(i, $event)"
                        placeholder="External service (e.g., Payment Gateway, Email Service)">
                      <button class="btn btn-sm btn-danger" (click)="removeExternalService(i)">×</button>
                    </div>
                    <button class="btn btn-sm btn-secondary" (click)="addExternalService()">+ Add Service</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Data Fields Tab -->
          <div *ngIf="activeTab() === 'data-fields'" class="tab-panel">
            <div class="section-header">
              <h2>Data Fields</h2>
              <p>Field name, display label, UI control, data type, placeholder text, default value, max length, required, validation rules</p>
              <button class="btn btn-primary" (click)="addDataField()">+ Add Data Field</button>
            </div>

            <div class="data-fields-list">
              <div *ngFor="let field of dataFields(); let i = index" class="data-field-card">
                <div class="card-header">
                  <h4>Data Field {{i + 1}}</h4>
                  <button class="btn btn-sm btn-danger" (click)="removeDataField(i)">Remove</button>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label>Field Name *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      [ngModel]="field.fieldName"
                      (ngModelChange)="updateDataField(i, 'fieldName', $event)"
                      placeholder="field_name">
                  </div>

                  <div class="form-group">
                    <label>Display Label *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      [ngModel]="field.displayLabel"
                      (ngModelChange)="updateDataField(i, 'displayLabel', $event)"
                      placeholder="Field Label">
                  </div>

                  <div class="form-group">
                    <label>UI Control</label>
                    <select 
                      class="form-control" 
                      [ngModel]="field.uiControl"
                      (ngModelChange)="updateDataField(i, 'uiControl', $event)">
                      <option value="input">Input</option>
                      <option value="textarea">Textarea</option>
                      <option value="select">Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio</option>
                      <option value="date">Date</option>
                      <option value="file">File</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Data Type</label>
                    <select 
                      class="form-control" 
                      [ngModel]="field.dataType"
                      (ngModelChange)="updateDataField(i, 'dataType', $event)">
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="date">Date</option>
                      <option value="file">File</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Placeholder Text</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      [ngModel]="field.placeholder"
                      (ngModelChange)="updateDataField(i, 'placeholder', $event)"
                      placeholder="Enter placeholder text">
                  </div>

                  <div class="form-group">
                    <label>Default Value</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      [ngModel]="field.defaultValue"
                      (ngModelChange)="updateDataField(i, 'defaultValue', $event)"
                      placeholder="Default value">
                  </div>

                  <div class="form-group">
                    <label>Max Length</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      [ngModel]="field.maxLength"
                      (ngModelChange)="updateDataField(i, 'maxLength', $event)"
                      placeholder="Maximum character length">
                  </div>

                  <div class="form-group">
                    <label class="checkbox-label">
                      <input 
                        type="checkbox" 
                        [ngModel]="field.required"
                        (ngModelChange)="updateDataField(i, 'required', $event)">
                      Required Field
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label>Validation Rules</label>
                  <div class="list-input">
                    <div *ngFor="let rule of field.validationRules || []; let j = index" class="list-item">
                      <input 
                        type="text" 
                        class="form-control" 
                        [ngModel]="rule"
                        (ngModelChange)="updateValidationRule(i, j, $event)"
                        placeholder="Validation rule (e.g., email, min:5, regex:...)">
                      <button class="btn btn-sm btn-danger" (click)="removeValidationRule(i, j)">×</button>
                    </div>
                    <button class="btn btn-sm btn-secondary" (click)="addValidationRule(i)">+ Add Rule</button>
                  </div>
                </div>

                <div class="form-group">
                  <label>Field Specifications</label>
                  <textarea 
                    class="form-control" 
                    rows="3"
                    [ngModel]="field.specifications"
                    (ngModelChange)="updateDataField(i, 'specifications', $event)"
                    placeholder="Additional specifications for this field..."></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. Features Tab -->
          <div *ngIf="activeTab() === 'features'" class="tab-panel">
            <div class="section-header">
              <h2>Features</h2>
              <p>What should it do? How important is this? What kind of requirements? Tell us more about it</p>
              <button class="btn btn-primary" (click)="addFeature()">+ Add Feature</button>
            </div>

            <div class="features-list">
              <div *ngFor="let feature of features(); let i = index" class="feature-card">
                <div class="card-header">
                  <h4>Feature {{i + 1}}</h4>
                  <div class="feature-priority">
                    <span class="priority-badge" [class]="'priority-' + feature.importance">
                      {{feature.importance}}
                    </span>
                    <button class="btn btn-sm btn-danger" (click)="removeFeature(i)">Remove</button>
                  </div>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label>Feature Title *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      [ngModel]="feature.title"
                      (ngModelChange)="updateFeature(i, 'title', $event)"
                      placeholder="What should it do?">
                  </div>

                  <div class="form-group">
                    <label>Importance Level</label>
                    <select 
                      class="form-control" 
                      [ngModel]="feature.importance"
                      (ngModelChange)="updateFeature(i, 'importance', $event)">
                      <option value="high">High - Critical</option>
                      <option value="medium">Medium - Important</option>
                      <option value="low">Low - Nice to Have</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Requirement Type</label>
                    <select 
                      class="form-control" 
                      [ngModel]="feature.type"
                      (ngModelChange)="updateFeature(i, 'type', $event)">
                      <option value="functional">Functional</option>
                      <option value="non-functional">Non-Functional</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Feature Description</label>
                  <textarea 
                    class="form-control" 
                    rows="3"
                    [ngModel]="feature.description"
                    (ngModelChange)="updateFeature(i, 'description', $event)"
                    placeholder="Describe what this feature does..."></textarea>
                </div>

                <div class="form-group">
                  <label>Detailed Specifications</label>
                  <textarea 
                    class="form-control" 
                    rows="4"
                    [ngModel]="feature.details"
                    (ngModelChange)="updateFeature(i, 'details', $event)"
                    placeholder="Tell us more about this requirement - technical details, acceptance criteria, etc."></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Success Criteria Tab -->
          <div *ngIf="activeTab() === 'success-criteria'" class="tab-panel">
            <div class="section-header">
              <h2>Success Criteria</h2>
              <p>How will you know it's working? Performance and Security requirements</p>
            </div>

            <div class="content-grid">
              <!-- Success Metrics -->
              <div class="card">
                <h3>How will you know it's working?</h3>
                
                <div class="form-group">
                  <label>Success Criteria</label>
                  <div class="list-input">
                    <div *ngFor="let metric of successCriteria()?.successMetrics || []; let i = index" class="list-item">
                      <input 
                        type="text" 
                        class="form-control" 
                        [ngModel]="metric"
                        (ngModelChange)="updateSuccessMetrics(i, $event)"
                        placeholder="Success metric (e.g., 95% uptime, <2s load time)">
                      <button class="btn btn-sm btn-danger" (click)="removeSuccessMetric(i)">×</button>
                    </div>
                    <button class="btn btn-sm btn-secondary" (click)="addSuccessMetric()">+ Add Metric</button>
                  </div>
                </div>

                <div class="form-group">
                  <label>User Testing Plan</label>
                  <textarea 
                    class="form-control" 
                    rows="4"
                    [ngModel]="successCriteria()?.userTestingPlan" 
                    (ngModelChange)="updateSuccessCriteria('userTestingPlan', $event)"
                    placeholder="Describe how you will test with users..."></textarea>
                </div>

                <div class="form-group">
                  <label>Data Quality Rules</label>
                  <div class="list-input">
                    <div *ngFor="let rule of successCriteria()?.dataQualityRules || []; let i = index" class="list-item">
                      <input 
                        type="text" 
                        class="form-control" 
                        [ngModel]="rule"
                        (ngModelChange)="updateDataQualityRules(i, $event)"
                        placeholder="Data quality rule">
                      <button class="btn btn-sm btn-danger" (click)="removeDataQualityRule(i)">×</button>
                    </div>
                    <button class="btn btn-sm btn-secondary" (click)="addDataQualityRule()">+ Add Rule</button>
                  </div>
                </div>
              </div>

              <!-- Performance & Security -->
              <div class="card">
                <h3>Performance and Security</h3>
                
                <div class="form-group">
                  <label>Performance Requirements</label>
                  <div class="list-input">
                    <div *ngFor="let req of successCriteria()?.performanceRequirements || []; let i = index" class="list-item">
                      <input 
                        type="text" 
                        class="form-control" 
                        [ngModel]="req"
                        (ngModelChange)="updatePerformanceRequirements(i, $event)"
                        placeholder="Performance requirement (e.g., <2s page load, 1000 concurrent users)">
                      <button class="btn btn-sm btn-danger" (click)="removePerformanceRequirement(i)">×</button>
                    </div>
                    <button class="btn btn-sm btn-secondary" (click)="addPerformanceRequirement()">+ Add Requirement</button>
                  </div>
                </div>

                <div class="form-group">
                  <label>Security Requirements</label>
                  <div class="list-input">
                    <div *ngFor="let req of successCriteria()?.securityRequirements || []; let i = index" class="list-item">
                      <input 
                        type="text" 
                        class="form-control" 
                        [ngModel]="req"
                        (ngModelChange)="updateSecurityRequirements(i, $event)"
                        placeholder="Security requirement (e.g., HTTPS, data encryption, user authentication)">
                      <button class="btn btn-sm btn-danger" (click)="removeSecurityRequirement(i)">×</button>
                    </div>
                    <button class="btn btn-sm btn-secondary" (click)="addSecurityRequirement()">+ Add Requirement</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 6. Download Tab -->
          <div *ngIf="activeTab() === 'download'" class="tab-panel">
            <div class="section-header">
              <h2>Download Documentation</h2>
              <p>Export your project documentation in various formats</p>
            </div>

            <!-- Document Summary -->
            <div class="card summary-card">
              <h3>Document Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="summary-label">Project Title:</span>
                  <span class="summary-value">{{project()?.title || 'Untitled'}}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Total Features:</span>
                  <span class="summary-value">{{features().length}}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">High Priority Features:</span>
                  <span class="summary-value">{{getHighPriorityCount()}}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Functional Requirements:</span>
                  <span class="summary-value">{{getFunctionalCount()}}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Data Fields:</span>
                  <span class="summary-value">{{dataFields().length}}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Stakeholders:</span>
                  <span class="summary-value">{{stakeholders().length}}</span>
                </div>
              </div>
            </div>

            <!-- Export Options -->
            <div class="export-grid">
              <div class="export-card">
                <div class="export-icon">📄</div>
                <h4>PDF Document</h4>
                <p>Generate a comprehensive PDF document with all project information, formatted professionally for stakeholders and development teams.</p>
                <button class="btn btn-primary" (click)="exportPDF()">Export as PDF</button>
              </div>

              <div class="export-card">
                <div class="export-icon">📝</div>
                <h4>Word Document</h4>
                <p>Export as an editable Word document (.docx) that can be customized and shared with team members for collaboration.</p>
                <button class="btn btn-primary" (click)="exportWord()">Export as Word</button>
              </div>

              <div class="export-card">
                <div class="export-icon">📦</div>
                <h4>Complete Package</h4>
                <p>Download a complete package including all documentation, diagrams, and project files in a zip archive.</p>
                <button class="btn btn-primary" (click)="exportComplete()">Export Complete Package</button>
              </div>

              <div class="export-card">
                <div class="export-icon">💾</div>
                <h4>JSON Data</h4>
                <p>Export project data in JSON format for integration with other tools, backup purposes, or data migration.</p>
                <button class="btn btn-secondary" (click)="exportJSON()">Export JSON Data</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .project-container {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
    }

    .sidebar {
      width: 280px;
      background: white;
      border-right: 1px solid #e2e8f0;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 2rem 1.5rem 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .sidebar-header h3 {
      margin: 0;
      color: #1e293b;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .sidebar-nav {
      padding: 1rem;
    }

    .nav-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border: none;
      background: none;
      color: #64748b;
      font-size: 0.875rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 0.25rem;
      text-align: left;
    }

    .nav-item:hover {
      background: #f1f5f9;
      color: #334155;
    }

    .nav-item.active {
      background: #3b82f6;
      color: white;
    }

    .nav-item .icon {
      font-size: 1rem;
    }

    .main-content {
      margin-left: 280px;
      flex: 1;
      min-height: 100vh;
    }

    .project-header {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .project-header h1 {
      margin: 0 0 0.5rem 0;
      color: #1e293b;
      font-size: 1.875rem;
      font-weight: 700;
    }

    .project-meta {
      display: flex;
      gap: 1.5rem;
      margin-top: 0.5rem;
    }

    .meta-item {
      color: #64748b;
      font-size: 0.875rem;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .status-draft { background: #f1f5f9; color: #475569; }
    .status-active { background: #dcfce7; color: #166534; }
    .status-review { background: #fef3c7; color: #92400e; }
    .status-completed { background: #dbeafe; color: #1e40af; }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .tab-content {
      padding: 2rem;
    }

    .section-header {
      margin-bottom: 2rem;
    }

    .section-header h2 {
      margin: 0 0 0.5rem 0;
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .section-header p {
      color: #64748b;
      margin: 0 0 1rem 0;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .card h3 {
      margin: 0 0 1.5rem 0;
      color: #1e293b;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .card-header {
      display: flex;
      justify-content: between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .card-header h3,
    .card-header h4 {
      margin: 0;
      flex: 1;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #374151;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-secondary {
      background: white;
      color: #6b7280;
      border-color: #d1d5db;
    }

    .btn-secondary:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn-sm {
      padding: 0.5rem 0.875rem;
      font-size: 0.75rem;
    }

    .list-input {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      background: #f9fafb;
    }

    .list-item {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      align-items: center;
    }

    .list-item:last-of-type {
      margin-bottom: 0.75rem;
    }

    .stakeholder-list {
      space-y: 1rem;
    }

    .stakeholder-item {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      background: #f9fafb;
      display: flex;
      gap: 1rem;
      align-items: start;
    }

    .stakeholder-info {
      flex: 1;
    }

    .data-fields-list,
    .features-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .data-field-card,
    .feature-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .feature-priority {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .priority-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .priority-high { background: #fecaca; color: #991b1b; }
    .priority-medium { background: #fed7aa; color: #9a3412; }
    .priority-low { background: #bbf7d0; color: #166534; }

    .summary-card {
      margin-bottom: 2rem;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .summary-label {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
    }

    .summary-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
    }

    .export-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .export-card {
      background: white;
      border-radius: 0.75rem;
      padding: 2rem;
      border: 1px solid #e2e8f0;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .export-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .export-card h4 {
      margin: 0 0 0.75rem 0;
      color: #1e293b;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .export-card p {
      color: #64748b;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .sidebar {
        position: relative;
        width: 100%;
        height: auto;
      }

      .main-content {
        margin-left: 0;
      }

      .project-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }

      .form-row,
      .form-grid {
        grid-template-columns: 1fr;
      }

      .tab-content {
        padding: 1rem;
      }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  activeTab = signal<string>('basic-info');
  project = signal<Project>({
    id: '',
    title: '',
    version: '1.0.0',
    startDate: '',
    author: '',
    description: '',
    status: 'draft'
  });

  stakeholders = signal<Stakeholder[]>([]);
  whatWeNeed = signal<WhatWeNeed>({
    userExperienceGoals: '',
    scopeIncluded: [],
    scopeExcluded: [],
    keyAssumptions: [],
    dependencies: [],
    dataIntegrationNeeds: '',
    externalServices: []
  });

  dataFields = signal<DataField[]>([]);
  features = signal<Feature[]>([]);
  successCriteria = signal<SuccessCriteria>({
    successMetrics: [],
    userTestingPlan: '',
    dataQualityRules: [],
    performanceRequirements: [],
    securityRequirements: []
  });

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId && projectId !== 'new') {
      this.loadProject(projectId);
    } else {
      this.initializeNewProject();
    }
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  // Project methods
  updateProject(field: keyof Project, value: any) {
    this.project.update(p => ({ ...p, [field]: value }));
  }

  // Stakeholder methods
  addStakeholder() {
    this.stakeholders.update(list => [...list, {
      id: Date.now().toString(),
      name: '',
      role: '',
      type: 'primary',
      email: ''
    }]);
  }

  updateStakeholder(index: number, field: keyof Stakeholder, value: any) {
    this.stakeholders.update(list => {
      const updated = [...list];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  removeStakeholder(index: number) {
    this.stakeholders.update(list => list.filter((_, i) => i !== index));
  }

  // What We Need methods
  updateWhatWeNeed(field: keyof WhatWeNeed, value: any) {
    this.whatWeNeed.update(w => ({ ...w, [field]: value }));
  }

  addScopeIncluded() {
    this.whatWeNeed.update(w => ({
      ...w,
      scopeIncluded: [...w.scopeIncluded, '']
    }));
  }

  updateScopeIncluded(index: number, value: string) {
    this.whatWeNeed.update(w => {
      const updated = [...w.scopeIncluded];
      updated[index] = value;
      return { ...w, scopeIncluded: updated };
    });
  }

  removeScopeIncluded(index: number) {
    this.whatWeNeed.update(w => ({
      ...w,
      scopeIncluded: w.scopeIncluded.filter((_, i) => i !== index)
    }));
  }

  addScopeExcluded() {
    this.whatWeNeed.update(w => ({
      ...w,
      scopeExcluded: [...w.scopeExcluded, '']
    }));
  }

  updateScopeExcluded(index: number, value: string) {
    this.whatWeNeed.update(w => {
      const updated = [...w.scopeExcluded];
      updated[index] = value;
      return { ...w, scopeExcluded: updated };
    });
  }

  removeScopeExcluded(index: number) {
    this.whatWeNeed.update(w => ({
      ...w,
      scopeExcluded: w.scopeExcluded.filter((_, i) => i !== index)
    }));
  }

  addKeyAssumption() {
    this.whatWeNeed.update(w => ({
      ...w,
      keyAssumptions: [...w.keyAssumptions, '']
    }));
  }

  updateKeyAssumptions(index: number, value: string) {
    this.whatWeNeed.update(w => {
      const updated = [...w.keyAssumptions];
      updated[index] = value;
      return { ...w, keyAssumptions: updated };
    });
  }

  removeKeyAssumption(index: number) {
    this.whatWeNeed.update(w => ({
      ...w,
      keyAssumptions: w.keyAssumptions.filter((_, i) => i !== index)
    }));
  }

  addDependency() {
    this.whatWeNeed.update(w => ({
      ...w,
      dependencies: [...w.dependencies, '']
    }));
  }

  updateDependencies(index: number, value: string) {
    this.whatWeNeed.update(w => {
      const updated = [...w.dependencies];
      updated[index] = value;
      return { ...w, dependencies: updated };
    });
  }

  removeDependency(index: number) {
    this.whatWeNeed.update(w => ({
      ...w,
      dependencies: w.dependencies.filter((_, i) => i !== index)
    }));
  }

  addExternalService() {
    this.whatWeNeed.update(w => ({
      ...w,
      externalServices: [...w.externalServices, '']
    }));
  }

  updateExternalServices(index: number, value: string) {
    this.whatWeNeed.update(w => {
      const updated = [...w.externalServices];
      updated[index] = value;
      return { ...w, externalServices: updated };
    });
  }

  removeExternalService(index: number) {
    this.whatWeNeed.update(w => ({
      ...w,
      externalServices: w.externalServices.filter((_, i) => i !== index)
    }));
  }

  // Data Fields methods
  addDataField() {
    this.dataFields.update(list => [...list, {
      id: Date.now().toString(),
      fieldName: '',
      displayLabel: '',
      uiControl: 'input',
      dataType: 'string',
      placeholder: '',
      defaultValue: '',
      maxLength: 255,
      required: false,
      validationRules: [],
      specifications: ''
    }]);
  }

  updateDataField(index: number, field: keyof DataField, value: any) {
    this.dataFields.update(list => {
      const updated = [...list];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  removeDataField(index: number) {
    this.dataFields.update(list => list.filter((_, i) => i !== index));
  }

  addValidationRule(fieldIndex: number) {
    this.dataFields.update(list => {
      const updated = [...list];
      updated[fieldIndex] = {
        ...updated[fieldIndex],
        validationRules: [...updated[fieldIndex].validationRules, '']
      };
      return updated;
    });
  }

  updateValidationRule(fieldIndex: number, ruleIndex: number, value: string) {
    this.dataFields.update(list => {
      const updated = [...list];
      const rules = [...updated[fieldIndex].validationRules];
      rules[ruleIndex] = value;
      updated[fieldIndex] = { ...updated[fieldIndex], validationRules: rules };
      return updated;
    });
  }

  removeValidationRule(fieldIndex: number, ruleIndex: number) {
    this.dataFields.update(list => {
      const updated = [...list];
      updated[fieldIndex] = {
        ...updated[fieldIndex],
        validationRules: updated[fieldIndex].validationRules.filter((_, i) => i !== ruleIndex)
      };
      return updated;
    });
  }

  // Features methods
  addFeature() {
    this.features.update(list => [...list, {
      id: Date.now().toString(),
      title: '',
      description: '',
      importance: 'medium',
      type: 'functional',
      details: ''
    }]);
  }

  updateFeature(index: number, field: keyof Feature, value: any) {
    this.features.update(list => {
      const updated = [...list];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  removeFeature(index: number) {
    this.features.update(list => list.filter((_, i) => i !== index));
  }

  // Success Criteria methods
  updateSuccessCriteria(field: keyof SuccessCriteria, value: any) {
    this.successCriteria.update(s => ({ ...s, [field]: value }));
  }

  addSuccessMetric() {
    this.successCriteria.update(s => ({
      ...s,
      successMetrics: [...s.successMetrics, '']
    }));
  }

  updateSuccessMetrics(index: number, value: string) {
    this.successCriteria.update(s => {
      const updated = [...s.successMetrics];
      updated[index] = value;
      return { ...s, successMetrics: updated };
    });
  }

  removeSuccessMetric(index: number) {
    this.successCriteria.update(s => ({
      ...s,
      successMetrics: s.successMetrics.filter((_, i) => i !== index)
    }));
  }

  addDataQualityRule() {
    this.successCriteria.update(s => ({
      ...s,
      dataQualityRules: [...s.dataQualityRules, '']
    }));
  }

  updateDataQualityRules(index: number, value: string) {
    this.successCriteria.update(s => {
      const updated = [...s.dataQualityRules];
      updated[index] = value;
      return { ...s, dataQualityRules: updated };
    });
  }

  removeDataQualityRule(index: number) {
    this.successCriteria.update(s => ({
      ...s,
      dataQualityRules: s.dataQualityRules.filter((_, i) => i !== index)
    }));
  }

  addPerformanceRequirement() {
    this.successCriteria.update(s => ({
      ...s,
      performanceRequirements: [...s.performanceRequirements, '']
    }));
  }

  updatePerformanceRequirements(index: number, value: string) {
    this.successCriteria.update(s => {
      const updated = [...s.performanceRequirements];
      updated[index] = value;
      return { ...s, performanceRequirements: updated };
    });
  }

  removePerformanceRequirement(index: number) {
    this.successCriteria.update(s => ({
      ...s,
      performanceRequirements: s.performanceRequirements.filter((_, i) => i !== index)
    }));
  }

  addSecurityRequirement() {
    this.successCriteria.update(s => ({
      ...s,
      securityRequirements: [...s.securityRequirements, '']
    }));
  }

  updateSecurityRequirements(index: number, value: string) {
    this.successCriteria.update(s => {
      const updated = [...s.securityRequirements];
      updated[index] = value;
      return { ...s, securityRequirements: updated };
    });
  }

  removeSecurityRequirement(index: number) {
    this.successCriteria.update(s => ({
      ...s,
      securityRequirements: s.securityRequirements.filter((_, i) => i !== index)
    }));
  }

  // Summary methods
  getHighPriorityCount(): number {
    return this.features().filter(f => f.importance === 'high').length;
  }

  getFunctionalCount(): number {
    return this.features().filter(f => f.type === 'functional').length;
  }

  // Utility methods
  private loadProject(id: string) {
    // In a real app, this would load from API
    console.log('Loading project:', id);
  }

  private initializeNewProject() {
    // Initialize with some sample data for demonstration
    this.project.set({
      id: 'new',
      title: 'My New Project',
      version: '1.0.0',
      startDate: new Date().toISOString().split('T')[0],
      author: 'Project Manager',
      description: '',
      status: 'draft'
    });
  }

  saveProject() {
    console.log('Saving project:', {
      project: this.project(),
      stakeholders: this.stakeholders(),
      whatWeNeed: this.whatWeNeed(),
      dataFields: this.dataFields(),
      features: this.features(),
      successCriteria: this.successCriteria()
    });
    alert('Project saved successfully!');
  }

  goBack() {
    this.router.navigate(['/projects']);
  }

  // Export methods
  exportPDF() {
    console.log('Exporting PDF...');
    alert('PDF export functionality would be implemented here.');
  }

  exportWord() {
    console.log('Exporting Word document...');
    alert('Word export functionality would be implemented here.');
  }

  exportComplete() {
    console.log('Exporting complete package...');
    alert('Complete package export functionality would be implemented here.');
  }

  exportJSON() {
    const projectData = {
      project: this.project(),
      stakeholders: this.stakeholders(),
      whatWeNeed: this.whatWeNeed(),
      dataFields: this.dataFields(),
      features: this.features(),
      successCriteria: this.successCriteria(),
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(projectData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.project().title || 'project'}-specification.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
