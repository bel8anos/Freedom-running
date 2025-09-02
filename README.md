# Freedom Running 

A simple web app to explore running races in Greece, register for them, and manage everything from an admin panel. Built with Next.js, TypeScript, Tailwind, and MongoDB.

## What you can do

- Browse races and see details (dates, location, description)
- **Sign up and create an account** with email/password authentication
- **Log in to access personalized features**
- **View your personal dashboard** with race registrations and profile
- **Manage your user profile** and account settings
- Register for races (with basic status tracking)
- Contact the organizers via a contact form
- Admins can create/edit races, manage registrations and results

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- **Custom JWT-based authentication system**
- **bcrypt for password hashing**
- MongoDB + Mongoose

## Getting started

1) Clone and install
```bash
git clone https://github.com/nijoe1/freedom-running-thanos.git
cd freedom-running-thanos
npm install
```

2) Environment variables (create `.env.local`)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=mongodb://localhost:27017/freedom-running
ADMIN_EMAILS=admin1@example.com,admin2@example.com
JWT_SECRET=your-jwt-secret-key
```

3) Run it
```bash
npm run dev
```
Open http://localhost:3000

## Project structure 

```
src/
  app/                 # Pages (App Router)
    admin/             # Admin dashboard (races, registrations, results)
    races/             # Public races list and details
    api/               # API routes (auth, races, registrations, contact)
    about/             # About page
    auth/              # Sign in/up pages with error handling
    dashboard/         # User dashboard (protected route)
    profile/           # User profile management (protected route)
  components/          # UI + feature components (home, race, admin, ui/*)
  lib/                 # DB connection, queries, utils, custom auth system
  models/              # Mongoose models (User, Race, Registration, Contact)
  types/               # Shared TypeScript types
  hooks/               # Custom hooks (useAuth for authentication)
public/                # Images (race photos, icons)
```

## Authentication Features

### User Registration & Sign Up
- **Complete sign-up system** with email/password validation
- Password confirmation and strength requirements
- Duplicate email prevention
- Automatic redirect to sign-in after successful registration

### User Authentication
- **Custom JWT-based authentication** system
- Secure password hashing with bcrypt
- Session management with automatic token refresh
- Protected routes for dashboard and profile pages

### User Management
- **Personal dashboard** showing user's race registrations
- **User profile page** for account management
- Role-based access control (user/admin)
- Secure session handling

## Notable endpoints

- `api/auth/register` – **User registration with validation**
- `api/auth/signin` – **User authentication and login**
- `api/auth/signout` – **User logout and session cleanup**
- `api/auth/session` – **Get current user session**
- `api/races` – CRUD for races
- `api/registrations` – CRUD for registrations
- `api/contact` – receives contact form submissions



## Deploy

- Easiest on Vercel: connect the GitHub repo, set env vars, deploy
- **Ensure JWT_SECRET is set in production environment**


