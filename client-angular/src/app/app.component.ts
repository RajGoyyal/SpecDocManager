import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main style="padding:1rem;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
      <h1>SpecDocManager (Angular)</h1>
      <p>Angular client is running. API is expected at <code>/api</code> (proxied in dev).</p>
      <p><a href="/api/projects" target="_blank" rel="noopener">Open raw API: /api/projects</a></p>
      <section *ngIf="projects; else loading">
        <h2>Projects</h2>
        <ul>
          <li *ngFor="let p of projects">{{ p.title }} ({{ p.id }})</li>
        </ul>
      </section>
      <ng-template #loading>
        <p>Loading projects…</p>
      </ng-template>
    </main>
  `,
  styles: [],
})
export class AppComponent {
  title = 'client-angular';
  projects: any[] | null = null;
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    // Avoid SSR fetch; only fetch in browser
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<any[]>("/api/projects").subscribe({
        next: (data) => (this.projects = data),
        error: () => (this.projects = []),
      });
    }
  }
}
