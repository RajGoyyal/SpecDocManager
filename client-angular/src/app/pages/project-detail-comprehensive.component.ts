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
  phone: string;
}

interface WhatWeNeed {
  userExperienceGoals: string;
  whatsIncluded: string;
  whatsNotIncluded: string;
  keyAssumptionsAndDependencies: string;
  dataStorageNeeds: string;
  externalServicesIntegrations: string;
  businessGoals: string;
  successMetrics: string;
  timelineExpectations: string;
  budgetConstraints: string;
  technicalConstraints: string;
  scopeIncluded: string[];
  scopeExcluded: string[];
  keyAssumptions: string[];
  dependencies: string[];
  dataIntegrationNeeds: string;
  externalServices: string[];
}

interface DataField {
  id: string;
  name: string;
  displayLabel: string;
  uiControl: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'date' | 'datetime' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'toggle' | 'slider' | 'file' | 'color' | 'url' | 'search';
  dataType: 'string' | 'number' | 'integer' | 'decimal' | 'boolean' | 'date' | 'datetime' | 'email' | 'url' | 'json' | 'array' | 'file';
  placeholderText: string;
  defaultValue: string;
  maxLength?: number;
  required: boolean;
  validationRules: string;
  description: string;
  options: string[];
  optionsText: string;
}

interface Feature {
  id: string;
  title: string;
  type: 'functional' | 'non-functional' | 'business' | 'integration' | 'security' | 'performance' | 'usability' | 'compliance';
  priority: 'critical' | 'high' | 'medium' | 'low' | 'nice-to-have';
  description: string;
  detailedDescription?: string;
  userStory: string;
  acceptanceCriteria: string[];
  businessRules: string[];
  testingNotes: string;
  status: 'draft' | 'review' | 'approved' | 'in-progress' | 'testing' | 'completed' | 'rejected';
  estimatedEffort?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
}

interface SuccessCriteria {
  userTestingPlan: string;
  dataQualityRules: string;
  performanceRequirements: string;
  securityRequirements: string;
  accessibilityStandards: string[];
  browserCompatibility: string[];
  deviceCompatibility: string[];
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-layout">
      <!-- Left Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2 class="sidebar-title">
            <span class="icon">📋</span>
            FRS Manager
          </h2>
          <p class="sidebar-subtitle">Requirements Management System</p>
        </div>

        <!-- Project Navigation -->
        <nav class="sidebar-nav">
          <button 
            *ngFor="let tab of tabs" 
            class="nav-item"
            [class.active]="activeTab() === tab.id"
            (click)="setActiveTab(tab.id)">
            <span class="nav-icon">{{ tab.icon }}</span>
            <span class="nav-label">{{ tab.label }}</span>
          </button>
        </nav>

        <!-- User Info -->
        <div class="sidebar-footer">
          <div class="user-info">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40" 
              alt="User avatar" 
              class="user-avatar">
            <div class="user-details">
              <p class="user-name">John Smith</p>
              <p class="user-role">Product Manager</p>
            </div>
            <button class="settings-btn">⚙️</button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <div class="content-header">
          <h1 class="content-title">{{ project().title }}</h1>
          <div class="content-actions">
            <button class="btn btn-outline" (click)="autoSave()">Save</button>
            <button class="btn btn-primary" (click)="exportProject('json')">Export</button>
          </div>
        </div>

        <div class="content-body">
          
          <!-- Basic Info Tab -->
          <div *ngIf="activeTab() === 'basic-info'" class="tab-content">
            <div class="section">
              <h3 class="section-title">Project Information</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label for="title" class="form-label">Project Title</label>
                  <input 
                    id="title"
                    type="text" 
                    class="form-control"
                    [(ngModel)]="project().title"
                    placeholder="Enter project title">
                </div>
                <div class="form-group">
                  <label for="version" class="form-label">Version</label>
                  <input 
                    id="version"
                    type="text" 
                    class="form-control"
                    [(ngModel)]="project().version"
                    placeholder="1.0.0">
                </div>
                <div class="form-group">
                  <label for="author" class="form-label">Author</label>
                  <input 
                    id="author"
                    type="text" 
                    class="form-control"
                    [(ngModel)]="project().author"
                    placeholder="Project author">
                </div>
                <div class="form-group">
                  <label for="startDate" class="form-label">Start Date</label>
                  <input 
                    id="startDate"
                    type="date" 
                    class="form-control"
                    [(ngModel)]="project().startDate">
                </div>
                <div class="form-group span-2">
                  <label for="description" class="form-label">Description</label>
                  <textarea 
                    id="description"
                    class="form-control"
                    [(ngModel)]="project().description"
                    placeholder="Project description"
                    rows="4"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- What We Need Tab -->
          <div *ngIf="activeTab() === 'what-we-need'" class="tab-content">
            <!-- Section 1: What do you want to achieve -->
            <div class="section">
              <h3 class="section-title">What Do You Want to Achieve</h3>
              
              <div class="form-group">
                <label class="form-label">User Experience Goals</label>
                <textarea 
                  class="form-control"
                  [(ngModel)]="whatWeNeed().userExperienceGoals"
                  placeholder="Define what user experience you want to create. What should users feel when using this system?"
                  rows="4"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">What's Included</label>
                <textarea 
                  class="form-control"
                  [(ngModel)]="whatWeNeed().whatsIncluded"
                  placeholder="List all features, functionalities, and components that will be part of this project"
                  rows="4"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">What's NOT Included</label>
                <textarea 
                  class="form-control"
                  [(ngModel)]="whatWeNeed().whatsNotIncluded"
                  placeholder="Clearly define what is out of scope for this project to avoid misunderstandings"
                  rows="4"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Key Assumptions and Dependencies</label>
                <textarea 
                  class="form-control"
                  [(ngModel)]="whatWeNeed().keyAssumptionsAndDependencies"
                  placeholder="List critical assumptions and external dependencies that could impact the project"
                  rows="4"></textarea>
              </div>
            </div>

