# Gym Management System

A full-stack Kanban-based gym subscriber management system built with the MERN stack (MongoDB, Express, React, Node.js).
Live Demo: https://gym-kanban.vercel.app/

### Kanban Lifecycle

Subscribers move through seven membership stages:

1. New / Paid
2. Onboarding
3. Active
4. On Hold / Frozen
5. Expiring Soon
6. Renewal Due
7. Expired

 ## Project Overview

The original project requirement was to develop a Kanban-style
view for managing paid gym subscribers across their membership
lifecycle.

This implementation extends that requirement into a complete
gym management system with subscriber management, membership
plans, trainers, payments, attendance, reports, settings, and
authentication.

## Features

- **Dashboard (Kanban Board)** — drag-and-drop subscriber management across 7 membership lifecycle stages, with search, filtering, and sorting
- **Subscribers** — full CRUD, auto-detection of expiring/expired memberships
- **Plans** — manage membership plan offerings
- **Trainers** — manage gym trainers
- **Payments** — record and track subscriber payments, linked to real subscriber records
- **Attendance** — session-based check-in system (Morning/Afternoon/Evening/Night) with duplicate protection
- **Reports** — summary dashboard: subscriber breakdown, revenue by plan, today's attendance, recent payments
- **Settings** — gym info and configurable "Expiring Soon" threshold
- **Authentication** — single-admin login, JWT-based, all pages and API routes protected

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, dnd-kit, axios
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs

## Project Structure
gym-kanban/
├── backend/
│ ├── config/ # Database connection
│ ├── controllers/ # Request handlers
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API route definitions
│ ├── middleware/ # Auth + error handling
│ └── server.js
│
└── frontend/
└── src/
├── components/ # Reusable UI components
├── pages/ # Route-level pages
├── services/ # API call functions
├── context/ # Auth context
└── utils/ # Shared helper functions


## Setup Instructions

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas account (or local MongoDB instance)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_random_secret_string


Start the backend:
```bash
npm run dev
```
Server runs at `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`.

### 3. Create the Admin Account (one-time)

Since this app requires login, you must create the single admin account once, using a tool like Postman:
POST http://localhost:5000/api/auth/setup
Content-Type: application/json

{
"email": "your-email@example.com",
"password": "your-password"
}

This endpoint can only be used once. After that, log in normally through the app's login page using these credentials.

## API Overview

| Resource | Base Route |
|---|---|
| Auth | `/api/auth` |
| Subscribers | `/api/subscribers` |
| Plans | `/api/plans` |
| Trainers | `/api/trainers` |
| Payments | `/api/payments` |
| Attendance | `/api/attendance` |
| Settings | `/api/settings` |

All routes except `/api/auth/login` and `/api/auth/setup` require a valid JWT (sent as `Authorization: Bearer <token>`).


## Key Design Decisions

- **Auto vs. manual status:** "Expiring Soon" and "Expired" are calculated automatically from expiry date *only* while a subscriber is still in an early stage (New / Onboarding / Active / On Hold). Once a subscriber reaches Expiring Soon, Renewal Due, or Expired, staff have full manual control via drag-and-drop — the system won't fight their decisions.
- **Soft references on delete:** Deleting a subscriber does not delete their historical Payment/Attendance records. Those remain for record-keeping, displayed with a "Deleted subscriber" label, matching real-world audit-trail expectations.
- **Days Remaining is computed, not stored:** calculated live from `expiryDate` on every render, so it's always accurate without needing background jobs to keep it in sync.

## Known Limitations

- **Single shared admin account:** there's no per-user data isolation — anyone with the login sees and edits the same live data. Suitable for a small gym's single front-desk workflow, not multi-branch/multi-staff separation.
- **No real-time sync:** changes made by one logged-in session aren't pushed live to another open session; a refresh or navigation is needed to see updates made elsewhere.
- **Free-tier hosting:** the backend (Render free tier) spins down after ~15 minutes of inactivity, causing a one-time delay on the next request.

