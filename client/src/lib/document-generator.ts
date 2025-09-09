interface DocumentData {
  project: any;
  requirements?: any;
  dataFields: any[];
  features: any[];
  stakeholders: any[];
  milestones: any[];
}

export const generateFRSDocument = async (data: DocumentData) => {
  // Create HTML content for the FRS document
  const htmlContent = generateFRSHTML(data);
  
  // Create a blob with the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create download link
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.project.title.replace(/\s+/g, '_')}_FRS_v${data.project.version}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateWordDocument = async (data: DocumentData) => {
  // For now, generate HTML that can be opened in Word
  // In a real application, you'd use a library like docx
  const htmlContent = generateFRSHTML(data, true);
  
  const blob = new Blob([htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.project.title.replace(/\s+/g, '_')}_FRS_v${data.project.version}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const generateFRSHTML = (data: DocumentData, isWord = false) => {
  const { project, requirements, dataFields, features, stakeholders, milestones } = data;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title} - Functional Requirements Specification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #0052CC;
        }
        .header h1 {
            color: #0052CC;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header .subtitle {
            color: #6B778C;
            font-size: 1.2em;
        }
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .section h2 {
            color: #0052CC;
            font-size: 1.8em;
            margin-bottom: 15px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        .section h3 {
            color: #172B4D;
            font-size: 1.3em;
            margin-bottom: 10px;
        }
        .section h4 {
            color: #6B778C;
            font-size: 1.1em;
            margin-bottom: 8px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .info-item {
            padding: 10px;
            background: #F4F5F7;
            border-radius: 5px;
        }
        .info-item .label {
            font-weight: bold;
            color: #172B4D;
        }
        .stakeholder, .milestone, .field, .feature {
            margin-bottom: 15px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background: #F4F5F7;
        }
        .priority-high {
            border-left: 4px solid #FF5630;
        }
        .priority-medium {
            border-left: 4px solid #36B37E;
        }
        .priority-low {
            border-left: 4px solid #6B778C;
        }
        .type-functional {
            background: #E3FCEF;
        }
        .type-non-functional {
            background: #DEEBFF;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.8em;
            font-weight: bold;
            margin-right: 5px;
        }
        .badge-primary { background: #0052CC; color: white; }
        .badge-secondary { background: #36B37E; color: white; }
        .badge-accent { background: #FF5630; color: white; }
        .badge-muted { background: #6B778C; color: white; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #F4F5F7;
            font-weight: bold;
            color: #172B4D;
        }
        .toc {
            background: #F4F5F7;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .toc h3 {
            margin-top: 0;
            color: #0052CC;
        }
        .toc ul {
            list-style: none;
            padding-left: 0;
        }
        .toc li {
            padding: 5px 0;
            border-bottom: 1px dotted #ddd;
        }
        .toc a {
            text-decoration: none;
            color: #172B4D;
        }
        .toc a:hover {
            color: #0052CC;
        }
        ${isWord ? '@page { margin: 1in; }' : ''}
        @media print {
            body { font-size: 12pt; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${project.title}</h1>
        <div class="subtitle">Functional Requirements Specification</div>
        <div class="subtitle">Version ${project.version}</div>
        <div class="subtitle">${new Date().toLocaleDateString()}</div>
    </div>

    <div class="toc">
        <h3>Table of Contents</h3>
        <ul>
            <li><a href="#executive-summary">1. Executive Summary</a></li>
            <li><a href="#project-overview">2. Project Overview</a></li>
            <li><a href="#stakeholders">3. Stakeholders</a></li>
            <li><a href="#requirements">4. Requirements Specification</a></li>
            <li><a href="#data-fields">5. Data Fields</a></li>
            <li><a href="#features">6. Features</a></li>
            <li><a href="#success-criteria">7. Success Criteria</a></li>
            <li><a href="#timeline">8. Timeline & Milestones</a></li>
        </ul>
    </div>

    <div class="section" id="executive-summary">
        <h2>1. Executive Summary</h2>
        <p>${project.description || 'This document outlines the functional requirements for the ' + project.title + ' project.'}</p>
        
        <div class="info-grid">
            <div class="info-item">
                <div class="label">Project Name:</div>
                ${project.title}
            </div>
            <div class="info-item">
                <div class="label">Version:</div>
                ${project.version}
            </div>
            <div class="info-item">
                <div class="label">Author:</div>
                ${project.author}
            </div>
            <div class="info-item">
                <div class="label">Status:</div>
                ${project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </div>
        </div>
    </div>

    <div class="section" id="project-overview">
        <h2>2. Project Overview</h2>
        <h3>Project Description</h3>
        <p>${project.description || 'No description provided.'}</p>

        ${requirements?.userExperienceGoals ? `
        <h3>User Experience Goals</h3>
        <p>${requirements.userExperienceGoals}</p>
        ` : ''}

        ${requirements?.scopeIncluded?.length ? `
        <h3>Project Scope</h3>
        <h4>Included Features</h4>
        <ul>
            ${requirements.scopeIncluded.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
        ` : ''}

        ${requirements?.scopeExcluded?.length ? `
        <h4>Excluded Features</h4>
        <ul>
            ${requirements.scopeExcluded.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
        ` : ''}

        ${requirements?.assumptions?.length ? `
        <h3>Assumptions</h3>
        <ul>
            ${requirements.assumptions.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
        ` : ''}

        ${requirements?.dependencies?.length ? `
        <h3>Dependencies</h3>
        <ul>
            ${requirements.dependencies.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
        ` : ''}
    </div>

    <div class="section" id="stakeholders">
        <h2>3. Stakeholders</h2>
        ${stakeholders.length ? stakeholders.map((stakeholder: any) => `
        <div class="stakeholder">
            <h4>${stakeholder.name} - ${stakeholder.role}</h4>
            <span class="badge ${stakeholder.type === 'primary' ? 'badge-primary' : stakeholder.type === 'secondary' ? 'badge-secondary' : 'badge-muted'}">${stakeholder.type}</span>
        </div>
        `).join('') : '<p>No stakeholders defined.</p>'}
    </div>

    <div class="section" id="requirements">
        <h2>4. Requirements Specification</h2>
        <p>This section outlines both functional and non-functional requirements for the system.</p>
        
        <h3>Summary</h3>
        <div class="info-grid">
            <div class="info-item">
                <div class="label">Total Features:</div>
                ${features.length}
            </div>
            <div class="info-item">
                <div class="label">High Priority:</div>
                ${features.filter((f: any) => f.priority === 'high').length}
            </div>
            <div class="info-item">
                <div class="label">Functional:</div>
                ${features.filter((f: any) => f.type === 'functional').length}
            </div>
            <div class="info-item">
                <div class="label">Non-Functional:</div>
                ${features.filter((f: any) => f.type === 'non-functional').length}
            </div>
        </div>
    </div>

    <div class="section" id="data-fields">
        <h2>5. Data Fields</h2>
        ${dataFields.length ? `
        <table>
            <thead>
                <tr>
                    <th>Field Name</th>
                    <th>Display Label</th>
                    <th>Type</th>
                    <th>Control</th>
                    <th>Required</th>
                    <th>Validation</th>
                </tr>
            </thead>
            <tbody>
                ${dataFields.map((field: any) => `
                <tr>
                    <td><code>${field.name}</code></td>
                    <td>${field.displayLabel}</td>
                    <td>${field.dataType}</td>
                    <td>${field.uiControlType}</td>
                    <td>${field.required ? '<span class="badge badge-accent">Required</span>' : '<span class="badge badge-muted">Optional</span>'}</td>
                    <td>${field.validationRules?.join(', ') || 'None'}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        ` : '<p>No data fields defined.</p>'}
    </div>

    <div class="section" id="features">
        <h2>6. Features</h2>
        ${features.length ? features.map((feature: any) => `
        <div class="feature priority-${feature.priority} ${feature.type === 'functional' ? 'type-functional' : 'type-non-functional'}">
            <h3>${feature.title}</h3>
            <div style="margin-bottom: 10px;">
                <span class="badge ${feature.priority === 'high' ? 'badge-accent' : feature.priority === 'medium' ? 'badge-secondary' : 'badge-muted'}">${feature.priority.toUpperCase()}</span>
                <span class="badge ${feature.type === 'functional' ? 'badge-primary' : 'badge-secondary'}">${feature.type.toUpperCase()}</span>
            </div>
            <p><strong>Description:</strong> ${feature.description}</p>
            ${feature.specifications ? `<p><strong>Specifications:</strong> ${feature.specifications}</p>` : ''}
        </div>
        `).join('') : '<p>No features defined.</p>'}
    </div>

    <div class="section" id="success-criteria">
        <h2>7. Success Criteria</h2>
        
        ${requirements?.successMetrics?.length ? `
        <h3>Success Metrics</h3>
        <ul>
            ${requirements.successMetrics.map((metric: string) => `<li>${metric}</li>`).join('')}
        </ul>
        ` : ''}

        ${requirements?.userTestingPlans ? `
        <h3>User Testing Plans</h3>
        <p>${requirements.userTestingPlans}</p>
        ` : ''}

        ${requirements?.dataQualityRules?.length ? `
        <h3>Data Quality Rules</h3>
        <ul>
            ${requirements.dataQualityRules.map((rule: string) => `<li>${rule}</li>`).join('')}
        </ul>
        ` : ''}

        ${requirements?.performanceRequirements?.length ? `
        <h3>Performance Requirements</h3>
        <ul>
            ${requirements.performanceRequirements.map((req: string) => `<li>${req}</li>`).join('')}
        </ul>
        ` : ''}

        ${requirements?.securityRequirements?.length ? `
        <h3>Security Requirements</h3>
        <ul>
            ${requirements.securityRequirements.map((req: string) => `<li>${req}</li>`).join('')}
        </ul>
        ` : ''}
    </div>

    <div class="section" id="timeline">
        <h2>8. Timeline & Milestones</h2>
        <div class="info-grid">
            <div class="info-item">
                <div class="label">Start Date:</div>
                ${project.startDate || 'Not specified'}
            </div>
            <div class="info-item">
                <div class="label">Expected Completion:</div>
                ${project.expectedCompletion || 'Not specified'}
            </div>
        </div>

        ${milestones.length ? `
        <h3>Key Milestones</h3>
        ${milestones.map((milestone: any) => `
        <div class="milestone">
            <h4>${milestone.title}</h4>
            <p><strong>Date:</strong> ${milestone.date}</p>
            <span class="badge ${milestone.status === 'completed' ? 'badge-secondary' : milestone.status === 'in-progress' ? 'badge-accent' : 'badge-muted'}">${milestone.status.toUpperCase()}</span>
        </div>
        `).join('')}
        ` : '<p>No milestones defined.</p>'}
    </div>

    <div class="section">
        <h2>Document Information</h2>
        <div class="info-grid">
            <div class="info-item">
                <div class="label">Generated On:</div>
                ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
            </div>
            <div class="info-item">
                <div class="label">Generated By:</div>
                FRS Manager - Requirements Management System
            </div>
        </div>
    </div>
</body>
</html>`;
};
