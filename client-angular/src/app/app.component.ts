import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <!-- Professional Application Header -->
      <header class="app-header">
        <div class="app-header-content">
          <a href="#" class="app-logo">
            <div class="app-logo-icon">S</div>
            <span>SpecDoc Manager</span>
          </a>
          <nav class="flex items-center gap-6">
            <a href="#" class="text-secondary font-medium">Documentation</a>
            <a href="#" class="text-secondary font-medium">Support</a>
            <div class="flex items-center gap-3">
              <button class="btn btn-ghost btn-sm">Settings</button>
              <button class="btn btn-primary btn-sm">Export</button>
            </div>
          </nav>
        </div>
      </header>

      <!-- Main Application Layout -->
      <div class="app-main">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = 'SpecDoc Manager';
}
