import { Routes } from '@angular/router';
import { ProjectsComponent } from './pages/projects.component';
import { ProjectDetailCleanComponent } from './pages/project-detail-clean.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'projects' },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/:id', component: ProjectDetailCleanComponent },
  { path: '**', redirectTo: 'projects' },
];