            <!-- Section 2: Data Integration Needs -->
            <div class="section">
              <h3 class="section-title">Data Integration Needs</h3>
              
              <div class="form-group">
                <label class="form-label">What Information Do You Need to Store?</label>
                <textarea 
                  class="form-control"
                  [(ngModel)]="whatWeNeed().dataStorageNeeds"
                  placeholder="Describe all the data that needs to be stored, managed, and retrieved by the system"
                  rows="5"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">External Services and Integrations</label>
                <textarea 
                  class="form-control"
                  [(ngModel)]="whatWeNeed().externalServicesIntegrations"
                  placeholder="List third-party services, APIs, databases, or systems that need to be integrated"
                  rows="5"></textarea>
              </div>
            </div>

            <!-- Additional Planning Sections -->
            <div class="section">
              <h3 class="section-title">Project Planning Details</h3>
              
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Business Goals</label>
                  <textarea 
                    class="form-control"
                    [(ngModel)]="whatWeNeed().businessGoals"
                    placeholder="What business objectives will this project achieve?"
                    rows="3"></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Success Metrics</label>
                  <textarea 
                    class="form-control"
                    [(ngModel)]="whatWeNeed().successMetrics"
                    placeholder="How will you measure the success of this project?"
                    rows="3"></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Timeline Expectations</label>
                  <input 
                    type="text" 
                    class="form-control"
                    [(ngModel)]="whatWeNeed().timelineExpectations"
                    placeholder="Expected project duration and key milestones">
                </div>

                <div class="form-group">
                  <label class="form-label">Budget Constraints</label>
                  <input 
                    type="text" 
                    class="form-control"
                    [(ngModel)]="whatWeNeed().budgetConstraints"
                    placeholder="Budget limitations and considerations">
                </div>

                <div class="form-group span-2">
                  <label class="form-label">Technical Constraints</label>
                  <textarea 
                    class="form-control"
                    [(ngModel)]="whatWeNeed().technicalConstraints"
                    placeholder="Technical limitations, platform requirements, technology stack constraints"
                    rows="3"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Data Fields Tab -->
          <div *ngIf="activeTab() === 'data-fields'" class="tab-content">
            <div class="section">
              <div class="section-header">
                <h3 class="section-title">Data Field Specifications</h3>
                <button class="btn btn-primary" (click)="addDataField()">
                  <span class="icon">+</span>
                  Add Data Field
                </button>
              </div>
              
              <div class="data-fields-list">
                <div *ngFor="let field of dataFields(); let i = index" class="data-field-card">
                  <div class="field-header">
                    <div class="form-grid">
                      <div class="form-group">
                        <label class="form-label">Field Name</label>
                        <input 
                          type="text" 
                          class="form-control"
                          [(ngModel)]="field.name"
                          placeholder="e.g., firstName, email, phoneNumber">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Display Label</label>
                        <input 
                          type="text" 
                          class="form-control"
                          [(ngModel)]="field.displayLabel"
                          placeholder="e.g., First Name, Email Address">
                      </div>
                      <div class="form-group">
                        <label class="form-label">UI Control</label>
                        <select class="form-control" [(ngModel)]="field.uiControl">
                          <option value="text">Text Input</option>
                          <option value="textarea">Text Area</option>
                          <option value="number">Number Input</option>
                          <option value="email">Email Input</option>
                          <option value="password">Password Input</option>
                          <option value="date">Date Picker</option>
                          <option value="datetime">Date Time Picker</option>
                          <option value="select">Dropdown Select</option>
                          <option value="multiselect">Multi-Select</option>
                          <option value="radio">Radio Buttons</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="toggle">Toggle Switch</option>
                          <option value="slider">Slider</option>
                          <option value="file">File Upload</option>
                          <option value="color">Color Picker</option>
                          <option value="url">URL Input</option>
                          <option value="search">Search Input</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div class="field-body">
                    <div class="form-grid">
                      <div class="form-group">
                        <label class="form-label">Data Type</label>
                        <select class="form-control" [(ngModel)]="field.dataType">
                          <option value="string">String/Text</option>
                          <option value="number">Number</option>
                          <option value="integer">Integer</option>
                          <option value="decimal">Decimal</option>
                          <option value="boolean">Boolean</option>
                          <option value="date">Date</option>
                          <option value="datetime">Date & Time</option>
                          <option value="email">Email</option>
                          <option value="url">URL</option>
                          <option value="json">JSON Object</option>
                          <option value="array">Array</option>
                          <option value="file">File</option>
                        </select>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label">Max Length</label>
                        <input 
                          type="number" 
                          class="form-control"
                          [(ngModel)]="field.maxLength"
                          placeholder="Maximum character length">
                      </div>

                      <div class="form-group">
                        <label class="form-label">Required Field</label>
                        <select class="form-control" [(ngModel)]="field.required">
                          <option [value]="true">Yes - Required</option>
                          <option [value]="false">No - Optional</option>
                        </select>
                      </div>
                    </div>

                    <div class="form-grid">
                      <div class="form-group">
                        <label class="form-label">Placeholder Text</label>
                        <input 
                          type="text" 
                          class="form-control"
                          [(ngModel)]="field.placeholderText"
                          placeholder="Placeholder text shown to users">
                      </div>

