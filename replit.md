# Automation Template Marketplace

## Overview

This is a full-stack e-commerce marketplace for selling automation templates. The platform enables users to browse, purchase, and download digital automation templates with features including user authentication, shopping cart, wishlist, Razorpay payment integration, and order management. The application follows a conversion-focused design with a sophisticated black and white aesthetic inspired by Gumroad, Stripe, and Linear.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: Zustand with persistence middleware for cart, wishlist, and auth stores
- **Data Fetching**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **UI Components**: Shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **Session Management**: express-session with MemoryStore
- **Authentication**: Custom email/password auth with bcrypt password hashing
- **OTP System**: 6-digit codes for email verification and password recovery

### Database Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-kit for migrations
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Schema Validation**: Zod with drizzle-zod integration

### API Structure
- `/api/auth/*` - Authentication endpoints (register, login, verify-email, forgot-password, reset-password)
- `/api/products/*` - Product catalog endpoints (list, featured, categories, single product)
- `/api/orders/*` - Order management (create, verify payment, history)
- `/api/user/*` - User profile and settings

### Key Design Patterns
- **Monorepo Structure**: Client (`client/`), Server (`server/`), Shared (`shared/`)
- **Path Aliases**: `@/` for client source, `@shared/` for shared modules
- **Storage Abstraction**: `server/storage.ts` provides a unified interface for all database operations
- **Type Safety**: Shared types between frontend and backend via `shared/schema.ts`

## External Dependencies

### Payment Processing
- **Razorpay**: Payment gateway integration for cards, UPI, wallets, and net banking
- Environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- Database schema is pushed using `drizzle-kit push`

### Email Services
- **Nodemailer**: Email delivery for OTP codes, order confirmations, and notifications
- Configured for transactional emails (verification, password reset, order receipts)

### Session Storage
- **MemoryStore**: In-memory session storage (development)
- Session secret via `SESSION_SECRET` environment variable

### File Storage
- **Uppy**: Client-side file upload handling with AWS S3 integration support
- Template files delivered via secure download links after purchase

### Development Tools
- **Replit Plugins**: vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner
- **TypeScript**: Strict mode enabled with bundler module resolution