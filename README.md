# Sweety Shop

A full-stack sweets shop with a NestJS + Prisma backend and a Vite + React + Tailwind frontend. Includes JWT auth, role-based admin tools, inventory, purchasing, and a candy-inspired pink/orange/brown theme with floating animations.

## Features
- User registration/login with JWT and seeded admin (`admin@sweety.com`).
- Role-based admin panel to add/update/delete/restock sweets.
- Sweet search, filtering, purchase flow, cart, and purchase history.
- Prisma/PostgreSQL schema with seed data for popular sweets.
- Responsive UI with warm gradients, glass cards, and floating ambient glows.

## Project Structure
- Backend: [backend/](backend/) (NestJS, Prisma, PostgreSQL)
- Frontend: [frontend/](frontend/) (React, Vite, Tailwind, Radix UI)

## Prerequisites
- Node.js 18+
- PostgreSQL (or another DB supported by Prisma; update `DATABASE_URL` accordingly)

## Backend Setup (NestJS + Prisma)
1. Install deps:
   ```bash
   cd backend/backend
   npm install
   ```
2. Configure env (`backend/backend/.env`):
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/postgres?schema=public"
   JWT_SECRET=super-secret
   FRONTEND_URL=http://localhost:5173
   ADMIN_DEFAULT_PASSWORD=Admin@123
   ```
3. Migrate & generate client (also seeds admin + sample sweets):
   ```bash
   npx prisma migrate dev --name init
   ```
4. Run dev server:
   ```bash
   npm run start:dev
   ```
   API served at `http://localhost:3000/api`.

## Frontend Setup (Vite + React)
1. Install deps:
   ```bash
   cd frontend
   npm install
   ```
2. Env (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
   App at `http://localhost:5173`.

## Key Scripts
- Backend: `npm run start:dev`, `npm run build`, `npx prisma migrate dev`, `npx prisma generate`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## Screenshots
Add real captures to the `screenshots/` folder (not committed here):
- Home: `![Home](screenshots/home.png)`
- Shop: `![Shop](screenshots/shop.png)`
- Admin: `![Admin](screenshots/admin.png)`
- Purchases: `![Purchases](screenshots/purchases.png)`

## My AI Usage
- Tools used: GitHub Copilot (ChatGPT, model: GPT-5.1-Codex-Max).
- How I used them: drafted REST/Prisma adjustments, rewired frontend hooks to the new API, refined theme/styling, and authored this README/test summary.
- Reflection: AI accelerated boilerplate/auth wiring and UI polish, but I still reviewed schemas, ensured migrations aligned, and validated test outputs; human oversight remained key for data modeling and environment steps.

## Test Report
Command run (backend):
```bash
cd backend/backend
npm run test -- --passWithNoTests
```
Result (14 Dec 2025): **Failing** — 4 suites failed, 1 passed. Failures are dependency-injection setup gaps in existing specs (JwtService and Prisma/SweetsService not provided in test modules). See console excerpt:
- AuthService specs: `Nest can't resolve dependencies ... JwtService`.
- AuthController/Sweets specs: missing service providers.

Next steps: add JwtModule to test modules, mock PrismaService/SweetsService, or adjust tests to use TestingModule imports from the real modules.

## Notes
- Seeded admin: `admin@sweety.com` with `ADMIN_DEFAULT_PASSWORD`.
- If you change the schema, rerun `npx prisma migrate dev` and `npx prisma generate`.
- Frontend theme uses custom utilities in [frontend/src/index.css](frontend/src/index.css).
