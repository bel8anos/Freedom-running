# Freedom Running

Freedom Running is a simple web app to discover running races in Greece, register for them, and manage everything from an admin area. This is a final university project focused on clean UX and basic full‑stack functionality.

## Features

- Browse races with dates, location, and details
- Email/password sign up and sign in
- Personal dashboard and profile management
- Register for races and track status
- Contact form for messages
- Admin: create/edit races, manage registrations and results

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- MongoDB + Mongoose
- Custom JWT auth with bcrypt

## Quick Start

1) Install dependencies
```bash
npm install
```

2) Create `.env.local`
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
MONGODB_URI=mongodb://localhost:27017/freedom-running
JWT_SECRET=your-jwt-secret-key
ADMIN_EMAILS=admin@example.com
```

3) Run the app
```bash
npm run dev
```
Open http://localhost:3000

## Folders

```
src/
  app/         # Routes (public, auth, admin, api)
  components/  # UI and feature components
  lib/         # DB, queries, utils, auth
  models/      # Mongoose models
  types/       # Shared types
  hooks/       # Custom hooks
public/        # Images and assets
```

## Notes for Reviewers

- Admin access is based on `ADMIN_EMAILS` in the environment variables.
- The goal is to demonstrate full‑stack fundamentals: routing, forms, CRUD, auth, and MongoDB.

## License

For academic use as part of a university project.


