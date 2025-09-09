import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

export interface AccessibilityOptions {
  announceChanges: boolean;
  focusManagement: boolean;
  keyboardNavigation: boolean;
  screenReaderOptimizations: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private renderer: Renderer2;
  private options: AccessibilityOptions = {
    announceChanges: true,
    focusManagement: true,
    keyboardNavigation: true,
    screenReaderOptimizations: true,
    highContrast: false,
    reducedMotion: false
  };

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.initializeAccessibility();
  }

  private initializeAccessibility(): void {
    this.detectUserPreferences();
    this.setupGlobalAccessibilityFeatures();
  }

  private detectUserPreferences(): void {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Detect high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.options.highContrast = true;
      this.enableHighContrast();
    }

    // Detect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.options.reducedMotion = true;
      this.enableReducedMotion();
    }

    // Listen for preference changes
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      this.options.highContrast = e.matches;
      if (e.matches) {
        this.enableHighContrast();
      } else {
        this.disableHighContrast();
      }
    });

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.options.reducedMotion = e.matches;
      if (e.matches) {
        this.enableReducedMotion();
      } else {
        this.disableReducedMotion();
      }
    });
  }

  private setupGlobalAccessibilityFeatures(): void {
    // Only run in browser environment
    if (typeof document === 'undefined') return;
    
    // Add skip links
    this.addSkipLinks();
    
    // Setup focus management
    this.setupFocusManagement();
    
    // Setup screen reader announcements
    this.setupScreenReaderAnnouncements();
  }

  private addSkipLinks(): void {
    const skipLinksContainer = this.renderer.createElement('div');
    this.renderer.addClass(skipLinksContainer, 'skip-links');
    this.renderer.setStyle(skipLinksContainer, 'position', 'absolute');
    this.renderer.setStyle(skipLinksContainer, 'top', '-40px');
    this.renderer.setStyle(skipLinksContainer, 'left', '6px');
    this.renderer.setStyle(skipLinksContainer, 'z-index', '9999');

    const skipToMain = this.renderer.createElement('a');
    this.renderer.setAttribute(skipToMain, 'href', '#main-content');
    this.renderer.setProperty(skipToMain, 'textContent', 'Skip to main content');
    this.renderer.addClass(skipToMain, 'skip-link');
    this.renderer.setStyle(skipToMain, 'background', '#000');
    this.renderer.setStyle(skipToMain, 'color', '#fff');
    this.renderer.setStyle(skipToMain, 'padding', '8px');
    this.renderer.setStyle(skipToMain, 'text-decoration', 'none');
    this.renderer.setStyle(skipToMain, 'border-radius', '4px');

    // Show on focus
    this.renderer.listen(skipToMain, 'focus', () => {
      this.renderer.setStyle(skipLinksContainer, 'top', '6px');
    });

    this.renderer.listen(skipToMain, 'blur', () => {
      this.renderer.setStyle(skipLinksContainer, 'top', '-40px');
    });

    this.renderer.appendChild(skipLinksContainer, skipToMain);
    this.renderer.appendChild(document.body, skipLinksContainer);
  }

  private setupFocusManagement(): void {
    // Track focus for better keyboard navigation
    let lastFocusedElement: HTMLElement | null = null;

    document.addEventListener('focusin', (event) => {
      lastFocusedElement = event.target as HTMLElement;
    });

    // Restore focus when needed
    (window as any).restoreLastFocus = () => {
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    };
  }

  private setupScreenReaderAnnouncements(): void {
    // Create a live region for announcements
    const liveRegion = this.renderer.createElement('div');
    this.renderer.setAttribute(liveRegion, 'id', 'live-region');
    this.renderer.setAttribute(liveRegion, 'aria-live', 'polite');
    this.renderer.setAttribute(liveRegion, 'aria-atomic', 'true');
    this.renderer.addClass(liveRegion, 'sr-only');
    this.renderer.setStyle(liveRegion, 'position', 'absolute');
    this.renderer.setStyle(liveRegion, 'left', '-10000px');
    this.renderer.setStyle(liveRegion, 'width', '1px');
    this.renderer.setStyle(liveRegion, 'height', '1px');
    this.renderer.setStyle(liveRegion, 'overflow', 'hidden');
    
    this.renderer.appendChild(document.body, liveRegion);
  }

  // Public methods for components to use

  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.options.announceChanges) return;
    // Only run in browser environment
    if (typeof document === 'undefined') return;

    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  announceNavigation(fromPage: string, toPage: string): void {
    this.announce(`Navigated from ${fromPage} to ${toPage}`);
  }

  announceFormChange(fieldName: string, newValue: string): void {
    this.announce(`${fieldName} changed to ${newValue}`);
  }

  announceProgress(section: string, progress: number): void {
    this.announce(`${section} progress: ${progress}% complete`);
  }

  announceSave(projectName: string): void {
    this.announce(`Project ${projectName} saved successfully`);
  }

  announceError(errorMessage: string): void {
    this.announce(`Error: ${errorMessage}`, 'assertive');
  }

  // Focus management

  focusElement(selector: string): void {
    if (!this.options.focusManagement) return;
    // Only run in browser environment
    if (typeof document === 'undefined') return;

    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  }

  focusFirstFormField(container?: Element): void {
    if (!this.options.focusManagement) return;

    const searchContainer = container || document;
    const firstInput = searchContainer.querySelector('input, select, textarea, button') as HTMLElement;
    if (firstInput) {
      firstInput.focus();
    }
  }

  focusErrorField(): void {
    if (!this.options.focusManagement) return;
    // Only run in browser environment
    if (typeof document === 'undefined') return;

    const errorField = document.querySelector('.error input, .error select, .error textarea') as HTMLElement;
    if (errorField) {
      errorField.focus();
    }
  }

  // Keyboard navigation helpers

  setupTabTrap(container: Element): () => void {
    if (!this.options.keyboardNavigation) return () => {};
    // Only run in browser environment
    if (typeof document === 'undefined') return () => {};

    const focusableElements = container.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      if (keyboardEvent.key !== 'Tab') return;

      if (keyboardEvent.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          keyboardEvent.preventDefault();
        }
      } else if (document.activeElement === lastElement) {
        firstElement.focus();
        keyboardEvent.preventDefault();
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  // High contrast mode

  private enableHighContrast(): void {
    // Only run in browser environment
    if (typeof document === 'undefined') return;
    this.renderer.addClass(document.body, 'high-contrast');
  }

  private disableHighContrast(): void {
    // Only run in browser environment
    if (typeof document === 'undefined') return;
    this.renderer.removeClass(document.body, 'high-contrast');
  }

  // Reduced motion

  private enableReducedMotion(): void {
    // Only run in browser environment
    if (typeof document === 'undefined') return;
    this.renderer.addClass(document.body, 'reduced-motion');
  }

  private disableReducedMotion(): void {
    // Only run in browser environment
    if (typeof document === 'undefined') return;
    this.renderer.removeClass(document.body, 'reduced-motion');
  }

  // ARIA helpers

  setAriaLabel(element: Element, label: string): void {
    this.renderer.setAttribute(element, 'aria-label', label);
  }

  setAriaDescription(element: Element, description: string): void {
    this.renderer.setAttribute(element, 'aria-describedby', description);
  }

  setAriaExpanded(element: Element, expanded: boolean): void {
    this.renderer.setAttribute(element, 'aria-expanded', expanded.toString());
  }

  setAriaSelected(element: Element, selected: boolean): void {
    this.renderer.setAttribute(element, 'aria-selected', selected.toString());
  }

  setAriaPressed(element: Element, pressed: boolean): void {
    this.renderer.setAttribute(element, 'aria-pressed', pressed.toString());
  }

  // Form accessibility

  addFormFieldDescriptions(form: Element): void {
    const fields = form.querySelectorAll('input, select, textarea');
    
    fields.forEach((field, index) => {
      const label = form.querySelector(`label[for="${field.id}"]`);
      if (label) {
        const helpText = label.nextElementSibling;
        if (helpText && helpText.classList.contains('help-text')) {
          const helpId = `help-${index}`;
          helpText.id = helpId;
          this.renderer.setAttribute(field, 'aria-describedby', helpId);
        }
      }
    });
  }

  // Progress accessibility

  makeProgressAccessible(progressElement: Element, label: string, value: number, max: number = 100): void {
    this.renderer.setAttribute(progressElement, 'role', 'progressbar');
    this.renderer.setAttribute(progressElement, 'aria-label', label);
    this.renderer.setAttribute(progressElement, 'aria-valuenow', value.toString());
    this.renderer.setAttribute(progressElement, 'aria-valuemin', '0');
    this.renderer.setAttribute(progressElement, 'aria-valuemax', max.toString());
    this.renderer.setAttribute(progressElement, 'aria-valuetext', `${value}% complete`);
  }

  // Modal accessibility

  setupModalAccessibility(modal: Element): () => void {
    const cleanup = this.setupTabTrap(modal);
    
    // Set focus to modal
    const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Add role and label
    this.renderer.setAttribute(modal, 'role', 'dialog');
    this.renderer.setAttribute(modal, 'aria-modal', 'true');

    return cleanup;
  }

  // Configuration

  updateOptions(newOptions: Partial<AccessibilityOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  getOptions(): AccessibilityOptions {
    return { ...this.options };
  }
}
