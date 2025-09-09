import { Injectable } from '@angular/core';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: string;
  description: string;
  callback: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardShortcutService {
  private shortcuts: KeyboardShortcut[] = [];
  private isListening = false;

  registerShortcut(shortcut: KeyboardShortcut): void {
    this.shortcuts.push(shortcut);
    if (!this.isListening) {
      this.startListening();
    }
  }

  registerShortcuts(shortcuts: KeyboardShortcut[]): void {
    shortcuts.forEach(shortcut => this.registerShortcut(shortcut));
  }

  unregisterShortcut(action: string): void {
    this.shortcuts = this.shortcuts.filter(s => s.action !== action);
  }

  clearShortcuts(): void {
    this.shortcuts = [];
  }

  getShortcuts(): KeyboardShortcut[] {
    return [...this.shortcuts];
  }

  getShortcutHelp(): string {
    return this.shortcuts
      .map(s => `${this.formatShortcut(s)}: ${s.description}`)
      .join('\n');
  }

  private startListening(): void {
    if (this.isListening) return;
    // Only run in browser environment
    if (typeof document === 'undefined') return;
    
    this.isListening = true;
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private stopListening(): void {
    if (!this.isListening) return;
    // Only run in browser environment
    if (typeof document === 'undefined') return;
    
    this.isListening = false;
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const matchingShortcut = this.shortcuts.find(shortcut => 
      this.matchesShortcut(event, shortcut)
    );

    if (matchingShortcut) {
      event.preventDefault();
      event.stopPropagation();
      matchingShortcut.callback();
    }
  }

  private matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    return (
      event.key.toLowerCase() === shortcut.key.toLowerCase() &&
      !!event.ctrlKey === !!shortcut.ctrl &&
      !!event.altKey === !!shortcut.alt &&
      !!event.shiftKey === !!shortcut.shift
    );
  }

  private formatShortcut(shortcut: KeyboardShortcut): string {
    const keys: string[] = [];
    
    if (shortcut.ctrl) keys.push('Ctrl');
    if (shortcut.alt) keys.push('Alt');
    if (shortcut.shift) keys.push('Shift');
    keys.push(shortcut.key.toUpperCase());
    
    return keys.join(' + ');
  }

  // Common project management shortcuts
  getDefaultProjectShortcuts(callbacks: {
    save: () => void;
    export: () => void;
    newProject: () => void;
    search: () => void;
    help: () => void;
    undo: () => void;
    redo: () => void;
    copy: () => void;
    paste: () => void;
    selectAll: () => void;
    find: () => void;
    addStakeholder: () => void;
    addFeature: () => void;
    addDataField: () => void;
    nextTab: () => void;
    prevTab: () => void;
    togglePreview: () => void;
  }): KeyboardShortcut[] {
    return [
      // File operations
      {
        key: 's',
        ctrl: true,
        action: 'save',
        description: 'Save project',
        callback: callbacks.save
      },
      {
        key: 'e',
        ctrl: true,
        alt: true,
        action: 'export',
        description: 'Export project',
        callback: callbacks.export
      },
      {
        key: 'n',
        ctrl: true,
        action: 'new',
        description: 'New project',
        callback: callbacks.newProject
      },
      
      // Navigation
      {
        key: 'f',
        ctrl: true,
        action: 'search',
        description: 'Search projects',
        callback: callbacks.search
      },
      {
        key: '/',
        ctrl: true,
        action: 'find',
        description: 'Find in project',
        callback: callbacks.find
      },
      {
        key: 'Tab',
        ctrl: true,
        action: 'next-tab',
        description: 'Next tab',
        callback: callbacks.nextTab
      },
      {
        key: 'Tab',
        ctrl: true,
        shift: true,
        action: 'prev-tab',
        description: 'Previous tab',
        callback: callbacks.prevTab
      },
      
      // Editing
      {
        key: 'z',
        ctrl: true,
        action: 'undo',
        description: 'Undo',
        callback: callbacks.undo
      },
      {
        key: 'y',
        ctrl: true,
        action: 'redo',
        description: 'Redo',
        callback: callbacks.redo
      },
      {
        key: 'c',
        ctrl: true,
        action: 'copy',
        description: 'Copy',
        callback: callbacks.copy
      },
      {
        key: 'v',
        ctrl: true,
        action: 'paste',
        description: 'Paste',
        callback: callbacks.paste
      },
      {
        key: 'a',
        ctrl: true,
        action: 'select-all',
        description: 'Select all',
        callback: callbacks.selectAll
      },
      
      // Quick actions
      {
        key: '1',
        ctrl: true,
        alt: true,
        action: 'add-stakeholder',
        description: 'Add stakeholder',
        callback: callbacks.addStakeholder
      },
      {
        key: '2',
        ctrl: true,
        alt: true,
        action: 'add-feature',
        description: 'Add feature',
        callback: callbacks.addFeature
      },
      {
        key: '3',
        ctrl: true,
        alt: true,
        action: 'add-data-field',
        description: 'Add data field',
        callback: callbacks.addDataField
      },
      
      // View
      {
        key: 'p',
        ctrl: true,
        alt: true,
        action: 'toggle-preview',
        description: 'Toggle preview',
        callback: callbacks.togglePreview
      },
      
      // Help
      {
        key: '?',
        ctrl: true,
        action: 'help',
        description: 'Show keyboard shortcuts',
        callback: callbacks.help
      }
    ];
  }

  // Accessibility helpers
  announceShortcut(shortcut: KeyboardShortcut): void {
    const announcement = `Keyboard shortcut activated: ${shortcut.description}`;
    this.announceToScreenReader(announcement);
  }

  private announceToScreenReader(message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  destroy(): void {
    this.stopListening();
    this.clearShortcuts();
  }
}
