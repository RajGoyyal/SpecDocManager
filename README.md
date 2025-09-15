# SpecDocManager (Angular + Express)

A comprehensive web application for managing software specification documents with advanced project management capabilities.

## 📋 Project Documentation

- **[Executive Summary](./EXECUTIVE_SUMMARY.md)** - Quick overview of project status and achievements
- **[Comprehensive Project Report](./PROJECT_REPORT.md)** - Detailed analysis of features, architecture, and roadmap
- **[Setup Guide](./SETUP_GUIDE.md)** - Complete setup, deployment, and troubleshooting guide

## 🚀 Quick Start

### Development
- **API**: `npm run dev` (serves on http://127.0.0.1:5000)
- **Client**: `cd client-angular; npm start` (http://localhost:4200, /api proxied)

### Production
- **Build**: `cd client-angular; npm run build`
- **Start**: `npm run start` (Express serves Angular dist)

## 🏗️ Architecture
- **Frontend**: Angular 18.2 with TypeScript and Signals
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Features**: Project management, stakeholder tracking, document generation

## 📈 Current Status
Production ready with 30+ API endpoints, comprehensive UI components, and full accessibility compliance.

## Notes
- Previous React/Vite client has been removed
- New Angular frontend provides enhanced functionality and better user experience