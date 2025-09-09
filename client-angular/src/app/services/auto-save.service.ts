import { Injectable, signal } from '@angular/core';

export interface AutoSaveData {
  projectId: string;
  lastSaved: Date;
  changes: any;
  isAutoSaving: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AutoSaveService {
  private autoSaveInterval: any;
  private pendingChanges = new Map<string, any>();
  
  isAutoSaving = signal(false);
  lastSaved = signal<Date | null>(null);
  hasUnsavedChanges = signal(false);

  startAutoSave(projectId: string, saveCallback: (data: any) => Promise<void>) {
    this.stopAutoSave();
    
    this.autoSaveInterval = setInterval(async () => {
      const changes = this.pendingChanges.get(projectId);
      if (changes && Object.keys(changes).length > 0) {
        try {
          this.isAutoSaving.set(true);
          await saveCallback(changes);
          this.pendingChanges.set(projectId, {});
          this.lastSaved.set(new Date());
          this.hasUnsavedChanges.set(false);
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          this.isAutoSaving.set(false);
        }
      }
    }, 3000); // Auto-save every 3 seconds
  }

  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  trackChanges(projectId: string, section: string, data: any) {
    const currentChanges = this.pendingChanges.get(projectId) || {};
    currentChanges[section] = data;
    this.pendingChanges.set(projectId, currentChanges);
    this.hasUnsavedChanges.set(true);
  }

  manualSave(projectId: string, data: any): Promise<void> {
    return new Promise((resolve) => {
      this.isAutoSaving.set(true);
      
      // Simulate API call
      setTimeout(() => {
        this.pendingChanges.set(projectId, {});
        this.lastSaved.set(new Date());
        this.hasUnsavedChanges.set(false);
        this.isAutoSaving.set(false);
        resolve();
      }, 500);
    });
  }

  getFormattedLastSaved(): string {
    const saved = this.lastSaved();
    if (!saved) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - saved.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    return saved.toLocaleDateString();
  }
}