                      <div class="form-group">
                        <label class="form-label">Default Value</label>
                        <input 
                          type="text" 
                          class="form-control"
                          [(ngModel)]="field.defaultValue"
                          placeholder="Default value if any">
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Description</label>
                      <textarea 
                        class="form-control"
                        [(ngModel)]="field.description"
                        placeholder="Detailed description of this field and its purpose"
                        rows="2"></textarea>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Validation Rules</label>
                      <textarea 
                        class="form-control"
                        [(ngModel)]="field.validationRules"
                        placeholder="e.g., Must be unique, Format: XXX-XXX-XXXX, Min value: 0, Max value: 100"
                        rows="2"></textarea>
                    </div>

                    <!-- Options for select, radio, checkbox controls -->
                    <div *ngIf="field.uiControl === 'select' || field.uiControl === 'multiselect' || field.uiControl === 'radio'" class="form-group">
                      <label class="form-label">Options (one per line)</label>
                      <textarea 
                        class="form-control"
                        [(ngModel)]="field.optionsText"
                        (ngModelChange)="updateFieldOptions(field, $event)"
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                        rows="4"></textarea>
                    </div>
                  </div>
                  
                  <div class="field-actions">
                    <button 
                      class="btn btn-danger btn-sm"
                      (click)="removeDataField(i)">
                      Remove Field
                    </button>
                  </div>
                </div>

                <!-- Empty state -->
                <div *ngIf="dataFields().length === 0" class="empty-state">
                  <div class="empty-icon">📋</div>
                  <h4>No Data Fields Defined</h4>
                  <p>Start by adding your first data field to define what information your system will collect and manage.</p>
                  <button class="btn btn-primary" (click)="addDataField()">
                    Add First Data Field
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Features Tab -->
          <div *ngIf="activeTab() === 'features'" class="tab-content">
            <div class="section">
              <div class="section-header">
                <h3 class="section-title">Features & Requirements</h3>
                <button class="btn btn-primary" (click)="addFeature()">
                  <span class="icon">+</span>
                  Add Requirement
                </button>
              </div>
              
              <div class="feature-list">
                <div *ngFor="let feature of features(); let i = index" class="feature-card">
                  <div class="feature-header">
                    <div class="form-grid">
                      <div class="form-group">
                        <label class="form-label">Requirement Title</label>
                        <input 
                          type="text" 
                          class="form-control"
                          [(ngModel)]="feature.title"
                          placeholder="What is this requirement called?">
                      </div>
                      <div class="form-group">
                        <label class="form-label">How Important Is This?</label>
                        <select class="form-control" [(ngModel)]="feature.priority">
                          <option value="critical">Critical - Must Have</option>
                          <option value="high">High Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="low">Low Priority</option>
                          <option value="nice-to-have">Nice to Have</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">What Kind of Requirement?</label>
                        <select class="form-control" [(ngModel)]="feature.type">
                          <option value="functional">Functional - What the system does</option>
                          <option value="non-functional">Non-Functional - How the system performs</option>
                          <option value="business">Business Rule</option>
                          <option value="integration">Integration Requirement</option>
                          <option value="security">Security Requirement</option>
                          <option value="performance">Performance Requirement</option>
                          <option value="usability">Usability Requirement</option>
                          <option value="compliance">Compliance Requirement</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div class="feature-body">
                    <div class="form-group">
                      <label class="form-label">What Should It Do?</label>
                      <textarea 
                        class="form-control"
                        [(ngModel)]="feature.description"
                        placeholder="Describe in detail what this requirement should accomplish. Be specific about the expected behavior and functionality."
                        rows="4"></textarea>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Tell Us More About It</label>
                      <textarea 
                        class="form-control"
                        [(ngModel)]="feature.detailedDescription"
                        placeholder="Provide additional context, background information, use cases, or any other relevant details that help understand this requirement better."
                        rows="4"></textarea>
                    </div>

                    <div class="form-group">
                      <label class="form-label">User Story (Optional)</label>
                      <textarea 
                        class="form-control"
                        [(ngModel)]="feature.userStory"
                        placeholder="As a [type of user], I want [goal/desire] so that [benefit/value]"
                        rows="2"></textarea>
                    </div>

                    <div class="form-grid">
                      <div class="form-group">
                        <label class="form-label">Status</label>
                        <select class="form-control" [(ngModel)]="feature.status">
                          <option value="draft">Draft</option>
                          <option value="review">Under Review</option>
                          <option value="approved">Approved</option>
                          <option value="in-progress">In Progress</option>
                          <option value="testing">Testing</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      <div class="form-group">
                        <label class="form-label">Estimated Effort</label>
                        <select class="form-control" [(ngModel)]="feature.estimatedEffort">
                          <option value="xs">XS - 1-2 hours</option>
                          <option value="s">S - 1-2 days</option>
                          <option value="m">M - 3-5 days</option>
                          <option value="l">L - 1-2 weeks</option>
                          <option value="xl">XL - 2-4 weeks</option>
                          <option value="xxl">XXL - 1+ months</option>
                        </select>
                      </div>
                    </div>

                    <!-- Acceptance Criteria -->
                    <div class="form-group">
                      <label class="form-label">Acceptance Criteria</label>
                      <div class="criteria-list">
                        <div *ngFor="let criteria of feature.acceptanceCriteria; let j = index" class="criteria-item">
                          <div class="criteria-input">
                            <input 
                              type="text" 
                              class="form-control"
                              [(ngModel)]="feature.acceptanceCriteria[j]"
                              placeholder="Given [context], when [action], then [outcome]">
                            <button 
                              class="btn btn-danger btn-sm"
                              (click)="removeAcceptanceCriteria(feature, j)">
                              ×
                            </button>
                          </div>
                        </div>
                        <button 
                          class="btn btn-outline btn-sm"
                          (click)="addAcceptanceCriteria(feature)">
                          + Add Acceptance Criteria
                        </button>
                      </div>
                    </div>

