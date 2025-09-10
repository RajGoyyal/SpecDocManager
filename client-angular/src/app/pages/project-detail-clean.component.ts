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
  businessGoals: string;
  dataStorageNeeds: string;
  externalServicesIntegrations: string;
  dataMigration: string;
  complianceRequirements: string;
  platformRequirements: string;
  performanceRequirements: string;
  scalabilityRequirements: string;
}

interface DataField {
  id: string;
  name: string;
  displayLabel: string;
  uiControl: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'date' | 'datetime' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'toggle' | 'slider' | 'file' | 'color' | 'url' | 'search' | 'rating' | 'tags' | 'rich-text';
  dataType: 'string' | 'number' | 'integer' | 'decimal' | 'boolean' | 'date' | 'datetime' | 'email' | 'url' | 'json' | 'array' | 'file';
  placeholderText: string;
  defaultValue: string;
  maxLength?: number;
  required: boolean;
  validationRules: string;
  description: string;
  dropdownOptions: DropdownOption[];
  securityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  visibility: 'always' | 'conditional' | 'admin-only' | 'hidden';
  trackAnalytics: boolean;
  autoUpdate: boolean;
  mobileOptimized: boolean;
  internationalization: boolean;
  conditionalLogic: string;
  dataDependencies: string;
  cssClasses: string;
  helpText: string;
  customErrorMessage: string;
  apiEndpoint: string;
}

interface DropdownOption {
  value: string;
  display: string;
  description: string;
}

interface Feature {
  id: string;
  title: string;
  importance: 'critical' | 'high' | 'medium' | 'low' | 'nice-to-have';
  type: 'functional' | 'non-functional' | 'business' | 'integration' | 'security' | 'performance' | 'usability' | 'compliance';
  description: string;
  detailedDescription: string;
  acceptanceCriteria: string[];
  businessRules: string[];
  status: 'draft' | 'review' | 'approved' | 'in-progress' | 'testing' | 'completed' | 'rejected';
  priority: string;
  category: string;
  effortEstimate: string;
  userStory: string;
  dependencies: string;
  targetRelease: string;
  technicalNotes: string;
  businessValue: string;
}

interface SuccessCriteria {
  successCriteria: string;
  userTestingPlan: string;
  dataQualityRules: string;
  performanceRequirements: string;
  securityRequirements: string;
}

