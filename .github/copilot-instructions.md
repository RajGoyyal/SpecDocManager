# SpecDocManager

SpecDocManager is a full-stack Angular + Express.js web application for creating and managing project specification documents and Functional Requirements Specifications (FRS). The application provides a comprehensive interface for project planning, requirements gathering, stakeholder management, and document generation.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap, build, and test the repository:
  - Install Node.js dependencies: `npm install --legacy-peer-deps` (root dependencies have version conflicts, requires --legacy-peer-deps flag)
  - Install Angular client dependencies: `cd client-angular && npm install`
  - Build Angular client: `npm run build:client` -- takes 13 seconds. NEVER CANCEL. Set timeout to 60+ minutes.
  - Full production build: `npm run build` -- takes 13 seconds total (Angular build + server bundle). NEVER CANCEL. Set timeout to 60+ minutes.
  - TypeScript check: `npm run check` -- takes 3 seconds. Set timeout to 30+ minutes.

## Development Mode
- Start API server: `npm run dev:api` (serves on http://127.0.0.1:5000)
- Start Angular client: `npm run dev:client` (serves on http://localhost:4200, /api proxied)
- Start both concurrently: `npm run dev`
- Angular development build takes ~12 seconds. NEVER CANCEL. Set timeout to 60+ minutes.

## Production Mode  
- Build the application: `npm run build`
- Start production server: `npm start` (unified server on http://127.0.0.1:5000)
- IMPORTANT: After Angular build, copy `client-angular/dist/client-angular/browser/index.csr.html` to `client-angular/dist/client-angular/browser/index.html` for production serving to work correctly.

## Validation
- ALWAYS run through at least one complete end-to-end scenario after making changes:
  1. Navigate to http://127.0.0.1:5000/ to see the main project dashboard with sample projects
  2. Click "✨ New Project" to open the project creation modal
  3. Select "Web Application" template
  4. Fill in project name and author fields
  5. Click "Create Project" to create and navigate to the project detail page
  6. Test navigation between different sections (Basic Info, What We Need, Data Fields, Stakeholders, Features, etc.)
  7. Verify forms load and can be edited
- You can run and test the application in both development and production modes.
- The application uses in-memory storage with sample data, so no database setup is required.

## Build Issues and Workarounds
- CSS Budget Error: Angular build may fail with "exceeded maximum budget" error for component styles. To fix, increase budget limits in `client-angular/angular.json`:
  ```json
  "budgets": [
    {
      "type": "anyComponentStyle", 
      "maximumWarning": "15kB",
      "maximumError": "25kB"
    }
  ]
  ```
- Use development configuration to bypass budget issues: `cd client-angular && npx ng build --configuration development`

## Common Tasks

### Repository Structure
```
.
├── README.md                    # Basic dev instructions  
├── package.json                 # Root dependencies and scripts
├── client-angular/              # Angular 18 frontend application
│   ├── src/app/pages/          # Page components for project management
│   ├── package.json            # Angular dependencies
│   ├── angular.json            # Angular build configuration
│   └── dist/                   # Angular build output
├── server/                     # Express.js backend
│   ├── index.ts               # Main server entry point
│   ├── routes.ts              # API routes definition
│   ├── storage.ts             # In-memory storage implementation
│   └── vite.ts                # Static file serving configuration
├── shared/                     # Shared TypeScript types and schemas
└── dist/                      # Production server build output
```

### Key Components
- **Main Dashboard** (`/projects`): Lists all projects with search, filtering, and project creation
- **Project Detail Pages**: Comprehensive FRS management interface with sections for:
  - Basic Info: Project metadata and description
  - What We Need: Goals, scope, business requirements
  - Data Fields: Custom data field definitions
  - Stakeholders: Team member and stakeholder management
  - Features: Feature requirements and specifications
  - User Stories: User story management
  - Workflows: Process definition
  - Success Criteria: Testing and validation requirements
  - Download: Document generation and export

### API Endpoints
The Express server provides REST endpoints under `/api/`:
- `GET/POST /api/projects` - Project CRUD operations
- `GET/POST /api/projects/:id/stakeholders` - Stakeholder management
- `GET/POST /api/projects/:id/requirements` - Requirements management
- `GET/POST /api/projects/:id/data-fields` - Data field management
- `GET/POST /api/projects/:id/milestones` - Milestone tracking
- `POST /api/projects/:id/generate-frs` - Document generation

### Data Storage
- Uses in-memory storage (`MemStorage` class) with sample data
- No database setup required - data is reset on server restart
- Sample projects include: E-Commerce Platform, Mobile Banking App, Analytics Dashboard, API Gateway Service

### Technology Stack
- **Frontend**: Angular 18 with TypeScript, inline templates/styles, SSR support
- **Backend**: Express.js with TypeScript, Drizzle ORM schemas (for typing)
- **Build**: esbuild for server bundling, Angular CLI for client bundling
- **Styling**: Component-scoped CSS (causes budget warnings with large components)

## Development Tips
- Always use `--legacy-peer-deps` when installing root npm packages due to dependency conflicts
- The Angular app uses inline templates and styles (configured in angular.json schematics)
- Skip tests are configured by default (skipTests: true for all generators)
- Development mode: API server redirects non-API routes to Angular dev server (port 4200)
- Production mode: Express serves built Angular files directly
- Watch for console errors about blocked external resources (placeholder images, etc.) - these are normal

## Timing Expectations
- Root npm install: ~20 seconds with --legacy-peer-deps flag
- Angular npm install: ~25 seconds  
- Angular development build: ~12 seconds
- Angular production build: ~13 seconds (may have CSS budget warnings)
- Full production build: ~13 seconds total
- TypeScript check: ~3 seconds
- Server startup: <1 second