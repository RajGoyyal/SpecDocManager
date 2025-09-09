import { Injectable } from '@angular/core';

export interface ExportOptions {
  format: 'pdf' | 'word' | 'json' | 'html' | 'markdown';
  includeImages: boolean;
  includeTables: boolean;
  template: 'standard' | 'executive' | 'technical' | 'minimal';
  sections: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DocumentExportService {

  async exportProject(projectData: any, options: ExportOptions): Promise<void> {
    switch (options.format) {
      case 'pdf':
        await this.exportToPDF(projectData, options);
        break;
      case 'word':
        await this.exportToWord(projectData, options);
        break;
      case 'json':
        await this.exportToJSON(projectData, options);
        break;
      case 'html':
        await this.exportToHTML(projectData, options);
        break;
      case 'markdown':
        await this.exportToMarkdown(projectData, options);
        break;
    }
  }

  private async exportToPDF(projectData: any, options: ExportOptions): Promise<void> {
    // Generate HTML content
    const htmlContent = this.generateHTMLContent(projectData, options);
    
    // Create a temporary div for PDF generation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.padding = '20px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.color = '#333';
    
    // Add to document temporarily
    document.body.appendChild(tempDiv);
    
    // Use browser's print function for PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${projectData.project?.title || 'Project'} - Specification Document</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 20px; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #1e40af; margin-top: 30px; }
            h3 { color: #1e3a8a; }
            .meta-info { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .section { margin: 25px 0; }
            .stakeholder, .feature, .data-field { background: #f1f5f9; padding: 15px; margin: 10px 0; border-radius: 6px; }
            .progress-bar { background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden; }
            .progress-fill { background: #3b82f6; height: 100%; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            th { background: #f8fafc; font-weight: 600; }
            .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; }
            .status-draft { background: #f1f5f9; color: #475569; }
            .status-active { background: #dcfce7; color: #166534; }
            .status-review { background: #fef3c7; color: #92400e; }
            .status-completed { background: #dbeafe; color: #1e40af; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
    
    // Remove temporary div
    document.body.removeChild(tempDiv);
  }

  private async exportToWord(projectData: any, options: ExportOptions): Promise<void> {
    const htmlContent = this.generateHTMLContent(projectData, options);
    
    // Create Word-compatible HTML
    const wordDocument = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${projectData.project?.title || 'Project'} - Specification Document</title>
        <style>
          body { font-family: Calibri, sans-serif; line-height: 1.6; }
          h1 { color: #2563eb; font-size: 24px; }
          h2 { color: #1e40af; font-size: 20px; }
          h3 { color: #1e3a8a; font-size: 16px; }
          .meta-info { background-color: #f8fafc; padding: 15px; border: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    const blob = new Blob([wordDocument], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.project?.title || 'project'}-specification.doc`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private async exportToJSON(projectData: any, options: ExportOptions): Promise<void> {
    const exportData = {
      ...projectData,
      exportedAt: new Date().toISOString(),
      exportOptions: options
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.project?.title || 'project'}-specification.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private async exportToHTML(projectData: any, options: ExportOptions): Promise<void> {
    const htmlContent = this.generateHTMLContent(projectData, options);
    
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${projectData.project?.title || 'Project'} - Specification Document</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #1e40af; margin-top: 30px; }
          h3 { color: #1e3a8a; }
          .meta-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
          .section { margin: 30px 0; }
          .stakeholder, .feature, .data-field { background: #f1f5f9; padding: 20px; margin: 15px 0; border-radius: 8px; border: 1px solid #e2e8f0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
          th { background: #f8fafc; font-weight: 600; }
          .status-badge { padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: 500; }
          .status-draft { background: #f1f5f9; color: #475569; }
          .status-active { background: #dcfce7; color: #166534; }
          .status-review { background: #fef3c7; color: #92400e; }
          .status-completed { background: #dbeafe; color: #1e40af; }
          .toc { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .toc ul { list-style-type: none; padding-left: 0; }
          .toc li { margin: 5px 0; }
          .toc a { text-decoration: none; color: #2563eb; }
          .toc a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.project?.title || 'project'}-specification.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private async exportToMarkdown(projectData: any, options: ExportOptions): Promise<void> {
    const markdownContent = this.generateMarkdownContent(projectData, options);
    
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.project?.title || 'project'}-specification.md`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateHTMLContent(projectData: any, options: ExportOptions): string {
    const project = projectData.project || {};
    const stakeholders = projectData.stakeholders || [];
    const whatWeNeed = projectData.whatWeNeed || {};
    const dataFields = projectData.dataFields || [];
    const features = projectData.features || [];
    const successCriteria = projectData.successCriteria || {};

    return `
      <div class="document">
        <!-- Cover Page -->
        <div class="cover-page">
          <h1>${project.title || 'Project Specification'}</h1>
          <div class="meta-info">
            <p><strong>Version:</strong> ${project.version || '1.0.0'}</p>
            <p><strong>Author:</strong> ${project.author || 'Unknown'}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${project.status || 'draft'}">${project.status || 'draft'}</span></p>
            <p><strong>Created:</strong> ${project.startDate || 'N/A'}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          ${project.description ? `<p><strong>Description:</strong> ${project.description}</p>` : ''}
        </div>

        <!-- Table of Contents -->
        <div class="toc">
          <h2>Table of Contents</h2>
          <ul>
            <li><a href="#basic-info">1. Basic Information</a></li>
            <li><a href="#stakeholders">2. Stakeholders</a></li>
            <li><a href="#what-we-need">3. What We Need</a></li>
            <li><a href="#data-fields">4. Data Fields</a></li>
            <li><a href="#features">5. Features</a></li>
            <li><a href="#success-criteria">6. Success Criteria</a></li>
          </ul>
        </div>

        <!-- Basic Information -->
        <div class="section" id="basic-info">
          <h2>1. Basic Information</h2>
          <table>
            <tr><th>Field</th><th>Value</th></tr>
            <tr><td>Project Title</td><td>${project.title || 'N/A'}</td></tr>
            <tr><td>Version</td><td>${project.version || 'N/A'}</td></tr>
            <tr><td>Author</td><td>${project.author || 'N/A'}</td></tr>
            <tr><td>Status</td><td><span class="status-badge status-${project.status || 'draft'}">${project.status || 'draft'}</span></td></tr>
            <tr><td>Start Date</td><td>${project.startDate || 'N/A'}</td></tr>
            <tr><td>Description</td><td>${project.description || 'N/A'}</td></tr>
          </table>
        </div>

        <!-- Stakeholders -->
        <div class="section" id="stakeholders">
          <h2>2. Stakeholders</h2>
          ${stakeholders.length > 0 ? stakeholders.map((stakeholder: any) => `
            <div class="stakeholder">
              <h3>${stakeholder.name || 'Unnamed Stakeholder'}</h3>
              <p><strong>Role:</strong> ${stakeholder.role || 'N/A'}</p>
              <p><strong>Type:</strong> ${stakeholder.type || 'N/A'}</p>
              <p><strong>Email:</strong> ${stakeholder.email || 'N/A'}</p>
            </div>
          `).join('') : '<p>No stakeholders defined.</p>'}
        </div>

        <!-- What We Need -->
        <div class="section" id="what-we-need">
          <h2>3. What We Need</h2>
          
          <h3>User Experience Goals</h3>
          <p>${whatWeNeed.userExperienceGoals || 'Not specified.'}</p>
          
          <h3>Scope - What's Included</h3>
          ${whatWeNeed.scopeIncluded?.length > 0 ? `
            <ul>
              ${whatWeNeed.scopeIncluded.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
          ` : '<p>No scope items specified.</p>'}
          
          <h3>Scope - What's Excluded</h3>
          ${whatWeNeed.scopeExcluded?.length > 0 ? `
            <ul>
              ${whatWeNeed.scopeExcluded.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
          ` : '<p>No exclusions specified.</p>'}
          
          <h3>Key Assumptions</h3>
          ${whatWeNeed.keyAssumptions?.length > 0 ? `
            <ul>
              ${whatWeNeed.keyAssumptions.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
          ` : '<p>No assumptions specified.</p>'}
          
          <h3>Dependencies</h3>
          ${whatWeNeed.dependencies?.length > 0 ? `
            <ul>
              ${whatWeNeed.dependencies.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
          ` : '<p>No dependencies specified.</p>'}
          
          <h3>Data Integration Needs</h3>
          <p>${whatWeNeed.dataIntegrationNeeds || 'Not specified.'}</p>
          
          <h3>External Services</h3>
          ${whatWeNeed.externalServices?.length > 0 ? `
            <ul>
              ${whatWeNeed.externalServices.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
          ` : '<p>No external services specified.</p>'}
        </div>

        <!-- Data Fields -->
        <div class="section" id="data-fields">
          <h2>4. Data Fields</h2>
          ${dataFields.length > 0 ? `
            <table>
              <tr>
                <th>Field Name</th>
                <th>Display Label</th>
                <th>UI Control</th>
                <th>Data Type</th>
                <th>Required</th>
                <th>Specifications</th>
              </tr>
              ${dataFields.map((field: any) => `
                <tr>
                  <td>${field.fieldName || 'N/A'}</td>
                  <td>${field.displayLabel || 'N/A'}</td>
                  <td>${field.uiControl || 'N/A'}</td>
                  <td>${field.dataType || 'N/A'}</td>
                  <td>${field.required ? 'Yes' : 'No'}</td>
                  <td>${field.specifications || 'N/A'}</td>
                </tr>
              `).join('')}
            </table>
          ` : '<p>No data fields defined.</p>'}
        </div>

        <!-- Features -->
        <div class="section" id="features">
          <h2>5. Features</h2>
          ${features.length > 0 ? features.map((feature: any, index: number) => `
            <div class="feature">
              <h3>${index + 1}. ${feature.title || 'Untitled Feature'}</h3>
              <p><strong>Importance:</strong> ${feature.importance || 'N/A'}</p>
              <p><strong>Type:</strong> ${feature.type || 'N/A'}</p>
              <p><strong>Description:</strong> ${feature.description || 'No description provided.'}</p>
              ${feature.details ? `<p><strong>Details:</strong> ${feature.details}</p>` : ''}
            </div>
          `).join('') : '<p>No features defined.</p>'}
        </div>

        <!-- Success Criteria -->
        <div class="section" id="success-criteria">
          <h2>6. Success Criteria</h2>
          
          <h3>Success Metrics</h3>
          ${successCriteria.successMetrics?.length > 0 ? `
            <ul>
              ${successCriteria.successMetrics.map((metric: string) => `<li>${metric}</li>`).join('')}
            </ul>
          ` : '<p>No success metrics defined.</p>'}
          
          <h3>User Testing Plan</h3>
          <p>${successCriteria.userTestingPlan || 'No testing plan specified.'}</p>
          
          <h3>Data Quality Rules</h3>
          ${successCriteria.dataQualityRules?.length > 0 ? `
            <ul>
              ${successCriteria.dataQualityRules.map((rule: string) => `<li>${rule}</li>`).join('')}
            </ul>
          ` : '<p>No data quality rules specified.</p>'}
          
          <h3>Performance Requirements</h3>
          ${successCriteria.performanceRequirements?.length > 0 ? `
            <ul>
              ${successCriteria.performanceRequirements.map((req: string) => `<li>${req}</li>`).join('')}
            </ul>
          ` : '<p>No performance requirements specified.</p>'}
          
          <h3>Security Requirements</h3>
          ${successCriteria.securityRequirements?.length > 0 ? `
            <ul>
              ${successCriteria.securityRequirements.map((req: string) => `<li>${req}</li>`).join('')}
            </ul>
          ` : '<p>No security requirements specified.</p>'}
        </div>
      </div>
    `;
  }

  private generateMarkdownContent(projectData: any, options: ExportOptions): string {
    const project = projectData.project || {};
    const stakeholders = projectData.stakeholders || [];
    const whatWeNeed = projectData.whatWeNeed || {};
    const dataFields = projectData.dataFields || [];
    const features = projectData.features || [];
    const successCriteria = projectData.successCriteria || {};

    return `# ${project.title || 'Project Specification'}

## Project Information

- **Version:** ${project.version || '1.0.0'}
- **Author:** ${project.author || 'Unknown'}
- **Status:** ${project.status || 'draft'}
- **Created:** ${project.startDate || 'N/A'}
- **Generated:** ${new Date().toLocaleDateString()}

${project.description ? `**Description:** ${project.description}\n` : ''}

## Table of Contents

1. [Basic Information](#basic-information)
2. [Stakeholders](#stakeholders)
3. [What We Need](#what-we-need)
4. [Data Fields](#data-fields)
5. [Features](#features)
6. [Success Criteria](#success-criteria)

## Basic Information

| Field | Value |
|-------|-------|
| Project Title | ${project.title || 'N/A'} |
| Version | ${project.version || 'N/A'} |
| Author | ${project.author || 'N/A'} |
| Status | ${project.status || 'draft'} |
| Start Date | ${project.startDate || 'N/A'} |
| Description | ${project.description || 'N/A'} |

## Stakeholders

${stakeholders.length > 0 ? stakeholders.map((stakeholder: any) => `
### ${stakeholder.name || 'Unnamed Stakeholder'}

- **Role:** ${stakeholder.role || 'N/A'}
- **Type:** ${stakeholder.type || 'N/A'}
- **Email:** ${stakeholder.email || 'N/A'}
`).join('') : 'No stakeholders defined.'}

## What We Need

### User Experience Goals

${whatWeNeed.userExperienceGoals || 'Not specified.'}

### Scope - What's Included

${whatWeNeed.scopeIncluded?.length > 0 ? whatWeNeed.scopeIncluded.map((item: string) => `- ${item}`).join('\n') : 'No scope items specified.'}

### Scope - What's Excluded

${whatWeNeed.scopeExcluded?.length > 0 ? whatWeNeed.scopeExcluded.map((item: string) => `- ${item}`).join('\n') : 'No exclusions specified.'}

### Key Assumptions

${whatWeNeed.keyAssumptions?.length > 0 ? whatWeNeed.keyAssumptions.map((item: string) => `- ${item}`).join('\n') : 'No assumptions specified.'}

### Dependencies

${whatWeNeed.dependencies?.length > 0 ? whatWeNeed.dependencies.map((item: string) => `- ${item}`).join('\n') : 'No dependencies specified.'}

### Data Integration Needs

${whatWeNeed.dataIntegrationNeeds || 'Not specified.'}

### External Services

${whatWeNeed.externalServices?.length > 0 ? whatWeNeed.externalServices.map((item: string) => `- ${item}`).join('\n') : 'No external services specified.'}

## Data Fields

${dataFields.length > 0 ? `
| Field Name | Display Label | UI Control | Data Type | Required | Specifications |
|------------|---------------|------------|-----------|----------|----------------|
${dataFields.map((field: any) => `| ${field.fieldName || 'N/A'} | ${field.displayLabel || 'N/A'} | ${field.uiControl || 'N/A'} | ${field.dataType || 'N/A'} | ${field.required ? 'Yes' : 'No'} | ${field.specifications || 'N/A'} |`).join('\n')}
` : 'No data fields defined.'}

## Features

${features.length > 0 ? features.map((feature: any, index: number) => `
### ${index + 1}. ${feature.title || 'Untitled Feature'}

- **Importance:** ${feature.importance || 'N/A'}
- **Type:** ${feature.type || 'N/A'}
- **Description:** ${feature.description || 'No description provided.'}
${feature.details ? `- **Details:** ${feature.details}` : ''}
`).join('') : 'No features defined.'}

## Success Criteria

### Success Metrics

${successCriteria.successMetrics?.length > 0 ? successCriteria.successMetrics.map((metric: string) => `- ${metric}`).join('\n') : 'No success metrics defined.'}

### User Testing Plan

${successCriteria.userTestingPlan || 'No testing plan specified.'}

### Data Quality Rules

${successCriteria.dataQualityRules?.length > 0 ? successCriteria.dataQualityRules.map((rule: string) => `- ${rule}`).join('\n') : 'No data quality rules specified.'}

### Performance Requirements

${successCriteria.performanceRequirements?.length > 0 ? successCriteria.performanceRequirements.map((req: string) => `- ${req}`).join('\n') : 'No performance requirements specified.'}

### Security Requirements

${successCriteria.securityRequirements?.length > 0 ? successCriteria.securityRequirements.map((req: string) => `- ${req}`).join('\n') : 'No security requirements specified.'}

---

*Document generated on ${new Date().toLocaleString()}*
`;
  }

  getExportPreview(projectData: any, format: 'pdf' | 'word' | 'html' | 'markdown'): string {
    switch (format) {
      case 'html':
        return this.generateHTMLContent(projectData, { 
          format: 'html', 
          includeImages: true, 
          includeTables: true, 
          template: 'standard', 
          sections: [] 
        });
      case 'markdown':
        return this.generateMarkdownContent(projectData, { 
          format: 'markdown', 
          includeImages: true, 
          includeTables: true, 
          template: 'standard', 
          sections: [] 
        });
      default:
        return this.generateHTMLContent(projectData, { 
          format: format, 
          includeImages: true, 
          includeTables: true, 
          template: 'standard', 
          sections: [] 
        });
    }
  }
}
