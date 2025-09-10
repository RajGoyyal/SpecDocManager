import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Project, Stakeholder, Milestone, ProjectRequirements, DataField, Feature, ProjectVersion, ActivityLog } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-project-detail',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="app-main" *ngIf="project as p; else loading">
      <!-- Professional Sidebar Navigation -->
      <aside class="app-sidebar">
        <!-- Project Overview -->
        <div class="nav-section">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{p.name}}</h3>
              <p class="card-description text-sm">{{p.description}}</p>
            </div>
            <div class="card-content">
              <div class="grid gap-3">
                <div class="flex items-center justify-between">
                  <span class="text-tertiary text-sm">Version</span>
                  <span class="font-medium">{{p.version || '1.0.0'}}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-tertiary text-sm">Status</span>
                  <span class="badge badge-success">Active</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-tertiary text-sm">Progress</span>
                  <span class="font-medium">67%</span>
                </div>
                <div class="progress">
                  <div class="progress-bar" style="width: 67%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div class="nav-section">
          <h3 class="nav-section-title">Project Sections</h3>
          <nav class="nav-list">
            <a href="#" class="nav-item" 
               [class.active]="activeTab() === 'basic-info'" 
               (click)="setActiveTab('basic-info')">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Basic Information
            </a>
            <a href="#" class="nav-item" 
               [class.active]="activeTab() === 'what-we-need'" 
               (click)="setActiveTab('what-we-need')">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
              </svg>
              Requirements
            </a>
            <a href="#" class="nav-item" 
               [class.active]="activeTab() === 'features'" 
               (click)="setActiveTab('features')">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Features
            </a>
            <a href="#" class="nav-item" 
               [class.active]="activeTab() === 'data-fields'" 
               (click)="setActiveTab('data-fields')">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-1 9H8V8h12v2zm-4 4H8v-2h8v2zm4-8H8V4h12v2z"/>
              </svg>
              Data Fields
            </a>
            <a href="#" class="nav-item" 
               [class.active]="activeTab() === 'success-criteria'" 
               (click)="setActiveTab('success-criteria')">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
              Success Criteria
            </a>
            <a href="#" class="nav-item" 
               [class.active]="activeTab() === 'download'" 
               (click)="setActiveTab('download')">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Export & Download
            </a>
          </nav>
        </div>

        <!-- Quick Actions -->
        <div class="nav-section">
          <h3 class="nav-section-title">Quick Actions</h3>
          <div class="grid gap-2">
            <button class="btn btn-ghost btn-sm w-full justify-start">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add Requirement
            </button>
            <button class="btn btn-ghost btn-sm w-full justify-start">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8l6-6V4c0-1.1-.9-2-2-2zm4 18L12 14v6h6z"/>
              </svg>
              Generate Doc
            </button>
            <button class="btn btn-ghost btn-sm w-full justify-start">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
              </svg>
              Attach File
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="app-content">
        <!-- Basic Information Tab -->
        <div *ngIf="activeTab() === 'basic-info'">
          <div class="mb-6">
            <h1 class="text-xl font-semibold mb-2">Project Information</h1>
            <p class="text-secondary">Manage basic project details and settings</p>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Project Details</h2>
            </div>
            <div class="card-content">
              <div class="grid gap-6">
                <div class="form-group">
                  <label class="form-label">Project Name</label>
                  <input type="text" class="form-control" [(ngModel)]="p.name" placeholder="Enter project name">
                </div>
                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" [(ngModel)]="p.description" placeholder="Describe your project" rows="4"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="form-group">
                    <label class="form-label">Version</label>
                    <input type="text" class="form-control" [(ngModel)]="p.version" placeholder="1.0.0">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Priority</label>
                    <select class="form-control" [(ngModel)]="p.priority">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="flex gap-3">
                <button class="btn btn-primary">Save Changes</button>
                <button class="btn btn-secondary">Reset</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Requirements Tab -->
        <div *ngIf="activeTab() === 'what-we-need'">
          <div class="mb-6">
            <h1 class="text-xl font-semibold mb-2">Project Requirements</h1>
            <p class="text-secondary">Define what the project needs to accomplish</p>
          </div>

          <div class="grid gap-6">
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">Functional Requirements</h2>
                <p class="card-description">Core functionality that must be implemented</p>
              </div>
              <div class="card-content">
                <div class="form-group">
                  <label class="form-label">Core Features</label>
                  <textarea class="form-control" [(ngModel)]="reqModel.coreFeatures" 
                           placeholder="List the essential features and capabilities..." rows="6"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">User Interactions</label>
                  <textarea class="form-control" [(ngModel)]="reqModel.userInteractions" 
                           placeholder="Describe how users will interact with the system..." rows="4"></textarea>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h2 class="card-title">Technical Requirements</h2>
                <p class="card-description">Technical specifications and constraints</p>
              </div>
              <div class="card-content">
                <div class="form-group">
                  <label class="form-label">Technology Stack</label>
                  <textarea class="form-control" [(ngModel)]="reqModel.techStack" 
                           placeholder="Specify technologies, frameworks, and tools..." rows="4"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Performance Requirements</label>
                  <textarea class="form-control" [(ngModel)]="reqModel.performance" 
                           placeholder="Define performance metrics and expectations..." rows="4"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button class="btn btn-primary" (click)="saveRequirements()">Save Requirements</button>
            <button class="btn btn-secondary" (click)="resetRequirements()">Reset Changes</button>
            <button class="btn btn-ghost" (click)="generateDocument()">Generate FRS Document</button>
          </div>
        </div>

        <!-- Features Tab -->
        <div *ngIf="activeTab() === 'features'">
          <div class="mb-6">
            <h1 class="text-xl font-semibold mb-2">Feature Management</h1>
            <p class="text-secondary">Manage project features and their details</p>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Features List</h2>
              <button class="btn btn-primary btn-sm">Add Feature</button>
            </div>
            <div class="card-content">
              <div class="table-container" *ngIf="p.features && p.features.length > 0; else noFeatures">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Feature Name</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let feature of p.features">
                      <td class="font-medium">{{feature.name}}</td>
                      <td>
                        <span class="badge" [ngClass]="getPriorityClass(feature.priority)">
                          {{feature.priority}}
                        </span>
                      </td>
                      <td>
                        <span class="badge" [ngClass]="getStatusClass(feature.status)">
                          {{feature.status}}
                        </span>
                      </td>
                      <td>
                        <div class="flex items-center gap-2">
                          <div class="progress" style="width: 80px;">
                            <div class="progress-bar" [style.width]="feature.progress + '%'"></div>
                          </div>
                          <span class="text-sm text-tertiary">{{feature.progress}}%</span>
                        </div>
                      </td>
                      <td>
                        <div class="flex gap-1">
                          <button class="btn btn-ghost btn-sm">Edit</button>
                          <button class="btn btn-ghost btn-sm text-error">Delete</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ng-template #noFeatures>
                <div class="text-center py-8">
                  <p class="text-tertiary mb-4">No features defined yet</p>
                  <button class="btn btn-primary">Add Your First Feature</button>
                </div>
              </ng-template>
            </div>
          </div>
        </div>

        <!-- Data Fields Tab -->
        <div *ngIf="activeTab() === 'data-fields'">
          <div class="mb-6">
            <h1 class="text-xl font-semibold mb-2">Data Structure</h1>
            <p class="text-secondary">Define data fields and their specifications</p>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Data Fields</h2>
              <button class="btn btn-primary btn-sm">Add Field</button>
            </div>
            <div class="card-content">
              <div class="table-container" *ngIf="p.dataFields && p.dataFields.length > 0; else noDataFields">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Field Name</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let field of p.dataFields">
                      <td class="font-medium">{{field.name}}</td>
                      <td>
                        <span class="badge badge-neutral">{{field.type}}</span>
                      </td>
                      <td>
                        <span class="badge" [ngClass]="field.required ? 'badge-error' : 'badge-neutral'">
                          {{field.required ? 'Required' : 'Optional'}}
                        </span>
                      </td>
                      <td class="text-tertiary">{{field.description}}</td>
                      <td>
                        <div class="flex gap-1">
                          <button class="btn btn-ghost btn-sm">Edit</button>
                          <button class="btn btn-ghost btn-sm text-error">Delete</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ng-template #noDataFields>
                <div class="text-center py-8">
                  <p class="text-tertiary mb-4">No data fields defined yet</p>
                  <button class="btn btn-primary">Add Your First Field</button>
                </div>
              </ng-template>
            </div>
          </div>
        </div>

        <!-- Success Criteria Tab -->
        <div *ngIf="activeTab() === 'success-criteria'">
          <div class="mb-6">
            <h1 class="text-xl font-semibold mb-2">Success Criteria</h1>
            <p class="text-secondary">Define how success will be measured</p>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Project Success Metrics</h2>
            </div>
            <div class="card-content">
              <div class="grid gap-6">
                <div class="form-group">
                  <label class="form-label">Acceptance Criteria</label>
                  <textarea class="form-control" placeholder="Define the criteria that must be met for project acceptance..." rows="5"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Key Performance Indicators</label>
                  <textarea class="form-control" placeholder="List measurable KPIs for project success..." rows="4"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Quality Standards</label>
                  <textarea class="form-control" placeholder="Define quality standards and benchmarks..." rows="4"></textarea>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="flex gap-3">
                <button class="btn btn-primary">Save Criteria</button>
                <button class="btn btn-secondary">Reset</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Export & Download Tab -->
        <div *ngIf="activeTab() === 'download'">
          <div class="mb-6">
            <h1 class="text-xl font-semibold mb-2">Export & Download</h1>
            <p class="text-secondary">Generate and download project documentation</p>
          </div>

          <div class="grid gap-6">
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">Export Options</h2>
                <p class="card-description">Choose format and content for export</p>
              </div>
              <div class="card-content">
                <div class="grid gap-4">
                  <div class="flex items-center gap-3 p-4 border rounded-lg">
                    <input type="radio" name="exportFormat" value="pdf" class="form-radio">
                    <div>
                      <h4 class="font-medium">PDF Document</h4>
                      <p class="text-sm text-tertiary">Complete FRS document in PDF format</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 p-4 border rounded-lg">
                    <input type="radio" name="exportFormat" value="word" class="form-radio">
                    <div>
                      <h4 class="font-medium">Word Document</h4>
                      <p class="text-sm text-tertiary">Editable Microsoft Word document</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 p-4 border rounded-lg">
                    <input type="radio" name="exportFormat" value="html" class="form-radio">
                    <div>
                      <h4 class="font-medium">HTML Report</h4>
                      <p class="text-sm text-tertiary">Web-based interactive report</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <div class="flex gap-3">
                  <button class="btn btn-primary">Generate & Download</button>
                  <button class="btn btn-secondary">Preview</button>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h2 class="card-title">Recent Exports</h2>
              </div>
              <div class="card-content">
                <div class="text-center py-8">
                  <p class="text-tertiary">No recent exports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <ng-template #loading>
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-tertiary">Loading project...</p>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .grid { display: grid; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .w-4 { width: 1rem; }
    .h-4 { height: 1rem; }
    .h-8 { height: 2rem; }
    .w-8 { width: 2rem; }
    .h-64 { height: 16rem; }
    .animate-spin { animation: spin 1s linear infinite; }
    .form-radio { appearance: none; width: 1rem; height: 1rem; border: 1px solid var(--border); border-radius: 50%; background: var(--surface); }
    .form-radio:checked { background: var(--primary-600); border-color: var(--primary-600); }
    .text-error { color: var(--error-600); }
    .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
    .border { border: 1px solid var(--border); }
    .justify-start { justify-content: flex-start; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  
  project = signal<Project | null>(null);
  activeTab = signal<string>('basic-info');
  
  // Requirements model for editable form
  reqModel = {
    coreFeatures: '',
    userInteractions: '',
    techStack: '',
    performance: ''
  };

  ngOnInit() {
    // Load project data
    this.loadProject();
  }

  private loadProject() {
    // Simulate project loading
    setTimeout(() => {
      this.project.set({
        id: '1',
        name: 'E-Commerce Platform',
        description: 'A comprehensive e-commerce solution with modern features and scalable architecture.',
        version: '2.1.0',
        priority: 'high',
        features: [
          {
            id: '1',
            name: 'User Authentication',
            description: 'Secure login and registration system',
            priority: 'high',
            status: 'completed',
            progress: 100
          },
          {
            id: '2', 
            name: 'Product Catalog',
            description: 'Browse and search products',
            priority: 'high',
            status: 'in-progress',
            progress: 75
          },
          {
            id: '3',
            name: 'Shopping Cart',
            description: 'Add items and manage cart',
            priority: 'medium',
            status: 'pending',
            progress: 25
          }
        ],
        dataFields: [
          {
            id: '1',
            name: 'user_id',
            type: 'UUID',
            required: true,
            description: 'Unique identifier for users'
          },
          {
            id: '2',
            name: 'product_name',
            type: 'String',
            required: true,
            description: 'Name of the product'
          },
          {
            id: '3',
            name: 'price',
            type: 'Decimal',
            required: true,
            description: 'Product price in USD'
          }
        ]
      });

      // Load existing requirements
      this.loadRequirements();
    }, 500);
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': case 'critical': return 'badge-error';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-success';
      default: return 'badge-neutral';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'in-progress': return 'badge-warning';
      case 'pending': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  }

  async saveRequirements() {
    try {
      // Save requirements logic
      console.log('Saving requirements:', this.reqModel);
      // Show success message
    } catch (error) {
      console.error('Error saving requirements:', error);
    }
  }

  resetRequirements() {
    this.reqModel = {
      coreFeatures: '',
      userInteractions: '',
      techStack: '',
      performance: ''
    };
  }

  generateDocument() {
    console.log('Generating FRS document...');
    // Generate document logic
  }

  private async loadRequirements() {
    try {
      // Load existing requirements
      const requirements = await this.apiService.getRequirements(this.project()?.id || '');
      if (requirements) {
        this.reqModel = {
          coreFeatures: requirements.coreFeatures || '',
          userInteractions: requirements.userInteractions || '',
          techStack: requirements.techStack || '',
          performance: requirements.performance || ''
        };
      }
    } catch (error) {
      console.error('Error loading requirements:', error);
    }
  }
}
