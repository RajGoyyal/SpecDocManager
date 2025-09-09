import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectTemplatesService, ProjectTemplate } from '../services/project-templates.service';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'review' | 'completed';
  version: string;
  author: string;
  createdDate: string;
  lastModified: string;
  progress: number;
  template?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="projects-container">
      <!-- Header Section -->
      <header class="projects-header">
        <div class="header-content">
          <div class="header-info">
            <h1>Project Specifications</h1>
            <p>Manage and create comprehensive project documentation</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="toggleNewProjectModal()">
              <span class="icon">✨</span>
              New Project
            </button>
          </div>
        </div>
      </header>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            class="search-input"
            placeholder="Search projects by name or description..."
            [ngModel]="searchTerm()"
            (ngModelChange)="updateSearch($event)">
        </div>
        
        <div class="filter-tabs">
          <button 
            class="filter-tab" 
            [class.active]="statusFilter() === 'all'"
            (click)="updateStatusFilter('all')">
            All Projects ({{getProjectsByStatus('all').length}})
          </button>
          <button 
            class="filter-tab" 
            [class.active]="statusFilter() === 'draft'"
            (click)="updateStatusFilter('draft')">
            Draft ({{getProjectsByStatus('draft').length}})
          </button>
          <button 
            class="filter-tab" 
            [class.active]="statusFilter() === 'active'"
            (click)="updateStatusFilter('active')">
            Active ({{getProjectsByStatus('active').length}})
          </button>
          <button 
            class="filter-tab" 
            [class.active]="statusFilter() === 'review'"
            (click)="updateStatusFilter('review')">
            Review ({{getProjectsByStatus('review').length}})
          </button>
          <button 
            class="filter-tab" 
            [class.active]="statusFilter() === 'completed'"
            (click)="updateStatusFilter('completed')">
            Completed ({{getProjectsByStatus('completed').length}})
          </button>
        </div>

        <div class="view-controls">
          <button 
            class="view-toggle" 
            [class.active]="viewMode() === 'grid'"
            (click)="viewMode.set('grid')"
            title="Grid View">
            ⊞
          </button>
          <button 
            class="view-toggle" 
            [class.active]="viewMode() === 'list'"
            (click)="viewMode.set('list')"
            title="List View">
            ☰
          </button>
        </div>
      </div>

      <!-- Projects Grid/List -->
      <div class="projects-content" [class]="viewMode()">
        <div *ngIf="filteredProjects().length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No Projects Found</h3>
          <p *ngIf="searchTerm()">Try adjusting your search terms or filters</p>
          <p *ngIf="!searchTerm()">Create your first project to get started</p>
          <button class="btn btn-primary" (click)="toggleNewProjectModal()">
            Create New Project
          </button>
        </div>

        <div *ngFor="let project of filteredProjects(); trackBy: trackByProjectId" 
             class="project-card" 
             (click)="openProject(project.id)">
          
          <div class="project-header">
            <div class="project-title-section">
              <h3 class="project-title">{{project.title}}</h3>
              <span class="project-template" *ngIf="project.template">{{project.template}}</span>
            </div>
            <div class="project-status">
              <span class="status-badge" [class]="'status-' + project.status">
                {{project.status}}
              </span>
            </div>
          </div>

          <div class="project-info">
            <p class="project-description">{{project.description}}</p>
            
            <div class="project-meta">
              <div class="meta-item">
                <span class="meta-icon">👤</span>
                <span>{{project.author}}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📅</span>
                <span>{{formatDate(project.createdDate)}}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">🏷️</span>
                <span>v{{project.version}}</span>
              </div>
            </div>

            <div class="progress-section">
              <div class="progress-info">
                <span class="progress-label">Completion</span>
                <span class="progress-percentage">{{project.progress}}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="project.progress"></div>
              </div>
            </div>
          </div>

          <div class="project-actions" (click)="$event.stopPropagation()">
            <button class="btn-icon" (click)="duplicateProject(project)" title="Duplicate">
              📋
            </button>
            <button class="btn-icon" (click)="exportProject(project)" title="Export">
              ⬇️
            </button>
            <button class="btn-icon danger" (click)="deleteProject(project.id)" title="Delete">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-value">{{projects().length}}</div>
          <div class="stat-label">Total Projects</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{getProjectsByStatus('active').length}}</div>
          <div class="stat-label">Active Projects</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{getProjectsByStatus('completed').length}}</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{getAverageProgress()}}%</div>
          <div class="stat-label">Avg Progress</div>
        </div>
      </div>
    </div>

    <!-- New Project Modal -->
    <div *ngIf="showNewProjectModal()" class="modal-overlay" (click)="toggleNewProjectModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Create New Project</h2>
          <button class="btn-close" (click)="toggleNewProjectModal()">×</button>
        </div>

        <div class="modal-body">
          <div class="template-selection">
            <h3>Choose a Template</h3>
            <p>Start with a pre-configured template or create from scratch</p>
            
            <div class="template-categories">
              <button 
                *ngFor="let category of templateCategories()"
                class="category-btn"
                [class.active]="selectedCategory() === category"
                (click)="selectedCategory.set(category)">
                {{category | titlecase}}
              </button>
            </div>

            <div class="templates-grid">
              <div 
                *ngFor="let template of getTemplatesByCategory(selectedCategory())"
                class="template-card"
                [class.selected]="selectedTemplate() === template.id"
                (click)="selectedTemplate.set(template.id)">
                
                <div class="template-icon">{{template.icon}}</div>
                <h4>{{template.name}}</h4>
                <p>{{template.description}}</p>
              </div>

              <!-- Blank Template -->
              <div 
                class="template-card blank"
                [class.selected]="selectedTemplate() === 'blank'"
                (click)="selectedTemplate.set('blank')">
                
                <div class="template-icon">📄</div>
                <h4>Blank Project</h4>
                <p>Start from scratch with empty sections</p>
              </div>
            </div>
          </div>

          <div class="project-details" *ngIf="selectedTemplate()">
            <h3>Project Details</h3>
            <div class="form-group">
              <label>Project Name</label>
              <input 
                type="text" 
                class="form-control"
                placeholder="Enter project name"
                [ngModel]="newProjectName()"
                (ngModelChange)="newProjectName.set($event)">
            </div>
            <div class="form-group">
              <label>Author</label>
              <input 
                type="text" 
                class="form-control"
                placeholder="Enter your name"
                [ngModel]="newProjectAuthor()"
                (ngModelChange)="newProjectAuthor.set($event)">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="toggleNewProjectModal()">
            Cancel
          </button>
          <button 
            class="btn btn-primary" 
            (click)="createProject()"
            [disabled]="!selectedTemplate() || !newProjectName().trim()">
            Create Project
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .projects-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .projects-header {
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .header-info h1 {
      margin: 0 0 0.5rem 0;
      color: #1e293b;
      font-size: 2rem;
      font-weight: 700;
    }

    .header-info p {
      margin: 0;
      color: #64748b;
      font-size: 1rem;
    }

    .filters-section {
      background: white;
      padding: 1.5rem 2rem;
      border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      display: flex;
      gap: 2rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-bar {
      position: relative;
      flex: 1;
      min-width: 300px;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
    }

    .filter-tab {
      padding: 0.5rem 1rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-tab:hover {
      background: #f3f4f6;
    }

    .filter-tab.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .view-controls {
      display: flex;
      gap: 0.25rem;
    }

    .view-toggle {
      padding: 0.5rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .view-toggle:hover {
      background: #f3f4f6;
    }

    .view-toggle.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .projects-content {
      margin-bottom: 2rem;
    }

    .projects-content.grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 1.5rem;
    }

    .projects-content.list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .project-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
    }

    .project-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-color: #3b82f6;
      transform: translateY(-1px);
    }

    .projects-content.list .project-card {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 1rem 1.5rem;
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .project-title-section {
      flex: 1;
    }

    .project-title {
      margin: 0 0 0.25rem 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
      line-height: 1.3;
    }

    .project-template {
      font-size: 0.75rem;
      color: #6b7280;
      background: #f3f4f6;
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .status-draft { background: #f1f5f9; color: #475569; }
    .status-active { background: #dcfce7; color: #166534; }
    .status-review { background: #fef3c7; color: #92400e; }
    .status-completed { background: #dbeafe; color: #1e40af; }

    .project-info {
      flex: 1;
    }

    .project-description {
      color: #64748b;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0 0 1rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .project-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      color: #6b7280;
    }

    .meta-icon {
      font-size: 0.875rem;
    }

    .progress-section {
      margin-bottom: 1rem;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .progress-label {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
    }

    .progress-percentage {
      font-size: 0.75rem;
      color: #1f2937;
      font-weight: 600;
    }

    .progress-bar {
      height: 0.5rem;
      background: #f3f4f6;
      border-radius: 0.25rem;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      transition: width 0.3s ease;
    }

    .project-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #f1f5f9;
    }

    .btn-icon {
      padding: 0.5rem;
      border: none;
      background: #f8fafc;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: #e2e8f0;
    }

    .btn-icon.danger:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #64748b;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #374151;
      font-size: 1.5rem;
    }

    .empty-state p {
      margin: 0 0 2rem 0;
      font-size: 1rem;
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
    }

    .modal-content {
      background: white;
      border-radius: 1rem;
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h2 {
      margin: 0;
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .btn-close {
      padding: 0.5rem;
      border: none;
      background: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
      border-radius: 0.25rem;
    }

    .btn-close:hover {
      background: #f3f4f6;
    }

    .modal-body {
      padding: 2rem;
    }

    .template-selection h3 {
      margin: 0 0 0.5rem 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .template-selection p {
      margin: 0 0 1.5rem 0;
      color: #64748b;
    }

    .template-categories {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .category-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .category-btn:hover {
      background: #f3f4f6;
    }

    .category-btn.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .template-card {
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .template-card:hover {
      border-color: #3b82f6;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
    }

    .template-card.selected {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .template-card.blank {
      border-style: dashed;
    }

    .template-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .template-card h4 {
      margin: 0 0 0.5rem 0;
      color: #1e293b;
      font-size: 1rem;
      font-weight: 600;
    }

    .template-card p {
      margin: 0;
      color: #64748b;
      font-size: 0.875rem;
      line-height: 1.4;
    }

    .project-details {
      border-top: 1px solid #e5e7eb;
      padding-top: 2rem;
    }

    .project-details h3 {
      margin: 0 0 1rem 0;
      color: #1e293b;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
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
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1.5rem 2rem;
      border-top: 1px solid #e5e7eb;
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
      gap: 0.5rem;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-primary:disabled {
      background: #94a3b8;
      cursor: not-allowed;
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

    .icon {
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .projects-container {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .filters-section {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .search-bar {
        min-width: auto;
      }

      .filter-tabs {
        flex-wrap: wrap;
      }

      .projects-content.grid {
        grid-template-columns: 1fr;
      }

      .projects-content.list .project-card {
        flex-direction: column;
        align-items: stretch;
      }

      .modal-overlay {
        padding: 1rem;
      }

      .templates-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProjectsComponent {
  private readonly router = inject(Router);
  private readonly templatesService = inject(ProjectTemplatesService);

  searchTerm = signal('');
  statusFilter = signal<'all' | 'draft' | 'active' | 'review' | 'completed'>('all');
  viewMode = signal<'grid' | 'list'>('grid');
  
  // Modal state
  showNewProjectModal = signal(false);
  selectedTemplate = signal<string>('');
  selectedCategory = signal('web');
  newProjectName = signal('');
  newProjectAuthor = signal('');

  projects = signal<Project[]>([
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'Modern e-commerce platform with user authentication, payment processing, and inventory management',
      status: 'active',
      version: '2.1.0',
      author: 'Sarah Johnson',
      createdDate: '2024-01-15',
      lastModified: '2024-02-20',
      progress: 75,
      template: 'Web Application'
    },
    {
      id: '2',
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication and real-time transaction processing',
      status: 'review',
      version: '1.5.2',
      author: 'Mike Chen',
      createdDate: '2024-02-01',
      lastModified: '2024-02-18',
      progress: 90,
      template: 'Mobile Application'
    },
    {
      id: '3',
      title: 'Analytics Dashboard',
      description: 'Business intelligence dashboard with real-time data visualization and custom reporting capabilities',
      status: 'completed',
      version: '3.0.0',
      author: 'Emily Rodriguez',
      createdDate: '2023-11-10',
      lastModified: '2024-01-05',
      progress: 100,
      template: 'Data Analytics Platform'
    },
    {
      id: '4',
      title: 'API Gateway Service',
      description: 'Microservices API gateway with authentication, rate limiting, and monitoring capabilities',
      status: 'draft',
      version: '1.0.0',
      author: 'David Kim',
      createdDate: '2024-02-15',
      lastModified: '2024-02-15',
      progress: 25,
      template: 'API Service'
    }
  ]);

  templateCategories = signal(['web', 'mobile', 'api', 'data', 'other']);
  filteredProjects = signal<Project[]>([]);

  constructor() {
    this.updateFilteredProjects();
  }

  private updateFilteredProjects() {
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    
    this.filteredProjects.set(
      this.projects().filter(project => {
        const matchesSearch = !term || 
          project.title.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.author.toLowerCase().includes(term);
        
        const matchesStatus = status === 'all' || project.status === status;
        
        return matchesSearch && matchesStatus;
      })
    );
  }

  updateSearch(term: string) {
    this.searchTerm.set(term);
    this.updateFilteredProjects();
  }

  updateStatusFilter(status: 'all' | 'draft' | 'active' | 'review' | 'completed') {
    this.statusFilter.set(status);
    this.updateFilteredProjects();
  }

  getProjectsByStatus(status: string): Project[] {
    if (status === 'all') return this.projects();
    return this.projects().filter(p => p.status === status);
  }

  getAverageProgress(): number {
    const projects = this.projects();
    if (projects.length === 0) return 0;
    const total = projects.reduce((sum, p) => sum + p.progress, 0);
    return Math.round(total / projects.length);
  }

  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getTemplatesByCategory(category: string) {
    return this.templatesService.getTemplatesByCategory(category);
  }

  openProject(id: string) {
    this.router.navigate(['/projects', id]);
  }

  createProject() {
    if (!this.selectedTemplate() || !this.newProjectName().trim()) return;

    const newId = (this.projects().length + 1).toString();
    let newProject: Project;

    if (this.selectedTemplate() === 'blank') {
      newProject = {
        id: newId,
        title: this.newProjectName(),
        description: '',
        status: 'draft',
        version: '1.0.0',
        author: this.newProjectAuthor() || 'Unknown',
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        progress: 0
      };
    } else {
      const template = this.templatesService.getTemplate(this.selectedTemplate());
      newProject = {
        id: newId,
        title: this.newProjectName(),
        description: template?.defaultData.project.description || '',
        status: 'draft',
        version: '1.0.0',
        author: this.newProjectAuthor() || 'Unknown',
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        progress: 15,
        template: template?.name
      };
    }

    this.projects.update(projects => [...projects, newProject]);
    this.updateFilteredProjects();
    this.toggleNewProjectModal();
    this.router.navigate(['/projects', newId]);
  }

  duplicateProject(project: Project) {
    const newId = (this.projects().length + 1).toString();
    const duplicated: Project = {
      ...project,
      id: newId,
      title: `${project.title} (Copy)`,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      status: 'draft',
      progress: 0
    };

    this.projects.update(projects => [...projects, duplicated]);
    this.updateFilteredProjects();
  }

  exportProject(project: Project) {
    console.log('Exporting project:', project);
    alert(`Exporting "${project.title}" - This would trigger the export functionality.`);
  }

  deleteProject(id: string) {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      this.projects.update(projects => projects.filter(p => p.id !== id));
      this.updateFilteredProjects();
    }
  }

  toggleNewProjectModal() {
    this.showNewProjectModal.update(show => !show);
    if (!this.showNewProjectModal()) {
      this.selectedTemplate.set('');
      this.newProjectName.set('');
      this.newProjectAuthor.set('');
      this.selectedCategory.set('web');
    }
  }
}
