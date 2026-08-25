# Gym Management System

A full-stack Kanban-based gym subscriber management system built with the MERN stack (MongoDB, Express, React, Node.js).

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

## Notes

- Membership statuses "Expiring Soon" and "Expired" are automatically assigned based on expiry date for subscribers still in an early lifecycle stage (New/Onboarding/Active/On Hold); staff can freely move subscribers once they reach Expiring Soon/Renewal Due/Expired.
- Deleting a subscriber does not delete their historical Payment/Attendance records — those remain for record-keeping, shown with a "Deleted subscriber" label.
