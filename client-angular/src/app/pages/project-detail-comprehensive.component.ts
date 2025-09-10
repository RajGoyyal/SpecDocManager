import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface Project {
  id: string;
  title: string;
  version: string;
  startDate: string;
  endDate: string;
  author: string;
  description: string;
  status: 'planning' | 'active' | 'testing' | 'review' | 'completed' | 'on-hold';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  type: 'primary' | 'secondary' | 'reviewer' | 'user' | 'technical';
  email: string;
  phone: string;
  department: string;
  responsibilities: string;
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

        <!-- Project Summary Section -->
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

        <!-- Quick Actions Section -->
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
          <p class="content-subtitle">Professional Requirements Management System</p>
        </div>

        <div class="content-body">
          
          <!-- Basic Info Tab -->
          <div *ngIf="activeTab() === 'basic-info'" class="tab-content">
            
            <!-- Project Overview -->
            <div class="section">
              <h3 class="section-title">📋 Project Overview</h3>
              <div class="form-grid">
                <div class="form-group span-full">
                  <label for="title" class="form-label">Project Title</label>
                  <input 
                    id="title"
                    type="text" 
                    class="form-control enhanced"
                    [(ngModel)]="project().title"
                    placeholder="Enter a descriptive project title">
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
                  <label for="status" class="form-label">Project Status</label>
                  <select id="status" class="form-control" [(ngModel)]="project().status">
                    <option value="planning">📝 Planning</option>
                    <option value="active">🚀 Active Development</option>
                    <option value="testing">🧪 Testing Phase</option>
                    <option value="review">👀 Under Review</option>
                    <option value="completed">✅ Completed</option>
                    <option value="on-hold">⏸️ On Hold</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="priority" class="form-label">Project Priority</label>
                  <select id="priority" class="form-control" [(ngModel)]="project().priority">
                    <option value="critical">🔴 Critical</option>
                    <option value="high">🟡 High Priority</option>
                    <option value="medium">🟢 Medium Priority</option>
                    <option value="low">🔵 Low Priority</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="startDate" class="form-label">Start Date</label>
                  <input 
                    id="startDate"
                    type="date" 
                    class="form-control"
                    [(ngModel)]="project().startDate">
                </div>
                <div class="form-group">
                  <label for="endDate" class="form-label">Target End Date</label>
                  <input 
                    id="endDate"
                    type="date" 
                    class="form-control"
                    [(ngModel)]="project().endDate">
                </div>
                <div class="form-group span-full">
                  <label for="description" class="form-label">Project Description</label>
                  <textarea 
                    id="description"
                    class="form-control enhanced"
                    [(ngModel)]="project().description"
                    placeholder="Provide a comprehensive description of the project goals, scope, and expected outcomes"
                    rows="4"></textarea>
                </div>
              </div>
            </div>

            <!-- Team & Stakeholders -->
            <div class="section">
              <div class="section-header">
                <h3 class="section-title">👥 Team & Stakeholders</h3>
                <button class="btn btn-primary" (click)="addStakeholder()">
                  <span class="icon">+</span>
                  Add Stakeholder
                </button>
              </div>
              
              <div class="stakeholder-grid">
                <div *ngFor="let stakeholder of stakeholders(); let i = index" class="stakeholder-card">
                  <div class="stakeholder-header">
                    <div class="stakeholder-avatar">
                      {{ stakeholder.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="stakeholder-info">
                      <input 
                        type="text" 
                        class="form-control stakeholder-name"
                        [(ngModel)]="stakeholder.name"
                        placeholder="Full Name">
                      <input 
                        type="text" 
                        class="form-control stakeholder-role"
                        [(ngModel)]="stakeholder.role"
                        placeholder="Role/Title">
                    </div>
                    <button 
                      class="btn btn-danger btn-sm"
                      (click)="removeStakeholder(i)">
                      ×
                    </button>
                  </div>
                  <div class="stakeholder-details">
                    <div class="form-grid">
                      <div class="form-group">
                        <label class="form-label">Email</label>
                        <input 
                          type="email" 
                          class="form-control"
                          [(ngModel)]="stakeholder.email"
                          placeholder="email@company.com">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Phone</label>
                        <input 
                          type="tel" 
                          class="form-control"
                          [(ngModel)]="stakeholder.phone"
                          placeholder="+1 (555) 123-4567">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Department</label>
                        <input 
                          type="text" 
                          class="form-control"
                          [(ngModel)]="stakeholder.department"
                          placeholder="Department/Division">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Stakeholder Type</label>
                        <select class="form-control" [(ngModel)]="stakeholder.type">
                          <option value="primary">Primary Decision Maker</option>
                          <option value="secondary">Secondary Stakeholder</option>
                          <option value="reviewer">Reviewer/Approver</option>
                          <option value="user">End User</option>
                          <option value="technical">Technical Lead</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Responsibilities</label>
                      <textarea 
                        class="form-control"
                        [(ngModel)]="stakeholder.responsibilities"
                        placeholder="Describe their role and responsibilities in this project"
                        rows="2"></textarea>
                    </div>
                  </div>
                </div>

                <!-- Empty state -->
                <div *ngIf="stakeholders().length === 0" class="empty-state">
                  <div class="empty-icon">👥</div>
                  <h4>No Team Members Added</h4>
                  <p>Add team members and stakeholders to track project responsibilities and communication.</p>
                  <button class="btn btn-primary" (click)="addStakeholder()">
                    Add First Team Member
                  </button>
                </div>
              </div>
            </div>

            <!-- Project Metrics & KPIs -->
            <div class="section">
              <h3 class="section-title">📊 Project Metrics & KPIs</h3>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-icon">📈</div>
                  <div class="metric-content">
                    <div class="metric-value">{{ getTotalRequirements() }}</div>
                    <div class="metric-label">Total Requirements</div>
                  </div>
                </div>
                <div class="metric-card">
                  <div class="metric-icon">⚡</div>
                  <div class="metric-content">
                    <div class="metric-value">{{ getHighPriorityCount() }}</div>
                    <div class="metric-label">High Priority Items</div>
                  </div>
                </div>
                <div class="metric-card">
                  <div class="metric-icon">✅</div>
                  <div class="metric-content">
                    <div class="metric-value">{{ getCompletionPercentage() }}%</div>
                    <div class="metric-label">Project Completion</div>
                  </div>
                </div>
                <div class="metric-card">
                  <div class="metric-icon">👥</div>
                  <div class="metric-content">
                    <div class="metric-value">{{ stakeholders().length }}</div>
                    <div class="metric-label">Team Members</div>
                  </div>
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
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex; /* Use flex for proper sidebar + content layout */
      height: 100vh;
      width: 100vw; /* Full viewport width */
      background: #ffffff; /* unify workspace background */
      position: relative;
      overflow-x: hidden; /* Prevent horizontal scroll */
    }

    /* Left Sidebar - Fixed Width */
    .sidebar {
      width: 380px; /* Fixed sidebar width */
      background: #fafbfc; /* Subtle background differentiation */
      border-right: 1px solid #e2e8f0; /* Subtle separator */
      display: flex;
      flex-direction: column;
      flex-shrink: 0; /* Don't shrink the sidebar */
      height: 100vh; /* Full height */
      overflow-y: auto;
      z-index: 10;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04); /* Subtle depth */
    }

    .sidebar-header {
      padding: 1.25rem 1.5rem; /* slightly tighter */
      border-bottom: none; /* remove separation line */
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
      padding: 0.5rem 0; /* tighter to blend with header */
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.6rem 1.25rem; /* slightly tighter */
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

    /* Main Content - Starts Right After Sidebar */
    .main-content {
      flex: 1; /* Take remaining space */
      margin-left: 0; /* No margin needed with flex layout */
      margin-right: 0;
      margin-top: 0; /* No top margin needed */
      display: flex;
      flex-direction: column;
      position: relative;
      background: #ffffff;
      /* Take all available width after sidebar */
      width: 100%;
      max-width: none;
      min-width: 0;
      height: 100vh; /* Full height */
      overflow-y: auto; /* Allow content scrolling */
    }

    .content-header {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); /* Subtle gradient */
      border-bottom: 1px solid #e2e8f0; /* Subtle separator */
      padding: 2rem 3rem 1.5rem 2rem; /* Good padding for content */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start; /* Left align the header content */
      text-align: left; /* Left align the text in header */
      width: 100%;
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Subtle shadow */
      color: #0f172a;
      flex-shrink: 0;
    }

    .content-title {
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem; /* Larger for better hierarchy */
      font-weight: 800; /* Bolder */
      color: #0f172a;
      text-align: left !important; /* Left align the main title */
      align-self: flex-start; /* Left align in flex container */
      background: linear-gradient(135deg, #1e293b, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .content-subtitle {
      margin: 0 0 1rem 0;
      font-size: 1.125rem; /* Slightly larger */
      opacity: 0.8;
      color: #475569; /* Better contrast */
      text-align: left !important; /* Left align the subtitle */
      align-self: flex-start; /* Left align in flex container */
      font-weight: 500;
    }

    .content-body {
      flex: 1;
      padding: 0;
      /* Remove overflow-y: auto to prevent separate scroll area */
      /* Remove min-height: 0 constraint */
      background: #ffffff; /* unify with header/sidebar */
    }

    .sidebar-section {
      padding: 1.25rem 1.5rem;
      border-bottom: none; /* remove separators */
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

    /* Content Sections - Properly Aligned */
    .tab-content {
      padding: 2rem 3rem 3rem 2rem; /* Consistent padding with header */
      margin: 0; /* No margin - start immediately */
      max-width: none;
      width: 100%;
      height: auto;
      min-height: auto;
      box-sizing: border-box;
      overflow: visible;
      flex: 1;
      background: #ffffff;
      /* Add subtle texture */
      background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.01) 1px, transparent 0);
      background-size: 20px 20px;
      /* Left-aligned layout */
      display: block; /* Remove flex centering */
      text-align: left; /* Left align content */
    }

    .section {
      background: #ffffff; /* Clean white background */
      border-radius: 12px; /* Modern rounded corners */
      padding: 2rem; /* Generous padding */
      margin: 0 0 2rem 0; /* Spacing between sections */
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.08); /* Subtle elevation */
      border: 1px solid #f1f5f9; /* Subtle border */
      transition: all 0.2s ease;
      width: 100%; /* Full width within centered container */
      max-width: none;
      box-sizing: border-box;
      /* Ensure content within sections is left-aligned */
      text-align: left;
    }

    .section:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.1); /* Enhanced shadow on hover */
      transform: translateY(-1px); /* Subtle lift effect */
      border-color: #e2e8f0;
    }

    .section-title {
      margin: 0 0 1.5rem 0;
      font-size: 1.75rem; /* Larger, more prominent */
      font-weight: 700;
      color: #0f172a;
      border-bottom: 3px solid #3b82f6; /* Accent border */
      padding-bottom: 0.75rem;
      display: block;
      text-align: left !important;
      position: relative;
    }

    .section-title::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
      border-radius: 2px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: none; /* remove separating rule */
    }

    /* Enhanced Forms with Better Spacing */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); /* Wider minimum columns */
      gap: 2rem; /* Increased gap for better breathing room */
      width: 100%;
      margin-top: 1rem;
    }

    /* Responsive breakpoints for forms */
    @media (min-width: 1200px) {
      .form-grid {
        grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); /* Wider columns */
        gap: 2.5rem;
      }
    }

    @media (min-width: 1600px) {
      .form-grid {
        grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); /* Even wider for large screens */
        gap: 3rem;
      }
    }

    @media (min-width: 2000px) {
      .form-grid {
        grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); /* Ultra-wide support */
        gap: 3.5rem;
      }
    }

    .form-group {
      margin-bottom: 2rem; /* Increased spacing */
      width: 100%;
    }

    .form-group.span-2 {
      grid-column: span 2;
    }

    .form-group.span-3 {
      grid-column: span 3;
    }

    .form-group.span-full {
      grid-column: 1 / -1;
    }

    .form-label {
      display: block;
      margin-bottom: 0.75rem;
      color: #1f2937; /* Darker for better contrast */
      font-weight: 600;
      font-size: 0.95rem; /* Slightly larger */
      letter-spacing: 0.025em;
    }

    .form-control {
      width: 100%;
      max-width: 100%;
      padding: 1rem 1.25rem; /* More generous padding */
      border: 2px solid #e5e7eb; /* Thicker border */
      border-radius: 8px; /* More rounded */
      font-size: 0.95rem; /* Slightly larger text */
      transition: all 0.2s ease;
      box-sizing: border-box;
      background: #ffffff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* Subtle shadow */
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px); /* Subtle lift */
    }

    .form-control:hover {
      border-color: #d1d5db;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
      .sidebar {
        display: none;
      }
      
      .main-content {
        margin-left: 0;
        margin-right: 0;
  width: 100%;
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
      gap: 1rem;
      width: 100%;
    }

    .data-field-card,
    .feature-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      width: 100%;
      box-sizing: border-box;
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

    /* Enhanced Form Controls */
    .form-control.enhanced {
      padding: 1rem;
      font-size: 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
    }

    .form-control.enhanced:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    /* Header Button Styles */
    .btn-outline-white {
      background: transparent;
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: white;
      font-weight: 500;
    }

    .btn-outline-white:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
      color: white;
    }

    .btn-primary-white {
      background: white;
      color: #3b82f6;
      border: 2px solid white;
      font-weight: 600;
    }

    .btn-primary-white:hover {
      background: #f8fafc;
      color: #2563eb;
    }

    /* Stakeholder Cards */
    .stakeholder-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      width: 100%;
    }

    .stakeholder-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 1.5rem;
      transition: all 0.2s ease;
      width: 100%;
      box-sizing: border-box;
    }

    .stakeholder-card:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    }

    .stakeholder-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .stakeholder-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .stakeholder-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stakeholder-name {
      font-size: 1.125rem;
      font-weight: 600;
      border: none;
      background: transparent;
      padding: 0.25rem 0;
    }

    .stakeholder-role {
      font-size: 0.875rem;
      color: #64748b;
      border: none;
      background: transparent;
      padding: 0.25rem 0;
    }

    .stakeholder-details {
      display: grid;
      gap: 1rem;
    }

    /* Metrics Dashboard */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.5rem;
      width: 100%;
    }

    .metric-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }

    .metric-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .metric-icon {
      font-size: 2.5rem;
      opacity: 0.9;
    }

    .metric-content {
      flex: 1;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }

    .metric-label {
      font-size: 0.875rem;
      opacity: 0.9;
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
    endDate: '2024-07-15',
    author: 'John Smith',
    description: 'Comprehensive requirements for a modern e-commerce platform with advanced features and seamless user experience',
    status: 'active',
    priority: 'high'
  });

  stakeholders = signal<Stakeholder[]>([
    {
      id: '1',
      name: 'John Smith',
      role: 'Product Manager',
      type: 'primary',
      email: 'john.smith@company.com',
      phone: '+1-555-0123',
      department: 'Product Development',
      responsibilities: 'Overall project leadership, strategic decision making, stakeholder communication, and project roadmap management.'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      role: 'UX Designer',
      type: 'secondary',
      email: 'sarah.wilson@company.com',
      phone: '+1-555-0124',
      department: 'Design & User Experience',
      responsibilities: 'User interface design, user experience research, wireframe creation, and usability testing coordination.'
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
      phone: '',
      department: '',
      responsibilities: ''
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
