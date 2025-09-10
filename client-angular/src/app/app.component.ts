import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
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