                    <!-- Business Rules -->
                    <div class="form-group">
                      <label class="form-label">Business Rules</label>
                      <div class="rules-list">
                        <div *ngFor="let rule of feature.businessRules; let k = index" class="rule-item">
                          <div class="rule-input">
                            <input 
                              type="text" 
                              class="form-control"
                              [(ngModel)]="feature.businessRules[k]"
                              placeholder="Business rule or constraint">
                            <button 
                              class="btn btn-danger btn-sm"
                              (click)="removeBusinessRule(feature, k)">
                              ×
                            </button>
                          </div>
                        </div>
                        <button 
                          class="btn btn-outline btn-sm"
                          (click)="addBusinessRule(feature)">
                          + Add Business Rule
                        </button>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Testing Notes</label>
                      <textarea 
                        class="form-control"
                        [(ngModel)]="feature.testingNotes"
                        placeholder="Special testing considerations, test data requirements, or testing approach for this requirement"
                        rows="3"></textarea>
                    </div>
                  </div>
                  
                  <div class="feature-actions">
                    <button 
                      class="btn btn-danger btn-sm"
                      (click)="removeFeature(i)">
                      Remove Requirement
                    </button>
                  </div>
                </div>

                <!-- Empty state -->
                <div *ngIf="features().length === 0" class="empty-state">
                  <div class="empty-icon">⚡</div>
                  <h4>No Requirements Defined</h4>
                  <p>Start building your project by adding functional and non-functional requirements.</p>
                  <button class="btn btn-primary" (click)="addFeature()">
                    Add First Requirement
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Success Criteria Tab -->
          <div *ngIf="activeTab() === 'success-criteria'" class="tab-content">
            <div class="section">
              <h3 class="section-title">Testing & Quality Assurance</h3>
              <div class="form-grid">
                <div class="form-group span-2">
                  <label class="form-label">User Testing Plan</label>
                  <textarea 
                    class="form-control"
                    [(ngModel)]="successCriteria().userTestingPlan"
                    placeholder="Describe user testing approach and methodology"
                    rows="4"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Performance Requirements</label>
                  <textarea 
                    class="form-control"
                    [(ngModel)]="successCriteria().performanceRequirements"
                    placeholder="Define performance benchmarks"
                    rows="3"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Security Requirements</label>
                  <textarea 
                    class="form-control"
                    [(ngModel)]="successCriteria().securityRequirements"
                    placeholder="Security standards and requirements"
                    rows="3"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Download Tab -->
          <div *ngIf="activeTab() === 'download'" class="tab-content">
            <div class="section">
              <h3 class="section-title">Export Project Documentation</h3>
              
