import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, Project } from '../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-projects',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
      <div class="stack-lg" style="max-width: 760px; margin: 0 auto;">
        <div class="stack">
          <h1>Projects</h1>
          <form (ngSubmit)="createProject()" class="form-row">
            <div class="field">
              <label class="label">Title</label>
              <input [(ngModel)]="newProject.title" name="title" required class="input" />
            </div>
            <div class="field">
              <label class="label">Author</label>
              <input [(ngModel)]="newProject.author" name="author" required class="input" />
            </div>
            <button type="submit" class="btn btn-primary">Create</button>
          </form>
        </div>

        <ul class="list">
          <li *ngFor="let p of projects" class="list-item card">
            <div>
              <a [routerLink]="['/projects', p.id]" style="text-decoration:none"><strong>{{ p.title }}</strong></a>
              <span class="pill" style="margin-left:8px">v{{ p.version }}</span>
            </div>
            <span class="muted">→</span>
          </li>
        </ul>
      </div>
  `,
})
export class ProjectsComponent implements OnInit {
  private readonly api = inject(ApiService);
  projects: Project[] = [];
  newProject = { title: '', author: 'current-user' };

  ngOnInit(): void {
    this.api.getProjects().subscribe((ps) => (this.projects = ps));
  }

  createProject() {
    this.api.createProject(this.newProject).subscribe(p => {
      this.projects = [p, ...this.projects];
      this.newProject = { title: '', author: 'current-user' };
    });
  }
}
