# Inventory Management System (InvenSmart)

## Overview

InvenSmart is a full-stack inventory management application built with React frontend and Express.js backend. The system provides comprehensive functionality for managing products, inventory, movements, and generating reports. It features a modern UI built with shadcn/ui components and uses PostgreSQL with Drizzle ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL
- **Session Management**: PostgreSQL sessions with connect-pg-simple
- **API Design**: RESTful API structure with proper error handling
- **Validation**: Zod schemas shared between frontend and backend
- **Storage**: Dual implementation with in-memory storage for development and database for production

### Database Schema
The system uses four main entities:
- **Products**: Core product information with categories and stock levels
- **Inventory**: Product inventory tracking with units and status
- **Movements**: Stock movement history (entrada/salida/ajuste)
- **Reports**: Generated reports with date ranges and JSON data storage

### Key Design Patterns
- **Shared Schema**: Type-safe communication using shared Zod schemas between client and server
- **Repository Pattern**: Abstract storage interface allowing multiple implementations
- **Component Composition**: Modular UI components with proper separation of concerns
- **Form Validation**: Client-side validation with server-side verification
- **Error Handling**: Centralized error handling with user-friendly messages

### Development Features
- **Hot Module Replacement**: Vite development server with runtime error overlay
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Path Aliases**: Clean import paths using TypeScript path mapping
- **Development Tools**: Replit-specific tooling and debugging support

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database toolkit for schema management and queries
- **Session Store**: PostgreSQL-based session storage for user authentication

### UI Framework
- **Radix UI**: Comprehensive set of accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Chart library for analytics and reporting visualizations

### Development Tools
- **Vite**: Fast build tool and development server
- **ESBuild**: Fast JavaScript/TypeScript bundler for production builds
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form validation and state management
- **Zod**: TypeScript-first schema validation library

### Build and Deployment
- **Node.js**: Runtime environment with ES modules support
- **TypeScript**: Static type checking and compilation
- **PostCSS**: CSS processing with Tailwind CSS integration
- **Replit Integration**: Platform-specific plugins and development tools