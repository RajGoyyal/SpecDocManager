import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Stakeholder } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-add-stakeholder',
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="submit()" style="display:flex;gap:8px;flex-wrap:wrap;align-items:end">
      <div>
        <label style="display:block;font-size:12px;color:#6b7280">Name</label>
        <input [(ngModel)]="name" name="name" required style="border:1px solid #e5e7eb;border-radius:6px;padding:6px 8px" />
      </div>
      <div>
        <label style="display:block;font-size:12px;color:#6b7280">Role</label>
        <input [(ngModel)]="role" name="role" required style="border:1px solid #e5e7eb;border-radius:6px;padding:6px 8px" />
      </div>
      <div>
        <label style="display:block;font-size:12px;color:#6b7280">Type</label>
        <select [(ngModel)]="type" name="type" required style="border:1px solid #e5e7eb;border-radius:6px;padding:6px 8px">
          <option value="primary">primary</option>
          <option value="secondary">secondary</option>
          <option value="reviewer">reviewer</option>
        </select>
      </div>
      <button type="submit" style="padding:6px 10px;border:1px solid #111827;color:white;background:#111827;border-radius:6px">Add</button>
    </form>
  `,
})
export class AddStakeholderComponent {
  private readonly api = inject(ApiService);
  projectId = '';
  name = '';
  role = '';
  type: Stakeholder['type'] = 'primary';

  @Output() created = new EventEmitter<Stakeholder>();

  submit() {
    if (!this.projectId) return;
    const payload = { name: this.name, role: this.role, type: this.type } as any;
    this.api.addStakeholder(this.projectId, payload as any).subscribe((s) => {
      this.created.emit(s);
      this.name = this.role = '';
      this.type = 'primary';
    });
  }
}
