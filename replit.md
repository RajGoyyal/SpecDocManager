# Overview

This is a comprehensive Functional Requirements Specification (FRS) Manager application built with a full-stack TypeScript architecture. The system allows users to create, manage, and generate professional requirement documents for software projects. It features a modern React frontend with shadcn/ui components, an Express.js backend, and PostgreSQL database with Drizzle ORM for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Auto-save**: Custom hook implementation with debounced saving

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured route handlers
- **Data Validation**: Zod schemas for input validation
- **Error Handling**: Centralized error middleware
- **Development**: Hot reload with tsx and development middleware

## Data Storage Architecture
- **Database**: PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive relational schema supporting projects, stakeholders, milestones, requirements, data fields, features, and activity logs
- **Migrations**: Drizzle Kit for database migrations and schema management

## Component Structure
- **Layout Components**: Sidebar navigation, project header, and right sidebar for activity tracking
- **Tab System**: Multi-tab interface for different aspects of requirement management (Basic Info, What We Need, Data Fields, Features, Success Criteria, Download)
- **Form Components**: Reusable form components for stakeholders, features, and data fields
- **UI Components**: Complete shadcn/ui component library implementation

## Key Features
- **Project Management**: Create and manage multiple FRS projects
- **Stakeholder Management**: Track project stakeholders with roles and types
- **Requirements Specification**: Comprehensive requirement capture including scope, assumptions, dependencies
- **Data Field Definition**: Define data structures with validation rules and UI control types
- **Feature Management**: Functional and non-functional feature specification with priorities
- **Success Criteria**: Define metrics, testing plans, and quality requirements
- **Document Generation**: Export to HTML and Word formats
- **Activity Logging**: Track all project changes and updates
- **Version Control**: Project versioning system
- **Auto-save**: Automatic saving of form data with debouncing

# External Dependencies

## Database
- **Neon Database**: Serverless PostgreSQL database service
- **Connection**: Uses `@neondatabase/serverless` for database connectivity
- **Session Storage**: `connect-pg-simple` for PostgreSQL session storage

## UI Libraries
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Carousel component for UI interactions
- **Class Variance Authority**: Utility for managing component variants
- **cmdk**: Command palette component

## Development Tools
- **Vite**: Build tool with React plugin and runtime error overlay
- **TypeScript**: Type checking and compilation
- **ESLint/Prettier**: Code formatting and linting
- **Drizzle Kit**: Database schema management and migrations

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **clsx**: Conditional className utility
- **zod**: Runtime type validation and schema definition

## Third-party Services
- **Replit Integration**: Development environment integration with cartographer plugin
- **Font Loading**: Google Fonts integration for Inter, Architects Daughter, DM Sans, Fira Code, and Geist Mono