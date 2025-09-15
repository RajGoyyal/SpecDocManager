# SpecDocManager Setup Guide

This guide provides detailed instructions for setting up, running, and deploying the SpecDocManager application.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Common Issues](#common-issues)
- [Application Usage](#application-usage)

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Git**: For cloning the repository

### Verify Prerequisites

```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
git --version   # Any recent version
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/RajGoyyal/SpecDocManager.git
cd SpecDocManager
```

### 2. Install Dependencies

```bash
# Install root dependencies (required for backend)
npm install --legacy-peer-deps

# Install Angular client dependencies
cd client-angular
npm install
cd ..
```

**Note**: The `--legacy-peer-deps` flag is required due to dependency version conflicts in the root package.json. This is a known issue and does not affect functionality.

### 3. Build and Start

#### Development Mode (Recommended for Development)

```bash
# Option 1: Start both API and client with hot reload
npm run dev

# Option 2: Start services separately
# Terminal 1 - API Server
npm run dev:api

# Terminal 2 - Angular Client
npm run dev:client
```

- **API Server**: http://127.0.0.1:5000
- **Angular Client**: http://localhost:4200 (with API proxy)

#### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm start
```

- **Application**: http://127.0.0.1:5000

## Development Setup

### Project Structure

```
SpecDocManager/
├── client-angular/          # Angular 18.2 frontend
│   ├── src/app/pages/      # Main page components
│   ├── src/app/services/   # Frontend services
│   └── src/app/components/ # Reusable components
├── server/                 # Express.js backend
│   ├── index.ts           # Main server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # In-memory data storage
├── shared/                # Shared TypeScript schemas
└── docs/                  # Documentation and screenshots
```

### Development Commands

```bash
# Install dependencies
npm install --legacy-peer-deps    # Root dependencies
cd client-angular && npm install  # Angular dependencies

# Build commands
npm run build:client              # Build Angular client only
npm run build                     # Build complete application

# Development servers
npm run dev:api                   # Start API server only
npm run dev:client                # Start Angular dev server only
npm run dev                       # Start both concurrently

# Production
npm start                         # Start production server

# Type checking
npm run check                     # TypeScript type checking
```

### Development Tips

1. **Hot Reload**: Both API and client support hot reload in development mode
2. **API Proxy**: Angular dev server proxies `/api/*` requests to the Express server
3. **TypeScript**: Full TypeScript support with shared schemas
4. **Error Handling**: Comprehensive error handling on both frontend and backend

## Production Deployment

### Build Process

1. **Build Angular Client**:
   ```bash
   npm run build:client
   ```
   - Creates optimized bundles in `client-angular/dist/`
   - Build time: ~12 seconds

2. **Critical Step - Fix Index File**:
   ```bash
   cp client-angular/dist/client-angular/browser/index.csr.html client-angular/dist/client-angular/browser/index.html
   ```
   **This step is crucial!** Without it, the production server will return 404 errors.

3. **Build Server**:
   ```bash
   npm run build
   ```
   - Bundles Express server with ESBuild
   - Creates `dist/index.js`

### Deployment Options

#### Local Production

```bash
npm run build
npm start
```

#### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --production

COPY client-angular/package*.json ./client-angular/
WORKDIR /app/client-angular
RUN npm install --production

WORKDIR /app
COPY . .
RUN npm run build
RUN cp client-angular/dist/client-angular/browser/index.csr.html client-angular/dist/client-angular/browser/index.html

EXPOSE 5000
CMD ["npm", "start"]
```

#### Cloud Deployment

The application can be deployed to:

- **Heroku**: Add `heroku-postbuild` script to package.json
- **AWS/Azure/GCP**: Use PM2 or similar process manager
- **Vercel/Netlify**: Configure for Node.js applications

### Environment Configuration

The application uses environment-based configuration:

```bash
# Development
NODE_ENV=development

# Production  
NODE_ENV=production
```

## Common Issues

### Build Issues

#### CSS Budget Warning

**Issue**: Angular build shows CSS budget exceeded warning
```
angular:styles/component exceeded maximum budget
```

**Solution**: Increase budget in `client-angular/angular.json`:
```json
"budgets": [
  {
    "type": "anyComponentStyle",
    "maximumWarning": "20kB",
    "maximumError": "30kB"
  }
]
```

#### Legacy Peer Dependencies

**Issue**: npm install fails with peer dependency errors

**Solution**: Always use `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

### Runtime Issues

#### 404 Errors in Production

**Issue**: Production server returns 404 for all routes

**Cause**: Missing index.html file

**Solution**: Copy the index file after build:
```bash
cp client-angular/dist/client-angular/browser/index.csr.html client-angular/dist/client-angular/browser/index.html
```

#### Port Already in Use

**Issue**: Error: listen EADDRINUSE :::5000

**Solution**: Kill existing process or use different port:
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or set different port
PORT=3000 npm start
```

### Performance Issues

#### Slow Build Times

- Angular build takes ~12 seconds (normal)
- Use development configuration for faster builds:
  ```bash
  cd client-angular
  npx ng build --configuration development
  ```

#### Memory Issues

- Minimum 512MB RAM recommended
- For large datasets, consider implementing pagination

## Application Usage

### Main Features

1. **Project Dashboard**: View and manage all projects
2. **Project Creation**: Create new projects with templates
3. **Project Details**: Comprehensive project requirement management
4. **FRS Generation**: Generate Functional Requirement Specifications

### User Interface

#### Main Dashboard
![Main Dashboard](docs/images/main_dashboard.png)

Features:
- Project overview with status indicators
- Search and filtering capabilities
- Project statistics
- Quick project creation

#### Project Detail View
![Project Detail](docs/images/project_detail_basic_info.png)

Features:
- Navigation sidebar with all project sections
- Form-based data entry with validation
- Auto-save functionality
- Progress tracking

#### Requirements Management
![What We Need](docs/images/project_what_we_need.png)

Features:
- Structured requirement gathering
- Multiple requirement categories
- Rich text support
- Comprehensive form validation

### Navigation Flow

1. **Start**: Main dashboard shows all projects
2. **Create**: Click "✨ New Project" to create new project
3. **Edit**: Click on any project to view/edit details
4. **Sections**: Use sidebar navigation to move between sections:
   - 📝 Basic Info: Project metadata
   - 🎯 What We Need: Requirements and goals
   - 🗂️ Data Fields: Custom field definitions
   - 👥 Stakeholders: Team member management
   - ⚡ Features: Feature specifications
   - 📖 User Stories: User story management
   - 🔄 Workflows: Process definitions
   - ✅ Success Criteria: Testing and validation
   - 📥 Download: Document generation

### Data Management

- **Storage**: In-memory storage for development/demo
- **Sample Data**: 4 sample projects included
- **Auto-save**: Forms save automatically
- **Version Control**: Activity logging for all changes

## Support

### Getting Help

1. **Documentation**: Review this guide and PROJECT_REPORT.md
2. **Issues**: Check existing GitHub issues
3. **Code**: Review the source code for implementation details

### Contributing

1. Fork the repository
2. Create a feature branch
3. Follow existing code patterns
4. Test your changes thoroughly
5. Submit a pull request

---

**Last Updated**: September 2024  
**Version**: 1.0.0  
**License**: MIT