              <!-- Project Summary Stats -->
              <div class="summary-stats">
                <div class="stat-card">
                  <div class="stat-number">{{ getTotalRequirements() }}</div>
                  <div class="stat-label">Total Requirements</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ getHighPriorityCount() }}</div>
                  <div class="stat-label">High Priority</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ getFunctionalCount() }}</div>
                  <div class="stat-label">Functional</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ getNonFunctionalCount() }}</div>
                  <div class="stat-label">Non-Functional</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ getCompletionPercentage() }}%</div>
                  <div class="stat-label">Complete</div>
                </div>
              </div>

              <!-- Export Options -->
              <div class="export-grid">
                <div class="export-card">
                  <div class="export-icon">📄</div>
                  <h4>JSON Export</h4>
                  <p>Complete project data in structured JSON format for developers and system integration</p>
                  <button 
                    class="btn btn-primary"
                    (click)="exportProject('json')">
                    Download JSON
                  </button>
                </div>

                <div class="export-card">
                  <div class="export-icon">📋</div>
                  <h4>Text Report</h4>
                  <p>Comprehensive human-readable project specification document with all details</p>
                  <button 
                    class="btn btn-secondary"
                    (click)="exportProject('txt')">
                    Download Report
                  </button>
                </div>

                <div class="export-card">
                  <div class="export-icon">📕</div>
                  <h4>PDF Document</h4>
                  <p>Professional formatted document suitable for stakeholder reviews and presentations</p>
                  <button 
                    class="btn btn-primary"
                    (click)="exportProject('pdf')">
                    Generate PDF
                  </button>
                </div>

                <div class="export-card">
                  <div class="export-icon">📘</div>
                  <h4>Word Document</h4>
                  <p>Editable document format for collaborative review and further documentation</p>
                  <button 
                    class="btn btn-primary"
                    (click)="exportProject('word')">
                    Generate Word Doc
                  </button>
                </div>

                <div class="export-card">
                  <div class="export-icon">📦</div>
                  <h4>Complete Package</h4>
                  <p>All project data, requirements, and documentation in a single downloadable package</p>
                  <button 
                    class="btn btn-success"
                    (click)="exportProject('package')">
                    Download Package
                  </button>
                </div>
              </div>

              <!-- Export History -->
              <div class="section">
                <h4 class="section-subtitle">Export History</h4>
                <div class="export-history">
                  <div class="history-item">
                    <span class="history-date">{{ getCurrentDate() }}</span>
                    <span class="history-action">Last saved automatically</span>
                    <span class="history-status">✓ Current</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <!-- Right Sidebar -->
      <aside class="right-sidebar">
        <div class="sidebar-section">
          <h3 class="section-title">Project Summary</h3>
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-label">Total Features</span>
              <span class="stat-value">{{ features().length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">High Priority</span>
              <span class="stat-value">{{ getHighPriorityCount() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Completion</span>
              <span class="stat-value">{{ getCompletionPercentage() }}%</span>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="getCompletionPercentage()"></div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3 class="section-title">Quick Actions</h3>
          <div class="action-buttons">
            <button class="action-btn" (click)="autoSave()">
              💾 Auto Save
            </button>
            <button class="action-btn" (click)="validateProject()">
              ✅ Validate
            </button>
            <button class="action-btn" (click)="exportProject('json')">
              📤 Export
            </button>
          </div>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      height: 100vh;
      background: #f8fafc;
    }

    /* Left Sidebar */
    .sidebar {
      width: 320px;
      background: white;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 64px;
      height: calc(100vh - 64px);
      overflow-y: auto;
      z-index: 10;
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .sidebar-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sidebar-subtitle {
      margin: 0.25rem 0 0 0;
      font-size: 0.875rem;
      color: #64748b;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1.5rem;
      border: none;
      background: none;
      color: #64748b;
      font-size: 0.875rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }

    .nav-item:hover {
      background: #f1f5f9;
      color: #334155;
    }

    .nav-item.active {
      background: #3b82f6;
      color: white;
      border-right: 3px solid #2563eb;
    }

    .nav-icon {
      font-size: 1rem;
      width: 1.25rem;
      text-align: center;
    }

    .nav-label {
      font-weight: 500;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    .user-details {
      flex: 1;
    }

    .user-name {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 500;
      color: #1e293b;
    }

    .user-role {
      margin: 0;
      font-size: 0.75rem;
      color: #64748b;
    }

    .settings-btn {
      border: none;
      background: none;
      color: #64748b;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      transition: background 0.2s;
    }

    .settings-btn:hover {
      background: #f1f5f9;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      margin-left: 320px;
      margin-right: 320px;
      margin-top: 64px;
      height: calc(100vh - 64px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .content-header {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
    }

    .content-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
    }

    .content-actions {
      display: flex;
      gap: 0.75rem;
    }

    .content-body {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
      min-height: 0;
    }

    /* Right Sidebar */
    .right-sidebar {
      width: 320px;
      background: white;
      border-left: 1px solid #e2e8f0;
      position: fixed;
      right: 0;
      top: 64px;
      height: calc(100vh - 64px);
      overflow-y: auto;
      z-index: 10;
    }

    .sidebar-section {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .summary-stats {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
    }

    .stat-label {
      color: #64748b;
    }

    .stat-value {
      font-weight: 600;
      color: #1e293b;
    }

    .progress-bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #3b82f6;
      transition: width 0.3s ease;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .action-btn {
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      background: white;
      color: #374151;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }

    .action-btn:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    /* Content Sections */
    .section {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .section-title {
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    /* Forms */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group.span-2 {
      grid-column: span 2;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      color: #374151;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: 1px solid transparent;
      border-radius: 0.375rem;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .btn-outline {
      border-color: #d1d5db;
      color: #374151;
    }

    .btn-outline:hover {
      background: #f9fafb;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
    }

    /* Features */
    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .feature-card {
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 1.5rem;
      background: #f8fafc;
    }

    .feature-header {
      margin-bottom: 1rem;
    }

    .feature-body {
      margin-bottom: 1rem;
    }

    .feature-actions {
      display: flex;
      justify-content: flex-end;
    }

    /* Export */
    .export-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .export-card {
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 1.5rem;
      text-align: center;
    }

    .export-card h4 {
      margin: 0 0 0.5rem 0;
      color: #1e293b;
    }

    .export-card p {
      margin: 0 0 1rem 0;
      color: #64748b;
      font-size: 0.875rem;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .sidebar, .right-sidebar {
        display: none;
      }
      
      .main-content {
        margin-left: 0;
        margin-right: 0;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .form-group.span-2 {
        grid-column: span 1;
      }
    }

    /* Data Fields & Features Specific Styles */
    .data-fields-list,
    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .data-field-card,
    .feature-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .field-header,
    .feature-header {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .field-body,
    .feature-body {
      margin-bottom: 1rem;
    }

    .field-actions,
    .feature-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .criteria-list,
    .rules-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .criteria-item,
    .rule-item {
      display: flex;
      gap: 0.5rem;
    }

    .criteria-input,
    .rule-input {
      display: flex;
      gap: 0.5rem;
      flex: 1;
    }

    .criteria-input .form-control,
    .rule-input .form-control {
      flex: 1;
    }

    .criteria-input .btn,
    .rule-input .btn {
      padding: 0.5rem;
      min-width: 2rem;
      height: 2.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 0.5rem;
      color: #64748b;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-state h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      color: #374151;
    }

    .empty-state p {
      margin: 0 0 1.5rem 0;
      font-size: 0.875rem;
    }

    /* Download Section Styles */
    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .export-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .export-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 2rem;
      text-align: center;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .export-card:hover {
      border-color: #3b82f6;
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
      transform: translateY(-2px);
    }

    .export-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .export-card h4 {
      margin: 0 0 0.75rem 0;
      font-size: 1.25rem;
      color: #1e293b;
    }

    .export-card p {
      margin: 0 0 1.5rem 0;
      color: #64748b;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .section-subtitle {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
    }

    .export-history {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 1rem;
    }

    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .history-item:last-child {
      border-bottom: none;
    }

    .history-date {
      font-weight: 500;
      color: #374151;
    }

    .history-action {
      color: #64748b;
      font-size: 0.875rem;
    }

    .history-status {
      color: #059669;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .btn-success {
      background: #059669;
      color: white;
    }

    .btn-success:hover {
      background: #047857;
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Signals for reactive state
  activeTab = signal('basic-info');
  
  project = signal<Project>({
    id: '1',
    title: 'E-Commerce Platform Requirements',
    version: '1.0.0',
    startDate: '2024-01-15',
    author: 'John Smith',
    description: 'Comprehensive requirements for a modern e-commerce platform with advanced features',
    status: 'active'
  });

  stakeholders = signal<Stakeholder[]>([
    {
      id: '1',
      name: 'John Smith',
      role: 'Product Manager',
      type: 'primary',
      email: 'john.smith@company.com',
      phone: '+1-555-0123'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      role: 'UX Designer',
      type: 'secondary',
      email: 'sarah.wilson@company.com',
      phone: '+1-555-0124'
    }
  ]);

  whatWeNeed = signal<WhatWeNeed>({
    userExperienceGoals: 'Create an intuitive, fast, and accessible shopping experience that works seamlessly across all devices.',
    whatsIncluded: 'User authentication system, product catalog management, shopping cart functionality, secure payment processing, order management, user profile management, product search and filtering, inventory tracking, basic reporting dashboard.',
    whatsNotIncluded: 'Mobile application development, advanced analytics dashboard, third-party marketplace integrations, social media login, subscription management, multi-language support, advanced recommendation engine.',
    keyAssumptionsAndDependencies: 'Users have basic internet literacy and access to modern web browsers. Payment gateway APIs (Stripe/PayPal) are available and reliable. Client will provide initial product data and maintain inventory information. Email service provider integration is available for notifications.',
    dataStorageNeeds: 'User account information (name, email, preferences), product catalog data (descriptions, prices, images, inventory), order history, shopping cart contents, payment transaction records, user reviews and ratings, audit logs for security compliance.',
    externalServicesIntegrations: 'Stripe Payment Gateway for secure payment processing, SendGrid for transactional email notifications, AWS S3 for image and file storage, Google Analytics for basic usage tracking, Address validation API for shipping addresses.',
    businessGoals: 'Increase online sales by 40%, improve customer satisfaction scores, reduce cart abandonment rates, streamline order processing workflow, establish foundation for future digital expansion.',
    successMetrics: 'Page load time under 3 seconds, 99.9% uptime, conversion rate increase of 25%, customer satisfaction rating above 4.5 stars, zero critical security vulnerabilities.',
    timelineExpectations: '6 months development timeline with 3 major milestones: MVP (2 months), Beta testing (1 month), Full launch (3 months)',
    budgetConstraints: 'Development budget of $150,000, monthly operational costs under $2,000, ROI target of 300% within first year',
    technicalConstraints: 'Must be responsive and work on IE11+, comply with WCAG 2.1 accessibility standards, support 1000+ concurrent users, integrate with existing WordPress website, use client-approved tech stack (React, Node.js, PostgreSQL)',
    scopeIncluded: ['User authentication', 'Product catalog', 'Shopping cart', 'Payment processing', 'Order management'],
    scopeExcluded: ['Mobile app development', 'Third-party marketplace integration', 'Advanced analytics dashboard'],
    keyAssumptions: ['Users have basic internet literacy', 'Payment gateway APIs are available', 'Product data is provided by client'],
    dependencies: ['Payment gateway integration', 'Inventory management system', 'Email service provider'],
    dataIntegrationNeeds: 'Integration with payment gateways, inventory management, and customer relationship management systems.',
    externalServices: ['Stripe Payment Gateway', 'SendGrid Email Service', 'AWS S3 Storage', 'Google Analytics']
  });

  dataFields = signal<DataField[]>([
    {
      id: '1',
      name: 'firstName',
      displayLabel: 'First Name',
      uiControl: 'text',
      dataType: 'string',
      placeholderText: 'Enter your first name',
      defaultValue: '',
      maxLength: 50,
      required: true,
      validationRules: 'Required, Min 2 characters, Letters only',
      description: 'User\'s legal first name for account creation',
      options: [],
      optionsText: ''
    },
    {
      id: '2',
      name: 'email',
      displayLabel: 'Email Address',
      uiControl: 'email',
      dataType: 'email',
      placeholderText: 'Enter your email address',
      defaultValue: '',
      maxLength: 100,
      required: true,
      validationRules: 'Required, Valid email format, Unique in system',
      description: 'Primary contact email for user account and notifications',
      options: [],
      optionsText: ''
    }
  ]);

  features = signal<Feature[]>([
    {
      id: '1',
      title: 'User Authentication System',
      type: 'functional',
      priority: 'critical',
      description: 'Secure user registration, login, and profile management',
      detailedDescription: 'A comprehensive authentication system that handles user registration, login, password management, and profile updates. Must integrate with existing security standards and provide secure session management.',
      userStory: 'As a customer, I want to create an account and log in securely so that I can track my orders and save my preferences.',
      acceptanceCriteria: [
        'User can register with email and password',
        'User can log in with valid credentials',
        'Password reset functionality works',
        'User profile can be updated'
      ],
      businessRules: [
        'Passwords must be at least 8 characters',
        'Email addresses must be unique',
        'Users must verify email before full access'
      ],
      testingNotes: 'Test with various email formats and password combinations. Verify security against common attacks.',
      status: 'approved',
      estimatedEffort: 'l'
    },
    {
      id: '2', 
      title: 'Product Search and Filtering',
      type: 'functional',
      priority: 'high',
      description: 'Advanced search functionality with filters and sorting options',
      detailedDescription: 'Implement a robust search engine with intelligent filtering, faceted search, autocomplete suggestions, and advanced sorting capabilities. Should handle large product catalogs efficiently.',
      userStory: 'As a customer, I want to search for products and filter results so that I can quickly find what I am looking for.',
      acceptanceCriteria: [
        'Search returns relevant results',
        'Filters work correctly',
        'Sort options function properly',
        'Search is fast and responsive'
      ],
      businessRules: [
        'Search results should be ranked by relevance',
        'Out-of-stock items shown but marked',
        'Search history saved for logged-in users'
      ],
      testingNotes: 'Test search performance with large product catalogs. Verify relevance ranking algorithm.',
      status: 'in-progress',
      estimatedEffort: 'xl'
    }
  ]);

  successCriteria = signal<SuccessCriteria>({
    userTestingPlan: 'Conduct usability testing with target users, A/B testing for key features, and accessibility testing compliance.',
    dataQualityRules: 'All user data must be validated, product information must be accurate and up-to-date, order data must be consistent across systems.',
    performanceRequirements: 'Page load times under 2 seconds, 99.9% uptime, support for 10,000 concurrent users.',
    securityRequirements: 'HTTPS encryption, PCI DSS compliance, secure payment processing, data privacy compliance.',
    accessibilityStandards: ['WCAG 2.1 AA', 'Section 508', 'ADA Compliance'],
    browserCompatibility: ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+'],
    deviceCompatibility: ['Desktop 1920x1080+', 'Tablet 768x1024+', 'Mobile 375x667+']
  });

  tabs = [
    { id: 'basic-info', label: 'Basic Info', icon: '📋' },
    { id: 'what-we-need', label: 'What We Need', icon: '🎯' },
    { id: 'data-fields', label: 'Data Fields', icon: '📊' },
    { id: 'features', label: 'Features', icon: '⚡' },
    { id: 'success-criteria', label: 'Success Criteria', icon: '✅' },
    { id: 'download', label: 'Download', icon: '⬇️' }
  ];

  ngOnInit() {
    console.log('Project Detail Component initialized');
  }

  setActiveTab(tabId: string) {
    this.activeTab.set(tabId);
  }

  addFeature() {
    const currentFeatures = this.features();
    const newFeature: Feature = {
      id: Date.now().toString(),
      title: '',
      type: 'functional',
      priority: 'medium',
      description: '',
      detailedDescription: '',
      userStory: '',
      acceptanceCriteria: [''],
      businessRules: [''],
      testingNotes: '',
      status: 'draft',
      estimatedEffort: 'm'
    };
    this.features.set([...currentFeatures, newFeature]);
  }

  addStakeholder() {
    const currentStakeholders = this.stakeholders();
    const newStakeholder: Stakeholder = {
      id: Date.now().toString(),
      name: '',
      role: '',
      type: 'secondary',
      email: '',
      phone: ''
    };
    this.stakeholders.set([...currentStakeholders, newStakeholder]);
  }

  addDataField() {
    const currentFields = this.dataFields();
    const newField: DataField = {
      id: Date.now().toString(),
      name: '',
      displayLabel: '',
      uiControl: 'text',
      dataType: 'string',
      placeholderText: '',
      defaultValue: '',
      maxLength: 255,
      required: false,
      validationRules: '',
      description: '',
      options: [],
      optionsText: ''
    };
    this.dataFields.set([...currentFields, newField]);
  }

  updateFieldOptions(field: DataField, optionsText: string) {
    field.optionsText = optionsText;
    field.options = optionsText.split('\n').filter(option => option.trim().length > 0).map(option => option.trim());
  }

  addAcceptanceCriteria(feature: Feature) {
    feature.acceptanceCriteria.push('');
  }

  removeAcceptanceCriteria(feature: Feature, index: number) {
    feature.acceptanceCriteria.splice(index, 1);
  }

  addBusinessRule(feature: Feature) {
    feature.businessRules.push('');
  }

  removeBusinessRule(feature: Feature, index: number) {
    feature.businessRules.splice(index, 1);
  }

  removeFeature(index: number) {
    const currentFeatures = this.features();
    currentFeatures.splice(index, 1);
    this.features.set([...currentFeatures]);
  }

  removeStakeholder(index: number) {
    const currentStakeholders = this.stakeholders();
    currentStakeholders.splice(index, 1);
    this.stakeholders.set([...currentStakeholders]);
  }

  removeDataField(index: number) {
    const currentFields = this.dataFields();
    currentFields.splice(index, 1);
    this.dataFields.set([...currentFields]);
  }

  getHighPriorityCount(): number {
    return this.features().filter(f => f.priority === 'critical' || f.priority === 'high').length;
  }

  getFunctionalCount(): number {
    return this.features().filter(f => f.type === 'functional').length;
  }

  getNonFunctionalCount(): number {
    return this.features().filter(f => f.type === 'non-functional').length;
  }

  getCompletionPercentage(): number {
    const features = this.features();
    if (features.length === 0) return 0;
    const completed = features.filter(f => f.status === 'completed' || f.status === 'approved').length;
    return Math.round((completed / features.length) * 100);
  }

  getTotalRequirements(): number {
    return this.features().length + this.dataFields().length;
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }

  autoSave() {
    console.log('Auto-saving project...');
    // Implement auto-save logic
  }

  validateProject() {
    console.log('Validating project...');
    // Implement validation logic
  }

  exportProject(format: 'json' | 'txt' | 'pdf' | 'word' | 'package') {
    const projectData = {
      project: this.project(),
      stakeholders: this.stakeholders(),
      whatWeNeed: this.whatWeNeed(),
      dataFields: this.dataFields(),
      features: this.features(),
      successCriteria: this.successCriteria(),
      summary: {
        totalRequirements: this.getTotalRequirements(),
        highPriority: this.getHighPriorityCount(),
        functional: this.getFunctionalCount(),
        nonFunctional: this.getNonFunctionalCount(),
        completion: this.getCompletionPercentage()
      }
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'json':
        content = JSON.stringify(projectData, null, 2);
        filename = `${this.project().title || 'project'}-specification.json`;
        mimeType = 'application/json';
        break;
      case 'txt':
        content = this.generateTextReport(projectData);
        filename = `${this.project().title || 'project'}-specification.txt`;
        mimeType = 'text/plain';
        break;
      case 'pdf':
        // For PDF, we would need a PDF library like jsPDF
        alert('PDF export functionality coming soon!');
        return;
      case 'word':
        // For Word, we would need a library like docx
        alert('Word export functionality coming soon!');
        return;
      case 'package':
        content = JSON.stringify(projectData, null, 2);
        filename = `${this.project().title || 'project'}-complete-package.json`;
        mimeType = 'application/json';
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateTextReport(data: any): string {
    let report = '';
    
    // Project Information
    report += '='.repeat(60) + '\n';
    report += `PROJECT SPECIFICATION DOCUMENT\n`;
    report += '='.repeat(60) + '\n\n';
    
    report += `Project Title: ${data.project.title}\n`;
    report += `Description: ${data.project.description}\n`;
    report += `Start Date: ${data.project.startDate || 'Not specified'}\n`;
    report += `End Date: ${data.project.endDate || 'Not specified'}\n`;
    report += `Status: ${data.project.status}\n`;
    report += `Priority: ${data.project.priority}\n\n`;

    // Stakeholders
    if (data.stakeholders && data.stakeholders.length > 0) {
      report += 'STAKEHOLDERS\n';
      report += '-'.repeat(40) + '\n';
      data.stakeholders.forEach((stakeholder: any, index: number) => {
        report += `${index + 1}. ${stakeholder.name} (${stakeholder.role})\n`;
        report += `   Email: ${stakeholder.email}\n`;
        report += `   Department: ${stakeholder.department}\n`;
        report += `   Responsibilities: ${stakeholder.responsibilities}\n\n`;
      });
    }

    // What We Need
    if (data.whatWeNeed) {
      report += 'WHAT WE NEED\n';
      report += '-'.repeat(40) + '\n';
      report += `User Experience Goals: ${data.whatWeNeed.userExperienceGoals}\n`;
      report += `Business Goals: ${data.whatWeNeed.businessGoals}\n`;
      report += `Scope Definition: ${data.whatWeNeed.scopeDefinition}\n`;
      report += `Key Constraints: ${data.whatWeNeed.keyConstraints}\n`;
      report += `Success Metrics: ${data.whatWeNeed.successMetrics}\n`;
      report += `Timeline Expectations: ${data.whatWeNeed.timelineExpectations}\n`;
      report += `Budget Constraints: ${data.whatWeNeed.budgetConstraints}\n`;
      report += `Technical Constraints: ${data.whatWeNeed.technicalConstraints}\n`;
      report += `External Dependencies: ${data.whatWeNeed.externalDependencies}\n`;
      report += `Compliance Requirements: ${data.whatWeNeed.complianceRequirements}\n\n`;
    }

    // Data Fields
    if (data.dataFields && data.dataFields.length > 0) {
      report += 'DATA FIELDS\n';
      report += '-'.repeat(40) + '\n';
      data.dataFields.forEach((field: any, index: number) => {
        report += `${index + 1}. ${field.name} (${field.type})\n`;
        report += `   Description: ${field.description}\n`;
        report += `   Required: ${field.required ? 'Yes' : 'No'}\n`;
        report += `   Default Value: ${field.defaultValue || 'None'}\n`;
        if (field.validationRules) {
          report += `   Validation: ${field.validationRules}\n`;
        }
        if (field.options && field.options.length > 0) {
          report += `   Options: ${field.options.join(', ')}\n`;
        }
        report += '\n';
      });
    }

    // Features
    if (data.features && data.features.length > 0) {
      report += 'FEATURES\n';
      report += '-'.repeat(40) + '\n';
      data.features.forEach((feature: any, index: number) => {
        report += `${index + 1}. ${feature.title}\n`;
        report += `   Description: ${feature.description}\n`;
        report += `   Priority: ${feature.priority}\n`;
        report += `   Status: ${feature.status}\n`;
        report += `   Type: ${feature.type}\n`;
        report += `   Estimated Effort: ${feature.estimatedEffort}\n`;
        if (feature.acceptanceCriteria && feature.acceptanceCriteria.length > 0) {
          report += `   Acceptance Criteria:\n`;
          feature.acceptanceCriteria.forEach((criteria: string, i: number) => {
            report += `     - ${criteria}\n`;
          });
        }
        if (feature.businessRules && feature.businessRules.length > 0) {
          report += `   Business Rules:\n`;
          feature.businessRules.forEach((rule: string, i: number) => {
            report += `     - ${rule}\n`;
          });
        }
        if (feature.testingNotes) {
          report += `   Testing Notes: ${feature.testingNotes}\n`;
        }
        report += '\n';
      });
    }

    // Success Criteria
    if (data.successCriteria && data.successCriteria.length > 0) {
      report += 'SUCCESS CRITERIA\n';
      report += '-'.repeat(40) + '\n';
      data.successCriteria.forEach((criteria: any, index: number) => {
        report += `${index + 1}. ${criteria.title}\n`;
        report += `   Description: ${criteria.description}\n`;
        report += `   Metric: ${criteria.metric}\n`;
        report += `   Target Value: ${criteria.targetValue}\n`;
        report += `   Measurement Method: ${criteria.measurementMethod}\n`;
        report += `   Timeframe: ${criteria.timeframe}\n`;
        report += `   Priority: ${criteria.priority}\n`;
        report += `   Owner: ${criteria.owner}\n`;
        report += `   Status: ${criteria.status}\n\n`;
      });
    }

    // Summary Statistics
    if (data.summary) {
      report += 'PROJECT SUMMARY\n';
      report += '-'.repeat(40) + '\n';
      report += `Total Requirements: ${data.summary.totalRequirements}\n`;
      report += `High Priority Items: ${data.summary.highPriority}\n`;
      report += `Functional Requirements: ${data.summary.functional}\n`;
      report += `Non-Functional Requirements: ${data.summary.nonFunctional}\n`;
      report += `Completion Percentage: ${data.summary.completion}%\n\n`;
    }

    report += '='.repeat(60) + '\n';
    report += `Generated on: ${new Date().toLocaleString()}\n`;
    report += '='.repeat(60);

    return report;
  }
}