@Component({
  selector: 'app-project-detail-clean',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="unified-layout">
      <!-- Fixed Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2 class="sidebar-title">
            <span class="icon">📋</span>
            FRS Manager
          </h2>
          <p class="sidebar-subtitle">Requirements Management System</p>
        </div>

        <nav class="sidebar-nav">
          <button class="nav-item" [class.active]="activeTab() === 'basic-info'" (click)="setActiveTab('basic-info')">
            <span class="nav-icon">📝</span>
            <span class="nav-label">Basic Info</span>
          </button>
          <button class="nav-item" [class.active]="activeTab() === 'what-we-need'" (click)="setActiveTab('what-we-need')">
            <span class="nav-icon">🎯</span>
            <span class="nav-label">What We Need</span>
          </button>
          <button class="nav-item" [class.active]="activeTab() === 'data-fields'" (click)="setActiveTab('data-fields')">
            <span class="nav-icon">🗂️</span>
            <span class="nav-label">Data Fields</span>
          </button>
          <button class="nav-item" [class.active]="activeTab() === 'stakeholders'" (click)="setActiveTab('stakeholders')">
            <span class="nav-icon">👥</span>
            <span class="nav-label">Stakeholders</span>
          </button>
          <button class="nav-item" [class.active]="activeTab() === 'features'" (click)="setActiveTab('features')">
            <span class="nav-icon">⚡</span>
            <span class="nav-label">Features</span>
          </button>
          <button class="nav-item" [class.active]="activeTab() === 'user-stories'" (click)="setActiveTab('user-stories')">
            <span class="nav-icon">📖</span>
            <span class="nav-label">User Stories</span>
          </button>
          <button class="nav-item" [class.active]="activeTab() === 'workflows'" (click)="setActiveTab('workflows')">
            <span class="nav-icon">🔄</span>
            <span class="nav-label">Workflows</span>
          </button>
          <button class="nav-item" [class.active]="activeTab() === 'success-criteria'" (click)="setActiveTab('success-criteria')">
            <span class="nav-icon">✅</span>
            <span class="nav-label">Success Criteria</span>
          </button>
          <button class="nav-item" [class.active]="activeTab() === 'download'" (click)="setActiveTab('download')">
            <span class="nav-icon">📥</span>
            <span class="nav-label">Download</span>
          </button>
        </nav>

        <div class="sidebar-section">
          <h3 class="section-title">Project Summary</h3>
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-label">Progress</span>
              <span class="stat-value">{{getProjectProgress()}}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="getProjectProgress()"></div>
            </div>
            <div class="stat-item">
              <span class="stat-label">Stakeholders</span>
              <span class="stat-value">{{getStakeholderCount()}}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-footer">
          <div class="user-info">
            <img src="https://via.placeholder.com/32" alt="User" class="user-avatar">
            <div class="user-details">
              <p class="user-name">John Doe</p>
              <p class="user-role">Project Manager</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Unified Content Container (Header + Tabs Combined) -->
      <div class="content-container" [ngSwitch]="activeTab()">
        
        <!-- Basic Info Tab with Integrated Header -->
        <div *ngSwitchCase="'basic-info'" class="unified-tab">
          <div class="tab-header">
            <h1 class="main-title">{{project().title || 'New Project'}}</h1>
            <p class="main-subtitle">Project Information & Basic Details</p>
          </div>
          <div class="tab-content">
            <div class="content-section">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="title">Project Title</label>
                  <input id="title" type="text" class="form-control" 
                         [(ngModel)]="project()!.title" 
                         placeholder="Enter project title">
                </div>
                <div class="form-group">
                  <label class="form-label" for="version">Version</label>
                  <input id="version" type="text" class="form-control" 
                         [(ngModel)]="project()!.version" 
                         placeholder="1.0.0">
                </div>
                <div class="form-group">
                  <label class="form-label" for="startDate">Start Date</label>
                  <input id="startDate" type="date" class="form-control" 
                         [(ngModel)]="project()!.startDate">
                </div>
                <div class="form-group">
                  <label class="form-label" for="endDate">End Date</label>
                  <input id="endDate" type="date" class="form-control" 
                         [(ngModel)]="project()!.endDate">
                </div>
                <div class="form-group">
                  <label class="form-label" for="author">Project Author</label>
                  <input id="author" type="text" class="form-control" 
                         [(ngModel)]="project()!.author" 
                         placeholder="Enter author name">
                </div>
                <div class="form-group">
                  <label class="form-label" for="status">Project Status</label>
                  <select id="status" class="form-control" [(ngModel)]="project()!.status">
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="testing">Testing</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
                <div class="form-group span-full">
                  <label class="form-label" for="description">Project Description</label>
                  <textarea id="description" class="form-control" rows="4" 
                            [(ngModel)]="project().description" 
                            placeholder="Describe the project goals and objectives"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- What We Need Tab with Integrated Header -->
        <div *ngSwitchCase="'what-we-need'" class="unified-tab">
          <div class="tab-header">
            <h1 class="main-title">What We Need</h1>
            <p class="main-subtitle">Define project goals, scope, and requirements</p>
          </div>
          <div class="tab-content">
            <div class="content-section">
              <h3 class="subsection-title">🎯 What Do You Want to Achieve?</h3>
              <div class="form-grid">
                <div class="form-group span-full">
                  <label class="form-label">User Experience Goals</label>
                  <textarea class="form-control" rows="4" 
                            [(ngModel)]="whatWeNeed().userExperienceGoals"
                            placeholder="• What experience do you want users to have?&#10;• What emotions should users feel when using this?&#10;• How should users interact with the system?&#10;• What should be intuitive vs. what requires learning?"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">What's Included in This Project</label>
                  <textarea class="form-control" rows="6" 
                            [(ngModel)]="whatWeNeed().whatsIncluded"
                            placeholder="List features and functionality that WILL be included:&#10;• Core functionality&#10;• User management&#10;• Data storage&#10;• Reporting features&#10;• Integration points&#10;• Mobile support"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">What's NOT Included</label>
                  <textarea class="form-control" rows="6" 
                            [(ngModel)]="whatWeNeed().whatsNotIncluded"
                            placeholder="List features and functionality that will NOT be included:&#10;• Advanced analytics (Phase 2)&#10;• Third-party integrations&#10;• Custom reporting&#10;• Mobile app (web only)&#10;• Multi-language support&#10;• Advanced permissions"></textarea>
                </div>
                <div class="form-group span-full">
                  <label class="form-label">Key Assumptions and Dependencies</label>
                  <textarea class="form-control" rows="5" 
                            [(ngModel)]="whatWeNeed().keyAssumptionsAndDependencies"
                            placeholder="List key assumptions and external dependencies:&#10;• Users have internet access&#10;• Third-party APIs will remain stable&#10;• Database infrastructure is available&#10;• Team has necessary technical skills&#10;• Budget and timeline assumptions"></textarea>
                </div>
                <div class="form-group span-full">
                  <label class="form-label">Business Goals & Success Metrics</label>
                  <textarea class="form-control" rows="4" 
                            [(ngModel)]="whatWeNeed().businessGoals"
                            placeholder="What business goals will this achieve?&#10;• Increase efficiency by X%&#10;• Reduce manual work by X hours&#10;• Improve customer satisfaction&#10;• Generate revenue of $X"></textarea>
                </div>
              </div>
            </div>

            <div class="content-section">
              <h3 class="subsection-title">🗃️ Data Integration Needs</h3>
              <div class="form-grid">
                <div class="form-group span-full">
                  <label class="form-label">Data Storage Requirements</label>
                  <textarea class="form-control" rows="6" 
                            [(ngModel)]="whatWeNeed().dataStorageNeeds"
                            placeholder="What information do you need to store?&#10;• User data (profiles, preferences)&#10;• Transaction data&#10;• Content/documents&#10;• Analytics data&#10;• File uploads (types, sizes)&#10;• Data retention requirements"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">External Services & APIs</label>
                  <textarea class="form-control" rows="6" 
                            [(ngModel)]="whatWeNeed().externalServicesIntegrations"
                            placeholder="List external systems to integrate:&#10;• Payment processors (Stripe, PayPal)&#10;• Email services (SendGrid)&#10;• Authentication (OAuth, SAML)&#10;• CRM systems&#10;• Analytics tools&#10;• File storage (AWS S3)"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Data Migration Needs</label>
                  <textarea class="form-control" rows="6" 
                            [(ngModel)]="whatWeNeed().dataMigration"
                            placeholder="What existing data needs to be migrated?&#10;• Legacy system data&#10;• User accounts&#10;• Historical records&#10;• File attachments&#10;• Configuration settings&#10;• Data cleansing requirements"></textarea>
                </div>
                <div class="form-group span-full">
                  <label class="form-label">Compliance & Security Requirements</label>
                  <textarea class="form-control" rows="4" 
                            [(ngModel)]="whatWeNeed().complianceRequirements"
                            placeholder="What compliance standards must be met?&#10;• GDPR compliance&#10;• HIPAA requirements&#10;• SOX compliance&#10;• Industry-specific regulations&#10;• Data encryption standards"></textarea>
                </div>
              </div>
            </div>

            <div class="content-section">
              <h3 class="subsection-title">🔧 Technical Requirements</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Platform Requirements</label>
                  <textarea class="form-control" rows="4" 
                            [(ngModel)]="whatWeNeed().platformRequirements"
                            placeholder="• Web browsers supported&#10;• Mobile device support&#10;• Operating system requirements&#10;• Network requirements"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Performance Requirements</label>
                  <textarea class="form-control" rows="4" 
                            [(ngModel)]="whatWeNeed().performanceRequirements"
                            placeholder="• Page load times (< 3 seconds)&#10;• Concurrent users (500+)&#10;• Response times&#10;• Availability (99.9% uptime)"></textarea>
                </div>
                <div class="form-group span-full">
                  <label class="form-label">Scalability & Growth Considerations</label>
                  <textarea class="form-control" rows="4" 
                            [(ngModel)]="whatWeNeed().scalabilityRequirements"
                            placeholder="How should the system handle growth?&#10;• Expected user growth&#10;• Data volume increases&#10;• Feature expansion plans&#10;• Geographic expansion"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Fields Tab with Integrated Header -->
        <div *ngSwitchCase="'data-fields'" class="unified-tab">
          <div class="tab-header">
            <h1 class="main-title">Data Fields</h1>
            <p class="main-subtitle">Define data structure and field specifications</p>
          </div>
          <div class="tab-content">
            <div class="content-section">
              <div class="section-header">
                <h2 class="section-title">Field Management</h2>
                <button class="add-btn" (click)="addDataField()">+ Add Data Field</button>
              </div>
              
              <div class="field-list">
                <div *ngFor="let field of dataFields(); let i = index" class="field-card">
                  <div class="field-header">
                    <h3>{{field.name || 'New Field'}}</h3>
                    <button class="remove-btn" (click)="removeDataField(i)">×</button>
                  </div>
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label">Field Name</label>
                      <input type="text" class="form-control" 
                             [(ngModel)]="field.name" 
                             placeholder="field_name">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Display Label</label>
                      <input type="text" class="form-control" 
                             [(ngModel)]="field.displayLabel" 
                             placeholder="Field Label">
                    </div>
                    <div class="form-group">
                      <label class="form-label">UI Control</label>
                      <select class="form-control" [(ngModel)]="field.uiControl" (change)="onUiControlChange(field, i)">
                        <option value="text">📝 Text Input</option>
                        <option value="textarea">📄 Text Area</option>
                        <option value="number">🔢 Number Input</option>
                        <option value="email">📧 Email Input</option>
                        <option value="password">🔒 Password Input</option>
                        <option value="date">📅 Date Picker</option>
                        <option value="datetime">🕐 Date Time Picker</option>
                        <option value="select">📋 Select Dropdown</option>
                        <option value="multiselect">☑️ Multi Select</option>
                        <option value="radio">🔘 Radio Buttons</option>
                        <option value="checkbox">✅ Checkbox</option>
                        <option value="toggle">🔄 Toggle Switch</option>
                        <option value="slider">🎚️ Slider</option>
                        <option value="file">📎 File Upload</option>
                        <option value="color">🎨 Color Picker</option>
                        <option value="url">🌐 URL Input</option>
                        <option value="search">🔍 Search Input</option>
                        <option value="rating">⭐ Rating</option>
                        <option value="tags">🏷️ Tags Input</option>
                        <option value="rich-text">📝 Rich Text Editor</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Data Type</label>
                      <select class="form-control" [(ngModel)]="field.dataType">
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="integer">Integer</option>
                        <option value="decimal">Decimal</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                        <option value="datetime">Date Time</option>
                        <option value="email">Email</option>
                        <option value="url">URL</option>
                        <option value="json">JSON</option>
                        <option value="array">Array</option>
                        <option value="file">File</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Placeholder Text</label>
                      <input type="text" class="form-control" 
                             [(ngModel)]="field.placeholderText" 
                             placeholder="Enter placeholder text">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Default Value</label>
                      <input type="text" class="form-control" 
                             [(ngModel)]="field.defaultValue" 
                             placeholder="Default value">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Max Length</label>
                      <input type="number" class="form-control" 
                             [(ngModel)]="field.maxLength" 
                             placeholder="Maximum character length">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Required</label>
                      <select class="form-control" [(ngModel)]="field.required">
                        <option [value]="true">Yes, Required</option>
                        <option [value]="false">No, Optional</option>
                      </select>
                    </div>
                    <div class="form-group span-full">
                      <label class="form-label">Validation Rules</label>
                      <textarea class="form-control" rows="2" 
                                [(ngModel)]="field.validationRules" 
                                placeholder="Describe validation rules and constraints"></textarea>
                    </div>
                    
                    <!-- Dropdown Options Section - Shows when select, multiselect, or radio is selected -->
                    <div *ngIf="field.uiControl === 'select' || field.uiControl === 'multiselect' || field.uiControl === 'radio'" 
                         class="form-group span-full dropdown-options-section">
                      <div class="options-header">
                        <label class="form-label">Dropdown Options</label>
                        <button type="button" class="add-option-btn" (click)="addDropdownOption(field, i)">+ Add Option</button>
                      </div>
                      
                      <div class="options-list">
                        <div *ngFor="let option of field.dropdownOptions; let optIndex = index" class="option-item">
                          <div class="option-content">
                            <div class="option-input-group">
                              <label class="option-label">Value:</label>
                              <input type="text" class="option-input" 
                                     [(ngModel)]="option.value" 
                                     placeholder="option_value">
                            </div>
                            <div class="option-input-group">
                              <label class="option-label">Display:</label>
                              <input type="text" class="option-input" 
                                     [(ngModel)]="option.display" 
                                     placeholder="Display Text">
                            </div>
                            <div class="option-input-group">
                              <label class="option-label">Description:</label>
                              <input type="text" class="option-input" 
                                     [(ngModel)]="option.description" 
                                     placeholder="Optional description">
                            </div>
                            <button type="button" class="remove-option-btn" 
                                    (click)="removeDropdownOption(field, optIndex)">×</button>
                          </div>
                        </div>
                        
                        <div *ngIf="field.dropdownOptions.length === 0" class="no-options">
                          <p>No options added yet. Click "Add Option" to get started.</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Enhanced Field Properties -->
                    <div class="form-group span-full field-properties">
                      <h4 class="property-section-title">📋 Field Properties</h4>
                      <div class="property-grid">
                        <div class="property-item">
                          <label class="property-label">🔒 Security Level</label>
                          <select class="form-control small" [(ngModel)]="field.securityLevel">
                            <option value="public">Public</option>
                            <option value="internal">Internal</option>
                            <option value="confidential">Confidential</option>
                            <option value="restricted">Restricted</option>
                          </select>
                        </div>
                        
                        <div class="property-item">
                          <label class="property-label">👁️ Visibility</label>
                          <select class="form-control small" [(ngModel)]="field.visibility">
                            <option value="always">Always Visible</option>
                            <option value="conditional">Conditional</option>
                            <option value="admin-only">Admin Only</option>
                            <option value="hidden">Hidden</option>
                          </select>
                        </div>
                        
                        <div class="property-item">
                          <label class="property-label">📊 Analytics</label>
                          <select class="form-control small" [(ngModel)]="field.trackAnalytics">
                            <option [value]="true">Track Usage</option>
                            <option [value]="false">No Tracking</option>
                          </select>
                        </div>
                        
                        <div class="property-item">
                          <label class="property-label">🔄 Auto-Update</label>
                          <select class="form-control small" [(ngModel)]="field.autoUpdate">
                            <option [value]="false">Manual</option>
                            <option [value]="true">Auto-Update</option>
                          </select>
                        </div>
                        
                        <div class="property-item">
                          <label class="property-label">📱 Mobile Optimized</label>
                          <select class="form-control small" [(ngModel)]="field.mobileOptimized">
                            <option [value]="true">Yes</option>
                            <option [value]="false">No</option>
                          </select>
                        </div>
                        
                        <div class="property-item">
                          <label class="property-label">🌍 Internationalization</label>
                          <select class="form-control small" [(ngModel)]="field.internationalization">
                            <option [value]="true">Multi-language</option>
                            <option [value]="false">Single Language</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Field Behavior Settings -->
                    <div class="form-group span-full field-behavior">
                      <h4 class="property-section-title">⚙️ Field Behavior</h4>
                      <div class="behavior-grid">
                        <div class="form-group">
                          <label class="form-label">Conditional Logic</label>
                          <textarea class="form-control" rows="2" 
                                    [(ngModel)]="field.conditionalLogic" 
                                    placeholder="Show when: field_name = 'value'&#10;Hide when: other_field is empty"></textarea>
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label">Data Dependencies</label>
                          <textarea class="form-control" rows="2" 
                                    [(ngModel)]="field.dataDependencies" 
                                    placeholder="Depends on: user_role, account_type&#10;Updates: related_field_1, related_field_2"></textarea>
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label">Custom CSS Classes</label>
                          <input type="text" class="form-control" 
                                 [(ngModel)]="field.cssClasses" 
                                 placeholder="custom-class-1 highlight-field">
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label">Help Text</label>
                          <input type="text" class="form-control" 
                                 [(ngModel)]="field.helpText" 
                                 placeholder="Helpful information for users">
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label">Error Message</label>
                          <input type="text" class="form-control" 
                                 [(ngModel)]="field.customErrorMessage" 
                                 placeholder="Custom validation error message">
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label">API Endpoint</label>
                          <input type="text" class="form-control" 
                                 [(ngModel)]="field.apiEndpoint" 
                                 placeholder="/api/validate/field-name">
                        </div>
                      </div>
                    </div>
                    <div class="form-group span-full">
                      <label class="form-label">Field Description</label>
                      <textarea class="form-control" rows="2" 
                                [(ngModel)]="field.description" 
                                placeholder="Describe the purpose and usage of this field"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stakeholders Tab with Integrated Header -->
        <div *ngSwitchCase="'stakeholders'" class="unified-tab">
          <div class="tab-header">
            <h1 class="main-title">Project Stakeholders</h1>
            <p class="main-subtitle">Manage project stakeholders and their responsibilities</p>
          </div>
          <div class="tab-content">
            <div class="content-section">
              <div class="section-header">
                <h2 class="section-title">Stakeholder Management</h2>
                <button class="add-btn" (click)="addStakeholder()">+ Add Stakeholder</button>
              </div>
              
              <div class="stakeholder-list">
                <div *ngFor="let stakeholder of stakeholders(); let i = index" class="stakeholder-card">
                  <div class="stakeholder-header">
                    <h3>{{stakeholder.name || 'New Stakeholder'}}</h3>
                    <button class="remove-btn" (click)="removeStakeholder(i)">×</button>
                  </div>
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label">Name</label>
                      <input type="text" class="form-control" 
                             [(ngModel)]="stakeholder.name" 
                             placeholder="Stakeholder name">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Role</label>
                      <input type="text" class="form-control" 
                             [(ngModel)]="stakeholder.role" 
                             placeholder="Job title/role">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Type</label>
                      <select class="form-control" [(ngModel)]="stakeholder.type">
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="user">End User</option>
                        <option value="technical">Technical</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" 
                             [(ngModel)]="stakeholder.email" 
                             placeholder="email@company.com">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Phone</label>
                      <input type="tel" class="form-control" 
                             [(ngModel)]="stakeholder.phone" 
                             placeholder="Phone number">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Department</label>
                      <input type="text" class="form-control" 
                             [(ngModel)]="stakeholder.department" 
                             placeholder="Department/Team">
                    </div>
                    <div class="form-group span-full">
                      <label class="form-label">Responsibilities</label>
                      <textarea class="form-control" rows="2" 
                                [(ngModel)]="stakeholder.responsibilities" 
                                placeholder="Key responsibilities and involvement"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <!-- Features Tab with Integrated Header -->
        <div *ngSwitchCase="'features'" class="unified-tab">
          <div class="tab-header">
            <h1 class="main-title">Project Features</h1>
            <p class="main-subtitle">Define and manage project features and requirements</p>
          </div>
          <div class="tab-content">
            <div class="content-section">
              <div class="section-header">
                <h2 class="section-title">Feature Management</h2>
                <button class="add-btn" (click)="addFeature()">+ Add Feature</button>
              </div>
              
              <div class="feature-list">
                <div *ngFor="let feature of features(); let i = index" class="feature-card">
                  <div class="feature-header">
                    <h3>{{feature.title || 'New Feature'}}</h3>
                    <button class="remove-btn" (click)="removeFeature(i)">×</button>
                  </div>
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label">What should it do?</label>
                      <input type="text" class="form-control" 
                             [(ngModel)]="feature.title" 
                             placeholder="Feature title/name">
                    </div>
                    <div class="form-group">
                      <label class="form-label">How important is this?</label>
                      <select class="form-control" [(ngModel)]="feature.importance">
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                        <option value="nice-to-have">Nice to Have</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">What kind of requirement?</label>
                      <select class="form-control" [(ngModel)]="feature.type">
                        <option value="functional">Functional</option>
                        <option value="non-functional">Non-Functional</option>
                        <option value="business">Business</option>
                        <option value="integration">Integration</option>
                        <option value="security">Security</option>
                        <option value="performance">Performance</option>
                        <option value="usability">Usability</option>
                        <option value="compliance">Compliance</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Status</label>
                      <select class="form-control" [(ngModel)]="feature.status">
                        <option value="draft">Draft</option>
                        <option value="review">Review</option>
                        <option value="approved">Approved</option>
                        <option value="in-progress">In Progress</option>
                        <option value="testing">Testing</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div class="form-group span-full">
                      <label class="form-label">Tell us more about it</label>
                      <textarea class="form-control" rows="3" 
                                [(ngModel)]="feature.description" 
                                placeholder="Brief description of the feature"></textarea>
                    </div>
                    <div class="form-group span-full">
                      <label class="form-label">Detailed Description</label>
                      <textarea class="form-control" rows="4" 
                                [(ngModel)]="feature.detailedDescription" 
                                placeholder="Detailed explanation of the feature, including user stories and use cases"></textarea>
                    </div>
                    <div class="form-group span-full">
                      <label class="form-label">Acceptance Criteria</label>
                      <textarea class="form-control" rows="4" 
                                [value]="feature.acceptanceCriteria.join('\n')"
                                (input)="updateAcceptanceCriteria(i, $event)"
                                placeholder="Enter acceptance criteria (one per line)&#10;- Given condition, when action, then result&#10;- Feature works correctly when..."></textarea>
                    </div>
                    <div class="form-group span-full">
                      <label class="form-label">Business Rules</label>
                      <textarea class="form-control" rows="3" 
                                [value]="feature.businessRules.join('\n')"
                                (input)="updateBusinessRules(i, $event)"
                                placeholder="Enter business rules (one per line)&#10;- Business constraint or rule&#10;- Data validation rule..."></textarea>
                    </div>
                    
                    <!-- Add Requirement Button -->
                    <div class="form-group span-full add-requirement-section">
                      <button type="button" class="add-requirement-btn" (click)="addRequirementToFeature(i)">
                        ➕ Add This Requirement
                      </button>
                      <p class="add-requirement-help">Click to save this feature as a formal requirement</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Requirements Summary Section -->
              <div class="requirements-summary" *ngIf="features().length > 0">
                <h3 class="summary-title">📋 Requirements Summary</h3>
                <div class="summary-stats">
                  <div class="stat-item">
                    <span class="stat-label">Total Features:</span>
                    <span class="stat-value">{{ features().length }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Critical Priority:</span>
                    <span class="stat-value critical">{{ getFeaturesByImportance('critical').length }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">High Priority:</span>
                    <span class="stat-value high">{{ getFeaturesByImportance('high').length }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Functional Requirements:</span>
                    <span class="stat-value">{{ getFeaturesByType('functional').length }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Completed:</span>
                    <span class="stat-value completed">{{ getFeaturesByStatus('completed').length }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Criteria Tab with Integrated Header -->
        <div *ngSwitchCase="'success-criteria'" class="unified-tab">
          <div class="tab-header">
            <h1 class="main-title">Success Criteria</h1>
            <p class="main-subtitle">Define how success will be measured</p>
          </div>
          <div class="tab-content">
            <div class="content-section">
              <h3 class="subsection-title">✅ How Will You Know It's Working?</h3>
              <div class="form-grid">
                <div class="form-group span-full">
                  <label class="form-label">Success Criteria</label>
                  <textarea class="form-control" rows="4" 
                            [(ngModel)]="successCriteria().successCriteria"
                            placeholder="Define measurable success criteria. What outcomes indicate success?"></textarea>
                </div>
                <div class="form-group span-full">
                  <label class="form-label">User Testing Plan</label>
                  <textarea class="form-control" rows="4" 
                            [(ngModel)]="successCriteria().userTestingPlan"
                            placeholder="Describe how user testing will be conducted to validate success"></textarea>
                </div>
                <div class="form-group span-full">
                  <label class="form-label">Data Quality Rules</label>
                  <textarea class="form-control" rows="3" 
                            [(ngModel)]="successCriteria().dataQualityRules"
                            placeholder="Define data quality standards and validation rules"></textarea>
                </div>
              </div>
            </div>

            <div class="content-section">
              <h3 class="subsection-title">🔒 Performance and Security</h3>
              <div class="form-grid">
                <div class="form-group span-full">
                  <label class="form-label">Performance Requirements</label>
                  <textarea class="form-control" rows="4" 
                            [(ngModel)]="successCriteria().performanceRequirements"
                            placeholder="Define performance benchmarks (response times, throughput, scalability requirements)"></textarea>
                </div>
                <div class="form-group span-full">
                  <label class="form-label">Security Requirements</label>
                  <textarea class="form-control" rows="4" 
                            [(ngModel)]="successCriteria().securityRequirements"
                            placeholder="Define security standards, authentication, authorization, and compliance requirements"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Download Tab with Integrated Header -->
        <div *ngSwitchCase="'download'" class="unified-tab">
          <div class="tab-header">
            <h1 class="main-title">Download & Export</h1>
            <p class="main-subtitle">Export your requirements documentation</p>
          </div>
          <div class="tab-content">
            <!-- Enhanced Document Summary -->
            <div class="content-section">
              <h3 class="subsection-title">📄 Document Summary</h3>
              <div class="summary-grid-enhanced">
                <div class="summary-card">
                  <div class="summary-header">
                    <span class="summary-icon">📋</span>
                    <span class="summary-title">Project Overview</span>
                  </div>
                  <div class="summary-stats">
                    <div class="stat-row">
                      <span class="stat-label">Project Title:</span>
                      <span class="stat-value">{{project().title || 'Untitled Project'}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Version:</span>
                      <span class="stat-value">{{project().version || '1.0.0'}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Author:</span>
                      <span class="stat-value">{{project().author || 'Not specified'}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Status:</span>
                      <span class="stat-value status-{{project().status}}">{{project().status | titlecase}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Priority:</span>
                      <span class="stat-value priority-{{project().priority}}">{{project().priority | titlecase}}</span>
                    </div>
                  </div>
                </div>

                <div class="summary-card">
                  <div class="summary-header">
                    <span class="summary-icon">📊</span>
                    <span class="summary-title">Requirements Breakdown</span>
                  </div>
                  <div class="summary-stats">
                    <div class="stat-row">
                      <span class="stat-label">Total Requirements:</span>
                      <span class="stat-value">{{features().length}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Critical Priority:</span>
                      <span class="stat-value critical">{{getFeaturesByImportance('critical').length}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">High Priority:</span>
                      <span class="stat-value high">{{getFeaturesByImportance('high').length}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Functional:</span>
                      <span class="stat-value">{{getFeaturesByType('functional').length}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Non-Functional:</span>
                      <span class="stat-value">{{getFeaturesByType('non-functional').length}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Security:</span>
                      <span class="stat-value">{{getFeaturesByType('security').length}}</span>
                    </div>
                  </div>
                </div>

                <div class="summary-card">
                  <div class="summary-header">
                    <span class="summary-icon">👥</span>
                    <span class="summary-title">Stakeholders & Data</span>
                  </div>
                  <div class="summary-stats">
                    <div class="stat-row">
                      <span class="stat-label">Total Stakeholders:</span>
                      <span class="stat-value">{{stakeholders().length}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Primary Stakeholders:</span>
                      <span class="stat-value">{{getStakeholdersByType('primary').length}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Data Fields:</span>
                      <span class="stat-value">{{dataFields().length}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Required Fields:</span>
                      <span class="stat-value">{{getRequiredFields().length}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Completion Status:</span>
                      <span class="stat-value">{{getCompletionPercentage()}}%</span>
                    </div>
                  </div>
                </div>

                <div class="summary-card">
                  <div class="summary-header">
                    <span class="summary-icon">📈</span>
                    <span class="summary-title">Progress Overview</span>
                  </div>
                  <div class="summary-stats">
                    <div class="stat-row">
                      <span class="stat-label">Completed Features:</span>
                      <span class="stat-value completed">{{getFeaturesByStatus('completed').length}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">In Progress:</span>
                      <span class="stat-value in-progress">{{getFeaturesByStatus('in-progress').length}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Testing:</span>
                      <span class="stat-value testing">{{getFeaturesByStatus('testing').length}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Draft:</span>
                      <span class="stat-value draft">{{getFeaturesByStatus('draft').length}}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Success Criteria Defined:</span>
                      <span class="stat-value">{{isSuccessCriteriaDefined() ? 'Yes' : 'No'}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Export Options -->
            <div class="content-section">
              <h3 class="subsection-title">📥 Export Options</h3>
              <div class="export-grid">
                <button class="export-btn primary" (click)="exportAsPDF()">
                  <span class="export-icon">📄</span>
                  <span class="export-title">Export as PDF</span>
                  <span class="export-desc">Professional PDF document with formatting</span>
                  <span class="export-features">• Print-ready • Watermarks • Table of contents</span>
                </button>
                
                <button class="export-btn secondary" (click)="exportAsWord()">
                  <span class="export-icon">📝</span>
                  <span class="export-title">Export as Word Document</span>
                  <span class="export-desc">Editable DOCX format for collaboration</span>
                  <span class="export-features">• Editable • Comments • Track changes</span>
                </button>
                
                <button class="export-btn success" (click)="exportComplete()">
                  <span class="export-icon">📋</span>
                  <span class="export-title">Export Complete Documentation</span>
                  <span class="export-desc">All sections with technical specifications</span>
                  <span class="export-features">• Full documentation • Appendices • Glossary</span>
                </button>
                
                <button class="export-btn info" (click)="exportPackage()">
                  <span class="export-icon">📦</span>
                  <span class="export-title">Export as Package</span>
                  <span class="export-desc">ZIP file with multiple formats</span>
                  <span class="export-features">• PDF + Word • Excel sheets • JSON data</span>
                </button>
                
                <button class="export-btn warning" (click)="exportExecutiveSummary()">
                  <span class="export-icon">📊</span>
                  <span class="export-title">Executive Summary</span>
                  <span class="export-desc">High-level overview for stakeholders</span>
                  <span class="export-features">• Key metrics • Charts • Summary only</span>
                </button>
                
                <button class="export-btn dark" (click)="exportTechnicalSpecs()">
                  <span class="export-icon">⚙️</span>
                  <span class="export-title">Technical Specifications</span>
                  <span class="export-desc">Developer-focused technical details</span>
                  <span class="export-features">• API docs • Data schemas • Code samples</span>
                </button>
              </div>
            </div>

            <!-- Export Configuration -->
            <div class="content-section">
              <h3 class="subsection-title">⚙️ Export Configuration</h3>
              <div class="export-config">
                <div class="config-section">
                  <h4 class="config-title">Include Sections</h4>
                  <div class="checkbox-grid">
                    <label class="checkbox-item">
                      <input type="checkbox" [ngModel]="exportConfig().includeBasicInfo" (ngModelChange)="updateExportConfig('includeBasicInfo', $event)" checked>
                      <span>📋 Basic Information</span>
                    </label>
                    <label class="checkbox-item">
                      <input type="checkbox" [ngModel]="exportConfig().includeWhatWeNeed" (ngModelChange)="updateExportConfig('includeWhatWeNeed', $event)" checked>
                      <span>🎯 What We Need</span>
                    </label>
                    <label class="checkbox-item">
                      <input type="checkbox" [ngModel]="exportConfig().includeDataFields" (ngModelChange)="updateExportConfig('includeDataFields', $event)" checked>
                      <span>🗃️ Data Fields</span>
                    </label>
                    <label class="checkbox-item">
                      <input type="checkbox" [ngModel]="exportConfig().includeStakeholders" (ngModelChange)="updateExportConfig('includeStakeholders', $event)" checked>
                      <span>👥 Stakeholders</span>
                    </label>
                    <label class="checkbox-item">
                      <input type="checkbox" [ngModel]="exportConfig().includeFeatures" (ngModelChange)="updateExportConfig('includeFeatures', $event)" checked>
                      <span>🔧 Features</span>
                    </label>
                    <label class="checkbox-item">
                      <input type="checkbox" [ngModel]="exportConfig().includeSuccessCriteria" (ngModelChange)="updateExportConfig('includeSuccessCriteria', $event)" checked>
                      <span>✅ Success Criteria</span>
                    </label>
                  </div>
                </div>
                
                <div class="config-section">
                  <h4 class="config-title">Format Options</h4>
                  <div class="format-options">
                    <label class="format-item">
                      <span>Include Table of Contents:</span>
                      <select [ngModel]="exportConfig().includeTableOfContents" (ngModelChange)="updateExportConfig('includeTableOfContents', $event)">
                        <option [value]="true">Yes</option>
                        <option [value]="false">No</option>
                      </select>
                    </label>
                    <label class="format-item">
                      <span>Include Page Numbers:</span>
                      <select [ngModel]="exportConfig().includePageNumbers" (ngModelChange)="updateExportConfig('includePageNumbers', $event)">
                        <option [value]="true">Yes</option>
                        <option [value]="false">No</option>
                      </select>
                    </label>
                    <label class="format-item">
                      <span>Include Appendices:</span>
                      <select [ngModel]="exportConfig().includeAppendices" (ngModelChange)="updateExportConfig('includeAppendices', $event)">
                        <option [value]="true">Yes</option>
                        <option [value]="false">No</option>
                      </select>
                    </label>
                    <label class="format-item">
                      <span>Color Scheme:</span>
                      <select [ngModel]="exportConfig().colorScheme" (ngModelChange)="updateExportConfig('colorScheme', $event)">
                        <option value="professional">Professional</option>
                        <option value="corporate">Corporate</option>
                        <option value="minimal">Minimal</option>
                        <option value="colorful">Colorful</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* CSS Reset for the component */
    * {
      box-sizing: border-box;
    }
    
    /* UNIFIED LAYOUT SYSTEM */
    .unified-layout {
      display: flex;
      height: 100vh;
      width: 100vw;
      background: #ffffff;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    /* SIDEBAR - FIXED WIDTH */
    .sidebar {
      width: 320px;
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      overflow-y: auto;
      z-index: 100;
      height: 100vh;
    }

    .sidebar-header {
      padding: 2rem 1.5rem 1rem 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      background: white;
    }

    .sidebar-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sidebar-subtitle {
      margin: 0.5rem 0 0 0;
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    .sidebar-nav {
      padding: 1rem 0;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.875rem 1.5rem;
      border: none;
      background: none;
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
      border-left: 4px solid transparent;
    }

    .nav-item:hover {
      background: rgba(59, 130, 246, 0.05);
      color: #3b82f6;
    }

    .nav-item.active {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border-left-color: #3b82f6;
      font-weight: 600;
    }

    .nav-icon {
      font-size: 1.1rem;
      width: 20px;
      text-align: center;
    }

    .sidebar-section {
      padding: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    .section-title {
      margin: 0 0 1rem 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .summary-stats {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }

    .stat-label {
      color: #6b7280;
    }

    .stat-value {
      font-weight: 600;
      color: #1f2937;
    }

    .progress-bar {
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
      margin-top: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
      transition: width 0.3s ease;
    }

    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid #e2e8f0;
      background: white;
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
      object-fit: cover;
    }

    .user-details {
      flex: 1;
    }

    .user-name {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1f2937;
    }

    .user-role {
      margin: 0;
      font-size: 0.75rem;
      color: #6b7280;
    }

    /* MAIN CONTAINER - TAKES REMAINING SPACE */
    .content-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      overflow: hidden;
      height: 100vh;
    }

    /* UNIFIED TAB SYSTEM - HEADER + CONTENT COMBINED */
    .unified-tab {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      background: #ffffff;
      overflow: hidden;
      position: relative;
    }

    /* TAB HEADER - INTEGRATED WITH EACH TAB */
    .tab-header {
      padding: 2rem 2rem 1.5rem 2rem;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-bottom: 1px solid #e2e8f0;
      flex-shrink: 0;
      position: static;
      z-index: 1;
      width: 100%;
    }

    .main-title {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 800;
      color: #1e293b;
      letter-spacing: -0.025em;
    }

    .main-subtitle {
      margin: 0;
      font-size: 1rem;
      color: #64748b;
      font-weight: 500;
      line-height: 1.5;
    }

    /* TAB CONTENT - SCROLLABLE AREA */
    .tab-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0;
      background: #f8fafc;
      min-height: 0;
      position: relative;
    }

    .content-section {
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #f1f5f9;
      margin: 2rem;
      margin-bottom: 1rem;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 1;
    }

    .content-section:first-child {
      margin-top: 2rem;
    }

    .content-section:last-child {
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .section-header .section-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      text-transform: none;
      letter-spacing: normal;
    }

    .section-description {
      margin: 0 0 1.5rem 0;
      color: #64748b;
      font-size: 0.95rem;
    }

    .add-btn {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .add-btn:hover {
      background: #2563eb;
    }

    /* FORM STYLES */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      width: 100%;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.span-full {
      grid-column: 1 / -1;
    }

    .form-label {
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      background: white;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-control::placeholder {
      color: #9ca3af;
    }

    /* STAKEHOLDER CARDS */
    .stakeholder-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .stakeholder-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .stakeholder-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .stakeholder-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .remove-btn {
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background 0.2s ease;
    }

    .remove-btn:hover {
      background: #dc2626;
    }

    /* SUBSECTION STYLES */
    .subsection-title {
      margin: 0 0 1.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* FIELD CARDS */
    .field-list, .feature-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .field-card, .feature-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .field-header, .feature-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .field-header h3, .feature-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    /* DOWNLOAD SECTION */
    .document-summary {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .summary-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .summary-value {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .export-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .export-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }

    .export-btn:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      transform: translateY(-2px);
    }

    .export-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .export-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .export-desc {
      font-size: 0.875rem;
      color: #6b7280;
    }

    /* RESPONSIVE DESIGN */
    @media (max-width: 768px) {
      .sidebar {
        width: 280px;
      }

      .unified-header {
        padding: 1.5rem;
      }

      .tab-section {
        padding: 1.5rem;
      }

      .content-section {
        padding: 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      /* Feature Management Enhanced Styles */
      .feature-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        transition: all 0.2s ease;
      }

      .feature-card:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      }

      .feature-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f1f5f9;
        gap: 16px;
      }

      .feature-priority,
      .feature-status {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 140px;
      }

      .feature-content {
        display: grid;
        gap: 20px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .form-control.small {
        padding: 8px 12px;
        font-size: 14px;
      }

      .remove-button {
        background: #ef4444;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s ease;
      }

      .remove-button:hover {
        background: #dc2626;
      }

      /* Feature Summary Styles */
      .feature-summary {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 24px;
      }

      .summary-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .stat-card {
        background: white;
        padding: 16px;
        border-radius: 8px;
        text-align: center;
        border: 1px solid #e2e8f0;
      }

      .stat-card h4 {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: #64748b;
        font-weight: 500;
      }

      .stat-number {
        font-size: 24px;
        font-weight: 700;
        color: #3b82f6;
      }

      .priority-breakdown h4 {
        margin: 0 0 12px 0;
        font-size: 16px;
        color: #1e293b;
        font-weight: 600;
      }

      .priority-list {
        display: grid;
        gap: 8px;
      }

      .priority-item {
        padding: 8px 12px;
        background: white;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
        font-size: 14px;
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #64748b;
        background: #f8fafc;
        border: 2px dashed #cbd5e1;
        border-radius: 12px;
      }

      .empty-state p {
        margin: 0;
        font-size: 16px;
      }

      /* Enhanced Data Fields Styling */
      .dropdown-options-section {
        background: #f8fafc;
        border: 2px dashed #cbd5e1;
        border-radius: 8px;
        padding: 20px;
        margin-top: 16px;
      }

      .options-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .add-option-btn {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .add-option-btn:hover {
        background: #2563eb;
      }

      .options-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .option-item {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 16px;
        position: relative;
      }

      .option-content {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr auto;
        gap: 12px;
        align-items: end;
      }

      .option-input-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .option-label {
        font-size: 12px;
        font-weight: 500;
        color: #64748b;
      }

      .option-input {
        padding: 6px 8px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 14px;
      }

      .remove-option-btn {
        background: #ef4444;
        color: white;
        border: none;
        padding: 6px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        height: fit-content;
      }

      .remove-option-btn:hover {
        background: #dc2626;
      }

      .no-options {
        text-align: center;
        padding: 20px;
        color: #64748b;
        font-style: italic;
      }

      .no-options p {
        margin: 0;
      }

      /* Field Properties Styling */
      .field-properties {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        border: 1px solid #0ea5e9;
        border-radius: 8px;
        padding: 20px;
        margin-top: 16px;
      }

      .field-behavior {
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        border: 1px solid #22c55e;
        border-radius: 8px;
        padding: 20px;
        margin-top: 16px;
      }

      .property-section-title {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .property-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .property-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .property-label {
        font-size: 12px;
        font-weight: 500;
        color: #374151;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .behavior-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
      }

      .form-control.small {
        padding: 6px 8px;
        font-size: 13px;
      }

      /* Enhanced Features Tab Styling */
      .add-requirement-section {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        border: 2px dashed #0ea5e9;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        margin-top: 16px;
      }

      .add-requirement-btn {
        background: #0ea5e9;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 8px;
      }

      .add-requirement-btn:hover {
        background: #0284c7;
        transform: translateY(-2px);
      }

      .add-requirement-help {
        margin: 0;
        font-size: 14px;
        color: #64748b;
        font-style: italic;
      }

      .requirements-summary {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 24px;
        margin-top: 24px;
      }

      .summary-title {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 600;
        color: #1e293b;
      }

      .summary-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
      }

      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: white;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
      }

      .stat-label {
        font-size: 14px;
        color: #64748b;
        font-weight: 500;
      }

      .stat-value {
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
      }

      .stat-value.critical { color: #dc2626; }
      .stat-value.high { color: #ea580c; }
      .stat-value.completed { color: #16a34a; }

      /* Enhanced Download Tab Styling */
      .summary-grid-enhanced {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 24px;
      }

      .summary-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .summary-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f1f5f9;
      }

      .summary-icon {
        font-size: 20px;
      }

      .summary-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin: 0;
      }

      .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
        border-bottom: 1px solid #f8fafc;
      }

      .stat-row:last-child {
        border-bottom: none;
      }

      .stat-row .stat-label {
        font-size: 13px;
        color: #64748b;
      }

      .stat-row .stat-value {
        font-size: 14px;
        font-weight: 600;
        color: #1e293b;
      }

      .stat-row .stat-value.critical { color: #dc2626; }
      .stat-row .stat-value.high { color: #ea580c; }
      .stat-row .stat-value.completed { color: #16a34a; }
      .stat-row .stat-value.in-progress { color: #2563eb; }
      .stat-row .stat-value.testing { color: #7c3aed; }
      .stat-row .stat-value.draft { color: #64748b; }

      .export-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .export-btn {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 20px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
      }

      .export-btn:hover {
        border-color: #3b82f6;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
      }

      .export-btn.primary { border-color: #3b82f6; }
      .export-btn.primary:hover { border-color: #2563eb; background: #eff6ff; }

      .export-btn.secondary { border-color: #64748b; }
      .export-btn.secondary:hover { border-color: #475569; background: #f8fafc; }

      .export-btn.success { border-color: #22c55e; }
      .export-btn.success:hover { border-color: #16a34a; background: #f0fdf4; }

      .export-btn.info { border-color: #06b6d4; }
      .export-btn.info:hover { border-color: #0891b2; background: #f0fdfa; }

      .export-btn.warning { border-color: #f59e0b; }
      .export-btn.warning:hover { border-color: #d97706; background: #fffbeb; }

      .export-btn.dark { border-color: #374151; }
      .export-btn.dark:hover { border-color: #1f2937; background: #f9fafb; }

      .export-icon {
        font-size: 24px;
        margin-bottom: 8px;
      }

      .export-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 4px;
      }

      .export-desc {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 8px;
        line-height: 1.4;
      }

      .export-features {
        font-size: 12px;
        color: #9ca3af;
        font-style: italic;
        line-height: 1.3;
      }

      /* Export Configuration Styling */
      .export-config {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 24px;
      }

      .config-section {
        margin-bottom: 24px;
      }

      .config-section:last-child {
        margin-bottom: 0;
      }

      .config-title {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
      }

      .checkbox-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        transition: background-color 0.2s ease;
      }

      .checkbox-item:hover {
        background: #f1f5f9;
      }

      .checkbox-item input[type="checkbox"] {
        margin: 0;
      }

      .format-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
      }

      .format-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
      }

      .format-item span {
        font-size: 14px;
        color: #374151;
        font-weight: 500;
      }

      .format-item select {
        padding: 4px 8px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 13px;
      }
    }
  `]
})
export class ProjectDetailCleanComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Signals for reactive state management
  activeTab = signal<string>('basic-info');
  project = signal<Project>({
    id: '1',
    title: 'E-Commerce Platform Requirements',
    version: '1.0.0',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    author: 'Product Team',
    description: 'A comprehensive e-commerce platform with modern features and scalability.',
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
      phone: '(555) 123-4567',
      department: 'Product',
      responsibilities: 'Overall product strategy and roadmap management'
    }
  ]);

  whatWeNeed = signal<WhatWeNeed>({
    userExperienceGoals: '',
    whatsIncluded: '',
    whatsNotIncluded: '',
    keyAssumptionsAndDependencies: '',
    businessGoals: '',
    dataStorageNeeds: '',
    externalServicesIntegrations: '',
    dataMigration: '',
    complianceRequirements: '',
    platformRequirements: '',
    performanceRequirements: '',
    scalabilityRequirements: ''
  });

  dataFields = signal<DataField[]>([]);

  features = signal<Feature[]>([
    {
      id: '1',
      title: 'User Authentication System',
      importance: 'critical',
      type: 'functional',
      description: 'Secure user login and registration system',
      detailedDescription: 'A comprehensive authentication system with email verification, password reset, and social login options.',
      acceptanceCriteria: ['Users can register with email and password', 'Users can login securely', 'Password reset functionality works'],
      businessRules: ['Passwords must be at least 8 characters', 'Email verification is required'],
      status: 'approved',
      priority: 'Critical',
      category: 'Authentication',
      effortEstimate: 'L',
      userStory: 'As a user, I want to securely log into the system, so that I can access my personal data',
      dependencies: '',
      targetRelease: 'MVP',
      technicalNotes: 'Use JWT tokens for session management',
      businessValue: 'Essential for user data security and access control'
    }
  ]);

  successCriteria = signal<SuccessCriteria>({
    successCriteria: '',
    userTestingPlan: '',
    dataQualityRules: '',
    performanceRequirements: '',
    securityRequirements: ''
  });

  ngOnInit() {
    console.log('Project Detail Clean Component initialized');
  }

  setActiveTab(tabId: string) {
    this.activeTab.set(tabId);
  }

  getProjectProgress(): number {
    return 65; // Mock progress
  }

  getStakeholderCount(): number {
    return this.stakeholders().length;
  }

  addStakeholder() {
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
    this.stakeholders.update(current => [...current, newStakeholder]);
  }

  removeStakeholder(index: number) {
    this.stakeholders.update(current => current.filter((_, i) => i !== index));
  }

  addFeature() {
    const newFeature: Feature = {
      id: Date.now().toString(),
      title: '',
      importance: 'medium',
      type: 'functional',
      description: '',
      detailedDescription: '',
      acceptanceCriteria: [],
      businessRules: [],
      status: 'draft',
      priority: 'Medium',
      category: '',
      effortEstimate: '',
      userStory: '',
      dependencies: '',
      targetRelease: '',
      technicalNotes: '',
      businessValue: ''
    };
    this.features.update(current => [...current, newFeature]);
  }

  removeFeature(index: number) {
    this.features.update(current => current.filter((_, i) => i !== index));
  }

  getFeaturesByPriority(priorities: string[]): Feature[] {
    return this.features().filter(feature => priorities.includes(feature.priority));
  }

  getFeaturesByStatus(status: string): Feature[] {
    return this.features().filter(feature => feature.status === status);
  }

  // Enhanced filtering methods for Features tab
  getFeaturesByImportance(importance: string): Feature[] {
    return this.features().filter(feature => feature.importance === importance);
  }

  getFeaturesByType(type: string): Feature[] {
    return this.features().filter(feature => feature.type === type);
  }

  // Method for "Add This Requirement" button
  addRequirementToFeature(index: number) {
    const feature = this.features()[index];
    if (feature?.title) {
      // Here you could add logic to save the requirement to a formal requirements list
      alert(`Requirement "${feature.title}" has been added to the formal requirements list.`);
      // You could also update the feature status to indicate it's been formalized
      this.features.update(current => {
        const updated = [...current];
        updated[index] = { ...updated[index], status: 'approved' };
        return updated;
      });
    }
  }

  // Download tab helper methods
  getStakeholdersByType(type: string): Stakeholder[] {
    return this.stakeholders().filter(stakeholder => stakeholder.type === type);
  }

  getRequiredFields(): DataField[] {
    return this.dataFields().filter(field => field.required);
  }

  getCompletionPercentage(): number {
    const totalItems = this.features().length + this.stakeholders().length + this.dataFields().length;
    if (totalItems === 0) return 0;
    
    const completedFeatures = this.getFeaturesByStatus('completed').length;
    const definedStakeholders = this.stakeholders().filter(s => s.name && s.role).length;
    const definedFields = this.dataFields().filter(f => f.name && f.displayLabel).length;
    
    const completedItems = completedFeatures + definedStakeholders + definedFields;
    return Math.round((completedItems / totalItems) * 100);
  }

  isSuccessCriteriaDefined(): boolean {
    const criteria = this.successCriteria();
    return !!(criteria.successCriteria || criteria.userTestingPlan || 
              criteria.performanceRequirements || criteria.securityRequirements);
  }

  // Export configuration
  exportConfig = signal({
    includeBasicInfo: true,
    includeWhatWeNeed: true,
    includeDataFields: true,
    includeStakeholders: true,
    includeFeatures: true,
    includeSuccessCriteria: true,
    includeTableOfContents: true,
    includePageNumbers: true,
    includeAppendices: true,
    colorScheme: 'professional'
  });

  // Method to update export configuration
  updateExportConfig(key: string, value: any) {
    this.exportConfig.update(current => ({
      ...current,
      [key]: value
    }));
  }

  // Export methods
  exportAsPDF() {
    console.log('Exporting as PDF with config:', this.exportConfig());
    alert('PDF export functionality would be implemented here');
  }

  exportAsWord() {
    console.log('Exporting as Word document');
    alert('Word export functionality would be implemented here');
  }

  exportComplete() {
    console.log('Exporting complete documentation');
    alert('Complete export functionality would be implemented here');
  }

  exportPackage() {
    console.log('Exporting as package');
    alert('Package export functionality would be implemented here');
  }

  exportExecutiveSummary() {
    console.log('Exporting executive summary');
    alert('Executive summary export functionality would be implemented here');
  }

  exportTechnicalSpecs() {
    console.log('Exporting technical specifications');
    alert('Technical specifications export functionality would be implemented here');
  }

  addDataField() {
    const newField: DataField = {
      id: Date.now().toString(),
      name: '',
      displayLabel: '',
      uiControl: 'text',
      dataType: 'string',
      placeholderText: '',
      defaultValue: '',
      maxLength: undefined,
      required: false,
      validationRules: '',
      description: '',
      dropdownOptions: [],
      securityLevel: 'public',
      visibility: 'always',
      trackAnalytics: false,
      autoUpdate: false,
      mobileOptimized: true,
      internationalization: false,
      conditionalLogic: '',
      dataDependencies: '',
      cssClasses: '',
      helpText: '',
      customErrorMessage: '',
      apiEndpoint: ''
    };
    this.dataFields.update(current => [...current, newField]);
  }

  removeDataField(index: number) {
    this.dataFields.update(current => current.filter((_, i) => i !== index));
  }

  onUiControlChange(field: DataField, index: number) {
    // Initialize dropdown options if select/multiselect/radio is chosen
    if ((field.uiControl === 'select' || field.uiControl === 'multiselect' || field.uiControl === 'radio') && 
        field.dropdownOptions.length === 0) {
      field.dropdownOptions = [
        { value: 'option1', display: 'Option 1', description: '' },
        { value: 'option2', display: 'Option 2', description: '' }
      ];
    }
  }

  addDropdownOption(field: DataField, fieldIndex: number) {
    field.dropdownOptions.push({
      value: '',
      display: '',
      description: ''
    });
  }

  removeDropdownOption(field: DataField, optionIndex: number) {
    field.dropdownOptions.splice(optionIndex, 1);
  }

  updateAcceptanceCriteria(index: number, event: any) {
    const criteria = event.target.value.split('\n').filter((c: string) => c.trim());
    this.features.update(current => {
      const updated = [...current];
      updated[index] = { ...updated[index], acceptanceCriteria: criteria };
      return updated;
    });
  }

  updateBusinessRules(index: number, event: any) {
    const rules = event.target.value.split('\n').filter((r: string) => r.trim());
    this.features.update(current => {
      const updated = [...current];
      updated[index] = { ...updated[index], businessRules: rules };
      return updated;
    });
  }

  getHighPriorityCount(): number {
    return this.features().filter(f => f.importance === 'critical' || f.importance === 'high').length;
  }

  getFunctionalCount(): number {
    return this.features().filter(f => f.type === 'functional').length;
  }
}
